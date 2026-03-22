"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import {
  ecosystemLayers,
  knowledgeGraphConnections,
  getTotalPlayers,
  getTotalCategories,
} from "@/data/ecosystem-players";

/**
 * Mapa do Ecossistema — Global Payments & Fintech Ecosystem.
 *
 * Organiza players reais em 5 camadas de infraestrutura:
 *   Merchants -> Payment Platforms -> Payment Infrastructure ->
 *   Financial Infrastructure -> Blockchain Infrastructure
 *
 * Inclui busca, filtro por camada/categoria, knowledge graph e navegacao.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STAT_COLORS = [
  { from: "#6366f1", to: "#818cf8" },
  { from: "#2563eb", to: "#60a5fa" },
  { from: "#059669", to: "#34d399" },
  { from: "#d97706", to: "#fbbf24" },
];

const LAYER_DESCRIPTIONS: Record<string, string> = {
  merchants:
    "O ponto de partida: empresas que vendem produtos e servicos e precisam aceitar pagamentos dos consumidores finais.",
  "payment-platforms":
    "A camada de integracao: PSPs, gateways, carteiras digitais e BNPL que conectam merchants ao sistema financeiro.",
  "payment-infra":
    "Os trilhos: redes de cartao, adquirentes, pagamentos em tempo real e plataformas de fraude que movimentam o dinheiro.",
  "financial-infra":
    "A base: bancos emissores, core banking e sistemas de liquidacao que sustentam todo o ecossistema.",
  "blockchain-infra":
    "A nova fronteira: exchanges, stablecoins, blockchains e protocolos DeFi que criam alternativas descentralizadas.",
};

const GRAPH_GROUPS = [
  {
    key: "processes",
    title: "Processa pagamentos via",
    icon: "🏪",
    description: "Merchants enviam transacoes para PSPs e processadores",
    color: "#6366f1",
    filter: (r: string) => r === "processes_payments_via" || r === "accepts",
  },
  {
    key: "routes",
    title: "Roteia atraves de",
    icon: "💎",
    description: "PSPs roteiam transacoes pelas redes de cartao",
    color: "#2563eb",
    filter: (r: string) => r === "routes_through" || r === "acquires_for",
  },
  {
    key: "settles",
    title: "Liquida com",
    icon: "🏛️",
    description: "Redes liquidam fundos com bancos emissores e adquirentes",
    color: "#059669",
    filter: (r: string) => r === "settles_with",
  },
  {
    key: "stablecoin",
    title: "Opera em blockchain",
    icon: "⛓️",
    description: "Stablecoins e protocolos DeFi operam em redes blockchain",
    color: "#7c3aed",
    filter: (r: string) => r === "runs_on" || r === "deployed_on",
  },
  {
    key: "issues",
    title: "Emite stablecoin",
    icon: "🪙",
    description: "Empresas emitem tokens ancorados a moedas fiduciarias",
    color: "#f59e0b",
    filter: (r: string) => r === "issues" || r === "issues_via",
  },
  {
    key: "bridge",
    title: "Ponte Tradicional - Cripto",
    icon: "🌉",
    description: "Conexoes entre o sistema financeiro tradicional e cripto",
    color: "#ec4899",
    filter: (r: string) =>
      r === "settles_in" ||
      r === "enables_payouts_in" ||
      r === "issues_card_via",
  },
];

const TRANSACTION_STEPS = [
  {
    num: 1,
    layer: "Cliente",
    company: "Apple Pay",
    color: "#6366f1",
    role: "O consumidor inicia o pagamento usando sua carteira digital com autenticacao biometrica (Face ID).",
  },
  {
    num: 2,
    layer: "Merchant",
    company: "Shopify",
    color: "#6366f1",
    role: "A loja online recebe o pedido e envia os dados do pagamento ao seu PSP integrado.",
  },
  {
    num: 3,
    layer: "PSP",
    company: "Stripe",
    color: "#2563eb",
    role: "O PSP tokeniza o cartao, verifica fraude (Radar), e roteia a transacao para a rede de cartao.",
  },
  {
    num: 4,
    layer: "Rede",
    company: "Visa",
    color: "#059669",
    role: "A rede de cartao roteia a autorizacao entre o adquirente e o banco emissor em milissegundos.",
  },
  {
    num: 5,
    layer: "Adquirente",
    company: "Fiserv",
    color: "#059669",
    role: "O adquirente processa a transacao e garante que o merchant receba os fundos na liquidacao.",
  },
  {
    num: 6,
    layer: "Emissor",
    company: "JPMorgan",
    color: "#d97706",
    role: "O banco emissor verifica o saldo/credito do cliente e aprova ou recusa a transacao.",
  },
  {
    num: 7,
    layer: "Liquidacao",
    company: "Fedwire",
    color: "#d97706",
    role: "O sistema de liquidacao transfere os fundos finais entre os bancos, completando o ciclo.",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EcosystemMapPage() {
  const [search, setSearch] = useState("");
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const quiz = getQuizForPage("/explore/ecosystem-map");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => {
      // Start with first category of each layer expanded
      const initial = new Set<string>();
      ecosystemLayers.forEach((layer) => {
        if (layer.categories.length > 0) {
          initial.add(layer.categories[0].id);
        }
      });
      return initial;
    }
  );
  const [showGraph, setShowGraph] = useState(true);

  // Filter layers/categories/players based on search & active layer
  const filteredLayers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return ecosystemLayers
      .filter((layer) => !activeLayer || layer.id === activeLayer)
      .map((layer) => ({
        ...layer,
        categories: layer.categories
          .map((cat) => ({
            ...cat,
            players: cat.players.filter(
              (p) =>
                !q ||
                p.name.toLowerCase().includes(q) ||
                p.type.toLowerCase().includes(q) ||
                p.keyFeatures.some((f) => f.toLowerCase().includes(q)) ||
                p.regions.some((r) => r.toLowerCase().includes(q))
            ),
          }))
          .filter((cat) => cat.players.length > 0),
      }))
      .filter((layer) => layer.categories.length > 0);
  }, [search, activeLayer]);

  const totalPlayers = getTotalPlayers();
  const totalCategories = getTotalCategories();

  // Count visible players/categories for filter bar
  const visibleStats = useMemo(() => {
    let players = 0;
    let categories = 0;
    filteredLayers.forEach((l) => {
      categories += l.categories.length;
      l.categories.forEach((c) => {
        players += c.players.length;
      });
    });
    return { players, categories };
  }, [filteredLayers]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  // Expand/collapse all categories in a layer
  const expandLayer = (layerId: string) => {
    const layer = ecosystemLayers.find((l) => l.id === layerId);
    if (!layer) return;
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      const allExpanded = layer.categories.every((c) => next.has(c.id));
      layer.categories.forEach((c) => {
        if (allExpanded) next.delete(c.id);
        else next.add(c.id);
      });
      return next;
    });
  };

  // Check if all categories in a layer are expanded
  const isLayerFullyExpanded = (layerId: string) => {
    const layer = ecosystemLayers.find((l) => l.id === layerId);
    if (!layer) return false;
    return layer.categories.every((c) => expandedCategories.has(c.id));
  };

  // Get active layer data
  const activeLayerData = activeLayer
    ? ecosystemLayers.find((l) => l.id === activeLayer)
    : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* ================================================================= */}
      {/* SECTION 1: HEADER + STATS                                         */}
      {/* ================================================================= */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Mapa do Ecossistema
        </h1>
        <p className="page-description">
          O ecossistema global de pagamentos e fintech — {totalPlayers} players
          organizados em {ecosystemLayers.length} camadas e {totalCategories}{" "}
          categorias. De merchants a blockchain, explore como as pecas se
          conectam.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "var(--primary)",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          O que voce vai aprender
        </p>
        <ul>
          <li>Os principais players do ecossistema de pagamentos</li>
          <li>Diferenca entre adquirente, sub-adquirente e PSP</li>
          <li>Como fintechs e bancos interagem</li>
        </ul>
      </div>

      {/* Stats Row */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 animate-fade-in stagger-1"
        style={{ gap: "1rem", marginBottom: "2rem" }}
      >
        {[
          { label: "Camadas", value: ecosystemLayers.length, icon: "📊" },
          { label: "Categorias", value: totalCategories, icon: "📁" },
          { label: "Players", value: totalPlayers, icon: "🏢" },
          {
            label: "Conexoes",
            value: knowledgeGraphConnections.length,
            icon: "🔗",
          },
        ].map((stat, idx) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{ padding: "1.25rem" }}
          >
            <div className="flex items-center" style={{ gap: "0.875rem" }}>
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${STAT_COLORS[idx].from}, ${STAT_COLORS[idx].to})`,
                  fontSize: "1.125rem",
                }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: "1.5rem" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================================================================= */}
      {/* SECTION 2: COMO O ECOSSISTEMA FUNCIONA                            */}
      {/* ================================================================= */}
      <section className="animate-fade-in stagger-2" style={{ marginBottom: "3rem" }}>
        <h2
          className="text-lg font-bold"
          style={{ marginBottom: "0.5rem" }}
        >
          Como o Ecossistema Funciona
        </h2>
        <p
          className="text-sm text-[var(--text-muted)]"
          style={{ marginBottom: "1.25rem" }}
        >
          O ecossistema de pagamentos se organiza em 5 camadas — do consumidor
          final ate a infraestrutura de liquidacao. Clique em uma camada para
          filtrar os players abaixo.
        </p>

        <div className="flex flex-col" style={{ gap: "0.75rem" }}>
          {ecosystemLayers.map((layer, idx) => {
            const isActive = activeLayer === layer.id;
            const playerCount = layer.categories.reduce(
              (t, c) => t + c.players.length,
              0
            );
            const exampleNames = layer.categories
              .flatMap((c) => c.players)
              .slice(0, 4)
              .map((p) => p.name);

            return (
              <button
                key={layer.id}
                onClick={() =>
                  setActiveLayer(isActive ? null : layer.id)
                }
                className="text-left transition-all duration-200 rounded-xl"
                style={{
                  padding: "1.25rem 1.5rem",
                  background: isActive
                    ? `linear-gradient(135deg, ${layer.colorFrom}12, ${layer.colorTo}08)`
                    : "var(--surface)",
                  border: isActive
                    ? `1px solid ${layer.colorFrom}40`
                    : "1px solid var(--border)",
                  borderLeft: `5px solid ${layer.colorFrom}`,
                  cursor: "pointer",
                }}
              >
                <div className="flex items-start" style={{ gap: "1rem" }}>
                  {/* Number + icon */}
                  <div
                    className="flex items-center justify-center shrink-0 text-white font-bold"
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "0.75rem",
                      background: `linear-gradient(135deg, ${layer.colorFrom}, ${layer.colorTo})`,
                      fontSize: "1.125rem",
                    }}
                  >
                    {layer.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="flex items-center flex-wrap"
                      style={{ gap: "0.5rem", marginBottom: "0.375rem" }}
                    >
                      <span
                        className="font-bold text-base"
                        style={{
                          color: isActive
                            ? layer.colorFrom
                            : "var(--foreground)",
                        }}
                      >
                        {idx + 1}. {layer.name}
                      </span>
                      <span
                        className="text-xs font-medium rounded-full"
                        style={{
                          padding: "0.125rem 0.625rem",
                          background: `${layer.colorFrom}15`,
                          color: layer.colorFrom,
                          border: `1px solid ${layer.colorFrom}25`,
                        }}
                      >
                        {layer.categories.length} categorias · {playerCount}{" "}
                        players
                      </span>
                      {isActive && (
                        <span
                          className="text-xs font-medium rounded-full"
                          style={{
                            padding: "0.125rem 0.625rem",
                            background: `${layer.colorFrom}20`,
                            color: layer.colorFrom,
                            border: `1px solid ${layer.colorFrom}40`,
                          }}
                        >
                          ✕ Filtrado
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm text-[var(--text-secondary)]"
                      style={{ marginBottom: "0.5rem", lineHeight: 1.5 }}
                    >
                      {LAYER_DESCRIPTIONS[layer.id] || layer.description}
                    </p>
                    <div
                      className="flex items-center flex-wrap"
                      style={{ gap: "0.375rem" }}
                    >
                      <span
                        className="text-xs text-[var(--text-muted)]"
                        style={{ marginRight: "0.25rem" }}
                      >
                        Ex:
                      </span>
                      {exampleNames.map((name) => (
                        <span
                          key={name}
                          className="text-xs font-medium rounded-full"
                          style={{
                            padding: "0.125rem 0.5rem",
                            background: "var(--surface-hover)",
                            border: "1px solid var(--border)",
                            color: "var(--foreground)",
                          }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isActive ? layer.colorFrom : "var(--text-muted)"}
                    strokeWidth="2"
                    className="shrink-0"
                    style={{ marginTop: "0.25rem" }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>

                {/* Downward connector arrow between layers */}
                {idx < ecosystemLayers.length - 1 && (
                  <div
                    className="flex justify-center"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-muted)"
                      strokeWidth="2"
                      style={{ opacity: 0.4 }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ================================================================= */}
      {/* SEARCH BAR                                                        */}
      {/* ================================================================= */}
      <div className="animate-fade-in stagger-3" style={{ marginBottom: "2rem" }}>
        {/* Active filter bar */}
        {(activeLayer || search) && (
          <div
            className="card-flat flex flex-wrap items-center"
            style={{
              padding: "0.75rem 1.25rem",
              marginBottom: "0.75rem",
              gap: "0.5rem",
            }}
          >
            <span className="text-xs text-[var(--text-muted)]">
              Filtros ativos:
            </span>

            {activeLayerData && (
              <button
                onClick={() => setActiveLayer(null)}
                className="flex items-center text-xs font-medium rounded-full transition-colors hover:opacity-80"
                style={{
                  padding: "0.25rem 0.75rem",
                  gap: "0.375rem",
                  background: `linear-gradient(135deg, ${activeLayerData.colorFrom}20, ${activeLayerData.colorTo}20)`,
                  color: activeLayerData.colorFrom,
                  border: `1px solid ${activeLayerData.colorFrom}30`,
                }}
              >
                {activeLayerData.icon} {activeLayerData.name}
                <span style={{ marginLeft: "0.25rem" }}>✕</span>
              </button>
            )}

            {search && (
              <button
                onClick={() => setSearch("")}
                className="flex items-center text-xs font-medium rounded-full transition-colors hover:opacity-80"
                style={{
                  padding: "0.25rem 0.75rem",
                  gap: "0.375rem",
                  background: "var(--surface-hover)",
                  border: "1px solid var(--border)",
                }}
              >
                🔍 &ldquo;{search}&rdquo;
                <span style={{ marginLeft: "0.25rem" }}>✕</span>
              </button>
            )}

            <span
              className="text-xs text-[var(--text-muted)]"
              style={{ marginLeft: "auto" }}
            >
              Mostrando {visibleStats.players} players em{" "}
              {visibleStats.categories} categorias
            </span>
          </div>
        )}

        {/* Search input */}
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar player, tipo, feature ou regiao..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all"
            style={{ padding: "0.75rem 2.5rem 0.75rem 2.5rem" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 3: PLAYERS POR CAMADA                                     */}
      {/* ================================================================= */}
      <div className="flex flex-col" style={{ gap: "3rem" }}>
        {filteredLayers.map((layer) => {
          const layerPlayerCount = layer.categories.reduce(
            (t, c) => t + c.players.length,
            0
          );
          const allExpanded = isLayerFullyExpanded(layer.id);

          return (
            <section key={layer.id} id={`layer-${layer.id}`} className="animate-fade-in">
              {/* Layer header */}
              <div>
                {/* Gradient accent bar */}
                <div
                  style={{
                    height: "3px",
                    borderRadius: "3px",
                    background: `linear-gradient(90deg, ${layer.colorFrom}, ${layer.colorTo})`,
                    marginBottom: "1rem",
                  }}
                />

                <div
                  className="flex items-center"
                  style={{ gap: "0.75rem", marginBottom: "0.5rem" }}
                >
                  {/* Icon circle */}
                  <div
                    className="flex items-center justify-center text-white shrink-0"
                    style={{
                      width: "2.75rem",
                      height: "2.75rem",
                      borderRadius: "0.875rem",
                      background: `linear-gradient(135deg, ${layer.colorFrom}, ${layer.colorTo})`,
                      fontSize: "1.25rem",
                      boxShadow: `0 4px 12px ${layer.colorFrom}30`,
                    }}
                  >
                    {layer.icon}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-bold">{layer.name}</h2>
                  </div>

                  {/* Stats badge */}
                  <span
                    className="badge text-xs hidden sm:flex items-center"
                    style={{ gap: "0.25rem" }}
                  >
                    {layer.categories.length} categorias · {layerPlayerCount}{" "}
                    players
                  </span>

                  {/* Toggle all button */}
                  <button
                    onClick={() => expandLayer(layer.id)}
                    className="text-xs font-medium transition-all rounded-lg border border-[var(--border)] hover:border-[var(--primary)]/30 hover:text-[var(--primary)]"
                    style={{ padding: "0.375rem 0.875rem" }}
                  >
                    {allExpanded ? "Recolher tudo" : "Expandir tudo"}
                  </button>
                </div>

                <p
                  className="text-sm text-[var(--text-muted)]"
                  style={{ marginBottom: "1.25rem", lineHeight: 1.5 }}
                >
                  {layer.description}
                </p>
              </div>

              {/* Categories */}
              <div className="flex flex-col" style={{ gap: "1rem" }}>
                {layer.categories.map((cat) => {
                  const isExpanded = expandedCategories.has(cat.id);
                  return (
                    <div
                      key={cat.id}
                      className="card-glow overflow-hidden"
                      style={{ borderLeft: `4px solid ${cat.color}` }}
                    >
                      {/* Category header (clickable) */}
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="w-full flex items-center text-left hover:bg-[var(--surface-hover)] transition-colors"
                        style={{ gap: "0.75rem", padding: "1rem 1.25rem" }}
                      >
                        <span style={{ fontSize: "1.375rem" }}>
                          {cat.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base">{cat.name}</h3>
                          <p
                            className="text-xs text-[var(--text-muted)]"
                            style={{ marginTop: "0.125rem" }}
                          >
                            {cat.description}
                          </p>
                        </div>
                        <span
                          className="badge-primary text-xs font-medium shrink-0"
                          style={{ padding: "0.25rem 0.625rem" }}
                        >
                          {cat.players.length} players
                        </span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`text-[var(--text-muted)] transition-transform duration-200 shrink-0 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {/* Player cards (expand/collapse) */}
                      <div
                        className="grid transition-all duration-300 ease-in-out"
                        style={{
                          gridTemplateRows: isExpanded ? "1fr" : "0fr",
                        }}
                      >
                        <div className="overflow-hidden">
                          {/* Player cards — full width, 2 col on desktop */}
                          <div
                            className="grid grid-cols-1 md:grid-cols-2"
                            style={{
                              gap: "1rem",
                              padding: "1rem 1.25rem 1.25rem 1.25rem",
                            }}
                          >
                            {cat.players.map((player, pidx) => (
                              <div
                                key={player.id}
                                className="rounded-xl transition-all duration-200"
                                style={{
                                  padding: "1.25rem",
                                  background: "var(--surface)",
                                  border: "1px solid var(--border)",
                                  borderLeft: `4px solid ${cat.color}`,
                                  animationDelay: `${pidx * 40}ms`,
                                }}
                              >
                                {/* Name + Type badge */}
                                <div
                                  className="flex items-start flex-wrap"
                                  style={{
                                    gap: "0.5rem",
                                    marginBottom: "0.75rem",
                                  }}
                                >
                                  <h4
                                    className="font-bold"
                                    style={{ fontSize: "1rem" }}
                                  >
                                    {player.name}
                                  </h4>
                                  <span
                                    className="text-xs font-medium rounded-full"
                                    style={{
                                      padding: "0.125rem 0.625rem",
                                      background: `${cat.color}12`,
                                      color: cat.color,
                                      border: `1px solid ${cat.color}30`,
                                    }}
                                  >
                                    {player.type}
                                  </span>
                                </div>

                                {/* Key Features as pills */}
                                <div style={{ marginBottom: "0.75rem" }}>
                                  <div
                                    className="flex flex-wrap"
                                    style={{ gap: "0.375rem" }}
                                  >
                                    {player.keyFeatures.map((f) => (
                                      <span
                                        key={f}
                                        className="text-xs rounded-full"
                                        style={{
                                          padding: "0.25rem 0.625rem",
                                          background: "var(--surface-hover)",
                                          border: "1px solid var(--border)",
                                          color: "var(--foreground)",
                                        }}
                                      >
                                        {f}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Regions */}
                                <div
                                  className="flex flex-wrap items-center"
                                  style={{ gap: "0.375rem" }}
                                >
                                  <span
                                    className="text-xs text-[var(--text-muted)]"
                                    style={{ marginRight: "0.125rem" }}
                                  >
                                    🌍
                                  </span>
                                  {player.regions.map((r) => (
                                    <span
                                      key={r}
                                      className="text-xs rounded-full"
                                      style={{
                                        padding: "0.125rem 0.5rem",
                                        background: `${cat.color}08`,
                                        border: `1px solid ${cat.color}20`,
                                        color: "var(--text-secondary)",
                                      }}
                                    >
                                      {r}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredLayers.length === 0 && (
        <div
          className="text-center text-[var(--text-muted)]"
          style={{ padding: "4rem 0" }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
            🔍
          </div>
          <p className="text-sm">
            Nenhum player encontrado para &ldquo;{search}&rdquo;
            {activeLayer && " nesta camada"}.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveLayer(null);
            }}
            className="text-sm text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors"
            style={{ marginTop: "0.75rem" }}
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* SECTION 4: KNOWLEDGE GRAPH — Como as Empresas se Conectam         */}
      {/* ================================================================= */}
      <section
        className="animate-fade-in stagger-4"
        style={{ marginTop: "3rem", marginBottom: "3rem" }}
      >
        {/* Section header with toggle */}
        <div
          className="flex items-center"
          style={{
            marginBottom: showGraph ? "1rem" : "0",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>🔗</span>
          <div className="flex-1">
            <h2 className="font-bold text-lg">
              Como as Empresas se Conectam
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {knowledgeGraphConnections.length} relacoes mapeadas entre
              empresas, redes e protocolos — agrupadas por tipo de conexao
            </p>
          </div>
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="text-xs font-medium rounded-lg border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all"
            style={{ padding: "0.375rem 0.875rem" }}
          >
            {showGraph ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {/* Graph grouped by connection type */}
        {showGraph && (
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: "1rem" }}
          >
            {GRAPH_GROUPS.map((group) => {
              const connections = knowledgeGraphConnections.filter((c) =>
                group.filter(c.relationship)
              );
              if (connections.length === 0) return null;

              return (
                <div
                  key={group.key}
                  className="rounded-xl"
                  style={{
                    padding: "1.25rem",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderLeft: `4px solid ${group.color}`,
                  }}
                >
                  {/* Group header */}
                  <div
                    className="flex items-center"
                    style={{
                      gap: "0.5rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span style={{ fontSize: "1.125rem" }}>
                      {group.icon}
                    </span>
                    <h3
                      className="font-bold text-sm"
                      style={{ color: group.color }}
                    >
                      {group.title}
                    </h3>
                  </div>
                  <p
                    className="text-xs text-[var(--text-muted)]"
                    style={{ marginBottom: "1rem" }}
                  >
                    {group.description}
                  </p>

                  {/* Connections list */}
                  <div
                    className="flex flex-col"
                    style={{ gap: "0.625rem" }}
                  >
                    {connections.map((conn, i) => (
                      <div
                        key={i}
                        className="rounded-lg"
                        style={{
                          padding: "0.625rem 0.75rem",
                          background: "var(--surface-hover)",
                        }}
                      >
                        <div
                          className="flex items-center"
                          style={{ gap: "0.5rem", marginBottom: "0.25rem" }}
                        >
                          <span className="font-semibold text-sm text-[var(--foreground)]">
                            {conn.from}
                          </span>
                          <span
                            style={{
                              color: group.color,
                              fontWeight: 700,
                            }}
                          >
                            →
                          </span>
                          <span className="font-semibold text-sm text-[var(--primary)]">
                            {conn.to}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          {conn.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================================================================= */}
      {/* SECTION 5: FLUXO DE UMA TRANSACAO                                 */}
      {/* ================================================================= */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          className="text-lg font-bold flex items-center"
          style={{ gap: "0.5rem", marginBottom: "0.375rem" }}
        >
          <span>⚡</span>
          Exemplo: Fluxo Completo de uma Transacao
        </h2>
        <p
          className="text-sm text-[var(--text-muted)]"
          style={{ marginBottom: "1.5rem", lineHeight: 1.5 }}
        >
          Uma unica transacao de pagamento atravessa multiplas camadas do
          ecossistema. Veja o que acontece em cada etapa:
        </p>

        {/* Desktop: horizontal flow / Mobile: vertical flow */}
        <div
          className="flex flex-col"
          style={{ gap: "0" }}
        >
          {TRANSACTION_STEPS.map((step, i) => (
            <div key={step.num}>
              <div
                className="flex items-start rounded-xl"
                style={{
                  padding: "1.25rem",
                  gap: "1rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderLeft: `4px solid ${step.color}`,
                }}
              >
                {/* Numbered circle */}
                <div
                  className="flex items-center justify-center shrink-0 text-white font-bold"
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    background: step.color,
                    fontSize: "0.875rem",
                  }}
                >
                  {step.num}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div
                    className="flex items-center flex-wrap"
                    style={{ gap: "0.5rem", marginBottom: "0.375rem" }}
                  >
                    <span className="font-bold text-sm">
                      {step.layer}
                    </span>
                    <span
                      className="text-xs font-medium rounded-full"
                      style={{
                        padding: "0.125rem 0.625rem",
                        background: `${step.color}15`,
                        color: step.color,
                        border: `1px solid ${step.color}30`,
                      }}
                    >
                      {step.company}
                    </span>
                  </div>
                  <p
                    className="text-sm text-[var(--text-secondary)]"
                    style={{ lineHeight: 1.5 }}
                  >
                    {step.role}
                  </p>
                </div>
              </div>

              {/* Connector arrow between steps */}
              {i < TRANSACTION_STEPS.length - 1 && (
                <div
                  className="flex justify-center"
                  style={{ padding: "0.25rem 0" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={step.color}
                    strokeWidth="2"
                    style={{ opacity: 0.5 }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 6: EXPLORE MAIS                                           */}
      {/* ================================================================= */}
      <div
        className="card-glow animate-fade-in"
        style={{ marginBottom: "2rem", padding: "1.5rem" }}
      >
        <h3 className="font-bold" style={{ marginBottom: "0.875rem" }}>
          Explore mais no Atlas
        </h3>
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{ gap: "0.75rem" }}
        >
          {[
            {
              name: "Sistema Financeiro Global",
              href: "/explore/financial-system",
              icon: "🌍",
            },
            {
              name: "Trilhos de Pagamento",
              href: "/explore/payment-rails",
              icon: "🛤️",
            },
            {
              name: "Mapa Blockchain",
              href: "/crypto/blockchain-map",
              icon: "🔗",
            },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center rounded-xl bg-[var(--surface-hover)] hover:bg-[var(--surface-active)] transition-colors group"
              style={{ gap: "0.625rem", padding: "0.875rem" }}
            >
              <span style={{ fontSize: "1.125rem" }}>{link.icon}</span>
              <span className="text-sm font-medium group-hover:text-[var(--primary)] transition-colors">
                {link.name}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform"
                style={{ marginLeft: "auto" }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* SECTION 7: QUIZ                                                   */}
      {/* ================================================================= */}
      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "var(--foreground)",
            }}
          >
            Teste seu Conhecimento
          </h2>
          <PageQuiz
            questions={quiz.questions}
            onComplete={(correct, total, xpEarned) => {
              recordQuiz(quiz.pageRoute, correct, total, xpEarned);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
