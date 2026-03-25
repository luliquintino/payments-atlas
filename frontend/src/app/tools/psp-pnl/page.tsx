"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";

/* ------------------------------------------------------------------ */
/*  Formatters                                                         */
/* ------------------------------------------------------------------ */
function fmt(v: number) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtBRL(v: number) {
  return `R$ ${fmt(v)}`;
}
function fmtK(v: number): string {
  if (Math.abs(v) >= 1_000_000_000) return `R$ ${fmt(v / 1_000_000_000)} B`;
  if (Math.abs(v) >= 1_000_000) return `R$ ${fmt(v / 1_000_000)} M`;
  if (Math.abs(v) >= 1_000) return `R$ ${fmt(v / 1_000)} K`;
  return fmtBRL(v);
}
function fmtPct(v: number) {
  return `${fmt(v)}%`;
}

/* ------------------------------------------------------------------ */
/*  Presets                                                            */
/* ------------------------------------------------------------------ */
interface Preset {
  label: string;
  gmv: number;
  takeRate: number;
  creditPct: number;
  debitPct: number;
  pixPct: number;
  boletoPct: number;
  processingCost: number;
  chargebackRate: number;
  headcount: number;
  avgSalary: number;
  fixedCosts: number;
}

const PRESETS: Preset[] = [
  {
    label: "PSP Iniciante",
    gmv: 5_000_000, takeRate: 3.5, creditPct: 40, debitPct: 15, pixPct: 35, boletoPct: 10,
    processingCost: 1.8, chargebackRate: 1.2, headcount: 8, avgSalary: 12_000, fixedCosts: 30_000,
  },
  {
    label: "Sub-adquirente BR",
    gmv: 50_000_000, takeRate: 2.8, creditPct: 50, debitPct: 15, pixPct: 25, boletoPct: 10,
    processingCost: 1.5, chargebackRate: 0.8, headcount: 30, avgSalary: 15_000, fixedCosts: 80_000,
  },
  {
    label: "PayFac Scale",
    gmv: 500_000_000, takeRate: 2.2, creditPct: 55, debitPct: 15, pixPct: 20, boletoPct: 10,
    processingCost: 1.2, chargebackRate: 0.5, headcount: 120, avgSalary: 18_000, fixedCosts: 500_000,
  },
  {
    label: "Gateway Global",
    gmv: 2_000_000_000, takeRate: 1.5, creditPct: 65, debitPct: 10, pixPct: 15, boletoPct: 10,
    processingCost: 0.9, chargebackRate: 0.3, headcount: 400, avgSalary: 22_000, fixedCosts: 2_000_000,
  },
];

/* ------------------------------------------------------------------ */
/*  Scenario type                                                      */
/* ------------------------------------------------------------------ */
interface Scenario {
  name: string;
  gmv: number;
  takeRate: number;
  creditPct: number;
  debitPct: number;
  pixPct: number;
  boletoPct: number;
  processingCost: number;
  chargebackRate: number;
  headcount: number;
  avgSalary: number;
  fixedCosts: number;
  revenue: number;
  totalCosts: number;
  margin: number;
  breakEvenGMV: number;
}

/* ------------------------------------------------------------------ */
/*  Benchmark data                                                     */
/* ------------------------------------------------------------------ */
const BENCHMARKS = {
  avgMarket: { margin: 15, takeRate: 3.2, costPerTxn: 0.35, gmvPerEmployee: 8_000_000 },
  topQuartil: { margin: 24, takeRate: 2.5, costPerTxn: 0.18, gmvPerEmployee: 14_000_000 },
};

/* ------------------------------------------------------------------ */
/*  SVG Chart Components                                               */
/* ------------------------------------------------------------------ */
function BarChartSVG({ revenueData, costData }: { revenueData: number[]; costData: number[] }) {
  const W = 520, H = 220, padL = 55, padR = 10, padT = 15, padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = Math.max(...revenueData, ...costData, 1);
  const barGroupW = chartW / 12;
  const barW = barGroupW * 0.35;

  const yScale = (v: number) => padT + chartH - (v / maxVal) * chartH;
  const yTicks = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const val = (maxVal / yTicks) * i;
        const y = yScale(val);
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="var(--border)" strokeWidth={0.5} />
            <text x={padL - 5} y={y + 3} textAnchor="end" fontSize={8} fill="var(--text-secondary)">
              {val >= 1_000_000 ? `${(val / 1_000_000).toFixed(1)}M` : val >= 1_000 ? `${(val / 1_000).toFixed(0)}K` : val.toFixed(0)}
            </text>
          </g>
        );
      })}
      {revenueData.map((rev, i) => {
        const x = padL + i * barGroupW;
        const cost = costData[i];
        return (
          <g key={i}>
            <rect x={x + 2} y={yScale(rev)} width={barW} height={Math.max(0, (rev / maxVal) * chartH)} rx={2} fill="#10b981" opacity={0.85} />
            <rect x={x + 2 + barW + 2} y={yScale(cost)} width={barW} height={Math.max(0, (cost / maxVal) * chartH)} rx={2} fill="#ef4444" opacity={0.85} />
            <text x={x + barGroupW / 2} y={H - 8} textAnchor="middle" fontSize={8} fill="var(--text-secondary)">
              M{i + 1}
            </text>
          </g>
        );
      })}
      <line x1={padL} x2={W - padR} y1={yScale(costData[0])} y2={yScale(costData[0])} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,3" />
      <text x={W - padR} y={yScale(costData[0]) - 4} textAnchor="end" fontSize={7} fill="#f59e0b">break-even</text>
    </svg>
  );
}

function MarginTrendSVG({ marginData }: { marginData: number[] }) {
  const W = 520, H = 200, padL = 40, padR = 10, padT = 15, padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const minM = Math.min(...marginData, 0);
  const maxM = Math.max(...marginData, 30);
  const range = maxM - minM || 1;

  const yScale = (v: number) => padT + chartH - ((v - minM) / range) * chartH;
  const xScale = (i: number) => padL + (i / 11) * chartW;

  const points = marginData.map((m, i) => `${xScale(i)},${yScale(m)}`).join(" ");

  const zoneY = (v: number) => Math.max(padT, Math.min(padT + chartH, yScale(v)));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {maxM > 20 && (
        <rect x={padL} y={zoneY(maxM)} width={chartW} height={Math.max(0, zoneY(20) - zoneY(maxM))} fill="#10b981" opacity={0.07} />
      )}
      {maxM > 10 && (
        <rect x={padL} y={zoneY(20)} width={chartW} height={Math.max(0, zoneY(10) - zoneY(20))} fill="#f59e0b" opacity={0.07} />
      )}
      <rect x={padL} y={zoneY(10)} width={chartW} height={Math.max(0, zoneY(minM) - zoneY(10))} fill="#ef4444" opacity={0.07} />

      {[10, 20].map((v) => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={yScale(v)} y2={yScale(v)} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3,3" />
          <text x={padL - 4} y={yScale(v) + 3} textAnchor="end" fontSize={8} fill="var(--text-secondary)">{v}%</text>
        </g>
      ))}

      <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinejoin="round" />
      {marginData.map((m, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(m)} r={3} fill="#3b82f6" />
      ))}
      {marginData.map((_, i) => (
        <text key={`l${i}`} x={xScale(i)} y={H - 8} textAnchor="middle" fontSize={8} fill="var(--text-secondary)">
          M{i + 1}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function PSPPnlPage() {
  const { visitPage } = useGameProgress();
  useEffect(() => { visitPage("/tools/psp-pnl"); }, [visitPage]);

  /* --- State --- */
  const [gmv, setGmv] = useState(50_000_000);
  const [takeRate, setTakeRate] = useState(2.8);
  const [creditPct, setCreditPct] = useState(50);
  const [debitPct, setDebitPct] = useState(15);
  const [pixPct, setPixPct] = useState(25);
  const [boletoPct, setBoletoPct] = useState(10);
  const [processingCost, setProcessingCost] = useState(1.5);
  const [chargebackRate, setChargebackRate] = useState(0.8);
  const [headcount, setHeadcount] = useState(30);
  const [avgSalary, setAvgSalary] = useState(15_000);
  const [fixedCosts, setFixedCosts] = useState(80_000);

  /* Sensitivity offsets */
  const [takeRateOffset, setTakeRateOffset] = useState(0);
  const [volumeOffset, setVolumeOffset] = useState(0);
  const [cbOffset, setCbOffset] = useState(0);

  /* Scenarios */
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  /* Apply preset */
  const applyPreset = useCallback((p: Preset) => {
    setGmv(p.gmv);
    setTakeRate(p.takeRate);
    setCreditPct(p.creditPct);
    setDebitPct(p.debitPct);
    setPixPct(p.pixPct);
    setBoletoPct(p.boletoPct);
    setProcessingCost(p.processingCost);
    setChargebackRate(p.chargebackRate);
    setHeadcount(p.headcount);
    setAvgSalary(p.avgSalary);
    setFixedCosts(p.fixedCosts);
    setTakeRateOffset(0);
    setVolumeOffset(0);
    setCbOffset(0);
  }, []);

  /* --- Effective values with sensitivity --- */
  const effTakeRate = takeRate + takeRateOffset;
  const effGmv = gmv * (1 + volumeOffset / 100);
  const effCbRate = chargebackRate + cbOffset;

  /* --- Normalize mix --- */
  const mixTotal = creditPct + debitPct + pixPct + boletoPct || 1;
  const creditFrac = creditPct / mixTotal;
  const debitFrac = debitPct / mixTotal;
  const pixFrac = pixPct / mixTotal;
  const boletoFrac = boletoPct / mixTotal;

  /* --- P&L Calculation --- */
  const pnl = useMemo(() => {
    const revenue = effGmv * (effTakeRate / 100);

    const cardGmv = effGmv * (creditFrac + debitFrac);
    const interchangeAndScheme = effGmv * creditFrac * 0.0175 + effGmv * debitFrac * 0.008 + effGmv * pixFrac * 0.002 + effGmv * boletoFrac * 0.005;
    const processingTotal = effGmv * (processingCost / 100);
    const chargebackLosses = cardGmv * (effCbRate / 100);
    const peopleCost = headcount * avgSalary;
    const fixedTotal = fixedCosts;
    const totalCosts = interchangeAndScheme + processingTotal + chargebackLosses + peopleCost + fixedTotal;

    const ebitda = revenue - totalCosts;
    const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;

    const fixedOnly = peopleCost + fixedTotal;
    const varRevenueRate = effTakeRate / 100;
    const varCostRate = processingCost / 100
      + creditFrac * 0.0175 + debitFrac * 0.008 + pixFrac * 0.002 + boletoFrac * 0.005
      + (creditFrac + debitFrac) * (effCbRate / 100);
    const netRate = varRevenueRate - varCostRate;
    const breakEvenGMV = netRate > 0 ? fixedOnly / netRate : 0;

    const avgTxnValue = 150;
    const txnCount = effGmv / avgTxnValue;
    const revenuePerTxn = txnCount > 0 ? revenue / txnCount : 0;
    const costPerTxn = txnCount > 0 ? totalCosts / txnCount : 0;
    const marginPerTxn = revenuePerTxn - costPerTxn;
    const breakEvenTxn = breakEvenGMV / avgTxnValue;

    return {
      revenue, interchangeAndScheme, processingTotal, chargebackLosses,
      peopleCost, fixedTotal, totalCosts, ebitda, margin, breakEvenGMV,
      revenuePerTxn, costPerTxn, marginPerTxn, breakEvenTxn, txnCount,
      gmvPerEmployee: headcount > 0 ? effGmv / headcount : 0,
    };
  }, [effGmv, effTakeRate, creditFrac, debitFrac, pixFrac, boletoFrac, processingCost, effCbRate, headcount, avgSalary, fixedCosts]);

  /* --- Baseline P&L (without sensitivity) for delta display --- */
  const baselinePnl = useMemo(() => {
    const revenue = gmv * (takeRate / 100);
    const mixT = creditPct + debitPct + pixPct + boletoPct || 1;
    const cF = creditPct / mixT;
    const dF = debitPct / mixT;
    const pF = pixPct / mixT;
    const bF = boletoPct / mixT;
    const cardGmv = gmv * (cF + dF);
    const interchangeAndScheme = gmv * cF * 0.0175 + gmv * dF * 0.008 + gmv * pF * 0.002 + gmv * bF * 0.005;
    const processingTotal = gmv * (processingCost / 100);
    const chargebackLosses = cardGmv * (chargebackRate / 100);
    const peopleCost = headcount * avgSalary;
    const totalCosts = interchangeAndScheme + processingTotal + chargebackLosses + peopleCost + fixedCosts;
    return revenue - totalCosts;
  }, [gmv, takeRate, creditPct, debitPct, pixPct, boletoPct, processingCost, chargebackRate, headcount, avgSalary, fixedCosts]);

  /* --- 12-month projections (with growth) --- */
  const monthlyData = useMemo(() => {
    const months = 12;
    const growthRate = 1.03;
    const revenues: number[] = [];
    const costs: number[] = [];
    const margins: number[] = [];
    for (let i = 0; i < months; i++) {
      const mGmv = effGmv * Math.pow(growthRate, i);
      const rev = mGmv * (effTakeRate / 100);
      const cardGmv = mGmv * (creditFrac + debitFrac);
      const inter = mGmv * creditFrac * 0.0175 + mGmv * debitFrac * 0.008 + mGmv * pixFrac * 0.002 + mGmv * boletoFrac * 0.005;
      const proc = mGmv * (processingCost / 100);
      const cb = cardGmv * (effCbRate / 100);
      const people = headcount * avgSalary;
      const totalC = inter + proc + cb + people + fixedCosts;
      revenues.push(rev);
      costs.push(totalC);
      margins.push(rev > 0 ? ((rev - totalC) / rev) * 100 : 0);
    }
    return { revenues, costs, margins };
  }, [effGmv, effTakeRate, creditFrac, debitFrac, pixFrac, boletoFrac, processingCost, effCbRate, headcount, avgSalary, fixedCosts]);

  /* --- Save scenario --- */
  const saveScenario = useCallback(() => {
    if (scenarios.length >= 3) return;
    const names = ["Base", "Otimista", "Pessimista"];
    const name = names[scenarios.length] || `Cenario ${scenarios.length + 1}`;
    setScenarios((prev) => [...prev, {
      name, gmv: effGmv, takeRate: effTakeRate, creditPct, debitPct, pixPct, boletoPct,
      processingCost, chargebackRate: effCbRate, headcount, avgSalary, fixedCosts,
      revenue: pnl.revenue, totalCosts: pnl.totalCosts, margin: pnl.margin, breakEvenGMV: pnl.breakEvenGMV,
    }]);
  }, [scenarios, effGmv, effTakeRate, creditPct, debitPct, pixPct, boletoPct, processingCost, effCbRate, headcount, avgSalary, fixedCosts, pnl]);

  /* --- Sensitivity delta --- */
  const sensitivityDelta = pnl.ebitda - baselinePnl;

  /* ------------------------------------------------------------------ */
  /*  Styles                                                             */
  /* ------------------------------------------------------------------ */
  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--surface)",
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid var(--border)",
    ...extra,
  });

  const labelStyle: React.CSSProperties = {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "6px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--background)",
    color: "var(--foreground)",
    fontSize: "0.95rem",
  };

  const presetBtnStyle = (active?: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: "8px",
    border: active ? "2px solid var(--primary)" : "1px solid var(--border)",
    background: active ? "var(--primary-bg)" : "var(--surface)",
    color: active ? "var(--primary)" : "var(--foreground)",
    fontSize: "0.78rem",
    fontWeight: 600,
    cursor: "pointer",
  });

  const kpiCard = (color: string): React.CSSProperties => ({
    ...card(),
    borderLeft: `4px solid ${color}`,
    padding: "14px 16px",
  });

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>
          &larr; Ferramentas
        </Link>
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
        Simulador P&L de PSP
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "28px" }}>
        Monte o P&L de um PSP/sub-adquirente e encontre o break-even do seu GMV.
      </p>

      {/* ============================================================ */}
      {/* PRESETS                                                       */}
      {/* ============================================================ */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
        {PRESETS.map((p) => (
          <button key={p.label} style={presetBtnStyle()} onClick={() => applyPreset(p)}>
            {p.label}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* KPI ROW                                                       */}
      {/* ============================================================ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        <div style={kpiCard("#10b981")}>
          <div style={{ ...labelStyle, marginBottom: "2px" }}>Receita Mensal</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--foreground)" }}>{fmtK(pnl.revenue)}</div>
        </div>
        <div style={kpiCard("#ef4444")}>
          <div style={{ ...labelStyle, marginBottom: "2px" }}>Custos Totais</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--foreground)" }}>{fmtK(pnl.totalCosts)}</div>
        </div>
        <div style={kpiCard("#3b82f6")}>
          <div style={{ ...labelStyle, marginBottom: "2px" }}>Margem EBITDA</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: pnl.margin >= 0 ? "#10b981" : "#ef4444" }}>
            {fmtPct(pnl.margin)}
          </div>
        </div>
        <div style={kpiCard("#f59e0b")}>
          <div style={{ ...labelStyle, marginBottom: "2px" }}>Break-even GMV</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--foreground)" }}>{fmtK(pnl.breakEvenGMV)}</div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN GRID: Inputs left, Charts right                          */}
      {/* ============================================================ */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px" }}>

        {/* ---- LEFT: Inputs ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* GMV */}
          <div style={card()}>
            <div style={labelStyle}>GMV Mensal (R$)</div>
            <input type="range" min={1_000_000} max={5_000_000_000} step={1_000_000} value={gmv}
              onChange={(e) => setGmv(+e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)" }} />
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", marginTop: "4px" }}>
              {fmtK(gmv)}
            </div>
          </div>

          {/* Take rate */}
          <div style={card()}>
            <div style={labelStyle}>Take Rate / MDR Cobrado (%)</div>
            <input type="range" min={0.5} max={6} step={0.1} value={takeRate}
              onChange={(e) => setTakeRate(+e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)" }} />
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", marginTop: "4px" }}>
              {fmtPct(takeRate)}
            </div>
          </div>

          {/* Mix de meios */}
          <div style={card()}>
            <div style={labelStyle}>Mix de Meios de Pagamento (%)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              {([
                ["Credito", creditPct, setCreditPct, "#6366f1"],
                ["Debito", debitPct, setDebitPct, "#8b5cf6"],
                ["Pix", pixPct, setPixPct, "#10b981"],
                ["Boleto", boletoPct, setBoletoPct, "#f59e0b"],
              ] as [string, number, (v: number) => void, string][]).map(([name, val, setter, color]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: 56, fontSize: "0.82rem", color: "var(--foreground)", fontWeight: 500 }}>{name}</span>
                  <input type="range" min={0} max={100} value={val} onChange={(e) => setter(+e.target.value)}
                    style={{ flex: 1, accentColor: color }} />
                  <span style={{ width: 36, textAlign: "right", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    {Math.round((val / mixTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Processing cost */}
          <div style={card()}>
            <div style={labelStyle}>Custo Processamento (interchange + scheme) (%)</div>
            <input type="range" min={0.3} max={3} step={0.05} value={processingCost}
              onChange={(e) => setProcessingCost(+e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)" }} />
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", marginTop: "4px" }}>
              {fmtPct(processingCost)}
            </div>
          </div>

          {/* Chargeback rate */}
          <div style={card()}>
            <div style={labelStyle}>Chargeback Rate (%)</div>
            <input type="range" min={0} max={3} step={0.1} value={chargebackRate}
              onChange={(e) => setChargebackRate(+e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)" }} />
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--foreground)", marginTop: "4px" }}>
              {fmtPct(chargebackRate)}
            </div>
          </div>

          {/* Headcount */}
          <div style={card()}>
            <div style={labelStyle}>Headcount (funcionarios)</div>
            <input type="number" min={1} max={5000} value={headcount}
              onChange={(e) => setHeadcount(+e.target.value)} style={inputStyle} />
          </div>

          {/* Avg salary */}
          <div style={card()}>
            <div style={labelStyle}>Custo Medio por Funcionario (R$/mes)</div>
            <input type="number" min={3000} max={80000} step={1000} value={avgSalary}
              onChange={(e) => setAvgSalary(+e.target.value)} style={inputStyle} />
          </div>

          {/* Fixed costs */}
          <div style={card()}>
            <div style={labelStyle}>Custos Fixos (infra, licencas, etc.) (R$/mes)</div>
            <input type="number" min={5000} max={10_000_000} step={5000} value={fixedCosts}
              onChange={(e) => setFixedCosts(+e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* ---- RIGHT: Charts & Dashboard ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* ============================================================ */}
          {/* 2x2 CHART GRID                                               */}
          {/* ============================================================ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

            {/* a) Receita vs Custo bar chart */}
            <div style={card()}>
              <div style={{ ...labelStyle, marginBottom: "10px" }}>Receita vs Custo (12 meses)</div>
              <BarChartSVG revenueData={monthlyData.revenues} costData={monthlyData.costs} />
              <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#10b981", display: "inline-block" }} /> Receita
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#ef4444", display: "inline-block" }} /> Custos
                </span>
              </div>
            </div>

            {/* b) Margem trend line chart */}
            <div style={card()}>
              <div style={{ ...labelStyle, marginBottom: "10px" }}>Margem % (Trend 12 meses)</div>
              <MarginTrendSVG marginData={monthlyData.margins} />
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <span style={{ fontSize: "0.72rem", color: "#10b981" }}>■ &gt;20% saudavel</span>
                <span style={{ fontSize: "0.72rem", color: "#f59e0b" }}>■ 10-20% atencao</span>
                <span style={{ fontSize: "0.72rem", color: "#ef4444" }}>■ &lt;10% risco</span>
              </div>
            </div>

            {/* c) Break-even analysis */}
            <div style={card()}>
              <div style={{ ...labelStyle, marginBottom: "10px" }}>Break-even Analysis</div>
              <div style={{ display: "flex", gap: "16px", marginBottom: "14px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "2px" }}>
                    Break-even em
                  </div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--primary)" }}>
                    {fmtK(pnl.breakEvenGMV)}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    ~{Math.round(pnl.breakEvenTxn).toLocaleString("pt-BR")} txns/mes
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "2px" }}>
                    GMV Atual
                  </div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--foreground)" }}>
                    {fmtK(effGmv)}
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Progresso: {fmt(Math.min((effGmv / (pnl.breakEvenGMV || 1)) * 100, 999))}%
              </div>
              <div style={{ height: 10, borderRadius: 5, background: "var(--border)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  borderRadius: 5,
                  width: `${Math.min((effGmv / (pnl.breakEvenGMV || 1)) * 100, 100)}%`,
                  background: effGmv >= pnl.breakEvenGMV ? "#10b981" : "#f59e0b",
                  transition: "width 0.3s ease",
                }} />
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                {effGmv >= pnl.breakEvenGMV
                  ? `Acima do break-even em ${fmt(((effGmv / (pnl.breakEvenGMV || 1)) - 1) * 100)}%`
                  : `Faltam ${fmtK(pnl.breakEvenGMV - effGmv)} para o break-even`}
              </div>
            </div>

            {/* d) Unit Economics */}
            <div style={card()}>
              <div style={{ ...labelStyle, marginBottom: "10px" }}>Unit Economics</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {([
                  ["Receita / txn", pnl.revenuePerTxn, "#10b981"],
                  ["Custo / txn", pnl.costPerTxn, "#ef4444"],
                  ["Margem / txn", pnl.marginPerTxn, "#3b82f6"],
                ] as [string, number, string][]).map(([label, value, color]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>
                      {fmtBRL(value)}
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px", marginTop: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>GMV / funcionario</span>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", fontVariantNumeric: "tabular-nums" }}>
                      {fmtK(pnl.gmvPerEmployee)}/mes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SENSITIVITY SLIDERS                                          */}
          {/* ============================================================ */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "14px" }}>Analise de Sensibilidade</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>

              {/* Take Rate slider */}
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Take Rate: {takeRateOffset >= 0 ? "+" : ""}{fmt(takeRateOffset)}%
                </div>
                <input type="range" min={-0.5} max={0.5} step={0.05} value={takeRateOffset}
                  onChange={(e) => setTakeRateOffset(+e.target.value)}
                  style={{ width: "100%", accentColor: "var(--primary)" }} />
                <div style={{
                  fontSize: "0.78rem", fontWeight: 600, marginTop: "4px",
                  color: takeRateOffset >= 0 ? "#10b981" : "#ef4444",
                }}>
                  {takeRateOffset !== 0
                    ? `${sensitivityDelta >= 0 ? "+" : ""}${fmtK(sensitivityDelta)}/mes`
                    : "baseline"}
                </div>
              </div>

              {/* Volume slider */}
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Volume: {volumeOffset >= 0 ? "+" : ""}{fmt(volumeOffset)}%
                </div>
                <input type="range" min={-30} max={30} step={1} value={volumeOffset}
                  onChange={(e) => setVolumeOffset(+e.target.value)}
                  style={{ width: "100%", accentColor: "var(--primary)" }} />
                <div style={{
                  fontSize: "0.78rem", fontWeight: 600, marginTop: "4px",
                  color: volumeOffset >= 0 ? "#10b981" : "#ef4444",
                }}>
                  {volumeOffset !== 0
                    ? `${sensitivityDelta >= 0 ? "+" : ""}${fmtK(sensitivityDelta)}/mes`
                    : "baseline"}
                </div>
              </div>

              {/* Chargeback slider */}
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Chargeback: {cbOffset >= 0 ? "+" : ""}{fmt(cbOffset)}%
                </div>
                <input type="range" min={-0.5} max={0.5} step={0.05} value={cbOffset}
                  onChange={(e) => setCbOffset(+e.target.value)}
                  style={{ width: "100%", accentColor: "var(--primary)" }} />
                <div style={{
                  fontSize: "0.78rem", fontWeight: 600, marginTop: "4px",
                  color: cbOffset <= 0 ? "#10b981" : "#ef4444",
                }}>
                  {cbOffset !== 0
                    ? `${sensitivityDelta >= 0 ? "+" : ""}${fmtK(sensitivityDelta)}/mes`
                    : "baseline"}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* BENCHMARK COMPARISON                                         */}
          {/* ============================================================ */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "12px" }}>Benchmark: Seu PSP vs Mercado BR</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 10px", color: "var(--text-secondary)", fontWeight: 600 }}>Metrica</th>
                    <th style={{ textAlign: "right", padding: "8px 10px", color: "var(--primary)", fontWeight: 700 }}>Seu PSP</th>
                    <th style={{ textAlign: "right", padding: "8px 10px", color: "var(--text-secondary)", fontWeight: 600 }}>Media Mercado</th>
                    <th style={{ textAlign: "right", padding: "8px 10px", color: "#10b981", fontWeight: 600 }}>Top Quartil</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["Margem Liquida (%)", fmtPct(pnl.margin), fmtPct(BENCHMARKS.avgMarket.margin), fmtPct(BENCHMARKS.topQuartil.margin)],
                    ["Take Rate (%)", fmtPct(effTakeRate), fmtPct(BENCHMARKS.avgMarket.takeRate), fmtPct(BENCHMARKS.topQuartil.takeRate)],
                    ["Custo / txn (R$)", fmtBRL(pnl.costPerTxn), fmtBRL(BENCHMARKS.avgMarket.costPerTxn), fmtBRL(BENCHMARKS.topQuartil.costPerTxn)],
                    ["GMV / funcionario", fmtK(pnl.gmvPerEmployee), fmtK(BENCHMARKS.avgMarket.gmvPerEmployee), fmtK(BENCHMARKS.topQuartil.gmvPerEmployee)],
                  ] as [string, string, string, string][]).map(([metric, yours, avg, top], i) => (
                    <tr key={metric} style={{ borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "8px 10px", color: "var(--foreground)" }}>{metric}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: "var(--foreground)", fontVariantNumeric: "tabular-nums" }}>{yours}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>{avg}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#10b981", fontVariantNumeric: "tabular-nums" }}>{top}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SCENARIO COMPARISON                                          */}
          {/* ============================================================ */}
          <div style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={labelStyle}>Cenarios Comparativos</div>
              <button
                onClick={saveScenario}
                disabled={scenarios.length >= 3}
                style={{
                  padding: "6px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--primary)",
                  background: scenarios.length >= 3 ? "var(--border)" : "var(--primary-bg)",
                  color: scenarios.length >= 3 ? "var(--text-secondary)" : "var(--primary)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: scenarios.length >= 3 ? "default" : "pointer",
                  opacity: scenarios.length >= 3 ? 0.5 : 1,
                }}
              >
                Salvar Cenario ({scenarios.length}/3)
              </button>
            </div>
            {scenarios.length === 0 ? (
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", padding: "16px 0", textAlign: "center" }}>
                Ajuste os parametros e clique em &quot;Salvar Cenario&quot; para comparar ate 3 cenarios.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th style={{ textAlign: "left", padding: "8px 10px", color: "var(--text-secondary)", fontWeight: 600 }}>Metrica</th>
                      {scenarios.map((s) => (
                        <th key={s.name} style={{ textAlign: "right", padding: "8px 10px", color: "var(--primary)", fontWeight: 700 }}>{s.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      ["GMV", (s: Scenario) => fmtK(s.gmv)],
                      ["Take Rate", (s: Scenario) => fmtPct(s.takeRate)],
                      ["Receita", (s: Scenario) => fmtK(s.revenue)],
                      ["Custos", (s: Scenario) => fmtK(s.totalCosts)],
                      ["Margem", (s: Scenario) => fmtPct(s.margin)],
                      ["Break-even", (s: Scenario) => fmtK(s.breakEvenGMV)],
                      ["Chargeback", (s: Scenario) => fmtPct(s.chargebackRate)],
                    ] as [string, (s: Scenario) => string][]).map(([metric, fn], i) => {
                      const vals = scenarios.map(fn);
                      const best = metric === "Custos" || metric === "Break-even" || metric === "Chargeback"
                        ? vals.reduce((min, v, idx) => (v < vals[min] ? idx : min), 0)
                        : vals.reduce((max, v, idx) => (v > vals[max] ? idx : max), 0);
                      return (
                        <tr key={metric} style={{ borderBottom: i < 6 ? "1px solid var(--border)" : "none" }}>
                          <td style={{ padding: "8px 10px", color: "var(--foreground)" }}>{metric}</td>
                          {scenarios.map((s, idx) => (
                            <td key={s.name + metric} style={{
                              padding: "8px 10px",
                              textAlign: "right",
                              fontWeight: idx === best ? 700 : 400,
                              color: idx === best ? "#10b981" : "var(--foreground)",
                              fontVariantNumeric: "tabular-nums",
                            }}>
                              {fn(s)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ marginTop: "10px", textAlign: "right" }}>
                  <button
                    onClick={() => setScenarios([])}
                    style={{
                      padding: "4px 12px", borderRadius: "6px", border: "1px solid var(--border)",
                      background: "var(--surface)", color: "var(--text-secondary)", fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    Limpar cenarios
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div style={{
            padding: "12px 16px", background: "var(--surface)", borderRadius: "10px",
            border: "1px solid var(--border)", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5,
          }}>
            Simulacao simplificada com projecao de crescimento de 3%/mes.
            Nao inclui impostos, depreciacoes ou custos regulatorios. Benchmarks baseados em dados publicos do mercado BR 2024-2025.
          </div>
        </div>
      </div>
    </div>
  );
}
