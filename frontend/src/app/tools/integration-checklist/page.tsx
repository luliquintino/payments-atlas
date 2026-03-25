"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type BusinessType = "ecommerce" | "saas" | "marketplace" | "varejo";
type PaymentMethod = "cartao" | "pix" | "boleto" | "wallet" | "bnpl" | "recorrencia";
type PSPOption =
  | "Cielo" | "Rede" | "Stone" | "PagSeguro" | "Adyen"
  | "Stripe" | "Mercado Pago" | "PayPal" | "dLocal" | "EBANX";
type Environment = "sandbox" | "homologacao" | "producao";
type Category = "setup" | "api" | "seguranca" | "testes" | "golive";

interface ChecklistItem {
  id: string;
  category: Category;
  title: string;
  timeEstimate: string;
  pitfall: string;
  relevantBusiness?: BusinessType[];
  relevantMethods?: PaymentMethod[];
  relevantEnv?: Environment[];
}

/* ------------------------------------------------------------------ */
/*  Master checklist (28 items across 5 categories)                    */
/* ------------------------------------------------------------------ */
const ALL_ITEMS: ChecklistItem[] = [
  // Setup Inicial (5)
  {
    id: "setup-1", category: "setup",
    title: "Criar conta e obter credenciais no PSP",
    timeEstimate: "~2 horas",
    pitfall: "Muitos PSPs exigem CNPJ ativo e contrato social. PagSeguro e Mercado Pago aceitam CPF, mas com limites. Adyen e Stripe exigem volume minimo. Nao comece a codar sem credenciais validas de sandbox.",
  },
  {
    id: "setup-2", category: "setup",
    title: "Configurar MCC (Merchant Category Code)",
    timeEstimate: "~1 hora",
    pitfall: "MCC errado = taxas maiores e possivel bloqueio. Marketplace precisa de MCC especifico (ex: 5411 vs 5999). Verifique com o PSP se o MCC escolhido suporta split de pagamento, se aplicavel.",
    relevantBusiness: ["ecommerce", "marketplace", "varejo"],
  },
  {
    id: "setup-3", category: "setup",
    title: "Configurar ambiente de desenvolvimento (SDK, env vars)",
    timeEstimate: "~2 horas",
    pitfall: "Nunca hardcode API keys no codigo. Use .env e secrets manager. Em Stripe, confunda live key com test key e vai cobrar clientes reais. Separe completamente ambientes desde o inicio.",
  },
  {
    id: "setup-4", category: "setup",
    title: "Configurar webhook endpoint HTTPS",
    timeEstimate: "~3 horas",
    pitfall: "Webhook DEVE ser HTTPS mesmo em dev (use ngrok/cloudflared). Sem webhook voce NAO recebe confirmacao de PIX, boleto pago, ou chargeback. E a causa #1 de \"pagamento sumiu\" em producao.",
  },
  {
    id: "setup-5", category: "setup",
    title: "Definir escopo PCI-DSS e SAQ aplicavel",
    timeEstimate: "~2 horas",
    pitfall: "Se voce usa hosted checkout (redirect) precisa apenas SAQ-A. Se captura dados de cartao no seu frontend, precisa SAQ A-EP ou D. SAQ-D custa R$50k+ em auditoria. Use tokenizacao do PSP para evitar.",
  },

  // Integracao de API (8)
  {
    id: "api-1", category: "api",
    title: "Implementar criacao de pagamento (POST /payments)",
    timeEstimate: "~4 horas",
    pitfall: "Sempre envie idempotency key para evitar cobrar o cliente duas vezes em retry. Sem isso, timeout de rede = cobranca duplicada. Stone e Stripe retornam erro se voce nao enviar.",
  },
  {
    id: "api-2", category: "api",
    title: "Implementar captura (manual ou automatica)",
    timeEstimate: "~2 horas",
    pitfall: "Autorizacao sem captura expira em 5-7 dias (varia por bandeira). Se voce nao capturar, perde a venda. Marketplace com entrega longa: use captura manual apos envio do produto.",
    relevantMethods: ["cartao"],
  },
  {
    id: "api-3", category: "api",
    title: "Implementar estorno/refund (total e parcial)",
    timeEstimate: "~3 horas",
    pitfall: "Estorno parcial nao e suportado por todos os PSPs para PIX (apenas Stripe e Adyen). Boleto nao tem estorno automatico, precisa de transferencia bancaria. Documente isso no seu CS.",
  },
  {
    id: "api-4", category: "api",
    title: "Implementar handler de webhooks (validacao + processamento)",
    timeEstimate: "~4 horas",
    pitfall: "Sempre valide assinatura HMAC do webhook antes de processar. Sem validacao, qualquer pessoa pode enviar POST fake para seu endpoint e marcar pedidos como pagos. Retorne 200 ANTES de processar (use fila).",
  },
  {
    id: "api-5", category: "api",
    title: "Implementar retry com exponential backoff",
    timeEstimate: "~2 horas",
    pitfall: "Retry sem backoff = rate limit = IP bloqueado. Use jitter aleatorio. Circuit breaker e essencial: se o PSP esta fora, nao fique batendo. Stripe rate limit: 100 req/s, Cielo: 50 req/s.",
  },
  {
    id: "api-6", category: "api",
    title: "Implementar geracao de PIX QR Code",
    timeEstimate: "~3 horas",
    pitfall: "QR Code PIX expira (padrao 30min). Se expirar, o pagamento nao e reconhecido mesmo que o cliente pague. Implemente polling + webhook para confirmar. Copia-e-cola e obrigatorio como fallback.",
    relevantMethods: ["pix"],
  },
  {
    id: "api-7", category: "api",
    title: "Implementar geracao e registro de boleto",
    timeEstimate: "~3 horas",
    pitfall: "Boleto leva 1-3 dias uteis para compensar. Nao libere produto antes da confirmacao via webhook. Boleto vencido pode ser pago em alguns bancos (DDA), causando conciliacao errada. Defina prazo curto.",
    relevantMethods: ["boleto"],
  },
  {
    id: "api-8", category: "api",
    title: "Implementar recorrencia/subscription",
    timeEstimate: "~6 horas",
    pitfall: "Cartao expira, saldo insuficiente, limite estourado. Sem dunning (retry inteligente) voce perde 15-20% dos assinantes por churn involuntario. Implemente: retry em D+1, D+3, D+7 com notificacao ao cliente.",
    relevantMethods: ["recorrencia"],
  },

  // Seguranca/PCI (5)
  {
    id: "sec-1", category: "seguranca",
    title: "Implementar tokenizacao de cartao (nunca armazene PAN)",
    timeEstimate: "~3 horas",
    pitfall: "Armazenar numero do cartao no seu banco de dados e violacao PCI e pode gerar multa de USD 500k+. Use o vault/tokenizacao do PSP. Mesmo logs nao podem conter PAN completo.",
    relevantMethods: ["cartao"],
  },
  {
    id: "sec-2", category: "seguranca",
    title: "Implementar 3D Secure 2.0",
    timeEstimate: "~4 horas",
    pitfall: "3DS transfere liability de chargeback para o banco emissor. Sem 3DS, VOCE paga o chargeback. Mas 3DS com challenge reduz conversao em 10-15%. Use frictionless flow quando possivel.",
    relevantMethods: ["cartao"],
  },
  {
    id: "sec-3", category: "seguranca",
    title: "Validar assinaturas de webhook (HMAC/signature)",
    timeEstimate: "~1 hora",
    pitfall: "Cada PSP usa formato diferente de assinatura. Stripe usa Stripe-Signature header com timestamp. Adyen usa HMAC-SHA256. Se voce trocar de PSP, a validacao quebra silenciosamente.",
  },
  {
    id: "sec-4", category: "seguranca",
    title: "Proteger API keys e implementar rotacao",
    timeEstimate: "~2 horas",
    pitfall: "API key vazada em repositorio publico do GitHub e encontrada por bots em menos de 30 segundos. Use secrets manager (AWS SM, Vault). Implemente rotacao trimestral. Nunca logue a key inteira.",
  },
  {
    id: "sec-5", category: "seguranca",
    title: "Implementar rate limiting e protecao anti-fraude",
    timeEstimate: "~3 horas",
    pitfall: "Sem rate limiting, atacantes testam cartoes roubados no seu checkout (card testing attack). Isso gera centenas de autorizacoes de R$1.00 e o PSP te multa. Limite: 3 tentativas/cartao/hora.",
  },

  // Testes (6)
  {
    id: "test-1", category: "testes",
    title: "Testar happy path completo para cada metodo de pagamento",
    timeEstimate: "~3 horas",
    pitfall: "Nao teste so cartao aprovado. Teste PIX pago, boleto compensado, wallet aprovada. Cada metodo tem fluxo assincrono diferente. Se o webhook nao chegar no happy path, algo esta muito errado.",
  },
  {
    id: "test-2", category: "testes",
    title: "Testar todos os cenarios de recusa de cartao",
    timeEstimate: "~2 horas",
    pitfall: "Cada PSP tem cartoes de teste diferentes para simular: saldo insuficiente, cartao expirado, fraude, 3DS challenge. Se voce nao testa recusa, o cliente ve \"erro generico\" e abandona o carrinho.",
    relevantMethods: ["cartao"],
  },
  {
    id: "test-3", category: "testes",
    title: "Testar webhook delivery e retry (simular falhas)",
    timeEstimate: "~2 horas",
    pitfall: "Derrube seu endpoint de webhook e veja se o PSP faz retry. Stripe faz retry por 3 dias. Cielo faz 3 tentativas em 1 hora. Se seu endpoint ficar fora por 4 horas com Cielo, voce perde eventos.",
  },
  {
    id: "test-4", category: "testes",
    title: "Testar conciliacao financeira (valores recebidos vs esperados)",
    timeEstimate: "~4 horas",
    pitfall: "O valor que o cliente paga NAO e o que voce recebe. Desconte: taxa do PSP, taxa da bandeira, antecipacao, IOF (cross-border). Se sua conciliacao nao considera isso, seu financeiro vai reclamar.",
  },
  {
    id: "test-5", category: "testes",
    title: "Teste de carga (simular volume de producao)",
    timeEstimate: "~4 horas",
    pitfall: "Sandbox tem rate limits diferentes de producao. Stripe sandbox: 25 req/s vs producao: 100 req/s. Teste com volume realista. Black Friday: volume 10-20x normal. Seu sistema aguenta?",
    relevantEnv: ["homologacao", "producao"],
  },
  {
    id: "test-6", category: "testes",
    title: "Testar fluxo de chargeback/disputa completo",
    timeEstimate: "~2 horas",
    pitfall: "Chargeback tem prazo de resposta (7-15 dias dependendo da bandeira). Se voce nao responde, perde automaticamente. Simule disputa e teste se seu time recebe alerta e consegue enviar evidencia.",
    relevantMethods: ["cartao"],
  },

  // Go-live (4)
  {
    id: "go-1", category: "golive",
    title: "Trocar credenciais de sandbox para producao",
    timeEstimate: "~1 hora",
    pitfall: "Use feature flag, NAO deploy. Se der problema, voce reverte a flag em segundos. Deploy rollback leva minutos. Valide que TODAS as env vars foram trocadas (API key, webhook secret, endpoint URL).",
    relevantEnv: ["producao"],
  },
  {
    id: "go-2", category: "golive",
    title: "Configurar monitoramento e alertas",
    timeEstimate: "~3 horas",
    pitfall: "Monitore: taxa de aprovacao (normal: 75-85%), latencia P95 do PSP, taxa de erro 5xx, volume de chargebacks. Se aprovacao cair 10% em 1 hora, algo quebrou. Alerte no Slack/PagerDuty.",
    relevantEnv: ["producao"],
  },
  {
    id: "go-3", category: "golive",
    title: "Configurar alertas de chargeback (VDMP/ECM)",
    timeEstimate: "~2 horas",
    pitfall: "Visa VDMP: se chargeback passa de 0.9% do volume, voce entra em programa de monitoramento com multas de USD 25k/mes. Mastercard ECM: limite de 1.5%. Monitore DIARIAMENTE.",
    relevantMethods: ["cartao"],
    relevantEnv: ["producao"],
  },
  {
    id: "go-4", category: "golive",
    title: "Rollout gradual (canary deploy com % do trafego)",
    timeEstimate: "~2 horas",
    pitfall: "Nunca va de 0% para 100% de trafego real. Comece com 5%, monitore por 24h, depois 25%, 50%, 100%. Se algo der errado com 5%, voce impactou poucos clientes. Com 100%, e desastre.",
    relevantEnv: ["producao"],
  },
];

const BUSINESS_OPTIONS: { key: BusinessType; label: string; icon: string; desc: string }[] = [
  { key: "ecommerce", label: "E-commerce", icon: "\uD83D\uDED2", desc: "Loja virtual, vendas online B2C" },
  { key: "saas", label: "SaaS", icon: "\u2601\uFE0F", desc: "Software por assinatura, billing recorrente" },
  { key: "marketplace", label: "Marketplace", icon: "\uD83C\uDFEA", desc: "Multiplos sellers, split de pagamento" },
  { key: "varejo", label: "Varejo fisico", icon: "\uD83C\uDFEC", desc: "Loja fisica, POS, omnichannel" },
];

const PAYMENT_METHODS: { key: PaymentMethod; label: string; icon: string }[] = [
  { key: "cartao", label: "Cartao (Credito/Debito)", icon: "\uD83D\uDCB3" },
  { key: "pix", label: "PIX", icon: "\u26A1" },
  { key: "boleto", label: "Boleto Bancario", icon: "\uD83D\uDCC4" },
  { key: "wallet", label: "Wallet Digital", icon: "\uD83D\uDCF1" },
  { key: "bnpl", label: "BNPL (Compre agora, pague depois)", icon: "\uD83D\uDD52" },
  { key: "recorrencia", label: "Recorrencia/Subscription", icon: "\uD83D\uDD01" },
];

const PSP_OPTIONS: { value: PSPOption; label: string; tipo: string }[] = [
  { value: "Cielo", label: "Cielo", tipo: "Adquirente" },
  { value: "Rede", label: "Rede", tipo: "Adquirente" },
  { value: "Stone", label: "Stone", tipo: "Adquirente" },
  { value: "PagSeguro", label: "PagSeguro", tipo: "Sub-adquirente" },
  { value: "Adyen", label: "Adyen", tipo: "Gateway global" },
  { value: "Stripe", label: "Stripe", tipo: "Gateway global" },
  { value: "Mercado Pago", label: "Mercado Pago", tipo: "Sub-adquirente" },
  { value: "PayPal", label: "PayPal", tipo: "Wallet/Gateway" },
  { value: "dLocal", label: "dLocal", tipo: "Gateway LATAM" },
  { value: "EBANX", label: "EBANX", tipo: "Gateway LATAM" },
];

const ENV_OPTIONS: { key: Environment; label: string; icon: string; desc: string }[] = [
  { key: "sandbox", label: "Sandbox", icon: "\uD83E\uDDEA", desc: "Testes com dados ficticios" },
  { key: "homologacao", label: "Homologacao", icon: "\uD83D\uDD0D", desc: "Validacao pre-producao" },
  { key: "producao", label: "Producao", icon: "\uD83D\uDE80", desc: "Ambiente real com clientes" },
];

const CATEGORY_META: Record<Category, { label: string; color: string; icon: string }> = {
  setup: { label: "Setup Inicial", color: "#6366f1", icon: "\u2699\uFE0F" },
  api: { label: "Integracao de API", color: "#f59e0b", icon: "\uD83D\uDD17" },
  seguranca: { label: "Seguranca / PCI", color: "#ef4444", icon: "\uD83D\uDD12" },
  testes: { label: "Testes", color: "#10b981", icon: "\uD83E\uDDEA" },
  golive: { label: "Go-Live", color: "#8b5cf6", icon: "\uD83D\uDE80" },
};

const STORAGE_KEY = "integration-checklist-state";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function IntegrationChecklistPage() {
  const { visitPage } = useGameProgress();
  useEffect(() => { visitPage("/tools/integration-checklist"); }, [visitPage]);

  /* Wizard state */
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [selectedMethods, setSelectedMethods] = useState<PaymentMethod[]>([]);
  const [selectedPSP, setSelectedPSP] = useState<PSPOption | null>(null);
  const [environment, setEnvironment] = useState<Environment | null>(null);

  /* Checklist state */
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedPitfall, setExpandedPitfall] = useState<string | null>(null);

  /* Load from localStorage on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.checked) setChecked(parsed.checked);
        if (parsed.businessType) setBusinessType(parsed.businessType);
        if (parsed.selectedMethods) setSelectedMethods(parsed.selectedMethods);
        if (parsed.selectedPSP) setSelectedPSP(parsed.selectedPSP);
        if (parsed.environment) setEnvironment(parsed.environment);
        if (parsed.step) setStep(parsed.step);
      }
    } catch { /* ignore */ }
  }, []);

  /* Save to localStorage on change */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        checked, businessType, selectedMethods, selectedPSP, environment, step,
      }));
    } catch { /* ignore */ }
  }, [checked, businessType, selectedMethods, selectedPSP, environment, step]);

  const toggleMethod = useCallback((m: PaymentMethod) => {
    setSelectedMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  /* Filter items based on wizard selections */
  const filteredItems = useMemo(() => {
    return ALL_ITEMS.filter((item) => {
      if (item.relevantBusiness && businessType && !item.relevantBusiness.includes(businessType)) return false;
      if (item.relevantMethods && !item.relevantMethods.some((m) => selectedMethods.includes(m))) return false;
      if (item.relevantEnv && environment && !item.relevantEnv.includes(environment)) return false;
      return true;
    });
  }, [businessType, selectedMethods, environment]);

  const completedCount = useMemo(() => filteredItems.filter((i) => checked[i.id]).length, [filteredItems, checked]);
  const progressPct = filteredItems.length > 0 ? Math.round((completedCount / filteredItems.length) * 100) : 0;

  /* Export as markdown */
  const exportMarkdown = useCallback(() => {
    const lines: string[] = [
      "# Checklist de Integracao de Pagamentos",
      "",
      `**Tipo de negocio:** ${businessType ?? "-"}`,
      `**Meios de pagamento:** ${selectedMethods.join(", ") || "-"}`,
      `**PSP:** ${selectedPSP ?? "-"}`,
      `**Ambiente:** ${environment ?? "-"}`,
      `**Progresso:** ${completedCount}/${filteredItems.length} (${progressPct}%)`,
      "",
    ];
    const categories: Category[] = ["setup", "api", "seguranca", "testes", "golive"];
    for (const cat of categories) {
      const items = filteredItems.filter((i) => i.category === cat);
      if (items.length === 0) continue;
      lines.push(`## ${CATEGORY_META[cat].icon} ${CATEGORY_META[cat].label}`);
      lines.push("");
      for (const item of items) {
        const mark = checked[item.id] ? "x" : " ";
        lines.push(`- [${mark}] **${item.title}** (${item.timeEstimate})`);
        lines.push(`  - Armadilha: ${item.pitfall}`);
      }
      lines.push("");
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist-integracao-${selectedPSP ?? "pagamentos"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [businessType, selectedMethods, selectedPSP, environment, filteredItems, checked, completedCount, progressPct]);

  /* Step validation */
  const canAdvance = (s: number): boolean => {
    if (s === 1) return businessType !== null;
    if (s === 2) return selectedMethods.length > 0;
    if (s === 3) return selectedPSP !== null;
    if (s === 4) return environment !== null;
    return true;
  };

  /* ---- Styles ---- */
  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--surface)",
    borderRadius: "14px",
    padding: "24px",
    border: "1px solid var(--border)",
    ...extra,
  });

  const btnPrimary: React.CSSProperties = {
    padding: "10px 24px",
    borderRadius: "10px",
    background: "var(--primary)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.9rem",
    cursor: "pointer",
    border: "none",
  };

  const btnSecondary: React.CSSProperties = {
    padding: "10px 24px",
    borderRadius: "10px",
    background: "var(--surface)",
    color: "var(--foreground)",
    fontWeight: 600,
    fontSize: "0.9rem",
    cursor: "pointer",
    border: "1px solid var(--border)",
  };

  const stepLabels = ["Tipo de negocio", "Meios de pagamento", "PSP escolhido", "Ambiente", "Checklist"];

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem" }}>
          &larr; Ferramentas
        </Link>
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
        Checklist de Integracao
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "32px" }}>
        Wizard de 5 etapas para gerar um checklist personalizado para sua integracao de pagamentos.
      </p>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5].map((s) => {
          const isActive = step === s;
          const isDone = step > s;
          return (
            <div
              key={s}
              onClick={() => { if (isDone || (s <= step)) setStep(s); }}
              style={{
                flex: "1 1 100px",
                padding: "10px 8px",
                borderRadius: "10px",
                background: isActive ? "var(--primary)" : isDone ? "var(--primary-bg)" : "var(--surface)",
                color: isActive ? "#fff" : isDone ? "var(--primary)" : "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "0.78rem",
                textAlign: "center",
                cursor: isDone || s <= step ? "pointer" : "default",
                border: `1px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
                opacity: s > step && !isDone ? 0.5 : 1,
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "0.7rem", marginBottom: "2px", opacity: 0.8 }}>Etapa {s}</div>
              {stepLabels[s - 1]}
            </div>
          );
        })}
      </div>

      {/* ========== STEP 1: Tipo de negocio ========== */}
      {step === 1 && (
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
            Qual o tipo do seu negocio?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {BUSINESS_OPTIONS.map((b) => {
              const selected = businessType === b.key;
              return (
                <div
                  key={b.key}
                  onClick={() => setBusinessType(b.key)}
                  style={{
                    ...card(),
                    cursor: "pointer",
                    borderColor: selected ? "var(--primary)" : "var(--border)",
                    borderWidth: selected ? "2px" : "1px",
                    background: selected ? "var(--primary-bg)" : "var(--surface)",
                    padding: "20px",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{b.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "4px" }}>
                    {b.label}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{b.desc}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button disabled={!canAdvance(1)} onClick={() => setStep(2)} style={{ ...btnPrimary, opacity: canAdvance(1) ? 1 : 0.4, cursor: canAdvance(1) ? "pointer" : "not-allowed" }}>
              Proximo &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ========== STEP 2: Meios de pagamento ========== */}
      {step === 2 && (
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
            Quais meios de pagamento voce vai aceitar? (selecione varios)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {PAYMENT_METHODS.map((m) => {
              const selected = selectedMethods.includes(m.key);
              return (
                <div
                  key={m.key}
                  onClick={() => toggleMethod(m.key)}
                  style={{
                    ...card(),
                    cursor: "pointer",
                    borderColor: selected ? "var(--primary)" : "var(--border)",
                    borderWidth: selected ? "2px" : "1px",
                    background: selected ? "var(--primary-bg)" : "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px 20px",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    border: selected ? "2px solid var(--primary)" : "2px solid var(--border)",
                    background: selected ? "var(--primary)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}>
                    {selected && "\u2713"}
                  </div>
                  <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{m.icon}</span>
                  <span style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--foreground)" }}>{m.label}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} style={btnSecondary}>&larr; Voltar</button>
            <button disabled={!canAdvance(2)} onClick={() => setStep(3)} style={{ ...btnPrimary, opacity: canAdvance(2) ? 1 : 0.4, cursor: canAdvance(2) ? "pointer" : "not-allowed" }}>
              Proximo &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ========== STEP 3: PSP escolhido ========== */}
      {step === 3 && (
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
            Qual PSP voce vai usar?
          </div>
          <div style={{ ...card(), padding: "20px" }}>
            <select
              value={selectedPSP ?? ""}
              onChange={(e) => setSelectedPSP(e.target.value as PSPOption)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                appearance: "auto",
              }}
            >
              <option value="">Selecione um PSP...</option>
              {PSP_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} ({p.tipo})
                </option>
              ))}
            </select>
            {selectedPSP && (
              <div style={{ marginTop: "16px", padding: "12px 16px", background: "var(--primary-bg)", borderRadius: "10px" }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "4px" }}>
                  {selectedPSP}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  {PSP_OPTIONS.find((p) => p.value === selectedPSP)?.tipo} &middot;{" "}
                  <Link href="/tools/psp-comparator" style={{ color: "var(--primary)", textDecoration: "none" }}>
                    Ver no Comparador &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(2)} style={btnSecondary}>&larr; Voltar</button>
            <button disabled={!canAdvance(3)} onClick={() => setStep(4)} style={{ ...btnPrimary, opacity: canAdvance(3) ? 1 : 0.4, cursor: canAdvance(3) ? "pointer" : "not-allowed" }}>
              Proximo &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ========== STEP 4: Ambiente ========== */}
      {step === 4 && (
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
            Qual ambiente voce esta configurando?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {ENV_OPTIONS.map((e) => {
              const selected = environment === e.key;
              return (
                <div
                  key={e.key}
                  onClick={() => setEnvironment(e.key)}
                  style={{
                    ...card(),
                    cursor: "pointer",
                    borderColor: selected ? "var(--primary)" : "var(--border)",
                    borderWidth: selected ? "2px" : "1px",
                    background: selected ? "var(--primary-bg)" : "var(--surface)",
                    padding: "20px",
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{e.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "4px" }}>
                    {e.label}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{e.desc}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(3)} style={btnSecondary}>&larr; Voltar</button>
            <button disabled={!canAdvance(4)} onClick={() => setStep(5)} style={{ ...btnPrimary, opacity: canAdvance(4) ? 1 : 0.4, cursor: canAdvance(4) ? "pointer" : "not-allowed" }}>
              Gerar Checklist &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ========== STEP 5: Checklist gerado ========== */}
      {step === 5 && (
        <div>
          {/* Progress bar */}
          <div style={{ ...card(), marginBottom: "20px", padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)" }}>
                {completedCount}/{filteredItems.length} itens concluidos
              </span>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: progressPct === 100 ? "#10b981" : "var(--primary)" }}>
                {progressPct}%
              </span>
            </div>
            <div style={{ height: "12px", borderRadius: "6px", background: "var(--border)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                borderRadius: "6px",
                width: `${progressPct}%`,
                background: progressPct === 100
                  ? "linear-gradient(90deg, #10b981, #059669)"
                  : "linear-gradient(90deg, var(--primary), #818cf8)",
                transition: "width 0.3s ease",
              }} />
            </div>
            {progressPct === 100 && (
              <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "#10b981", fontWeight: 600 }}>
                Parabens! Checklist completo!
              </div>
            )}
          </div>

          {/* Summary + actions */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div style={{ ...card(), flex: "1 1 auto", padding: "14px 18px", display: "flex", gap: "24px", flexWrap: "wrap", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <span><strong style={{ color: "var(--foreground)" }}>{businessType}</strong></span>
              <span>{selectedMethods.length} metodos</span>
              <span>PSP: <strong style={{ color: "var(--foreground)" }}>{selectedPSP}</strong></span>
              <span>Amb: <strong style={{ color: "var(--foreground)" }}>{environment}</strong></span>
            </div>
            <button onClick={() => setStep(1)} style={{ ...btnSecondary, fontSize: "0.82rem", padding: "10px 16px" }}>
              Alterar
            </button>
            <button onClick={exportMarkdown} style={{ ...btnPrimary, fontSize: "0.82rem", padding: "10px 16px" }}>
              Exportar .md
            </button>
          </div>

          {/* Grouped by category */}
          {(["setup", "api", "seguranca", "testes", "golive"] as Category[]).map((cat) => {
            const items = filteredItems.filter((i) => i.category === cat);
            if (items.length === 0) return null;
            const meta = CATEGORY_META[cat];
            const catCompleted = items.filter((i) => checked[i.id]).length;
            return (
              <div key={cat} style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.1rem" }}>{meta.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)" }}>
                    {meta.label}
                  </span>
                  <div style={{
                    padding: "2px 10px",
                    borderRadius: "12px",
                    background: catCompleted === items.length ? "#10b98120" : `${meta.color}20`,
                    color: catCompleted === items.length ? "#10b981" : meta.color,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}>
                    {catCompleted}/{items.length}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {items.map((item) => {
                    const isChecked = !!checked[item.id];
                    const isPitfallOpen = expandedPitfall === item.id;
                    return (
                      <div key={item.id} style={{
                        ...card(),
                        padding: "16px 20px",
                        borderColor: isChecked ? "#10b981" : "var(--border)",
                        opacity: isChecked ? 0.7 : 1,
                        transition: "all 0.15s",
                      }}>
                        <div
                          onClick={() => toggleCheck(item.id)}
                          style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}
                        >
                          <div style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "7px",
                            border: isChecked ? "2px solid #10b981" : "2px solid var(--border)",
                            background: isChecked ? "#10b981" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "1px",
                            color: "#fff",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            transition: "all 0.15s",
                          }}>
                            {isChecked && "\u2713"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                              <span style={{
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                color: "var(--foreground)",
                                textDecoration: isChecked ? "line-through" : "none",
                              }}>
                                {item.title}
                              </span>
                              <span style={{
                                fontSize: "0.72rem",
                                color: "var(--text-secondary)",
                                background: "var(--background)",
                                padding: "2px 8px",
                                borderRadius: "8px",
                                fontWeight: 500,
                                flexShrink: 0,
                              }}>
                                {item.timeEstimate}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Pitfall toggle */}
                        <div style={{ marginLeft: "36px", marginTop: "6px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPitfall(isPitfallOpen ? null : item.id);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.78rem",
                              color: "#ef4444",
                              fontWeight: 600,
                              padding: "4px 0",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span style={{ transform: isPitfallOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", display: "inline-block" }}>&#9654;</span>
                            {"\u26A0\uFE0F"} Armadilha comum
                          </button>
                          {isPitfallOpen && (
                            <div style={{
                              marginTop: "8px",
                              padding: "12px 16px",
                              background: "#ef444410",
                              borderRadius: "10px",
                              border: "1px solid #ef444430",
                              fontSize: "0.82rem",
                              color: "var(--foreground)",
                              lineHeight: 1.5,
                            }}>
                              {item.pitfall}
                            </div>
                          )}
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
