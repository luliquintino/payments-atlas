"use client";

import { useState, useMemo } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ComparisonColumn {
  key: string;
  label: string;
}

export interface ComparisonRow {
  label: string;
  values: Record<string, string>;
  highlight?: boolean;
}

export interface ComparisonTableProps {
  title: string;
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  sortable?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BEST_KEYWORDS = ["melhor", "mais rapido", "menor", "sim", "gratis", "zero", "instantaneo"];
const WORST_KEYWORDS = ["pior", "mais lento", "maior", "nao", "alto", "caro"];

function detectBadge(value: string): "best" | "worst" | null {
  const lower = value.toLowerCase();
  if (BEST_KEYWORDS.some((k) => lower.includes(k))) return "best";
  if (WORST_KEYWORDS.some((k) => lower.includes(k))) return "worst";
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ComparisonTable({
  title,
  columns,
  rows,
  sortable = false,
}: ComparisonTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleSort = (key: string) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const aVal = (a.values[sortKey] || a.label).toLowerCase();
      const bVal = (b.values[sortKey] || b.label).toLowerCase();
      const cmp = aVal.localeCompare(bVal, "pt-BR", { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  return (
    <div className="card-glow animate-fade-in" style={{ marginBottom: "1.5rem" }}>
      {/* Title */}
      <div style={{ padding: "1rem 1.25rem 0.75rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--foreground)",
          }}
        >
          {title}
        </h3>
      </div>

      {/* Scrollable table container */}
      <div
        style={{
          overflowX: "auto",
          padding: "0 0 0.5rem",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: `${120 + columns.length * 160}px`,
            borderCollapse: "collapse",
            fontSize: "0.8125rem",
          }}
        >
          <thead>
            <tr>
              {/* Sticky first column header */}
              <th
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  background: "var(--surface)",
                  padding: "0.625rem 1rem",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--text-muted)",
                  borderBottom: "2px solid var(--border)",
                  whiteSpace: "nowrap",
                }}
              >
                &nbsp;
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    padding: "0.625rem 1rem",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: sortKey === col.key ? "var(--primary)" : "var(--text-muted)",
                    borderBottom: "2px solid var(--border)",
                    cursor: sortable ? "pointer" : "default",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    transition: "color 0.15s",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    {col.label}
                    {sortable && sortKey === col.key && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="var(--primary)">
                        {sortDir === "asc" ? (
                          <polygon points="5,2 9,8 1,8" />
                        ) : (
                          <polygon points="5,8 9,2 1,2" />
                        )}
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, rowIdx) => {
              const isHovered = hoveredRow === rowIdx;
              return (
                <tr
                  key={row.label}
                  onMouseEnter={() => setHoveredRow(rowIdx)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: isHovered
                      ? "var(--surface-hover)"
                      : row.highlight
                        ? "var(--primary-bg)"
                        : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Sticky first column: row label */}
                  <td
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      background: isHovered
                        ? "var(--surface-hover)"
                        : row.highlight
                          ? "var(--primary-bg)"
                          : "var(--surface)",
                      padding: "0.625rem 1rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      borderBottom: "1px solid var(--border)",
                      whiteSpace: "nowrap",
                      transition: "background 0.15s",
                    }}
                  >
                    {row.label}
                  </td>
                  {columns.map((col) => {
                    const val = row.values[col.key] || "—";
                    const badge = detectBadge(val);
                    return (
                      <td
                        key={col.key}
                        style={{
                          padding: "0.625rem 1rem",
                          color: "var(--text-muted)",
                          borderBottom: "1px solid var(--border)",
                          lineHeight: 1.4,
                        }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                          {val}
                          {badge === "best" && (
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0.125rem 0.375rem",
                                borderRadius: "0.25rem",
                                fontSize: "0.625rem",
                                fontWeight: 700,
                                background: "rgba(16, 185, 129, 0.15)",
                                color: "#10b981",
                              }}
                            >
                              Melhor
                            </span>
                          )}
                          {badge === "worst" && (
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0.125rem 0.375rem",
                                borderRadius: "0.25rem",
                                fontSize: "0.625rem",
                                fontWeight: 700,
                                background: "rgba(239, 68, 68, 0.15)",
                                color: "#ef4444",
                              }}
                            >
                              Pior
                            </span>
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
