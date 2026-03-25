"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";

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
/*  Brand monitoring program thresholds                                */
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
    return { name: "Visa VDMP", status: "alert", label: "Alerta (Standard)", detail: "Rate >0.9% + >100 disputas. 4 meses para corrigir.", monthlyFine: 0 };
  }
  return { name: "Visa VDMP", status: "ok", label: "Fora do programa", detail: "Rate abaixo dos limites.", monthlyFine: 0 };
}

function getMastercardECM(rate: number, count: number): ProgramStatus {
  if (rate > 1.5 && count > 100) {
    return { name: "Mastercard ECP", status: "penalty", label: "Excessive (ECP)", detail: "Rate >1.5% + >100 disputas. Multas de $25K-$100K/mes.", monthlyFine: 75000 };
  }
  if (rate > 1.0 && count > 100) {
    return { name: "Mastercard ECM", status: "alert", label: "Alerta (ECM)", detail: "Rate >1.0% + >100 disputas. Precisa apresentar plano de acao.", monthlyFine: 0 };
  }
  return { name: "Mastercard ECM", status: "ok", label: "Fora do programa", detail: "Rate abaixo dos limites.", monthlyFine: 0 };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ChargebackCalculatorPage() {
  const { visitPage } = useGameProgress();
  useEffect(() => { visitPage("/tools/chargeback-calculator"); }, [visitPage]);

  const [txVolume, setTxVolume] = useState(50_000);
  const [ticket, setTicket] = useState(200);
  const [cbRate, setCbRate] = useState(1.2);
  const [winRate, setWinRate] = useState(35);
  const [costPerDispute, setCostPerDispute] = useState(150);

  const calc = useMemo(() => {
    const gmv = txVolume * ticket;
    const cbCount = Math.round(txVolume * (cbRate / 100));
    const cbValue = cbCount * ticket;
    const lostValue = cbValue * ((100 - winRate) / 100);
    const opCost = cbCount * costPerDispute;

    // Brand program fines
    const visaStatus = getVisaVDMP(cbRate, cbCount);
    const mcStatus = getMastercardECM(cbRate, cbCount);
    const fines = visaStatus.monthlyFine + mcStatus.monthlyFine;

    // Convert USD fines to BRL (approximate)
    const usdToBrl = 5.0;
    const finesBRL = fines * usdToBrl;

    const totalImpact = lostValue + opCost + finesBRL;

    // Prevention ROI: if we reduce to 0.5%
    const targetRate = 0.5;
    const targetCbCount = Math.round(txVolume * (targetRate / 100));
    const targetCbValue = targetCbCount * ticket;
    const targetLostValue = targetCbValue * ((100 - winRate) / 100);
    const targetOpCost = targetCbCount * costPerDispute;
    const targetVisaStatus = getVisaVDMP(targetRate, targetCbCount);
    const targetMcStatus = getMastercardECM(targetRate, targetCbCount);
    const targetFines = (targetVisaStatus.monthlyFine + targetMcStatus.monthlyFine) * usdToBrl;
    const targetTotal = targetLostValue + targetOpCost + targetFines;
    const monthlySavings = totalImpact - targetTotal;
    const roiSixMonths = monthlySavings > 0 ? ((monthlySavings * 6) / (totalImpact || 1)) * 100 : 0;

    return {
      gmv,
      cbCount,
      cbValue,
      lostValue,
      opCost,
      finesBRL,
      totalImpact,
      visaStatus,
      mcStatus,
      monthlySavings,
      roiSixMonths,
      targetRate,
      targetCbCount,
    };
  }, [txVolume, ticket, cbRate, winRate, costPerDispute]);

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

  const statusBadge = (status: "ok" | "alert" | "penalty") => {
    const map = {
      ok: { bg: "rgba(16, 185, 129, 0.12)", color: "var(--success)", icon: "\u2705" },
      alert: { bg: "rgba(245, 158, 11, 0.12)", color: "var(--warning)", icon: "\u26A0\uFE0F" },
      penalty: { bg: "rgba(239, 68, 68, 0.12)", color: "var(--error)", icon: "\uD83D\uDD34" },
    };
    return map[status];
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
        Calculadora de Chargeback
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
        Calcule o impacto financeiro de chargebacks e verifique seu status nos programas de monitoramento.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* ---- LEFT: Inputs ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Tx Volume */}
          <div style={card()}>
            <div style={labelStyle}>Volume mensal de transacoes</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
                style={{ ...inputStyle, width: 110 }}
              />
            </div>
          </div>

          {/* Ticket */}
          <div style={card()}>
            <div style={labelStyle}>Ticket medio (R$)</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
                style={{ ...inputStyle, width: 100 }}
              />
            </div>
          </div>

          {/* CB Rate */}
          <div style={card()}>
            <div style={labelStyle}>Chargeback Rate (%)</div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={cbRate}
              onChange={(e) => setCbRate(+e.target.value)}
              style={{ width: "100%", accentColor: cbRate > 1.8 ? "#ef4444" : cbRate > 0.9 ? "#f59e0b" : "var(--primary)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
              <span style={{ fontSize: "1.15rem", fontWeight: 700, color: cbRate > 1.8 ? "var(--error)" : cbRate > 0.9 ? "var(--warning)" : "var(--foreground)" }}>
                {fmt(cbRate)}%
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {cbRate <= 0.5 ? "Excelente" : cbRate <= 0.9 ? "Bom" : cbRate <= 1.5 ? "Atencao" : "Critico"}
              </span>
            </div>
            {/* Visual threshold markers */}
            <div style={{ position: "relative", height: 16, marginTop: "0.35rem" }}>
              <div style={{ position: "absolute", left: `${(0.9 / 5) * 100}%`, top: 0, fontSize: "0.65rem", color: "var(--warning)", transform: "translateX(-50%)" }}>
                0.9%
              </div>
              <div style={{ position: "absolute", left: `${(1.8 / 5) * 100}%`, top: 0, fontSize: "0.65rem", color: "var(--error)", transform: "translateX(-50%)" }}>
                1.8%
              </div>
            </div>
          </div>

          {/* Win Rate */}
          <div style={card()}>
            <div style={labelStyle}>Win Rate atual (%)</div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={winRate}
              onChange={(e) => setWinRate(+e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)" }}
            />
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "0.25rem" }}>
              {winRate}%
            </div>
          </div>

          {/* Cost per dispute */}
          <div style={card()}>
            <div style={labelStyle}>Custo operacional por disputa (R$)</div>
            <input
              type="number"
              min={50}
              max={500}
              value={costPerDispute}
              onChange={(e) => setCostPerDispute(+e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* ---- RIGHT: Output ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {([
              ["Disputas/mes", fmtInt(calc.cbCount), "var(--warning)"],
              ["Impacto Total", fmtK(calc.totalImpact), "var(--error)"],
              ["Valor em disputa", fmtK(calc.cbValue), "var(--primary)"],
              ["GMV Mensal", fmtK(calc.gmv), "var(--success)"],
            ] as [string, string, string][]).map(([title, value, color]) => (
              <div key={title} style={{ ...card(), borderLeft: `4px solid ${color}` }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.15rem" }}>
                  {title}
                </div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--foreground)" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Impact breakdown */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "0.75rem" }}>Impacto Mensal Detalhado</div>
            {([
              ["Chargebacks estimados", `${fmtInt(calc.cbCount)} disputas`],
              ["Valor em disputa", fmtK(calc.cbValue)],
              ["Perdas (considerando win rate)", fmtK(calc.lostValue)],
              ["Custo operacional", fmtK(calc.opCost)],
              ["Multas de bandeira", fmtK(calc.finesBRL)],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>{label}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
              </div>
            ))}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.6rem 0",
              marginTop: "0.25rem",
            }}>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>IMPACTO TOTAL</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--error)" }}>{fmtK(calc.totalImpact)}</span>
            </div>
          </div>

          {/* Brand monitoring status */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "0.75rem" }}>Status nos Programas de Monitoramento</div>
            {[calc.visaStatus, calc.mcStatus].map((program) => {
              const badge = statusBadge(program.status);
              return (
                <div key={program.name} style={{
                  padding: "0.75rem 1rem",
                  borderRadius: 8,
                  background: badge.bg,
                  border: `1px solid ${badge.color}`,
                  marginBottom: "0.75rem",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)" }}>
                      {badge.icon} {program.name}
                    </span>
                    <span style={{
                      padding: "0.15rem 0.5rem",
                      borderRadius: 6,
                      background: badge.color,
                      color: "#fff",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}>
                      {program.label}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {program.detail}
                  </div>
                  {program.monthlyFine > 0 && (
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--error)", marginTop: "0.3rem" }}>
                      Multa estimada: ${fmtInt(program.monthlyFine)}/mes (USD)
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Prevention ROI */}
          <div style={{ ...card(), background: "var(--primary-bg)", borderColor: "var(--primary)" }}>
            <div style={{ ...labelStyle, marginBottom: "0.75rem" }}>ROI de Prevencao</div>
            <p style={{ fontSize: "0.88rem", color: "var(--foreground)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
              Se reduzir o chargeback rate de <strong>{fmt(cbRate)}%</strong> para{" "}
              <strong>{fmt(calc.targetRate)}%</strong> ({fmtInt(calc.targetCbCount)} disputas):
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.15rem" }}>Economia mensal</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--success)" }}>{fmtK(calc.monthlySavings)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.15rem" }}>ROI em 6 meses</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--success)" }}>{fmt(calc.roiSixMonths)}%</div>
              </div>
            </div>
            {/* Bar comparing current vs target */}
            <div style={{ marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Impacto atual</span>
                <span style={{ color: "var(--error)" }}>{fmtK(calc.totalImpact)}</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "var(--border)", overflow: "hidden", marginBottom: "0.5rem" }}>
                <div style={{ height: "100%", borderRadius: 4, width: "100%", background: "var(--error)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Impacto com {fmt(calc.targetRate)}%</span>
                <span style={{ color: "var(--success)" }}>{fmtK(calc.totalImpact - calc.monthlySavings)}</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  borderRadius: 4,
                  width: calc.totalImpact > 0 ? `${((calc.totalImpact - calc.monthlySavings) / calc.totalImpact) * 100}%` : "0%",
                  background: "var(--success)",
                }} />
              </div>
            </div>
          </div>

          {/* Threshold reference */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "0.75rem" }}>Limites dos Programas</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr>
                  {["Programa", "Alerta", "Multa"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "0.4rem 0.5rem", borderBottom: "2px solid var(--border)", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.75rem" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "0.4rem 0.5rem", color: "var(--foreground)" }}>Visa VDMP</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: "var(--warning)" }}>&gt;0.9% + 100 disputas</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: "var(--error)" }}>&gt;1.8% + 100 disputas</td>
                </tr>
                <tr>
                  <td style={{ padding: "0.4rem 0.5rem", color: "var(--foreground)" }}>MC ECM</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: "var(--warning)" }}>&gt;1.0% + 100 disputas</td>
                  <td style={{ padding: "0.4rem 0.5rem", color: "var(--error)" }}>&gt;1.5% + 100 disputas</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ padding: "0.75rem 1rem", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Valores de referencia. Multas de bandeira em USD convertidas a R$ 5,00.
            Programas de monitoramento avaliam janelas de 3-6 meses.
          </div>
        </div>
      </div>
    </div>
  );
}
