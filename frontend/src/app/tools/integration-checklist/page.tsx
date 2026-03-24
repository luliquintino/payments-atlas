"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

interface ChecklistItem {
  id: string;
  label: string;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

type IntegrationType = "api_direta" | "hosted_checkout" | "sdk_mobile" | "plugin";
type Feature = "cartao" | "pix" | "boleto" | "recorrencia" | "split" | "three_ds";

const INTEGRATION_LABELS: Record<IntegrationType, string> = {
  api_direta: "API Direta",
  hosted_checkout: "Hosted Checkout",
  sdk_mobile: "SDK Mobile",
  plugin: "Plugin (Shopify/WooCommerce)",
};

const FEATURE_LABELS: Record<Feature, string> = {
  cartao: "Cartao de Credito/Debito",
  pix: "Pix",
  boleto: "Boleto",
  recorrencia: "Recorrencia",
  split: "Split Payments",
  three_ds: "3D Secure",
};

function buildChecklist(integrationType: IntegrationType, features: Set<Feature>): ChecklistSection[] {
  const sections: ChecklistSection[] = [];
  let idCounter = 0;
  const nextId = () => `item-${++idCounter}`;

  // -- PRE-REQUISITOS (always) --
  const preReqs: ChecklistItem[] = [
    { id: nextId(), label: "Conta no PSP ativa com credenciais de API (API Key + Secret)" },
    { id: nextId(), label: "Ambiente de sandbox configurado" },
    { id: nextId(), label: "Certificado SSL valido no dominio" },
    { id: nextId(), label: "Webhook endpoint acessivel publicamente" },
  ];

  if (integrationType === "sdk_mobile") {
    preReqs.push({ id: nextId(), label: "SDK do PSP adicionado ao projeto (CocoaPods/Gradle)" });
    preReqs.push({ id: nextId(), label: "Configurar app scheme para deep links de retorno" });
  }
  if (integrationType === "plugin") {
    preReqs.push({ id: nextId(), label: "Plataforma (Shopify/WooCommerce) atualizada para versao compativel" });
    preReqs.push({ id: nextId(), label: "Acesso admin ao painel da plataforma" });
  }
  if (integrationType === "hosted_checkout") {
    preReqs.push({ id: nextId(), label: "Dominio para redirect URLs configurado" });
  }

  sections.push({ title: "PRE-REQUISITOS", items: preReqs });

  // -- INTEGRACAO BASE (always for api_direta, sdk_mobile, hosted_checkout) --
  if (integrationType !== "plugin") {
    const base: ChecklistItem[] = [
      { id: nextId(), label: "Implementar autenticacao na API (OAuth 2.0 ou API Key)" },
      { id: nextId(), label: "Criar endpoint de criacao de pagamento (POST /payments)" },
      { id: nextId(), label: "Implementar webhook receiver para notificacoes" },
      { id: nextId(), label: "Configurar idempotency keys em todas as requests" },
      { id: nextId(), label: "Tratar erros HTTP (400, 401, 403, 404, 500, 502, 503)" },
    ];

    if (integrationType === "api_direta") {
      base.push({ id: nextId(), label: "Implementar retry logic com exponential backoff" });
      base.push({ id: nextId(), label: "Configurar timeout adequado (30s recomendado)" });
    }
    if (integrationType === "hosted_checkout") {
      base.push({ id: nextId(), label: "Configurar URLs de retorno (sucesso, erro, pendente)" });
      base.push({ id: nextId(), label: "Implementar verificacao de status pos-redirect" });
    }
    if (integrationType === "sdk_mobile") {
      base.push({ id: nextId(), label: "Inicializar SDK com chave publica (nao secret)" });
      base.push({ id: nextId(), label: "Implementar tratamento de estados do app (background/foreground)" });
    }

    sections.push({ title: "INTEGRACAO BASE", items: base });
  } else {
    sections.push({
      title: "CONFIGURACAO DO PLUGIN",
      items: [
        { id: nextId(), label: "Instalar plugin oficial do PSP na plataforma" },
        { id: nextId(), label: "Inserir credenciais de API no painel do plugin" },
        { id: nextId(), label: "Configurar modo sandbox para testes" },
        { id: nextId(), label: "Configurar webhook URL no painel do PSP" },
        { id: nextId(), label: "Testar checkout completo no modo sandbox" },
        { id: nextId(), label: "Verificar compatibilidade com tema atual" },
      ],
    });
  }

  // -- CARTAO --
  if (features.has("cartao")) {
    const cartao: ChecklistItem[] = [];
    if (integrationType === "api_direta") {
      cartao.push(
        { id: nextId(), label: "Integrar tokenizacao client-side (hosted fields ou iframe)" },
        { id: nextId(), label: "NUNCA trafegar PAN em texto plano no seu backend" },
      );
    }
    cartao.push(
      { id: nextId(), label: "Implementar captura automatica ou manual conforme modelo de negocio" },
      { id: nextId(), label: "Tratar response codes (approved, declined, pending, error)" },
      { id: nextId(), label: "Implementar estorno total e parcial" },
      { id: nextId(), label: "Configurar retry logic para soft declines" },
      { id: nextId(), label: "Mapear codigos de recusa para mensagens amigaveis ao usuario" },
    );
    sections.push({ title: "CARTAO DE CREDITO/DEBITO", items: cartao });
  }

  // -- 3DS --
  if (features.has("three_ds")) {
    sections.push({
      title: "3D SECURE",
      items: [
        { id: nextId(), label: "Integrar SDK 3DS2 do PSP" },
        { id: nextId(), label: "Coletar device data (browser info, IP, user agent)" },
        { id: nextId(), label: "Implementar redirect para challenge flow" },
        { id: nextId(), label: "Tratar fallback para 3DS1" },
        { id: nextId(), label: "Testar frictionless vs challenge flows" },
        { id: nextId(), label: "Configurar exemptions (low value, TRA, whitelist)" },
      ],
    });
  }

  // -- PIX --
  if (features.has("pix")) {
    sections.push({
      title: "PIX",
      items: [
        { id: nextId(), label: "Gerar QR code dinamico via API" },
        { id: nextId(), label: "Exibir QR code e codigo copia-e-cola no frontend" },
        { id: nextId(), label: "Implementar listener de webhook para confirmacao" },
        { id: nextId(), label: "Configurar expiracao do QR code (padrao: 30min)" },
        { id: nextId(), label: "Implementar devolucoes Pix (total e parcial)" },
        { id: nextId(), label: "Tratar conciliacao de pagamentos Pix" },
      ],
    });
  }

  // -- BOLETO --
  if (features.has("boleto")) {
    sections.push({
      title: "BOLETO BANCARIO",
      items: [
        { id: nextId(), label: "Gerar boleto com dados do pagador (CPF/CNPJ obrigatorio)" },
        { id: nextId(), label: "Configurar dias para vencimento" },
        { id: nextId(), label: "Exibir codigo de barras e linha digitavel" },
        { id: nextId(), label: "Implementar webhook para confirmacao de pagamento (D+1 a D+3)" },
        { id: nextId(), label: "Tratar boletos expirados (gerar novo ou estender)" },
        { id: nextId(), label: "Implementar desconto por pagamento antecipado (se aplicavel)" },
      ],
    });
  }

  // -- RECORRENCIA --
  if (features.has("recorrencia")) {
    sections.push({
      title: "RECORRENCIA / SUBSCRICOES",
      items: [
        { id: nextId(), label: "Criar plano/subscription no PSP com intervalo e valor" },
        { id: nextId(), label: "Armazenar token do cartao (nao PAN) para cobrancas futuras" },
        { id: nextId(), label: "Implementar webhook para cobrana bem-sucedida/falha" },
        { id: nextId(), label: "Configurar retry automatico para cobrancas falhas (dunning)" },
        { id: nextId(), label: "Implementar upgrade/downgrade de plano" },
        { id: nextId(), label: "Implementar cancelamento e pausa de subscription" },
        { id: nextId(), label: "Tratar atualizacao automatica de cartao (Account Updater)" },
      ],
    });
  }

  // -- SPLIT --
  if (features.has("split")) {
    sections.push({
      title: "SPLIT PAYMENTS",
      items: [
        { id: nextId(), label: "Cadastrar sellers/recipients no PSP" },
        { id: nextId(), label: "Definir regras de split (percentual ou valor fixo)" },
        { id: nextId(), label: "Implementar criacao de pagamento com split rules" },
        { id: nextId(), label: "Configurar MDR por recipient (se diferenciado)" },
        { id: nextId(), label: "Tratar estornos com split (devolucao proporcional)" },
        { id: nextId(), label: "Verificar liquidacao independente por recipient" },
        { id: nextId(), label: "Implementar KYC/compliance dos sellers" },
      ],
    });
  }

  // -- TESTES (always) --
  const testes: ChecklistItem[] = [
    { id: nextId(), label: "Testar com cartoes de teste do PSP (todos os cenarios)" },
    { id: nextId(), label: "Testar todos os cenarios de erro (recusa, timeout, indisponibilidade)" },
    { id: nextId(), label: "Testar webhooks com retry e verificar idempotencia" },
    { id: nextId(), label: "Testar idempotencia (enviar mesma request 2x)" },
  ];
  if (features.has("pix")) {
    testes.push({ id: nextId(), label: "Testar geracao e pagamento de QR code Pix" });
  }
  if (features.has("three_ds")) {
    testes.push({ id: nextId(), label: "Testar fluxo 3DS completo (frictionless + challenge)" });
  }
  testes.push(
    { id: nextId(), label: "Load test com volume esperado de transacoes" },
    { id: nextId(), label: "Testar em diferentes browsers/dispositivos" },
  );
  sections.push({ title: "TESTES", items: testes });

  // -- GO-LIVE (always) --
  sections.push({
    title: "GO-LIVE",
    items: [
      { id: nextId(), label: "Trocar credenciais de sandbox para producao" },
      { id: nextId(), label: "Configurar webhooks de producao" },
      { id: nextId(), label: "Ativar monitoramento de health check" },
      { id: nextId(), label: "Configurar alertas para falhas e taxas de erro" },
      { id: nextId(), label: "Documentar runbook para incidentes de pagamento" },
      { id: nextId(), label: "Verificar conformidade PCI DSS (SAQ ou AOC)" },
      { id: nextId(), label: "Realizar transacao real de teste em producao" },
    ],
  });

  return sections;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function IntegrationChecklistPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [integrationType, setIntegrationType] = useState<IntegrationType | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<Feature>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleFeature = (f: Feature) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  const checklist = useMemo(() => {
    if (!integrationType || selectedFeatures.size === 0) return [];
    return buildChecklist(integrationType, selectedFeatures);
  }, [integrationType, selectedFeatures]);

  const totalItems = useMemo(() => checklist.reduce((sum, s) => sum + s.items.length, 0), [checklist]);
  const completedItems = useMemo(
    () => checklist.reduce((sum, s) => sum + s.items.filter((i) => checkedItems.has(i.id)).length, 0),
    [checklist, checkedItems],
  );
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const toggleItem = useCallback((id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleExportText = useCallback(() => {
    let text = "CHECKLIST DE INTEGRACAO DE PAGAMENTOS\n";
    text += "======================================\n\n";
    text += `Tipo: ${integrationType ? INTEGRATION_LABELS[integrationType] : ""}\n`;
    text += `Features: ${Array.from(selectedFeatures).map((f) => FEATURE_LABELS[f]).join(", ")}\n`;
    text += `Progresso: ${completedItems}/${totalItems} (${Math.round(progress)}%)\n\n`;

    for (const section of checklist) {
      text += `--- ${section.title} ---\n`;
      for (const item of section.items) {
        text += `${checkedItems.has(item.id) ? "[x]" : "[ ]"} ${item.label}\n`;
      }
      text += "\n";
    }

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "checklist-integracao-pagamentos.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [checklist, checkedItems, integrationType, selectedFeatures, completedItems, totalItems, progress]);

  // Styles
  const cardStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 20,
  };

  const optionBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "14px 20px",
    borderRadius: 10,
    border: active ? "2px solid var(--primary)" : "1px solid var(--border)",
    background: active ? "var(--primary-bg)" : "var(--surface)",
    color: active ? "var(--primary)" : "var(--foreground)",
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all 0.15s",
    textAlign: "left" as const,
    width: "100%",
  });

  const primaryBtnStyle = (disabled: boolean): React.CSSProperties => ({
    padding: "10px 24px",
    borderRadius: 8,
    border: "none",
    background: disabled ? "var(--surface-hover)" : "var(--primary)",
    color: disabled ? "var(--text-muted)" : "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <div
      style={{
        maxWidth: 900,
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
          Checklist de Integracao
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)", marginBottom: 8 }}>
          Checklist de Integracao
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 700 }}>
          Gere um checklist personalizado para sua integracao de pagamentos.
          Escolha o tipo de integracao e as features que precisa implementar.
        </p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: s <= step ? "var(--primary)" : "var(--border)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      {/* STEP 1: Integration type */}
      {step === 1 && (
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 6 }}>
            Passo 1: Tipo de Integracao
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
            Escolha como voce vai se conectar ao PSP
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {(Object.keys(INTEGRATION_LABELS) as IntegrationType[]).map((type) => {
              const descriptions: Record<IntegrationType, string> = {
                api_direta: "Integracao completa via REST API. Maximo controle e customizacao.",
                hosted_checkout: "Pagina de checkout hospedada pelo PSP. Menor escopo PCI.",
                sdk_mobile: "SDK nativo para iOS/Android. Experiencia otimizada para mobile.",
                plugin: "Plugin pre-construido para Shopify, WooCommerce, etc.",
              };
              return (
                <button
                  key={type}
                  onClick={() => setIntegrationType(type)}
                  style={optionBtnStyle(integrationType === type)}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{INTEGRATION_LABELS[type]}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{descriptions[type]}</div>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button
              onClick={() => integrationType && setStep(2)}
              disabled={!integrationType}
              style={primaryBtnStyle(!integrationType)}
            >
              Proximo
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Features */}
      {step === 2 && (
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", marginBottom: 6 }}>
            Passo 2: Features
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
            Selecione os metodos de pagamento e funcionalidades que voce precisa
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {(Object.keys(FEATURE_LABELS) as Feature[]).map((feat) => {
              const icons: Record<Feature, string> = {
                cartao: "\u{1F4B3}",
                pix: "\u{26A1}",
                boleto: "\u{1F4C4}",
                recorrencia: "\u{1F504}",
                split: "\u{2702}\u{FE0F}",
                three_ds: "\u{1F6E1}\u{FE0F}",
              };
              return (
                <button
                  key={feat}
                  onClick={() => toggleFeature(feat)}
                  style={optionBtnStyle(selectedFeatures.has(feat))}
                >
                  <span style={{ marginRight: 8 }}>{icons[feat]}</span>
                  {FEATURE_LABELS[feat]}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button
              onClick={() => setStep(1)}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--foreground)",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Voltar
            </button>
            <button
              onClick={() => {
                if (selectedFeatures.size > 0) {
                  setCheckedItems(new Set());
                  setStep(3);
                }
              }}
              disabled={selectedFeatures.size === 0}
              style={primaryBtnStyle(selectedFeatures.size === 0)}
            >
              Gerar Checklist
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Checklist */}
      {step === 3 && (
        <>
          {/* Progress bar */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>
                  {completedItems}/{totalItems} itens completos
                </span>
                <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 8 }}>
                  ({Math.round(progress)}%)
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    setStep(2);
                  }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Editar selecao
                </button>
                <button
                  onClick={handleExportText}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--primary)",
                    background: "var(--primary-bg)",
                    color: "var(--primary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Exportar como TXT
                </button>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: 8,
                borderRadius: 4,
                background: "var(--surface-hover)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  borderRadius: 4,
                  background: progress === 100 ? "var(--success)" : "var(--primary)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            {progress === 100 && (
              <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "var(--success)" }}>
                {"\u{1F389}"} Parabens! Checklist completo. Voce esta pronto para go-live!
              </div>
            )}
          </div>

          {/* Config summary */}
          <div
            style={{
              ...cardStyle,
              marginBottom: 20,
              background: "var(--primary-bg)",
              borderColor: "var(--primary)",
              borderStyle: "dashed",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", marginBottom: 6 }}>
              Configuracao selecionada
            </div>
            <div style={{ fontSize: 13, color: "var(--foreground)" }}>
              <strong>{integrationType ? INTEGRATION_LABELS[integrationType] : ""}</strong> com{" "}
              {Array.from(selectedFeatures)
                .map((f) => FEATURE_LABELS[f])
                .join(", ")}
            </div>
          </div>

          {/* Sections */}
          {checklist.map((section) => {
            const sectionCompleted = section.items.filter((i) => checkedItems.has(i.id)).length;
            const sectionTotal = section.items.length;
            const allDone = sectionCompleted === sectionTotal;

            return (
              <div key={section.title} style={{ ...cardStyle, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                    {allDone ? "\u2705" : "\u{1F4CB}"} {section.title}
                  </h3>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: allDone ? "var(--success)" : "var(--text-muted)",
                    }}
                  >
                    {sectionCompleted}/{sectionTotal}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {section.items.map((item) => {
                    const checked = checkedItems.has(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: checked ? "rgba(16,185,129,0.04)" : "var(--surface)",
                          cursor: "pointer",
                          textAlign: "left",
                          width: "100%",
                          transition: "all 0.15s",
                        }}
                      >
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            border: checked ? "none" : "2px solid var(--border)",
                            background: checked ? "var(--success)" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: 12,
                            color: "#fff",
                            marginTop: 1,
                          }}
                        >
                          {checked ? "\u2713" : ""}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            color: checked ? "var(--text-muted)" : "var(--foreground)",
                            textDecoration: checked ? "line-through" : "none",
                            lineHeight: 1.5,
                          }}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div style={{ height: 40 }} />
        </>
      )}
    </div>
  );
}
