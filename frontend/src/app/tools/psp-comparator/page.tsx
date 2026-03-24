"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// PSP Data
// ---------------------------------------------------------------------------

interface PSPData {
  name: string;
  logo: string;
  type: string;
  pricing: {
    mdr_credito: string;
    mdr_debito: string;
    pix: string;
    antecipacao: string;
  };
  features: {
    smart_routing: boolean;
    network_tokens: boolean;
    three_ds2: boolean;
    split_payments: boolean;
    recurring: boolean;
    pix_qr: boolean;
    boleto: boolean;
    link_pagamento: boolean;
  };
  api_quality: number;
  settlement: string;
  support: string;
  best_for: string;
  integration: string;
  porte: ("Pequeno" | "Medio" | "Grande")[];
  necessidade: ("E-commerce" | "Marketplace" | "SaaS" | "Presencial")[];
}

const PSP_DATA: PSPData[] = [
  {
    name: "Cielo",
    logo: "\u{1F7E6}",
    type: "Adquirente",
    pricing: { mdr_credito: "2.49-3.99%", mdr_debito: "1.39-1.99%", pix: "0.00-0.99%", antecipacao: "1.99-3.49%/mes" },
    features: { smart_routing: false, network_tokens: true, three_ds2: true, split_payments: true, recurring: true, pix_qr: true, boleto: true, link_pagamento: true },
    api_quality: 3,
    settlement: "D+1 a D+30",
    support: "Telefone, Chat, Email",
    best_for: "Grandes varejistas, presencial",
    integration: "API REST, SDKs, Plugins",
    porte: ["Medio", "Grande"],
    necessidade: ["E-commerce", "Presencial"],
  },
  {
    name: "Rede",
    logo: "\u{1F7E5}",
    type: "Adquirente",
    pricing: { mdr_credito: "2.39-3.79%", mdr_debito: "1.29-1.89%", pix: "0.00-0.79%", antecipacao: "1.89-3.29%/mes" },
    features: { smart_routing: false, network_tokens: true, three_ds2: true, split_payments: false, recurring: true, pix_qr: true, boleto: true, link_pagamento: true },
    api_quality: 3,
    settlement: "D+1 a D+30",
    support: "Telefone, Chat",
    best_for: "Clientes Itau, presencial e e-commerce",
    integration: "API REST, e.Rede SDK",
    porte: ["Medio", "Grande"],
    necessidade: ["E-commerce", "Presencial"],
  },
  {
    name: "Stone",
    logo: "\u{1F7E9}",
    type: "Adquirente / Sub-adquirente",
    pricing: { mdr_credito: "2.69-4.49%", mdr_debito: "1.49-2.19%", pix: "0.00-0.89%", antecipacao: "1.49-2.99%/mes" },
    features: { smart_routing: false, network_tokens: true, three_ds2: true, split_payments: true, recurring: true, pix_qr: true, boleto: true, link_pagamento: true },
    api_quality: 4,
    settlement: "D+1 a D+30",
    support: "Telefone dedicado, Chat, Gerente de conta",
    best_for: "PMEs com foco em atendimento, presencial",
    integration: "API REST, SDKs, Plugins WooCommerce/Shopify",
    porte: ["Pequeno", "Medio"],
    necessidade: ["E-commerce", "Presencial"],
  },
  {
    name: "PagSeguro",
    logo: "\u{1F7E8}",
    type: "Sub-adquirente",
    pricing: { mdr_credito: "3.99-4.99%", mdr_debito: "1.99-2.49%", pix: "0.00%", antecipacao: "2.99-3.99%/mes" },
    features: { smart_routing: false, network_tokens: false, three_ds2: true, split_payments: false, recurring: true, pix_qr: true, boleto: true, link_pagamento: true },
    api_quality: 3,
    settlement: "D+14 a D+30",
    support: "Chat, Email, Telefone",
    best_for: "Microempreendedores, baixo volume",
    integration: "API REST, Checkout transparente, Plugins",
    porte: ["Pequeno"],
    necessidade: ["E-commerce", "Presencial"],
  },
  {
    name: "Adyen",
    logo: "\u{1F7E2}",
    type: "PSP Global / Adquirente",
    pricing: { mdr_credito: "1.99-3.29%", mdr_debito: "0.99-1.69%", pix: "0.50-0.99%", antecipacao: "N/A (D+1 incluso)" },
    features: { smart_routing: true, network_tokens: true, three_ds2: true, split_payments: true, recurring: true, pix_qr: true, boleto: true, link_pagamento: true },
    api_quality: 5,
    settlement: "D+1 (padrao)",
    support: "Gerente de conta dedicado, Documentacao premium",
    best_for: "Grandes empresas, operacoes globais, marketplaces",
    integration: "API REST, SDKs (iOS/Android/Web), Drop-in, Plugins",
    porte: ["Grande"],
    necessidade: ["E-commerce", "Marketplace", "SaaS"],
  },
  {
    name: "Stripe",
    logo: "\u{1F7EA}",
    type: "PSP Global",
    pricing: { mdr_credito: "3.49-4.29%", mdr_debito: "2.49-3.29%", pix: "0.80-1.40%", antecipacao: "N/A" },
    features: { smart_routing: true, network_tokens: true, three_ds2: true, split_payments: true, recurring: true, pix_qr: true, boleto: true, link_pagamento: true },
    api_quality: 5,
    settlement: "D+2 a D+7",
    support: "Email, Chat, Documentacao excelente",
    best_for: "Startups, SaaS, developers, subscricoes",
    integration: "API REST, SDKs (todas plataformas), Hosted checkout, Elements",
    porte: ["Pequeno", "Medio", "Grande"],
    necessidade: ["E-commerce", "SaaS", "Marketplace"],
  },
  {
    name: "Mercado Pago",
    logo: "\u{1F7E6}",
    type: "Sub-adquirente / Wallet",
    pricing: { mdr_credito: "3.49-4.99%", mdr_debito: "1.99%", pix: "0.00-0.99%", antecipacao: "2.49-3.79%/mes" },
    features: { smart_routing: false, network_tokens: false, three_ds2: true, split_payments: true, recurring: true, pix_qr: true, boleto: true, link_pagamento: true },
    api_quality: 4,
    settlement: "D+14 (padrao), D+1 (com taxa)",
    support: "Chat, Email, Central de ajuda",
    best_for: "Marketplaces, e-commerce, MEI",
    integration: "API REST, SDKs, Checkout Pro, Plugins",
    porte: ["Pequeno", "Medio"],
    necessidade: ["E-commerce", "Marketplace"],
  },
  {
    name: "Pagar.me",
    logo: "\u{1F7E7}",
    type: "Sub-adquirente (Stone)",
    pricing: { mdr_credito: "2.99-4.29%", mdr_debito: "1.49-2.29%", pix: "0.00-0.89%", antecipacao: "1.49-2.69%/mes" },
    features: { smart_routing: false, network_tokens: true, three_ds2: true, split_payments: true, recurring: true, pix_qr: true, boleto: true, link_pagamento: true },
    api_quality: 4,
    settlement: "D+1 a D+30",
    support: "Chat, Email, Documentacao tecnica",
    best_for: "Developers, startups, marketplaces",
    integration: "API REST, SDKs, Checkout transparente, Plugins",
    porte: ["Pequeno", "Medio"],
    necessidade: ["E-commerce", "Marketplace", "SaaS"],
  },
];

const FEATURE_LABELS: Record<keyof PSPData["features"], string> = {
  smart_routing: "Smart Routing",
  network_tokens: "Network Tokens",
  three_ds2: "3DS 2.0",
  split_payments: "Split Payments",
  recurring: "Recorrencia",
  pix_qr: "Pix QR Code",
  boleto: "Boleto",
  link_pagamento: "Link de Pagamento",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PSPComparatorPage() {
  const [filterPorte, setFilterPorte] = useState<string>("Todos");
  const [filterNecessidade, setFilterNecessidade] = useState<string>("Todos");
  const [selectedPSPs, setSelectedPSPs] = useState<Set<string>>(new Set());

  const filteredPSPs = useMemo(() => {
    return PSP_DATA.filter((psp) => {
      if (filterPorte !== "Todos" && !psp.porte.includes(filterPorte as PSPData["porte"][number])) return false;
      if (filterNecessidade !== "Todos" && !psp.necessidade.includes(filterNecessidade as PSPData["necessidade"][number])) return false;
      return true;
    });
  }, [filterPorte, filterNecessidade]);

  const togglePSP = (name: string) => {
    setSelectedPSPs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else if (next.size < 3) {
        next.add(name);
      }
      return next;
    });
  };

  const comparedPSPs = PSP_DATA.filter((p) => selectedPSPs.has(p.name));

  const stars = (n: number) => {
    let s = "";
    for (let i = 0; i < 5; i++) s += i < n ? "\u2B50" : "\u2606";
    return s;
  };

  // Styles
  const cardStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 20,
  };

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: 8,
    border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
    background: active ? "var(--primary-bg)" : "var(--surface)",
    color: active ? "var(--primary)" : "var(--foreground)",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "24px 16px",
        minHeight: "100vh",
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14 }}>
          Inicio
        </Link>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>/</span>
        <Link href="/tools" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14 }}>
          Ferramentas
        </Link>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>/</span>
        <span style={{ color: "var(--foreground)", fontSize: 14, fontWeight: 500 }}>
          Comparador de PSPs
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)", marginBottom: 8 }}>
          Comparador de PSPs
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 700 }}>
          Compare os principais PSPs brasileiros lado a lado. Filtre por porte e necessidade,
          selecione ate 3 para comparacao detalhada.
        </p>
      </div>

      {/* Filters */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>
              Porte da Empresa
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Todos", "Pequeno", "Medio", "Grande"].map((p) => (
                <button key={p} onClick={() => setFilterPorte(p)} style={filterBtnStyle(filterPorte === p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>
              Necessidade
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Todos", "E-commerce", "Marketplace", "SaaS", "Presencial"].map((n) => (
                <button key={n} onClick={() => setFilterNecessidade(n)} style={filterBtnStyle(filterNecessidade === n)}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
        {filteredPSPs.length} PSP{filteredPSPs.length !== 1 ? "s" : ""} encontrado{filteredPSPs.length !== 1 ? "s" : ""}
        {selectedPSPs.size > 0 && ` | ${selectedPSPs.size} selecionado${selectedPSPs.size !== 1 ? "s" : ""} para comparacao`}
      </div>

      {/* PSP cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16, marginBottom: 32 }}>
        {filteredPSPs.map((psp) => {
          const isSelected = selectedPSPs.has(psp.name);
          const isBestFit =
            filterPorte !== "Todos" &&
            filterNecessidade !== "Todos" &&
            psp.porte.includes(filterPorte as PSPData["porte"][number]) &&
            psp.necessidade.includes(filterNecessidade as PSPData["necessidade"][number]) &&
            psp.api_quality >= 4;

          return (
            <div
              key={psp.name}
              style={{
                ...cardStyle,
                borderColor: isSelected ? "var(--primary)" : "var(--border)",
                boxShadow: isSelected ? "0 0 0 2px var(--primary-bg)" : "none",
                position: "relative",
              }}
            >
              {isBestFit && (
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    right: 12,
                    background: "var(--success)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 6,
                  }}
                >
                  Melhor para seu perfil
                </div>
              )}

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{psp.logo}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>{psp.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{psp.type}</div>
                </div>
              </div>

              {/* API Quality */}
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                API: {stars(psp.api_quality)}
              </div>

              {/* Pricing */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Taxas
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12 }}>
                  <span style={{ color: "var(--text-muted)" }}>Credito:</span>
                  <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{psp.pricing.mdr_credito}</span>
                  <span style={{ color: "var(--text-muted)" }}>Debito:</span>
                  <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{psp.pricing.mdr_debito}</span>
                  <span style={{ color: "var(--text-muted)" }}>Pix:</span>
                  <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{psp.pricing.pix}</span>
                  <span style={{ color: "var(--text-muted)" }}>Antecipacao:</span>
                  <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{psp.pricing.antecipacao}</span>
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Features
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {(Object.keys(psp.features) as (keyof PSPData["features"])[]).map((feat) => (
                    <span
                      key={feat}
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: psp.features[feat] ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.06)",
                        color: psp.features[feat] ? "var(--success)" : "var(--text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {psp.features[feat] ? "\u2713" : "\u2717"} {FEATURE_LABELS[feat]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Settlement & best for */}
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                <strong>Settlement:</strong> {psp.settlement}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                <strong>Melhor para:</strong> {psp.best_for}
              </div>

              {/* Select button */}
              <button
                onClick={() => togglePSP(psp.name)}
                style={{
                  width: "100%",
                  padding: "8px 0",
                  borderRadius: 8,
                  border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                  background: isSelected ? "var(--primary)" : "var(--surface)",
                  color: isSelected ? "#fff" : "var(--foreground)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {isSelected ? "\u2713 Selecionado" : "Selecionar para comparar"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Detailed comparison */}
      {comparedPSPs.length >= 2 && (
        <div style={{ ...cardStyle, marginBottom: 40, overflowX: "auto" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 20 }}>
            Comparacao Detalhada
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid var(--border)", color: "var(--text-muted)", fontWeight: 600, fontSize: 12 }}>
                  Criterio
                </th>
                {comparedPSPs.map((psp) => (
                  <th
                    key={psp.name}
                    style={{
                      textAlign: "center",
                      padding: "10px 12px",
                      borderBottom: "2px solid var(--border)",
                      color: "var(--foreground)",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {psp.logo} {psp.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Row helper */}
              {([
                ["Tipo", (p: PSPData) => p.type],
                ["MDR Credito", (p: PSPData) => p.pricing.mdr_credito],
                ["MDR Debito", (p: PSPData) => p.pricing.mdr_debito],
                ["Taxa Pix", (p: PSPData) => p.pricing.pix],
                ["Antecipacao", (p: PSPData) => p.pricing.antecipacao],
                ["Qualidade API", (p: PSPData) => stars(p.api_quality)],
                ["Settlement", (p: PSPData) => p.settlement],
                ["Suporte", (p: PSPData) => p.support],
                ["Integracao", (p: PSPData) => p.integration],
                ["Melhor para", (p: PSPData) => p.best_for],
              ] as [string, (p: PSPData) => string][]).map(([label, fn], i) => (
                <tr key={label} style={{ background: i % 2 === 0 ? "transparent" : "var(--surface-hover)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 500, color: "var(--foreground)", borderBottom: "1px solid var(--border)" }}>
                    {label}
                  </td>
                  {comparedPSPs.map((psp) => (
                    <td
                      key={psp.name}
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        color: "var(--foreground)",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {fn(psp)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Feature rows */}
              {(Object.keys(FEATURE_LABELS) as (keyof PSPData["features"])[]).map((feat, i) => (
                <tr key={feat} style={{ background: (i + 10) % 2 === 0 ? "transparent" : "var(--surface-hover)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 500, color: "var(--foreground)", borderBottom: "1px solid var(--border)" }}>
                    {FEATURE_LABELS[feat]}
                  </td>
                  {comparedPSPs.map((psp) => (
                    <td
                      key={psp.name}
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        fontSize: 16,
                        borderBottom: "1px solid var(--border)",
                        color: psp.features[feat] ? "var(--success)" : "var(--error)",
                      }}
                    >
                      {psp.features[feat] ? "\u2705" : "\u274C"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state for comparison */}
      {selectedPSPs.size > 0 && selectedPSPs.size < 2 && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 40,
            textAlign: "center",
            padding: 40,
            borderStyle: "dashed",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>{"\u{1F50D}"}</div>
          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Selecione pelo menos 2 PSPs para ver a comparacao detalhada
          </div>
        </div>
      )}
    </div>
  );
}
