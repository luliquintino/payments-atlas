"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";

/* ------------------------------------------------------------------ */
/*  PSP data                                                           */
/* ------------------------------------------------------------------ */
type PSPType = "Adquirente" | "Sub-adquirente" | "PSP Global";

interface PSP {
  name: string;
  tipo: PSPType;
  mdrCredito: string;
  mdrDebito: string;
  pix: string;
  settlement: string;
  api: string;
  sdkMobile: boolean;
  split: boolean;
  antecipacao: string;
  idealPara: string;
}

const PSPS: PSP[] = [
  {
    name: "Cielo",
    tipo: "Adquirente",
    mdrCredito: "2,49%",
    mdrDebito: "1,19%",
    pix: "Gratis",
    settlement: "D+1",
    api: "REST",
    sdkMobile: true,
    split: true,
    antecipacao: "D+1",
    idealPara: "Grandes varejistas com alto volume e necessidade de presencial + online.",
  },
  {
    name: "Rede",
    tipo: "Adquirente",
    mdrCredito: "2,39%",
    mdrDebito: "1,09%",
    pix: "Gratis",
    settlement: "D+1",
    api: "REST",
    sdkMobile: true,
    split: false,
    antecipacao: "D+1",
    idealPara: "Clientes Itau que buscam taxas competitivas e integracao bancaria.",
  },
  {
    name: "Stone",
    tipo: "Adquirente",
    mdrCredito: "2,59%",
    mdrDebito: "1,29%",
    pix: "0,89%",
    settlement: "D+1",
    api: "REST",
    sdkMobile: true,
    split: true,
    antecipacao: "D+0",
    idealPara: "PMEs que valorizam atendimento e antecipacao automatica D+0.",
  },
  {
    name: "PagSeguro",
    tipo: "Sub-adquirente",
    mdrCredito: "3,99%",
    mdrDebito: "1,99%",
    pix: "Gratis",
    settlement: "D+14",
    api: "REST",
    sdkMobile: true,
    split: false,
    antecipacao: "D+1",
    idealPara: "Microempreendedores e vendedores informais, setup rapido sem analise.",
  },
  {
    name: "Mercado Pago",
    tipo: "Sub-adquirente",
    mdrCredito: "4,49%",
    mdrDebito: "1,99%",
    pix: "Gratis",
    settlement: "D+14",
    api: "REST",
    sdkMobile: true,
    split: true,
    antecipacao: "D+1",
    idealPara: "Sellers no Mercado Livre e e-commerces que usam checkout transparente.",
  },
  {
    name: "Adyen",
    tipo: "PSP Global",
    mdrCredito: "IC++",
    mdrDebito: "IC++",
    pix: "Gratis",
    settlement: "D+2",
    api: "REST/GraphQL",
    sdkMobile: true,
    split: true,
    antecipacao: "Custom",
    idealPara: "Enterprise com operacao global, multi-pais, multi-moeda. Volume >R$ 10M/mes.",
  },
  {
    name: "Stripe",
    tipo: "PSP Global",
    mdrCredito: "3,99%",
    mdrDebito: "3,99%",
    pix: "1,50%",
    settlement: "D+2",
    api: "REST",
    sdkMobile: true,
    split: true,
    antecipacao: "Custom",
    idealPara: "Startups e SaaS com foco em developer experience e pagamentos internacionais.",
  },
  {
    name: "Pagar.me",
    tipo: "Sub-adquirente",
    mdrCredito: "2,99%",
    mdrDebito: "1,39%",
    pix: "0,69%",
    settlement: "D+2",
    api: "REST",
    sdkMobile: true,
    split: true,
    antecipacao: "D+1",
    idealPara: "Marketplaces e plataformas que precisam de split automatico e boa API.",
  },
];

const TIPOS: PSPType[] = ["Adquirente", "Sub-adquirente", "PSP Global"];

type SortKey = keyof PSP;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function PSPComparatorPage() {
  const { visitPage } = useGameProgress();
  useEffect(() => { visitPage("/tools/psp-comparator"); }, [visitPage]);

  const [filterTipo, setFilterTipo] = useState<PSPType | "Todos">("Todos");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filtered = useMemo(() => {
    let list = filterTipo === "Todos" ? [...PSPS] : PSPS.filter((p) => p.tipo === filterTipo);
    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      if (typeof av === "boolean" && typeof bv === "boolean") {
        return sortAsc ? (av === bv ? 0 : av ? -1 : 1) : (av === bv ? 0 : av ? 1 : -1);
      }
      return 0;
    });
    return list;
  }, [filterTipo, sortKey, sortAsc]);

  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--surface)",
    borderRadius: "14px",
    padding: "1.5rem",
    border: "1px solid var(--border)",
    ...extra,
  });

  const thStyle = (key: SortKey): React.CSSProperties => ({
    textAlign: "left",
    padding: "0.6rem 0.75rem",
    borderBottom: "2px solid var(--border)",
    color: sortKey === key ? "var(--primary)" : "var(--text-muted)",
    fontWeight: 600,
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
  });

  const tdStyle: React.CSSProperties = {
    padding: "0.6rem 0.75rem",
    color: "var(--foreground)",
    fontSize: "0.85rem",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  };

  const tipoColor = (tipo: PSPType) => {
    switch (tipo) {
      case "Adquirente": return { bg: "rgba(99, 102, 241, 0.1)", color: "var(--primary)" };
      case "Sub-adquirente": return { bg: "rgba(245, 158, 11, 0.1)", color: "var(--warning)" };
      case "PSP Global": return { bg: "rgba(16, 185, 129, 0.1)", color: "var(--success)" };
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>
          &larr; Ferramentas
        </Link>
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
        Comparador de PSPs
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
        Compare taxas, funcionalidades e prazos dos principais PSPs brasileiros.
      </p>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {(["Todos", ...TIPOS] as const).map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFilterTipo(tipo)}
            style={{
              padding: "0.45rem 1rem",
              borderRadius: 8,
              border: filterTipo === tipo ? "2px solid var(--primary)" : "1px solid var(--border)",
              background: filterTipo === tipo ? "var(--primary-bg)" : "var(--surface)",
              color: filterTipo === tipo ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            {tipo}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...card({ padding: "0" }), overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {([
                ["name", "PSP"],
                ["tipo", "Tipo"],
                ["mdrCredito", "MDR Credito"],
                ["mdrDebito", "MDR Debito"],
                ["pix", "Pix"],
                ["settlement", "Settlement"],
                ["api", "API"],
                ["sdkMobile", "SDK Mobile"],
                ["split", "Split"],
                ["antecipacao", "Antecipacao"],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th key={key} style={thStyle(key)} onClick={() => handleSort(key)}>
                  {label}
                  {sortKey === key && (
                    <span style={{ marginLeft: "0.25rem" }}>{sortAsc ? "\u25B2" : "\u25BC"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((psp, idx) => {
              const tc = tipoColor(psp.tipo);
              const isHovered = hoveredRow === idx;
              return (
                <tr
                  key={psp.name}
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: isHovered ? "var(--surface-hover)" : "transparent",
                    transition: "background 0.15s ease",
                  }}
                >
                  <td style={{ ...tdStyle, fontWeight: 700 }}>
                    {psp.name}
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 400, marginTop: "0.15rem", whiteSpace: "normal", maxWidth: 180 }}>
                      {psp.idealPara}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: 6,
                      background: tc.bg,
                      color: tc.color,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}>
                      {psp.tipo}
                    </span>
                  </td>
                  <td style={tdStyle}>{psp.mdrCredito}</td>
                  <td style={tdStyle}>{psp.mdrDebito}</td>
                  <td style={tdStyle}>{psp.pix}</td>
                  <td style={tdStyle}>{psp.settlement}</td>
                  <td style={tdStyle}>{psp.api}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{psp.sdkMobile ? "\u2705" : "\u274C"}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{psp.split ? "\u2705" : "\u274C"}</td>
                  <td style={tdStyle}>{psp.antecipacao}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
        <div style={card()}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
            Menor MDR Credito
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)" }}>Rede</div>
          <div style={{ fontSize: "0.85rem", color: "var(--primary)" }}>2,39%</div>
        </div>
        <div style={card()}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
            Melhor Settlement
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)" }}>Stone</div>
          <div style={{ fontSize: "0.85rem", color: "var(--success)" }}>D+0 (antecipacao)</div>
        </div>
        <div style={card()}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
            Mais funcionalidades
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)" }}>Adyen</div>
          <div style={{ fontSize: "0.85rem", color: "var(--warning)" }}>IC++ + Global + Split</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: "1.5rem",
        padding: "0.75rem 1rem",
        background: "var(--surface)",
        borderRadius: 10,
        border: "1px solid var(--border)",
        fontSize: "0.8rem",
        color: "var(--text-muted)",
        lineHeight: 1.5,
      }}>
        Valores de referencia para o mercado brasileiro em 2024/2025.
        Taxas reais dependem de negociacao, volume, MCC e perfil de risco.
        Entre em contato com cada PSP para cotacoes personalizadas.
      </div>
    </div>
  );
}
