"use client";

import { useState, useMemo } from "react";
import {
  BRAND_RULES,
  BRAND_META,
  CATEGORY_META,
  SEVERITY_META,
  BRAND_COMPARISONS,
  ALL_BRANDS,
  ALL_CATEGORIES,
  type Brand,
  type RuleCategory,
  type BrandRule,
} from "@/data/brand-rules";

// ---------------------------------------------------------------------------
// Brand SVG icons (simplified logos)
// ---------------------------------------------------------------------------

function BrandIcon({ brand, size = 24 }: { brand: Brand; size?: number }) {
  const meta = BRAND_META[brand];
  const fontSize = size * 0.38;
  const letters: Record<Brand, string> = {
    visa: "V",
    mastercard: "MC",
    elo: "ELO",
    diners: "DC",
    amex: "AX",
    hipercard: "HC",
  };
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.2,
        background: meta.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 800,
        fontSize,
        letterSpacing: "-0.02em",
        flexShrink: 0,
      }}
    >
      {letters[brand]}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Expandable rule card
// ---------------------------------------------------------------------------

function RuleCard({ rule }: { rule: BrandRule }) {
  const [open, setOpen] = useState(false);
  const sev = SEVERITY_META[rule.severity];
  const brandMeta = BRAND_META[rule.brand];
  const catMeta = CATEGORY_META[rule.category];

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: "0.75rem",
        borderLeft: `4px solid ${sev.color}`,
        boxShadow: "var(--card-shadow)",
        transition: "box-shadow 0.2s, transform 0.15s",
        cursor: "pointer",
      }}
      onClick={() => setOpen((o) => !o)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--card-shadow-hover)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--card-shadow)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
        }}
      >
        {/* Severity emoji */}
        <span style={{ fontSize: "1.25rem", lineHeight: 1, marginTop: "0.1rem" }}>
          {sev.emoji}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "0.25rem",
            }}
          >
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--foreground)",
                lineHeight: 1.3,
              }}
            >
              {rule.title}
            </h3>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              lineHeight: 1.5,
              marginBottom: "0.5rem",
            }}
          >
            {rule.description}
          </p>

          {/* Badges */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.65rem",
                fontWeight: 700,
                padding: "0.15rem 0.5rem",
                borderRadius: "9999px",
                background: brandMeta.color,
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {brandMeta.label}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.2rem",
                fontSize: "0.65rem",
                fontWeight: 600,
                padding: "0.15rem 0.5rem",
                borderRadius: "9999px",
                background: "var(--surface-hover)",
                color: "var(--text-muted)",
              }}
            >
              {catMeta.icon} {catMeta.label}
            </span>
            <span
              style={{
                fontSize: "0.6rem",
                color: "var(--text-light)",
                marginLeft: "auto",
              }}
            >
              {rule.source} &middot; {rule.lastUpdated}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0,
            marginTop: "0.2rem",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Expandable details */}
      {open && (
        <div
          style={{
            padding: "0 1.25rem 1rem 3.25rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              paddingTop: "0.75rem",
              margin: 0,
            }}
          >
            {rule.details.map((d, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--foreground)",
                  lineHeight: 1.6,
                  paddingBottom: "0.5rem",
                  marginBottom: "0.15rem",
                }}
              >
                <span
                  style={{
                    color: sev.color,
                    fontWeight: 700,
                    marginTop: "0.15rem",
                    flexShrink: 0,
                  }}
                >
                  &bull;
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Comparison table
// ---------------------------------------------------------------------------

function ComparisonTable() {
  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: "0.75rem",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.78rem",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                borderBottom: "2px solid var(--border)",
                color: "var(--text-muted)",
                fontWeight: 700,
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                position: "sticky",
                left: 0,
                background: "var(--surface)",
                zIndex: 1,
                minWidth: "180px",
              }}
            >
              Metrica
            </th>
            {ALL_BRANDS.map((b) => {
              const meta = BRAND_META[b];
              return (
                <th
                  key={b}
                  style={{
                    textAlign: "center",
                    padding: "0.75rem 0.5rem",
                    borderBottom: "2px solid var(--border)",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    color: meta.color,
                    minWidth: "110px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                    <BrandIcon brand={b} size={28} />
                    {meta.label}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {BRAND_COMPARISONS.map((row, idx) => (
            <tr
              key={row.metric}
              style={{
                background: idx % 2 === 0 ? "transparent" : "var(--surface-hover)",
              }}
            >
              <td
                style={{
                  padding: "0.6rem 1rem",
                  borderBottom: "1px solid var(--border)",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  position: "sticky",
                  left: 0,
                  background: idx % 2 === 0 ? "var(--surface)" : "var(--surface-hover)",
                  zIndex: 1,
                }}
              >
                {row.metric}
              </td>
              {ALL_BRANDS.map((b) => (
                <td
                  key={b}
                  style={{
                    padding: "0.6rem 0.5rem",
                    borderBottom: "1px solid var(--border)",
                    textAlign: "center",
                    color: "var(--foreground)",
                  }}
                >
                  {row[b]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function BrandRulesPage() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | "all">("all");
  const [selectedCategories, setSelectedCategories] = useState<Set<RuleCategory>>(new Set());
  const [search, setSearch] = useState("");

  const toggleCategory = (cat: RuleCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Filter rules
  const filteredRules = useMemo(() => {
    return BRAND_RULES.filter((r) => {
      if (selectedBrand !== "all" && r.brand !== selectedBrand) return false;
      if (selectedCategories.size > 0 && !selectedCategories.has(r.category)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.details.some((d) => d.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedBrand, selectedCategories, search]);

  // Group by brand for display
  const grouped = useMemo(() => {
    const map = new Map<Brand, BrandRule[]>();
    for (const r of filteredRules) {
      if (!map.has(r.brand)) map.set(r.brand, []);
      map.get(r.brand)!.push(r);
    }
    return map;
  }, [filteredRules]);

  // Stats
  const stats = useMemo(() => {
    const brands = new Set(filteredRules.map((r) => r.brand));
    const critical = filteredRules.filter((r) => r.severity === "critical").length;
    return {
      total: filteredRules.length,
      brands: brands.size,
      critical,
      categories: new Set(filteredRules.map((r) => r.category)).size,
    };
  }, [filteredRules]);

  const showComparison = selectedBrand === "all" && selectedCategories.size === 0 && !search;

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Regras de Bandeiras
        </h1>
        <p className="page-description">
          Regras detalhadas de cada bandeira de cartao: chargeback, autorizacao, liquidacao,
          compliance, fraude, precificacao, tokenizacao e recorrencia.
        </p>
      </div>

      {/* Learning objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "var(--primary)",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          O que voce vai aprender
        </p>
        <ul>
          <li>Programas de monitoramento de chargeback e fraude por bandeira</li>
          <li>Requisitos de autorizacao, tokenizacao e 3D Secure</li>
          <li>Regras de liquidacao, interchange e parcelamento</li>
        </ul>
      </div>

      {/* Stats */}
      <div
        className="animate-fade-in stagger-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: "Regras", value: stats.total },
          { label: "Bandeiras", value: stats.brands },
          { label: "Criticas", value: stats.critical },
          { label: "Categorias", value: stats.categories },
        ].map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ padding: "1rem", textAlign: "center" }}
          >
            <div
              className="metric-value"
              style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Brand selector tabs */}
      <div
        className="animate-fade-in stagger-2"
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "var(--background)",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
        }}
      >
        {/* "Todas" tab */}
        <button
          onClick={() => setSelectedBrand("all")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "0.5rem",
            border: `2px solid ${selectedBrand === "all" ? "var(--primary)" : "var(--border)"}`,
            background: selectedBrand === "all" ? "var(--primary-bg)" : "var(--surface)",
            color: selectedBrand === "all" ? "var(--primary)" : "var(--text-muted)",
            fontWeight: 700,
            fontSize: "0.78rem",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: "1rem" }}>&#x2630;</span>
          Todas
        </button>

        {ALL_BRANDS.map((b) => {
          const meta = BRAND_META[b];
          const isActive = selectedBrand === b;
          return (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 0.85rem",
                borderRadius: "0.5rem",
                border: `2px solid ${isActive ? meta.color : "var(--border)"}`,
                background: isActive ? `${meta.color}18` : "var(--surface)",
                color: isActive ? meta.color : "var(--text-muted)",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <BrandIcon brand={b} size={22} />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Category filter pills */}
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          flexWrap: "wrap",
          marginBottom: "1.25rem",
        }}
      >
        {ALL_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const isActive = selectedCategories.has(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.3rem 0.65rem",
                borderRadius: "9999px",
                border: `1.5px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
                background: isActive ? "var(--primary-bg)" : "transparent",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.72rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span>{meta.icon}</span>
              {meta.label}
            </button>
          );
        })}
        {selectedCategories.size > 0 && (
          <button
            onClick={() => setSelectedCategories(new Set())}
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "9999px",
              border: "1.5px solid var(--border)",
              background: "transparent",
              color: "var(--text-light)",
              fontWeight: 600,
              fontSize: "0.72rem",
              cursor: "pointer",
            }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1.5rem", position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
          placeholder="Buscar regras por titulo, descricao ou detalhe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            paddingLeft: "2.5rem",
            paddingRight: "1rem",
            paddingTop: "0.7rem",
            paddingBottom: "0.7rem",
            borderRadius: "0.75rem",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
            fontSize: "0.85rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Comparison table (when "Todas" is selected with no filters) */}
      {showComparison && (
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>&#x2194;</span>
            Comparativo entre Bandeiras
          </h2>
          <ComparisonTable />
        </div>
      )}

      {/* Rules list */}
      {filteredRules.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1rem",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>&#x1F50D;</div>
          <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>Nenhuma regra encontrada</p>
          <p style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
            Tente ajustar os filtros ou o termo de busca.
          </p>
        </div>
      ) : selectedBrand !== "all" ? (
        /* Single brand: flat list */
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
          {filteredRules.map((r) => (
            <RuleCard key={r.id} rule={r} />
          ))}
        </div>
      ) : (
        /* All brands: grouped by brand */
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "2rem" }}>
          {Array.from(grouped.entries()).map(([brand, rules]) => {
            const meta = BRAND_META[brand];
            return (
              <div key={brand}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginBottom: "0.75rem",
                    paddingBottom: "0.5rem",
                    borderBottom: `2px solid ${meta.color}30`,
                  }}
                >
                  <BrandIcon brand={brand} size={30} />
                  <h2
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    {meta.label}
                  </h2>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      background: "var(--surface-hover)",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {rules.length} regra{rules.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {rules.map((r) => (
                    <RuleCard key={r.id} rule={r} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderRadius: "0.75rem",
          background: "var(--surface-hover)",
          border: "1px solid var(--border)",
          marginBottom: "2rem",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          <strong>Aviso:</strong> Estas regras sao baseadas em documentacao publica das bandeiras e
          tem carater informativo/didatico. Valores, limiares e prazos podem variar conforme
          regiao, contrato e atualizacoes das bandeiras. Sempre consulte a documentacao oficial
          mais recente de cada bandeira para decisoes operacionais.
        </p>
      </div>
    </div>
  );
}
