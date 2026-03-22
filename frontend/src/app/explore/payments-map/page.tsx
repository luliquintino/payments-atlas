"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import { getFeatureById } from "@/data/features";

/**
 * Mapa de Pagamentos — Mapa visual interativo em camadas da arquitetura de pagamentos.
 *
 * Redesigned: clear layer overview, readable feature cards with descriptions,
 * vertical transaction flow, and improved search/filter UX.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PaymentLayer {
  id: string;
  name: string;
  description: string;
  features: { name: string; featureId?: string }[];
  examples: string[];
  relatedFlows: { name: string; href: string }[];
}

// ---------------------------------------------------------------------------
// Design tokens (inline-friendly)
// ---------------------------------------------------------------------------

const LAYER_META: Record<string, { color: string; bg: string; border: string; gradient: string; icon: string }> = {
  experience:    { color: "#3b82f6", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.25)",  gradient: "linear-gradient(135deg, #1e40af, #3b82f6)", icon: "🎨" },
  orchestration: { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)", gradient: "linear-gradient(135deg, #5b21b6, #8b5cf6)", icon: "🔀" },
  processing:    { color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", gradient: "linear-gradient(135deg, #047857, #10b981)", icon: "⚙️" },
  network:       { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", gradient: "linear-gradient(135deg, #b45309, #f59e0b)", icon: "🌐" },
  banking:       { color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.25)",  gradient: "linear-gradient(135deg, #b91c1c, #ef4444)", icon: "🏦" },
  settlement:    { color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.25)", gradient: "linear-gradient(135deg, #4338ca, #6366f1)", icon: "💰" },
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const paymentLayers: PaymentLayer[] = [
  {
    id: "experience",
    name: "Experiência",
    description: "A camada voltada ao usuário onde os clientes interagem com fluxos de pagamento — interfaces de checkout, páginas hospedadas, SDKs e carteiras digitais.",
    features: [
      { name: "Interface de Checkout", featureId: "checkout-ui" },
      { name: "Seleção de Método de Pagamento", featureId: "payment-method-selection" },
      { name: "3D Secure", featureId: "3d-secure" },
      { name: "Webhooks & Notificações", featureId: "webhooks" },
      { name: "SDKs Mobile (iOS / Android)", featureId: "mobile-sdks" },
      { name: "Idempotency Keys", featureId: "idempotency" },
    ],
    examples: ["Stripe Elements", "Adyen Drop-in", "Braintree SDK"],
    relatedFlows: [
      { name: "Pagamento com Cartão", href: "/explore/transaction-flows" },
      { name: "Carteira Digital", href: "/explore/transaction-flows" },
    ],
  },
  {
    id: "orchestration",
    name: "Orquestração",
    description: "Roteamento, lógica de retry e decisões inteligentes que determinam como uma transação é processada entre múltiplos provedores.",
    features: [
      { name: "Smart Routing", featureId: "smart-routing" },
      { name: "Retry Logic", featureId: "retry-logic" },
      { name: "Cascading (Failover)", featureId: "cascading" },
      { name: "Recurring Billing", featureId: "recurring-billing" },
      { name: "Split Payments", featureId: "split-payments" },
      { name: "Testes A/B de Rotas", featureId: "ab-testing-routes" },
    ],
    examples: ["Spreedly", "Primer", "Pagos"],
    relatedFlows: [
      { name: "Cross-Border", href: "/explore/transaction-flows" },
      { name: "Marketplace", href: "/explore/transaction-flows" },
    ],
  },
  {
    id: "processing",
    name: "Processamento",
    description: "Operações centrais de autorização, captura, estorno e cancelamento executadas por processadores de pagamento e gateways.",
    features: [
      { name: "Fraud Scoring", featureId: "fraud-scoring" },
      { name: "BIN Lookup", featureId: "bin-lookup" },
      { name: "PCI Vault (Tokenização)", featureId: "pci-vault" },
      { name: "Velocity Checks", featureId: "velocity-checks" },
      { name: "Partial Capture", featureId: "partial-capture" },
      { name: "Currency Conversion (DCC)", featureId: "currency-conversion" },
    ],
    examples: ["Adyen", "Worldpay", "Checkout.com"],
    relatedFlows: [
      { name: "Pagamento com Cartão", href: "/explore/transaction-flows" },
    ],
  },
  {
    id: "network",
    name: "Rede / Bandeira",
    description: "Redes de cartão, esquemas de pagamento instantâneo e protocolos de mensageria que roteiam transações entre instituições.",
    features: [
      { name: "Network Tokenization", featureId: "network-tokenization" },
      { name: "Account Updater", featureId: "account-updater" },
      { name: "Token Lifecycle Management", featureId: "network-tokens-lifecycle" },
      { name: "Mensageria ISO 8583", featureId: "iso-8583" },
      { name: "Qualificação de Interchange", featureId: "interchange-qualification" },
      { name: "Regras e Compliance da Bandeira", featureId: "network-compliance" },
    ],
    examples: ["Visa", "Mastercard", "PIX", "SEPA"],
    relatedFlows: [
      { name: "Pagamento PIX", href: "/explore/transaction-flows" },
    ],
  },
  {
    id: "banking",
    name: "Bancário",
    description: "Bancos adquirentes e emissores que mantêm contas de lojistas e portadores de cartão, subscrevem risco e gerenciam ledgers.",
    features: [
      { name: "Real-Time Authorization", featureId: "real-time-auth" },
      { name: "KYC / Verificação de Identidade", featureId: "kyc-verification" },
      { name: "Gestão de Conta do Lojista", featureId: "merchant-account" },
      { name: "Autorização do Emissor", featureId: "issuer-authorization" },
      { name: "Ledger e Reconciliação", featureId: "ledger-reconciliation" },
      { name: "Conversão Cambial (FX)", featureId: "fx-conversion" },
    ],
    examples: ["JPMorgan", "Citi", "Itaú", "HSBC"],
    relatedFlows: [
      { name: "ACH", href: "/explore/transaction-flows" },
    ],
  },
  {
    id: "settlement",
    name: "Liquidação",
    description: "O movimento final de fundos entre instituições — clearing, liquidação líquida e repasse ao lojista.",
    features: [
      { name: "Chargeback Management", featureId: "chargeback-management" },
      { name: "Settlement Reconciliation", featureId: "settlement-reconciliation" },
      { name: "Interchange Optimization", featureId: "interchange-optimization" },
      { name: "Clearing e Compensação", featureId: "clearing-compensation" },
      { name: "Ciclos de Liquidação T+1 / T+2", featureId: "settlement-cycles" },
      { name: "Reserva e Retenção", featureId: "reserve-retention" },
    ],
    examples: ["ACH", "SWIFT", "RTGS", "Liquidação VisaNet"],
    relatedFlows: [
      { name: "Desembolsos", href: "/explore/transaction-flows" },
    ],
  },
];

const FLOW_STEPS = [
  { layer: "experience", label: "Cliente inicia pagamento", description: "O portador insere dados de pagamento no checkout do merchant. A interface captura número do cartão, validade e CVV (ou seleciona carteira digital)." },
  { layer: "orchestration", label: "Roteamento seleciona adquirente", description: "A camada de orquestração avalia regras de roteamento, seleciona o melhor adquirente com base em custo, taxa de aprovação e disponibilidade." },
  { layer: "processing", label: "Autorização processada", description: "O processador tokeniza dados sensíveis, executa verificações antifraude e envia a mensagem de autorização ao adquirente." },
  { layer: "network", label: "Rede valida transação", description: "A bandeira (Visa, Mastercard, etc.) roteia a mensagem ISO 8583 do adquirente até o banco emissor do cartão." },
  { layer: "banking", label: "Emissor aprova", description: "O banco emissor verifica saldo/crédito disponível, aplica regras de risco e retorna aprovação ou recusa ao adquirente." },
  { layer: "settlement", label: "Fundos liquidados", description: "Ao final do ciclo (T+1 ou T+2), os fundos são compensados entre instituições e repassados ao lojista." },
];

const LAYER_SHORT_DESC: Record<string, string> = {
  experience: "Onde o cliente interage com o checkout e insere dados de pagamento",
  orchestration: "Decide qual provedor processar a transação com base em regras inteligentes",
  processing: "Executa autorização, captura, tokenização e verificações de fraude",
  network: "Roteia mensagens entre adquirente e emissor via bandeiras de cartão",
  banking: "Bancos que aprovam transações, gerenciam contas e subscrevem risco",
  settlement: "Movimentação final de fundos, clearing e repasse ao lojista",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(99,102,241,0.25)", color: "inherit", borderRadius: 2, padding: "0 2px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PaymentsMapPage() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [showFlow, setShowFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(-1);
  const [flowComplete, setFlowComplete] = useState(false);
  const [search, setSearch] = useState("");
  const quiz = getQuizForPage("/explore/payments-map");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Stats
  const totalFeatures = paymentLayers.reduce((a, l) => a + l.features.length, 0);
  const totalExamples = paymentLayers.reduce((a, l) => a + l.examples.length, 0);

  // Search filtering
  const searchQuery = search.toLowerCase().trim();
  const searchMatchLayerIds = useMemo(() => {
    if (!searchQuery) return null;
    const ids = new Set<string>();
    paymentLayers.forEach(l => {
      if (l.name.toLowerCase().includes(searchQuery) || l.description.toLowerCase().includes(searchQuery)) {
        ids.add(l.id);
      }
      l.features.forEach(f => {
        if (f.name.toLowerCase().includes(searchQuery)) ids.add(l.id);
      });
      l.examples.forEach(ex => {
        if (ex.toLowerCase().includes(searchQuery)) ids.add(l.id);
      });
    });
    return ids;
  }, [searchQuery]);

  // Filtered layers
  const visibleLayers = useMemo(() => {
    if (!activeLayer && !searchMatchLayerIds) return paymentLayers;
    return paymentLayers.filter(l => {
      if (activeLayer && l.id !== activeLayer) return false;
      if (searchMatchLayerIds && !searchMatchLayerIds.has(l.id)) return false;
      return true;
    });
  }, [activeLayer, searchMatchLayerIds]);

  const visibleFeatureCount = visibleLayers.reduce((a, l) => a + l.features.length, 0);

  const startFlowAnimation = () => {
    setShowFlow(true);
    setActiveLayer(null);
    setSearch("");
    setFlowStep(0);
    setFlowComplete(false);

    const stepDelay = 1200;
    for (let i = 1; i <= FLOW_STEPS.length; i++) {
      setTimeout(() => {
        if (i < FLOW_STEPS.length) {
          setFlowStep(i);
        } else {
          setFlowComplete(true);
          setTimeout(() => {
            setShowFlow(false);
            setFlowStep(-1);
            setFlowComplete(false);
          }, 2500);
        }
      }, i * stepDelay);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>

      {/* ── Section 1: Header + Learning Objectives ── */}
      <div className="page-header animate-fade-in" style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 8 }}>Mapa de Pagamentos</h1>
        <p className="page-description">
          Uma visão interativa em camadas da stack moderna de pagamentos. Explore
          cada camada, entenda suas features e veja como uma transação flui do
          checkout até a liquidação.
        </p>
      </div>

      <div className="learning-objectives" style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Como o stack de pagamentos e organizado em 6 camadas</li>
          <li>O papel de cada camada no processamento de uma transacao</li>
          <li>Como as camadas se conectam entre si num fluxo real</li>
        </ul>
      </div>

      {/* ── Section 2: Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 animate-fade-in stagger-1" style={{ gap: 12, marginBottom: 24 }}>
        {[
          { label: "Camadas", value: "6", icon: "📐", color: "#8b5cf6" },
          { label: "Features", value: String(totalFeatures), icon: "🧩", color: "#3b82f6" },
          { label: "Exemplos", value: String(totalExamples), icon: "🏢", color: "#10b981" },
          { label: "Etapas do Fluxo", value: "6", icon: "🔄", color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{s.icon} {s.label}</div>
            <div className="metric-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Section: Como ler este mapa (moved up as callout) ── */}
      <div
        className="animate-fade-in stagger-2"
        style={{
          padding: 20,
          marginBottom: 28,
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <span style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "rgba(99,102,241,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          📖
        </span>
        <div>
          <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, color: "var(--foreground)" }}>Como ler este mapa</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Cada camada se apoia na camada abaixo dela. Uma transacao de pagamento flui
            do topo (Experiencia) passando por todas as camadas ate que os fundos sejam
            liquidados na base. Explore cada camada para ver suas features, exemplos de
            produtos e fluxos relacionados.
          </p>
        </div>
      </div>

      {/* ── Section 3: Entenda as 6 Camadas (overview grid) ── */}
      <div className="animate-fade-in stagger-2" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--foreground)" }}>
          Entenda as 6 Camadas
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3" style={{ gap: 12 }}>
          {paymentLayers.map((layer, i) => {
            const lm = LAYER_META[layer.id];
            return (
              <button
                key={layer.id}
                onClick={() => {
                  const el = document.getElementById(`layer-detail-${layer.id}`);
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: `1px solid ${lm.border}`,
                  background: "var(--surface)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
                className="interactive-hover"
              >
                <span style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: lm.bg,
                  border: `1px solid ${lm.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  {lm.icon}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: "var(--foreground)",
                    marginBottom: 2,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: lm.color,
                      background: lm.bg, padding: "1px 6px", borderRadius: 4,
                    }}>
                      {i + 1}
                    </span>
                    {layer.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {LAYER_SHORT_DESC[layer.id]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section 4: Search + Filters ── */}
      <div className="animate-fade-in stagger-3" style={{ marginBottom: 24 }}>
        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          <span style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            fontSize: 16, color: "var(--text-muted)", pointerEvents: "none",
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar features, camadas ou exemplos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 44px 14px 44px",
              borderRadius: 14,
              border: "2px solid var(--border)",
              background: "var(--surface)",
              fontSize: 15,
              outline: "none",
              color: "var(--foreground)",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 16, color: "var(--text-muted)",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Layer filter pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
          <button
            onClick={() => setActiveLayer(null)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: !activeLayer ? "2px solid var(--primary)" : "1px solid var(--border)",
              background: !activeLayer ? "rgba(99,102,241,0.1)" : "var(--surface)",
              color: !activeLayer ? "var(--primary)" : "var(--text-secondary)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Todas
          </button>
          {paymentLayers.map(l => {
            const lm = LAYER_META[l.id];
            const isActive = activeLayer === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setActiveLayer(isActive ? null : l.id)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: isActive ? `2px solid ${lm.color}` : "1px solid var(--border)",
                  background: isActive ? lm.bg : "var(--surface)",
                  color: isActive ? lm.color : "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: lm.color, flexShrink: 0,
                }} />
                {l.name}
              </button>
            );
          })}
        </div>

        {/* Count indicator */}
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Mostrando <strong style={{ color: "var(--foreground)" }}>{visibleFeatureCount}</strong> features
          em <strong style={{ color: "var(--foreground)" }}>{visibleLayers.length}</strong> camada{visibleLayers.length !== 1 ? "s" : ""}
          {searchQuery && (
            <span> para &ldquo;<strong style={{ color: "var(--primary)" }}>{search}</strong>&rdquo;</span>
          )}
        </div>
      </div>

      {/* ── Section 5: Camadas Detalhadas (main content) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
        {visibleLayers.map((layer, idx) => {
          const lm = LAYER_META[layer.id];
          const layerIndex = paymentLayers.findIndex(l => l.id === layer.id);

          return (
            <div
              key={layer.id}
              id={`layer-detail-${layer.id}`}
              className="animate-fade-in"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                transition: "all 0.3s",
              }}
            >
              {/* Colored top border */}
              <div style={{ height: 4, background: lm.gradient }} />

              {/* Layer header */}
              <div style={{
                padding: "20px 24px 16px 24px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}>
                <span style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: lm.bg, border: `1px solid ${lm.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>
                  {lm.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    marginBottom: 6,
                  }}>
                    <h2 style={{
                      fontSize: 18, fontWeight: 700, color: "var(--foreground)",
                      textTransform: "uppercase", letterSpacing: "0.02em",
                    }}>
                      {searchQuery ? highlightText(layer.name, searchQuery) : layer.name}
                    </h2>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: lm.color, background: lm.bg,
                      padding: "2px 10px", borderRadius: 999,
                      border: `1px solid ${lm.border}`,
                      whiteSpace: "nowrap",
                    }}>
                      Camada {layerIndex + 1}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6,
                  }}>
                    {searchQuery ? highlightText(layer.description, searchQuery) : layer.description}
                  </p>
                </div>
              </div>

              {/* Features section */}
              <div style={{ padding: "0 24px 20px 24px" }}>
                <h3 style={{
                  fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.06em", color: "var(--text-secondary)",
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--border)",
                }}>
                  Features desta camada
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {layer.features.map((feature) => {
                    const featureData = feature.featureId ? getFeatureById(feature.featureId) : null;
                    const href = feature.featureId
                      ? `/knowledge/features/${feature.featureId}`
                      : `/knowledge/features`;
                    return (
                      <Link
                        key={feature.name}
                        href={href}
                        className="interactive-hover"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          padding: "12px 16px",
                          borderRadius: 12,
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          textDecoration: "none",
                          transition: "all 0.2s",
                        }}
                      >
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: lm.color, flexShrink: 0,
                          marginTop: 5,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 14, fontWeight: 600, color: "var(--foreground)",
                            marginBottom: featureData?.description ? 3 : 0,
                          }}>
                            {searchQuery ? highlightText(feature.name, searchQuery) : feature.name}
                          </div>
                          {featureData?.description && (
                            <div style={{
                              fontSize: 12, color: "var(--text-secondary)",
                              lineHeight: 1.5,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical" as const,
                              overflow: "hidden",
                            }}>
                              {featureData.description}
                            </div>
                          )}
                        </div>
                        <span style={{
                          fontSize: 12, color: lm.color, fontWeight: 500,
                          whiteSpace: "nowrap", flexShrink: 0,
                          marginTop: 2,
                        }}>
                          Ver detalhes →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Examples + Related Flows */}
              <div style={{
                padding: "16px 24px 20px 24px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}>
                {/* Examples */}
                <div>
                  <h3 style={{
                    fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.06em", color: "var(--text-secondary)",
                    marginBottom: 10,
                  }}>
                    Exemplos no mercado
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {layer.examples.map(ex => (
                      <span
                        key={ex}
                        style={{
                          fontSize: 13,
                          padding: "6px 14px",
                          borderRadius: 999,
                          background: lm.bg,
                          border: `1px solid ${lm.border}`,
                          color: lm.color,
                          fontWeight: 500,
                        }}
                      >
                        {searchQuery ? highlightText(ex, searchQuery) : ex}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related Flows */}
                <div>
                  <h3 style={{
                    fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.06em", color: "var(--text-secondary)",
                    marginBottom: 10,
                  }}>
                    Fluxos relacionados
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {layer.relatedFlows.map(flow => (
                      <Link
                        key={flow.name}
                        href={flow.href}
                        className="interactive-hover"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 16px",
                          borderRadius: 10,
                          border: "1px solid var(--border)",
                          color: "var(--foreground)",
                          fontSize: 13,
                          fontWeight: 500,
                          textDecoration: "none",
                          background: "var(--background)",
                          transition: "all 0.2s",
                        }}
                      >
                        🔄 {flow.name}
                        <span style={{ color: lm.color, fontSize: 12 }}>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {visibleLayers.length === 0 && (
          <div style={{
            padding: 40,
            textAlign: "center",
            color: "var(--text-secondary)",
            fontSize: 14,
          }}>
            Nenhuma camada encontrada para &ldquo;{search}&rdquo;.
            <button
              onClick={() => { setSearch(""); setActiveLayer(null); }}
              style={{
                background: "none", border: "none", color: "var(--primary)",
                cursor: "pointer", fontWeight: 600, marginLeft: 4,
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* ── Section 6: Fluxo de uma Transacao (vertical stepped) ── */}
      <div className="animate-fade-in" style={{ marginBottom: 40 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--foreground)" }}>
            Fluxo de uma Transacao
          </h2>
          <button
            onClick={startFlowAnimation}
            disabled={showFlow}
            className="interactive-hover"
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, var(--primary), var(--primary-light, #6366f1))",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: showFlow ? "not-allowed" : "pointer",
              opacity: showFlow ? 0.6 : 1,
              transition: "all 0.2s",
            }}
          >
            {showFlow ? "Animando..." : "▶ Animar fluxo"}
          </button>
        </div>

        {/* Flow progress bar (during animation) */}
        {showFlow && (
          <div
            className="animate-fade-in"
            style={{
              padding: 16,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
              {FLOW_STEPS.map((step, i) => {
                const isActive = flowStep === i;
                const isCompleted = flowStep > i || flowComplete;
                const lm = LAYER_META[step.layer];
                return (
                  <div key={step.layer} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, flexShrink: 0,
                      transition: "all 0.5s",
                      background: isCompleted ? "#10b981" : isActive ? lm.color : "var(--surface-hover, var(--border))",
                      color: isCompleted || isActive ? "#fff" : "var(--text-muted, var(--text-secondary))",
                      transform: isActive ? "scale(1.15)" : "scale(1)",
                      boxShadow: isActive ? `0 0 12px ${lm.color}55` : "none",
                    }}>
                      {isCompleted ? "✓" : i + 1}
                    </div>
                    {i < FLOW_STEPS.length - 1 && (
                      <div style={{
                        flex: 1, height: 3, margin: "0 4px",
                        borderRadius: 999, overflow: "hidden",
                        background: "var(--border)",
                      }}>
                        <div style={{
                          height: "100%", borderRadius: 999,
                          transition: "all 0.7s ease-out",
                          width: flowStep > i || flowComplete ? "100%" : flowStep === i ? "50%" : "0%",
                          background: flowStep > i || flowComplete ? "#10b981" : lm.color,
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center" }}>
              {flowComplete ? (
                <span style={{ fontSize: 14, fontWeight: 600, color: "#10b981" }}>
                  Transacao processada com sucesso!
                </span>
              ) : (
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  <span style={{ color: LAYER_META[FLOW_STEPS[flowStep]?.layer]?.color || "var(--primary)", fontWeight: 600 }}>
                    Etapa {flowStep + 1}/{FLOW_STEPS.length}:
                  </span>{" "}
                  {FLOW_STEPS[flowStep]?.label}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Vertical stepped flow */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {FLOW_STEPS.map((step, i) => {
            const lm = LAYER_META[step.layer];
            const isActive = showFlow && flowStep === i;
            const isCompleted = showFlow && (flowStep > i || flowComplete);
            const isUpcoming = showFlow && flowStep < i && !flowComplete;

            return (
              <div key={step.layer}>
                <div style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  opacity: isUpcoming ? 0.4 : 1,
                  transition: "all 0.5s",
                }}>
                  {/* Step indicator column */}
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    flexShrink: 0, width: 40,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 700,
                      background: isCompleted ? "#10b981" : isActive ? lm.color : lm.bg,
                      color: isCompleted || isActive ? "#fff" : lm.color,
                      border: `2px solid ${isCompleted ? "#10b981" : lm.color}`,
                      transition: "all 0.5s",
                      transform: isActive ? "scale(1.1)" : "scale(1)",
                      boxShadow: isActive ? `0 0 16px ${lm.color}44` : "none",
                    }}>
                      {isCompleted ? "✓" : i + 1}
                    </div>
                    {/* Connector line */}
                    {i < FLOW_STEPS.length - 1 && (
                      <div style={{
                        width: 2, height: 16,
                        background: isCompleted ? "#10b981" : "var(--border)",
                        transition: "all 0.5s",
                      }} />
                    )}
                  </div>

                  {/* Step content */}
                  <div style={{
                    flex: 1,
                    paddingBottom: i < FLOW_STEPS.length - 1 ? 16 : 0,
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      marginBottom: 4,
                    }}>
                      <span style={{ fontSize: 16 }}>{lm.icon}</span>
                      <span style={{
                        fontSize: 15, fontWeight: 700, color: "var(--foreground)",
                      }}>
                        {step.label}
                      </span>
                      <span style={{
                        fontSize: 11, color: lm.color, fontWeight: 500,
                      }}>
                        {paymentLayers.find(l => l.id === step.layer)?.name}
                      </span>
                    </div>
                    <p style={{
                      fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6,
                    }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 8: Related Pages ── */}
      <div className="divider-text animate-fade-in stagger-5" style={{ marginBottom: 16 }}>Paginas Relacionadas</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 animate-fade-in stagger-5" style={{ gap: 12, marginBottom: 32 }}>
        {[
          { label: "Trilhos de Pagamento", desc: "Compare os principais trilhos e suas caracteristicas", href: "/explore/payment-rails", icon: "🛤️" },
          { label: "Fluxos de Transacao", desc: "Visualize fluxos completos de ponta a ponta", href: "/explore/transaction-flows", icon: "🔄" },
          { label: "Simulador", desc: "Simule o impacto de features na performance", href: "/simulation/payment-simulator", icon: "⚡" },
        ].map(p => (
          <Link key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <span style={{ fontSize: 24 }}>{p.icon}</span>
            <div>
              <div className="text-sm font-semibold">{p.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{p.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quiz */}
      {quiz && !quizCompleted && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "var(--foreground)" }}>
            Teste seu Conhecimento
          </h2>
          <PageQuiz
            questions={quiz.questions}
            onComplete={(correct, total, xpEarned) => {
              recordQuiz(quiz.pageRoute, correct, total, xpEarned);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
