"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getFeatureById } from "@/data/features";

/**
 * Breadcrumb — Navegação contextual automática.
 *
 * Gera breadcrumbs a partir da URL atual.
 * Suporta rotas dinâmicas como /knowledge/features/[id].
 */

const SEGMENT_LABELS: Record<string, string> = {
  explore: "Explorar",
  knowledge: "Construir",
  diagnostics: "Diagnosticar",
  simulation: "Simular",
  fraud: "Fraude & Risco",
  observability: "Observabilidade",
  ai: "IA",
  search: "Busca",
  "payments-map": "Mapa de Pagamentos",
  "payment-rails": "Trilhos de Pagamento",
  "transaction-flows": "Fluxos de Transação",
  "ecosystem-map": "Mapa do Ecossistema",
  features: "Base de Features",
  "business-rules": "Regras de Negócio",
  "dependency-graph": "Grafo de Dependências",
  taxonomy: "Taxonomia",
  "conta-comigo": "Conta Comigo",
  "metrics-tree": "Árvore de Métricas",
  "problem-library": "Biblioteca de Problemas",
  "payment-simulator": "Simulador",
  "architecture-advisor": "Conselheiro de Arquitetura",
  "payments-advisor": "Consultor de Pagamentos",
  "fraud-map": "Mapa de Fraude",
  "fraud-signals": "Sinais de Fraude",
  "chargeback-lifecycle": "Ciclo de Chargeback",
  "event-explorer": "Explorador de Eventos",
  infrastructure: "Infraestrutura Financeira",
  crypto: "Crypto & Web3",
  "banking-systems": "Sistemas Bancários",
  "settlement-systems": "Sistemas de Liquidação",
  "liquidity-treasury": "Liquidez & Tesouraria",
  "blockchain-map": "Mapa Blockchain",
  "stablecoin-systems": "Sistemas de Stablecoin",
  "defi-protocols": "Protocolos DeFi",
  "financial-system": "Sistema Financeiro Global",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const items: { label: string; href: string }[] = [
    { label: "Início", href: "/" },
  ];

  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Try to resolve label
    let label = SEGMENT_LABELS[segment];

    // If it's a dynamic segment (feature ID), try to resolve feature name
    if (!label && i > 0 && segments[i - 1] === "features") {
      const feature = getFeatureById(segment);
      label = feature?.name || segment;
    }

    if (!label) {
      label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    }

    items.push({ label, href: currentPath });
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] mb-6 animate-fade-in">
      {items.map((item, idx) => (
        <span key={item.href} className="flex items-center gap-1.5">
          {idx > 0 && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
          {idx === items.length - 1 ? (
            <span className="text-[var(--foreground)] font-medium truncate max-w-[200px]">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-[var(--primary)] transition-colors truncate max-w-[150px]"
            >
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
