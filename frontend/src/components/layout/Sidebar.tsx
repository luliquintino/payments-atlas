"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";
import MobileHeader from "./MobileHeader";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

interface ExplorarCategory {
  label: string;
  items: NavItem[];
}

const explorarCategories: ExplorarCategory[] = [
  {
    label: "Pagamentos",
    items: [
      { name: "Mapa de Pagamentos", href: "/explore/payments-map", icon: "🗺️" },
      { name: "Trilhos de Pagamento", href: "/explore/payment-rails", icon: "🛤️" },
      { name: "Fluxos de Transação", href: "/explore/transaction-flows", icon: "🔄" },
      { name: "Mapa do Ecossistema", href: "/explore/ecosystem-map", icon: "🌐" },
      { name: "Sistema Financeiro", href: "/explore/financial-system", icon: "🌍" },
    ],
  },
  {
    label: "Infraestrutura",
    items: [
      { name: "Sistemas Bancários", href: "/infrastructure/banking-systems", icon: "🏛️" },
      { name: "Sistemas de Liquidação", href: "/infrastructure/settlement-systems", icon: "⚙️" },
      { name: "Liquidez & Tesouraria", href: "/infrastructure/liquidity-treasury", icon: "💰" },
      { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing", icon: "🔁" },
    ],
  },
  {
    label: "Crypto & Web3",
    items: [
      { name: "Mapa Blockchain", href: "/crypto/blockchain-map", icon: "🔗" },
      { name: "Sistemas de Stablecoin", href: "/crypto/stablecoin-systems", icon: "🪙" },
      { name: "Protocolos DeFi", href: "/crypto/defi-protocols", icon: "🌀" },
      { name: "Crypto Avançado: L2 & Bridges", href: "/crypto/advanced-crypto", icon: "⚡" },
    ],
  },
  {
    label: "Knowledge Base",
    items: [
      { name: "Feature Discovery", href: "/knowledge/feature-discovery", icon: "🔍" },
      { name: "Base de Features", href: "/knowledge/features", icon: "📦" },
      { name: "Regras de Negócio", href: "/knowledge/business-rules", icon: "📋" },
      { name: "Grafo de Dependências", href: "/knowledge/dependency-graph", icon: "🔗" },
      { name: "Taxonomia", href: "/knowledge/taxonomy", icon: "🏷️" },
      { name: "Glossário", href: "/glossary", icon: "📖" },
      { name: "Regras de Bandeiras", href: "/knowledge/brand-rules", icon: "🏦" },
      { name: "Chargeback: Guia Completo", href: "/knowledge/chargeback-deep-dive", icon: "⚖️" },
      { name: "Antecipação de Recebíveis", href: "/knowledge/antecipacao-recebiveis", icon: "💰" },
      { name: "Parcelamento", href: "/knowledge/parcelamento", icon: "📊" },
      { name: "Crédito Estruturado", href: "/knowledge/credito-estruturado", icon: "🏦" },
      { name: "PCI Compliance", href: "/knowledge/pci-compliance", icon: "🔒" },
      { name: "Cross-Border Payments", href: "/knowledge/cross-border", icon: "🌍" },
      { name: "Webhook Patterns", href: "/knowledge/webhook-patterns", icon: "🔔" },
      { name: "Arquitetura PayFac", href: "/knowledge/payfac-architecture", icon: "🏗️" },
      { name: "Matriz Regulatória", href: "/knowledge/regulatory-matrix", icon: "⚖️" },
      { name: "Operational Excellence", href: "/knowledge/operational-excellence", icon: "🛡️" },
      { name: "Embedded Finance", href: "/knowledge/embedded-finance", icon: "🏗️" },
    ],
  },
  {
    label: "Fraude & Risco",
    items: [
      { name: "Mapa de Fraude", href: "/fraud/fraud-map", icon: "🛡️" },
      { name: "Sinais de Fraude", href: "/fraud/fraud-signals", icon: "📡" },
      { name: "Ciclo de Chargeback", href: "/fraud/chargeback-lifecycle", icon: "⚖️" },
      { name: "Fraude Avançada & ML", href: "/knowledge/advanced-fraud-ml", icon: "🤖" },
    ],
  },
  {
    label: "Diagnóstico",
    items: [
      { name: "Conta Comigo", href: "/diagnostics/conta-comigo", icon: "🩺" },
      { name: "Árvore de Métricas", href: "/diagnostics/metrics-tree", icon: "📊" },
      { name: "Biblioteca de Problemas", href: "/diagnostics/problem-library", icon: "⚠️" },
    ],
  },
];

const ferramentasItems: NavItem[] = [
  { name: "Simulador", href: "/simulation/payment-simulator", icon: "🧪" },
  { name: "Consultor de Arquitetura", href: "/simulation/architecture-advisor", icon: "🏗️" },
  { name: "Dashboard", href: "/observability/payments-dashboard", icon: "📈" },
  { name: "Explorador de Eventos", href: "/observability/event-explorer", icon: "📋" },
  { name: "Consultor AI", href: "/ai/payments-advisor", icon: "🤖" },
  { name: "Analisador de Docs", href: "/tools/document-analyzer", icon: "📄" },
];

// Check if pathname matches any item in the explorar categories
function isInExplorar(pathname: string): boolean {
  return explorarCategories.some((cat) =>
    cat.items.some((item) => pathname.startsWith(item.href))
  );
}

function isInFerramentas(pathname: string): boolean {
  return ferramentasItems.some((item) => pathname.startsWith(item.href));
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [explorarOpen, setExplorarOpen] = useState(false);
  const [ferramentasOpen, setFerramentasOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { xp, streak } = useGameProgress();

  useEffect(() => {
    const saved = localStorage.getItem("pks-theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("pks-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("pks-theme", "light");
    }
  };

  // Auto-expand if currently in a sub-section
  useEffect(() => {
    if (isInExplorar(pathname)) setExplorarOpen(true);
    if (isInFerramentas(pathname)) setFerramentasOpen(true);
  }, [pathname]);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, handleKeyDown]);

  const isActive = (href: string) =>
    pathname === href || (pathname.startsWith(href) && href !== "/");

  const linkStyle = (href: string): React.CSSProperties => ({
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
    transition: "all 0.2s",
    ...(isActive(href)
      ? {
          background: "var(--primary-bg)",
          color: "var(--primary)",
          fontWeight: 600,
        }
      : {
          color: "var(--foreground)",
        }),
  });

  const hoverProps = (href: string) =>
    isActive(href)
      ? {}
      : {
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
            e.currentTarget.style.background = "var(--surface-hover)";
          },
          onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
            e.currentTarget.style.background = "transparent";
          },
        };

  return (
    <>
      {/* Mobile header */}
      <MobileHeader onMenuToggle={() => setMobileOpen(true)} />

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-container ${mobileOpen ? "sidebar-open" : ""}`}
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="sidebar-close-btn flex items-center justify-center rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          style={{
            position: "absolute",
            top: "1rem",
            right: "0.75rem",
            width: "2rem",
            height: "2rem",
            zIndex: 10,
          }}
          aria-label="Fechar menu"
        >
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:bg-[var(--surface-hover)] transition-colors group"
          style={{
            gap: "0.875rem",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            className="rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-lighter)] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
            style={{ width: "2.25rem", height: "2.25rem" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div>
            <h1
              className="font-bold text-[var(--foreground)] leading-tight tracking-tight"
              style={{ fontSize: "0.875rem" }}
            >
              Payments Academy
            </h1>
            <p
              className="text-[var(--text-muted)] leading-tight font-medium"
              style={{ fontSize: "0.6875rem" }}
            >
              Sistema de Conhecimento
            </p>
          </div>
        </Link>

        {/* Navigation — 5 main items */}
        <nav
          className="flex-1 overflow-y-auto"
          style={{ padding: "0.5rem 0.625rem" }}
        >
          {/* 1. Home */}
          <Link
            href="/"
            style={linkStyle("/")}
            {...hoverProps("/")}
          >
            <span style={{ fontSize: "1rem", width: "1.25rem", textAlign: "center", flexShrink: 0 }}>
              🏠
            </span>
            <span>Home</span>
          </Link>

          {/* 2. Trilhas */}
          <Link
            href="/trilhas"
            style={{
              ...linkStyle("/trilhas"),
              marginTop: "0.125rem",
            }}
            {...hoverProps("/trilhas")}
          >
            <span style={{ fontSize: "1rem", width: "1.25rem", textAlign: "center", flexShrink: 0 }}>
              🗺️
            </span>
            <span>Trilhas</span>
          </Link>

          {/* 2.5 Quiz */}
          <Link
            href="/quiz"
            style={{ ...linkStyle("/quiz"), marginTop: "0.125rem" }}
            {...hoverProps("/quiz")}
          >
            <span style={{ fontSize: "1rem", width: "1.25rem", textAlign: "center", flexShrink: 0 }}>
              🧠
            </span>
            <span>Quiz</span>
          </Link>

          {/* 3. Explorar (expandable) */}
          <div style={{ marginTop: "0.125rem" }}>
            <button
              onClick={() => setExplorarOpen(!explorarOpen)}
              className="w-full flex items-center transition-colors"
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                gap: "0.625rem",
                color: isInExplorar(pathname) ? "var(--primary)" : "var(--foreground)",
                fontWeight: isInExplorar(pathname) ? 600 : 400,
                background: isInExplorar(pathname) && !explorarOpen ? "var(--primary-bg)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isInExplorar(pathname) || explorarOpen) {
                  e.currentTarget.style.background = "var(--surface-hover)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  isInExplorar(pathname) && !explorarOpen ? "var(--primary-bg)" : "transparent";
              }}
            >
              <span style={{ fontSize: "1rem", width: "1.25rem", textAlign: "center", flexShrink: 0 }}>
                🧭
              </span>
              <span className="flex-1 text-left">Explorar</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-200 ${explorarOpen ? "" : "-rotate-90"}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {explorarOpen && (
              <div style={{ marginTop: "0.25rem" }}>
                {explorarCategories.map((cat) => (
                  <div key={cat.label} style={{ marginBottom: "0.375rem" }}>
                    <div
                      style={{
                        padding: "0.25rem 0.75rem 0.25rem 2.5rem",
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--text-muted)",
                      }}
                    >
                      {cat.label}
                    </div>
                    {cat.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={item.name}
                        style={{
                          ...linkStyle(item.href),
                          paddingLeft: "2.5rem",
                          fontSize: "0.8125rem",
                        }}
                        {...hoverProps(item.href)}
                      >
                        <span
                          style={{
                            fontSize: "0.875rem",
                            width: "1.125rem",
                            textAlign: "center",
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Ferramentas (expandable) */}
          <div style={{ marginTop: "0.125rem" }}>
            <button
              onClick={() => setFerramentasOpen(!ferramentasOpen)}
              className="w-full flex items-center transition-colors"
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                gap: "0.625rem",
                color: isInFerramentas(pathname) ? "var(--primary)" : "var(--foreground)",
                fontWeight: isInFerramentas(pathname) ? 600 : 400,
                background:
                  isInFerramentas(pathname) && !ferramentasOpen
                    ? "var(--primary-bg)"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isInFerramentas(pathname) || ferramentasOpen) {
                  e.currentTarget.style.background = "var(--surface-hover)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  isInFerramentas(pathname) && !ferramentasOpen
                    ? "var(--primary-bg)"
                    : "transparent";
              }}
            >
              <span style={{ fontSize: "1rem", width: "1.25rem", textAlign: "center", flexShrink: 0 }}>
                🔧
              </span>
              <span className="flex-1 text-left">Ferramentas</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-200 ${ferramentasOpen ? "" : "-rotate-90"}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {ferramentasOpen && (
              <div style={{ marginTop: "0.25rem" }}>
                {ferramentasItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.name}
                    style={{
                      ...linkStyle(item.href),
                      paddingLeft: "2.5rem",
                      fontSize: "0.8125rem",
                    }}
                    {...hoverProps(item.href)}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        width: "1.125rem",
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 5. Buscar */}
          <Link
            href="/search"
            style={{ ...linkStyle("/search"), marginTop: "0.125rem" }}
            {...hoverProps("/search")}
          >
            <span style={{ fontSize: "1rem", width: "1.25rem", textAlign: "center", flexShrink: 0 }}>
              🔍
            </span>
            <span>Buscar</span>
          </Link>
        </nav>

        {/* Footer — XP, Streak, Progress link */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "0.75rem 1rem",
          }}
        >
          <button
            onClick={toggleDarkMode}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
              background: "var(--surface-hover)",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              cursor: "pointer",
              width: "100%",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.875rem" }}>{isDark ? "☀️" : "🌙"}</span>
            <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>
          </button>
          <div className="flex items-center" style={{ gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="xp-badge" style={{ fontSize: "0.75rem" }}>
              ⚡ {xp} XP
            </span>
            <span className="streak-badge" style={{ fontSize: "0.75rem" }}>
              🔥 {streak.count} dias
            </span>
          </div>
          <div className="flex items-center" style={{ gap: "0.5rem" }}>
            <Link
              href="/progress"
              className="text-[var(--primary)] hover:underline"
              style={{ fontSize: "0.8125rem", fontWeight: 500 }}
            >
              Meu Progresso
            </Link>
            <span style={{ color: "var(--border)" }}>·</span>
            <Link
              href="/auth/profile"
              className="text-[var(--text-muted)] hover:text-[var(--primary)] hover:underline"
              style={{ fontSize: "0.8125rem", fontWeight: 500 }}
            >
              Perfil
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
