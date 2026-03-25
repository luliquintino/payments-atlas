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
  if (v >= 1_000_000_000) return `R$ ${fmt(v / 1_000_000_000)} B`;
  if (v >= 1_000_000) return `R$ ${fmt(v / 1_000_000)} M`;
  if (v >= 1_000) return `R$ ${fmt(v / 1_000)} K`;
  return fmtBRL(v);
}

/* ------------------------------------------------------------------ */
/*  Average interchange/scheme rates for each payment type             */
/* ------------------------------------------------------------------ */
const INTERCHANGE: Record<string, number> = {
  cartao: 1.65,
  pix: 0,
  boleto: 0,
};
const SCHEME_FEE: Record<string, number> = {
  cartao: 0.10,
  pix: 0,
  boleto: 0,
};
const PROCESSING_BASE: Record<string, number> = {
  cartao: 0.12,
  pix: 0.02,
  boleto: 0.05,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function PSPPnlPage() {
  const { visitPage } = useGameProgress();
  useEffect(() => { visitPage("/tools/psp-pnl"); }, [visitPage]);

  const [gmv, setGmv] = useState(50_000_000);
  const [takeRate, setTakeRate] = useState(2.5);
  const [cartao, setCartao] = useState(60);
  const [pixPct, setPixPct] = useState(30);
  const [boleto, setBoleto] = useState(10);
  const [processingCost, setProcessingCost] = useState(0.10);
  const [chargebackRate, setChargebackRate] = useState(0.8);
  const [headcount, setHeadcount] = useState(30);
  const [avgSalary, setAvgSalary] = useState(15_000);
  const [infra, setInfra] = useState(50_000);
  const [anticipationPct, setAnticipationPct] = useState(30);
  const [anticipationSpread, setAnticipationSpread] = useState(1.5);
  const [selicRate] = useState(13.25);

  const mixTotal = cartao + pixPct + boleto || 1;
  const cartaoPct = cartao / mixTotal;
  const pixFrac = pixPct / mixTotal;
  const boletoPct = boleto / mixTotal;

  const pnl = useMemo(() => {
    // Revenue
    const takeRateRevenue = gmv * (takeRate / 100);
    const pixGmv = gmv * pixFrac;
    const floatDays = 1; // D+1 settlement, earn float on D+0
    const floatIncome = (pixGmv * (selicRate / 100) * floatDays) / 365;
    const cardGmv = gmv * cartaoPct;
    const anticipationRevenue = cardGmv * (anticipationPct / 100) * (anticipationSpread / 100);
    const totalRevenue = takeRateRevenue + floatIncome + anticipationRevenue;

    // Costs
    const totalProcessingCost = gmv * (processingCost / 100);
    const interchangeFees =
      gmv * cartaoPct * ((INTERCHANGE.cartao + SCHEME_FEE.cartao) / 100) +
      gmv * pixFrac * ((INTERCHANGE.pix + SCHEME_FEE.pix) / 100) +
      gmv * boletoPct * ((INTERCHANGE.boleto + SCHEME_FEE.boleto) / 100);
    const chargebackLosses = gmv * cartaoPct * (chargebackRate / 100);
    const peopleCost = headcount * avgSalary;
    const infraCost = infra;
    const totalCosts = totalProcessingCost + interchangeFees + chargebackLosses + peopleCost + infraCost;

    // P&L
    const ebitda = totalRevenue - totalCosts;
    const ebitdaMargin = totalRevenue > 0 ? (ebitda / totalRevenue) * 100 : 0;

    // Break-even GMV: solve for GMV where revenue = costs
    // Revenue = GMV * takeRate/100 + pixFloat + anticipation (roughly proportional to GMV)
    // Costs = GMV * processing + GMV * interchange + GMV * chargeback + fixed
    const fixedCosts = peopleCost + infraCost;
    const variableRevenueRate = takeRate / 100 + (pixFrac * selicRate / 100 / 365) + (cartaoPct * anticipationPct / 100 * anticipationSpread / 100);
    const variableCostRate = processingCost / 100 + cartaoPct * (INTERCHANGE.cartao + SCHEME_FEE.cartao) / 100 + cartaoPct * chargebackRate / 100;
    const netVariableRate = variableRevenueRate - variableCostRate;
    const breakEvenGMV = netVariableRate > 0 ? fixedCosts / netVariableRate : 0;

    return {
      takeRateRevenue,
      floatIncome,
      anticipationRevenue,
      totalRevenue,
      totalProcessingCost,
      interchangeFees,
      chargebackLosses,
      peopleCost,
      infraCost,
      totalCosts,
      ebitda,
      ebitdaMargin,
      breakEvenGMV,
    };
  }, [gmv, takeRate, cartaoPct, pixFrac, boletoPct, processingCost, chargebackRate, headcount, avgSalary, infra, anticipationPct, anticipationSpread, selicRate]);

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

  const SliderInput = ({
    label, min, max, step, value, onChange, suffix, displayValue,
  }: {
    label: string; min: number; max: number; step: number; value: number;
    onChange: (v: number) => void; suffix?: string; displayValue?: string;
  }) => (
    <div style={card()}>
      <div style={labelStyle}>{label}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ width: "100%", accentColor: "var(--primary)" }}
      />
      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "0.25rem" }}>
        {displayValue ?? `${fmt(value)}${suffix ?? ""}`}
      </div>
    </div>
  );

  const PnlRow = ({
    label, value, bold, color, indent,
  }: {
    label: string; value: number; bold?: boolean; color?: string; indent?: boolean;
  }) => (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.4rem 0",
      paddingLeft: indent ? "1.25rem" : 0,
      borderTop: bold ? "2px solid var(--border)" : undefined,
    }}>
      <span style={{
        fontSize: bold ? "0.95rem" : "0.85rem",
        fontWeight: bold ? 700 : 400,
        color: color ?? "var(--foreground)",
      }}>
        {label}
      </span>
      <span style={{
        fontSize: bold ? "1rem" : "0.9rem",
        fontWeight: bold ? 700 : 500,
        color: color ?? (value < 0 ? "var(--error)" : "var(--foreground)"),
        fontVariantNumeric: "tabular-nums",
      }}>
        {fmtK(value)}
      </span>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>
          &larr; Ferramentas
        </Link>
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
        Simulador P&L de PSP
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
        Monte o P&L de um PSP/sub-adquirente e encontre o break-even do seu GMV.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* ---- LEFT: Inputs ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <SliderInput label="GMV Mensal" min={1_000_000} max={1_000_000_000} step={1_000_000} value={gmv} onChange={setGmv} displayValue={fmtK(gmv)} />
          <SliderInput label="Take Rate (%)" min={0.5} max={5.0} step={0.1} value={takeRate} onChange={setTakeRate} suffix="%" />

          {/* Mix de meios */}
          <div style={card()}>
            <div style={labelStyle}>Mix de meios de pagamento (%)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
              {([
                ["Cartao", cartao, setCartao, "#6366f1"],
                ["Pix", pixPct, setPixPct, "#10b981"],
                ["Boleto", boleto, setBoleto, "#f59e0b"],
              ] as [string, number, (v: number) => void, string][]).map(([name, val, setter, color]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ width: 60, fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 500 }}>
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
                    {Math.round((val / mixTotal) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <SliderInput label="Custo de processamento (% do GMV)" min={0.01} max={0.5} step={0.01} value={processingCost} onChange={setProcessingCost} suffix="%" />
          <SliderInput label="Chargeback Rate (%)" min={0} max={3} step={0.1} value={chargebackRate} onChange={setChargebackRate} suffix="%" />

          {/* Headcount */}
          <div style={card()}>
            <div style={labelStyle}>Headcount</div>
            <input type="number" min={1} max={1000} value={headcount} onChange={(e) => setHeadcount(+e.target.value)} style={inputStyle} />
          </div>

          <div style={card()}>
            <div style={labelStyle}>Custo medio por funcionario (R$/mes)</div>
            <input type="number" min={5000} max={50000} step={1000} value={avgSalary} onChange={(e) => setAvgSalary(+e.target.value)} style={inputStyle} />
          </div>

          <div style={card()}>
            <div style={labelStyle}>Infraestrutura mensal (R$)</div>
            <input type="number" min={10000} max={1000000} step={5000} value={infra} onChange={(e) => setInfra(+e.target.value)} style={inputStyle} />
          </div>

          <SliderInput label="% do GMV antecipado" min={0} max={100} step={5} value={anticipationPct} onChange={setAnticipationPct} suffix="%" />
          <SliderInput label="Spread de antecipacao (%)" min={0.5} max={5} step={0.1} value={anticipationSpread} onChange={setAnticipationSpread} suffix="%" />
        </div>

        {/* ---- RIGHT: P&L Output ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            {([
              ["EBITDA", fmtK(pnl.ebitda), pnl.ebitda >= 0 ? "var(--success)" : "var(--error)"],
              ["Margem", `${fmt(pnl.ebitdaMargin)}%`, pnl.ebitdaMargin >= 0 ? "var(--success)" : "var(--error)"],
              ["Break-even", fmtK(pnl.breakEvenGMV), "var(--primary)"],
            ] as [string, string, string][]).map(([title, value, color]) => (
              <div key={title} style={{ ...card(), borderLeft: `4px solid ${color}` }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.15rem" }}>
                  {title}
                </div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--foreground)" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* P&L Statement */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "0.75rem" }}>Demonstrativo P&L Mensal</div>

            {/* Revenue */}
            <div style={{
              padding: "0.5rem 0.75rem",
              background: "rgba(16, 185, 129, 0.08)",
              borderRadius: 8,
              marginBottom: "0.5rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--success)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}>
              Receita
            </div>
            <PnlRow label="Take Rate Revenue" value={pnl.takeRateRevenue} indent />
            <PnlRow label="Float Income (Pix)" value={pnl.floatIncome} indent />
            <PnlRow label="Antecipacao Revenue" value={pnl.anticipationRevenue} indent />
            <PnlRow label="Total Receita" value={pnl.totalRevenue} bold color="var(--success)" />

            <div style={{ height: "1rem" }} />

            {/* Costs */}
            <div style={{
              padding: "0.5rem 0.75rem",
              background: "rgba(239, 68, 68, 0.08)",
              borderRadius: 8,
              marginBottom: "0.5rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--error)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}>
              Custos
            </div>
            <PnlRow label="Processing Cost" value={-pnl.totalProcessingCost} indent />
            <PnlRow label="Interchange + Fees" value={-pnl.interchangeFees} indent />
            <PnlRow label="Chargeback Losses" value={-pnl.chargebackLosses} indent />
            <PnlRow label="People (Headcount)" value={-pnl.peopleCost} indent />
            <PnlRow label="Infrastructure" value={-pnl.infraCost} indent />
            <PnlRow label="Total Custos" value={-pnl.totalCosts} bold color="var(--error)" />

            <div style={{ height: "1rem" }} />

            {/* EBITDA */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              background: pnl.ebitda >= 0 ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
              border: `1px solid ${pnl.ebitda >= 0 ? "var(--success)" : "var(--error)"}`,
            }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)" }}>EBITDA</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: "1.15rem", color: pnl.ebitda >= 0 ? "var(--success)" : "var(--error)" }}>
                  {fmtK(pnl.ebitda)}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {fmt(pnl.ebitdaMargin)}% margem
                </div>
              </div>
            </div>
          </div>

          {/* Break-even indicator */}
          <div style={{ ...card(), background: "var(--primary-bg)", borderColor: "var(--primary)" }}>
            <div style={{ ...labelStyle, marginBottom: "0.5rem" }}>Break-even Analysis</div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.15rem" }}>GMV necessario</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>{fmtK(pnl.breakEvenGMV)}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.15rem" }}>GMV atual</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>{fmtK(gmv)}</div>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 8, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                borderRadius: 4,
                width: `${Math.min((gmv / (pnl.breakEvenGMV || 1)) * 100, 100)}%`,
                background: gmv >= pnl.breakEvenGMV ? "var(--success)" : "var(--warning)",
                transition: "width 0.3s ease",
              }} />
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
              {gmv >= pnl.breakEvenGMV
                ? `Acima do break-even em ${fmt(((gmv / (pnl.breakEvenGMV || 1)) - 1) * 100)}%`
                : `Faltam ${fmtK(pnl.breakEvenGMV - gmv)} para o break-even`}
            </div>
          </div>

          {/* Revenue composition */}
          <div style={card()}>
            <div style={{ ...labelStyle, marginBottom: "0.75rem" }}>Composicao da receita</div>
            {([
              ["Take Rate", pnl.takeRateRevenue, "#6366f1"],
              ["Float Income", pnl.floatIncome, "#10b981"],
              ["Antecipacao", pnl.anticipationRevenue, "#f59e0b"],
            ] as [string, number, string][]).map(([name, value, color]) => {
              const pct = pnl.totalRevenue > 0 ? (value / pnl.totalRevenue) * 100 : 0;
              return (
                <div key={name} style={{ marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.2rem" }}>
                    <span style={{ color: "var(--foreground)" }}>{name}</span>
                    <span style={{ color: "var(--text-muted)" }}>{fmt(pct)}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--border)" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: color, transition: "width 0.3s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: "0.75rem 1rem", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Simulacao simplificada. Float income calculado com Selic a {fmt(selicRate)}%.
            Nao inclui impostos, depreciacoes ou custos regulatorios.
          </div>
        </div>
      </div>
    </div>
  );
}
