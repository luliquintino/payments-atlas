"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type IntegrationType = "api" | "hosted" | "sdk" | "plugin";
type Feature =
  | "cartao_credito"
  | "cartao_debito"
  | "pix"
  | "boleto"
  | "recorrencia"
  | "split"
  | "threeds"
  | "tokenizacao";

type Phase = "setup" | "desenvolvimento" | "testes" | "golive";

interface ChecklistItem {
  id: string;
  phase: Phase;
  label: string;
  description: string;
  estimatedHours: number;
  link?: string;
  requiredFor?: IntegrationType[];
  requiredFeatures?: Feature[];
}

/* ------------------------------------------------------------------ */
/*  Master checklist items                                             */
/* ------------------------------------------------------------------ */
const ALL_ITEMS: ChecklistItem[] = [
  // Setup
  { id: "s1", phase: "setup", label: "Criar conta no PSP/adquirente", description: "Cadastro, documentacao e aprovacao do MCC.", estimatedHours: 4 },
  { id: "s2", phase: "setup", label: "Configurar MCC e ramo de atividade", description: "Definir Merchant Category Code correto para taxas adequadas.", estimatedHours: 1, link: "/atlas/acquiring" },
  { id: "s3", phase: "setup", label: "Obter credenciais de sandbox", description: "API keys, client ID/secret para ambiente de testes.", estimatedHours: 1 },
  { id: "s4", phase: "setup", label: "Configurar ambiente de desenvolvimento", description: "Setup local, variaaveis de ambiente, SDK/biblioteca.", estimatedHours: 2 },
  { id: "s5", phase: "setup", label: "Configurar webhook endpoint", description: "Endpoint HTTPS para receber notificacoes assincronas.", estimatedHours: 2, requiredFor: ["api", "hosted", "sdk"] },
  { id: "s6", phase: "setup", label: "Registrar dominio no PSP", description: "Whitelist de dominios para checkout hosted.", estimatedHours: 1, requiredFor: ["hosted"] },
  { id: "s7", phase: "setup", label: "Instalar plugin no e-commerce", description: "Instalar e configurar plugin na plataforma (Shopify, VTEX, WooCommerce).", estimatedHours: 2, requiredFor: ["plugin"] },
  { id: "s8", phase: "setup", label: "Definir escopo PCI-DSS", description: "Avaliar nivel de compliance necessario (SAQ-A vs SAQ-D).", estimatedHours: 2, link: "/atlas/pci-dss" },

  // Desenvolvimento
  { id: "d1", phase: "desenvolvimento", label: "Implementar criacao de pagamento", description: "POST /payments com dados do pedido, valor, metodo.", estimatedHours: 4, requiredFor: ["api", "sdk"] },
  { id: "d2", phase: "desenvolvimento", label: "Implementar checkout hosted", description: "Redirecionar para pagina de checkout do PSP.", estimatedHours: 3, requiredFor: ["hosted"] },
  { id: "d3", phase: "desenvolvimento", label: "Implementar captura de pagamento", description: "Captura manual ou automatica apos autorizacao.", estimatedHours: 2, requiredFor: ["api", "sdk"], requiredFeatures: ["cartao_credito", "cartao_debito"] },
  { id: "d4", phase: "desenvolvimento", label: "Implementar estorno/refund", description: "Endpoint de estorno total e parcial.", estimatedHours: 3, requiredFor: ["api", "sdk"] },
  { id: "d5", phase: "desenvolvimento", label: "Implementar handler de webhooks", description: "Processar payment.confirmed, payment.failed, chargeback.created.", estimatedHours: 4, requiredFor: ["api", "hosted", "sdk"] },
  { id: "d6", phase: "desenvolvimento", label: "Tratamento de erros e retry", description: "Retry com exponential backoff, circuit breaker.", estimatedHours: 3, requiredFor: ["api", "sdk"] },
  { id: "d7", phase: "desenvolvimento", label: "Idempotency keys", description: "Implementar chaves de idempotencia para evitar duplicatas.", estimatedHours: 2, requiredFor: ["api", "sdk"], link: "/atlas/api-design" },
  { id: "d8", phase: "desenvolvimento", label: "Implementar Pix QR Code", description: "Gerar QR code dinamico e exibir para o cliente.", estimatedHours: 3, requiredFeatures: ["pix"] },
  { id: "d9", phase: "desenvolvimento", label: "Implementar Boleto", description: "Gerar boleto com dados do pagador e exibir linha digitavel.", estimatedHours: 3, requiredFeatures: ["boleto"] },
  { id: "d10", phase: "desenvolvimento", label: "Implementar recorrencia", description: "Criar subscription, gerenciar ciclos, dunning.", estimatedHours: 6, requiredFeatures: ["recorrencia"] },
  { id: "d11", phase: "desenvolvimento", label: "Implementar Split de pagamento", description: "Dividir valor entre seller e marketplace.", estimatedHours: 5, requiredFeatures: ["split"], link: "/atlas/split-payments" },
  { id: "d12", phase: "desenvolvimento", label: "Implementar 3D Secure", description: "Autenticacao 3DS 2.0 com challenge flow.", estimatedHours: 4, requiredFeatures: ["threeds"], link: "/atlas/3d-secure" },
  { id: "d13", phase: "desenvolvimento", label: "Implementar tokenizacao", description: "Salvar cartao tokenizado para pagamentos futuros.", estimatedHours: 3, requiredFeatures: ["tokenizacao"], link: "/atlas/tokenization" },
  { id: "d14", phase: "desenvolvimento", label: "Integrar SDK Mobile", description: "Configurar SDK nativo iOS/Android.", estimatedHours: 6, requiredFor: ["sdk"] },

  // Testes
  { id: "t1", phase: "testes", label: "Testar happy path completo", description: "Pagamento aprovado end-to-end para cada metodo.", estimatedHours: 2 },
  { id: "t2", phase: "testes", label: "Testar cartoes recusados", description: "Testar todos os motivos de recusa (saldo, fraude, expirado).", estimatedHours: 2, requiredFeatures: ["cartao_credito", "cartao_debito"] },
  { id: "t3", phase: "testes", label: "Testar chargebacks", description: "Simular disputa e fluxo de representment.", estimatedHours: 2, requiredFeatures: ["cartao_credito"] },
  { id: "t4", phase: "testes", label: "Testar webhooks", description: "Validar recebimento e processamento de todos os eventos.", estimatedHours: 2, requiredFor: ["api", "hosted", "sdk"] },
  { id: "t5", phase: "testes", label: "Testar estornos", description: "Estorno total e parcial para cada metodo.", estimatedHours: 2 },
  { id: "t6", phase: "testes", label: "Teste de carga", description: "Simular volume de producao (ex: 100 TPS).", estimatedHours: 4, requiredFor: ["api", "sdk"] },
  { id: "t7", phase: "testes", label: "Testar timeout e retry", description: "Simular falhas de rede e verificar retry logic.", estimatedHours: 2, requiredFor: ["api", "sdk"] },
  { id: "t8", phase: "testes", label: "Testar 3DS challenge", description: "Simular fluxo de challenge com cartoes de teste.", estimatedHours: 2, requiredFeatures: ["threeds"] },

  // Go-Live
  { id: "g1", phase: "golive", label: "PCI compliance check", description: "Preencher SAQ e validar conformidade.", estimatedHours: 4, link: "/atlas/pci-dss" },
  { id: "g2", phase: "golive", label: "Trocar para credenciais de producao", description: "Substituir sandbox keys por production keys.", estimatedHours: 1 },
  { id: "g3", phase: "golive", label: "Configurar monitoramento", description: "Alertas de taxa de aprovacao, latencia, erros.", estimatedHours: 3 },
  { id: "g4", phase: "golive", label: "Configurar alertas de chargeback", description: "Monitorar taxa de chargeback e programas VDMP/ECM.", estimatedHours: 2, link: "/atlas/chargebacks" },
  { id: "g5", phase: "golive", label: "Rollout gradual", description: "Comecar com % pequeno de trafego e escalar.", estimatedHours: 2 },
];

const INTEGRATION_TYPES: { key: IntegrationType; label: string; desc: string }[] = [
  { key: "api", label: "API Direta (REST)", desc: "Maximo controle, mais codigo" },
  { key: "hosted", label: "Hosted Checkout", desc: "Menor escopo PCI, mais rapido" },
  { key: "sdk", label: "SDK Mobile", desc: "Integracao nativa iOS/Android" },
  { key: "plugin", label: "Plugin E-commerce", desc: "Shopify, WooCommerce, VTEX" },
];

const FEATURES: { key: Feature; label: string }[] = [
  { key: "cartao_credito", label: "Cartao de credito" },
  { key: "cartao_debito", label: "Cartao de debito" },
  { key: "pix", label: "Pix" },
  { key: "boleto", label: "Boleto" },
  { key: "recorrencia", label: "Recorrencia" },
  { key: "split", label: "Split Payments" },
  { key: "threeds", label: "3D Secure" },
  { key: "tokenizacao", label: "Tokenizacao" },
];

const PHASE_META: Record<Phase, { label: string; color: string }> = {
  setup: { label: "Setup", color: "#6366f1" },
  desenvolvimento: { label: "Desenvolvimento", color: "#f59e0b" },
  testes: { label: "Testes", color: "#10b981" },
  golive: { label: "Go-Live", color: "#ef4444" },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function IntegrationChecklistPage() {
  const { visitPage } = useGameProgress();
  useEffect(() => { visitPage("/tools/integration-checklist"); }, [visitPage]);

  const [step, setStep] = useState(1);
  const [integrationType, setIntegrationType] = useState<IntegrationType>("api");
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>(["cartao_credito", "pix"]);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleFeature = useCallback((f: Feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filteredItems = useMemo(() => {
    return ALL_ITEMS.filter((item) => {
      if (item.requiredFor && !item.requiredFor.includes(integrationType)) return false;
      if (item.requiredFeatures && !item.requiredFeatures.some((f) => selectedFeatures.includes(f))) return false;
      return true;
    });
  }, [integrationType, selectedFeatures]);

  const totalHours = useMemo(() => filteredItems.reduce((sum, i) => sum + i.estimatedHours, 0), [filteredItems]);
  const completedCount = useMemo(() => filteredItems.filter((i) => checked.has(i.id)).length, [filteredItems, checked]);
  const progressPct = filteredItems.length > 0 ? (completedCount / filteredItems.length) * 100 : 0;

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
    marginBottom: "0.5rem",
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>
          &larr; Ferramentas
        </Link>
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
        Checklist de Integracao
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
        Gere um checklist personalizado para sua integracao de pagamentos.
      </p>

      {/* Steps indicator */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            onClick={() => { if (s < step || (s === 2 && step >= 1) || (s === 3 && step >= 2)) setStep(s); }}
            style={{
              flex: 1,
              padding: "0.6rem 1rem",
              borderRadius: 8,
              background: step === s ? "var(--primary)" : step > s ? "var(--primary-bg)" : "var(--surface)",
              color: step === s ? "#fff" : step > s ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.82rem",
              textAlign: "center",
              cursor: "pointer",
              border: `1px solid ${step === s ? "var(--primary)" : "var(--border)"}`,
            }}
          >
            {s}. {s === 1 ? "Tipo" : s === 2 ? "Features" : "Checklist"}
          </div>
        ))}
      </div>

      {/* Step 1: Integration type */}
      {step === 1 && (
        <div>
          <div style={labelStyle}>Escolha o tipo de integracao</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {INTEGRATION_TYPES.map((t) => (
              <div
                key={t.key}
                onClick={() => setIntegrationType(t.key)}
                style={{
                  ...card(),
                  cursor: "pointer",
                  borderColor: integrationType === t.key ? "var(--primary)" : "var(--border)",
                  borderWidth: integrationType === t.key ? 2 : 1,
                  background: integrationType === t.key ? "var(--primary-bg)" : "var(--surface)",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>
                  {t.label}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{t.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
            <button
              onClick={() => setStep(2)}
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: "var(--primary)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                border: "none",
              }}
            >
              Proximo &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Features */}
      {step === 2 && (
        <div>
          <div style={labelStyle}>Selecione as funcionalidades</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {FEATURES.map((f) => (
              <label
                key={f.key}
                style={{
                  ...card(),
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                  borderColor: selectedFeatures.includes(f.key) ? "var(--primary)" : "var(--border)",
                  background: selectedFeatures.includes(f.key) ? "var(--primary-bg)" : "var(--surface)",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(f.key)}
                  onChange={() => toggleFeature(f.key)}
                  style={{ accentColor: "var(--primary)", width: 18, height: 18 }}
                />
                <span style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--foreground)" }}>{f.label}</span>
              </label>
            ))}
          </div>
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setStep(1)}
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: "var(--surface)",
                color: "var(--foreground)",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                border: "1px solid var(--border)",
              }}
            >
              &larr; Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: 8,
                background: "var(--primary)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                border: "none",
              }}
            >
              Gerar Checklist &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generated Checklist */}
      {step === 3 && (
        <div>
          {/* Progress bar */}
          <div style={{ ...card(), marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--foreground)" }}>
                Progresso: {completedCount}/{filteredItems.length} itens
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                ~{totalHours}h estimadas
              </span>
            </div>
            <div style={{ height: 10, borderRadius: 5, background: "var(--border)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                borderRadius: 5,
                width: `${progressPct}%`,
                background: progressPct === 100 ? "var(--success)" : "var(--primary)",
                transition: "width 0.3s ease",
              }} />
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
              {Math.round(progressPct)}% concluido
              {progressPct === 100 && " - Parabens! Checklist completo!"}
            </div>
          </div>

          {/* Back button */}
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              onClick={() => setStep(2)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 8,
                background: "var(--surface)",
                color: "var(--foreground)",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                border: "1px solid var(--border)",
              }}
            >
              &larr; Alterar selecao
            </button>
          </div>

          {/* Grouped by phase */}
          {(["setup", "desenvolvimento", "testes", "golive"] as Phase[]).map((phase) => {
            const items = filteredItems.filter((i) => i.phase === phase);
            if (items.length === 0) return null;
            const meta = PHASE_META[phase];
            const phaseCompleted = items.filter((i) => checked.has(i.id)).length;
            return (
              <div key={phase} style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: meta.color,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)" }}>
                    {meta.label}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {phaseCompleted}/{items.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {items.map((item) => {
                    const isChecked = checked.has(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        style={{
                          ...card(),
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.75rem",
                          cursor: "pointer",
                          opacity: isChecked ? 0.6 : 1,
                          borderColor: isChecked ? "var(--success)" : "var(--border)",
                          padding: "1rem 1.25rem",
                        }}
                      >
                        <div style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: isChecked ? "2px solid var(--success)" : "2px solid var(--border)",
                          background: isChecked ? "var(--success)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "0.1rem",
                          color: "#fff",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}>
                          {isChecked && "\u2713"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "var(--foreground)",
                            textDecoration: isChecked ? "line-through" : "none",
                            marginBottom: "0.15rem",
                          }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                            {item.description}
                          </div>
                          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.35rem", alignItems: "center" }}>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                              ~{item.estimatedHours}h
                            </span>
                            {item.link && (
                              <Link
                                href={item.link}
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: "0.72rem", color: "var(--primary)", textDecoration: "none" }}
                              >
                                Ver no Atlas &rarr;
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
