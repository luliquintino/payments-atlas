"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";

interface PageEntry {
  name: string;
  href: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  pages: PageEntry[];
}

const categories: Category[] = [
  {
    id: "pagamentos",
    name: "Pagamentos",
    icon: "\u{1F4B3}",
    color: "#6366F1",
    description: "Fluxos, trilhos e mapa de pagamentos",
    pages: [
      { name: "Mapa de Pagamentos", href: "/explore/payments-map", description: "Vis\u00e3o interativa das 6 camadas" },
      { name: "Trilhos de Pagamento", href: "/explore/payment-rails", description: "Pix, cart\u00e3o, boleto, TED" },
      { name: "Fluxos de Transa\u00e7\u00e3o", href: "/explore/transaction-flows", description: "Autoriza\u00e7\u00e3o, captura, estorno" },
      { name: "Mapa do Ecossistema", href: "/explore/ecosystem-map", description: "Players e conex\u00f5es" },
      { name: "Sistema Financeiro", href: "/explore/financial-system", description: "Estrutura do SFN" },
    ],
  },
  {
    id: "infraestrutura",
    name: "Infraestrutura",
    icon: "\u{1F3DB}\uFE0F",
    color: "#10B981",
    description: "Sistemas banc\u00e1rios, liquida\u00e7\u00e3o e tesouraria",
    pages: [
      { name: "Sistemas Banc\u00e1rios", href: "/infrastructure/banking-systems", description: "Core banking, processamento" },
      { name: "Sistemas de Liquida\u00e7\u00e3o", href: "/infrastructure/settlement-systems", description: "RTGS, DNS, ACH" },
      { name: "Liquidez & Tesouraria", href: "/infrastructure/liquidity-treasury", description: "Cash management" },
      { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing", description: "Mec\u00e2nicas de compensa\u00e7\u00e3o" },
    ],
  },
  {
    id: "crypto",
    name: "Crypto & Web3",
    icon: "\u{1F517}",
    color: "#8B5CF6",
    description: "Blockchain, stablecoins, DeFi e CBDC",
    pages: [
      { name: "Mapa Blockchain", href: "/crypto/blockchain-map", description: "Ecossistema de blockchains" },
      { name: "Sistemas de Stablecoin", href: "/crypto/stablecoin-systems", description: "USDC, USDT, DREX" },
      { name: "Protocolos DeFi", href: "/crypto/defi-protocols", description: "AMM, lending, yield" },
      { name: "Crypto Avan\u00e7ado: L2 & Bridges", href: "/crypto/advanced-crypto", description: "Rollups, bridges, CBDC" },
    ],
  },
  {
    id: "knowledge",
    name: "Knowledge Base",
    icon: "\u{1F4DA}",
    color: "#F59E0B",
    description: "Features, regras, gloss\u00e1rio e taxonomia",
    pages: [
      { name: "Base de Features", href: "/knowledge/features", description: "87 features documentadas" },
      { name: "Feature Discovery", href: "/knowledge/feature-discovery", description: "Busca avan\u00e7ada de features" },
      { name: "Regras de Neg\u00f3cio", href: "/knowledge/business-rules", description: "23 regras validadas" },
      { name: "Regras de Bandeiras", href: "/knowledge/brand-rules", description: "Visa, Master, Elo, Amex" },
      { name: "Gloss\u00e1rio", href: "/glossary", description: "141 termos explicados" },
      { name: "Taxonomia", href: "/knowledge/taxonomy", description: "Classifica\u00e7\u00e3o do ecossistema" },
      { name: "Grafo de Depend\u00eancias", href: "/knowledge/dependency-graph", description: "Rela\u00e7\u00f5es entre features" },
    ],
  },
  {
    id: "fraude",
    name: "Fraude & Risco",
    icon: "\u{1F6E1}\uFE0F",
    color: "#EF4444",
    description: "Detec\u00e7\u00e3o, preven\u00e7\u00e3o e gest\u00e3o de disputas",
    pages: [
      { name: "Mapa de Fraude", href: "/fraud/fraud-map", description: "Panorama de amea\u00e7as" },
      { name: "Sinais de Fraude", href: "/fraud/fraud-signals", description: "Indicadores e padr\u00f5es" },
      { name: "Ciclo de Chargeback", href: "/fraud/chargeback-lifecycle", description: "Da disputa \u00e0 resolu\u00e7\u00e3o" },
      { name: "Chargeback Deep Dive", href: "/knowledge/chargeback-deep-dive", description: "Reason codes, defesa" },
      { name: "Fraud ML Avan\u00e7ado", href: "/knowledge/advanced-fraud-ml", description: "Graph analysis, biometrics" },
    ],
  },
  {
    id: "diagnostico",
    name: "Diagn\u00f3stico",
    icon: "\u{1FA7A}",
    color: "#EC4899",
    description: "Ferramentas de an\u00e1lise e diagn\u00f3stico",
    pages: [
      { name: "Conta Comigo", href: "/diagnostics/conta-comigo", description: "Diagn\u00f3stico do seu sistema" },
      { name: "\u00c1rvore de M\u00e9tricas", href: "/diagnostics/metrics-tree", description: "KPIs decompostos" },
      { name: "Biblioteca de Problemas", href: "/diagnostics/problem-library", description: "Problemas comuns e solu\u00e7\u00f5es" },
    ],
  },
  {
    id: "regulacao",
    name: "Regula\u00e7\u00e3o & Compliance",
    icon: "\u2696\uFE0F",
    color: "#14B8A6",
    description: "PCI, LGPD, Open Finance, regula\u00e7\u00e3o banc\u00e1ria",
    pages: [
      { name: "PCI Compliance Roadmap", href: "/knowledge/pci-compliance", description: "SAQ, auditorias, v4.0" },
      { name: "Matriz Regulat\u00f3ria", href: "/knowledge/regulatory-matrix", description: "Brasil, Europa, EUA" },
      { name: "Cross-Border Payments", href: "/knowledge/cross-border", description: "FX, correspondent banking" },
      { name: "Cr\u00e9dito Estruturado", href: "/knowledge/credito-estruturado", description: "SCD, FIDC, cess\u00e3o" },
      { name: "Antecipa\u00e7\u00e3o de Receb\u00edveis", href: "/knowledge/antecipacao-recebiveis", description: "Mesa, des\u00e1gio, registradora" },
      { name: "Parcelamento", href: "/knowledge/parcelamento", description: "Emissor vs lojista, impacto" },
    ],
  },
  {
    id: "operacional",
    name: "Operacional & Arquitetura",
    icon: "\u{1F3D7}\uFE0F",
    color: "#6366F1",
    description: "Alta disponibilidade, incidentes, patterns",
    pages: [
      { name: "Operational Excellence", href: "/knowledge/operational-excellence", description: "DR, chaos, incidentes" },
      { name: "Webhook Patterns", href: "/knowledge/webhook-patterns", description: "Reliability, idempotency" },
      { name: "PayFac Architecture", href: "/knowledge/payfac-architecture", description: "Construir um PayFac" },
      { name: "Embedded Finance", href: "/knowledge/embedded-finance", description: "BaaS, Credit as a Service" },
    ],
  },
];

const totalPages = categories.reduce((sum, cat) => sum + cat.pages.length, 0);

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isPageVisited, pagesVisited } = useGameProgress();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allPages = useMemo(
    () => categories.flatMap((cat) => cat.pages),
    []
  );

  const visitedCount = useMemo(
    () => allPages.filter((p) => isPageVisited(p.href)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allPages, pagesVisited]
  );

  // Filter categories and pages by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        pages: cat.pages.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            cat.name.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.pages.length > 0);
  }, [searchQuery]);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.375rem",
            }}
          >
            Explorar
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9375rem",
              marginBottom: "1.25rem",
            }}
          >
            {totalPages} p\u00e1ginas dispon\u00edveis &middot; {visitedCount} visitadas
          </p>

          {/* Search bar */}
          <div style={{ position: "relative", maxWidth: "480px" }}>
            <span
              style={{
                position: "absolute",
                left: "0.875rem",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "1rem",
                color: "var(--text-secondary)",
                pointerEvents: "none",
              }}
            >
              {"\uD83D\uDD0D"}
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar p\u00e1ginas por nome ou descri\u00e7\u00e3o..."
              style={{
                width: "100%",
                padding: "0.75rem 0.875rem 0.75rem 2.5rem",
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--foreground)",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "var(--text-secondary)",
            }}
          >
            <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem" }}>{"\uD83D\uDD0D"}</span>
            <p style={{ fontSize: "0.9375rem" }}>
              Nenhuma p\u00e1gina encontrada para &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <>
            {/* Category Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              {filteredCategories.map((cat) => {
                const catVisited = cat.pages.filter((p) => isPageVisited(p.href)).length;
                const catPct = cat.pages.length > 0 ? Math.round((catVisited / cat.pages.length) * 100) : 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => scrollToSection(cat.id)}
                    style={{
                      textAlign: "left",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.875rem",
                      borderLeft: `4px solid ${cat.color}`,
                      padding: "1rem 1.25rem",
                      cursor: "pointer",
                      transition: "box-shadow 0.2s, transform 0.2s",
                      color: "var(--foreground)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{cat.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{cat.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                          {cat.pages.length} p\u00e1ginas
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                      {cat.description}
                    </p>
                    {/* Progress bar */}
                    <div
                      style={{
                        height: "4px",
                        borderRadius: "2px",
                        background: "var(--border)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${catPct}%`,
                          background: cat.color,
                          borderRadius: "2px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      {catVisited}/{cat.pages.length} visitadas
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expanded Sections */}
            {filteredCategories.map((cat) => {
              const catVisited = cat.pages.filter((p) => isPageVisited(p.href)).length;

              return (
                <div
                  key={cat.id}
                  ref={(el) => { sectionRefs.current[cat.id] = el; }}
                  style={{ marginBottom: "2rem" }}
                >
                  {/* Section header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.75rem 0.75rem 0 0",
                      background: cat.color,
                      color: "#FFFFFF",
                    }}
                  >
                    <span style={{ fontSize: "1.25rem" }}>{cat.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: "1rem", flex: 1 }}>{cat.name}</span>
                    <span style={{ fontSize: "0.8125rem", opacity: 0.9 }}>
                      {catVisited}/{cat.pages.length}
                    </span>
                  </div>

                  {/* Pages horizontal scroll */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      overflowX: "auto",
                      padding: "1rem",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderTop: "none",
                      borderRadius: "0 0 0.75rem 0.75rem",
                    }}
                  >
                    {cat.pages.map((page) => {
                      const visited = isPageVisited(page.href);
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          style={{
                            minWidth: "200px",
                            maxWidth: "240px",
                            flexShrink: 0,
                            background: visited ? "var(--primary-bg)" : "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: "0.75rem",
                            padding: "1rem",
                            textDecoration: "none",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.375rem",
                            transition: "transform 0.15s, box-shadow 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span
                              style={{
                                fontSize: "0.9375rem",
                                fontWeight: 600,
                                color: visited ? "var(--primary)" : "var(--foreground)",
                                flex: 1,
                                minWidth: 0,
                              }}
                            >
                              {page.name}
                            </span>
                            {visited && (
                              <span style={{ color: "var(--primary)", fontSize: "1rem", flexShrink: 0 }}>{"\u2713"}</span>
                            )}
                          </div>
                          <p
                            style={{
                              fontSize: "0.8125rem",
                              color: "var(--text-secondary)",
                              lineHeight: 1.4,
                            }}
                          >
                            {page.description}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
