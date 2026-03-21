"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useTrailProgress } from "@/hooks/useTrailProgress";
import MobileHeader from "./MobileHeader";

const navigation = [
  {
    section: "Explorar",
    items: [
      { name: "Mapa de Pagamentos", href: "/explore/payments-map", icon: "🗺️" },
      { name: "Trilhos de Pagamento", href: "/explore/payment-rails", icon: "🛤️" },
      { name: "Fluxos de Transação", href: "/explore/transaction-flows", icon: "🔄" },
      { name: "Mapa do Ecossistema", href: "/explore/ecosystem-map", icon: "🌐" },
      { name: "Sistema Financeiro Global", href: "/explore/financial-system", icon: "🌍" },
    ],
  },
  {
    section: "Infraestrutura Financeira",
    items: [
      { name: "Sistemas Bancários", href: "/infrastructure/banking-systems", icon: "🏛️" },
      { name: "Sistemas de Liquidação", href: "/infrastructure/settlement-systems", icon: "⚙️" },
      { name: "Liquidez & Tesouraria", href: "/infrastructure/liquidity-treasury", icon: "💰" },
    ],
  },
  {
    section: "Crypto & Web3",
    items: [
      { name: "Mapa Blockchain", href: "/crypto/blockchain-map", icon: "🔗" },
      { name: "Sistemas de Stablecoin", href: "/crypto/stablecoin-systems", icon: "🪙" },
      { name: "Protocolos DeFi", href: "/crypto/defi-protocols", icon: "🌀" },
    ],
  },
  {
    section: "Construir",
    items: [
      { name: "Base de Features", href: "/knowledge/features", icon: "📦" },
      { name: "Regras de Negócio", href: "/knowledge/business-rules", icon: "📋" },
      { name: "Grafo de Dependências", href: "/knowledge/dependency-graph", icon: "🔗" },
      { name: "Taxonomia", href: "/knowledge/taxonomy", icon: "🏷️" },
      { name: "Glossário", href: "/glossary", icon: "📖" },
    ],
  },
  {
    section: "Diagnosticar",
    items: [
      { name: "Conta Comigo", href: "/diagnostics/conta-comigo", icon: "🩺" },
      { name: "Árvore de Métricas", href: "/diagnostics/metrics-tree", icon: "📊" },
      { name: "Biblioteca de Problemas", href: "/diagnostics/problem-library", icon: "⚠️" },
    ],
  },
  {
    section: "Fraude & Risco",
    items: [
      { name: "Mapa de Fraude", href: "/fraud/fraud-map", icon: "🛡️" },
      { name: "Sinais de Fraude", href: "/fraud/fraud-signals", icon: "📡" },
      { name: "Ciclo de Chargeback", href: "/fraud/chargeback-lifecycle", icon: "⚖️" },
    ],
  },
  {
    section: "Observabilidade",
    items: [
      { name: "Dashboard", href: "/observability/payments-dashboard", icon: "📈" },
      { name: "Explorador de Eventos", href: "/observability/event-explorer", icon: "📋" },
    ],
  },
  {
    section: "Simular",
    items: [
      { name: "Simulador", href: "/simulation/payment-simulator", icon: "🧪" },
      { name: "Consultor de Arquitetura", href: "/simulation/architecture-advisor", icon: "🏗️" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getSectionProgress } = useTrailProgress();

  const toggleSection = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isInSection = (section: (typeof navigation)[0]) =>
    section.items.some((item) => pathname.startsWith(item.href));

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

  return (
    <>
      {/* Mobile header — visible only below 768px via CSS */}
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
      >
        {/* Close button (mobile only) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="sidebar-close-btn flex items-center justify-center rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          style={{ position: "absolute", top: "1rem", right: "0.75rem", width: "2rem", height: "2rem", zIndex: 10 }}
          aria-label="Fechar menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3.5 px-5 py-4 border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-lighter)] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--foreground)] leading-tight tracking-tight">
              Payments Knowledge
            </h1>
            <p className="text-[11px] text-[var(--text-muted)] leading-tight font-medium">
              Sistema de Conhecimento
            </p>
          </div>
        </Link>

        {/* Search */}
        <div className="px-3 pt-3 pb-1">
          <Link
            href="/search"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--primary-lighter)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Buscar...</span>
            <kbd className="ml-auto text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-hover)] px-1.5 py-0.5 rounded border border-[var(--border)]">
              ⌘K
            </kbd>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2.5">
          {navigation.map((group) => {
            const sectionActive = isInSection(group);
            const isCollapsed = collapsed[group.section] && !sectionActive;
            const sectionPaths = group.items.map((item) => item.href);
            const sp = getSectionProgress(sectionPaths);

            return (
              <div key={group.section} className="mb-1">
                <button
                  onClick={() => toggleSection(group.section)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <span>{group.section}</span>
                  {sp.visited > 0 && (
                    <span
                      className="badge-primary"
                      style={{
                        fontSize: "0.65rem",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "6px",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {sp.visited}/{sp.total}
                    </span>
                  )}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {!isCollapsed && (
                  <div className="mt-0.5 space-y-0.5">
                    {group.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (pathname.startsWith(item.href) && item.href !== "/");

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          title={item.name}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-medium shadow-md"
                              : "text-[var(--foreground)] hover:bg-[var(--surface-hover)] hover:translate-x-0.5"
                          }`}
                        >
                          <span className="text-sm w-5 text-center shrink-0">
                            {item.icon}
                          </span>
                          <span className="truncate">{item.name}</span>
                          {isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* AI Advisor */}
        <div className="px-3 pb-3 border-t border-[var(--border)] pt-3">
          <Link
            href="/ai/payments-advisor"
            className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
              pathname === "/ai/payments-advisor"
                ? "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-lighter)] text-white shadow-lg"
                : "bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-lighter)]/10 text-[var(--primary)] hover:from-[var(--primary)]/20 hover:to-[var(--primary-lighter)]/20 border border-[var(--primary)]/20"
            }`}
          >
            <span className="text-base">🤖</span>
            <span className="font-semibold">Consultor de Pagamentos</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
