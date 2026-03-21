"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/**
 * Mapa de Pagamentos — Mapa visual interativo em camadas da arquitetura de pagamentos.
 *
 * Clique em uma camada para expandir e ver detalhes. Features são clicáveis.
 * Inclui modo de visualização de fluxo animado, busca por features e stats.
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
  { layer: "experience", label: "Cliente inicia pagamento", delay: 0 },
  { layer: "orchestration", label: "Roteamento seleciona adquirente", delay: 1 },
  { layer: "processing", label: "Autorização processada", delay: 2 },
  { layer: "network", label: "Rede valida transação", delay: 3 },
  { layer: "banking", label: "Emissor aprova", delay: 4 },
  { layer: "settlement", label: "Fundos liquidados", delay: 5 },
];

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
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());
  const [showFlow, setShowFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(-1);
  const [flowComplete, setFlowComplete] = useState(false);
  const [search, setSearch] = useState("");

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
    });
    return ids;
  }, [searchQuery]);

  const toggleLayer = (id: string) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedLayers(new Set(paymentLayers.map(l => l.id)));
  const collapseAll = () => setExpandedLayers(new Set());

  const startFlowAnimation = () => {
    setShowFlow(true);
    setExpandedLayers(new Set());
    setFlowStep(0);
    setFlowComplete(false);

    const stepDelay = 1200;
    for (let i = 1; i <= FLOW_STEPS.length; i++) {
      setTimeout(() => {
        if (i < FLOW_STEPS.length) {
          setFlowStep(i);
          const el = document.getElementById(`layer-${FLOW_STEPS[i].layer}`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
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

    setTimeout(() => {
      const el = document.getElementById(`layer-${FLOW_STEPS[0].layer}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header animate-fade-in" style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 8 }}>🗺️ Mapa de Pagamentos</h1>
        <p className="page-description">
          Uma visão interativa em camadas da stack moderna de pagamentos. Clique em
          uma camada para explorar suas features e conexões.
        </p>
      </div>

      {/* Stats overview */}
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

      {/* Controls bar */}
      <div className="animate-fade-in stagger-2" style={{ marginBottom: 20 }}>
        <div className="flex items-center" style={{ gap: 10, marginBottom: 12 }}>
          {/* Flow animation button */}
          <button
            onClick={startFlowAnimation}
            disabled={showFlow}
            className="interactive-hover"
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: showFlow ? "not-allowed" : "pointer",
              opacity: showFlow ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            {showFlow ? "Animando fluxo..." : "▶ Ver fluxo completo"}
          </button>

          {/* Expand / Collapse */}
          {!showFlow && (
            <div className="flex items-center" style={{ gap: 6 }}>
              <button
                onClick={expandAll}
                className="interactive-hover"
                style={{ fontSize: 11, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)" }}
              >
                Expandir Tudo
              </button>
              <button
                onClick={collapseAll}
                className="interactive-hover"
                style={{ fontSize: 11, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)" }}
              >
                Recolher
              </button>
            </div>
          )}

          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>
            Clique em uma camada para expandir
          </span>
        </div>

        {/* Search */}
        {!showFlow && (
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--text-muted)" }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar features, camadas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 38px",
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                fontSize: 13,
                outline: "none",
                color: "var(--foreground)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--text-muted)",
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Flow progress bar */}
        {showFlow && (
          <div
            className="animate-fade-in"
            style={{
              padding: 16,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <div className="flex items-center" style={{ gap: 4, marginBottom: 10 }}>
              {FLOW_STEPS.map((step, i) => {
                const isActive = flowStep === i;
                const isCompleted = flowStep > i || flowComplete;
                return (
                  <div key={step.layer} className="flex items-center" style={{ flex: 1 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, flexShrink: 0,
                      transition: "all 0.5s",
                      background: isCompleted ? "#10b981" : isActive ? "var(--primary-light)" : "var(--surface-hover)",
                      color: isCompleted || isActive ? "#fff" : "var(--text-muted)",
                      transform: isActive ? "scale(1.15)" : isCompleted ? "scale(1)" : "scale(0.9)",
                      boxShadow: isActive ? "0 0 12px rgba(37,99,235,0.3)" : "none",
                    }}>
                      {isCompleted ? "✓" : i + 1}
                    </div>
                    {i < FLOW_STEPS.length - 1 && (
                      <div style={{
                        flex: 1, height: 3, margin: "0 4px",
                        borderRadius: 999, overflow: "hidden",
                        background: "var(--surface-hover)",
                      }}>
                        <div style={{
                          height: "100%", borderRadius: 999,
                          transition: "all 0.7s ease-out",
                          width: flowStep > i || flowComplete ? "100%" : flowStep === i ? "50%" : "0%",
                          background: flowStep > i || flowComplete ? "#10b981" : "var(--primary-light)",
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center" }}>
              {flowComplete ? (
                <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>
                  ✅ Fluxo completo — transação processada com sucesso
                </span>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 500 }}>
                  <span style={{ color: "var(--primary-light)", fontWeight: 600 }}>Etapa {flowStep + 1}/{FLOW_STEPS.length}:</span>{" "}
                  {FLOW_STEPS[flowStep]?.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Layer legend (inline color dots) */}
      <div className="flex items-center animate-fade-in stagger-2" style={{ gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
        {paymentLayers.map(l => {
          const lm = LAYER_META[l.id];
          return (
            <div key={l.id} className="flex items-center" style={{ gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: lm.color }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{l.name}</span>
            </div>
          );
        })}
      </div>

      {/* Layer stack */}
      <div className="animate-fade-in stagger-3" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {paymentLayers.map((layer, index) => {
          const lm = LAYER_META[layer.id];
          const isExpanded = expandedLayers.has(layer.id);
          const flowIndex = FLOW_STEPS.findIndex(s => s.layer === layer.id);
          const isFlowActive = showFlow && flowStep === flowIndex && !flowComplete;
          const isFlowCompleted = showFlow && (flowComplete || flowIndex < flowStep);
          const isFlowUpcoming = showFlow && flowIndex > flowStep && !flowComplete;

          // Search dimming
          const isSearching = searchMatchLayerIds !== null;
          const isSearchMatch = !searchMatchLayerIds || searchMatchLayerIds.has(layer.id);

          return (
            <div key={layer.id} style={{ opacity: isSearching && !isSearchMatch ? 0.3 : isFlowUpcoming ? 0.5 : 1, transition: "all 0.3s" }}>
              {/* Connector arrow during flow */}
              {showFlow && index > 0 && (
                <div className="flex justify-center" style={{ padding: "4px 0", position: "relative", zIndex: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: flowIndex <= flowStep || flowComplete ? 1 : flowIndex === flowStep + 1 ? 0.6 : 0.2, transition: "all 0.5s" }}>
                    <div style={{ width: 2, height: 12, borderRadius: 999, background: flowIndex <= flowStep || flowComplete ? "#10b981" : "var(--border)", transition: "all 0.5s" }} />
                    <div style={{ fontSize: 10, color: flowIndex <= flowStep || flowComplete ? "#10b981" : "var(--border)", transition: "all 0.5s" }}>▼</div>
                  </div>
                </div>
              )}

              {/* Normal gap when not animating */}
              {!showFlow && index > 0 && <div style={{ height: 12 }} />}

              <div
                id={`layer-${layer.id}`}
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: isFlowActive
                    ? `2px solid ${lm.color}`
                    : isFlowCompleted
                    ? "2px solid #10b98166"
                    : `1px solid var(--border)`,
                  boxShadow: isFlowActive ? `0 4px 20px ${lm.color}33` : "none",
                  transform: isFlowActive ? "scale(1.01)" : isFlowUpcoming ? "scale(0.98)" : "scale(1)",
                  transition: "all 0.5s ease-out",
                }}
              >
                {/* Layer header */}
                <button
                  onClick={() => { if (!showFlow) toggleLayer(layer.id); }}
                  className="w-full text-left"
                  style={{
                    padding: "16px 20px",
                    background: lm.gradient,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: showFlow ? "default" : "pointer",
                    border: "none",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Flow status or layer number */}
                  {showFlow ? (
                    isFlowCompleted ? (
                      <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>✓</span>
                    ) : isFlowActive ? (
                      <span style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", animation: "pulse 1.5s infinite" }} />
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>C{index + 1}</span>
                    )
                  ) : (
                    <span style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: "rgba(255,255,255,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, flexShrink: 0,
                    }}>
                      {lm.icon}
                    </span>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{layer.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{layer.features.length} features · {layer.examples.length} exemplos</div>
                  </div>

                  {isFlowActive && (
                    <span style={{
                      fontSize: 12, fontWeight: 500, color: "#fff",
                      background: "rgba(255,255,255,0.15)",
                      padding: "4px 12px", borderRadius: 999,
                    }}>
                      ← {FLOW_STEPS[flowStep]?.label}
                    </span>
                  )}

                  {!showFlow && (
                    <span style={{
                      fontSize: 16, color: "rgba(255,255,255,0.6)",
                      transition: "transform 0.2s",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}>▾</span>
                  )}
                </button>

                {/* Layer body — always visible summary */}
                <div style={{ padding: "16px 20px", background: "var(--surface)" }}>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.5 }}>
                    {layer.description}
                  </p>

                  {/* Features grid */}
                  <div style={{ marginBottom: 12 }}>
                    <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 8 }}>
                      Features Principais
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 8 }}>
                      {layer.features.map((feature) => {
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
                              alignItems: "center",
                              gap: 8,
                              fontSize: 13,
                              padding: "10px 14px",
                              borderRadius: 10,
                              background: "var(--surface)",
                              border: "1px solid var(--border)",
                              color: "var(--foreground)",
                              textDecoration: "none",
                              transition: "all 0.2s",
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: lm.color, flexShrink: 0 }} />
                            <span style={{ flex: 1 }}>{searchQuery ? highlightText(feature.name, searchQuery) : feature.name}</span>
                            <span style={{ fontSize: 12, color: "var(--text-muted)", opacity: 0.4 }}>→</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expandable content — CSS Grid trick */}
                  <div style={{
                    display: "grid",
                    gridTemplateRows: isExpanded ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.3s ease",
                  }}>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
                        {/* Related flows */}
                        <div>
                          <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 8 }}>
                            Fluxos que usam esta camada
                          </h3>
                          <div className="flex" style={{ flexWrap: "wrap", gap: 8 }}>
                            {layer.relatedFlows.map(flow => (
                              <Link
                                key={flow.name}
                                href={flow.href}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "6px 14px",
                                  borderRadius: 8,
                                  border: `1px solid ${lm.color}44`,
                                  color: lm.color,
                                  fontSize: 13,
                                  fontWeight: 500,
                                  textDecoration: "none",
                                  background: lm.bg,
                                  transition: "all 0.2s",
                                }}
                                className="interactive-hover"
                              >
                                🔄 {flow.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Examples */}
                        <div>
                          <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 8 }}>
                            Exemplos de produtos
                          </h3>
                          <div className="flex" style={{ flexWrap: "wrap", gap: 6 }}>
                            {layer.examples.map(ex => (
                              <span
                                key={ex}
                                style={{
                                  fontSize: 12,
                                  padding: "4px 10px",
                                  borderRadius: 999,
                                  border: "1px solid var(--border)",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Quick links */}
                        <div className="flex items-center" style={{ gap: 16, paddingTop: 4 }}>
                          <Link
                            href="/knowledge/dependency-graph"
                            style={{ fontSize: 13, color: lm.color, fontWeight: 500, textDecoration: "none" }}
                            className="interactive-hover"
                          >
                            🔗 Ver dependências
                          </Link>
                          <Link
                            href="/simulation/payment-simulator"
                            style={{ fontSize: 13, color: lm.color, fontWeight: 500, textDecoration: "none" }}
                            className="interactive-hover"
                          >
                            🧪 Simular features
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact examples when collapsed */}
                  {!isExpanded && (
                    <div>
                      <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 6 }}>
                        Exemplos
                      </h3>
                      <div className="flex" style={{ flexWrap: "wrap", gap: 6 }}>
                        {layer.examples.map(ex => (
                          <span key={ex} style={{ fontSize: 12, padding: "3px 8px", borderRadius: 999, border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to read legend */}
      <div className="card-flat animate-fade-in stagger-4" style={{ padding: 20, marginTop: 24, marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>📖 Como ler este mapa</h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
          Cada camada se apoia na camada abaixo dela. Uma única transação de
          pagamento flui do topo (Experiência) passando por todas as camadas até
          que os fundos sejam liquidados na base. Clique em uma camada para ver
          fluxos relacionados e links de navegação, ou use o botão &ldquo;Ver fluxo
          completo&rdquo; para visualizar uma transação passando por todas as camadas.
        </p>
      </div>

      {/* Footer */}
      <div className="divider-text animate-fade-in stagger-5" style={{ marginBottom: 16 }}>Páginas Relacionadas</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 animate-fade-in stagger-5" style={{ gap: 12, marginBottom: 32 }}>
        {[
          { label: "Trilhos de Pagamento", desc: "Compare os principais trilhos e suas características", href: "/explore/payment-rails", icon: "🛤️" },
          { label: "Fluxos de Transação", desc: "Visualize fluxos completos de ponta a ponta", href: "/explore/transaction-flows", icon: "🔄" },
          { label: "Simulador", desc: "Simule o impacto de features na performance", href: "/simulation/payment-simulator", icon: "⚡" },
        ].map(p => (
          <Link key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <span style={{ fontSize: 24 }}>{p.icon}</span>
            <div>
              <div className="text-sm font-semibold">{p.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
