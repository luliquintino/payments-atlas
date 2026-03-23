"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";

interface PageEntry {
  name: string;
  href: string;
  tags: string[];
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
    icon: "💳",
    color: "#6366F1",
    description: "Mapas, fluxos e trilhos de pagamento",
    pages: [
      { name: "Mapa de Pagamentos", href: "/explore/payments-map", tags: ["fundamental"] },
      { name: "Trilhos de Pagamento", href: "/explore/payment-rails", tags: ["fundamental"] },
      { name: "Fluxos de Transação", href: "/explore/transaction-flows", tags: ["fundamental"] },
      { name: "Mapa do Ecossistema", href: "/explore/ecosystem-map", tags: ["fundamental"] },
      { name: "Sistema Financeiro", href: "/explore/financial-system", tags: ["fundamental"] },
    ],
  },
  {
    id: "infraestrutura",
    name: "Infraestrutura",
    icon: "🏛️",
    color: "#10B981",
    description: "Sistemas bancários, liquidação e tesouraria",
    pages: [
      { name: "Sistemas Bancários", href: "/infrastructure/banking-systems", tags: ["avançado"] },
      { name: "Sistemas de Liquidação", href: "/infrastructure/settlement-systems", tags: ["avançado"] },
      { name: "Liquidez & Tesouraria", href: "/infrastructure/liquidity-treasury", tags: ["avançado"] },
      { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing", tags: ["avançado", "novo"] },
    ],
  },
  {
    id: "crypto",
    name: "Crypto & Web3",
    icon: "🔗",
    color: "#8B5CF6",
    description: "Blockchain, stablecoins, DeFi e L2",
    pages: [
      { name: "Mapa Blockchain", href: "/crypto/blockchain-map", tags: [] },
      { name: "Sistemas de Stablecoin", href: "/crypto/stablecoin-systems", tags: [] },
      { name: "Protocolos DeFi", href: "/crypto/defi-protocols", tags: [] },
      { name: "Crypto Avançado: L2 & Bridges", href: "/crypto/advanced-crypto", tags: ["avançado", "novo"] },
    ],
  },
  {
    id: "knowledge",
    name: "Knowledge Base",
    icon: "📚",
    color: "#F59E0B",
    description: "Features, regras, taxonomia e deep dives",
    pages: [
      { name: "Base de Features", href: "/knowledge/features", tags: [] },
      { name: "Feature Discovery", href: "/knowledge/feature-discovery", tags: [] },
      { name: "Regras de Negócio", href: "/knowledge/business-rules", tags: [] },
      { name: "Regras de Bandeiras", href: "/knowledge/brand-rules", tags: ["novo"] },
      { name: "Grafo de Dependências", href: "/knowledge/dependency-graph", tags: [] },
      { name: "Taxonomia", href: "/knowledge/taxonomy", tags: [] },
      { name: "Glossário", href: "/glossary", tags: [] },
      { name: "Chargeback Deep Dive", href: "/knowledge/chargeback-deep-dive", tags: ["avançado"] },
      { name: "Antecipação de Recebíveis", href: "/knowledge/antecipacao-recebiveis", tags: ["avançado"] },
      { name: "Parcelamento", href: "/knowledge/parcelamento", tags: [] },
      { name: "Crédito Estruturado", href: "/knowledge/credito-estruturado", tags: ["avançado"] },
      { name: "PCI Compliance Roadmap", href: "/knowledge/pci-compliance", tags: ["avançado", "novo"] },
      { name: "Cross-Border Payments", href: "/knowledge/cross-border", tags: ["avançado", "novo"] },
      { name: "Webhook Patterns", href: "/knowledge/webhook-patterns", tags: ["avançado", "novo"] },
      { name: "PayFac Architecture", href: "/knowledge/payfac-architecture", tags: ["avançado", "novo"] },
      { name: "Matriz Regulatória", href: "/knowledge/regulatory-matrix", tags: ["avançado", "novo"] },
      { name: "Fraud ML Avançado", href: "/knowledge/advanced-fraud-ml", tags: ["avançado", "novo"] },
      { name: "Operational Excellence", href: "/knowledge/operational-excellence", tags: ["avançado", "novo"] },
      { name: "Card Present & POS", href: "/knowledge/card-present-pos", tags: ["avançado", "novo"] },
      { name: "Consórcio & Factoring", href: "/knowledge/consorcio-factoring", tags: ["avançado", "novo"] },
      { name: "Embedded Finance", href: "/knowledge/embedded-finance", tags: ["avançado", "novo"] },
      { name: "Emerging Payments", href: "/knowledge/emerging-payments", tags: ["novo"] },
      { name: "Event Architecture", href: "/knowledge/event-architecture", tags: ["avançado", "novo"] },
      { name: "Go-to-Market", href: "/knowledge/go-to-market", tags: ["novo"] },
      { name: "HSM & Criptografia", href: "/knowledge/hsm-cryptography", tags: ["avançado", "novo"] },
      { name: "Insurtech", href: "/knowledge/insurtech", tags: ["avançado", "novo"] },
      { name: "ISO 20022 & SWIFT", href: "/knowledge/iso20022-swift", tags: ["avançado", "novo"] },
      { name: "Legacy Migration", href: "/knowledge/legacy-migration", tags: ["avançado", "novo"] },
      { name: "LGPD & Payments", href: "/knowledge/lgpd-payments", tags: ["avançado", "novo"] },
      { name: "Merchant Segmentation", href: "/knowledge/merchant-segmentation", tags: ["novo"] },
      { name: "Payment Methods BR", href: "/knowledge/payment-methods-br", tags: ["fundamental", "novo"] },
      { name: "PLD-FT", href: "/knowledge/pld-ft", tags: ["avançado", "novo"] },
      { name: "Reconciliation Deep Dive", href: "/knowledge/reconciliation-deep", tags: ["avançado", "novo"] },
      { name: "Team & Career", href: "/knowledge/team-career", tags: ["novo"] },
      { name: "Treasury & Float", href: "/knowledge/treasury-float", tags: ["avançado", "novo"] },
      { name: "Unit Economics", href: "/knowledge/unit-economics", tags: ["avançado", "novo"] },
      { name: "Vendor Selection", href: "/knowledge/vendor-selection", tags: ["novo"] },
    ],
  },
  {
    id: "fraude",
    name: "Fraude & Risco",
    icon: "🛡️",
    color: "#EF4444",
    description: "Detecção de fraude, chargebacks e proteção",
    pages: [
      { name: "Mapa de Fraude", href: "/fraud/fraud-map", tags: [] },
      { name: "Sinais de Fraude", href: "/fraud/fraud-signals", tags: [] },
      { name: "Ciclo de Chargeback", href: "/fraud/chargeback-lifecycle", tags: [] },
    ],
  },
  {
    id: "diagnostico",
    name: "Diagnóstico",
    icon: "🩺",
    color: "#EC4899",
    description: "Conta Comigo, métricas e problemas",
    pages: [
      { name: "Conta Comigo", href: "/diagnostics/conta-comigo", tags: [] },
      { name: "Árvore de Métricas", href: "/diagnostics/metrics-tree", tags: [] },
      { name: "Biblioteca de Problemas", href: "/diagnostics/problem-library", tags: [] },
    ],
  },
  {
    id: "ferramentas",
    name: "Ferramentas",
    icon: "🔧",
    color: "#06B6D4",
    description: "Simuladores, consultores e ferramentas interativas",
    pages: [
      { name: "Simulador de Pagamentos", href: "/simulation/payment-simulator", tags: [] },
      { name: "Consultor de Arquitetura", href: "/simulation/architecture-advisor", tags: [] },
      { name: "Dashboard de Pagamentos", href: "/observability/payments-dashboard", tags: [] },
      { name: "Explorador de Eventos", href: "/observability/event-explorer", tags: [] },
      { name: "Consultor AI", href: "/ai/payments-advisor", tags: [] },
      { name: "Analisador de Documentos", href: "/tools/document-analyzer", tags: ["novo"] },
    ],
  },
  {
    id: "aprendizado",
    name: "Aprendizado",
    icon: "🎓",
    color: "#A855F7",
    description: "Trilhas, quiz e progresso de aprendizado",
    pages: [
      { name: "Trilhas de Aprendizado", href: "/trilhas", tags: [] },
      { name: "Quiz de Pagamentos", href: "/quiz", tags: [] },
      { name: "Meu Progresso", href: "/progress", tags: [] },
    ],
  },
];

const totalPages = categories.reduce((sum, cat) => sum + cat.pages.length, 0);

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { isPageVisited } = useGameProgress();

  const allPages = useMemo(
    () => categories.flatMap((cat) => cat.pages),
    []
  );

  const visitedCount = useMemo(
    () => allPages.filter((p) => isPageVisited(p.href)).length,
    [allPages, isPageVisited]
  );

  const completionPct = totalPages > 0 ? Math.round((visitedCount / totalPages) * 100) : 0;

  // Filter pages by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        pages: cat.pages.filter((p) => p.name.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.pages.length > 0);
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  const toggleCategory = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.5rem",
            }}
          >
            Explorar o Atlas
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9375rem",
              marginBottom: "1.25rem",
            }}
          >
            Navegue por {totalPages} páginas organizadas em {categories.length} categorias.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>📄</span>
              <div>
                <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
                  {totalPages}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>
                  Total de páginas
                </div>
              </div>
            </div>

            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>✅</span>
              <div>
                <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
                  {visitedCount}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>
                  Visitadas
                </div>
              </div>
            </div>

            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>📊</span>
              <div>
                <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
                  {completionPct}%
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>
                  Completado
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative" }}>
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
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar páginas por nome..."
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

        {/* Category grid / search results */}
        {filteredCategories.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "var(--text-secondary)",
            }}
          >
            <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem" }}>🔍</span>
            <p style={{ fontSize: "0.9375rem" }}>
              Nenhuma página encontrada para &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {filteredCategories.map((cat) => {
              const isExpanded = expandedCategory === cat.id || isSearching;
              const catVisited = cat.pages.filter((p) => isPageVisited(p.href)).length;
              const catPct = cat.pages.length > 0 ? Math.round((catVisited / cat.pages.length) * 100) : 0;

              return (
                <div
                  key={cat.id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.875rem",
                    borderLeft: `4px solid ${cat.color}`,
                    overflow: "hidden",
                    gridColumn: isExpanded ? "1 / -1" : undefined,
                    transition: "box-shadow 0.2s",
                  }}
                >
                  {/* Card header — clickable */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "1rem 1.25rem",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.875rem",
                      color: "var(--foreground)",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{cat.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.5rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{cat.name}</span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-secondary)",
                            flexShrink: 0,
                          }}
                        >
                          {cat.pages.length} páginas
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--text-secondary)",
                          marginBottom: "0.625rem",
                        }}
                      >
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
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--text-secondary)",
                          marginTop: "0.25rem",
                        }}
                      >
                        {catVisited}/{cat.pages.length} visitadas ({catPct}%)
                      </div>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        flexShrink: 0,
                        marginTop: "0.25rem",
                        transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Expanded page list */}
                  {isExpanded && (
                    <div
                      style={{
                        borderTop: "1px solid var(--border)",
                        padding: "0.5rem 0",
                      }}
                    >
                      {cat.pages.map((page) => {
                        const visited = isPageVisited(page.href);
                        return (
                          <Link
                            key={page.href}
                            href={page.href}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.625rem",
                              padding: "0.5rem 1.25rem 0.5rem 1.25rem",
                              fontSize: "0.875rem",
                              color: visited ? "var(--primary)" : "var(--foreground)",
                              textDecoration: "none",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "var(--primary-bg)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <span
                              style={{
                                width: "1.25rem",
                                textAlign: "center",
                                flexShrink: 0,
                                fontSize: "0.875rem",
                              }}
                            >
                              {visited ? "✅" : "○"}
                            </span>
                            <span style={{ flex: 1, minWidth: 0 }}>{page.name}</span>
                            <span style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                              {page.tags.includes("novo") && (
                                <span
                                  style={{
                                    fontSize: "0.6875rem",
                                    background: "#DCFCE7",
                                    color: "#166534",
                                    padding: "0.125rem 0.5rem",
                                    borderRadius: "9999px",
                                    fontWeight: 600,
                                  }}
                                >
                                  Novo
                                </span>
                              )}
                              {page.tags.includes("avançado") && (
                                <span
                                  style={{
                                    fontSize: "0.6875rem",
                                    background: "#FEF3C7",
                                    color: "#92400E",
                                    padding: "0.125rem 0.5rem",
                                    borderRadius: "9999px",
                                    fontWeight: 600,
                                  }}
                                >
                                  Avançado
                                </span>
                              )}
                              {page.tags.includes("fundamental") && (
                                <span
                                  style={{
                                    fontSize: "0.6875rem",
                                    background: "#EDE9FE",
                                    color: "#5B21B6",
                                    padding: "0.125rem 0.5rem",
                                    borderRadius: "9999px",
                                    fontWeight: 600,
                                  }}
                                >
                                  Fundamental
                                </span>
                              )}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
