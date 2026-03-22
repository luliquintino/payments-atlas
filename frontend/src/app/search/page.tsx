"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  searchAll,
  getSearchIndex,
  TYPE_LABELS,
  TYPE_ICONS,
  TYPE_COLORS,
  type SearchResultType,
} from "@/lib/search-index";

/**
 * Busca Global — busca unificada em features, glossário, regras,
 * problemas, trilhos, fluxos, métricas e páginas.
 */

const FILTER_TYPES: SearchResultType[] = [
  "feature",
  "glossary",
  "rule",
  "page",
  "problem",
  "rail",
  "flow",
  "metric",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<SearchResultType | null>(null);

  const indexSize = useMemo(() => getSearchIndex().length, []);

  const results = useMemo(() => {
    if (!query && !typeFilter) return [];
    return searchAll(query, typeFilter);
  }, [query, typeFilter]);

  const showResults = query.length > 0 || !!typeFilter;

  return (
    <div className="max-w-4xl" style={{ margin: "0 auto" }}>
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Buscar</h1>
        <p className="page-description">
          Busque em features, glossário, regras de negócio, problemas, trilhos, fluxos e mais.
        </p>
      </div>

      {/* Stats */}
      <div
        className="animate-fade-in stagger-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        {[
          { label: "Índice Total", value: indexSize },
          { label: "Categorias", value: FILTER_TYPES.length },
          { label: "Páginas", value: "27" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{s.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "1.25rem", fontStyle: "italic" }}>
        Dica: Use <kbd style={{ fontFamily: "monospace", background: "var(--surface-hover)", padding: "0.1rem 0.3rem", borderRadius: "4px", border: "1px solid var(--border)" }}>⌘K</kbd> para busca rápida de qualquer página.
      </p>

      {/* Search Input */}
      <div className="animate-fade-in stagger-2" style={{ position: "relative", marginBottom: "1rem" }}>
        <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar qualquer coisa... (ex: tokenização, interchange, PIX)"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
          style={{ paddingLeft: "2.75rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", fontSize: "1rem" }}
          autoFocus
        />
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap animate-fade-in stagger-3" style={{ gap: "0.5rem", marginBottom: "1.5rem" }}>
        {FILTER_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(typeFilter === type ? null : type)}
            className="text-sm font-medium transition-colors rounded-lg"
            style={{
              padding: "0.5rem 0.875rem",
              border: typeFilter === type ? "none" : "1px solid var(--border)",
              background: typeFilter === type ? "var(--primary)" : "transparent",
              color: typeFilter === type ? "#fff" : "var(--foreground)",
              cursor: "pointer",
            }}
          >
            {TYPE_ICONS[type]} {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Results */}
      {showResults && (
        <div style={{ overflow: "visible", minHeight: results.length > 0 ? "120px" : "auto" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            {results.length} resultado{results.length !== 1 ? "s" : ""}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", overflow: "visible" }}>
            {results.map((item) => {
              const colorStyle = TYPE_COLORS[item.type];
              return (
                <Link key={item.id} href={item.href}>
                  <div className="card-flat transition-all hover:border-[var(--primary)]/30" style={{ cursor: "pointer" }}>
                    <div className="flex items-start" style={{ gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.25rem", marginTop: "0.125rem" }}>{TYPE_ICONS[item.type]}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center flex-wrap" style={{ gap: "0.5rem", marginBottom: "0.25rem" }}>
                          <h3 className="font-semibold">{item.name}</h3>
                          <span
                            className="text-[11px] font-semibold rounded-full whitespace-nowrap"
                            style={{ padding: "0.125rem 0.5rem", ...colorStyle }}
                          >
                            {TYPE_LABELS[item.type]}
                          </span>
                          {item.category && (
                            <span
                              className="text-[11px] font-medium rounded-full whitespace-nowrap"
                              style={{
                                padding: "0.125rem 0.5rem",
                                background: "var(--surface-hover)",
                                color: "var(--text-muted)",
                              }}
                            >
                              {item.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty states */}
      {!showResults && (
        <div className="text-center animate-fade-in stagger-4" style={{ padding: "4rem 0", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p>
          <p className="text-lg font-medium" style={{ marginBottom: "0.5rem" }}>Comece a digitar para buscar</p>
          <p className="text-sm">
            Busque em {indexSize} itens incluindo features, glossário, regras e mais
          </p>
        </div>
      )}

      {showResults && results.length === 0 && (
        <div className="text-center" style={{ padding: "3rem 0", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Nenhum resultado encontrado</p>
          <p className="text-sm">Tente um termo de busca ou filtro diferente</p>
        </div>
      )}

      {/* Related Pages */}
      <div className="divider-text animate-fade-in stagger-5" style={{ marginTop: "2rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.75rem", marginTop: "1rem" }}>
        {[
          { label: "Base de Features", href: "/knowledge/features", icon: "📦" },
          { label: "Glossário", href: "/glossary", icon: "📖" },
          { label: "Mapa de Pagamentos", href: "/explore/payments-map", icon: "🗺️" },
        ].map((p) => (
          <Link key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.label}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
