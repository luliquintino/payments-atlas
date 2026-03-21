"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface RecentPage {
  path: string;
  title: string;
  timestamp: number;
}

const STORAGE_KEY = "pks-recent-pages";
const MAX_RECENT = 6;

const PAGE_TITLES: Record<string, string> = {
  "/explore/payments-map": "Mapa de Pagamentos",
  "/explore/payment-rails": "Trilhos de Pagamento",
  "/explore/transaction-flows": "Fluxos de Transação",
  "/explore/ecosystem-map": "Mapa do Ecossistema",
  "/knowledge/features": "Base de Features",
  "/knowledge/business-rules": "Regras de Negócio",
  "/knowledge/dependency-graph": "Grafo de Dependências",
  "/knowledge/taxonomy": "Taxonomia",
  "/diagnostics/conta-comigo": "Conta Comigo",
  "/diagnostics/metrics-tree": "Árvore de Métricas",
  "/diagnostics/problem-library": "Biblioteca de Problemas",
  "/simulation/payment-simulator": "Simulador de Pagamentos",
  "/simulation/architecture-advisor": "Conselheiro de Arquitetura",
  "/ai/payments-advisor": "Consultor de Pagamentos",
  "/fraud/fraud-map": "Mapa de Fraude",
  "/fraud/fraud-signals": "Sinais de Fraude",
  "/fraud/chargeback-lifecycle": "Ciclo de Chargeback",
  "/observability/payments-dashboard": "Dashboard de Pagamentos",
  "/observability/event-explorer": "Explorador de Eventos",
};

/**
 * Hook que rastreia páginas visitadas recentemente via localStorage.
 * Retorna as últimas N páginas visitadas (excluindo a home e a página atual).
 */
export function useRecentPages() {
  const pathname = usePathname();
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);

  // Track current page
  useEffect(() => {
    if (pathname === "/" || pathname === "") return;

    const title = PAGE_TITLES[pathname];
    if (!title) return; // Don't track unknown pages

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const pages: RecentPage[] = stored ? JSON.parse(stored) : [];

      // Remove existing entry for this path
      const filtered = pages.filter((p) => p.path !== pathname);

      // Add to front
      const updated = [
        { path: pathname, title, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_RECENT);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentPages(updated);
    } catch {
      // localStorage not available
    }
  }, [pathname]);

  // Load on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentPages(JSON.parse(stored));
      }
    } catch {
      // localStorage not available
    }
  }, []);

  // Return pages excluding current
  return recentPages.filter((p) => p.path !== pathname);
}
