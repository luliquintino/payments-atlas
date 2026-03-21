"use client";

import { useState, useMemo } from "react";
import {
  GLOSSARY_TERMS,
  CATEGORY_META,
  ALL_CATEGORIES,
  getAlphabetLetters,
  type GlossaryCategory,
  type GlossaryTerm,
} from "@/data/glossary";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | "all">("all");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const letters = useMemo(() => getAlphabetLetters(), []);

  const filtered = useMemo(() => {
    return GLOSSARY_TERMS.filter((t) => {
      const matchesSearch =
        search === "" ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase()) ||
        t.aliases.some((a) => a.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        selectedCategory === "all" || t.category === selectedCategory;
      const matchesLetter =
        !activeLetter || t.term[0].toUpperCase() === activeLetter;
      return matchesSearch && matchesCategory && matchesLetter;
    }).sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
  }, [search, selectedCategory, activeLetter]);

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    filtered.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    });
    return map;
  }, [filtered]);

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Glossário de Pagamentos
        </h1>
        <p className="page-description">
          Termos essenciais do ecossistema de pagamentos, infraestrutura financeira, segurança,
          regulação, crypto e gestão de risco.
        </p>
      </div>

      {/* Stats */}
      <div
        className="animate-fade-in stagger-1"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}
      >
        {[
          { label: "Termos", value: GLOSSARY_TERMS.length },
          { label: "Categorias", value: ALL_CATEGORIES.length },
          { label: "Filtrados", value: filtered.length },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search + Category filter */}
      <div
        className="animate-fade-in stagger-2 flex flex-wrap"
        style={{ marginBottom: "1.5rem", gap: "0.75rem" }}
      >
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute -translate-y-1/2" style={{ left: "0.75rem", top: "50%" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar termos, definições, aliases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
            style={{ paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as GlossaryCategory | "all")}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          style={{ padding: "0.5rem 0.75rem" }}
        >
          <option value="all">Todas as Categorias</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_META[cat].label}
            </option>
          ))}
        </select>
      </div>

      {/* A-Z navigation */}
      <div
        className="animate-fade-in stagger-2 flex flex-wrap"
        style={{ gap: "0.375rem", marginBottom: "1.5rem" }}
      >
        <button
          onClick={() => setActiveLetter(null)}
          className={`rounded-lg text-xs font-semibold transition-all ${
            !activeLetter
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
          }`}
          style={{ padding: "0.375rem 0.625rem", border: "1px solid var(--border)" }}
        >
          Todos
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
            className={`rounded-lg text-xs font-semibold transition-all ${
              activeLetter === letter
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
            }`}
            style={{ padding: "0.375rem 0.625rem", border: "1px solid var(--border)", minWidth: "2rem", textAlign: "center" }}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Terms grouped by letter */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {Object.keys(grouped).sort().map((letter) => (
          <div key={letter} className="animate-fade-in">
            <div className="flex items-center" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span
                className="flex items-center justify-center rounded-lg text-sm font-bold bg-[var(--primary)] text-white"
                style={{ width: "2rem", height: "2rem" }}
              >
                {letter}
              </span>
              <div className="flex-1" style={{ height: "1px", background: "var(--border)" }} />
              <span className="text-xs text-[var(--text-muted)]">
                {grouped[letter].length} termo{grouped[letter].length !== 1 ? "s" : ""}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {grouped[letter].map((t) => {
                const catMeta = CATEGORY_META[t.category];
                return (
                  <div
                    key={t.id}
                    id={t.id}
                    className="card-glow hover:border-[var(--primary)]/30 transition-all"
                    style={{ padding: "1.25rem" }}
                  >
                    {/* Term header */}
                    <div className="flex items-start justify-between" style={{ gap: "0.75rem", marginBottom: "0.5rem" }}>
                      <h3 className="font-semibold text-[var(--foreground)]" style={{ fontSize: "1rem" }}>
                        {t.term}
                      </h3>
                      <span
                        className={`text-[11px] font-semibold rounded-full whitespace-nowrap ${catMeta.color}`}
                        style={{ padding: "0.25rem 0.625rem" }}
                      >
                        {catMeta.label}
                      </span>
                    </div>

                    {/* Definition */}
                    <p className="text-sm text-[var(--foreground)] leading-relaxed" style={{ marginBottom: "0.75rem" }}>
                      {t.definition}
                    </p>

                    {/* Aliases */}
                    {t.aliases.length > 0 && (
                      <div className="flex flex-wrap items-center" style={{ gap: "0.375rem", marginBottom: "0.5rem" }}>
                        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          Aliases:
                        </span>
                        {t.aliases.map((a) => (
                          <span
                            key={a}
                            className="chip-muted"
                            style={{ fontSize: "0.75rem", padding: "0.125rem 0.5rem" }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Related terms */}
                    {t.relatedTerms.length > 0 && (
                      <div className="flex flex-wrap items-center" style={{ gap: "0.375rem" }}>
                        <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          Relacionados:
                        </span>
                        {t.relatedTerms.map((relId) => {
                          const relTerm = GLOSSARY_TERMS.find((gt) => gt.id === relId);
                          if (!relTerm) return null;
                          return (
                            <a
                              key={relId}
                              href={`#${relId}`}
                              className="text-xs font-medium text-[var(--primary)] hover:underline"
                            >
                              {relTerm.term}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="card-flat text-center" style={{ padding: "3rem 1.5rem" }}>
            <p className="text-sm text-[var(--text-muted)]">
              Nenhum termo encontrado para os filtros selecionados.
            </p>
          </div>
        )}
      </div>

      {/* Related Pages Footer */}
      <div className="divider-text animate-fade-in" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Regras de Negócio", href: "/knowledge/business-rules", icon: "📋" },
          { name: "Base de Features", href: "/knowledge/features", icon: "📦" },
          { name: "Trilhos de Pagamento", href: "/explore/payment-rails", icon: "🛤️" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
