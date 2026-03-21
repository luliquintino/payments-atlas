"use client";

import { useState, useMemo } from "react";
import {
  RULES,
  RULE_TYPE_META,
  SEVERITY_LABELS,
  SEVERITY_COLORS,
  ALL_RULE_TYPES,
  type RuleType,
  type Severity,
  type BusinessRule,
} from "@/data/business-rules";

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function BusinessRulesPage() {
  const [search, setSearch] = useState("");
  const [expandedTypes, setExpandedTypes] = useState<Set<RuleType>>(
    new Set(ALL_RULE_TYPES),
  );
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | "all">("all");

  /** Alterna uma seção accordion de tipo de regra */
  const toggleType = (type: RuleType) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  /** Filtra regras por busca e severidade */
  const filteredByType = useMemo(() => {
    const grouped: Record<RuleType, BusinessRule[]> = {
      validation: [],
      routing: [],
      risk: [],
      compliance: [],
      operational: [],
    };

    RULES.forEach((rule) => {
      const matchesSearch =
        search === "" ||
        rule.rule_name.toLowerCase().includes(search.toLowerCase()) ||
        rule.condition.toLowerCase().includes(search.toLowerCase()) ||
        rule.expected_behavior.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity =
        selectedSeverity === "all" || rule.severity === selectedSeverity;

      if (matchesSearch && matchesSeverity) {
        grouped[rule.rule_type].push(rule);
      }
    });

    return grouped;
  }, [search, selectedSeverity]);

  const totalFiltered = Object.values(filteredByType).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
      {/* Cabeçalho da página */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Regras de Negócio</h1>
        <p className="page-description">
          Regras de processamento de pagamento organizadas por tipo: validação, roteamento, risco,
          compliance e operacional.
        </p>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Regras", value: "150+" },
          { label: "Categorias", value: "12" },
          { label: "Entidades", value: "8" },
          { label: "Validações", value: "30+" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{s.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem", opacity: 0.7 }}>
        * Numeros podem variar conforme fonte e data de consulta. Valores aproximados para fins didaticos.
      </p>

      {/* Busca e filtro de severidade */}
      <div className="animate-fade-in stagger-2 flex flex-wrap" style={{ marginBottom: "1.5rem", gap: "0.75rem" }}>
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute -translate-y-1/2" style={{ left: "0.75rem", top: "50%" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="var(--text-muted)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar regras..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
            style={{ paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
          />
        </div>

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value as Severity | "all")}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          style={{ padding: "0.5rem 0.75rem" }}
        >
          <option value="all">Todas as Severidades</option>
          <option value="info">Info</option>
          <option value="warning">Aviso</option>
          <option value="critical">Crítico</option>
          <option value="blocker">Bloqueante</option>
        </select>

        <span className="self-center text-sm text-[var(--text-muted)]">
          {totalFiltered} regra{totalFiltered !== 1 && "s"}
        </span>
      </div>

      {/* Grupos accordion */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {ALL_RULE_TYPES.map((type, typeIndex) => {
          const meta = RULE_TYPE_META[type];
          const rules = filteredByType[type];
          const isExpanded = expandedTypes.has(type);

          return (
            <div
              key={type}
              className={`card-glow animate-fade-in stagger-${Math.min(typeIndex + 2, 6)}`}
            >
              {/* Cabeçalho do accordion */}
              <button
                onClick={() => toggleType(type)}
                className="w-full flex items-center justify-between bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                style={{ padding: "1rem 1.25rem" }}
              >
                <div className="flex items-center" style={{ gap: "0.75rem" }}>
                  <span
                    className={`rounded-lg flex items-center justify-center text-sm font-bold ${meta.color}`}
                    style={{ width: "2rem", height: "2rem" }}
                  >
                    {meta.icon}
                  </span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {meta.label}
                  </span>
                  <span className="text-[13px] font-medium text-[var(--text-muted)] bg-[var(--surface-hover)] rounded-full" style={{ padding: "0.25rem 0.625rem" }}>
                    {rules.length}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`text-[var(--text-muted)] transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Corpo do accordion */}
              {isExpanded && (
                <div className="divide-y divide-[var(--border)]">
                  {rules.length === 0 ? (
                    <div className="text-center text-sm text-[var(--text-muted)]" style={{ padding: "1.5rem 1.25rem" }}>
                      Nenhuma regra corresponde aos seus filtros nesta categoria.
                    </div>
                  ) : (
                    rules.map((rule) => (
                      <div
                        key={rule.id}
                        className="hover:bg-[var(--surface-hover)] transition-colors"
                        style={{ padding: "1rem 1.25rem" }}
                      >
                        {/* Cabeçalho da regra */}
                        <div className="flex items-start justify-between" style={{ gap: "0.75rem", marginBottom: "0.5rem" }}>
                          <h3 className="font-medium text-[var(--foreground)]">
                            {rule.rule_name}
                          </h3>
                          <span
                            className={`text-[13px] font-semibold rounded-full whitespace-nowrap ${SEVERITY_COLORS[rule.severity]}`}
                            style={{ padding: "0.25rem 0.625rem" }}
                          >
                            {SEVERITY_LABELS[rule.severity]}
                          </span>
                        </div>

                        {/* Condição */}
                        <div style={{ marginBottom: "0.5rem" }}>
                          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                            Condição
                          </span>
                          <p className="text-sm text-[var(--foreground)]" style={{ marginTop: "0.125rem" }}>
                            {rule.condition}
                          </p>
                        </div>

                        {/* Comportamento esperado */}
                        <div>
                          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                            Comportamento Esperado
                          </span>
                          <p className="text-sm text-[var(--foreground)] leading-relaxed" style={{ marginTop: "0.125rem" }}>
                            {rule.expected_behavior}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Related Pages Footer */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Base de Features", href: "/knowledge/features", icon: "⚡" },
          { name: "Grafo de Dependencias", href: "/knowledge/dependency-graph", icon: "🔗" },
          { name: "Simulador", href: "/simulator", icon: "🧪" },
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
