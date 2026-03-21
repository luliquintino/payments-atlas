"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Layer, GraphNode, GraphEdge } from "@/data/types";
import { LAYER_LABELS, LAYER_NODE_COLORS } from "@/data/types";
import {
  findShortestPath,
  getTransitiveDeps,
  getTransitiveDependents,
} from "@/lib/graph-utils";

/**
 * Grafo de Dependências — Seção de Conhecimento
 *
 * Representação visual das dependências entre features de pagamento.
 * Features são exibidas como nós posicionados em um canvas SVG com
 * linhas de conexão desenhadas entre eles.
 *
 * Funcionalidades:
 * - Busca por nome de nó com destaque
 * - Filtro por camada (chips clicáveis)
 * - Seleção de nó com destaque de conexões
 * - Busca de caminho mais curto (shift+clique)
 * - Modo de impacto transitivo (dependências recursivas)
 * - Duplo clique navega para detalhe da feature
 */

// ---------------------------------------------------------------------------
// Dados do grafo
// ---------------------------------------------------------------------------

const NODES: GraphNode[] = [
  // Camada Experience (linha superior)
  { id: "3ds", label: "3D Secure", layer: "experience", x: 150, y: 60 },
  { id: "apm", label: "Meios Alternativos", layer: "experience", x: 420, y: 60 },
  { id: "webhooks", label: "Webhooks", layer: "experience", x: 680, y: 60 },
  { id: "idempotency", label: "Idempotência", layer: "experience", x: 920, y: 60 },

  // Camada Orchestration (segunda linha)
  { id: "smart-routing", label: "Smart Routing", layer: "orchestration", x: 150, y: 200 },
  { id: "retry-logic", label: "Retry Logic", layer: "orchestration", x: 420, y: 200 },
  { id: "cascading", label: "Cascading", layer: "orchestration", x: 680, y: 200 },
  { id: "recurring", label: "Recurring Billing", layer: "orchestration", x: 920, y: 200 },

  // Camada Processing (terceira linha)
  { id: "bin-lookup", label: "BIN Lookup", layer: "processing", x: 150, y: 340 },
  { id: "fraud-scoring", label: "Fraud Scoring", layer: "processing", x: 420, y: 340 },
  { id: "velocity", label: "Velocity Checks", layer: "processing", x: 680, y: 340 },
  { id: "pci-vault", label: "PCI Vault", layer: "processing", x: 920, y: 340 },

  // Camada Network (quarta linha)
  { id: "network-token", label: "Network Tokenization", layer: "network", x: 250, y: 480 },
  { id: "account-updater", label: "Account Updater", layer: "network", x: 550, y: 480 },
  { id: "token-lifecycle", label: "Token Lifecycle Mgmt", layer: "network", x: 830, y: 480 },

  // Camada Banking (quinta linha)
  { id: "real-time-auth", label: "Real-Time Auth", layer: "banking", x: 250, y: 600 },
  { id: "kyc", label: "Verificação KYC", layer: "banking", x: 600, y: 600 },

  // Camada Settlement (inferior)
  { id: "chargeback", label: "Gestão de Chargeback", layer: "settlement", x: 200, y: 720 },
  { id: "reconciliation", label: "Conciliação", layer: "settlement", x: 500, y: 720 },
  { id: "interchange-opt", label: "Otim. Interchange", layer: "settlement", x: 800, y: 720 },
];

const EDGES: GraphEdge[] = [
  { from: "smart-routing", to: "bin-lookup", relationship: "Usa dados BIN para determinar rota ideal" },
  { from: "3ds", to: "pci-vault", relationship: "Requer dados tokenizados do cartão para autenticação" },
  { from: "3ds", to: "fraud-scoring", relationship: "Score de risco determina desafio 3DS vs. sem fricção" },
  { from: "retry-logic", to: "smart-routing", relationship: "Retentativas usam smart routing para caminhos alternativos" },
  { from: "cascading", to: "retry-logic", relationship: "Cascading é uma forma de retentativa cross-adquirente" },
  { from: "cascading", to: "smart-routing", relationship: "Usa motor de roteamento para selecionar adquirente de backup" },
  { from: "fraud-scoring", to: "velocity", relationship: "Verificações de velocidade alimentam cálculo do score de fraude" },
  { from: "fraud-scoring", to: "bin-lookup", relationship: "Dados BIN enriquecem features do modelo de fraude" },
  { from: "network-token", to: "pci-vault", relationship: "Network tokens substituem tokens do vault para bandeiras" },
  { from: "account-updater", to: "network-token", relationship: "Atualiza network tokens quando cartões mudam" },
  { from: "token-lifecycle", to: "network-token", relationship: "Gerencia provisionamento e revogação de tokens" },
  { from: "recurring", to: "account-updater", relationship: "Mantém credenciais armazenadas atualizadas para assinaturas" },
  { from: "recurring", to: "retry-logic", relationship: "Cobranças de assinatura falhas acionam retentativas" },
  { from: "recurring", to: "pci-vault", relationship: "Dados de cartão armazenados recuperados do vault" },
  { from: "chargeback", to: "reconciliation", relationship: "Chargebacks requerem ajustes de liquidação" },
  { from: "interchange-opt", to: "bin-lookup", relationship: "BIN determina faixa de qualificação de interchange" },
  { from: "real-time-auth", to: "network-token", relationship: "Usa network tokens para requisições de autorização" },
  { from: "apm", to: "smart-routing", relationship: "APMs roteados pela camada de orquestração" },
  { from: "webhooks", to: "idempotency", relationship: "Retentativas de webhook usam idempotência para prevenir duplicatas" },
  { from: "kyc", to: "fraud-scoring", relationship: "Dados KYC enriquecem modelos de risco de fraude" },
];

// ---------------------------------------------------------------------------
// Mapeamento de IDs do grafo → IDs de rota de feature
// ---------------------------------------------------------------------------

const GRAPH_ID_TO_FEATURE_ID: Record<string, string> = {
  "3ds": "3d-secure",
  "apm": "apm-integration",
  "webhooks": "webhooks",
  "idempotency": "idempotency",
  "smart-routing": "smart-routing",
  "retry-logic": "retry-logic",
  "cascading": "cascading",
  "recurring": "recurring-billing",
  "bin-lookup": "bin-lookup",
  "fraud-scoring": "fraud-scoring",
  "velocity": "velocity-checks",
  "pci-vault": "pci-vault",
  "network-token": "network-tokenization",
  "account-updater": "account-updater",
  "token-lifecycle": "network-tokens-lifecycle",
  "real-time-auth": "real-time-auth",
  "kyc": "kyc-verification",
  "chargeback": "chargeback-management",
  "reconciliation": "settlement-reconciliation",
  "interchange-opt": "interchange-optimization",
};

/** Retorna a URL da página de detalhe da feature para um ID de nó do grafo */
function featureUrl(graphNodeId: string): string {
  const featureId = GRAPH_ID_TO_FEATURE_ID[graphNodeId] ?? graphNodeId;
  return `/knowledge/features/${featureId}`;
}

// ---------------------------------------------------------------------------
// Constantes visuais
// ---------------------------------------------------------------------------

const NODE_WIDTH = 160;
const NODE_HEIGHT = 44;
const CANVAS_WIDTH = 1100;
const CANVAS_HEIGHT = 800;

const ALL_LAYERS: Layer[] = [
  "experience",
  "orchestration",
  "processing",
  "network",
  "banking",
  "settlement",
];

/** Calcula o ponto central de um nó para desenho de arestas */
function nodeCenter(node: GraphNode): { cx: number; cy: number } {
  return { cx: node.x + NODE_WIDTH / 2, cy: node.y + NODE_HEIGHT / 2 };
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function DependencyGraphPage() {
  const router = useRouter();

  // Estado principal
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenLayers, setHiddenLayers] = useState<Set<Layer>>(new Set());

  // Path-finding
  const [pathStart, setPathStart] = useState<string | null>(null);
  const [pathNodes, setPathNodes] = useState<Set<string>>(new Set());
  const [pathEdges, setPathEdges] = useState<Set<string>>(new Set());

  // Impacto transitivo
  const [transitiveMode, setTransitiveMode] = useState(false);

  /** Mapa de busca de nós */
  const nodeMap = useMemo(
    () => new Map(NODES.map((n) => [n.id, n])),
    [],
  );

  /** Nós filtrados por camada */
  const visibleNodes = useMemo(
    () => NODES.filter((n) => !hiddenLayers.has(n.layer)),
    [hiddenLayers],
  );

  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map((n) => n.id)),
    [visibleNodes],
  );

  /** Arestas visíveis (ambos os nós precisam estar visíveis) */
  const visibleEdges = useMemo(
    () => EDGES.filter((e) => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to)),
    [visibleNodeIds],
  );

  /** IDs dos nós que correspondem à busca */
  const searchMatchIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    return new Set(
      NODES.filter((n) => n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q)).map(
        (n) => n.id,
      ),
    );
  }, [searchQuery]);

  const hasSearch = searchQuery.trim().length > 0;

  /** Para o nó selecionado, encontra dependências e dependentes */
  const { dependencies, dependents } = useMemo(() => {
    if (!selectedNode)
      return { dependencies: new Set<string>(), dependents: new Set<string>() };

    if (transitiveMode) {
      return {
        dependencies: getTransitiveDeps(EDGES, selectedNode),
        dependents: getTransitiveDependents(EDGES, selectedNode),
      };
    }

    const deps = new Set<string>();
    const depnts = new Set<string>();

    EDGES.forEach((e) => {
      if (e.from === selectedNode) deps.add(e.to);
      if (e.to === selectedNode) depnts.add(e.from);
    });

    return { dependencies: deps, dependents: depnts };
  }, [selectedNode, transitiveMode]);

  /** Determina se um nó está destacado */
  const isNodeHighlighted = useCallback(
    (id: string) => {
      // Se há caminho destacado, apenas nós do caminho ficam destacados
      if (pathNodes.size > 0) return pathNodes.has(id);
      // Se há busca ativa, apenas resultados ficam destacados
      if (hasSearch) return searchMatchIds.has(id);
      // Seleção normal
      if (!selectedNode) return true;
      return (
        id === selectedNode ||
        dependencies.has(id) ||
        dependents.has(id)
      );
    },
    [selectedNode, dependencies, dependents, hasSearch, searchMatchIds, pathNodes],
  );

  /** Determina se uma aresta está destacada */
  const isEdgeHighlighted = useCallback(
    (edge: GraphEdge) => {
      // Se há caminho destacado
      if (pathEdges.size > 0) return pathEdges.has(`${edge.from}->${edge.to}`);
      // Busca ativa: sem destaque de aresta
      if (hasSearch) return false;
      // Seleção normal
      if (!selectedNode) return true;
      return edge.from === selectedNode || edge.to === selectedNode;
    },
    [selectedNode, hasSearch, pathEdges],
  );

  /** Verifica se uma aresta faz parte do caminho */
  const isPathEdge = useCallback(
    (edge: GraphEdge) => pathEdges.has(`${edge.from}->${edge.to}`) || pathEdges.has(`${edge.to}->${edge.from}`),
    [pathEdges],
  );

  /** Verifica se um nó corresponde à busca */
  const isSearchMatch = useCallback(
    (id: string) => hasSearch && searchMatchIds.has(id),
    [hasSearch, searchMatchIds],
  );

  /** Manipula clique no nó */
  const handleNodeClick = useCallback(
    (nodeId: string, shiftKey: boolean) => {
      // Shift+clique: path-finding
      if (shiftKey && selectedNode && selectedNode !== nodeId) {
        const path = findShortestPath(EDGES, selectedNode, nodeId);
        if (path.length > 0) {
          setPathNodes(new Set(path));
          // Marcar arestas do caminho
          const edgeSet = new Set<string>();
          for (let i = 0; i < path.length - 1; i++) {
            edgeSet.add(`${path[i]}->${path[i + 1]}`);
            edgeSet.add(`${path[i + 1]}->${path[i]}`);
          }
          setPathEdges(edgeSet);
          setPathStart(selectedNode);
        }
        return;
      }

      // Clique normal: limpar caminho e selecionar
      setPathNodes(new Set());
      setPathEdges(new Set());
      setPathStart(null);
      setSelectedNode(selectedNode === nodeId ? null : nodeId);
    },
    [selectedNode],
  );

  /** Duplo-clique: navegar para detalhe */
  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      router.push(featureUrl(nodeId));
    },
    [router],
  );

  /** Toggle de camada */
  const toggleLayer = useCallback((layer: Layer) => {
    setHiddenLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return next;
    });
  }, []);

  /** Limpar toda a seleção */
  const clearSelection = useCallback(() => {
    setSelectedNode(null);
    setPathNodes(new Set());
    setPathEdges(new Set());
    setPathStart(null);
    setTransitiveMode(false);
  }, []);

  /** Painel de detalhes */
  const selectedNodeData = selectedNode ? nodeMap.get(selectedNode) : null;
  const selectedEdges = EDGES.filter(
    (e) => e.from === selectedNode || e.to === selectedNode,
  );

  return (
    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
      {/* Cabecalho da pagina */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Grafo de Dependências</h1>
        <p className="page-description">
          Mapa visual das dependências entre features de pagamento. Clique em um nó para
          destacar suas conexões. <strong>Shift+clique</strong> em outro nó para ver o caminho
          mais curto. <strong>Duplo-clique</strong> para abrir detalhes da feature.
        </p>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Nos", value: "300+" },
          { label: "Conexoes", value: "500+" },
          { label: "Clusters", value: "8" },
          { label: "Camadas", value: "15" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{s.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem", opacity: 0.7 }}>
        * Numeros podem variar conforme fonte e data de consulta. Valores aproximados para fins didaticos.
      </p>

      {/* Barra de ferramentas */}
      <div className="animate-fade-in stagger-2" style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Busca */}
        <div className="flex flex-wrap items-center" style={{ gap: "0.75rem" }}>
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute -translate-y-1/2"
              style={{ left: "0.75rem", top: "50%", color: "var(--text-muted)" }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar feature..."
              className="w-full text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
              style={{ paddingLeft: "2.25rem", paddingRight: "0.75rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer"
                style={{ right: "0.5rem", top: "50%" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {hasSearch && searchMatchIds.size > 0 && (
            <span className="text-xs text-[var(--text-muted)]">
              {searchMatchIds.size} resultado{searchMatchIds.size !== 1 ? "s" : ""}
            </span>
          )}
          {hasSearch && searchMatchIds.size === 0 && (
            <span className="text-xs text-[var(--text-muted)]">
              Nenhum resultado
            </span>
          )}
        </div>

        {/* Filtros de camada + controles */}
        <div className="flex flex-wrap items-center" style={{ gap: "0.5rem" }}>
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider" style={{ marginRight: "0.25rem" }}>
            Camadas:
          </span>
          {ALL_LAYERS.map((layer) => {
            const isHidden = hiddenLayers.has(layer);
            return (
              <button
                key={layer}
                onClick={() => toggleLayer(layer)}
                className="text-xs font-medium rounded-md cursor-pointer transition-all"
                style={{
                  padding: "0.25rem 0.625rem",
                  backgroundColor: isHidden ? "transparent" : LAYER_NODE_COLORS[layer].bg,
                  color: isHidden ? "var(--text-muted)" : LAYER_NODE_COLORS[layer].text,
                  border: `1px solid ${isHidden ? "var(--border)" : LAYER_NODE_COLORS[layer].border}`,
                  opacity: isHidden ? 0.5 : 1,
                  textDecoration: isHidden ? "line-through" : "none",
                }}
                title={isHidden ? `Mostrar camada ${LAYER_LABELS[layer]}` : `Ocultar camada ${LAYER_LABELS[layer]}`}
              >
                {LAYER_LABELS[layer]}
              </button>
            );
          })}

          <span style={{ margin: "0 0.5rem" }} className="text-[var(--border)]">|</span>

          {/* Toggle impacto transitivo */}
          <button
            onClick={() => setTransitiveMode((v) => !v)}
            className="text-xs font-medium rounded-md cursor-pointer transition-all"
            style={{
              padding: "0.25rem 0.625rem",
              backgroundColor: transitiveMode ? "var(--primary)" : "transparent",
              color: transitiveMode ? "#fff" : "var(--text-muted)",
              border: `1px solid ${transitiveMode ? "var(--primary)" : "var(--border)"}`,
            }}
            title={
              transitiveMode
                ? "Desativar impacto transitivo"
                : "Ativar impacto transitivo: mostra todas as dependências recursivas do nó selecionado"
            }
          >
            Impacto Transitivo
          </button>

          {/* Limpar selecao */}
          {(selectedNode || pathNodes.size > 0) && (
            <button
              onClick={clearSelection}
              className="text-xs text-[var(--primary)] hover:underline cursor-pointer"
              style={{ marginLeft: "auto" }}
            >
              Limpar seleção
            </button>
          )}
        </div>

        {/* Indicador de modo caminho */}
        {pathNodes.size > 0 && pathStart && selectedNode && (
          <div className="text-xs rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 inline-flex items-center" style={{ padding: "0.375rem 0.75rem", gap: "0.5rem" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Caminho: {nodeMap.get(pathStart)?.label} → {nodeMap.get(selectedNode)?.label}
            ({pathNodes.size} nós)
          </div>
        )}
      </div>

      <div className="flex flex-col xl:flex-row animate-fade-in stagger-3" style={{ gap: "1rem" }}>
        {/* Canvas do grafo */}
        <div className="flex-1 card-glow overflow-auto">
          <svg
            viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
            className="w-full min-w-[700px]"
            style={{ minHeight: 500 }}
          >
            {/* Definicoes SVG */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
              <marker
                id="arrowhead-path"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#16a34a" />
              </marker>
            </defs>

            {/* Linhas de arestas */}
            {visibleEdges.map((edge) => {
              const fromNode = nodeMap.get(edge.from);
              const toNode = nodeMap.get(edge.to);
              if (!fromNode || !toNode) return null;

              const from = nodeCenter(fromNode);
              const to = nodeCenter(toNode);
              const edgeKey = `${edge.from}->${edge.to}`;
              const highlighted = isEdgeHighlighted(edge);
              const onPath = isPathEdge(edge);
              const isHovered = hoveredEdge === edgeKey;

              return (
                <g
                  key={edgeKey}
                  onMouseEnter={() => setHoveredEdge(edgeKey)}
                  onMouseLeave={() => setHoveredEdge(null)}
                >
                  {/* Linha invisível mais larga para área de hover */}
                  <line
                    x1={from.cx}
                    y1={from.cy}
                    x2={to.cx}
                    y2={to.cy}
                    stroke="transparent"
                    strokeWidth={12}
                    style={{ cursor: "pointer" }}
                  />
                  {/* Linha visível */}
                  <line
                    x1={from.cx}
                    y1={from.cy}
                    x2={to.cx}
                    y2={to.cy}
                    stroke={
                      onPath
                        ? "#16a34a"
                        : isHovered
                          ? "#1e3a5f"
                          : highlighted
                            ? "#94a3b8"
                            : "#e2e8f020"
                    }
                    strokeWidth={onPath ? 3 : isHovered ? 2.5 : highlighted ? 1.5 : 0.8}
                    strokeDasharray={highlighted || onPath ? "none" : "4 4"}
                    markerEnd={onPath ? "url(#arrowhead-path)" : "url(#arrowhead)"}
                    style={{ transition: "all 0.2s" }}
                  />
                  {/* Tooltip de relacionamento no hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={(from.cx + to.cx) / 2 - 140}
                        y={(from.cy + to.cy) / 2 - 28}
                        width={280}
                        height={24}
                        rx={6}
                        fill="#1e293b"
                        opacity={0.95}
                      />
                      <text
                        x={(from.cx + to.cx) / 2}
                        y={(from.cy + to.cy) / 2 - 12}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize={12}
                        fontFamily="system-ui, sans-serif"
                      >
                        {edge.relationship}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nós */}
            {visibleNodes.map((node) => {
              const colors = LAYER_NODE_COLORS[node.layer];
              const highlighted = isNodeHighlighted(node.id);
              const isSelected = selectedNode === node.id;
              const isOnPath = pathNodes.has(node.id);
              const matchesSearch = isSearchMatch(node.id);

              return (
                <g
                  key={node.id}
                  onClick={(e) => handleNodeClick(node.id, e.shiftKey)}
                  onDoubleClick={() => handleNodeDoubleClick(node.id)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Anel de busca */}
                  {matchesSearch && (
                    <rect
                      x={node.x - 4}
                      y={node.y - 4}
                      width={NODE_WIDTH + 8}
                      height={NODE_HEIGHT + 8}
                      rx={13}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      opacity={0.8}
                    >
                      <animate
                        attributeName="opacity"
                        values="0.8;0.4;0.8"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  )}
                  {/* Anel de caminho */}
                  {isOnPath && (
                    <rect
                      x={node.x - 4}
                      y={node.y - 4}
                      width={NODE_WIDTH + 8}
                      height={NODE_HEIGHT + 8}
                      rx={13}
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth={2.5}
                      opacity={0.8}
                    />
                  )}
                  {/* Retângulo do nó */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx={10}
                    fill={highlighted ? colors.bg : "#f1f5f920"}
                    stroke={
                      isOnPath
                        ? "#16a34a"
                        : isSelected
                          ? "#1e3a5f"
                          : colors.border
                    }
                    strokeWidth={isSelected || isOnPath ? 3 : 1.5}
                    opacity={highlighted ? 1 : 0.3}
                    style={{ transition: "all 0.2s" }}
                  />
                  {/* Label do nó */}
                  <text
                    x={node.x + NODE_WIDTH / 2}
                    y={node.y + NODE_HEIGHT / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={highlighted ? colors.text : "#94a3b8"}
                    fontSize={12}
                    fontWeight={isSelected || isOnPath ? 700 : 500}
                    fontFamily="system-ui, sans-serif"
                    style={{ transition: "all 0.2s" }}
                  >
                    {node.label}
                  </text>
                  {/* Anel indicador de seleção */}
                  {isSelected && !isOnPath && (
                    <rect
                      x={node.x - 3}
                      y={node.y - 3}
                      width={NODE_WIDTH + 6}
                      height={NODE_HEIGHT + 6}
                      rx={12}
                      fill="none"
                      stroke="#1e3a5f"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                      opacity={0.6}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Painel de detalhes (exibido quando um nó é selecionado) */}
        {selectedNodeData && (
          <div className="w-full xl:w-80 card-glow self-start animate-fade-in">
            {/* Informações do nó selecionado */}
            <div style={{ marginBottom: "1rem" }}>
              <Link
                href={featureUrl(selectedNodeData.id)}
                className="font-semibold text-lg hover:text-[var(--primary)] transition-colors"
              >
                {selectedNodeData.label}
              </Link>
              <div className="flex items-center" style={{ marginTop: "0.375rem", gap: "0.5rem" }}>
                <span
                  className="text-xs font-medium rounded-md"
                  style={{
                    padding: "0.125rem 0.5rem",
                    backgroundColor: LAYER_NODE_COLORS[selectedNodeData.layer].bg,
                    color: LAYER_NODE_COLORS[selectedNodeData.layer].text,
                    border: `1px solid ${LAYER_NODE_COLORS[selectedNodeData.layer].border}`,
                  }}
                >
                  {LAYER_LABELS[selectedNodeData.layer]}
                </span>
              </div>
              <Link
                href={featureUrl(selectedNodeData.id)}
                className="text-xs text-[var(--primary)] hover:underline inline-block"
                style={{ marginTop: "0.5rem" }}
              >
                Ver detalhes da feature →
              </Link>
            </div>

            {/* Modo transitivo ativo */}
            {transitiveMode && (
              <div className="text-xs rounded-md bg-[var(--primary-lighter)] text-[var(--primary-dark)] border border-[var(--primary-light)]" style={{ marginBottom: "0.75rem", padding: "0.375rem 0.625rem" }}>
                Modo transitivo ativo — mostrando todas as dependências recursivas
              </div>
            )}

            {/* Dica de shift-clique */}
            {!pathNodes.size && (
              <div className="text-xs text-[var(--text-muted)] rounded-md bg-[var(--surface-hover)]" style={{ marginBottom: "0.75rem", padding: "0.375rem 0.625rem" }}>
                Segure <strong>Shift</strong> e clique em outro nó para ver o caminho mais curto
              </div>
            )}

            {/* Dependências (esta feature depende de) */}
            <div style={{ marginBottom: "1rem" }}>
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider" style={{ marginBottom: "0.5rem" }}>
                Depende de ({dependencies.size})
              </h4>
              {dependencies.size === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">Sem dependências</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  {selectedEdges
                    .filter((e) => e.from === selectedNode)
                    .map((e) => {
                      const target = nodeMap.get(e.to);
                      return (
                        <div
                          key={e.to}
                          className="text-sm rounded-lg bg-[var(--surface-hover)]" style={{ padding: "0.5rem" }}
                        >
                          <Link
                            href={featureUrl(e.to)}
                            className="font-medium text-[var(--primary)] hover:underline"
                          >
                            {target?.label}
                          </Link>
                          <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: "0.125rem" }}>
                            {e.relationship}
                          </p>
                        </div>
                      );
                    })}
                  {/* Dependencias transitivas adicionais (sem aresta direta) */}
                  {transitiveMode &&
                    [...dependencies]
                      .filter((depId) => !selectedEdges.some((e) => e.from === selectedNode && e.to === depId))
                      .map((depId) => {
                        const target = nodeMap.get(depId);
                        if (!target) return null;
                        return (
                          <div
                            key={depId}
                            className="text-sm rounded-lg bg-[var(--surface-hover)] border-l-2 border-[var(--primary-light)]" style={{ padding: "0.5rem" }}
                          >
                            <Link
                              href={featureUrl(depId)}
                              className="font-medium text-[var(--primary)] hover:underline"
                            >
                              {target.label}
                            </Link>
                            <p className="text-xs text-[var(--text-muted)] italic" style={{ marginTop: "0.125rem" }}>
                              dependência indireta
                            </p>
                          </div>
                        );
                      })}
                </div>
              )}
            </div>

            {/* Dependentes (features que dependem desta) */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider" style={{ marginBottom: "0.5rem" }}>
                Requerido por ({dependents.size})
              </h4>
              {dependents.size === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">
                  Nenhuma feature depende desta
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  {selectedEdges
                    .filter((e) => e.to === selectedNode)
                    .map((e) => {
                      const source = nodeMap.get(e.from);
                      return (
                        <div
                          key={e.from}
                          className="text-sm rounded-lg bg-[var(--surface-hover)]" style={{ padding: "0.5rem" }}
                        >
                          <Link
                            href={featureUrl(e.from)}
                            className="font-medium text-[var(--primary)] hover:underline"
                          >
                            {source?.label}
                          </Link>
                          <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: "0.125rem" }}>
                            {e.relationship}
                          </p>
                        </div>
                      );
                    })}
                  {/* Dependentes transitivos adicionais */}
                  {transitiveMode &&
                    [...dependents]
                      .filter((depId) => !selectedEdges.some((e) => e.to === selectedNode && e.from === depId))
                      .map((depId) => {
                        const source = nodeMap.get(depId);
                        if (!source) return null;
                        return (
                          <div
                            key={depId}
                            className="text-sm rounded-lg bg-[var(--surface-hover)] border-l-2 border-[var(--primary-light)]" style={{ padding: "0.5rem" }}
                          >
                            <Link
                              href={featureUrl(depId)}
                              className="font-medium text-[var(--primary)] hover:underline"
                            >
                              {source.label}
                            </Link>
                            <p className="text-xs text-[var(--text-muted)] italic" style={{ marginTop: "0.125rem" }}>
                              dependente indireto
                            </p>
                          </div>
                        );
                      })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Barra de estatísticas */}
      <div className="flex flex-wrap text-sm text-[var(--text-muted)] animate-fade-in stagger-4" style={{ marginTop: "1.5rem", gap: "1.5rem" }}>
        <span>
          <strong className="text-[var(--foreground)]">{visibleNodes.length}</strong>{" "}
          {visibleNodes.length < NODES.length
            ? `de ${NODES.length} features visíveis`
            : "features"}
        </span>
        <span>
          <strong className="text-[var(--foreground)]">{visibleEdges.length}</strong>{" "}
          {visibleEdges.length < EDGES.length
            ? `de ${EDGES.length} dependências visíveis`
            : "dependências"}
        </span>
        <span>
          <strong className="text-[var(--foreground)]">
            {ALL_LAYERS.length - hiddenLayers.size}
          </strong>{" "}
          de {ALL_LAYERS.length} camadas
        </span>
      </div>

      {/* Related Pages Footer */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Base de Features", href: "/knowledge/features", icon: "⚡" },
          { name: "Regras de Negocio", href: "/knowledge/business-rules", icon: "📋" },
          { name: "Simulador", href: "/simulator", icon: "🧪" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
