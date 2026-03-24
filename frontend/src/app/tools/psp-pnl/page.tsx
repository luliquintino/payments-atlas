"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtBRL(v: number) {
  return `R$ ${fmt(v)}`;
}
function fmtPct(v: number) {
  return `${fmt(v)}%`;
}

/* ------------------------------------------------------------------ */
/*  Average interchange/scheme rates for each payment type             */
/* ------------------------------------------------------------------ */
const INTERCHANGE: Record<string, number> = {
  credito: 1.65,
  debito: 0.5,
  pix: 0,
  boleto: 0,
};
const SCHEME_FEE: Record<string, number> = {
  credito: 0.1,
  debito: 0.08,
  pix: 0,
  boleto: 0,
};

export default function PspPnlPage() {
  const [gmv, setGmv] = useState(50_000_000);
  const [takeRate, setTakeRate] = useState(2.5);
  const [mixCredito, setMixCredito] = useState(50);
  const [mixDebito, setMixDebito] = useState(25);
  const [mixPix, setMixPix] = useState(20);
  const [mixBoleto, setMixBoleto] = useState(5);
  const [custoProcTx, setCustoProcTx] = useState(0.25);
  const [chargebackRate, setChargebackRate] = useState(0.5);
  const [custoCb, setCustoCb] = useState(45);
  const [headcount, setHeadcount] = useState(50);
  const [custoFunc, setCustoFunc] = useState(15000);
  const [ticketMedio, setTicketMedio] = useState(120);

  const mixTotal = mixCredito + mixDebito + mixPix + mixBoleto || 1;

  const pnl = useMemo(() => {
    const nCredito = mixCredito / mixTotal;
    const nDebito = mixDebito / mixTotal;
    const nPix = mixPix / mixTotal;
    const nBoleto = mixBoleto / mixTotal;

    const receitaBruta = gmv * (takeRate / 100);

    // Weighted interchange & scheme fee
    const wInterchange =
      nCredito * INTERCHANGE.credito +
      nDebito * INTERCHANGE.debito +
      nPix * INTERCHANGE.pix +
      nBoleto * INTERCHANGE.boleto;
    const wScheme =
      nCredito * SCHEME_FEE.credito +
      nDebito * SCHEME_FEE.debito +
      nPix * SCHEME_FEE.pix +
      nBoleto * SCHEME_FEE.boleto;

    const custoInterchange = gmv * (wInterchange / 100);
    const custoScheme = gmv * (wScheme / 100);
    const receitaLiquida = receitaBruta - custoInterchange - custoScheme;

    const txCount = gmv / (ticketMedio || 1);
    const custoProcessamento = txCount * custoProcTx;

    const cbCount = txCount * (chargebackRate / 100);
    const custoChargebacks = cbCount * custoCb;

    // Infrastructure estimate: ~R$0.02/tx base + 5% of gross revenue
    const custoInfra = txCount * 0.02 + receitaBruta * 0.05;

    const custoPessoal = headcount * custoFunc;
    const custoTotal = custoProcessamento + custoChargebacks + custoInfra + custoPessoal;

    const margemBruta = receitaLiquida - custoTotal;
    const margemPct = receitaLiquida > 0 ? (margemBruta / receitaLiquida) * 100 : 0;

    // Break-even GMV: solve for GMV where margin = 0
    const variableCostRate = (wInterchange + wScheme) / 100 + custoProcTx / (ticketMedio || 1) + (chargebackRate / 100) * (custoCb / (ticketMedio || 1)) + 0.02 / (ticketMedio || 1) + 0.05 * (takeRate / 100);
    const fixedCosts = custoPessoal;
    const netTakeRate = takeRate / 100 - variableCostRate;
    const breakEvenGmv = netTakeRate > 0 ? fixedCosts / netTakeRate : Infinity;

    return {
      receitaBruta,
      custoInterchange,
      custoScheme,
      receitaLiquida,
      custoProcessamento,
      custoChargebacks,
      custoInfra,
      custoPessoal,
      custoTotal,
      margemBruta,
      margemPct,
      breakEvenGmv,
      txCount,
    };
  }, [gmv, takeRate, mixCredito, mixDebito, mixPix, mixBoleto, mixTotal, custoProcTx, chargebackRate, custoCb, headcount, custoFunc, ticketMedio]);

  const cardStyle: React.CSSProperties = {
    background: "var(--surface)",
    borderRadius: 14,
    padding: "1.5rem",
    border: "1px solid var(--border)",
  };
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
    fontSize: "0.95rem",
  };

  const isNegative = pnl.margemBruta < 0;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>
          ← Ferramentas
        </Link>
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
        Simulador de P&L de PSP
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
        Projete receitas, custos e margem de um Payment Service Provider.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "1.5rem" }}>
        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* GMV */}
          <div style={cardStyle}>
            <div style={labelStyle}>GMV Mensal (R$)</div>
            <input type="range" min={1_000_000} max={1_000_000_000} step={1_000_000} value={gmv} onChange={(e) => setGmv(+e.target.value)} style={{ width: "100%", accentColor: "var(--primary)" }} />
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "0.25rem" }}>{fmtBRL(gmv)}</div>
          </div>

          {/* Take rate */}
          <div style={cardStyle}>
            <div style={labelStyle}>Take Rate (%)</div>
            <input type="range" min={0.5} max={5} step={0.1} value={takeRate} onChange={(e) => setTakeRate(+e.target.value)} style={{ width: "100%", accentColor: "var(--primary)" }} />
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "0.25rem" }}>{fmtPct(takeRate)}</div>
          </div>

          {/* Mix */}
          <div style={cardStyle}>
            <div style={labelStyle}>Mix de pagamento (%)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.4rem" }}>
              {([
                ["Credito", mixCredito, setMixCredito],
                ["Debito", mixDebito, setMixDebito],
                ["Pix", mixPix, setMixPix],
                ["Boleto", mixBoleto, setMixBoleto],
              ] as [string, number, (v: number) => void][]).map(([n, v, s]) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 60, fontSize: "0.8rem", color: "var(--foreground)" }}>{n}</span>
                  <input type="range" min={0} max={100} value={v} onChange={(e) => s(+e.target.value)} style={{ flex: 1, accentColor: "var(--primary)" }} />
                  <span style={{ width: 32, textAlign: "right", fontSize: "0.8rem", color: "var(--text-muted)" }}>{Math.round((v / mixTotal) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket medio */}
          <div style={cardStyle}>
            <div style={labelStyle}>Ticket medio (R$)</div>
            <input type="number" min={10} max={5000} value={ticketMedio} onChange={(e) => setTicketMedio(+e.target.value)} style={inputStyle} />
          </div>

          {/* Custo proc */}
          <div style={cardStyle}>
            <div style={labelStyle}>Custo processamento / tx (R$)</div>
            <input type="range" min={0.1} max={1} step={0.01} value={custoProcTx} onChange={(e) => setCustoProcTx(+e.target.value)} style={{ width: "100%", accentColor: "var(--primary)" }} />
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)", marginTop: "0.2rem" }}>{fmtBRL(custoProcTx)}</div>
          </div>

          {/* Chargeback */}
          <div style={cardStyle}>
            <div style={labelStyle}>Chargeback rate / custo</div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Rate (%)</div>
                <input type="number" min={0} max={3} step={0.1} value={chargebackRate} onChange={(e) => setChargebackRate(+e.target.value)} style={{ ...inputStyle, fontSize: "0.85rem" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Custo/CB (R$)</div>
                <input type="number" min={15} max={100} value={custoCb} onChange={(e) => setCustoCb(+e.target.value)} style={{ ...inputStyle, fontSize: "0.85rem" }} />
              </div>
            </div>
          </div>

          {/* Headcount */}
          <div style={cardStyle}>
            <div style={labelStyle}>Pessoal</div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Headcount</div>
                <input type="number" min={5} max={500} value={headcount} onChange={(e) => setHeadcount(+e.target.value)} style={{ ...inputStyle, fontSize: "0.85rem" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Custo/func (R$)</div>
                <input type="number" min={5000} max={50000} step={1000} value={custoFunc} onChange={(e) => setCustoFunc(+e.target.value)} style={{ ...inputStyle, fontSize: "0.85rem" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Output */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Alert */}
          {isNegative && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid var(--error)",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9rem",
                color: "var(--error)",
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>⚠️</span> Margem negativa! Revise take rate ou custos.
            </div>
          )}

          {/* P&L statement */}
          <div style={{ ...cardStyle, fontFamily: "monospace" }}>
            <div style={{ ...labelStyle, fontFamily: "inherit", marginBottom: "1rem" }}>Demonstrativo P&L Mensal</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem", fontSize: "0.88rem" }}>
              <Row label="RECEITA" bold section />
              <Row label="Receita Bruta (GMV x take rate)" value={pnl.receitaBruta} />
              <Row label="(-) Interchange" value={-pnl.custoInterchange} negative />
              <Row label="(-) Scheme Fees" value={-pnl.custoScheme} negative />
              <Row label="= Receita Liquida" value={pnl.receitaLiquida} bold line />

              <Row label="" spacer />
              <Row label="CUSTOS" bold section />
              <Row label="Processamento" value={pnl.custoProcessamento} />
              <Row label="Chargebacks" value={pnl.custoChargebacks} />
              <Row label="Infraestrutura (est.)" value={pnl.custoInfra} />
              <Row label={`Pessoal (${headcount} func.)`} value={pnl.custoPessoal} />
              <Row label="= Custo Total" value={pnl.custoTotal} bold line />

              <Row label="" spacer />
              <Row label="RESULTADO" bold section />
              <Row label="Margem Bruta" value={pnl.margemBruta} bold highlight={isNegative ? "var(--error)" : "var(--success)"} pct={pnl.margemPct} />
              <Row label="Break-even GMV" valueStr={pnl.breakEvenGmv === Infinity ? "N/A" : fmtBRL(pnl.breakEvenGmv)} />
            </div>
          </div>

          {/* Visual bar chart */}
          <div style={cardStyle}>
            <div style={{ ...labelStyle, marginBottom: "1rem" }}>Receita vs Custos</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "2rem", height: 200 }}>
              {(() => {
                const maxVal = Math.max(pnl.receitaLiquida, pnl.custoTotal, 1);
                return (
                  <>
                    <BarCol label="Receita Liq." value={pnl.receitaLiquida} max={maxVal} color="var(--success)" />
                    <BarCol label="Processamento" value={pnl.custoProcessamento} max={maxVal} color="#6366f1" />
                    <BarCol label="Chargebacks" value={pnl.custoChargebacks} max={maxVal} color="#f59e0b" />
                    <BarCol label="Infra" value={pnl.custoInfra} max={maxVal} color="#06b6d4" />
                    <BarCol label="Pessoal" value={pnl.custoPessoal} max={maxVal} color="#8b5cf6" />
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */
function Row({
  label,
  value,
  valueStr,
  bold,
  section,
  line,
  negative,
  spacer,
  highlight,
  pct,
}: {
  label: string;
  value?: number;
  valueStr?: string;
  bold?: boolean;
  section?: boolean;
  line?: boolean;
  negative?: boolean;
  spacer?: boolean;
  highlight?: string;
  pct?: number;
}) {
  if (spacer) return <div style={{ height: 8 }} />;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.3rem 0",
        borderTop: line ? "2px solid var(--border)" : section ? "none" : undefined,
        color: highlight ?? (section ? "var(--text-muted)" : "var(--foreground)"),
        fontWeight: bold ? 700 : 400,
        fontSize: section ? "0.75rem" : "0.88rem",
      }}
    >
      <span>{label}</span>
      {(value !== undefined || valueStr) && (
        <span style={{ color: highlight ?? (negative ? "var(--error)" : "var(--foreground)") }}>
          {valueStr ?? fmtBRL(value!)}
          {pct !== undefined && <span style={{ fontSize: "0.8rem", marginLeft: "0.5rem" }}>({fmt(pct)}%)</span>}
        </span>
      )}
    </div>
  );
}

function BarCol({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const height = max > 0 ? Math.max((value / max) * 160, 4) : 4;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: "0.4rem" }}>
      <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap" }}>
        {fmtBRL(value)}
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: 36, height, background: color, borderRadius: "6px 6px 0 0", transition: "height 0.3s" }} />
      </div>
      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.2 }}>{label}</div>
    </div>
  );
}
