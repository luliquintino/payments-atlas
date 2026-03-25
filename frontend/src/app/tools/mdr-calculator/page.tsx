"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";

/* ------------------------------------------------------------------ */
/*  Brazilian interchange reference rates by brand & installment       */
/* ------------------------------------------------------------------ */
const BRAND_RATES = {
  visa: {
    credit: { base: 1.60, perInstallment: 0.04 },
    debit: 0.50,
  },
  mastercard: {
    credit: { base: 1.70, perInstallment: 0.04 },
    debit: 0.50,
  },
  elo: {
    credit: { base: 1.30, perInstallment: 0.035 },
    debit: 0.45,
  },
  outros: {
    credit: { base: 1.50, perInstallment: 0.04 },
    debit: 0.50,
  },
};

const SCHEME_FEES = { visa: 0.11, mastercard: 0.12, elo: 0.09, outros: 0.10 };
const ACQUIRER_MARKUP_ICPP = { credit: 0.50, debit: 0.30, pix: 0.50 };
const BLENDED_RATES = { credit: 2.49, debit: 1.19, pix: 0.99 };

function getInterchange(brand: keyof typeof BRAND_RATES, installments: number): number {
  const b = BRAND_RATES[brand];
  if (installments <= 1) return b.credit.base;
  return Math.min(b.credit.base + b.credit.perInstallment * (installments - 1), 2.50);
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtBRL(v: number) {
  return `R$ ${fmt(v)}`;
}
function fmtK(v: number): string {
  if (v >= 1_000_000_000) return `R$ ${fmt(v / 1_000_000_000)} B`;
  if (v >= 1_000_000) return `R$ ${fmt(v / 1_000_000)} M`;
  if (v >= 1_000) return `R$ ${fmt(v / 1_000)} K`;
  return fmtBRL(v);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function MDRCalculatorPage() {
  const { visitPage } = useGameProgress();
  useEffect(() => { visitPage("/tools/mdr-calculator"); }, [visitPage]);

  const [volume, setVolume] = useState(1_000_000);
  const [ticket, setTicket] = useState(150);
  const [credito, setCredito] = useState(50);
  const [debito, setDebito] = useState(30);
  const [pix, setPix] = useState(20);
  const [visa, setVisa] = useState(50);
  const [mastercard, setMastercard] = useState(35);
  const [elo, setElo] = useState(10);
  const [outros, setOutros] = useState(5);
  const [parcelas, setParcelas] = useState(4);
  const [pricing, setPricing] = useState<"icpp" | "blended">("icpp");

  // Normalize mixes
  const payTotal = credito + debito + pix || 1;
  const bandTotal = visa + mastercard + elo + outros || 1;
  const creditoPct = credito / payTotal;
  const debitoPct = debito / payTotal;
  const pixPct = pix / payTotal;
  const visaPct = visa / bandTotal;
  const mcPct = mastercard / bandTotal;
  const eloPct = elo / bandTotal;
  const outrosPct = outros / bandTotal;

  const calc = useMemo(() => {
    const txCount = volume / (ticket || 1);
    const brands: { key: keyof typeof BRAND_RATES; pct: number }[] = [
      { key: "visa", pct: visaPct },
      { key: "mastercard", pct: mcPct },
      { key: "elo", pct: eloPct },
      { key: "outros", pct: outrosPct },
    ];

    // IC++ calculation
    let icppCreditMDR = 0;
    let icppDebitMDR = 0;
    let avgCreditInterchange = 0;
    let avgDebitInterchange = 0;
    let avgCreditScheme = 0;
    let avgDebitScheme = 0;

    for (const b of brands) {
      const creditIC = getInterchange(b.key, parcelas);
      const debitIC = BRAND_RATES[b.key].debit;
      const sf = SCHEME_FEES[b.key];
      icppCreditMDR += (creditIC + sf + ACQUIRER_MARKUP_ICPP.credit) * b.pct;
      icppDebitMDR += (debitIC + sf + ACQUIRER_MARKUP_ICPP.debit) * b.pct;
      avgCreditInterchange += creditIC * b.pct;
      avgDebitInterchange += debitIC * b.pct;
      avgCreditScheme += sf * b.pct;
      avgDebitScheme += sf * b.pct;
    }
    const icppPixMDR = ACQUIRER_MARKUP_ICPP.pix;

    // Blended calculation
    const blendedCreditMDR = BLENDED_RATES.credit;
    const blendedDebitMDR = BLENDED_RATES.debit;
    const blendedPixMDR = BLENDED_RATES.pix;

    const isICPP = pricing === "icpp";
    const creditMDR = isICPP ? icppCreditMDR : blendedCreditMDR;
    const debitMDR = isICPP ? icppDebitMDR : blendedDebitMDR;
    const pixMDR = isICPP ? icppPixMDR : blendedPixMDR;

    const weightedMDR = creditMDR * creditoPct + debitMDR * debitoPct + pixMDR * pixPct;
    const custoMensal = volume * (weightedMDR / 100);
    const custoTx = txCount > 0 ? custoMensal / txCount : 0;

    // IC++ vs Blended comparison
    const icppTotal = volume * ((icppCreditMDR * creditoPct + icppDebitMDR * debitoPct + icppPixMDR * pixPct) / 100);
    const blendedTotal = volume * ((blendedCreditMDR * creditoPct + blendedDebitMDR * debitoPct + blendedPixMDR * pixPct) / 100);
    const savings = blendedTotal - icppTotal;

    return {
      txCount,
      weightedMDR,
      custoTx,
      custoMensal,
      creditMDR,
      debitMDR,
      pixMDR,
      avgCreditInterchange,
      avgDebitInterchange,
      avgCreditScheme,
      avgDebitScheme,
      icppCreditMDR,
      icppDebitMDR,
      icppPixMDR,
      blendedCreditMDR,
      blendedDebitMDR,
      blendedPixMDR,
      icppTotal,
      blendedTotal,
      savings,
    };
  }, [volume, ticket, creditoPct, debitoPct, pixPct, visaPct, mcPct, eloPct, outrosPct, parcelas, pricing]);

  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--surface)",
    borderRadius: "14px",
    padding: "1.5rem",
    border: "1px solid var(--border)",
    ...extra,
  });

  const labelStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "0.4rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.5rem 0.75rem",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--background)",
    color: "var(--foreground)",
    fontSize: "1rem",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>
          &larr; Ferramentas
        </Link>
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
        Calculadora de MDR / Interchange
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
        Simule custos de processamento com base no seu volume, ticket e mix de pagamento.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* ---- LEFT: Inputs ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Volume */}
          <div style={card()}>
            <div style={labelStyle}>Volume mensal (R$)</div>
            <input
              type="range"
              min={10_000}
              max={100_000_000}
              step={10_000}
              value={volume}
              onChange={(e) => setVolume(+e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)" }}
            />
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", marginTop: "0.25rem" }}>
              {fmtK(volume)}
            </div>
          </div>

          {/* Ticket */}
          <div style={card()}>
            <div style={labelStyle}>Ticket medio (R$)</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="range"
                min={10}
                max={5000}
                step={5}
                value={ticket}
                onChange={(e) => setTicket(+e.target.value)}
                style={{ flex: 1, accentColor: "var(--primary)" }}
              />
              <input
                type="number"
                min={10}
                max={5000}
                value={ticket}
                onChange={(e) => setTicket(+e.target.value)}
                style={{ ...inputStyle, width: 100 }}
              />
            </div>
          </div>

          {/* Mix de pagamento */}
          <div style={card()}>
            <div style={labelStyle}>Mix de pagamento (%)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
              {([
                ["Credito", credito, setCredito, "#6366f1"],
                ["Debito", debito, setDebito, "#f59e0b"],
                ["Pix", pix, setPix, "#10b981"],
              ] as [string, number, (v: number) => void, string][]).map(([name, val, setter, color]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ width: 70, fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 500 }}>
                    {name}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={val}
                    onChange={(e) => setter(+e.target.value)}
                    style={{ flex: 1, accentColor: color }}
                  />
                  <span style={{ width: 36, textAlign: "right", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {Math.round((val / payTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mix de bandeiras */}
          <div style={card()}>
            <div style={labelStyle}>Mix de bandeiras (%)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
              {([
                ["Visa", visa, setVisa, "#1a1f71"],
                ["Mastercard", mastercard, setMastercard, "#eb001b"],
                ["Elo", elo, setElo, "#00a4e0"],
                ["Outros", outros, setOutros, "#6B7280"],
              ] as [string, number, (v: number) => void, string][]).map(([name, val, setter, color]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ width: 80, fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 500 }}>
                    {name}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={val}
                    onChange={(e) => setter(+e.target.value)}
                    style={{ flex: 1, accentColor: color }}
                  />
                  <span style={{ width: 36, textAlign: "right", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {Math.round((val / bandTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Parcelamento */}
          <div style={card()}>
            <div style={labelStyle}>Parcelamento medio</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="range"
                min={1}
                max={12}
                value={parcelas}
                onChange={(e) => setParcelas(+e.target.value)}
                style={{ flex: 1, accentColor: "var(--primary)" }}
              />
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", width: 40, textAlign: "right" }}>
                {parcelas}x
              </span>
            </div>
          </div>

          {/* Pricing type */}
          <div style={card()}>
            <div style={labelStyle}>Tipo de pricing</div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              {(["icpp", "blended"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPricing(p)}
                  style={{
                    flex: 1,
                    padding: "0.6rem 1rem",
                    borderRadius: 8,
                    border: pricing === p ? "2px solid var(--primary)" : "1px solid var(--border)",
                    background: pricing === p ? "var(--primary-bg)" : "var(--background)",
                    color: pricing === p ? "var(--primary)" : "var(--text-muted)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  {p === "icpp" ? "IC++" : "Blended"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---- RIGHT: Output ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {([
              ["MDR Efetivo", `${fmt(calc.weightedMDR)}%`, "var(--primary)"],
              ["Custo / Tx", fmtBRL(calc.custoTx), "var(--warning)"],
              ["Custo Mensal", fmtK(calc.custoMensal), "var(--error)"],
              ["Transacoes", Math.round(calc.txCount).toLocaleString("pt-BR"), "var(--success)"],
            ] as [string, string, string][]).map(([title, value, color]) => (
              <div
                key={title}
                style={{
                  ...card(),
                  borderLeft: `4px solid ${color}`,
                }}
              >
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                  {title}
                </div>
                <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--foreground)" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Breakdown table */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "0.75rem" }}>Breakdown por tipo ({pricing === "icpp" ? "IC++" : "Blended"})</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr>
                    {["Componente", "Credito", "Debito", "Pix"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: h === "Componente" ? "left" : "center",
                          padding: "0.5rem 0.75rem",
                          borderBottom: "2px solid var(--border)",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pricing === "icpp" ? (
                    <>
                      <tr>
                        <td style={{ padding: "0.5rem 0.75rem", color: "var(--foreground)" }}>Interchange</td>
                        <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>{fmt(calc.avgCreditInterchange)}%</td>
                        <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>{fmt(calc.avgDebitInterchange)}%</td>
                        <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>-</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "0.5rem 0.75rem", color: "var(--foreground)" }}>Scheme Fee</td>
                        <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>{fmt(calc.avgCreditScheme)}%</td>
                        <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>{fmt(calc.avgDebitScheme)}%</td>
                        <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>-</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "0.5rem 0.75rem", color: "var(--foreground)" }}>Acquirer Markup</td>
                        <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>{fmt(ACQUIRER_MARKUP_ICPP.credit)}%</td>
                        <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>{fmt(ACQUIRER_MARKUP_ICPP.debit)}%</td>
                        <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>{fmt(ACQUIRER_MARKUP_ICPP.pix)}%</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td style={{ padding: "0.5rem 0.75rem", color: "var(--foreground)" }}>Taxa Blended</td>
                      <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>{fmt(BLENDED_RATES.credit)}%</td>
                      <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>{fmt(BLENDED_RATES.debit)}%</td>
                      <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>{fmt(BLENDED_RATES.pix)}%</td>
                    </tr>
                  )}
                  <tr style={{ borderTop: "2px solid var(--border)", fontWeight: 700 }}>
                    <td style={{ padding: "0.5rem 0.75rem", color: "var(--foreground)" }}>MDR Total</td>
                    {[calc.creditMDR, calc.debitMDR, calc.pixMDR].map((v, i) => (
                      <td key={i} style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--primary)" }}>
                        {fmt(v)}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* MDR composition pie */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "0.75rem" }}>Composicao do MDR medio</div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {(() => {
                const total = calc.weightedMDR || 1;
                const icPct = pricing === "icpp" ? ((calc.avgCreditInterchange * creditoPct + calc.avgDebitInterchange * debitoPct) / total) * 100 : 0;
                const sfPct = pricing === "icpp" ? ((calc.avgCreditScheme * creditoPct + calc.avgDebitScheme * debitoPct) / total) * 100 : 0;
                const amPct = 100 - icPct - sfPct;
                const deg1 = (icPct / 100) * 360;
                const deg2 = deg1 + (sfPct / 100) * 360;
                return (
                  <>
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: pricing === "icpp"
                          ? `conic-gradient(#6366f1 0deg ${deg1}deg, #f59e0b ${deg1}deg ${deg2}deg, #10b981 ${deg2}deg 360deg)`
                          : "conic-gradient(#6366f1 0deg 360deg)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {pricing === "icpp" ? (
                        [
                          ["Interchange", "#6366f1", icPct],
                          ["Scheme Fee", "#f59e0b", sfPct],
                          ["Acquirer", "#10b981", amPct],
                        ] as [string, string, number][]
                      ).map(([n, c, pct]) => (
                        <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: 12, height: 12, borderRadius: 3, background: c, flexShrink: 0 }} />
                          <span style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>
                            {n}: {fmt(pct)}%
                          </span>
                        </div>
                      )) : (
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          Blended: taxa unica do adquirente
                        </span>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* IC++ vs Blended comparison */}
          <div style={{ ...card(), background: "var(--primary-bg)", borderColor: "var(--primary)" }}>
            <div style={{ ...labelStyle, marginBottom: "0.75rem" }}>Comparacao IC++ vs Blended</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.15rem" }}>Custo IC++</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)" }}>{fmtK(calc.icppTotal)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.15rem" }}>Custo Blended</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)" }}>{fmtK(calc.blendedTotal)}</div>
              </div>
            </div>
            <div style={{
              padding: "0.75rem 1rem",
              borderRadius: 8,
              background: calc.savings > 0 ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
              border: `1px solid ${calc.savings > 0 ? "var(--success)" : "var(--error)"}`,
            }}>
              <span style={{ fontSize: "0.9rem", color: "var(--foreground)" }}>
                {calc.savings > 0
                  ? `IC++ economiza ${fmtK(calc.savings)}/mes vs Blended`
                  : calc.savings < 0
                    ? `Blended economiza ${fmtK(Math.abs(calc.savings))}/mes vs IC++`
                    : "Ambos modelos com custo similar"}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ padding: "0.75rem 1rem", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Valores de referencia baseados em taxas medias do mercado brasileiro.
            Taxas reais dependem de negociacao com o adquirente, volume, MCC e perfil de risco.
          </div>
        </div>
      </div>
    </div>
  );
}
