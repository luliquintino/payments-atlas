"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtInt(value: number): string {
  return Math.round(value).toLocaleString("pt-BR");
}

function fmtUSD(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChargebackCalculatorPage() {
  const [volume, setVolume] = useState(50000);
  const [ticketMedio, setTicketMedio] = useState(150);
  const [cbRate, setCbRate] = useState(1.0);
  const [winRate, setWinRate] = useState(30);
  const [custoPorDisputa, setCustoPorDisputa] = useState(50);

  // Calculations
  const calc = useMemo(() => {
    const chargebacksMensais = volume * (cbRate / 100);
    const perdaBruta = chargebacksMensais * ticketMedio;
    const custoOperacional = chargebacksMensais * custoPorDisputa;
    const recuperacao = perdaBruta * (winRate / 100);
    const perdaLiquida = perdaBruta + custoOperacional - recuperacao;
    const impactoAnual = perdaLiquida * 12;

    // Prevention ROI scenarios
    const cbAt05 = volume * 0.005;
    const perdaBrutaAt05 = cbAt05 * ticketMedio;
    const custoOpAt05 = cbAt05 * custoPorDisputa;
    const recuperacaoAt05 = perdaBrutaAt05 * (winRate / 100);
    const perdaLiquidaAt05 = perdaBrutaAt05 + custoOpAt05 - recuperacaoAt05;
    const economiaCbReduzido = perdaLiquida - perdaLiquidaAt05;

    const recuperacaoAt60 = perdaBruta * 0.6;
    const perdaLiquidaAt60 = perdaBruta + custoOperacional - recuperacaoAt60;
    const economiaWinRateAlto = perdaLiquida - perdaLiquidaAt60;

    // Monitoring program alerts
    let alertLevel: "safe" | "vdmp" | "critical" = "safe";
    if (cbRate > 1.5 && chargebacksMensais > 100) alertLevel = "critical";
    else if (cbRate > 0.9 && chargebacksMensais > 100) alertLevel = "vdmp";

    return {
      chargebacksMensais,
      perdaBruta,
      custoOperacional,
      recuperacao,
      perdaLiquida,
      impactoAnual,
      economiaCbReduzido,
      economiaWinRateAlto,
      alertLevel,
    };
  }, [volume, ticketMedio, cbRate, winRate, custoPorDisputa]);

  // Styles
  const cardStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 20,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--foreground)",
    marginBottom: 6,
    display: "block",
  };

  const sublabelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "var(--text-muted)",
    marginBottom: 8,
    display: "block",
  };

  const sliderStyle: React.CSSProperties = {
    width: "100%",
    accentColor: "var(--primary)",
    marginBottom: 4,
  };

  const valueDisplayStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--primary)",
    textAlign: "right" as const,
    minWidth: 90,
  };

  const metricCardStyle = (bg: string, borderColor: string): React.CSSProperties => ({
    background: bg,
    border: `1px solid ${borderColor}`,
    borderRadius: 10,
    padding: 16,
    flex: "1 1 220px",
    minWidth: 200,
  });

  return (
    <div
      style={{
        maxWidth: 1100,
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
          Calculadora de Chargeback
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)", marginBottom: 8 }}>
          Calculadora de Chargeback
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 700 }}>
          Calcule o impacto financeiro de chargebacks, identifique riscos de programas de monitoramento
          das bandeiras e projete o ROI de ferramentas de prevencao.
        </p>
      </div>

      {/* Inputs */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 20 }}>
          Parametros de Entrada
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {/* Volume */}
          <div>
            <label style={labelStyle}>Volume mensal de transacoes</label>
            <span style={sublabelStyle}>Quantidade de transacoes processadas por mes</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range"
                min={1000}
                max={1000000}
                step={1000}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={sliderStyle}
              />
              <span style={valueDisplayStyle}>{fmtInt(volume)}</span>
            </div>
          </div>

          {/* Ticket medio */}
          <div>
            <label style={labelStyle}>Ticket medio (R$)</label>
            <span style={sublabelStyle}>Valor medio por transacao</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range"
                min={50}
                max={5000}
                step={10}
                value={ticketMedio}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                style={sliderStyle}
              />
              <span style={valueDisplayStyle}>R$ {fmt(ticketMedio)}</span>
            </div>
          </div>

          {/* CB Rate */}
          <div>
            <label style={labelStyle}>Chargeback rate atual (%)</label>
            <span style={sublabelStyle}>Percentual de transacoes disputadas</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range"
                min={0.1}
                max={5.0}
                step={0.1}
                value={cbRate}
                onChange={(e) => setCbRate(Number(e.target.value))}
                style={sliderStyle}
              />
              <span style={valueDisplayStyle}>{cbRate.toFixed(1)}%</span>
            </div>
          </div>

          {/* Win Rate */}
          <div>
            <label style={labelStyle}>Win rate atual (%)</label>
            <span style={sublabelStyle}>Taxa de sucesso em representments</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range"
                min={0}
                max={80}
                step={1}
                value={winRate}
                onChange={(e) => setWinRate(Number(e.target.value))}
                style={sliderStyle}
              />
              <span style={valueDisplayStyle}>{winRate}%</span>
            </div>
          </div>

          {/* Custo por disputa */}
          <div>
            <label style={labelStyle}>Custo operacional por disputa (R$)</label>
            <span style={sublabelStyle}>Custo interno de tratar cada disputa</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range"
                min={15}
                max={200}
                step={5}
                value={custoPorDisputa}
                onChange={(e) => setCustoPorDisputa(Number(e.target.value))}
                style={sliderStyle}
              />
              <span style={valueDisplayStyle}>R$ {fmt(custoPorDisputa)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert banner */}
      {calc.alertLevel !== "safe" && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 24,
            borderColor: calc.alertLevel === "critical" ? "var(--error)" : "var(--warning)",
            background: calc.alertLevel === "critical"
              ? "rgba(239,68,68,0.08)"
              : "rgba(245,158,11,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{ fontSize: 24 }}>
              {calc.alertLevel === "critical" ? "\u{1F6A8}\u{1F6A8}" : "\u{1F6A8}"}
            </span>
            <div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: calc.alertLevel === "critical" ? "var(--error)" : "var(--warning)",
                  marginBottom: 6,
                }}
              >
                {calc.alertLevel === "critical"
                  ? "CRITICO: Dentro do ECP (Mastercard)"
                  : "ALERTA: Dentro do VDMP (Visa) e ECM (Mastercard)"}
              </h3>
              <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.6, marginBottom: 0 }}>
                {calc.alertLevel === "critical"
                  ? "Com chargeback rate acima de 1.5% e mais de 100 disputas, sua operacao esta no Excessive Chargeback Program da Mastercard. Multas podem chegar a $200K/mes alem de restricoes operacionais severas."
                  : "Com chargeback rate acima de 0.9% e mais de 100 disputas, sua operacao esta enquadrada no Visa Dispute Monitoring Program e no Excessive Chargeback Merchant da Mastercard. Acao imediata necessaria."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 20 }}>
          Impacto Financeiro
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {/* Chargebacks mensais */}
          <div style={metricCardStyle("var(--surface-hover)", "var(--border)")}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              Chargebacks mensais
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--foreground)" }}>
              {fmtInt(calc.chargebacksMensais)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              disputas/mes
            </div>
          </div>

          {/* Perda bruta */}
          <div style={metricCardStyle("rgba(239,68,68,0.06)", "rgba(239,68,68,0.2)")}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              Perda bruta mensal
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--error)" }}>
              R$ {fmt(calc.perdaBruta)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              chargebacks x ticket medio
            </div>
          </div>

          {/* Custo operacional */}
          <div style={metricCardStyle("rgba(245,158,11,0.06)", "rgba(245,158,11,0.2)")}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              Custo operacional mensal
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--warning)" }}>
              R$ {fmt(calc.custoOperacional)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              chargebacks x custo/disputa
            </div>
          </div>

          {/* Recuperacao */}
          <div style={metricCardStyle("rgba(16,185,129,0.06)", "rgba(16,185,129,0.2)")}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              Recuperacao via representment
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--success)" }}>
              R$ {fmt(calc.recuperacao)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              perda bruta x win rate
            </div>
          </div>

          {/* Perda liquida */}
          <div style={metricCardStyle("rgba(239,68,68,0.1)", "rgba(239,68,68,0.3)")}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              Perda liquida mensal
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--error)" }}>
              R$ {fmt(calc.perdaLiquida)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              bruta + operacional - recuperacao
            </div>
          </div>

          {/* Impacto anual */}
          <div
            style={{
              ...metricCardStyle("rgba(239,68,68,0.14)", "rgba(239,68,68,0.4)"),
              flex: "1 1 100%",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
              Impacto anual estimado
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "var(--error)" }}>
              R$ {fmt(calc.impactoAnual)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              perda liquida x 12 meses
            </div>
          </div>
        </div>
      </div>

      {/* Projecao de multas VDMP */}
      {calc.alertLevel !== "safe" && (
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 6 }}>
            Projecao de Multas — Programa de Monitoramento
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
            Estimativa de multas progressivas caso a taxa nao seja corrigida
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {/* Mes 1-4 */}
            <div
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--warning)", marginBottom: 8 }}>
                Meses 1-4 (VDMP Standard)
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>
                {fmtUSD(Math.round(calc.chargebacksMensais) * 50)}/mes
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                $50 por disputa acima do threshold
              </div>
            </div>

            {/* Mes 5-9 */}
            <div
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--error)", marginBottom: 8 }}>
                Meses 5-9 (Escalacao)
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>
                {fmtUSD(25000)}/mes
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Multa fixa + obrigatoriedade de plano de acao
              </div>
            </div>

            {/* Mes 10-12 */}
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--error)", marginBottom: 8 }}>
                Meses 10-12 (Critico)
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>
                {fmtUSD(75000)}/mes + review
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                $75K/mes + review fee + risco de descredenciamento
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROI de prevencao */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 6 }}>
          ROI de Prevencao
        </h2>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
          Projecao de economia com investimentos em prevencao de fraude e chargeback
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          {/* Cenario 1: Reduzir CB rate */}
          <div
            style={{
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{"\u{1F6E1}\u{FE0F}"}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>
                Se reduzir chargeback rate para 0.5%
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>
              R$ {fmt(calc.economiaCbReduzido)}/mes
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
              de economia mensal ({fmt(calc.economiaCbReduzido * 12)}/ano)
            </div>
            <div
              style={{
                background: "rgba(16,185,129,0.1)",
                borderRadius: 8,
                padding: 12,
                fontSize: 12,
                color: "var(--foreground)",
                lineHeight: 1.6,
              }}
            >
              Investir em ferramentas como Ethoca/Verifi (alerts pre-chargeback), 3DS2 dinamico
              e regras anti-fraude mais refinadas pode reduzir significativamente sua taxa.
            </div>
          </div>

          {/* Cenario 2: Aumentar win rate */}
          <div
            style={{
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{"\u{2696}\u{FE0F}"}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>
                Se aumentar win rate para 60%
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>
              R$ {fmt(calc.economiaWinRateAlto)}/mes
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
              de recuperacao extra ({fmt(calc.economiaWinRateAlto * 12)}/ano)
            </div>
            <div
              style={{
                background: "var(--primary-bg)",
                borderRadius: 8,
                padding: 12,
                fontSize: 12,
                color: "var(--foreground)",
                lineHeight: 1.6,
              }}
            >
              Automatizar representments com plataformas como Chargebacks911 ou Midigator,
              melhorar coleta de evidencias (logs, tracking, 3DS data) e treinar a equipe
              em compelling evidence 3.0.
            </div>
          </div>
        </div>
      </div>

      {/* Methodology note */}
      <div
        style={{
          ...cardStyle,
          marginBottom: 40,
          background: "var(--surface-hover)",
          borderStyle: "dashed",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
          Metodologia e Fontes
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 0 }}>
          Calculos baseados em dados publicos dos programas VDMP (Visa), ECM/ECP (Mastercard).
          Valores de multas sao estimativas e podem variar conforme regiao, adquirente e historico do merchant.
          Para valores exatos, consulte seu adquirente ou a bandeira diretamente.
          O custo operacional inclui tempo de equipe, sistemas e taxas de processamento de disputas.
        </p>
      </div>
    </div>
  );
}
