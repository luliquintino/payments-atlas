"use client";

import { useState, useMemo } from "react";
import {
  stablecoins,
  STABLECOIN_BACKING_COLORS,
  StablecoinBackingType,
} from "@/data/crypto-data";

/**
 * Stablecoin Systems -- Pagina hibrida com visualizacao de fluxo de
 * transferencia de stablecoins (Section 1) e catalogo filtrado do
 * banco de dados de stablecoins (Section 2).
 */

// ---------------------------------------------------------------------------
// Flow — Dados inline para o diagrama de fluxo
// ---------------------------------------------------------------------------

interface FlowStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: "user",
    label: "Usuario",
    description:
      "O usuario inicia a transferencia a partir de uma exchange, app ou interface DeFi, definindo valor e destinatario.",
    icon: "U",
    color: "#6366f1",
  },
  {
    id: "wallet",
    label: "Carteira (Wallet)",
    description:
      "A carteira digital assina a transacao com a chave privada do usuario e prepara os parametros de gas/fee.",
    icon: "W",
    color: "#8b5cf6",
  },
  {
    id: "transfer",
    label: "Transferencia de Stablecoin",
    description:
      "O smart contract da stablecoin executa a funcao transfer(), movendo tokens do remetente ao destinatario.",
    icon: "T",
    color: "#0ea5e9",
  },
  {
    id: "blockchain",
    label: "Blockchain",
    description:
      "Validadores/mineradores incluem a transacao em um bloco e a rede atinge consenso sobre o novo estado.",
    icon: "B",
    color: "#10b981",
  },
  {
    id: "settlement",
    label: "Liquidacao",
    description:
      "A transacao e finalizada on-chain e o saldo do destinatario e atualizado de forma irreversivel.",
    icon: "L",
    color: "#f59e0b",
  },
];

// ---------------------------------------------------------------------------
// Filter categories
// ---------------------------------------------------------------------------

type BackingFilter = "Todos" | StablecoinBackingType;

const ALL_BACKING_TYPES: BackingFilter[] = [
  "Todos",
  "Fiat-backed",
  "Crypto-backed",
  "Algorithmic",
  "Hybrid",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StablecoinSystemsPage() {
  const [search, setSearch] = useState("");
  const [activeBackingType, setActiveBackingType] =
    useState<BackingFilter>("Todos");

  /* ---- Filtragem ---- */
  const filtered = useMemo(() => {
    return stablecoins.filter((sc) => {
      const matchesBacking =
        activeBackingType === "Todos" || sc.backingType === activeBackingType;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        sc.name.toLowerCase().includes(q) ||
        sc.ticker.toLowerCase().includes(q) ||
        sc.issuer.toLowerCase().includes(q) ||
        sc.description.toLowerCase().includes(q);
      return matchesBacking && matchesSearch;
    });
  }, [search, activeBackingType]);

  /* ---- Contagens por tipo de lastro ---- */
  const backingCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: stablecoins.length };
    for (const bt of ALL_BACKING_TYPES.slice(1)) {
      counts[bt] = stablecoins.filter((s) => s.backingType === bt).length;
    }
    return counts;
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ================================================================ */}
      {/* Cabecalho da pagina                                              */}
      {/* ================================================================ */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Sistemas de Stablecoins</h1>
        <p className="page-description">
          Visualizacao do fluxo de transferencia de stablecoins e catalogo
          completo das principais stablecoins do mercado, com detalhes de
          lastro, blockchains suportadas, taxas e status regulatorio.
        </p>
      </header>

      {/* ================================================================ */}
      {/* STATS                                                            */}
      {/* ================================================================ */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>~15</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Stablecoins</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>4</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Modelos</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>$150B+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Market Cap</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Redes</div>
        </div>
      </div>

      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem", opacity: 0.7 }}>
        * Numeros podem variar conforme fonte e data de consulta. Valores aproximados para fins didaticos.
      </p>

      {/* ================================================================ */}
      {/* SECTION 1 — Fluxo de Transferencia de Stablecoins                */}
      {/* ================================================================ */}
      <section className="animate-fade-in stagger-1" style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-lg font-semibold" style={{ marginBottom: "1rem", color: "var(--foreground)" }}>
          Fluxo de Transferencia
        </h2>

        <div className="card-glow">
          {/* ---- Desktop: horizontal / Mobile: vertical ---- */}
          <div className="flex flex-col lg:flex-row items-stretch" style={{ gap: "0" }}>
            {FLOW_STEPS.map((step, idx) => (
              <div key={step.id} className="flex flex-col lg:flex-row items-center flex-1">
                {/* Step card */}
                <div className="flex flex-col items-center text-center flex-1 min-w-0" style={{ padding: "1.25rem 1rem" }}>
                  {/* Icon circle */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg shrink-0"
                    style={{
                      marginBottom: "0.75rem",
                      background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`,
                      boxShadow: `0 4px 14px ${step.color}40`,
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Label */}
                  <h3 className="text-sm font-semibold" style={{ marginBottom: "0.375rem", color: "var(--foreground)" }}>
                    {step.label}
                  </h3>

                  {/* Description */}
                  <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: "var(--text-muted)" }}>
                    {step.description}
                  </p>
                </div>

                {/* Connecting arrow (not after last step) */}
                {idx < FLOW_STEPS.length - 1 && (
                  <>
                    {/* Desktop arrow (horizontal) */}
                    <div className="hidden lg:flex items-center shrink-0" style={{ padding: "0 0.25rem" }}>
                      <svg
                        width="32"
                        height="16"
                        viewBox="0 0 32 16"
                        fill="none"
                      >
                        <line
                          x1="0"
                          y1="8"
                          x2="24"
                          y2="8"
                          stroke={FLOW_STEPS[idx + 1].color}
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        <path
                          d="M22 3L28 8L22 13"
                          stroke={FLOW_STEPS[idx + 1].color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </div>

                    {/* Mobile arrow (vertical) */}
                    <div className="flex lg:hidden items-center justify-center" style={{ padding: "0.25rem 0" }}>
                      <svg
                        width="16"
                        height="28"
                        viewBox="0 0 16 28"
                        fill="none"
                      >
                        <line
                          x1="8"
                          y1="0"
                          x2="8"
                          y2="20"
                          stroke={FLOW_STEPS[idx + 1].color}
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        <path
                          d="M3 18L8 24L13 18"
                          stroke={FLOW_STEPS[idx + 1].color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="border-t border-[var(--border)]" style={{ marginTop: "0.5rem", padding: "0.75rem 1.25rem" }}>
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
              Fluxo simplificado de uma transferencia de stablecoin — do usuario
              ate a liquidacao final on-chain.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2 — Banco de Dados de Stablecoins                        */}
      {/* ================================================================ */}

      {/* Divider */}
      <div className="flex items-center animate-fade-in stagger-2" style={{ gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="flex-1 h-px bg-[var(--border)]" />
        <h2 className="text-lg font-semibold shrink-0" style={{ color: "var(--foreground)" }}>
          Principais Stablecoins
        </h2>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* ---- Busca e Filtros ---- */}
      <div className="card-glow animate-fade-in stagger-3" style={{ marginBottom: "1.5rem" }}>
        {/* Campo de busca */}
        <div className="relative" style={{ marginBottom: "1rem" }}>
          <span className="absolute top-1/2 -translate-y-1/2" style={{ left: "0.75rem", color: "var(--text-muted)" }}>
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
            placeholder="Pesquisar por nome, ticker, emissor ou descricao..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl shadow-sm border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1 placeholder:text-[var(--text-muted)]"
            style={{ paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.625rem", paddingBottom: "0.625rem" }}
          />
        </div>

        {/* Filtros de tipo de lastro */}
        <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
          {ALL_BACKING_TYPES.map((bt) => {
            const isActive = activeBackingType === bt;
            const color =
              bt === "Todos" ? undefined : STABLECOIN_BACKING_COLORS[bt];

            return (
              <button
                key={bt}
                onClick={() => setActiveBackingType(bt)}
                className={`rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "shadow-sm" : ""
                }`}
                style={{
                  padding: "0.625rem 1.25rem",
                  ...(isActive
                    ? {
                        background: color ?? "var(--primary)",
                        color: "white",
                      }
                    : {
                        background: "var(--surface-hover)",
                        color: "var(--text-muted)",
                      }),
                }}
              >
                {bt}
                <span className="opacity-70 font-semibold" style={{ marginLeft: "0.375rem" }}>
                  ({backingCounts[bt]})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- Cards de stablecoins ---- */}
      {filtered.length === 0 ? (
        <div className="card-glow text-center animate-fade-in stagger-4" style={{ padding: "3rem" }}>
          <div className="text-4xl opacity-30" style={{ marginBottom: "1rem" }}>?</div>
          <h3 className="text-lg font-semibold" style={{ marginBottom: "0.5rem" }}>
            Nenhuma stablecoin encontrada
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Tente ajustar sua pesquisa ou alterar o filtro de tipo de lastro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1.25rem" }}>
          {filtered.map((sc, idx) => {
            const backingColor = STABLECOIN_BACKING_COLORS[sc.backingType];

            return (
              <div
                key={sc.id}
                className={`card-glow hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-in stagger-${Math.min(
                  idx + 1,
                  6
                )}`}
                style={{ borderLeft: `3px solid ${backingColor}` }}
              >
                {/* Header: name + ticker */}
                <div className="flex items-start" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                    style={{
                      background: `linear-gradient(to bottom right, ${backingColor}, ${backingColor}cc)`,
                    }}
                  >
                    {sc.ticker.slice(0, 2)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold" style={{ marginBottom: "0.125rem" }}>
                      {sc.name}{" "}
                      <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>
                        ({sc.ticker})
                      </span>
                    </h3>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {sc.issuer}
                    </p>
                  </div>
                  {/* Backing type badge */}
                  <span
                    className="text-xs rounded-full font-medium shrink-0"
                    style={{
                      padding: "0.125rem 0.625rem",
                      background: `${backingColor}15`,
                      color: backingColor,
                    }}
                  >
                    {sc.backingType}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                  {sc.description}
                </p>

                {/* Blockchains */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                    Blockchains
                  </h4>
                  <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                    {sc.blockchain.map((chain) => (
                      <span
                        key={chain}
                        className="text-xs rounded-full border border-[var(--border)] bg-[var(--surface-hover)]"
                        style={{ padding: "0.25rem 0.625rem", color: "var(--foreground)" }}
                      >
                        {chain}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div className="rounded-lg bg-[var(--surface-hover)]" style={{ padding: "0.75rem" }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.125rem" }}>
                      Velocidade
                    </div>
                    <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                      {sc.settlementSpeed}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[var(--surface-hover)]" style={{ padding: "0.75rem" }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.125rem" }}>
                      Taxas
                    </div>
                    <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                      {sc.fees}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[var(--surface-hover)] col-span-2" style={{ padding: "0.75rem" }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.125rem" }}>
                      Market Cap
                    </div>
                    <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                      {sc.marketCap}
                    </div>
                  </div>
                </div>

                {/* Use cases */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                    Casos de Uso
                  </h4>
                  <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                    {sc.useCases.map((uc) => (
                      <span
                        key={uc}
                        className="text-xs rounded-full font-medium"
                        style={{
                          padding: "0.25rem 0.625rem",
                          background: `${backingColor}10`,
                          color: backingColor,
                        }}
                      >
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Regulatory status */}
                <div className="rounded-lg bg-[var(--surface-hover)] border border-[var(--border)]" style={{ padding: "0.75rem" }}>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                    Status Regulatorio
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {sc.regulatoryStatus}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Nota explicativa ---- */}
      <div className="card-glow animate-fade-in stagger-6" style={{ marginTop: "2rem" }}>
        <h3 className="font-semibold" style={{ marginBottom: "0.75rem" }}>Sobre Stablecoins</h3>
        <div className="flex flex-col text-sm" style={{ gap: "0.75rem", color: "var(--text-muted)" }}>
          <p>
            Stablecoins sao criptomoedas projetadas para manter paridade com um
            ativo de referencia, geralmente o dolar americano. Elas combinam a
            estabilidade de moedas fiduciarias com a programabilidade e
            velocidade de blockchains.
          </p>
          <p>
            <strong style={{ color: "var(--foreground)" }}>Fiat-backed:</strong>{" "}
            Lastreadas por reservas de moeda fiduciaria ou titulos governamentais.
            <br />
            <strong style={{ color: "var(--foreground)" }}>Crypto-backed:</strong>{" "}
            Colateralizadas por crypto-ativos com over-collateralization.
            <br />
            <strong style={{ color: "var(--foreground)" }}>Algorithmic:</strong>{" "}
            Mantem a paridade por mecanismos algoritmicos de oferta/demanda.
            <br />
            <strong style={{ color: "var(--foreground)" }}>Hybrid:</strong>{" "}
            Combinam colateral fiat/crypto com elementos algoritmicos.
          </p>
          <p>
            A escolha de stablecoin depende do caso de uso, tolerancia a risco
            regulatorio, blockchains desejadas e necessidades de
            descentralizacao.
          </p>
        </div>
      </div>

      {/* ================================================================ */}
      {/* FOOTER — PAGINAS RELACIONADAS                                    */}
      {/* ================================================================ */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Mapa Blockchain", href: "/crypto/blockchain-map", icon: "\u{1F517}" },
          { name: "Protocolos DeFi", href: "/crypto/defi-protocols", icon: "\u{1F4CA}" },
          { name: "Sistema Financeiro Global", href: "/fundamentos/financial-system", icon: "\u{1F30D}" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>{"\u2192"}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
