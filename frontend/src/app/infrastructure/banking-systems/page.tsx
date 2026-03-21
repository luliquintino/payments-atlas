"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

/**
 * Sistemas Bancários — Redesign focado em leitura e navegação.
 *
 * 8 camadas colapsadas por padrão, tower overview, quick nav,
 * busca de componentes, intro tip, rich collapsed state.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BankingLayer {
  id: string;
  name: string;
  shortName: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  components: { name: string; description: string }[];
  examples: string[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const bankingLayers: BankingLayer[] = [
  {
    id: "consumer",
    name: "Consumidor",
    shortName: "Consumidor",
    description:
      "Portadores de cartão, correntistas e usuários finais que iniciam transações de pagamento através de interfaces digitais ou presenciais.",
    colorFrom: "#8b5cf6",
    colorTo: "#a78bfa",
    components: [
      { name: "Conta Corrente / Poupança", description: "Conta bancária onde o consumidor mantém seus fundos" },
      { name: "Cartão de Débito / Crédito", description: "Instrumento de pagamento vinculado à conta ou linha de crédito" },
      { name: "Mobile / Internet Banking", description: "Interfaces digitais para operações financeiras" },
      { name: "Carteiras Digitais", description: "Apple Pay, Google Pay, Samsung Pay — tokenização em dispositivos" },
    ],
    examples: ["Pessoa Física", "MEI / Autônomo", "Pequena Empresa"],
  },
  {
    id: "merchant",
    name: "Lojista (Merchant)",
    shortName: "Lojista",
    description:
      "Empresas e prestadores de serviço que aceitam pagamentos e precisam de infraestrutura para processar, reconciliar e receber seus fundos.",
    colorFrom: "#6366f1",
    colorTo: "#818cf8",
    components: [
      { name: "POS / Terminal de Pagamento", description: "Dispositivo físico que captura dados do cartão" },
      { name: "E-commerce Checkout", description: "Interface de pagamento online integrada ao site" },
      { name: "Sistema de Faturamento", description: "Geração e gestão de cobranças, boletos, invoices" },
      { name: "Reconciliação de Vendas", description: "Verificação de recebíveis vs. vendas realizadas" },
    ],
    examples: ["Varejo", "E-commerce", "Marketplace", "SaaS / Recorrência"],
  },
  {
    id: "psp-gateway",
    name: "PSP / Gateway",
    shortName: "PSP",
    description:
      "Payment Service Providers e gateways que agregam métodos de pagamento, roteiam transações e oferecem uma camada de abstração entre lojistas e adquirentes.",
    colorFrom: "#2563eb",
    colorTo: "#60a5fa",
    components: [
      { name: "Gateway de Pagamentos", description: "Roteamento de transações para adquirentes e processadores" },
      { name: "Tokenização & Vault", description: "Armazenamento seguro de dados de cartão (PCI DSS)" },
      { name: "Antifraude Integrado", description: "Scoring de risco e regras de bloqueio em tempo real" },
      { name: "Orquestração", description: "Smart routing, retry, cascading entre provedores" },
    ],
    examples: ["Stripe", "Adyen", "Braintree", "Checkout.com", "Pagar.me"],
  },
  {
    id: "acquirer",
    name: "Adquirente",
    shortName: "Adquirente",
    description:
      "Instituição que faz a ponte entre o lojista e as bandeiras de cartão. Captura, autoriza e liquida transações em nome do merchant.",
    colorFrom: "#0891b2",
    colorTo: "#22d3ee",
    components: [
      { name: "Captura de Transações", description: "Recepção e formatação de dados da transação" },
      { name: "Envio de Autorização", description: "Roteamento da mensagem ISO 8583 para a bandeira" },
      { name: "Gestão de Merchant", description: "Onboarding, KYC e gestão de contas de lojistas" },
      { name: "Liquidação ao Lojista", description: "Repasse de fundos após compensação (D+1, D+2, D+30)" },
    ],
    examples: ["Cielo", "Rede (Itaú)", "GetNet (Santander)", "Stone", "Worldpay"],
  },
  {
    id: "card-network",
    name: "Bandeira / Rede de Cartão",
    shortName: "Bandeira",
    description:
      "Esquemas de pagamento que definem regras, roteiam mensagens de autorização entre adquirentes e emissores, e garantem interoperabilidade global.",
    colorFrom: "#059669",
    colorTo: "#34d399",
    components: [
      { name: "Autorização & Roteamento", description: "Encaminha pedidos de autorização ao banco emissor" },
      { name: "Compensação (Clearing)", description: "Calcula posições líquidas entre participantes" },
      { name: "Regras & Compliance", description: "Define padrões (PCI, EMV, 3DS) e arbitragem de disputas" },
      { name: "Network Tokenization", description: "Tokens de rede para segurança e atualização automática" },
    ],
    examples: ["Visa", "Mastercard", "Elo", "American Express", "UnionPay"],
  },
  {
    id: "issuer",
    name: "Banco Emissor",
    shortName: "Emissor",
    description:
      "Instituição que emite cartões e mantém a conta do portador. Aprova ou recusa transações em tempo real com base em saldo, limite e regras de risco.",
    colorFrom: "#d97706",
    colorTo: "#fbbf24",
    components: [
      { name: "Motor de Autorização", description: "Decisão em tempo real sobre aprovar/recusar cada transação" },
      { name: "Gestão de Limites", description: "Controle de crédito, limites de transação e utilização" },
      { name: "Detecção de Fraude", description: "Modelos de ML e regras para identificar transações suspeitas" },
      { name: "Emissão de Cartões", description: "Produção, ativação e lifecycle de cartões físicos e virtuais" },
    ],
    examples: ["Itaú", "Bradesco", "Nubank", "JPMorgan Chase", "HSBC"],
  },
  {
    id: "settlement",
    name: "Sistemas de Liquidação",
    shortName: "Liquidação",
    description:
      "Infraestrutura que realiza a transferência final de fundos entre instituições — clearing houses, sistemas RTGS e câmaras de compensação.",
    colorFrom: "#dc2626",
    colorTo: "#f87171",
    components: [
      { name: "RTGS (Real-Time Gross Settlement)", description: "Liquidação bruta em tempo real para alto valor" },
      { name: "DNS (Deferred Net Settlement)", description: "Compensação multilateral com liquidação diferida" },
      { name: "Câmaras de Compensação", description: "Instituições que calculam posições líquidas entre participantes" },
      { name: "Mensageria (SWIFT)", description: "Rede global de comunicação entre instituições financeiras" },
    ],
    examples: ["Fedwire", "TARGET2", "CHIPS", "SWIFT", "SPI/PIX"],
  },
  {
    id: "central-bank",
    name: "Banco Central",
    shortName: "BC",
    description:
      "Autoridade monetária que opera sistemas de liquidação, regula instituições financeiras, define política monetária e atua como emprestador de última instância.",
    colorFrom: "#be185d",
    colorTo: "#f472b6",
    components: [
      { name: "Política Monetária", description: "Definição de taxas de juros e compulsórios" },
      { name: "Supervisão Bancária", description: "Regulação prudencial e supervisão de instituições" },
      { name: "Operação de Sistemas de Pagamento", description: "Gestão de RTGS e sistemas de pagamento instantâneo" },
      { name: "CBDC (Moeda Digital)", description: "Pesquisa e implementação de moedas digitais de banco central" },
    ],
    examples: ["Banco Central do Brasil", "Federal Reserve", "BCE", "Bank of England"],
  },
];

const FLOW_STEPS = [
  { layer: "consumer", label: "Consumidor inicia pagamento" },
  { layer: "merchant", label: "Lojista envia ao gateway" },
  { layer: "psp-gateway", label: "PSP roteia para adquirente" },
  { layer: "acquirer", label: "Adquirente envia autorização" },
  { layer: "card-network", label: "Bandeira roteia ao emissor" },
  { layer: "issuer", label: "Emissor aprova transação" },
  { layer: "settlement", label: "Clearing e liquidação" },
  { layer: "central-bank", label: "Banco central liquida posições" },
];

const RELATED_PAGES = [
  { name: "Sistemas de Liquidação", href: "/infrastructure/settlement-systems", desc: "Como os fundos se movem", icon: "settlement" },
  { name: "Mapa de Pagamentos", href: "/explore/payments-map", desc: "Arquitetura em camadas", icon: "map" },
  { name: "Trilhos de Pagamento", href: "/explore/payment-rails", desc: "Infra de cada rede", icon: "rails" },
];

// ---------------------------------------------------------------------------
// Helper: truncate text
// ---------------------------------------------------------------------------
function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BankingSystemsPage() {
  const quiz = getQuizForPage("/infrastructure/banking-systems");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  // All layers COLLAPSED by default
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(() => new Set());
  const [showFlow, setShowFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(-1);
  const [flowComplete, setFlowComplete] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle individual layer
  const toggleLayer = useCallback((id: string) => {
    if (showFlow) return;
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, [showFlow]);

  // Quick Nav: expand + scroll
  const jumpToLayer = useCallback((id: string) => {
    if (showFlow) return;
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      document.getElementById(`layer-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, [showFlow]);

  // Stats
  const stats = useMemo(() => {
    const totalComponents = bankingLayers.reduce((sum, l) => sum + l.components.length, 0);
    const totalEntities = bankingLayers.reduce((sum, l) => sum + l.examples.length, 0);
    return { layers: bankingLayers.length, components: totalComponents, entities: totalEntities, flowSteps: FLOW_STEPS.length };
  }, []);

  // Search logic
  const { matchingLayerIds, highlightedComponents } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { matchingLayerIds: null, highlightedComponents: new Map<string, Set<string>>() };

    const ids = new Set<string>();
    const highlights = new Map<string, Set<string>>();

    bankingLayers.forEach((layer) => {
      const layerMatch = layer.name.toLowerCase().includes(q) || layer.description.toLowerCase().includes(q);
      const matchingComps = new Set<string>();

      layer.components.forEach((c) => {
        if (c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
          matchingComps.add(c.name);
        }
      });

      const exampleMatch = layer.examples.some((e) => e.toLowerCase().includes(q));

      if (layerMatch || matchingComps.size > 0 || exampleMatch) {
        ids.add(layer.id);
        if (matchingComps.size > 0) highlights.set(layer.id, matchingComps);
      }
    });

    return { matchingLayerIds: ids, highlightedComponents: highlights };
  }, [searchQuery]);

  // Auto-expand matching layers when searching
  useEffect(() => {
    if (matchingLayerIds && matchingLayerIds.size > 0) {
      setExpandedLayers(new Set(matchingLayerIds));
    }
  }, [matchingLayerIds]);

  // Flow animation
  const startFlowAnimation = () => {
    setShowFlow(true);
    setSearchQuery("");
    setExpandedLayers(new Set(bankingLayers.map((l) => l.id)));
    setFlowStep(0);
    setFlowComplete(false);

    const stepDelay = 1200;
    for (let i = 1; i <= FLOW_STEPS.length; i++) {
      setTimeout(() => {
        if (i < FLOW_STEPS.length) {
          setFlowStep(i);
          document.getElementById(`layer-${FLOW_STEPS[i].layer}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
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
      document.getElementById(`layer-${FLOW_STEPS[0].layer}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const getLayerByFlowIndex = (fi: number) => {
    const step = FLOW_STEPS[fi];
    return step ? bankingLayers.find((l) => l.id === step.layer) : undefined;
  };

  // Count search results
  const searchResultCount = useMemo(() => {
    if (!matchingLayerIds) return null;
    const totalComps = Array.from(highlightedComponents.values()).reduce((s, set) => s + set.size, 0);
    return { layers: matchingLayerIds.size, components: totalComps };
  }, [matchingLayerIds, highlightedComponents]);

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>

      {/* ================================================================= */}
      {/* 1. HEADER                                                         */}
      {/* ================================================================= */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Sistemas Bancários</h1>
        <p className="page-description">
          Mapa interativo da infraestrutura financeira — do consumidor ao banco central.
          Explore cada camada para entender os componentes, atores e exemplos reais.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>O que é um core banking system</li>
          <li>Como funciona o livro-razão (ledger) bancário</li>
          <li>Arquitetura de sistemas bancários modernos</li>
        </ul>
      </div>

      {/* ================================================================= */}
      {/* 2. STATS                                                          */}
      {/* ================================================================= */}
      <div
        className="animate-fade-in stagger-1"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}
      >
        {[
          { label: "Camadas", value: stats.layers, color: "#8b5cf6", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          )},
          { label: "Componentes", value: stats.components, color: "#059669", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
          )},
          { label: "Entidades", value: stats.entities, color: "#2563eb", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /><path d="M9 9h1" /><path d="M9 13h1" /><path d="M9 17h1" />
            </svg>
          )},
          { label: "Passos no Fluxo", value: stats.flowSteps, color: "#d97706", icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          )},
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ display: "flex", alignItems: "center", gap: "0.875rem", textAlign: "left" }}>
            <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "50%", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div className="metric-value" style={{ fontSize: "1.5rem", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)] animate-fade-in stagger-3" style={{ marginTop: "0.75rem", fontStyle: "italic" }}>
        * Esses numeros podem ter sofrido alteracao com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* ================================================================= */}
      {/* 3. INTRO TIP — Como ler este mapa                                 */}
      {/* ================================================================= */}
      {showTip ? (
        <div
          className="card-flat animate-fade-in stagger-2"
          style={{
            marginBottom: "1.5rem",
            borderLeft: "4px solid var(--primary-light)",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.25rem", flexShrink: 0, marginTop: "0.125rem" }}>💡</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.875rem", color: "var(--foreground)", fontWeight: 600, marginBottom: "0.25rem" }}>
              Como ler este mapa
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Cada camada representa um nível da infraestrutura financeira. Uma transação flui do consumidor no topo até o banco central na base.
              Clique em uma camada para explorar seus componentes, ou use o botão &ldquo;Ver fluxo completo&rdquo; para acompanhar uma transação passando por todas as camadas.
            </p>
          </div>
          <button
            onClick={() => setShowTip(false)}
            style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.125rem", lineHeight: 1, padding: "0.25rem" }}
            title="Fechar dica"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="animate-fade-in" style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => setShowTip(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary-light)", fontSize: "0.75rem", fontWeight: 500 }}
          >
            💡 Como ler este mapa?
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. VISUAL TOWER OVERVIEW                                          */}
      {/* ================================================================= */}
      <div
        className="card-flat animate-fade-in stagger-2"
        style={{ marginBottom: "1.5rem", padding: "1.25rem" }}
      >
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
          Arquitetura em Camadas — Clique para navegar
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {bankingLayers.map((layer, idx) => (
            <div key={layer.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <button
                onClick={() => jumpToLayer(layer.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 1rem",
                  background: `linear-gradient(135deg, ${layer.colorFrom}15, ${layer.colorTo}08)`,
                  border: `1px solid ${layer.colorFrom}25`,
                  borderLeft: `3px solid ${layer.colorFrom}`,
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${layer.colorFrom}25, ${layer.colorTo}15)`;
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${layer.colorFrom}15, ${layer.colorTo}08)`;
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateX(0)";
                }}
              >
                <span
                  style={{
                    width: "1.625rem",
                    height: "1.625rem",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${layer.colorFrom}, ${layer.colorTo})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "0.625rem",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  C{idx + 1}
                </span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground)", flex: 1 }}>
                  {layer.name}
                </span>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                  {layer.components.length} componentes
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.5 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              {/* Arrow connector between tower items */}
              {idx < bankingLayers.length - 1 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "0.25rem" }}>
                  <div style={{ width: "1px", height: "100%", background: "var(--border)" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 5. CONTROLS — Flow + Expand/Collapse + Search                     */}
      {/* ================================================================= */}
      <div className="animate-fade-in stagger-3" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={startFlowAnimation}
            disabled={showFlow}
            className="card-interactive"
            style={{
              padding: "0.625rem 1.25rem",
              background: showFlow ? "var(--surface-hover)" : "linear-gradient(135deg, var(--primary), var(--primary-light))",
              color: showFlow ? "var(--text-muted)" : "white",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: showFlow ? "not-allowed" : "pointer",
              opacity: showFlow ? 0.6 : 1,
            }}
          >
            {showFlow ? "Animando fluxo..." : "▶ Ver fluxo completo"}
          </button>

          {!showFlow && (
            <button
              onClick={() => {
                if (expandedLayers.size > 0) setExpandedLayers(new Set());
                else setExpandedLayers(new Set(bankingLayers.map((l) => l.id)));
              }}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              {expandedLayers.size > 0 ? "Recolher todas" : "Expandir todas"}
            </button>
          )}
        </div>

        {/* Search input */}
        {!showFlow && (
          <div style={{ position: "relative", marginBottom: "0.5rem" }}>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar componentes, exemplos, camadas..."
              style={{
                width: "100%",
                padding: "0.625rem 2.5rem 0.625rem 2.5rem",
                borderRadius: "0.625rem",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                fontSize: "0.8125rem",
                color: "var(--foreground)",
                outline: "none",
                transition: "border-color 200ms ease",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary-light)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontSize: "1rem",
                  lineHeight: 1,
                  padding: "0.25rem",
                }}
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Search results count */}
        {searchResultCount && (
          <div className="animate-fade-in" style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            {searchResultCount.layers === 0 ? (
              <span>Nenhum resultado para &ldquo;{searchQuery}&rdquo;</span>
            ) : (
              <span>
                {searchResultCount.layers} {searchResultCount.layers === 1 ? "camada" : "camadas"} encontrada{searchResultCount.layers !== 1 ? "s" : ""}
                {searchResultCount.components > 0 && ` · ${searchResultCount.components} componente${searchResultCount.components !== 1 ? "s" : ""}`}
              </span>
            )}
          </div>
        )}

        {/* Flow progress bar */}
        {showFlow && (
          <div
            className="animate-fade-in"
            style={{ borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--surface)", padding: "1rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.75rem" }}>
              {FLOW_STEPS.map((step, i) => {
                const isActive = flowStep === i;
                const isCompleted = flowStep > i || flowComplete;
                const layerData = getLayerByFlowIndex(i);
                const stepColor = layerData?.colorFrom ?? "var(--primary-light)";
                return (
                  <div key={step.layer} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <div
                      style={{
                        width: "1.625rem",
                        height: "1.625rem",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        flexShrink: 0,
                        transition: "all 500ms ease",
                        background: isCompleted ? "#10b981" : isActive ? stepColor : "var(--surface-hover)",
                        color: isCompleted || isActive ? "white" : "var(--text-muted)",
                        transform: isActive ? "scale(1.15)" : isCompleted ? "scale(1)" : "scale(0.9)",
                        boxShadow: isActive ? `0 0 12px ${stepColor}50` : "none",
                      }}
                    >
                      {isCompleted ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < FLOW_STEPS.length - 1 && (
                      <div style={{ flex: 1, height: "2px", margin: "0 0.25rem", borderRadius: "9999px", overflow: "hidden", background: "var(--surface-hover)" }}>
                        <div
                          style={{
                            height: "100%",
                            borderRadius: "9999px",
                            transition: "all 700ms ease-out",
                            width: flowStep > i || flowComplete ? "100%" : flowStep === i ? "50%" : "0%",
                            background: flowStep > i || flowComplete ? "#10b981" : stepColor,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center" }}>
              {flowComplete ? (
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#34d399" }}>
                  Fluxo completo — transação processada com sucesso
                </span>
              ) : (
                <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)" }}>
                  <span style={{ color: getLayerByFlowIndex(flowStep)?.colorFrom ?? "var(--primary-light)", fontWeight: 600 }}>
                    Etapa {flowStep + 1}/{FLOW_STEPS.length}:
                  </span>{" "}
                  {FLOW_STEPS[flowStep]?.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 6. QUICK NAV BAR                                                  */}
      {/* ================================================================= */}
      {!showFlow && (
        <div className="animate-fade-in stagger-3" style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1.25rem" }}>
          {bankingLayers.map((layer, idx) => {
            const isMatch = !matchingLayerIds || matchingLayerIds.has(layer.id);
            return (
              <button
                key={layer.id}
                onClick={() => jumpToLayer(layer.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.375rem 0.625rem",
                  borderRadius: "9999px",
                  border: `1px solid ${layer.colorFrom}30`,
                  background: expandedLayers.has(layer.id) ? `${layer.colorFrom}18` : "transparent",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                  opacity: isMatch ? 1 : 0.35,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: expandedLayers.has(layer.id) ? layer.colorFrom : "var(--text-muted)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${layer.colorFrom}18`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${layer.colorFrom}50`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = expandedLayers.has(layer.id) ? `${layer.colorFrom}18` : "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${layer.colorFrom}30`;
                }}
              >
                <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: layer.colorFrom, flexShrink: 0 }} />
                <span>C{idx + 1} {layer.shortName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ================================================================= */}
      {/* 7. LAYER STACK                                                    */}
      {/* ================================================================= */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {bankingLayers.map((layer, index) => {
          const isExpanded = expandedLayers.has(layer.id);
          const flowIndex = FLOW_STEPS.findIndex((s) => s.layer === layer.id);
          const isFlowActive = showFlow && flowStep === flowIndex && !flowComplete;
          const isFlowCompleted = showFlow && (flowComplete || flowIndex < flowStep);
          const isFlowUpcoming = showFlow && flowIndex > flowStep && !flowComplete;
          const isSearchDimmed = matchingLayerIds !== null && !matchingLayerIds.has(layer.id);
          const layerHighlights = highlightedComponents.get(layer.id);

          return (
            <div
              key={layer.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              {/* Connector arrow between layers */}
              {showFlow && index > 0 && (
                <div style={{ display: "flex", justifyContent: "center", padding: "0.25rem 0", position: "relative", zIndex: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "all 500ms ease",
                      opacity: flowIndex <= flowStep || flowComplete ? 1 : flowIndex === flowStep + 1 ? 0.6 : 0.2,
                    }}
                  >
                    <div style={{ width: "2px", height: "0.75rem", borderRadius: "9999px", transition: "background 500ms ease", background: flowIndex <= flowStep || flowComplete ? layer.colorFrom : "var(--border)" }} />
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ transition: "color 500ms ease", color: flowIndex <= flowStep || flowComplete ? layer.colorFrom : "var(--border)" }}>
                      <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
              {!showFlow && index > 0 && <div style={{ height: "0.5rem" }} />}

              {/* Layer card */}
              <div
                id={`layer-${layer.id}`}
                style={{
                  overflow: "hidden",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  boxShadow: isFlowActive ? `0 0 20px ${layer.colorFrom}30` : "var(--card-shadow)",
                  transition: "all 500ms ease-out",
                  opacity: isFlowUpcoming ? 0.5 : isSearchDimmed ? 0.35 : 1,
                  transform: isFlowUpcoming ? "scale(0.98)" : isFlowActive ? "scale(1.01)" : "scale(1)",
                  borderLeft: isFlowActive ? `4px solid ${layer.colorFrom}` : isFlowCompleted ? "4px solid #10b981" : undefined,
                }}
              >
                {/* Header — always visible, shows rich preview when collapsed */}
                <button
                  onClick={() => toggleLayer(layer.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.875rem 1.25rem",
                    background: `linear-gradient(135deg, ${layer.colorFrom}, ${layer.colorTo})`,
                    border: "none",
                    cursor: showFlow ? "default" : "pointer",
                    textAlign: "left",
                    transition: "filter 200ms ease",
                  }}
                  onMouseEnter={(e) => { if (!showFlow) (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)"; }}
                >
                  {/* Flow indicator or layer number */}
                  {showFlow ? (
                    isFlowCompleted ? (
                      <span style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                    ) : isFlowActive ? (
                      <span className="animate-pulse" style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", background: "white" }} />
                      </span>
                    ) : (
                      <span style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 700 }}>
                        C{index + 1}
                      </span>
                    )
                  ) : (
                    <span style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "white", fontSize: "0.75rem", fontWeight: 700 }}>
                      C{index + 1}
                    </span>
                  )}

                  {/* Name + tagline */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ color: "white", fontSize: "1rem", fontWeight: 700, lineHeight: 1.2 }}>{layer.name}</h2>
                    {!isExpanded && !showFlow && (
                      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", lineHeight: 1.4, marginTop: "0.125rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {truncate(layer.description, 80)}
                      </p>
                    )}
                  </div>

                  {/* Collapsed: example chips + component count */}
                  {!isExpanded && !showFlow && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.65)", padding: "0.1875rem 0.5rem", background: "rgba(255,255,255,0.12)", borderRadius: "9999px", whiteSpace: "nowrap" }}>
                        {layer.components.length} comp.
                      </span>
                      {layer.examples.slice(0, 2).map((ex) => (
                        <span key={ex} style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.7)", padding: "0.1875rem 0.5rem", background: "rgba(255,255,255,0.1)", borderRadius: "9999px", whiteSpace: "nowrap", display: "none" }}>
                          {ex}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Flow step label */}
                  {isFlowActive && (
                    <span className="animate-pulse" style={{ fontSize: "0.75rem", fontWeight: 500, color: "white", background: "rgba(255,255,255,0.15)", padding: "0.25rem 0.625rem", borderRadius: "9999px", whiteSpace: "nowrap" }}>
                      {FLOW_STEPS[flowStep]?.label}
                    </span>
                  )}

                  {/* Chevron */}
                  {!showFlow && (
                    <svg
                      width="18" height="18" viewBox="0 0 20 20" fill="none"
                      style={{ color: "rgba(255,255,255,0.7)", transition: "transform 300ms ease", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
                    >
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Expandable body — CSS Grid trick */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isExpanded ? "1fr" : "0fr",
                    transition: "grid-template-rows 300ms ease",
                  }}
                >
                  <div style={{ minHeight: 0, overflow: "hidden" }}>
                    <div style={{ padding: "1.5rem" }}>
                      {/* Description */}
                      <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.7, maxWidth: "48rem" }}>
                        {layer.description}
                      </p>

                      {/* Components section divider */}
                      <div className="divider-text" style={{ marginBottom: "0.875rem" }}>
                        Componentes Principais
                      </div>

                      {/* Components grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.625rem", marginBottom: "1.25rem" }}>
                        {layer.components.map((comp, ci) => {
                          const isHighlighted = layerHighlights?.has(comp.name);
                          return (
                            <div
                              key={comp.name}
                              style={{
                                padding: "0.875rem 1rem",
                                borderRadius: "0.5rem",
                                border: "1px solid var(--border)",
                                borderTop: `3px solid ${layer.colorFrom}`,
                                background: isHighlighted ? `${layer.colorFrom}08` : "var(--surface)",
                                transition: "all 200ms ease",
                                boxShadow: isHighlighted ? `0 0 8px ${layer.colorFrom}15` : "none",
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-hover)";
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                                (e.currentTarget as HTMLDivElement).style.borderTop = `3px solid ${layer.colorFrom}`;
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "start", gap: "0.625rem" }}>
                                <span
                                  style={{
                                    width: "1.375rem",
                                    height: "1.375rem",
                                    borderRadius: "0.375rem",
                                    background: `${layer.colorFrom}15`,
                                    color: layer.colorFrom,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.625rem",
                                    fontWeight: 800,
                                    flexShrink: 0,
                                    marginTop: "0.125rem",
                                  }}
                                >
                                  {String(ci + 1).padStart(2, "0")}
                                </span>
                                <div>
                                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--foreground)" }}>{comp.name}</span>
                                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", lineHeight: 1.5 }}>{comp.description}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Examples section divider */}
                      <div className="divider-text" style={{ marginBottom: "0.75rem" }}>
                        Exemplos
                      </div>

                      {/* Examples callout */}
                      <div
                        style={{
                          borderLeft: `3px solid ${layer.colorFrom}`,
                          background: `${layer.colorFrom}06`,
                          borderRadius: "0 0.5rem 0.5rem 0",
                          padding: "0.875rem 1rem",
                        }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                          {layer.examples.map((ex) => (
                            <span key={ex} className="chip-muted" style={{ fontSize: "0.8125rem" }}>{ex}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* 8. FOOTER — Related Pages                                         */}
      {/* ================================================================= */}
      <div className="animate-fade-in stagger-4" style={{ marginTop: "2rem" }}>
        <div className="divider-text" style={{ marginBottom: "1rem" }}>
          Páginas Relacionadas
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
          {RELATED_PAGES.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="card-flat interactive-hover"
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", textDecoration: "none" }}
            >
              <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.5rem", background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--primary-light)" }}>
                {page.icon === "settlement" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                )}
                {page.icon === "map" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                )}
                {page.icon === "rails" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--foreground)" }}>{page.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{page.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
            🧠 Teste seu Conhecimento
          </h2>
          <PageQuiz
            questions={quiz.questions}
            xpPerQuestion={5}
            onComplete={(correct, total) => {
              recordQuiz(quiz.pageRoute, correct, total);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
