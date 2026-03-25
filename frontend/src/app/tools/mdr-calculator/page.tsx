"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Brazilian interchange reference rates                              */
/* ------------------------------------------------------------------ */
const RATES = {
  creditoVista: { interchange: 1.5, schemeFee: 0.1, acquirerMarkup: 0.6 },
  credito2x: { interchange: 1.55, schemeFee: 0.1, acquirerMarkup: 0.65 },
  credito3x: { interchange: 1.6, schemeFee: 0.1, acquirerMarkup: 0.7 },
  credito4x: { interchange: 1.65, schemeFee: 0.1, acquirerMarkup: 0.72 },
  credito5x: { interchange: 1.7, schemeFee: 0.1, acquirerMarkup: 0.75 },
  credito6x: { interchange: 1.8, schemeFee: 0.1, acquirerMarkup: 0.8 },
  credito7x: { interchange: 1.85, schemeFee: 0.1, acquirerMarkup: 0.82 },
  credito8x: { interchange: 1.9, schemeFee: 0.1, acquirerMarkup: 0.85 },
  credito9x: { interchange: 1.95, schemeFee: 0.1, acquirerMarkup: 0.87 },
  credito10x: { interchange: 2.0, schemeFee: 0.1, acquirerMarkup: 0.9 },
  credito11x: { interchange: 2.05, schemeFee: 0.1, acquirerMarkup: 0.92 },
  credito12x: { interchange: 2.1, schemeFee: 0.1, acquirerMarkup: 0.95 },
  debito: { interchange: 0.5, schemeFee: 0.08, acquirerMarkup: 0.3 },
  pix: { interchange: 0, schemeFee: 0, acquirerMarkup: 0.5 },
};

function getRateForInstallment(n: number) {
  if (n <= 1) return RATES.creditoVista;
  const key = `credito${n}x` as keyof typeof RATES;
  return RATES[key] ?? RATES.credito12x;
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtBRL(v: number) {
  return `R$ ${fmt(v)}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function MDRCalculatorPage() {
  const [volume, setVolume] = useState(1_000_000);
  const [ticket, setTicket] = useState(150);
  const [visa, setVisa] = useState(50);
  const [mastercard, setMastercard] = useState(35);
  const [elo, setElo] = useState(10);
  const [outros, setOutros] = useState(5);
  const [useCreditoVista, setUseCreditoVista] = useState(true);
  const [useCreditoParc, setUseCreditoParc] = useState(true);
  const [useDebito, setUseDebito] = useState(true);
  const [usePix, setUsePix] = useState(true);
  const [parcelas, setParcelas] = useState(6);
  const [pixMigration, setPixMigration] = useState(20);

  // Normalize band mix
  const bandTotal = visa + mastercard + elo + outros || 1;

  const calc = useMemo(() => {
    const txCount = volume / (ticket || 1);
    // Payment type split (equal among selected)
    const selected: string[] = [];
    if (useCreditoVista) selected.push("creditoVista");
    if (useCreditoParc) selected.push("creditoParc");
    if (useDebito) selected.push("debito");
    if (usePix) selected.push("pix");
    if (selected.length === 0) selected.push("creditoVista");
    const share = 1 / selected.length;

    const rateCV = RATES.creditoVista;
    const mdrCV = rateCV.interchange + rateCV.schemeFee + rateCV.acquirerMarkup;

    const rateCP = getRateForInstallment(parcelas);
    const mdrCP = rateCP.interchange + rateCP.schemeFee + rateCP.acquirerMarkup;

    const rateDB = RATES.debito;
    const mdrDB = rateDB.interchange + rateDB.schemeFee + rateDB.acquirerMarkup;

    const ratePX = RATES.pix;
    const mdrPX = ratePX.interchange + ratePX.schemeFee + ratePX.acquirerMarkup;

    // Weighted MDR
    let weightedMDR = 0;
    if (useCreditoVista) weightedMDR += mdrCV * share;
    if (useCreditoParc) weightedMDR += mdrCP * share;
    if (useDebito) weightedMDR += mdrDB * share;
    if (usePix) weightedMDR += mdrPX * share;

    const custoMensal = volume * (weightedMDR / 100);
    const custoTx = txCount > 0 ? custoMensal / txCount : 0;

    // Pix migration savings
    const creditShare = (useCreditoVista ? share : 0) + (useCreditoParc ? share : 0);
    const avgCreditMDR = useCreditoVista && useCreditoParc ? (mdrCV + mdrCP) / 2 : useCreditoVista ? mdrCV : mdrCP;
    const migratedVolume = volume * creditShare * (pixMigration / 100);
    const savingRate = (avgCreditMDR - mdrPX) / 100;
    const savings = migratedVolume * savingRate;

    return {
      txCount,
      weightedMDR,
      custoTx,
      custoMensal,
      rateCV,
      mdrCV,
      rateCP,
      mdrCP,
      rateDB,
      mdrDB,
      ratePX,
      mdrPX,
      savings,
      migratedVolume,
    };
  }, [volume, ticket, useCreditoVista, useCreditoParc, useDebito, usePix, parcelas, pixMigration, visa, mastercard, elo, outros]);

  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--surface)",
    borderRadius: "14px",
    padding: "1.5rem",
    border: "1px solid var(--border)",
    ...extra,
  });

  const label: React.CSSProperties = {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    marginBottom: "0.4rem",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>
          ← Ferramentas
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
          <div style={card({})}>
            <div style={label}>Volume mensal (R$)</div>
            <input
              type="range"
              min={100_000}
              max={100_000_000}
              step={100_000}
              value={volume}
              onChange={(e) => setVolume(+e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)" }}
            />
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", marginTop: "0.25rem" }}>
              {fmtBRL(volume)}
            </div>
          </div>

          {/* Ticket */}
          <div style={card({})}>
            <div style={label}>Ticket medio (R$)</div>
            <input
              type="number"
              min={10}
              max={5000}
              value={ticket}
              onChange={(e) => setTicket(+e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
                fontSize: "1rem",
              }}
            />
          </div>

          {/* Mix de bandeiras */}
          <div style={card({})}>
            <div style={label}>Mix de bandeiras (%)</div>
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

          {/* Tipo */}
          <div style={card({})}>
            <div style={label}>Tipos de pagamento</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.5rem" }}>
              {([
                ["Credito a vista", useCreditoVista, setUseCreditoVista],
                ["Credito parcelado", useCreditoParc, setUseCreditoParc],
                ["Debito", useDebito, setUseDebito],
                ["Pix", usePix, setUsePix],
              ] as [string, boolean, (v: boolean) => void][]).map(([name, val, setter]) => (
                <label
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.85rem",
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={() => setter(!val)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>

          {/* Parcelas */}
          {useCreditoParc && (
            <div style={card({})}>
              <div style={label}>Parcelamento medio</div>
              <select
                value={parcelas}
                onChange={(e) => setParcelas(+e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "0.95rem",
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}x
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ---- RIGHT: Output ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {([
              ["MDR Efetivo", `${fmt(calc.weightedMDR)}%`, "var(--primary)"],
              ["Custo / Tx", fmtBRL(calc.custoTx), "var(--warning)"],
              ["Custo Mensal", fmtBRL(calc.custoMensal), "var(--error)"],
              ["Transacoes", Math.round(calc.txCount).toLocaleString("pt-BR"), "var(--success)"],
            ] as [string, string, string][]).map(([title, value, color]) => (
              <div
                key={title}
                style={{
                  ...card({}),
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
          <div style={card({})}>
            <div style={{ ...label, marginBottom: "0.75rem" }}>Breakdown por tipo</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr>
                    {["Componente", "Credito vista", `Credito ${parcelas}x`, "Debito", "Pix"].map((h) => (
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
                  {([
                    ["Interchange", calc.rateCV.interchange, calc.rateCP.interchange, calc.rateDB.interchange, calc.ratePX.interchange],
                    ["Scheme Fee", calc.rateCV.schemeFee, calc.rateCP.schemeFee, calc.rateDB.schemeFee, calc.ratePX.schemeFee],
                    ["Acquirer Markup", calc.rateCV.acquirerMarkup, calc.rateCP.acquirerMarkup, calc.rateDB.acquirerMarkup, calc.ratePX.acquirerMarkup],
                  ] as [string, number, number, number, number][]).map(([name, cv, cp, db, px]) => (
                    <tr key={name}>
                      <td style={{ padding: "0.5rem 0.75rem", color: "var(--foreground)" }}>{name}</td>
                      {[cv, cp, db, px].map((v, i) => (
                        <td key={i} style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--text-muted)" }}>
                          {fmt(v)}%
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ borderTop: "2px solid var(--border)", fontWeight: 700 }}>
                    <td style={{ padding: "0.5rem 0.75rem", color: "var(--foreground)" }}>MDR Total</td>
                    {[calc.mdrCV, calc.mdrCP, calc.mdrDB, calc.mdrPX].map((v, i) => (
                      <td key={i} style={{ padding: "0.5rem 0.75rem", textAlign: "center", color: "var(--primary)" }}>
                        {fmt(v)}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CSS-only pie chart */}
          <div style={card({})}>
            <div style={{ ...label, marginBottom: "0.75rem" }}>Composicao do MDR medio</div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {(() => {
                const ic = calc.weightedMDR > 0 ? ((calc.rateCV.interchange + calc.rateCP.interchange + calc.rateDB.interchange + calc.ratePX.interchange) / 4 / calc.weightedMDR) * 100 : 33;
                const sf = calc.weightedMDR > 0 ? ((calc.rateCV.schemeFee + calc.rateCP.schemeFee + calc.rateDB.schemeFee + calc.ratePX.schemeFee) / 4 / calc.weightedMDR) * 100 : 33;
                const am = 100 - ic - sf;
                const deg1 = (ic / 100) * 360;
                const deg2 = deg1 + (sf / 100) * 360;
                return (
                  <>
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: `conic-gradient(#6366f1 0deg ${deg1}deg, #f59e0b ${deg1}deg ${deg2}deg, #10b981 ${deg2}deg 360deg)`,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {([
                        ["Interchange", "#6366f1", ic],
                        ["Scheme Fee", "#f59e0b", sf],
                        ["Acquirer", "#10b981", am],
                      ] as [string, string, number][]).map(([n, c, pct]) => (
                        <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: 12, height: 12, borderRadius: 3, background: c, flexShrink: 0 }} />
                          <span style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>
                            {n}: {fmt(pct)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Pix migration */}
          <div style={{ ...card({}), background: "var(--primary-bg)", borderColor: "var(--primary)" }}>
            <div style={{ ...label, marginBottom: "0.5rem" }}>Simulacao: Migrar credito para Pix</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>Migrar</span>
              <input
                type="range"
                min={0}
                max={100}
                value={pixMigration}
                onChange={(e) => setPixMigration(+e.target.value)}
                style={{ flex: 1, accentColor: "var(--primary)" }}
              />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--foreground)", width: 40, textAlign: "right" }}>
                {pixMigration}%
              </span>
            </div>
            <p style={{ fontSize: "0.95rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se migrar <strong>{pixMigration}%</strong> do credito para Pix (
              {fmtBRL(calc.migratedVolume)}), economia de{" "}
              <strong style={{ color: "var(--success)" }}>{fmtBRL(calc.savings)}/mes</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
