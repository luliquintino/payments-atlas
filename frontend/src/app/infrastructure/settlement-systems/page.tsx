"use client";

import { useState, useMemo } from "react";
import {
  settlementSystems,
  SETTLEMENT_TYPE_COLORS,
  SettlementType,
} from "@/data/infrastructure-data";

/**
 * Sistemas de Liquidacao — Catalogo de sistemas de liquidacao financeira global.
 *
 * 9 sistemas organizados em 5 tipos (RTGS, DNS, Hybrid, Messaging, ACH)
 * com busca e filtro por tipo. Cada card mostra modelo de liquidacao,
 * velocidade, volume, operador, moedas e participantes.
 */

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const ALL_TYPES: ("Todos" | SettlementType)[] = [
  "Todos",
  "RTGS",
  "DNS",
  "Hybrid",
  "Messaging",
  "ACH",
];

const TYPE_LABELS: Record<SettlementType, string> = {
  RTGS: "RTGS",
  DNS: "DNS",
  Hybrid: "Hybrid",
  Messaging: "Messaging",
  ACH: "ACH",
};

const TYPE_DESCRIPTIONS: Record<SettlementType, string> = {
  RTGS: "Liquidacao Bruta em Tempo Real",
  DNS: "Liquidacao Liquida Diferida",
  Hybrid: "Modelo Hibrido",
  Messaging: "Mensageria Financeira",
  ACH: "Camara de Compensacao Automatizada",
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function SettlementSystemsPage() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<"Todos" | SettlementType>(
    "Todos"
  );

  /* ---- Filtragem ---- */
  const filtered = useMemo(() => {
    return settlementSystems.filter((system) => {
      const matchesType =
        activeType === "Todos" || system.type === activeType;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        system.name.toLowerCase().includes(term) ||
        system.description.toLowerCase().includes(term) ||
        system.operator.toLowerCase().includes(term);
      return matchesType && matchesSearch;
    });
  }, [search, activeType]);

  /* ---- Contagens por tipo ---- */
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: settlementSystems.length,
    };
    for (const t of ALL_TYPES.slice(1)) {
      counts[t] = settlementSystems.filter((s) => s.type === t).length;
    }
    return counts;
  }, []);

  /* ---- Contagens por tipo (filtradas) ---- */
  const filteredTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of ALL_TYPES.slice(1)) {
      counts[t] = filtered.filter((s) => s.type === t).length;
    }
    return counts;
  }, [filtered]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ---- Cabecalho da pagina ---- */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Sistemas de Liquidacao</h1>
        <p className="page-description">
          Catalogo dos principais sistemas de liquidacao financeira utilizados
          globalmente. Inclui sistemas RTGS, DNS, hibridos, mensageria e ACH,
          com detalhes sobre modelo de liquidacao, velocidade, volume e
          participantes.
        </p>
      </header>

      {/* ---- Stat Cards ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 animate-fade-in stagger-2" style={{ gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🏛️</div>
          <div className="metric-value" style={{ fontSize: "1.5rem" }}>{settlementSystems.length}</div>
          <div className="text-xs text-[var(--text-muted)]">Sistemas</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>📊</div>
          <div className="metric-value" style={{ fontSize: "1.5rem" }}>5</div>
          <div className="text-xs text-[var(--text-muted)]">Tipos</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>💱</div>
          <div className="metric-value" style={{ fontSize: "1.5rem" }}>{new Set(settlementSystems.flatMap(s => s.currencies || [])).size || '10+'}</div>
          <div className="text-xs text-[var(--text-muted)]">Moedas</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🌍</div>
          <div className="metric-value" style={{ fontSize: "1.5rem" }}>{new Set(settlementSystems.map(s => s.operator)).size}</div>
          <div className="text-xs text-[var(--text-muted)]">Operadores</div>
        </div>
      </div>

      {/* ---- Disclaimer ---- */}
      <p className="text-xs text-[var(--text-muted)] animate-fade-in stagger-3" style={{ marginBottom: "1.5rem", fontStyle: "italic" }}>
        * Esses numeros podem ter sofrido alteracao com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* ---- Busca e Filtros ---- */}
      <div className="card-glow animate-fade-in stagger-1" style={{ marginBottom: "1.5rem" }}>
        {/* Campo de busca */}
        <div className="relative" style={{ marginBottom: "1rem" }}>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <svg
              width="18"
              height="18"
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
          </span>
          <input
            type="text"
            placeholder="Pesquisar por nome, descricao ou operador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl shadow-sm border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1 placeholder:text-[var(--text-muted)]"
            style={{ paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.625rem", paddingBottom: "0.625rem" }}
          />
        </div>

        {/* Filtros de tipo */}
        <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`rounded-lg text-sm font-medium transition-colors ${
                activeType === t ? "shadow-sm" : ""
              }`}
              style={
                activeType === t
                  ? { background: "var(--primary)", color: "white", padding: "0.625rem 1.25rem" }
                  : {
                      background: "var(--surface-hover)",
                      color: "var(--text-muted)",
                      padding: "0.625rem 1.25rem",
                    }
              }
            >
              {t}
              <span className="opacity-70 font-semibold" style={{ marginLeft: "0.375rem" }}>
                ({typeCounts[t]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---- Resumo por tipo ---- */}
      <div className="flex flex-wrap animate-fade-in stagger-2" style={{ gap: "0.75rem", marginBottom: "1.5rem" }}>
        {(ALL_TYPES.slice(1) as SettlementType[]).map((t) => {
          const color = SETTLEMENT_TYPE_COLORS[t];
          return (
            <div
              key={t}
              className="flex items-center rounded-xl text-sm font-medium"
              style={{
                background: `${color}15`,
                color: color,
                border: `1px solid ${color}30`,
                gap: "0.5rem",
                padding: "0.5rem 1rem",
              }}
            >
              <span className="font-bold">{filteredTypeCounts[t]}</span>
              <span>{TYPE_LABELS[t]}</span>
            </div>
          );
        })}
        <div className="flex items-center rounded-xl text-sm font-medium text-[var(--text-muted)]" style={{ gap: "0.5rem", padding: "0.5rem 1rem" }}>
          <span className="font-bold">{filtered.length}</span>
          <span>Total</span>
        </div>
      </div>

      {/* ---- Cards de sistemas ---- */}
      {filtered.length === 0 ? (
        <div className="card-glow text-center animate-fade-in stagger-3" style={{ padding: "3rem" }}>
          <div className="text-4xl opacity-30" style={{ marginBottom: "1rem" }}>?</div>
          <h3 className="text-lg font-semibold" style={{ marginBottom: "0.5rem" }}>
            Nenhum sistema encontrado
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            Tente ajustar sua pesquisa ou alterar o filtro de tipo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1.25rem" }}>
          {filtered.map((system, idx) => {
            const typeColor = SETTLEMENT_TYPE_COLORS[system.type];

            return (
              <div
                key={system.id}
                className={`card-glow hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-in stagger-${Math.min(
                  idx + 1,
                  6
                )}`}
                style={{ borderLeft: `3px solid ${typeColor}` }}
              >
                {/* Cabecalho: nome + badge de tipo */}
                <div className="flex items-start justify-between" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold" style={{ marginBottom: "0.25rem" }}>
                      {system.name}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)]">
                      {system.region}
                    </span>
                  </div>
                  <span
                    className="text-xs rounded-full font-semibold shrink-0"
                    style={{
                      background: `${typeColor}15`,
                      color: typeColor,
                      border: `1px solid ${typeColor}30`,
                      padding: "0.25rem 0.625rem",
                    }}
                  >
                    {system.type}
                  </span>
                </div>

                {/* Descricao */}
                <p className="text-sm text-[var(--text-muted)] leading-relaxed" style={{ marginBottom: "0.75rem" }}>
                  {system.description}
                </p>

                {/* Modelo de liquidacao */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <span className="text-xs text-[var(--text-muted)]">
                    Modelo:{" "}
                  </span>
                  <span className="text-xs font-medium text-[var(--foreground)]">
                    {system.settlementModel}
                  </span>
                </div>

                {/* Velocidade e Volume */}
                <div className="grid grid-cols-2" style={{ gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <div className="rounded-lg bg-[var(--surface-hover)]" style={{ padding: "0.5rem 0.75rem" }}>
                    <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]" style={{ marginBottom: "0.125rem" }}>
                      Velocidade
                    </span>
                    <span className="text-xs font-medium text-[var(--foreground)]">
                      {system.settlementSpeed}
                    </span>
                  </div>
                  <div className="rounded-lg bg-[var(--surface-hover)]" style={{ padding: "0.5rem 0.75rem" }}>
                    <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]" style={{ marginBottom: "0.125rem" }}>
                      Volume
                    </span>
                    <span className="text-xs font-medium text-[var(--foreground)]">
                      {system.volume}
                    </span>
                  </div>
                </div>

                {/* Operador */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <span className="text-xs text-[var(--text-muted)]">
                    Operador:{" "}
                  </span>
                  <span className="text-xs font-medium text-[var(--foreground)]">
                    {system.operator}
                  </span>
                </div>

                {/* Moedas (chips) */}
                <div className="flex flex-wrap" style={{ gap: "0.375rem", marginBottom: "0.75rem" }}>
                  {system.currency.map((cur) => (
                    <span
                      key={cur}
                      className="text-[11px] rounded-md font-medium"
                      style={{
                        background: `${typeColor}10`,
                        color: typeColor,
                        border: `1px solid ${typeColor}20`,
                        padding: "0.125rem 0.5rem",
                      }}
                    >
                      {cur}
                    </span>
                  ))}
                </div>

                {/* Participantes */}
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]" style={{ marginBottom: "0.375rem" }}>
                    Participantes
                  </span>
                  <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                    {system.participants.map((p) => (
                      <span
                        key={p}
                        className="text-[11px] rounded-md bg-[var(--surface-hover)] text-[var(--text-muted)]"
                        style={{ padding: "0.125rem 0.5rem" }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Paginas Relacionadas ---- */}
      <div style={{ marginTop: "2rem" }}>
        <div className="divider-text animate-fade-in stagger-5" style={{ marginBottom: "0.75rem" }}>
          Páginas Relacionadas
        </div>
        <div className="flex flex-col" style={{ gap: "0.75rem" }}>
          {[
            { label: "Sistemas Bancários", href: "/infrastructure/banking-systems", icon: "🏛️", color: "#3b82f6" },
            { label: "Liquidez & Tesouraria", href: "/infrastructure/liquidity-treasury", icon: "💰", color: "#10b981" },
            { label: "Sistema Financeiro Global", href: "/explore/financial-system", icon: "🌍", color: "#8b5cf6" },
          ].map((page) => (
            <a key={page.href} href={page.href} className="card-flat interactive-hover flex items-center" style={{ gap: "0.75rem", padding: "1rem", textDecoration: "none" }}>
              <span style={{ fontSize: "1.25rem" }}>{page.icon}</span>
              <span className="font-medium text-sm">{page.label}</span>
              <span className="text-[var(--text-muted)] text-xs" style={{ marginLeft: "auto" }}>→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
