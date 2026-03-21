"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Conta Comigo — Ferramenta de Diagnóstico
 *
 * Formulário de diagnóstico em formato wizard (4 etapas) onde os usuários
 * inserem os parâmetros do sistema de pagamento para receber um diagnóstico
 * automatizado com recomendações práticas.
 */

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface DiagnosisForm {
  country: string;
  monthlyVolume: number;
  avgTicketSize: number;
  paymentMethods: string[];
  psp: string;
  acquirerCount: number;
  tokenizationEnabled: boolean;
  threeDSEnabled: boolean;
  approvalRate: number;
  fraudRate: number;
  chargebackRate: number;
  topDeclineReasons: string[];
}

interface DiagnosisProblem {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  impact: string;
  solutions: { label: string; href: string }[];
}

/* -------------------------------------------------------------------------- */
/*                              Static Options                                */
/* -------------------------------------------------------------------------- */

const COUNTRIES = [
  "Brasil", "Estados Unidos", "Reino Unido", "Alemanha", "México",
  "Argentina", "Colômbia", "Índia", "Japão", "Austrália",
];

const PAYMENT_METHODS = [
  { id: "cards", label: "Cartões", icon: "💳" },
  { id: "pix", label: "PIX", icon: "⚡" },
  { id: "bank_transfer", label: "Transferência", icon: "🏦" },
  { id: "wallet", label: "Carteira Digital", icon: "📱" },
  { id: "bnpl", label: "BNPL", icon: "📅" },
];

const PSPS = ["Stripe", "Adyen", "Braintree", "PayPal", "Personalizado"];

const DECLINE_REASONS = [
  "Saldo Insuficiente", "Não Autorizado", "Suspeita de Fraude",
  "Cartão Expirado", "Número do Cartão Inválido", "Cartão Restrito",
  "Cartão Perdido/Roubado", "Excede Limite de Saque",
  "Transação Não Permitida", "Violação de Segurança",
];

/* -------------------------------------------------------------------------- */
/*                         Mock Diagnosis Results                             */
/* -------------------------------------------------------------------------- */

const MOCK_DIAGNOSIS: DiagnosisProblem[] = [
  {
    id: "p1",
    title: "Alta Taxa de Recusa em Transações Cross-Border",
    severity: "critical",
    description:
      "Sua taxa de aprovação está significativamente abaixo do benchmark do setor de 92% para sua região. Roteamento cross-border e falhas de comunicação com o emissor são fatores prováveis.",
    impact:
      "Perda estimada de receita de 8-12% em transações recusadas que poderiam ser recuperadas com roteamento otimizado e lógica de retentativa.",
    solutions: [
      { label: "Smart Routing", href: "/knowledge/features/smart-routing" },
      { label: "Lógica de Retentativa", href: "/knowledge/features/retry-logic" },
      { label: "Tokenização de Rede", href: "/knowledge/features/network-tokenization" },
    ],
  },
  {
    id: "p2",
    title: "Taxa de Falso Positivo de Fraude Muito Alta",
    severity: "high",
    description:
      "Sua triagem de fraude está excessivamente agressiva, bloqueando transações legítimas. A taxa de falso positivo é estimada em 3-4x a média do setor.",
    impact:
      "Aproximadamente 2-3% das transações legítimas estão sendo incorretamente marcadas, resultando em atrito com o cliente e perda de receita.",
    solutions: [
      { label: "Scoring de Fraude com ML", href: "/knowledge/features/fraud-scoring" },
      { label: "Autenticação Baseada em Risco", href: "/knowledge/features/3d-secure" },
      { label: "Device Fingerprinting", href: "/knowledge/features/velocity-checks" },
    ],
  },
  {
    id: "p3",
    title: "Camada de Tokenização Ausente",
    severity: "high",
    description:
      "Sem tokenização, você está exposto a taxas de recusa mais altas em transações recorrentes. Tokens de rede melhoram a taxa de aprovação em 2-5% em média.",
    impact:
      "Transações com cartão armazenado estão falhando em uma taxa mais alta devido a números de cartão expirados ou substituídos.",
    solutions: [
      { label: "Tokenização de Rede", href: "/knowledge/features/network-tokenization" },
      { label: "Atualizador de Conta", href: "/knowledge/features/account-updater" },
    ],
  },
  {
    id: "p4",
    title: "Risco de Dependência de Adquirente Único",
    severity: "medium",
    description:
      "Rotear todas as transações por um único adquirente cria um ponto único de falha. Se seu adquirente sofrer inatividade, 100% das suas transações falharão.",
    impact:
      "Durante quedas do adquirente (média de 2-4 horas/trimestre), você perderia toda a capacidade de processamento.",
    solutions: [
      { label: "Configuração Multi-Adquirente", href: "/knowledge/features/cascading" },
      { label: "Roteamento de Failover", href: "/knowledge/features/smart-routing" },
    ],
  },
  {
    id: "p5",
    title: "Abandono na Autenticação 3DS",
    severity: "medium",
    description:
      "A autenticação 3DS está ativa, mas sua taxa de conclusão de checkout sugere abandono significativo durante o fluxo de desafio.",
    impact:
      "Estima-se que 5-8% dos clientes abandonam o checkout durante a etapa de desafio 3DS, particularmente em dispositivos móveis.",
    solutions: [
      { label: "Upgrade 3DS2", href: "/knowledge/features/emv-3ds" },
      { label: "Autenticação Frictionless", href: "/knowledge/features/3d-secure" },
      { label: "Motor de Isenções", href: "/knowledge/features/emv-3ds" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                              Severity Meta                                 */
/* -------------------------------------------------------------------------- */

const SEVERITY_META: Record<
  DiagnosisProblem["severity"],
  { color: string; bg: string; border: string; label: string; icon: string }
> = {
  critical: { color: "#dc2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.3)", label: "Crítico", icon: "🔴" },
  high: { color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.3)", label: "Alto", icon: "🟠" },
  medium: { color: "#2563eb", bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.3)", label: "Médio", icon: "🔵" },
  low: { color: "#16a34a", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.3)", label: "Baixo", icon: "🟢" },
};

/* -------------------------------------------------------------------------- */
/*                             Step definitions                               */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { id: 1, title: "Perfil", icon: "🌍", desc: "País, volume e ticket" },
  { id: 2, title: "Setup", icon: "⚙️", desc: "PSP, adquirentes, features" },
  { id: 3, title: "Métricas", icon: "📊", desc: "Taxas e performance" },
  { id: 4, title: "Recusas", icon: "❌", desc: "Motivos de decline" },
];

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export default function ContaComigoPage() {
  const [form, setForm] = useState<DiagnosisForm>({
    country: "Brasil",
    monthlyVolume: 50000,
    avgTicketSize: 120,
    paymentMethods: ["cards"],
    psp: "Stripe",
    acquirerCount: 1,
    tokenizationEnabled: false,
    threeDSEnabled: true,
    approvalRate: 78,
    fraudRate: 1.2,
    chargebackRate: 0.6,
    topDeclineReasons: ["Não Autorizado", "Saldo Insuficiente"],
  });

  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const toggleArrayField = (
    field: "paymentMethods" | "topDeclineReasons",
    value: string,
  ) => {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const runDiagnosis = () => {
    setIsRunning(true);
    setShowResults(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 1500);
  };

  const canAdvance = step < 4;
  const canGoBack = step > 1;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--foreground)",
    fontSize: 14,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
  };

  const helpStyle: React.CSSProperties = {
    fontSize: 11,
    color: "var(--text-muted)",
    marginBottom: 8,
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      {/* ================================================================== */}
      {/*  PAGE HEADER                                                       */}
      {/* ================================================================== */}
      <div className="page-header animate-fade-in" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            🩺
          </div>
          <div>
            <h1 className="page-title">Conta Comigo</h1>
          </div>
        </div>
        <p className="page-description" style={{ marginTop: 4 }}>
          Insira os parâmetros do seu sistema de pagamento em 4 etapas simples e
          receba um diagnóstico automatizado com recomendações práticas.
        </p>
      </div>

      {/* ================================================================== */}
      {/*  STEP PROGRESS                                                     */}
      {/* ================================================================== */}
      {!showResults && (
        <div className="animate-fade-in stagger-1" style={{ marginBottom: 24 }}>
          {/* Step indicators */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {STEPS.map((s) => {
              const isActive = s.id === step;
              const isDone = s.id < step;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  style={{
                    flex: 1,
                    padding: "12px 10px",
                    borderRadius: 10,
                    border: `1.5px solid ${isActive ? "var(--primary-light)" : isDone ? "var(--success)" : "var(--border)"}`,
                    background: isActive ? "rgba(37,99,235,0.06)" : isDone ? "rgba(22,163,74,0.04)" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: isActive
                          ? "var(--primary-light)"
                          : isDone
                            ? "var(--success)"
                            : "var(--surface-hover)",
                        color: isActive || isDone ? "white" : "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isDone ? 12 : 14,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {isDone ? "✓" : s.icon}
                    </span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? "var(--primary-light)" : isDone ? "var(--success)" : "var(--foreground)" }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                        {s.desc}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: 4,
              borderRadius: 9999,
              background: "var(--surface-hover)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(step / 4) * 100}%`,
                height: "100%",
                borderRadius: 9999,
                background: "linear-gradient(90deg, var(--primary), var(--primary-light))",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/*  STEP CONTENT                                                      */}
      {/* ================================================================== */}
      {!showResults && (
        <div
          className="card-glow animate-fade-in"
          style={{ padding: "24px 28px", marginBottom: 24 }}
        >
          {/* STEP 1: Perfil */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span>🌍</span> Perfil do Negócio
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={labelStyle}>País</label>
                  <p style={helpStyle}>Mercado principal de transações.</p>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    style={inputStyle}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Volume Mensal</label>
                  <p style={helpStyle}>Transações por mês.</p>
                  <input
                    type="number"
                    min={0}
                    value={form.monthlyVolume}
                    onChange={(e) => setForm({ ...form, monthlyVolume: Number(e.target.value) })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Ticket Médio (USD)</label>
                  <p style={helpStyle}>Valor médio por transação.</p>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}>$</span>
                    <input
                      type="number"
                      min={0}
                      value={form.avgTicketSize}
                      onChange={(e) => setForm({ ...form, avgTicketSize: Number(e.target.value) })}
                      style={{ ...inputStyle, paddingLeft: 28 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Métodos de Pagamento</label>
                  <p style={helpStyle}>Selecione os métodos aceitos.</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {PAYMENT_METHODS.map((pm) => {
                      const sel = form.paymentMethods.includes(pm.id);
                      return (
                        <button
                          key={pm.id}
                          onClick={() => toggleArrayField("paymentMethods", pm.id)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 500,
                            border: `1.5px solid ${sel ? "var(--primary-light)" : "var(--border)"}`,
                            background: sel ? "rgba(37,99,235,0.08)" : "transparent",
                            color: sel ? "var(--primary-light)" : "var(--text-muted)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {pm.icon} {pm.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Setup */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span>⚙️</span> Configuração Técnica
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={labelStyle}>PSP Principal</label>
                  <p style={helpStyle}>Provedor de Serviços de Pagamento.</p>
                  <select
                    value={form.psp}
                    onChange={(e) => setForm({ ...form, psp: e.target.value })}
                    style={inputStyle}
                  >
                    {PSPS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Número de Adquirentes</label>
                  <p style={helpStyle}>Bancos adquirentes no processamento.</p>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.acquirerCount}
                    onChange={(e) => setForm({ ...form, acquirerCount: Math.min(10, Math.max(1, Number(e.target.value))) })}
                    style={inputStyle}
                  />
                </div>

                {/* Toggles */}
                <div
                  style={{
                    padding: "16px 18px",
                    borderRadius: 12,
                    border: `1.5px solid ${form.tokenizationEnabled ? "var(--success)" : "var(--border)"}`,
                    background: form.tokenizationEnabled ? "rgba(22,163,74,0.04)" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setForm({ ...form, tokenizationEnabled: !form.tokenizationEnabled })}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>🔑 Tokenização</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Tokens de rede para cartões</div>
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 22,
                        borderRadius: 11,
                        background: form.tokenizationEnabled ? "var(--success)" : "var(--border)",
                        position: "relative",
                        transition: "background 0.2s",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: "white",
                          position: "absolute",
                          top: 3,
                          left: form.tokenizationEnabled ? 21 : 3,
                          transition: "left 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px 18px",
                    borderRadius: 12,
                    border: `1.5px solid ${form.threeDSEnabled ? "var(--primary-light)" : "var(--border)"}`,
                    background: form.threeDSEnabled ? "rgba(37,99,235,0.04)" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setForm({ ...form, threeDSEnabled: !form.threeDSEnabled })}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>🛡️ 3D Secure</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Autenticação forte (SCA)</div>
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 22,
                        borderRadius: 11,
                        background: form.threeDSEnabled ? "var(--primary-light)" : "var(--border)",
                        position: "relative",
                        transition: "background 0.2s",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: "white",
                          position: "absolute",
                          top: 3,
                          left: form.threeDSEnabled ? 21 : 3,
                          transition: "left 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Métricas */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <span>📊</span> Métricas Atuais
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Approval Rate */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Taxa de Aprovação</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>Benchmark: 92%</span>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: form.approvalRate >= 90 ? "#16a34a" : form.approvalRate >= 80 ? "#d97706" : "#dc2626" }}>
                      {form.approvalRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={form.approvalRate}
                    onChange={(e) => setForm({ ...form, approvalRate: Number(e.target.value) })}
                    style={{ width: "100%", accentColor: "var(--primary)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Fraud Rate */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Taxa de Fraude</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>Benchmark: 0.5%</span>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: form.fraudRate <= 0.5 ? "#16a34a" : form.fraudRate <= 1.0 ? "#d97706" : "#dc2626" }}>
                      {form.fraudRate.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={form.fraudRate}
                    onChange={(e) => setForm({ ...form, fraudRate: Number(e.target.value) })}
                    style={{ width: "100%", accentColor: "#d97706" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                    <span>0%</span>
                    <span>5%</span>
                  </div>
                </div>

                {/* Chargeback Rate */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Taxa de Chargeback</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>Benchmark: 0.3%</span>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: form.chargebackRate <= 0.3 ? "#16a34a" : form.chargebackRate <= 0.6 ? "#d97706" : "#dc2626" }}>
                      {form.chargebackRate.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={0.1}
                    value={form.chargebackRate}
                    onChange={(e) => setForm({ ...form, chargebackRate: Number(e.target.value) })}
                    style={{ width: "100%", accentColor: "#dc2626" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                    <span>0%</span>
                    <span>3%</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12, fontStyle: "italic" }}>
                * Esses números (benchmarks) podem ter sofrido alteração com o tempo. Verifique novamente se permanecem atuais.
              </p>
            </div>
          )}

          {/* STEP 4: Decline Reasons */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                <span>❌</span> Motivos de Recusa
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
                Selecione os motivos de recusa mais frequentes no seu sistema.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DECLINE_REASONS.map((reason) => {
                  const sel = form.topDeclineReasons.includes(reason);
                  return (
                    <button
                      key={reason}
                      onClick={() => toggleArrayField("topDeclineReasons", reason)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 14px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 500,
                        border: `1.5px solid ${sel ? "#dc2626" : "var(--border)"}`,
                        background: sel ? "rgba(220,38,38,0.08)" : "transparent",
                        color: sel ? "#dc2626" : "var(--text-muted)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {sel && (
                        <span style={{
                          width: 16, height: 16, borderRadius: "50%",
                          background: "#dc2626", color: "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, fontWeight: 700,
                        }}>
                          ✓
                        </span>
                      )}
                      {reason}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
                {form.topDeclineReasons.length} selecionado{form.topDeclineReasons.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}

          {/* ---- Navigation ---- */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 28,
              paddingTop: 18,
              borderTop: "1px solid var(--border)",
            }}
          >
            {canGoBack ? (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--foreground)",
                  cursor: "pointer",
                }}
              >
                ← Anterior
              </button>
            ) : (
              <div />
            )}

            {canAdvance ? (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Próximo →
              </button>
            ) : (
              <button
                onClick={runDiagnosis}
                disabled={isRunning}
                style={{
                  padding: "12px 32px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  border: "none",
                  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  color: "white",
                  cursor: isRunning ? "not-allowed" : "pointer",
                  opacity: isRunning ? 0.6 : 1,
                  boxShadow: "0 4px 12px rgba(5,150,105,0.25)",
                }}
              >
                {isRunning ? "⏳ Analisando..." : "🩺 Executar Diagnóstico"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/*  DIAGNOSIS RESULTS                                                 */}
      {/* ================================================================== */}
      {showResults && (
        <div className="animate-fade-in">
          {/* Results header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Resultados do Diagnóstico</h2>
            <button
              onClick={() => { setShowResults(false); setStep(1); }}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--foreground)",
                cursor: "pointer",
              }}
            >
              ← Novo Diagnóstico
            </button>
          </div>

          {/* Severity overview */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            {(["critical", "high", "medium", "low"] as const).map((sev) => {
              const count = MOCK_DIAGNOSIS.filter((d) => d.severity === sev).length;
              if (!count) return null;
              const meta = SEVERITY_META[sev];
              return (
                <div
                  key={sev}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    background: meta.bg,
                    color: meta.color,
                    border: `1px solid ${meta.border}`,
                  }}
                >
                  {meta.icon} {count} {meta.label}
                </div>
              );
            })}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              {MOCK_DIAGNOSIS.length} problemas ·{" "}
              {MOCK_DIAGNOSIS.reduce((a, p) => a + p.solutions.length, 0)} soluções
            </div>
          </div>

          {/* Problem cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {MOCK_DIAGNOSIS.map((problem) => {
              const meta = SEVERITY_META[problem.severity];
              return (
                <div
                  key={problem.id}
                  className="card-flat"
                  style={{
                    padding: "18px 20px",
                    borderLeft: `4px solid ${meta.color}`,
                  }}
                >
                  {/* Title + severity */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{problem.title}</h3>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 10px",
                        borderRadius: 9999,
                        fontSize: 11,
                        fontWeight: 700,
                        background: meta.bg,
                        color: meta.color,
                        border: `1px solid ${meta.border}`,
                      }}
                    >
                      {meta.icon} {meta.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 }}>
                    {problem.description}
                  </p>

                  {/* Impact */}
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: meta.bg,
                      border: `1px solid ${meta.border}`,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: meta.color, marginBottom: 4 }}>
                      Impacto Estimado
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.5 }}>{problem.impact}</p>
                  </div>

                  {/* Solutions */}
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 8 }}>
                      Soluções Recomendadas
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {problem.solutions.map((sol) => (
                        <Link
                          key={sol.label}
                          href={sol.href}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
                            color: "white",
                            textDecoration: "none",
                            transition: "all 0.2s",
                          }}
                        >
                          {sol.label}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/*  FOOTER                                                            */}
      {/* ================================================================== */}
      <div style={{ marginTop: 40 }}>
        <div className="divider-text" style={{ marginBottom: 20 }}>
          Páginas Relacionadas
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            {
              title: "Biblioteca de Problemas",
              desc: "Catálogo de problemas de pagamento com causas-raiz",
              href: "/diagnostics/problem-library",
              icon: "📚",
              gradient: "linear-gradient(135deg, #dc2626 0%, #d97706 100%)",
            },
            {
              title: "Árvore de Métricas",
              desc: "Hierarquia de métricas e seus relacionamentos",
              href: "/diagnostics/metrics-tree",
              icon: "🌳",
              gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
            },
            {
              title: "Simulador",
              desc: "Simule o impacto de features na sua stack",
              href: "/simulation/payment-simulator",
              icon: "🧪",
              gradient: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
            },
          ].map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="card-flat interactive-hover"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "16px 14px",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: page.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {page.icon}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{page.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>{page.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
