"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";

/* ------------------------------------------------------------------ */
/*  Brazilian interchange reference rates (realistic 2024/2025)        */
/* ------------------------------------------------------------------ */
const BRAND_RATES = {
  visa: {
    credit: { base: 1.60, perInstallment2to6: 0.10, perInstallment7to12: 0.15 },
    debit: 0.65,
  },
  mastercard: {
    credit: { base: 1.65, perInstallment2to6: 0.10, perInstallment7to12: 0.15 },
    debit: 0.70,
  },
  elo: {
    credit: { base: 1.40, perInstallment2to6: 0.10, perInstallment7to12: 0.15 },
    debit: 0.55,
  },
  outros: {
    credit: { base: 1.50, perInstallment2to6: 0.10, perInstallment7to12: 0.15 },
    debit: 0.60,
  },
} as const;

type BrandKey = keyof typeof BRAND_RATES;

const SCHEME_FEES: Record<BrandKey, number> = {
  visa: 0.22,
  mastercard: 0.25,
  elo: 0.18,
  outros: 0.20,
};

const PIX_COST_PER_TX = 0.05; // R$ 0.05 average per Pix transaction

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getInterchange(brand: BrandKey, installments: number): number {
  const b = BRAND_RATES[brand];
  if (installments <= 1) return b.credit.base;
  if (installments <= 6) {
    return b.credit.base + b.credit.perInstallment2to6 * (installments - 1);
  }
  // 7-12x: first 5 extra installments at 2-6 rate, rest at 7-12 rate
  const cost2to6 = b.credit.perInstallment2to6 * 5;
  const cost7to12 = b.credit.perInstallment7to12 * (installments - 6);
  return b.credit.base + cost2to6 + cost7to12;
}

function fmt(v: number): string {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtBRL(v: number): string {
  return `R$ ${fmt(v)}`;
}
function fmtK(v: number): string {
  if (v >= 1_000_000_000) return `R$ ${fmt(v / 1_000_000_000)} B`;
  if (v >= 1_000_000) return `R$ ${fmt(v / 1_000_000)} M`;
  if (v >= 1_000) return `R$ ${fmt(v / 1_000)} K`;
  return fmtBRL(v);
}
function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

/* ------------------------------------------------------------------ */
/*  Scenario type                                                      */
/* ------------------------------------------------------------------ */
interface Scenario {
  id: number;
  name: string;
  volume: number;
  ticket: number;
  visa: number;
  mastercard: number;
  elo: number;
  outros: number;
  credito: number;
  debito: number;
  pix: number;
  aVista: number;
  parc2a6: number;
  parc7a12: number;
  acquirerMarkup: number;
}

interface ScenarioResult {
  txCount: number;
  weightedMDR: number;
  custoTx: number;
  custoMensal: number;
  avgInterchange: number;
  avgSchemeFee: number;
  avgMarkup: number;
  pixCustoTotal: number;
}

function defaultScenario(id: number, name: string): Scenario {
  return {
    id,
    name,
    volume: 1_000_000,
    ticket: 150,
    visa: 50,
    mastercard: 35,
    elo: 10,
    outros: 5,
    credito: 60,
    debito: 25,
    pix: 15,
    aVista: 40,
    parc2a6: 40,
    parc7a12: 20,
    acquirerMarkup: 1.0,
  };
}

const PRESETS: Record<string, Partial<Scenario>> = {
  "E-commerce tipico": {
    volume: 2_000_000,
    ticket: 220,
    visa: 45,
    mastercard: 35,
    elo: 12,
    outros: 8,
    credito: 75,
    debito: 10,
    pix: 15,
    aVista: 30,
    parc2a6: 45,
    parc7a12: 25,
    acquirerMarkup: 0.90,
  },
  "Varejo fisico": {
    volume: 800_000,
    ticket: 85,
    visa: 40,
    mastercard: 30,
    elo: 20,
    outros: 10,
    credito: 40,
    debito: 40,
    pix: 20,
    aVista: 60,
    parc2a6: 30,
    parc7a12: 10,
    acquirerMarkup: 1.20,
  },
  SaaS: {
    volume: 500_000,
    ticket: 300,
    visa: 55,
    mastercard: 35,
    elo: 5,
    outros: 5,
    credito: 85,
    debito: 5,
    pix: 10,
    aVista: 50,
    parc2a6: 35,
    parc7a12: 15,
    acquirerMarkup: 0.80,
  },
  Marketplace: {
    volume: 5_000_000,
    ticket: 180,
    visa: 48,
    mastercard: 32,
    elo: 12,
    outros: 8,
    credito: 65,
    debito: 15,
    pix: 20,
    aVista: 35,
    parc2a6: 40,
    parc7a12: 25,
    acquirerMarkup: 0.70,
  },
};

function calcScenario(s: Scenario): ScenarioResult {
  const txCount = s.volume / (s.ticket || 1);

  const bandTotal = s.visa + s.mastercard + s.elo + s.outros || 1;
  const brands: { key: BrandKey; pct: number }[] = [
    { key: "visa", pct: s.visa / bandTotal },
    { key: "mastercard", pct: s.mastercard / bandTotal },
    { key: "elo", pct: s.elo / bandTotal },
    { key: "outros", pct: s.outros / bandTotal },
  ];

  const payTotal = s.credito + s.debito + s.pix || 1;
  const creditoPct = s.credito / payTotal;
  const debitoPct = s.debito / payTotal;
  const pixPct = s.pix / payTotal;

  const parcTotal = s.aVista + s.parc2a6 + s.parc7a12 || 1;
  const aVistaPct = s.aVista / parcTotal;
  const parc2a6Pct = s.parc2a6 / parcTotal;
  const parc7a12Pct = s.parc7a12 / parcTotal;

  // Weighted average installment for each band
  const avgInstallment1x = 1;
  const avgInstallment2to6 = 4; // midpoint
  const avgInstallment7to12 = 9; // midpoint

  // Credit interchange weighted by installment distribution
  let avgCreditInterchange = 0;
  let avgDebitInterchange = 0;
  let avgSchemeFee = 0;

  for (const b of brands) {
    const ic1x = getInterchange(b.key, avgInstallment1x);
    const ic2to6 = getInterchange(b.key, avgInstallment2to6);
    const ic7to12 = getInterchange(b.key, avgInstallment7to12);
    const weightedIC = ic1x * aVistaPct + ic2to6 * parc2a6Pct + ic7to12 * parc7a12Pct;
    avgCreditInterchange += weightedIC * b.pct;

    avgDebitInterchange += BRAND_RATES[b.key].debit * b.pct;
    avgSchemeFee += SCHEME_FEES[b.key] * b.pct;
  }

  // Credit MDR = interchange + scheme fee + markup
  const creditMDR = avgCreditInterchange + avgSchemeFee + s.acquirerMarkup;
  // Debit MDR = debit interchange + scheme fee + markup * 0.6 (typically lower)
  const debitMDR = avgDebitInterchange + avgSchemeFee + s.acquirerMarkup * 0.6;
  // Pix: fixed cost per tx converted to % of ticket
  const pixMDRpct = s.ticket > 0 ? (PIX_COST_PER_TX / s.ticket) * 100 : 0;

  const weightedMDR = creditMDR * creditoPct + debitMDR * debitoPct + pixMDRpct * pixPct;
  const custoMensal = s.volume * (weightedMDR / 100);
  const custoTx = txCount > 0 ? custoMensal / txCount : 0;

  const pixTxCount = txCount * pixPct;
  const pixCustoTotal = pixTxCount * PIX_COST_PER_TX;

  // Weighted averages for breakdown
  const totalInterchange = avgCreditInterchange * creditoPct + avgDebitInterchange * debitoPct;
  const totalScheme = avgSchemeFee * (creditoPct + debitoPct);
  const totalMarkup = s.acquirerMarkup * creditoPct + s.acquirerMarkup * 0.6 * debitoPct;

  return {
    txCount,
    weightedMDR,
    custoTx,
    custoMensal,
    avgInterchange: totalInterchange,
    avgSchemeFee: totalScheme,
    avgMarkup: totalMarkup,
    pixCustoTotal,
  };
}

/* ------------------------------------------------------------------ */
/*  Installment impact data                                            */
/* ------------------------------------------------------------------ */
function getInstallmentImpact(s: Scenario): { installment: number; mdr: number }[] {
  const bandTotal = s.visa + s.mastercard + s.elo + s.outros || 1;
  const brands: { key: BrandKey; pct: number }[] = [
    { key: "visa", pct: s.visa / bandTotal },
    { key: "mastercard", pct: s.mastercard / bandTotal },
    { key: "elo", pct: s.elo / bandTotal },
    { key: "outros", pct: s.outros / bandTotal },
  ];

  const result: { installment: number; mdr: number }[] = [];
  for (let inst = 1; inst <= 12; inst++) {
    let ic = 0;
    let sf = 0;
    for (const b of brands) {
      ic += getInterchange(b.key, inst) * b.pct;
      sf += SCHEME_FEES[b.key] * b.pct;
    }
    result.push({ installment: inst, mdr: ic + sf + s.acquirerMarkup });
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  SVG Pie Chart Component                                            */
/* ------------------------------------------------------------------ */
function PieChart({ slices, size }: { slices: { value: number; color: string; label: string }[]; size: number }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  let cumulative = 0;
  const paths: React.ReactElement[] = [];

  slices.forEach((slice, i) => {
    const pct = slice.value / total;
    if (pct <= 0) return;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;

    const r = size / 2;
    const cx = size / 2;
    const cy = size / 2;
    const largeArc = pct > 0.5 ? 1 : 0;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    if (pct >= 0.999) {
      // Full circle
      paths.push(
        <circle key={i} cx={cx} cy={cy} r={r} fill={slice.color} />
      );
    } else {
      paths.push(
        <path
          key={i}
          d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={slice.color}
        />
      );
    }
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths}
      <circle cx={size / 2} cy={size / 2} r={size * 0.28} fill="var(--surface)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: "var(--surface)",
  borderRadius: "14px",
  padding: "24px",
  border: "1px solid var(--border)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  ...extra,
});

const labelStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "var(--text-secondary)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--background)",
  color: "var(--foreground)",
  fontSize: "1rem",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function MDRCalculatorPage() {
  const { visitPage } = useGameProgress();
  useEffect(() => { visitPage("/tools/mdr-calculator"); }, [visitPage]);

  const [scenarios, setScenarios] = useState<Scenario[]>([
    defaultScenario(1, "Cenario A"),
  ]);
  const [activeTab, setActiveTab] = useState(0);

  const updateScenario = useCallback((index: number, updates: Partial<Scenario>) => {
    setScenarios(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  }, []);

  const addScenario = useCallback(() => {
    if (scenarios.length >= 3) return;
    const names = ["Cenario A", "Cenario B", "Cenario C"];
    const newId = Date.now();
    const base = { ...scenarios[scenarios.length - 1], id: newId, name: names[scenarios.length] };
    setScenarios(prev => [...prev, base]);
    setActiveTab(scenarios.length);
  }, [scenarios]);

  const removeScenario = useCallback((index: number) => {
    if (scenarios.length <= 1) return;
    setScenarios(prev => prev.filter((_, i) => i !== index));
    setActiveTab(t => Math.min(t, scenarios.length - 2));
  }, [scenarios.length]);

  const applyPreset = useCallback((presetName: string) => {
    const preset = PRESETS[presetName];
    if (!preset) return;
    updateScenario(activeTab, preset);
  }, [activeTab, updateScenario]);

  const results = useMemo(() => scenarios.map(calcScenario), [scenarios]);
  const installmentImpact = useMemo(() => getInstallmentImpact(scenarios[activeTab]), [scenarios, activeTab]);

  const sc = scenarios[activeTab];
  const res = results[activeTab];

  // Normalize display percentages
  const bandTotal = sc.visa + sc.mastercard + sc.elo + sc.outros || 1;
  const payTotal = sc.credito + sc.debito + sc.pix || 1;
  const parcTotal = sc.aVista + sc.parc2a6 + sc.parc7a12 || 1;

  const set = (field: keyof Scenario, value: number) => updateScenario(activeTab, { [field]: value });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>
          &larr; Ferramentas
        </Link>
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
        Calculadora de MDR / Interchange
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "32px" }}>
        Simule custos de processamento com base no seu volume, ticket e mix de pagamento.
      </p>

      {/* Scenario tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: activeTab === i ? "2px solid var(--primary)" : "1px solid var(--border)",
              background: activeTab === i ? "var(--primary-bg)" : "var(--surface)",
              color: activeTab === i ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {s.name}
            {scenarios.length > 1 && (
              <span
                onClick={(e) => { e.stopPropagation(); removeScenario(i); }}
                style={{ fontSize: "0.75rem", opacity: 0.6, cursor: "pointer", marginLeft: "4px" }}
              >
                x
              </span>
            )}
          </button>
        ))}
        {scenarios.length < 3 && (
          <button
            onClick={addScenario}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px dashed var(--border)",
              background: "transparent",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            + Adicionar cenario
          </button>
        )}
      </div>

      {/* Preset buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {Object.keys(PRESETS).map((name) => (
          <button
            key={name}
            onClick={() => applyPreset(name)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-secondary)",
              fontSize: "0.8rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Main grid: inputs | outputs */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "24px" }}>
        {/* ---- LEFT: Inputs ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Volume mensal */}
          <div style={card()}>
            <div style={labelStyle}>Volume mensal (R$)</div>
            <input
              type="range"
              min={10_000}
              max={100_000_000}
              step={10_000}
              value={sc.volume}
              onChange={(e) => set("volume", +e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)" }}
            />
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--foreground)", marginTop: "4px" }}>
              {fmtK(sc.volume)}
            </div>
          </div>

          {/* Ticket medio */}
          <div style={card()}>
            <div style={labelStyle}>Ticket medio (R$)</div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="range"
                min={10}
                max={5000}
                step={5}
                value={sc.ticket}
                onChange={(e) => set("ticket", +e.target.value)}
                style={{ flex: 1, accentColor: "var(--primary)" }}
              />
              <input
                type="number"
                min={10}
                max={5000}
                value={sc.ticket}
                onChange={(e) => set("ticket", clamp(+e.target.value, 10, 5000))}
                style={{ ...inputStyle, width: "100px" }}
              />
            </div>
          </div>

          {/* Mix de bandeiras */}
          <div style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={labelStyle}>Mix de bandeiras (%)</div>
              <div style={{ fontSize: "0.75rem", color: bandTotal === 100 ? "var(--text-secondary)" : "#ef4444", fontWeight: 500 }}>
                Total: {bandTotal}%{bandTotal !== 100 ? " (normalizado)" : ""}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              {([
                ["Visa", "visa", sc.visa, "#1a1f71"],
                ["Mastercard", "mastercard", sc.mastercard, "#eb001b"],
                ["Elo", "elo", sc.elo, "#00a4e0"],
                ["Outros", "outros", sc.outros, "#6B7280"],
              ] as [string, keyof Scenario, number, string][]).map(([name, field, val, color]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: "85px", fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 500 }}>
                    {name}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={val}
                    onChange={(e) => set(field, +e.target.value)}
                    style={{ flex: 1, accentColor: color }}
                  />
                  <span style={{ width: "40px", textAlign: "right", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {Math.round((val / bandTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tipo de pagamento */}
          <div style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={labelStyle}>Tipo de pagamento (%)</div>
              <div style={{ fontSize: "0.75rem", color: payTotal === 100 ? "var(--text-secondary)" : "#ef4444", fontWeight: 500 }}>
                Total: {payTotal}%{payTotal !== 100 ? " (normalizado)" : ""}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              {([
                ["Credito", "credito", sc.credito, "#6366f1"],
                ["Debito", "debito", sc.debito, "#f59e0b"],
                ["Pix", "pix", sc.pix, "#10b981"],
              ] as [string, keyof Scenario, number, string][]).map(([name, field, val, color]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: "85px", fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 500 }}>
                    {name}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={val}
                    onChange={(e) => set(field, +e.target.value)}
                    style={{ flex: 1, accentColor: color }}
                  />
                  <span style={{ width: "40px", textAlign: "right", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {Math.round((val / payTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Parcelamento distribution */}
          <div style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={labelStyle}>Distribuicao de parcelamento</div>
              <div style={{ fontSize: "0.75rem", color: parcTotal === 100 ? "var(--text-secondary)" : "#ef4444", fontWeight: 500 }}>
                Total: {parcTotal}%{parcTotal !== 100 ? " (normalizado)" : ""}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              {([
                ["A vista (1x)", "aVista", sc.aVista, "var(--primary)"],
                ["2x a 6x", "parc2a6", sc.parc2a6, "#f59e0b"],
                ["7x a 12x", "parc7a12", sc.parc7a12, "#ef4444"],
              ] as [string, keyof Scenario, number, string][]).map(([name, field, val, color]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: "85px", fontSize: "0.82rem", color: "var(--foreground)", fontWeight: 500 }}>
                    {name}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={val}
                    onChange={(e) => set(field, +e.target.value)}
                    style={{ flex: 1, accentColor: color }}
                  />
                  <span style={{ width: "40px", textAlign: "right", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {Math.round((val / parcTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Acquirer markup */}
          <div style={card()}>
            <div style={labelStyle}>Acquirer Markup (%)</div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="range"
                min={0.1}
                max={3.0}
                step={0.05}
                value={sc.acquirerMarkup}
                onChange={(e) => set("acquirerMarkup", +e.target.value)}
                style={{ flex: 1, accentColor: "#f43f5e" }}
              />
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", width: "55px", textAlign: "right" }}>
                {fmt(sc.acquirerMarkup)}%
              </span>
            </div>
          </div>
        </div>

        {/* ---- RIGHT: Output ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* MDR efetivo - hero card */}
          <div style={{
            ...card({
              background: "var(--primary-bg)",
              borderColor: "var(--primary)",
              textAlign: "center",
              padding: "32px 24px",
            }),
          }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              MDR Efetivo Total
            </div>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
              {fmt(res.weightedMDR)}%
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "8px" }}>
              Custo mensal: <strong style={{ color: "var(--foreground)" }}>{fmtK(res.custoMensal)}</strong>
            </div>
          </div>

          {/* 3 sub-cards: interchange, scheme, markup */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {([
              ["Interchange", fmt(res.avgInterchange) + "%", "#6366f1"],
              ["Scheme Fee", fmt(res.avgSchemeFee) + "%", "#f59e0b"],
              ["Acquirer Markup", fmt(res.avgMarkup) + "%", "#f43f5e"],
            ] as [string, string, string][]).map(([title, value, color]) => (
              <div key={title} style={{
                ...card({ padding: "16px", textAlign: "center" }),
                borderTop: `3px solid ${color}`,
              }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "6px" }}>
                  {title}
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Pie chart + cost per tx */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "12px" }}>Composicao do MDR</div>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <PieChart
                size={130}
                slices={[
                  { value: res.avgInterchange, color: "#6366f1", label: "Interchange" },
                  { value: res.avgSchemeFee, color: "#f59e0b", label: "Scheme Fee" },
                  { value: res.avgMarkup, color: "#f43f5e", label: "Markup" },
                ]}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                {([
                  ["Interchange", "#6366f1", res.avgInterchange],
                  ["Scheme Fee", "#f59e0b", res.avgSchemeFee],
                  ["Acquirer Markup", "#f43f5e", res.avgMarkup],
                ] as [string, string, number][]).map(([name, color, val]) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.85rem", color: "var(--foreground)", flex: 1 }}>{name}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)" }}>{fmt(val)}%</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "8px", marginTop: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Custo por transacao</span>
                    <span style={{ fontWeight: 700, color: "var(--foreground)" }}>{fmtBRL(res.custoTx)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginTop: "4px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Transacoes/mes</span>
                    <span style={{ fontWeight: 700, color: "var(--foreground)" }}>{Math.round(res.txCount).toLocaleString("pt-BR")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginTop: "4px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Custo mensal total</span>
                    <span style={{ fontWeight: 700, color: "var(--foreground)" }}>{fmtK(res.custoMensal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impacto do parcelamento */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "12px" }}>Impacto do Parcelamento no MDR</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {installmentImpact.map((item) => {
                const maxMdr = installmentImpact[installmentImpact.length - 1].mdr;
                const barPct = maxMdr > 0 ? (item.mdr / maxMdr) * 100 : 0;
                const isMin = item.installment === 1;
                const isMax = item.installment === 12;
                return (
                  <div key={item.installment} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "30px", fontSize: "0.78rem", color: "var(--text-secondary)", textAlign: "right", fontWeight: 500 }}>
                      {item.installment}x
                    </span>
                    <div style={{ flex: 1, height: "18px", background: "var(--background)", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                      <div style={{
                        width: `${barPct}%`,
                        height: "100%",
                        background: isMax ? "#ef4444" : isMin ? "#10b981" : "#6366f1",
                        borderRadius: "4px",
                        transition: "width 0.3s ease",
                        opacity: 0.85,
                      }} />
                    </div>
                    <span style={{
                      width: "55px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      textAlign: "right",
                      color: isMax ? "#ef4444" : isMin ? "#10b981" : "var(--foreground)",
                    }}>
                      {fmt(item.mdr)}%
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Highlight */}
            <div style={{
              marginTop: "12px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              fontSize: "0.82rem",
              color: "var(--foreground)",
            }}>
              Parcelado 12x custa{" "}
              <strong style={{ color: "#ef4444" }}>
                +{fmt(installmentImpact[11].mdr - installmentImpact[0].mdr)} p.p.
              </strong>{" "}
              a mais que a vista ({fmt(((installmentImpact[11].mdr - installmentImpact[0].mdr) / installmentImpact[0].mdr) * 100)}% mais caro)
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{
            padding: "12px 16px",
            background: "var(--surface)",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            fontSize: "0.78rem",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}>
            Valores de referencia baseados em taxas medias do mercado brasileiro (2024/2025).
            Taxas reais dependem de negociacao com o adquirente, volume, MCC e perfil de risco.
            Interchange segue tabelas publicas Visa/Mastercard/Elo. Pix: custo fixo estimado R$ 0,05/tx.
          </div>
        </div>
      </div>

      {/* ---- COMPARATIVE TABLE (shown when 2+ scenarios) ---- */}
      {scenarios.length >= 2 && (
        <div style={{ marginTop: "32px" }}>
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "16px", fontSize: "0.85rem" }}>
              Comparacao de Cenarios
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "2px solid var(--border)", color: "var(--text-secondary)", fontWeight: 600 }}>
                      Metrica
                    </th>
                    {scenarios.map((s) => (
                      <th key={s.id} style={{ textAlign: "center", padding: "10px 12px", borderBottom: "2px solid var(--border)", color: "var(--primary)", fontWeight: 700 }}>
                        {s.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["Volume mensal", results.map((_, i) => fmtK(scenarios[i].volume))],
                    ["MDR Efetivo", results.map(r => fmt(r.weightedMDR) + "%")],
                    ["Interchange medio", results.map(r => fmt(r.avgInterchange) + "%")],
                    ["Scheme Fee medio", results.map(r => fmt(r.avgSchemeFee) + "%")],
                    ["Markup medio", results.map(r => fmt(r.avgMarkup) + "%")],
                    ["Custo / Transacao", results.map(r => fmtBRL(r.custoTx))],
                    ["Custo Mensal", results.map(r => fmtK(r.custoMensal))],
                    ["Transacoes / mes", results.map(r => Math.round(r.txCount).toLocaleString("pt-BR"))],
                  ] as [string, string[]][]).map(([label, values], rowIdx) => (
                    <tr key={label} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 12px", color: "var(--foreground)", fontWeight: 500 }}>
                        {label}
                      </td>
                      {values.map((val, colIdx) => {
                        // Highlight the best (lowest) custo mensal
                        const isCustoRow = label === "Custo Mensal";
                        const isLowest = isCustoRow && results[colIdx].custoMensal === Math.min(...results.map(r => r.custoMensal));
                        return (
                          <td key={colIdx} style={{
                            padding: "10px 12px",
                            textAlign: "center",
                            color: isLowest ? "#10b981" : "var(--foreground)",
                            fontWeight: isLowest || rowIdx === 1 ? 700 : 400,
                            background: isLowest ? "rgba(16, 185, 129, 0.06)" : "transparent",
                          }}>
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Economia potencial */}
            {scenarios.length >= 2 && (() => {
              const costs = results.map(r => r.custoMensal);
              const maxCost = Math.max(...costs);
              const minCost = Math.min(...costs);
              const saving = maxCost - minCost;
              const bestIdx = costs.indexOf(minCost);
              const worstIdx = costs.indexOf(maxCost);
              if (saving <= 0) return null;
              return (
                <div style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}>
                  <div style={{ fontSize: "1.5rem" }}>$</div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)" }}>
                      Economia potencial: <span style={{ color: "#10b981" }}>{fmtK(saving)}/mes</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {scenarios[bestIdx].name} economiza {fmtK(saving)}/mes em relacao a {scenarios[worstIdx].name}
                      {" "}({fmtK(saving * 12)}/ano)
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
