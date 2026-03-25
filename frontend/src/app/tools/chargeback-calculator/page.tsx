"use client";

import { useState, useMemo, useEffect } from "react";
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
  if (v >= 1_000_000) return `R$ ${fmt(v / 1_000_000)} M`;
  if (v >= 1_000) return `R$ ${fmt(v / 1_000)} K`;
  return fmtBRL(v);
}
function fmtInt(v: number) {
  return Math.round(v).toLocaleString("pt-BR");
}

/* ------------------------------------------------------------------ */
/*  Prevention tools data                                              */
/* ------------------------------------------------------------------ */
interface PreventionTool {
  id: string;
  name: string;
  costLabel: string;
  costPerUnit: number;
  costMode: "per-txn" | "per-cb";
  reductionMin: number;
  reductionMax: number;
  description: string;
  winRateBoost: number;
}

const PREVENTION_TOOLS: PreventionTool[] = [
  {
    id: "3ds",
    name: "3D Secure",
    costLabel: "~R$ 0,05/txn",
    costPerUnit: 0.05,
    costMode: "per-txn",
    reductionMin: 30,
    reductionMax: 50,
    description: "Autenticacao do portador reduz fraude e transfere liability",
    winRateBoost: 0,
  },
  {
    id: "ethoca",
    name: "Ethoca/CDRN Alerts",
    costLabel: "~R$ 25/alerta",
    costPerUnit: 25,
    costMode: "per-cb",
    reductionMin: 15,
    reductionMax: 25,
    description: "Alertas pre-disputa permitem reembolso proativo",
    winRateBoost: 0,
  },
  {
    id: "rdr",
    name: "RDR (Rapid Dispute Resolution)",
    costLabel: "~R$ 10/caso",
    costPerUnit: 10,
    costMode: "per-cb",
    reductionMin: 10,
    reductionMax: 15,
    description: "Resolucao automatica antes de virar chargeback formal",
    winRateBoost: 0,
  },
  {
    id: "fraud-scoring",
    name: "Fraud Scoring Avancado",
    costLabel: "~R$ 0,02/txn",
    costPerUnit: 0.02,
    costMode: "per-txn",
    reductionMin: 20,
    reductionMax: 35,
    description: "Machine learning para detectar transacoes suspeitas em tempo real",
    winRateBoost: 0,
  },
  {
    id: "ce3",
    name: "Compelling Evidence 3.0 (Visa)",
    costLabel: "Setup + operacional",
    costPerUnit: 0.01,
    costMode: "per-txn",
    reductionMin: 0,
    reductionMax: 0,
    description: "Evidencias de transacoes anteriores do mesmo dispositivo/IP aumentam win rate",
    winRateBoost: 35,
  },
];

/* ------------------------------------------------------------------ */
/*  Brand monitoring thresholds                                        */
/* ------------------------------------------------------------------ */
interface ProgramStatus {
  name: string;
  status: "ok" | "alert" | "penalty";
  label: string;
  detail: string;
  monthlyFine: number;
}

function getVisaVDMP(rate: number, count: number): ProgramStatus {
  if (rate > 1.8 && count > 100) {
    return { name: "Visa VDMP", status: "penalty", label: "Excessivo", detail: "Rate >1.8% + >100 disputas. Multas de $25K-$50K/mes.", monthlyFine: 50000 };
  }
  if (rate > 0.9 && count > 100) {
    return { name: "Visa VDMP", status: "alert", label: "Standard", detail: "Rate >0.9% + >100 disputas. 4 meses para corrigir.", monthlyFine: 0 };
  }
  return { name: "Visa VDMP", status: "ok", label: "Fora do programa", detail: "Rate abaixo dos limites.", monthlyFine: 0 };
}

function getMastercardECM(rate: number, count: number): ProgramStatus {
  if (rate > 1.5 && count > 100) {
    return { name: "Mastercard ECP", status: "penalty", label: "Excessive (ECP)", detail: "Rate >1.5% + >100 disputas. Multas de $25K-$100K/mes.", monthlyFine: 75000 };
  }
  if (rate > 1.0 && count > 100) {
    return { name: "Mastercard ECM", status: "alert", label: "ECM Ativo", detail: "Rate >1.0% + >100 disputas. Precisa apresentar plano de acao.", monthlyFine: 0 };
  }
  return { name: "Mastercard ECM", status: "ok", label: "Fora do programa", detail: "Rate abaixo dos limites.", monthlyFine: 0 };
}

/* ------------------------------------------------------------------ */
/*  SVG Line Chart (no library)                                        */
/* ------------------------------------------------------------------ */
function ProjectionChart({
  currentMonthly,
  preventedMonthly,
}: {
  currentMonthly: number;
  preventedMonthly: number;
}) {
  const W = 600;
  const H = 280;
  const padL = 80;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentData = months.map((m) => currentMonthly * m);
  const preventedData = months.map((m) => preventedMonthly * m);
  const maxVal = Math.max(currentData[11], 1);

  const toX = (m: number) => padL + ((m - 1) / 11) * chartW;
  const toY = (v: number) => padT + chartH - (v / maxVal) * chartH;

  const currentPath = months.map((m, i) => `${i === 0 ? "M" : "L"}${toX(m)},${toY(currentData[i])}`).join(" ");
  const preventedPath = months.map((m, i) => `${i === 0 ? "M" : "L"}${toX(m)},${toY(preventedData[i])}`).join(" ");

  const areaPath =
    months.map((m, i) => `${i === 0 ? "M" : "L"}${toX(m)},${toY(currentData[i])}`).join(" ") +
    " " +
    [...months].reverse().map((m, i) => `L${toX(m)},${toY(preventedData[11 - i])}`).join(" ") +
    " Z";

  const yTicks = 5;
  const yLines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const val = (maxVal / yTicks) * i;
    return { val, y: toY(val) };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {/* Grid lines */}
      {yLines.map((line, i) => (
        <g key={i}>
          <line x1={padL} y1={line.y} x2={W - padR} y2={line.y} stroke="var(--border)" strokeWidth={1} strokeDasharray={i === 0 ? "0" : "4,4"} />
          <text x={padL - 8} y={line.y + 4} textAnchor="end" fill="var(--text-secondary)" fontSize={10}>
            {line.val >= 1_000_000 ? `${(line.val / 1_000_000).toFixed(1)}M` : line.val >= 1_000 ? `${(line.val / 1_000).toFixed(0)}K` : line.val.toFixed(0)}
          </text>
        </g>
      ))}
      {/* X-axis labels */}
      {months.map((m) => (
        <text key={m} x={toX(m)} y={H - 8} textAnchor="middle" fill="var(--text-secondary)" fontSize={10}>
          {m}
        </text>
      ))}
      {/* Shaded area between lines */}
      <path d={areaPath} fill="rgba(16,185,129,0.1)" />
      {/* Current line */}
      <path d={currentPath} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Prevented line */}
      <path d={preventedPath} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Endpoint dots */}
      <circle cx={toX(12)} cy={toY(currentData[11])} r={4} fill="#ef4444" />
      <circle cx={toX(12)} cy={toY(preventedData[11])} r={4} fill="#10b981" />
      {/* Legend */}
      <rect x={padL + 10} y={padT + 4} width={10} height={10} rx={2} fill="#ef4444" />
      <text x={padL + 24} y={padT + 13} fill="var(--foreground)" fontSize={10}>Se mantiver rate atual</text>
      <rect x={padL + 10} y={padT + 20} width={10} height={10} rx={2} fill="#10b981" />
      <text x={padL + 24} y={padT + 29} fill="var(--foreground)" fontSize={10}>Com prevencao ativa</text>
      {/* Savings label */}
      {currentMonthly > preventedMonthly && (
        <text
          x={toX(7)}
          y={toY((currentData[6] + preventedData[6]) / 2)}
          textAnchor="middle"
          fill="#10b981"
          fontSize={11}
          fontWeight={600}
        >
          Economia potencial
        </text>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Threshold Bar Component                                            */
/* ------------------------------------------------------------------ */
function ThresholdBar({ rate }: { rate: number }) {
  const maxRate = 2.5;
  const clampedRate = Math.min(rate, maxRate);
  const position = (clampedRate / maxRate) * 100;

  const zones = [
    { end: 0.65, color: "#10b981", label: "Saudavel" },
    { end: 0.9, color: "#f59e0b", label: "Atencao" },
    { end: 1.5, color: "#f97316", label: "VDMP/ECM" },
    { end: maxRate, color: "#ef4444", label: "ECP" },
  ];

  return (
    <div style={{ padding: 0 }}>
      {/* Bar */}
      <div style={{ position: "relative", height: 32, borderRadius: 8, overflow: "hidden", display: "flex" }}>
        {zones.map((zone, i) => {
          const start = i === 0 ? 0 : zones[i - 1].end;
          const width = ((zone.end - start) / maxRate) * 100;
          return (
            <div
              key={zone.label}
              style={{
                width: `${width}%`,
                height: "100%",
                background: zone.color,
                opacity: 0.25,
                position: "relative",
              }}
            />
          );
        })}
        {/* Marker */}
        <div
          style={{
            position: "absolute",
            left: `${position}%`,
            top: 0,
            bottom: 0,
            width: 3,
            background: "var(--foreground)",
            transform: "translateX(-50%)",
            zIndex: 2,
            boxShadow: "0 0 8px rgba(255,255,255,0.5)",
          }}
        />
        {/* Glow dot */}
        <div
          style={{
            position: "absolute",
            left: `${position}%`,
            top: "50%",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "var(--foreground)",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
            boxShadow: "0 0 12px var(--primary), 0 0 4px var(--primary)",
          }}
        />
      </div>
      {/* Zone labels */}
      <div style={{ position: "relative", height: 20, marginTop: 6 }}>
        {zones.map((zone, i) => {
          const start = i === 0 ? 0 : zones[i - 1].end;
          const mid = ((start + zone.end) / 2 / maxRate) * 100;
          return (
            <span
              key={zone.label}
              style={{
                position: "absolute",
                left: `${mid}%`,
                transform: "translateX(-50%)",
                fontSize: "0.65rem",
                fontWeight: 600,
                color: zone.color,
              }}
            >
              {zone.label}
            </span>
          );
        })}
      </div>
      {/* Threshold markers */}
      <div style={{ position: "relative", height: 16 }}>
        {[0.65, 0.9, 1.5].map((t) => (
          <span
            key={t}
            style={{
              position: "absolute",
              left: `${(t / maxRate) * 100}%`,
              transform: "translateX(-50%)",
              fontSize: "0.6rem",
              color: "var(--text-secondary)",
            }}
          >
            {t}%
          </span>
        ))}
      </div>
      {/* "Voce esta aqui" label */}
      <div
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--foreground)",
          marginTop: 2,
        }}
      >
        Voce esta aqui: {fmt(rate)}%
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function ChargebackCalculatorPage() {
  const { visitPage } = useGameProgress();
  useEffect(() => {
    visitPage("/tools/chargeback-calculator");
  }, [visitPage]);

  /* --- Inputs --- */
  const [txVolume, setTxVolume] = useState(50_000);
  const [ticket, setTicket] = useState(200);
  const [cbRate, setCbRate] = useState(1.2);
  const [winRate, setWinRate] = useState(35);
  const [costPerDispute, setCostPerDispute] = useState(150);

  /* --- Prevention toggles --- */
  const [enabledTools, setEnabledTools] = useState<Record<string, boolean>>({});
  const toggleTool = (id: string) => setEnabledTools((prev) => ({ ...prev, [id]: !prev[id] }));

  /* --- Calculations --- */
  const calc = useMemo(() => {
    const gmv = txVolume * ticket;
    const cbCount = Math.round(txVolume * (cbRate / 100));
    const cbValue = cbCount * ticket;
    const lostValue = cbValue * ((100 - winRate) / 100);

    // Sub-components of cost
    const operationalFee = cbCount * 75; // avg R$ 50-100 per dispute (brand fee)
    const schemeFee = cbCount * 20; // avg R$ 15-25 per chargeback
    const internalCost = cbCount * costPerDispute;

    // Brand program fines
    const visaStatus = getVisaVDMP(cbRate, cbCount);
    const mcStatus = getMastercardECM(cbRate, cbCount);
    const usdToBrl = 5.0;
    const finesBRL = (visaStatus.monthlyFine + mcStatus.monthlyFine) * usdToBrl;

    const totalImpact = lostValue + operationalFee + schemeFee + internalCost + finesBRL;
    const costMultiplier = cbValue > 0 ? totalImpact / cbValue : 0;

    // Cost breakdown items
    const breakdown = [
      { label: "Valor das transacoes perdidas", value: lostValue, color: "#ef4444" },
      { label: "Operational fee (bandeira)", value: operationalFee, color: "#f97316" },
      { label: "Scheme fee por chargeback", value: schemeFee, color: "#f59e0b" },
      { label: "Custo operacional interno", value: internalCost, color: "#8b5cf6" },
      { label: "Multas estimadas", value: finesBRL, color: "#dc2626" },
    ];

    // Prevention calculations
    let effectiveReduction = 0;
    let effectiveWinRateBoost = 0;
    let preventionCost = 0;

    const activeTools = PREVENTION_TOOLS.filter((t) => enabledTools[t.id]);
    for (const tool of activeTools) {
      const avgReduction = (tool.reductionMin + tool.reductionMax) / 2;
      // Diminishing returns: each tool applies to remaining rate
      effectiveReduction = effectiveReduction + (1 - effectiveReduction / 100) * avgReduction;
      effectiveWinRateBoost += tool.winRateBoost;
      if (tool.costMode === "per-txn") {
        preventionCost += txVolume * tool.costPerUnit;
      } else {
        preventionCost += cbCount * tool.costPerUnit;
      }
    }

    const preventedRate = cbRate * (1 - effectiveReduction / 100);
    const preventedWinRate = Math.min(100, winRate + effectiveWinRateBoost);
    const preventedCbCount = Math.round(txVolume * (preventedRate / 100));
    const preventedCbValue = preventedCbCount * ticket;
    const preventedLostValue = preventedCbValue * ((100 - preventedWinRate) / 100);
    const preventedOpFee = preventedCbCount * 75;
    const preventedSchemeFee = preventedCbCount * 20;
    const preventedInternal = preventedCbCount * costPerDispute;
    const preventedVisaStatus = getVisaVDMP(preventedRate, preventedCbCount);
    const preventedMcStatus = getMastercardECM(preventedRate, preventedCbCount);
    const preventedFines = (preventedVisaStatus.monthlyFine + preventedMcStatus.monthlyFine) * usdToBrl;
    const preventedTotal = preventedLostValue + preventedOpFee + preventedSchemeFee + preventedInternal + preventedFines;

    const monthlySavings = totalImpact - preventedTotal - preventionCost;
    const roiMonths = monthlySavings > 0 ? preventionCost / monthlySavings : Infinity;

    // Fine schedule for threshold table
    const fineSchedule = [];
    if (cbRate > 0.9) {
      fineSchedule.push({ month: "Mes 1-4", program: "Visa VDMP Standard", fine: "Sem multa (periodo de correcao)" });
      fineSchedule.push({ month: "Mes 5-9", program: "Visa VDMP Standard", fine: "$25.000/mes" });
      fineSchedule.push({ month: "Mes 10+", program: "Visa VDMP Standard", fine: "$50.000-$75.000/mes" });
    }
    if (cbRate > 1.0) {
      fineSchedule.push({ month: "Mes 1-3", program: "Mastercard ECM", fine: "Sem multa (plano de acao)" });
      fineSchedule.push({ month: "Mes 4-6", program: "Mastercard ECM", fine: "$5.000-$25.000/mes" });
    }
    if (cbRate > 1.5) {
      fineSchedule.push({ month: "Imediato", program: "Mastercard ECP", fine: "$25.000-$100.000/mes" });
    }

    return {
      gmv,
      cbCount,
      cbValue,
      lostValue,
      operationalFee,
      schemeFee,
      internalCost,
      finesBRL,
      totalImpact,
      costMultiplier,
      breakdown,
      visaStatus,
      mcStatus,
      preventedRate,
      preventedTotal,
      preventionCost,
      monthlySavings,
      roiMonths,
      fineSchedule,
    };
  }, [txVolume, ticket, cbRate, winRate, costPerDispute, enabledTools]);

  /* --- Styles --- */
  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--surface)",
    borderRadius: 14,
    padding: "1.5rem",
    border: "1px solid var(--border)",
    ...extra,
  });

  const labelStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: 6,
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
      <div style={{ marginBottom: 24 }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>
          &larr; Ferramentas
        </Link>
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>
        Calculadora de Chargeback
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: 32, lineHeight: 1.5 }}>
        Calcule o custo real de chargebacks, verifique seu status nos programas de monitoramento e simule o ROI de ferramentas de prevencao.
      </p>

      {/* ============================================================ */}
      {/*  SECTION 1: INPUTS                                           */}
      {/* ============================================================ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
        {/* Volume mensal */}
        <div style={card()}>
          <div style={labelStyle}>Volume mensal de transacoes</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="range"
              min={1000}
              max={500_000}
              step={1000}
              value={txVolume}
              onChange={(e) => setTxVolume(+e.target.value)}
              style={{ flex: 1, accentColor: "var(--primary)" }}
            />
            <input
              type="number"
              min={1000}
              max={500000}
              value={txVolume}
              onChange={(e) => setTxVolume(+e.target.value)}
              style={{ ...inputStyle, width: 100 }}
            />
          </div>
        </div>

        {/* Ticket medio */}
        <div style={card()}>
          <div style={labelStyle}>Ticket medio (R$)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="range"
              min={10}
              max={2000}
              step={10}
              value={ticket}
              onChange={(e) => setTicket(+e.target.value)}
              style={{ flex: 1, accentColor: "var(--primary)" }}
            />
            <input
              type="number"
              min={10}
              max={2000}
              value={ticket}
              onChange={(e) => setTicket(+e.target.value)}
              style={{ ...inputStyle, width: 90 }}
            />
          </div>
        </div>

        {/* Chargeback rate */}
        <div style={card()}>
          <div style={labelStyle}>Chargeback rate atual (%)</div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.05}
            value={cbRate}
            onChange={(e) => setCbRate(+e.target.value)}
            style={{ width: "100%", accentColor: cbRate > 1.5 ? "#ef4444" : cbRate > 0.9 ? "#f59e0b" : "var(--primary)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: "1.15rem", fontWeight: 700, color: cbRate > 1.5 ? "#ef4444" : cbRate > 0.9 ? "#f59e0b" : "var(--foreground)" }}>
              {fmt(cbRate)}%
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              {cbRate <= 0.5 ? "Excelente" : cbRate <= 0.65 ? "Saudavel" : cbRate <= 0.9 ? "Atencao" : cbRate <= 1.5 ? "VDMP/ECM" : "Critico"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        {/* Win rate */}
        <div style={card()}>
          <div style={labelStyle}>Win rate atual (%) — taxa de disputas ganhas</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={winRate}
              onChange={(e) => setWinRate(+e.target.value)}
              style={{ flex: 1, accentColor: "var(--primary)" }}
            />
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", minWidth: 48, textAlign: "right" }}>
              {winRate}%
            </span>
          </div>
        </div>

        {/* Custo operacional */}
        <div style={card()}>
          <div style={labelStyle}>Custo operacional por disputa (R$)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="range"
              min={50}
              max={500}
              step={10}
              value={costPerDispute}
              onChange={(e) => setCostPerDispute(+e.target.value)}
              style={{ flex: 1, accentColor: "var(--primary)" }}
            />
            <input
              type="number"
              min={50}
              max={500}
              value={costPerDispute}
              onChange={(e) => setCostPerDispute(+e.target.value)}
              style={{ ...inputStyle, width: 90 }}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  SECTION 2: CUSTO REAL BREAKDOWN                             */}
      {/* ============================================================ */}
      <div style={card({ marginBottom: 32 })}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
              Custo mensal total de chargebacks
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ef4444" }}>
              {fmtK(calc.totalImpact)}
            </div>
          </div>
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10,
            padding: "10px 16px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: 2 }}>Custo real por CB</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ef4444" }}>
              {fmt(calc.costMultiplier)}x
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>o valor da transacao</div>
          </div>
        </div>

        {/* Stacked bar */}
        <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 28, marginBottom: 16 }}>
          {calc.breakdown.map((item) => {
            const pct = calc.totalImpact > 0 ? (item.value / calc.totalImpact) * 100 : 0;
            if (pct < 0.5) return null;
            return (
              <div
                key={item.label}
                title={`${item.label}: ${fmtBRL(item.value)}`}
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: item.color,
                  opacity: 0.8,
                  minWidth: pct > 2 ? undefined : 2,
                }}
              />
            );
          })}
        </div>

        {/* Breakdown list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {calc.breakdown.map((item) => {
            const pct = calc.totalImpact > 0 ? (item.value / calc.totalImpact) * 100 : 0;
            return (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: "0.85rem", color: "var(--foreground)", flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)", fontVariantNumeric: "tabular-nums", marginRight: 8 }}>
                  {fmtBRL(item.value)}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", width: 40, textAlign: "right" }}>
                  {fmt(pct)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Insight */}
        {calc.costMultiplier > 2 && (
          <div style={{
            marginTop: 20,
            padding: "12px 16px",
            background: "rgba(239,68,68,0.08)",
            borderRadius: 10,
            borderLeft: "4px solid #ef4444",
          }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: 2 }}>
              Custo real = {fmt(calc.costMultiplier)}x o valor da transacao
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Cada R$ 1 em chargeback custa R$ {fmt(calc.costMultiplier)} quando somamos fees, operacional e multas.
              Com {fmtInt(calc.cbCount)} disputas/mes, o impacto e de {fmtK(calc.totalImpact)}/mes ({fmtK(calc.totalImpact * 12)}/ano).
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/*  SECTION 3: THRESHOLD BAR VDMP/ECM                          */}
      {/* ============================================================ */}
      <div style={card({ marginBottom: 32 })}>
        <div style={{ ...labelStyle, marginBottom: 16 }}>Barra de Threshold — Programas de Monitoramento</div>
        <ThresholdBar rate={cbRate} />

        {/* Status badges */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
          {[calc.visaStatus, calc.mcStatus].map((program) => {
            const colors = {
              ok: { bg: "rgba(16,185,129,0.1)", border: "#10b981", text: "#10b981" },
              alert: { bg: "rgba(245,158,11,0.1)", border: "#f59e0b", text: "#f59e0b" },
              penalty: { bg: "rgba(239,68,68,0.1)", border: "#ef4444", text: "#ef4444" },
            };
            const c = colors[program.status];
            return (
              <div key={program.name} style={{
                padding: "12px 16px",
                borderRadius: 10,
                background: c.bg,
                border: `1px solid ${c.border}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--foreground)" }}>
                    {program.name}
                  </span>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: c.border,
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}>
                    {program.label}
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  {program.detail}
                </div>
                {program.monthlyFine > 0 && (
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ef4444", marginTop: 6 }}>
                    Multa estimada: ${fmtInt(program.monthlyFine)}/mes (USD)
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fine schedule table */}
        {calc.fineSchedule.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Cronograma de multas estimadas
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr>
                  {["Periodo", "Programa", "Multa estimada"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 10px", borderBottom: "2px solid var(--border)", color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.75rem" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calc.fineSchedule.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "6px 10px", color: "var(--foreground)", borderBottom: "1px solid var(--border)" }}>{row.month}</td>
                    <td style={{ padding: "6px 10px", color: "var(--foreground)", borderBottom: "1px solid var(--border)" }}>{row.program}</td>
                    <td style={{ padding: "6px 10px", color: row.fine.includes("Sem") ? "var(--text-secondary)" : "#ef4444", fontWeight: row.fine.includes("Sem") ? 400 : 600, borderBottom: "1px solid var(--border)" }}>
                      {row.fine}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/*  SECTION 4: PROJECTION 12 MONTHS (SVG)                       */}
      {/* ============================================================ */}
      <div style={card({ marginBottom: 32 })}>
        <div style={{ ...labelStyle, marginBottom: 16 }}>Projecao 12 Meses — Custo Acumulado (R$)</div>
        <ProjectionChart
          currentMonthly={calc.totalImpact}
          preventedMonthly={calc.preventedTotal + calc.preventionCost}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: 2 }}>Custo 12 meses (atual)</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ef4444" }}>{fmtK(calc.totalImpact * 12)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: 2 }}>Com prevencao</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#10b981" }}>{fmtK((calc.preventedTotal + calc.preventionCost) * 12)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: 2 }}>Economia anual</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}>{fmtK(calc.monthlySavings * 12)}</div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  SECTION 5: ROI DE PREVENCAO                                 */}
      {/* ============================================================ */}
      <div style={card({ marginBottom: 32 })}>
        <div style={{ ...labelStyle, marginBottom: 16 }}>ROI de Prevencao — Ferramentas</div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.5 }}>
          Ative/desative cada ferramenta para recalcular a projecao em tempo real. O custo e a reducao sao estimados com base em medias de mercado.
        </p>

        {/* Tool toggles table */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PREVENTION_TOOLS.map((tool) => {
            const active = !!enabledTools[tool.id];
            return (
              <div
                key={tool.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: active ? "rgba(16,185,129,0.08)" : "var(--background)",
                  border: active ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onClick={() => toggleTool(tool.id)}
              >
                {/* Toggle switch */}
                <div style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  background: active ? "#10b981" : "var(--border)",
                  position: "relative",
                  flexShrink: 0,
                  transition: "background 0.15s ease",
                }}>
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: 2,
                    left: active ? 20 : 2,
                    transition: "left 0.15s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--foreground)", marginBottom: 2 }}>
                    {tool.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {tool.description}
                  </div>
                </div>

                {/* Cost */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{tool.costLabel}</div>
                  {tool.reductionMax > 0 ? (
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#10b981" }}>
                      -{tool.reductionMin}-{tool.reductionMax}% CBs
                    </div>
                  ) : tool.winRateBoost > 0 ? (
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#3b82f6" }}>
                      +{tool.winRateBoost}% win rate
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Investment vs Savings card */}
        <div style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
        }}>
          <div style={{
            padding: "16px",
            borderRadius: 10,
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.2)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Investimento mensal</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ef4444" }}>{fmtBRL(calc.preventionCost)}</div>
          </div>
          <div style={{
            padding: "16px",
            borderRadius: 10,
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Economia mensal</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#10b981" }}>{fmtBRL(Math.max(0, calc.monthlySavings))}</div>
          </div>
          <div style={{
            padding: "16px",
            borderRadius: 10,
            background: "var(--primary-bg)",
            border: "1px solid var(--primary)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>ROI positivo em</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--primary)" }}>
              {calc.preventionCost === 0
                ? "--"
                : calc.roiMonths <= 0 || !isFinite(calc.roiMonths)
                  ? "N/A"
                  : calc.roiMonths < 1
                    ? "< 1 mes"
                    : `${Math.ceil(calc.roiMonths)} ${Math.ceil(calc.roiMonths) === 1 ? "mes" : "meses"}`}
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div style={{
        padding: "12px 16px",
        background: "var(--surface)",
        borderRadius: 10,
        border: "1px solid var(--border)",
        fontSize: "0.78rem",
        color: "var(--text-secondary)",
        lineHeight: 1.5,
      }}>
        Valores de referencia baseados em medias de mercado. Multas de bandeira em USD convertidas a R$ 5,00.
        Programas de monitoramento avaliam janelas de 3-6 meses. Custos de ferramentas podem variar por fornecedor.
      </div>
    </div>
  );
}
