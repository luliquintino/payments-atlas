"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

const GRAPH_GROUP_COLORS: Record<string, string> = {
  "processes_payments_via": "#6366f1",
  "routes_through": "#2563eb",
  "settles_with": "#059669",
  "runs_on": "#f59e0b",
  "issues": "#d97706",
  "deployed_on": "#8b5cf6",
  "bridge": "#ec4899",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EcosystemMapPage() {
  const [search, setSearch] = useState("");
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
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
      {/* HEADER                                                            */}
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

      {/* ================================================================= */}
      {/* STATS — Phase 1                                                   */}
      {/* ================================================================= */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 animate-fade-in stagger-1"
        style={{ gap: "1rem", marginBottom: "2rem" }}
      >
        {[
          { label: "Camadas", value: ecosystemLayers.length, icon: "📊" },
          { label: "Categorias", value: totalCategories, icon: "📁" },
          { label: "Players", value: totalPlayers, icon: "🏢" },
          { label: "Conexoes", value: knowledgeGraphConnections.length, icon: "🔗" },
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

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16, fontStyle: "italic" }}>
        * Números de players e conexões podem variar com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* ================================================================= */}
      {/* LAYER VISUAL STACK — Phase 2                                      */}
      {/* ================================================================= */}
      <div className="animate-fade-in stagger-2" style={{ marginBottom: "2rem" }}>
        <h2
          className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]"
          style={{ marginBottom: "0.75rem" }}
        >
          Camadas da Infraestrutura
        </h2>
        <div
          className="flex flex-col relative"
          style={{ gap: "0.5rem" }}
        >
          {/* Dashed connector line */}
          <div
            className="absolute hidden md:block"
            style={{
              left: "1rem",
              top: "2.75rem",
              bottom: "2.75rem",
              width: "0",
              borderLeft: "2px dashed var(--border)",
              zIndex: 0,
            }}
          />

          {ecosystemLayers.map((layer, idx) => {
            const isActive = activeLayer === layer.id;
            const playerCount = layer.categories.reduce(
              (t, c) => t + c.players.length,
              0
            );
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(isActive ? null : layer.id)}
                className="card-interactive relative flex items-center text-left transition-all duration-200"
                style={{
                  gap: "0.75rem",
                  padding: "0.875rem 1.25rem",
                  borderLeft: `4px solid ${isActive ? layer.colorFrom : "transparent"}`,
                  background: isActive
                    ? `linear-gradient(135deg, ${layer.colorFrom}15, ${layer.colorTo}10)`
                    : undefined,
                  zIndex: 1,
                }}
              >
                {/* Index badge */}
                <span
                  className="flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${layer.colorFrom}, ${layer.colorTo})`,
                  }}
                >
                  {idx + 1}
                </span>
                {/* Icon + Name */}
                <span style={{ fontSize: "1.25rem" }}>{layer.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{layer.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {layer.categories.length} categorias · {playerCount} players
                  </div>
                </div>
                {/* Active indicator / dismiss */}
                {isActive && (
                  <span
                    className="text-xs font-medium rounded-full flex items-center"
                    style={{
                      padding: "0.25rem 0.75rem",
                      gap: "0.375rem",
                      background: `${layer.colorFrom}20`,
                      color: layer.colorFrom,
                      border: `1px solid ${layer.colorFrom}40`,
                    }}
                  >
                    ✕ Filtrado
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* SEARCH BAR — Phase 3                                              */}
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
            <span className="text-xs text-[var(--text-muted)]">Filtros ativos:</span>

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

            <span className="text-xs text-[var(--text-muted)]" style={{ marginLeft: "auto" }}>
              Mostrando {visibleStats.players} players em {visibleStats.categories} categorias
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
      {/* KNOWLEDGE GRAPH — Phase 8                                         */}
      {/* ================================================================= */}
      <div className="animate-fade-in stagger-4" style={{ marginBottom: "2.5rem" }}>
        {/* Section header with toggle */}
        <div
          className="flex items-center"
          style={{ marginBottom: showGraph ? "1rem" : "0", gap: "0.75rem" }}
        >
          <span style={{ fontSize: "1.25rem" }}>🔗</span>
          <div className="flex-1">
            <h3 className="font-bold text-base">Knowledge Graph</h3>
            <p className="text-xs text-[var(--text-muted)]">
              {knowledgeGraphConnections.length} relacoes mapeadas entre empresas, redes e protocolos
            </p>
          </div>
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="text-xs font-medium rounded-lg border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all"
            style={{ padding: "0.375rem 0.875rem" }}
          >
            {showGraph ? "Ocultar ↑" : "Mostrar ↓"}
          </button>
        </div>

        {/* Graph content */}
        {showGraph && (
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: "0.75rem" }}
          >
            {[
              { label: "Merchant → PSP", filter: "processes_payments_via", icon: "🏪→💳" },
              { label: "PSP → Rede", filter: "routes_through", icon: "💳→💎" },
              { label: "Rede → Banco", filter: "settles_with", icon: "💎→🏛️" },
              { label: "Stablecoin → Blockchain", filter: "runs_on", icon: "🪙→⛓️" },
              { label: "Emissor → Stablecoin", filter: "issues", icon: "🏢→🪙" },
              { label: "DeFi → Blockchain", filter: "deployed_on", icon: "🌀→⛓️" },
              { label: "Tradicional ↔ Cripto", filter: "bridge", icon: "🌉" },
            ].map((group) => {
              const connections = knowledgeGraphConnections.filter((c) => {
                if (group.filter === "bridge") {
                  return ["settles_in", "enables_payouts_in", "issues_card_via", "issues_via"].includes(c.relationship);
                }
                return c.relationship === group.filter;
              });
              if (connections.length === 0) return null;

              const groupColor = GRAPH_GROUP_COLORS[group.filter] || "var(--primary)";

              return (
                <div
                  key={group.label}
                  className="rounded-xl"
                  style={{
                    padding: "1rem",
                    background: "var(--surface-hover)",
                    borderLeft: `3px solid ${groupColor}`,
                  }}
                >
                  <div
                    className="text-xs font-bold uppercase tracking-wider flex items-center"
                    style={{
                      color: groupColor,
                      marginBottom: "0.625rem",
                      gap: "0.5rem",
                    }}
                  >
                    <span>{group.icon}</span>
                    {group.label}
                  </div>
                  <div className="flex flex-col" style={{ gap: "0.375rem" }}>
                    {connections.map((conn, i) => (
                      <div
                        key={i}
                        className="flex items-center text-sm"
                        style={{ gap: "0.5rem" }}
                      >
                        <span className="font-semibold text-[var(--foreground)]">{conn.from}</span>
                        <span style={{ color: groupColor }}>→</span>
                        <span className="font-semibold text-[var(--primary)]">{conn.to}</span>
                        <span
                          className="text-xs text-[var(--text-muted)] hidden sm:block"
                          style={{ marginLeft: "auto" }}
                        >
                          {conn.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* LAYERS & CATEGORIES — Phases 4, 5, 6                              */}
      {/* ================================================================= */}
      <div className="flex flex-col" style={{ gap: "2.5rem" }}>
        {filteredLayers.map((layer) => {
          const layerPlayerCount = layer.categories.reduce(
            (t, c) => t + c.players.length,
            0
          );
          const allExpanded = isLayerFullyExpanded(layer.id);

          return (
            <section key={layer.id} className="animate-fade-in">
              {/* ── Layer header — Phase 6 ── */}
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

                <div className="flex items-center" style={{ gap: "0.75rem", marginBottom: "1.5rem" }}>
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
                    <p className="text-xs text-[var(--text-muted)]">
                      {layer.description}
                    </p>
                  </div>

                  {/* Stats badge */}
                  <span
                    className="badge text-xs hidden sm:flex items-center"
                    style={{ gap: "0.25rem" }}
                  >
                    {layer.categories.length} categorias · {layerPlayerCount} players
                  </span>

                  {/* Toggle all button */}
                  <button
                    onClick={() => expandLayer(layer.id)}
                    className="text-xs font-medium transition-all rounded-lg border border-[var(--border)] hover:border-[var(--primary)]/30 hover:text-[var(--primary)]"
                    style={{ padding: "0.375rem 0.875rem" }}
                  >
                    {allExpanded ? "Recolher tudo ↑" : "Expandir tudo ↓"}
                  </button>
                </div>
              </div>

              {/* ── Categories — Phase 4 ── */}
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
                        <span style={{ fontSize: "1.375rem" }}>{cat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base">{cat.name}</h3>
                        </div>
                        <span
                          className="badge-primary text-xs font-medium"
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
                          className={`text-[var(--text-muted)] transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {/* Player grid (expand/collapse) */}
                      <div
                        className="grid transition-all duration-300 ease-in-out"
                        style={{
                          gridTemplateRows: isExpanded ? "1fr" : "0fr",
                        }}
                      >
                        <div className="overflow-hidden">
                          {/* Description inside expanded area */}
                          <p
                            className="text-xs text-[var(--text-muted)]"
                            style={{
                              padding: "0 1.25rem",
                              marginBottom: "0.75rem",
                            }}
                          >
                            {cat.description}
                          </p>

                          {/* Player cards grid — Phase 5 */}
                          <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            style={{
                              gap: "0.875rem",
                              padding: "0 1.25rem 1.25rem 1.25rem",
                            }}
                          >
                            {cat.players.map((player, pidx) => (
                              <div
                                key={player.id}
                                className="card-flat interactive-hover animate-fade-in rounded-xl transition-all duration-200"
                                style={{
                                  padding: "1rem",
                                  borderTop: `3px solid ${cat.color}`,
                                  animationDelay: `${pidx * 40}ms`,
                                }}
                              >
                                {/* Name + Type */}
                                <div style={{ marginBottom: "0.75rem" }}>
                                  <h4 className="text-sm font-bold">
                                    {player.name}
                                  </h4>
                                  <span
                                    className="badge text-[11px] font-medium"
                                    style={{
                                      marginTop: "0.25rem",
                                      display: "inline-block",
                                      background: `${cat.color}15`,
                                      color: cat.color,
                                      border: `1px solid ${cat.color}30`,
                                      padding: "0.125rem 0.5rem",
                                    }}
                                  >
                                    {player.type}
                                  </span>
                                </div>

                                {/* Features as chips */}
                                <div style={{ marginBottom: "0.625rem" }}>
                                  <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                                    {player.keyFeatures.slice(0, 3).map((f) => (
                                      <span
                                        key={f}
                                        className="chip-muted text-[11px]"
                                        style={{ padding: "0.125rem 0.5rem" }}
                                      >
                                        {f}
                                      </span>
                                    ))}
                                    {player.keyFeatures.length > 3 && (
                                      <span
                                        className="text-[11px] text-[var(--text-muted)] font-medium"
                                        style={{ padding: "0.125rem 0.25rem" }}
                                      >
                                        +{player.keyFeatures.length - 3} mais
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Regions */}
                                <div className="flex flex-wrap" style={{ gap: "0.25rem" }}>
                                  {player.regions.map((r) => (
                                    <span
                                      key={r}
                                      className="badge text-[11px]"
                                      style={{
                                        padding: "0.125rem 0.5rem",
                                        background: "var(--surface-hover)",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-muted)",
                                      }}
                                    >
                                      🌍 {r}
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

      {/* ================================================================= */}
      {/* EMPTY STATE                                                       */}
      {/* ================================================================= */}
      {filteredLayers.length === 0 && (
        <div className="text-center text-[var(--text-muted)]" style={{ padding: "4rem 0" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
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
      {/* TRANSACTION FLOW — Phase 7                                        */}
      {/* ================================================================= */}
      <div
        className="card-glow animate-fade-in"
        style={{ marginTop: "2.5rem", padding: "1.5rem" }}
      >
        <h3
          className="font-bold flex items-center"
          style={{ gap: "0.5rem", marginBottom: "0.5rem", fontSize: "1rem" }}
        >
          <span>⚡</span>
          Exemplo: Fluxo de uma Transacao
        </h3>
        <p
          className="text-xs text-[var(--text-muted)]"
          style={{ marginBottom: "1.25rem" }}
        >
          Uma unica transacao atravessa multiplas camadas do ecossistema:
        </p>
        <div
          className="flex flex-wrap items-center"
          style={{ gap: "0.5rem" }}
        >
          {[
            { label: "Cliente", sub: "Apple Pay", color: "#6366f1" },
            { label: "Merchant", sub: "Shopify", color: "#6366f1" },
            { label: "PSP", sub: "Stripe", color: "#2563eb" },
            { label: "Rede", sub: "Visa", color: "#059669" },
            { label: "Adquirente", sub: "Fiserv", color: "#059669" },
            { label: "Emissor", sub: "JPMorgan", color: "#d97706" },
            { label: "Liquidacao", sub: "Fedwire", color: "#d97706" },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center" style={{ gap: "0.5rem" }}>
              <div
                className="rounded-xl text-center relative"
                style={{
                  padding: "0.75rem 1rem",
                  background: "var(--surface-hover)",
                  borderTop: `3px solid ${step.color}`,
                  minWidth: "5rem",
                }}
              >
                {/* Step number */}
                <div
                  className="absolute flex items-center justify-center text-white font-bold"
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    background: step.color,
                    fontSize: "0.625rem",
                    top: "-0.625rem",
                    right: "-0.375rem",
                  }}
                >
                  {i + 1}
                </div>
                <div className="text-xs font-bold" style={{ color: step.color }}>
                  {step.label}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  {step.sub}
                </div>
              </div>
              {i < 6 && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={step.color}
                  strokeWidth="2.5"
                  className="shrink-0"
                  style={{ opacity: 0.7 }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* NAVIGATION LINKS                                                  */}
      {/* ================================================================= */}
      <div
        className="card-glow animate-fade-in"
        style={{ marginTop: "2rem", padding: "1.5rem" }}
      >
        <h3 className="font-bold" style={{ marginBottom: "0.875rem" }}>
          Explore mais no Atlas
        </h3>
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{ gap: "0.75rem" }}
        >
          {[
            { name: "Sistema Financeiro Global", href: "/explore/financial-system", icon: "🌍" },
            { name: "Trilhos de Pagamento", href: "/explore/payment-rails", icon: "🛤️" },
            { name: "Mapa Blockchain", href: "/crypto/blockchain-map", icon: "🔗" },
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
    </div>
  );
}
