"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

/**
 * Árvore de Métricas — Visualização Hierárquica de Métricas de Pagamento
 *
 * Exibe a hierarquia completa de métricas de pagamento como uma árvore
 * interativa e colapsável. "Taxa de Sucesso de Pagamento" é a métrica raiz,
 * ramificando-se em sub-árvores de Autorização, Conversão, Fraude e
 * Liquidação. Cada nó mostra um valor atual simulado, um benchmark do setor,
 * um indicador de tendência e as funcionalidades que o afetam.
 */

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface MetricNode {
  id: string;
  name: string;
  value: number;
  unit: string;
  benchmark: number;
  trend: "up" | "down" | "flat";
  trendDelta: number;
  affectedFeatures: string[];
  children?: MetricNode[];
}

/* -------------------------------------------------------------------------- */
/*                           Mock Metrics Data                                */
/* -------------------------------------------------------------------------- */

const METRICS_TREE: MetricNode = {
  id: "payment-success",
  name: "Taxa de Sucesso de Pagamento",
  value: 87.3,
  unit: "%",
  benchmark: 92.0,
  trend: "up",
  trendDelta: 1.2,
  affectedFeatures: [
    "Smart Routing",
    "Lógica de Retentativa",
    "Tokens de Rede",
    "3DS2",
  ],
  children: [
    {
      id: "authorization-rate",
      name: "Taxa de Autorização",
      value: 89.5,
      unit: "%",
      benchmark: 94.0,
      trend: "up",
      trendDelta: 0.8,
      affectedFeatures: ["Smart Routing", "Otimização de BIN", "Lógica de Retentativa"],
      children: [
        {
          id: "issuer-approval",
          name: "Taxa de Aprovação do Emissor",
          value: 91.2,
          unit: "%",
          benchmark: 95.0,
          trend: "up",
          trendDelta: 0.5,
          affectedFeatures: [
            "Tokens de Rede",
            "Atualizador de Conta",
            "Roteamento por BIN",
          ],
        },
        {
          id: "network-success",
          name: "Taxa de Sucesso de Rede",
          value: 98.7,
          unit: "%",
          benchmark: 99.5,
          trend: "flat",
          trendDelta: 0.0,
          affectedFeatures: [
            "Multi-Rede",
            "Roteamento de Failover",
            "Otimização de Rede",
          ],
        },
        {
          id: "retry-success",
          name: "Taxa de Sucesso de Retentativa",
          value: 34.5,
          unit: "%",
          benchmark: 45.0,
          trend: "up",
          trendDelta: 3.2,
          affectedFeatures: [
            "Retentativa Inteligente",
            "Recuperação de Recusas",
            "Roteamento em Cascata",
          ],
        },
      ],
    },
    {
      id: "conversion-rate",
      name: "Taxa de Conversão",
      value: 72.1,
      unit: "%",
      benchmark: 78.0,
      trend: "down",
      trendDelta: -1.5,
      affectedFeatures: [
        "UX de Checkout",
        "Mix de Métodos de Pagamento",
        "Otimização 3DS",
      ],
      children: [
        {
          id: "checkout-completion",
          name: "Conclusão de Checkout",
          value: 81.3,
          unit: "%",
          benchmark: 85.0,
          trend: "down",
          trendDelta: -2.1,
          affectedFeatures: [
            "Checkout em Um Clique",
            "Cartões Salvos",
            "Checkout como Convidado",
          ],
        },
        {
          id: "auth-success",
          name: "Sucesso de Autenticação",
          value: 88.9,
          unit: "%",
          benchmark: 93.0,
          trend: "up",
          trendDelta: 1.0,
          affectedFeatures: [
            "3DS2",
            "Autenticação Frictionless",
            "Autenticação Biométrica",
          ],
        },
        {
          id: "pm-availability",
          name: "Disponibilidade de Métodos de Pagamento",
          value: 96.5,
          unit: "%",
          benchmark: 99.0,
          trend: "flat",
          trendDelta: 0.1,
          affectedFeatures: [
            "Suporte Multi-Método",
            "Métodos de Pagamento Locais",
            "Integração de Carteira Digital",
          ],
        },
      ],
    },
    {
      id: "fraud-rate",
      name: "Taxa de Fraude",
      value: 1.2,
      unit: "%",
      benchmark: 0.5,
      trend: "down",
      trendDelta: -0.3,
      affectedFeatures: [
        "Scoring de Fraude com ML",
        "Device Fingerprint",
        "Controles de Velocidade",
      ],
      children: [
        {
          id: "false-positive",
          name: "Taxa de Falso Positivo",
          value: 4.8,
          unit: "%",
          benchmark: 2.0,
          trend: "up",
          trendDelta: 0.5,
          affectedFeatures: [
            "Ajuste de Scoring ML",
            "Fila de Revisão Manual",
            "Lista de Permissões",
          ],
        },
        {
          id: "fraud-detection",
          name: "Taxa de Detecção de Fraude",
          value: 92.3,
          unit: "%",
          benchmark: 95.0,
          trend: "up",
          trendDelta: 1.1,
          affectedFeatures: [
            "Motor de Fraude ML",
            "Motor de Regras",
            "Inteligência de Rede",
          ],
        },
        {
          id: "chargeback-rate",
          name: "Taxa de Chargeback",
          value: 0.6,
          unit: "%",
          benchmark: 0.3,
          trend: "down",
          trendDelta: -0.1,
          affectedFeatures: [
            "Prevenção de Chargeback",
            "RDR/CDRN",
            "Gestão de Disputas",
          ],
        },
      ],
    },
    {
      id: "settlement-rate",
      name: "Taxa de Liquidação",
      value: 99.1,
      unit: "%",
      benchmark: 99.8,
      trend: "flat",
      trendDelta: 0.0,
      affectedFeatures: [
        "Motor de Liquidação",
        "Reconciliação",
        "Gestão de Fundos",
      ],
      children: [
        {
          id: "settlement-success",
          name: "Taxa de Sucesso de Liquidação",
          value: 99.4,
          unit: "%",
          benchmark: 99.9,
          trend: "up",
          trendDelta: 0.1,
          affectedFeatures: [
            "Auto-Liquidação",
            "Liquidação Dividida",
            "Liquidação Multi-Moeda",
          ],
        },
        {
          id: "reconciliation-accuracy",
          name: "Precisão da Reconciliação",
          value: 98.8,
          unit: "%",
          benchmark: 99.7,
          trend: "up",
          trendDelta: 0.3,
          affectedFeatures: [
            "Auto-Reconciliação",
            "Tratamento de Exceções",
            "Motor de Relatórios",
          ],
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

const INVERTED_METRICS = new Set([
  "fraud-rate",
  "false-positive",
  "chargeback-rate",
]);

function getHealthStatus(
  value: number,
  benchmark: number,
  inverted: boolean,
): "good" | "warn" | "bad" {
  const ratio = inverted ? benchmark / value : value / benchmark;
  if (ratio >= 0.98) return "good";
  if (ratio >= 0.9) return "warn";
  return "bad";
}

const STATUS_COLORS = {
  good: { color: "#16a34a", bg: "rgba(22,163,74,0.08)", label: "No alvo" },
  warn: { color: "#d97706", bg: "rgba(217,119,6,0.08)", label: "Atenção" },
  bad: { color: "#dc2626", bg: "rgba(220,38,38,0.08)", label: "Abaixo" },
};

const BRANCH_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  "authorization-rate": { color: "#2563eb", bg: "rgba(37,99,235,0.08)", icon: "🔐" },
  "conversion-rate": { color: "#059669", bg: "rgba(5,150,105,0.08)", icon: "📈" },
  "fraud-rate": { color: "#dc2626", bg: "rgba(220,38,38,0.08)", icon: "🚨" },
  "settlement-rate": { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", icon: "💰" },
};

/** Flatten tree for search and stats */
function flattenTree(node: MetricNode): MetricNode[] {
  const result: MetricNode[] = [node];
  if (node.children) {
    for (const child of node.children) {
      result.push(...flattenTree(child));
    }
  }
  return result;
}

/* -------------------------------------------------------------------------- */
/*                            Tree Node Component                             */
/* -------------------------------------------------------------------------- */

function TreeNode({
  node,
  depth,
  searchQuery,
  matchIds,
  expandedIds,
  toggleExpanded,
  branchColor,
}: {
  node: MetricNode;
  depth: number;
  searchQuery: string;
  matchIds: Set<string> | null;
  expandedIds: Set<string>;
  toggleExpanded: (id: string) => void;
  branchColor: string;
}) {
  const hasChildren = !!node.children?.length;
  const isExpanded = expandedIds.has(node.id);
  const isInverted = INVERTED_METRICS.has(node.id);
  const status = getHealthStatus(node.value, node.benchmark, isInverted);
  const sc = STATUS_COLORS[status];
  const isSearching = matchIds !== null;
  const isMatch = !matchIds || matchIds.has(node.id);

  const trendArrow = node.trend === "up" ? "↑" : node.trend === "down" ? "↓" : "→";
  const trendColor = node.trend === "flat"
    ? "var(--text-muted)"
    : (node.trend === "up") !== isInverted
      ? "#16a34a"
      : "#dc2626";

  const barPercent = isInverted
    ? Math.min(100, Math.max(5, 100 - (node.value / (node.benchmark * 3)) * 100))
    : Math.min(100, (node.value / node.benchmark) * 100);

  const barGradient = status === "good"
    ? "linear-gradient(90deg, #16a34a, #4ade80)"
    : status === "warn"
      ? "linear-gradient(90deg, #d97706, #fbbf24)"
      : "linear-gradient(90deg, #dc2626, #f87171)";

  return (
    <div style={{ opacity: isSearching && !isMatch ? 0.3 : 1, transition: "opacity 0.2s" }}>
      {/* Node card */}
      <div
        className="card-flat"
        style={{
          padding: "14px 16px",
          marginBottom: 8,
          borderLeft: `3px solid ${depth === 0 ? "var(--primary)" : branchColor}`,
          cursor: hasChildren ? "pointer" : "default",
          transition: "all 0.2s ease",
        }}
        onClick={hasChildren ? () => toggleExpanded(node.id) : undefined}
      >
        {/* Row 1: Name + Value + Trend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            {hasChildren && (
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
                  background: "var(--surface-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  flexShrink: 0,
                  transition: "transform 0.2s ease",
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0)",
                }}
              >
                ▶
              </span>
            )}
            {!hasChildren && <span style={{ width: 22, flexShrink: 0 }} />}
            <span style={{ fontSize: 14, fontWeight: 600 }}>{node.name}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Current value */}
            <span style={{ fontSize: 18, fontWeight: 800, color: sc.color }}>
              {node.value}{node.unit}
            </span>
            {/* Benchmark */}
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              vs {node.benchmark}{node.unit}
            </span>
            {/* Trend */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: 12,
                fontWeight: 700,
                color: trendColor,
                padding: "2px 8px",
                borderRadius: 6,
                background: `${trendColor}15`,
              }}
            >
              {trendArrow}{" "}
              {node.trendDelta > 0 ? "+" : ""}{node.trendDelta.toFixed(1)}{node.unit}
            </span>
          </div>
        </div>

        {/* Row 2: Health bar */}
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              width: "100%",
              height: 6,
              borderRadius: 9999,
              background: "var(--surface-hover)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${barPercent}%`,
                height: "100%",
                borderRadius: 9999,
                background: barGradient,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        {/* Row 3: Features */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
          {node.affectedFeatures.map((f) => (
            <span
              key={f}
              style={{
                padding: "3px 8px",
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 500,
                background: "var(--surface-hover)",
                color: "var(--text-muted)",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Children with CSS Grid expand/collapse */}
      {hasChildren && (
        <div
          style={{
            display: "grid",
            gridTemplateRows: isExpanded ? "1fr" : "0fr",
            transition: "grid-template-rows 0.3s ease",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div style={{ paddingLeft: depth < 1 ? 24 : 20, paddingTop: 4 }}>
              {node.children!.map((child) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  searchQuery={searchQuery}
                  matchIds={matchIds}
                  expandedIds={expandedIds}
                  toggleExpanded={toggleExpanded}
                  branchColor={branchColor}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Page                                       */
/* -------------------------------------------------------------------------- */

export default function MetricsTreePage() {
  const quiz = getQuizForPage("/diagnostics/metrics-tree");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(["payment-success", "authorization-rate", "conversion-rate", "fraud-rate", "settlement-rate"]),
  );

  const allNodes = useMemo(() => flattenTree(METRICS_TREE), []);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(allNodes.filter((n) => n.children?.length).map((n) => n.id)));
  };
  const collapseAll = () => {
    setExpandedIds(new Set(["payment-success"]));
  };

  /* ---- Search ---- */
  const searchMatchIds = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return null;
    return new Set(
      allNodes
        .filter(
          (n) =>
            n.name.toLowerCase().includes(q) ||
            n.affectedFeatures.some((f) => f.toLowerCase().includes(q)),
        )
        .map((n) => n.id),
    );
  }, [search, allNodes]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    let total = 0;
    let belowBenchmark = 0;
    let trendUp = 0;
    let trendDown = 0;
    for (const n of allNodes) {
      total++;
      const inv = INVERTED_METRICS.has(n.id);
      const ratio = inv ? n.benchmark / n.value : n.value / n.benchmark;
      if (ratio < 0.98) belowBenchmark++;
      if (n.trend === "up") trendUp++;
      if (n.trend === "down") trendDown++;
    }
    return { total, belowBenchmark, trendUp, trendDown };
  }, [allNodes]);

  const root = METRICS_TREE;
  const rootStatus = getHealthStatus(root.value, root.benchmark, false);
  const rootSc = STATUS_COLORS[rootStatus];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* ================================================================== */}
      {/*  PAGE HEADER                                                       */}
      {/* ================================================================== */}
      <div className="page-header animate-fade-in" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(135deg, #8b5cf6 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            🌳
          </div>
          <div>
            <h1 className="page-title">Árvore de Métricas</h1>
          </div>
        </div>
        <p className="page-description" style={{ marginTop: 4 }}>
          Visão hierárquica de {stats.total} métricas de pagamento. Explore como
          cada sub-métrica contribui para o desempenho geral.
        </p>
      </div>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>Hierarquia de KPIs de pagamentos</li>
          <li>Taxa de autorização como métrica raiz</li>
          <li>Como métricas se relacionam em cascata</li>
        </ul>
      </div>

      {/* ================================================================== */}
      {/*  ROOT HEALTH SCORE + STATS                                         */}
      {/* ================================================================== */}
      <div
        className="animate-fade-in stagger-1"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {/* Root metric — bigger card */}
        <div
          className="stat-card"
          style={{
            padding: "20px 16px",
            borderTop: `3px solid ${rootSc.color}`,
            gridColumn: "span 1",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: rootSc.color,
              marginBottom: 6,
            }}
          >
            Health Score
          </div>
          <div className="metric-value" style={{ fontSize: 32 }}>
            {root.value}{root.unit}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            vs {root.benchmark}{root.unit} benchmark
          </div>
        </div>

        {/* Stats cards */}
        <div className="stat-card" style={{ padding: "20px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
            Total
          </div>
          <div className="metric-value" style={{ fontSize: 28 }}>{stats.total}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>métricas</div>
        </div>

        <div className="stat-card" style={{ padding: "20px 16px", borderTop: "3px solid #dc2626" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
            Abaixo
          </div>
          <div className="metric-value" style={{ fontSize: 28 }}>{stats.belowBenchmark}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>do benchmark</div>
        </div>

        <div className="stat-card" style={{ padding: "20px 16px", borderTop: "3px solid #16a34a" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
            Melhorando
          </div>
          <div className="metric-value" style={{ fontSize: 28 }}>{stats.trendUp}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>tendência ↑</div>
        </div>

        <div className="stat-card" style={{ padding: "20px 16px", borderTop: "3px solid #d97706" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
            Piorando
          </div>
          <div className="metric-value" style={{ fontSize: 28 }}>{stats.trendDown}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>tendência ↓</div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: -12, marginBottom: 12, fontStyle: "italic" }}>
        * Esses números podem ter sofrido alteração com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* ================================================================== */}
      {/*  BRANCH SUMMARY CARDS                                              */}
      {/* ================================================================== */}
      <div
        className="animate-fade-in stagger-2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {root.children!.map((branch) => {
          const inv = INVERTED_METRICS.has(branch.id);
          const st = getHealthStatus(branch.value, branch.benchmark, inv);
          const sc = STATUS_COLORS[st];
          const bc = BRANCH_COLORS[branch.id] || { color: "var(--primary)", bg: "rgba(37,99,235,0.08)", icon: "📊" };

          return (
            <div
              key={branch.id}
              className="card-flat"
              style={{
                padding: "14px 16px",
                borderLeft: `3px solid ${bc.color}`,
                cursor: "pointer",
              }}
              onClick={() => {
                const el = document.getElementById(`branch-${branch.id}`);
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{bc.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: bc.color }}>{branch.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: sc.color }}>
                  {branch.value}{branch.unit}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  / {branch.benchmark}{branch.unit}
                </span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  width: "100%",
                  height: 4,
                  borderRadius: 9999,
                  background: "var(--surface-hover)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${inv ? Math.min(100, Math.max(5, 100 - (branch.value / (branch.benchmark * 3)) * 100)) : Math.min(100, (branch.value / branch.benchmark) * 100)}%`,
                    height: "100%",
                    borderRadius: 9999,
                    background: sc.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/*  SEARCH + CONTROLS                                                 */}
      {/* ================================================================== */}
      <div
        className="animate-fade-in stagger-3"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Pesquisar métricas ou features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 38px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
              fontSize: 13,
              outline: "none",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} /> No alvo
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#d97706" }} /> Atenção
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#dc2626" }} /> Abaixo
          </span>
        </div>

        {/* Expand / Collapse all */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={expandAll}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
              cursor: "pointer",
            }}
          >
            Expandir
          </button>
          <button
            onClick={collapseAll}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
              cursor: "pointer",
            }}
          >
            Recolher
          </button>
        </div>
      </div>

      {/* Search results count */}
      {searchMatchIds && (
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          {searchMatchIds.size} métrica{searchMatchIds.size !== 1 ? "s" : ""} encontrada
          {searchMatchIds.size !== 1 ? "s" : ""} para &ldquo;{search}&rdquo;
        </div>
      )}

      {/* ================================================================== */}
      {/*  METRICS TREE                                                      */}
      {/* ================================================================== */}
      <div className="animate-fade-in stagger-4" style={{ marginBottom: 40 }}>
        {/* Root node */}
        <TreeNode
          node={METRICS_TREE}
          depth={0}
          searchQuery={search}
          matchIds={searchMatchIds}
          expandedIds={expandedIds}
          toggleExpanded={toggleExpanded}
          branchColor="var(--primary)"
        />

        {/* Branch subtrees with IDs for scroll targeting */}
        {root.children!.map((branch) => {
          const bc = BRANCH_COLORS[branch.id] || { color: "var(--primary)", icon: "📊" };
          return (
            <div key={branch.id} id={`branch-${branch.id}`}>
              <TreeNode
                node={branch}
                depth={0}
                searchQuery={search}
                matchIds={searchMatchIds}
                expandedIds={expandedIds}
                toggleExpanded={toggleExpanded}
                branchColor={bc.color}
              />
            </div>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/*  FOOTER                                                            */}
      {/* ================================================================== */}
      <div style={{ marginTop: 32 }}>
        <div className="divider-text" style={{ marginBottom: 20 }}>
          Páginas Relacionadas
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            {
              title: "Conta Comigo",
              desc: "Diagnostique problemas e receba soluções personalizadas",
              href: "/diagnostics/conta-comigo",
              icon: "🩺",
              gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            },
            {
              title: "Biblioteca de Problemas",
              desc: "Catálogo de problemas de pagamento com causas-raiz",
              href: "/diagnostics/problem-library",
              icon: "📚",
              gradient: "linear-gradient(135deg, #dc2626 0%, #d97706 100%)",
            },
            {
              title: "Simulador",
              desc: "Simule o impacto de features na sua stack de pagamento",
              href: "/simulation/payment-simulator",
              icon: "🧪",
              gradient: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
            },
          ].map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="card-flat interactive-hover"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "16px 14px",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: page.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {page.icon}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{page.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>{page.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
            🧠 Teste seu Conhecimento
          </h2>
          <PageQuiz
            questions={quiz.questions}
            xpPerQuestion={5}
            onComplete={(correct, total) => {
              recordQuiz(quiz.pageRoute, correct, total);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}

      <div style={{ height: 40 }} />
    </div>
  );
}
