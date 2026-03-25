"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
type PSPType = "Adquirente" | "Sub-adquirente" | "Gateway global" | "Gateway LATAM" | "Wallet/Gateway";

type PaymentMethod = "cartao" | "pix" | "boleto" | "transferencia" | "wallet" | "bnpl" | "crypto";

type BusinessType = "e-commerce" | "saas" | "marketplace" | "varejo";
type VolumeRange = "<100K" | "100K-1M" | "1M-10M" | ">10M";
type Priority = "menor-custo" | "melhor-api" | "mais-features" | "faster-settlement";

interface FeatureRow {
  key: string;
  label: string;
}

interface PSP {
  name: string;
  tipo: PSPType;
  takeRate: string;
  settlement: string;
  featuresScore: number;
  apiScore: number;
  description: string;
  pros: string[];
  cons: string[];
  methods: PaymentMethod[];
  bestFor: string;
  differentiator: string;
  features: {
    pix: boolean;
    threeds: boolean;
    tokenization: boolean;
    recurring: boolean;
    split: boolean;
    webhooks: boolean;
    international: boolean;
    bnpl: boolean;
    antifraud: boolean;
    sdkMobile: boolean;
  };
  scoreExplanation: string;
  /* Weights for profile matching */
  costWeight: number;
  apiWeight: number;
  featuresWeight: number;
  settlementWeight: number;
  /* Affinity per business type (0-10) */
  affinityEcommerce: number;
  affinitySaas: number;
  affinityMarketplace: number;
  affinityVarejo: number;
  /* Volume tier affinity */
  volumeSmall: number;
  volumeMedium: number;
  volumeLarge: number;
  volumeEnterprise: number;
}

/* ------------------------------------------------------------------ */
/*  PSP Data                                                            */
/* ------------------------------------------------------------------ */
const PSPS: PSP[] = [
  {
    name: "Cielo",
    tipo: "Adquirente",
    takeRate: "2.5-4.5%",
    settlement: "D+1 a D+30",
    featuresScore: 7,
    apiScore: 6,
    description: "Maior adquirente do Brasil com ampla cobertura de maquininhas e e-commerce. Pertence ao Bradesco/BB com forte presenca no varejo fisico.",
    pros: ["Maior cobertura de POS no Brasil", "Integracao bancaria Bradesco/BB", "Suporte a split de pagamento"],
    cons: ["API legada e documentacao defasada", "Atendimento lento para PMEs", "Taxas pouco competitivas sem negociacao"],
    methods: ["cartao", "pix", "boleto", "transferencia"],
    bestFor: "Grandes varejistas com operacao fisica e online que ja possuem relacionamento com Bradesco/BB.",
    differentiator: "Maior rede de captura do Brasil com 1.4M+ de POS ativos.",
    features: { pix: true, threeds: true, tokenization: true, recurring: true, split: true, webhooks: true, international: false, bnpl: false, antifraud: true, sdkMobile: true },
    scoreExplanation: "Features 7/10: +1 PIX, +1 3DS, +1 tokenization, +1 recurring, +1 split, +1 webhooks, +1 antifraud, -1 sem internacional, -1 sem BNPL, -1 SDK limitado",
    costWeight: 5, apiWeight: 4, featuresWeight: 6, settlementWeight: 7,
    affinityEcommerce: 6, affinitySaas: 3, affinityMarketplace: 5, affinityVarejo: 9,
    volumeSmall: 4, volumeMedium: 7, volumeLarge: 9, volumeEnterprise: 8,
  },
  {
    name: "Rede",
    tipo: "Adquirente",
    takeRate: "2.3-4.2%",
    settlement: "D+1 a D+30",
    featuresScore: 7,
    apiScore: 5,
    description: "Adquirente do Itau Unibanco com forte presenca no varejo. Oferece taxas agressivas para correntistas Itau.",
    pros: ["Taxas competitivas para clientes Itau", "Boa cobertura presencial", "Antecipacao com taxas reduzidas"],
    cons: ["API menos moderna que concorrentes", "Documentacao tecnica insuficiente", "Split de pagamento limitado"],
    methods: ["cartao", "pix", "boleto"],
    bestFor: "Comerciantes correntistas Itau que buscam taxas reduzidas e integracao bancaria direta.",
    differentiator: "Integracao nativa com ecossistema Itau: conta, credito e conciliacao unificados.",
    features: { pix: true, threeds: true, tokenization: true, recurring: true, split: false, webhooks: true, international: false, bnpl: false, antifraud: true, sdkMobile: true },
    scoreExplanation: "Features 7/10: +1 PIX, +1 3DS, +1 tokenization, +1 recurring, +1 webhooks, +1 antifraud, +1 SDK mobile, -1 sem split, -1 sem internacional, -1 sem BNPL",
    costWeight: 7, apiWeight: 3, featuresWeight: 5, settlementWeight: 7,
    affinityEcommerce: 5, affinitySaas: 2, affinityMarketplace: 3, affinityVarejo: 9,
    volumeSmall: 5, volumeMedium: 7, volumeLarge: 8, volumeEnterprise: 7,
  },
  {
    name: "Stone",
    tipo: "Adquirente",
    takeRate: "2.0-3.8%",
    settlement: "D+1 a D+30",
    featuresScore: 8,
    apiScore: 8,
    description: "Adquirente com foco em tecnologia e atendimento humanizado para PMEs. API moderna e antecipacao automatica D+0.",
    pros: ["Atendimento humanizado com agente dedicado", "API moderna e bem documentada", "Antecipacao automatica D+0"],
    cons: ["PIX com custo (0.89%)", "Menos presenca em grandes enterprises", "Taxas de cartao podem ser altas sem negociacao"],
    methods: ["cartao", "pix", "boleto", "transferencia"],
    bestFor: "PMEs de e-commerce que valorizam atendimento proximo, boa API e antecipacao rapida.",
    differentiator: "Modelo de atendimento com agente comercial dedicado + antecipacao automatica D+0.",
    features: { pix: true, threeds: true, tokenization: true, recurring: true, split: true, webhooks: true, international: false, bnpl: false, antifraud: true, sdkMobile: true },
    scoreExplanation: "Features 8/10: +1 PIX, +1 3DS, +1 tokenization, +1 recurring, +1 split, +1 webhooks, +1 antifraud, +1 SDK mobile, -1 sem internacional, -1 sem BNPL",
    costWeight: 7, apiWeight: 7, featuresWeight: 7, settlementWeight: 9,
    affinityEcommerce: 8, affinitySaas: 5, affinityMarketplace: 7, affinityVarejo: 8,
    volumeSmall: 8, volumeMedium: 9, volumeLarge: 7, volumeEnterprise: 5,
  },
  {
    name: "PagSeguro",
    tipo: "Sub-adquirente",
    takeRate: "3.5-5.0%",
    settlement: "D+14",
    featuresScore: 6,
    apiScore: 6,
    description: "Sub-adquirente pioneiro no Brasil com setup instantaneo sem analise de credito. Foco em micro e pequenos empreendedores.",
    pros: ["Cadastro instantaneo sem analise", "Checkout pronto (redirect)", "Forte presenca em micro-negocios"],
    cons: ["Taxas elevadas vs adquirentes", "Settlement longo (D+14 padrao)", "Split limitado e API basica"],
    methods: ["cartao", "pix", "boleto", "wallet"],
    bestFor: "Microempreendedores e vendedores informais que precisam comecar a aceitar pagamentos imediatamente.",
    differentiator: "Setup em minutos sem CNPJ nem analise de credito.",
    features: { pix: true, threeds: false, tokenization: true, recurring: false, split: false, webhooks: true, international: false, bnpl: false, antifraud: true, sdkMobile: true },
    scoreExplanation: "Features 6/10: +1 PIX, +1 tokenization, +1 webhooks, +1 antifraud, +1 SDK mobile, +1 wallet, -1 sem 3DS, -1 sem recurring, -1 sem split, -1 sem internacional",
    costWeight: 3, apiWeight: 5, featuresWeight: 4, settlementWeight: 2,
    affinityEcommerce: 5, affinitySaas: 2, affinityMarketplace: 3, affinityVarejo: 7,
    volumeSmall: 9, volumeMedium: 5, volumeLarge: 2, volumeEnterprise: 1,
  },
  {
    name: "Adyen",
    tipo: "Gateway global",
    takeRate: "1.5-3.0%+\u20AC0.10",
    settlement: "T+3",
    featuresScore: 10,
    apiScore: 10,
    description: "Plataforma global de pagamentos end-to-end para enterprise. Unica plataforma que unifica online, in-store e mobile globalmente.",
    pros: ["Plataforma unificada global (30+ paises)", "Modelo IC++ transparente", "Revenue optimization com ML nativo"],
    cons: ["Volume minimo alto para onboarding", "Complexidade de setup inicial", "Suporte limitado para micro-negocios"],
    methods: ["cartao", "pix", "boleto", "wallet", "bnpl", "transferencia"],
    bestFor: "Enterprises com operacao multi-pais, volume >R$10M/mes e necessidade de otimizacao avancada.",
    differentiator: "Unica plataforma que processa adquirencia propria em 30+ paises com modelo IC++.",
    features: { pix: true, threeds: true, tokenization: true, recurring: true, split: true, webhooks: true, international: true, bnpl: true, antifraud: true, sdkMobile: true },
    scoreExplanation: "Features 10/10: +1 PIX, +1 3DS, +1 tokenization, +1 recurring, +1 split, +1 webhooks, +1 internacional, +1 BNPL, +1 antifraud, +1 SDK mobile",
    costWeight: 8, apiWeight: 10, featuresWeight: 10, settlementWeight: 6,
    affinityEcommerce: 9, affinitySaas: 7, affinityMarketplace: 8, affinityVarejo: 6,
    volumeSmall: 1, volumeMedium: 4, volumeLarge: 9, volumeEnterprise: 10,
  },
  {
    name: "Stripe",
    tipo: "Gateway global",
    takeRate: "3.99%+R$0.39",
    settlement: "T+2",
    featuresScore: 9,
    apiScore: 10,
    description: "Referencia global em developer experience para pagamentos online. API extremamente bem documentada e ecossistema de ferramentas developer-first.",
    pros: ["Melhor documentacao e DX do mercado", "Ecossistema completo (Billing, Connect, Radar)", "Suporte nativo a SaaS e marketplaces"],
    cons: ["Taxas fixas altas para Brasil", "Sem adquirencia local (usa parceiros)", "Suporte em portugues limitado"],
    methods: ["cartao", "pix", "boleto", "wallet", "bnpl"],
    bestFor: "Startups, SaaS e tech companies que priorizam developer experience e pagamentos internacionais.",
    differentiator: "Developer experience incomparavel: SDKs em 15+ linguagens, sandbox completo, docs exemplares.",
    features: { pix: true, threeds: true, tokenization: true, recurring: true, split: true, webhooks: true, international: true, bnpl: true, antifraud: true, sdkMobile: true },
    scoreExplanation: "Features 9/10: +1 PIX, +1 3DS, +1 tokenization, +1 recurring, +1 split, +1 webhooks, +1 internacional, +1 BNPL, +1 antifraud, -1 sem adquirencia local",
    costWeight: 4, apiWeight: 10, featuresWeight: 9, settlementWeight: 7,
    affinityEcommerce: 8, affinitySaas: 10, affinityMarketplace: 9, affinityVarejo: 3,
    volumeSmall: 7, volumeMedium: 8, volumeLarge: 8, volumeEnterprise: 7,
  },
  {
    name: "Mercado Pago",
    tipo: "Sub-adquirente",
    takeRate: "3.5-5.0%",
    settlement: "D+14",
    featuresScore: 7,
    apiScore: 7,
    description: "Fintech do Mercado Livre com checkout transparente e wallet propria. Forte em e-commerce e integracao nativa com MELI.",
    pros: ["Checkout transparente facil de integrar", "Wallet com 40M+ usuarios ativos", "Integracao nativa com Mercado Livre"],
    cons: ["Settlement longo padrao (D+14)", "Taxas elevadas sem negociacao", "Dependencia do ecossistema MELI"],
    methods: ["cartao", "pix", "boleto", "wallet", "transferencia"],
    bestFor: "Sellers do Mercado Livre e e-commerces de medio porte que querem checkout transparente rapido.",
    differentiator: "Wallet com 40M+ usuarios e integracao nativa com o maior marketplace LATAM.",
    features: { pix: true, threeds: true, tokenization: true, recurring: true, split: true, webhooks: true, international: false, bnpl: false, antifraud: true, sdkMobile: true },
    scoreExplanation: "Features 7/10: +1 PIX, +1 3DS, +1 tokenization, +1 recurring, +1 split, +1 webhooks, +1 antifraud, -1 sem internacional, -1 sem BNPL, -1 wallet fechada",
    costWeight: 4, apiWeight: 6, featuresWeight: 6, settlementWeight: 3,
    affinityEcommerce: 8, affinitySaas: 3, affinityMarketplace: 9, affinityVarejo: 6,
    volumeSmall: 8, volumeMedium: 7, volumeLarge: 5, volumeEnterprise: 3,
  },
  {
    name: "PayPal",
    tipo: "Wallet/Gateway",
    takeRate: "4.4-5.4%+R$0.60",
    settlement: "T+1",
    featuresScore: 7,
    apiScore: 7,
    description: "Maior wallet digital global com presenca em 200+ paises. Forte em cross-border e protecao ao comprador.",
    pros: ["Marca global reconhecida (425M+ contas)", "Excelente para cross-border commerce", "Protecao ao comprador aumenta conversao"],
    cons: ["Taxas muito altas para transacoes domesticas", "Disputa de chargeback favorece comprador", "Integracao Brasil limitada vs global"],
    methods: ["cartao", "wallet", "transferencia"],
    bestFor: "E-commerces com vendas internacionais e necessidade de checkout reconhecido globalmente.",
    differentiator: "Marca global que aumenta confianca: conversao +12% em checkouts cross-border.",
    features: { pix: false, threeds: true, tokenization: true, recurring: true, split: false, webhooks: true, international: true, bnpl: true, antifraud: true, sdkMobile: true },
    scoreExplanation: "Features 7/10: +1 3DS, +1 tokenization, +1 recurring, +1 webhooks, +1 internacional, +1 BNPL, +1 antifraud, -1 sem PIX, -1 sem split, -1 integracao BR limitada",
    costWeight: 2, apiWeight: 6, featuresWeight: 6, settlementWeight: 8,
    affinityEcommerce: 7, affinitySaas: 5, affinityMarketplace: 4, affinityVarejo: 2,
    volumeSmall: 5, volumeMedium: 6, volumeLarge: 6, volumeEnterprise: 5,
  },
  {
    name: "dLocal",
    tipo: "Gateway LATAM",
    takeRate: "2.0-4.0%",
    settlement: "T+7",
    featuresScore: 8,
    apiScore: 8,
    description: "Gateway especializado em mercados emergentes com foco em LATAM, Africa e Asia. Uma unica integracao para 40+ paises.",
    pros: ["Uma API para 40+ paises emergentes", "Metodos locais nativos por pais", "Settlement em USD/EUR para empresas globais"],
    cons: ["Menos features que gateways globais puros", "Sem presenca em mercados desenvolvidos", "Documentacao pode ser confusa para iniciantes"],
    methods: ["cartao", "pix", "boleto", "wallet", "transferencia"],
    bestFor: "Empresas globais que precisam aceitar pagamentos em LATAM/Africa/Asia com uma unica integracao.",
    differentiator: "Especialista em mercados emergentes: uma API unificada para metodos locais de 40+ paises.",
    features: { pix: true, threeds: true, tokenization: true, recurring: true, split: true, webhooks: true, international: true, bnpl: false, antifraud: true, sdkMobile: false },
    scoreExplanation: "Features 8/10: +1 PIX, +1 3DS, +1 tokenization, +1 recurring, +1 split, +1 webhooks, +1 internacional, +1 antifraud, -1 sem BNPL, -1 sem SDK mobile",
    costWeight: 7, apiWeight: 7, featuresWeight: 7, settlementWeight: 5,
    affinityEcommerce: 7, affinitySaas: 6, affinityMarketplace: 7, affinityVarejo: 3,
    volumeSmall: 2, volumeMedium: 5, volumeLarge: 8, volumeEnterprise: 9,
  },
  {
    name: "EBANX",
    tipo: "Gateway LATAM",
    takeRate: "2.5-4.5%",
    settlement: "T+5",
    featuresScore: 8,
    apiScore: 7,
    description: "Gateway brasileiro para empresas internacionais venderem na America Latina. Especializado em conectar merchants globais ao consumidor LATAM.",
    pros: ["Expertise profunda em LATAM", "Suporte a metodos locais de 15+ paises", "Checkout localizado aumenta conversao"],
    cons: ["Foco em merchants internacionais (menos vantagens para BR-BR)", "Settlement mais longo", "Taxas variam muito por pais"],
    methods: ["cartao", "pix", "boleto", "wallet", "transferencia"],
    bestFor: "Empresas internacionais que querem vender para consumidores brasileiros e latino-americanos.",
    differentiator: "Ponte entre merchants globais e consumidores LATAM com checkout 100% localizado.",
    features: { pix: true, threeds: true, tokenization: true, recurring: true, split: false, webhooks: true, international: true, bnpl: true, antifraud: true, sdkMobile: false },
    scoreExplanation: "Features 8/10: +1 PIX, +1 3DS, +1 tokenization, +1 recurring, +1 webhooks, +1 internacional, +1 BNPL, +1 antifraud, -1 sem split, -1 sem SDK mobile",
    costWeight: 6, apiWeight: 6, featuresWeight: 7, settlementWeight: 5,
    affinityEcommerce: 8, affinitySaas: 5, affinityMarketplace: 6, affinityVarejo: 2,
    volumeSmall: 2, volumeMedium: 5, volumeLarge: 8, volumeEnterprise: 9,
  },
];

const FEATURE_ROWS: FeatureRow[] = [
  { key: "pix", label: "PIX" },
  { key: "threeds", label: "3D Secure" },
  { key: "tokenization", label: "Tokenizacao" },
  { key: "recurring", label: "Recorrencia" },
  { key: "split", label: "Split de Pagamento" },
  { key: "webhooks", label: "Webhooks" },
  { key: "international", label: "Internacional" },
  { key: "bnpl", label: "BNPL (Parcelamento sem cartao)" },
  { key: "antifraud", label: "Antifraude" },
  { key: "sdkMobile", label: "SDK Mobile" },
];

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cartao: "Cartao",
  pix: "PIX",
  boleto: "Boleto",
  transferencia: "Transferencia",
  wallet: "Wallet",
  bnpl: "BNPL",
  crypto: "Crypto",
};

/* ------------------------------------------------------------------ */
/*  Score calculation                                                   */
/* ------------------------------------------------------------------ */
function computeScore(
  psp: PSP,
  businessType: BusinessType | "",
  volume: VolumeRange | "",
  priority: Priority | "",
): number {
  let score = 0;

  /* Business type affinity */
  if (businessType === "e-commerce") score += psp.affinityEcommerce;
  else if (businessType === "saas") score += psp.affinitySaas;
  else if (businessType === "marketplace") score += psp.affinityMarketplace;
  else if (businessType === "varejo") score += psp.affinityVarejo;
  else score += 5;

  /* Volume affinity */
  if (volume === "<100K") score += psp.volumeSmall;
  else if (volume === "100K-1M") score += psp.volumeMedium;
  else if (volume === "1M-10M") score += psp.volumeLarge;
  else if (volume === ">10M") score += psp.volumeEnterprise;
  else score += 5;

  /* Priority weighting */
  if (priority === "menor-custo") score += psp.costWeight;
  else if (priority === "melhor-api") score += psp.apiWeight;
  else if (priority === "mais-features") score += psp.featuresWeight;
  else if (priority === "faster-settlement") score += psp.settlementWeight;
  else score += 5;

  return score;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function PSPComparatorPage() {
  const { visitPage } = useGameProgress();
  useEffect(() => { visitPage("/tools/psp-comparator"); }, [visitPage]);

  const [businessType, setBusinessType] = useState<BusinessType | "">("");
  const [volume, setVolume] = useState<VolumeRange | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const scored = useMemo(() => {
    const withScores = PSPS.map((psp) => ({
      psp,
      score: computeScore(psp, businessType, volume, priority),
    }));
    withScores.sort((a, b) => b.score - a.score);
    return withScores;
  }, [businessType, volume, priority]);

  const topPSP = scored[0]?.psp.name ?? "";

  /* ---- style helpers ---- */
  const s = {
    card: (extra?: React.CSSProperties): React.CSSProperties => ({
      background: "var(--surface)",
      borderRadius: "14px",
      padding: "24px",
      border: "1px solid var(--border)",
      ...extra,
    }),
    badge: (bg: string, color: string): React.CSSProperties => ({
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "6px",
      fontSize: "0.75rem",
      fontWeight: 600,
      background: bg,
      color,
    }),
    select: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1px solid var(--border)",
      background: "var(--surface)",
      color: "var(--foreground)",
      fontSize: "0.88rem",
      fontWeight: 500 as const,
      cursor: "pointer",
      minWidth: "200px",
      appearance: "none" as const,
      WebkitAppearance: "none" as const,
    },
    th: (highlighted: boolean): React.CSSProperties => ({
      padding: "10px 12px",
      borderBottom: "2px solid var(--border)",
      color: highlighted ? "var(--primary)" : "var(--text-secondary)",
      fontWeight: 600,
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      textAlign: "center",
      whiteSpace: "nowrap",
      position: "sticky",
      top: 0,
      background: "var(--surface)",
      zIndex: 1,
    }),
    td: (highlighted: boolean): React.CSSProperties => ({
      padding: "10px 12px",
      color: "var(--foreground)",
      fontSize: "0.85rem",
      borderBottom: "1px solid var(--border)",
      textAlign: "center",
      background: highlighted ? "var(--primary-bg)" : "transparent",
    }),
  };

  const tipoColor = (tipo: PSPType): { bg: string; color: string } => {
    switch (tipo) {
      case "Adquirente": return { bg: "rgba(99,102,241,0.12)", color: "#6366f1" };
      case "Sub-adquirente": return { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" };
      case "Gateway global": return { bg: "rgba(16,185,129,0.12)", color: "#10b981" };
      case "Gateway LATAM": return { bg: "rgba(59,130,246,0.12)", color: "#3b82f6" };
      case "Wallet/Gateway": return { bg: "rgba(168,85,247,0.12)", color: "#a855f7" };
    }
  };

  const hasFilters = businessType !== "" || volume !== "" || priority !== "";

  return (
    <div style={{ maxWidth: 1260, margin: "0 auto", padding: "32px 16px" }}>
      {/* ---- Back link ---- */}
      <div style={{ marginBottom: "24px" }}>
        <Link href="/tools" style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>
          &larr; Ferramentas
        </Link>
      </div>

      {/* ---- Title ---- */}
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
        Comparador de PSPs
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "32px", lineHeight: 1.5 }}>
        Compare os 10 principais provedores de pagamento do mercado brasileiro. Selecione seu perfil para receber recomendacoes personalizadas.
      </p>

      {/* ---- Profile filters ---- */}
      <div style={s.card({ marginBottom: "28px" })}>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "16px" }}>
          Qual seu perfil?
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {/* Business Type */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Tipo de negocio
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType | "")}
              style={s.select}
            >
              <option value="">Todos</option>
              <option value="e-commerce">E-commerce</option>
              <option value="saas">SaaS</option>
              <option value="marketplace">Marketplace</option>
              <option value="varejo">Varejo Fisico</option>
            </select>
          </div>

          {/* Volume */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Volume mensal
            </label>
            <select
              value={volume}
              onChange={(e) => setVolume(e.target.value as VolumeRange | "")}
              style={s.select}
            >
              <option value="">Qualquer</option>
              <option value="<100K">Ate R$ 100K</option>
              <option value="100K-1M">R$ 100K - 1M</option>
              <option value="1M-10M">R$ 1M - 10M</option>
              <option value=">10M">Acima de R$ 10M</option>
            </select>
          </div>

          {/* Priority */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Prioridade
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority | "")}
              style={s.select}
            >
              <option value="">Equilibrado</option>
              <option value="menor-custo">Menor custo</option>
              <option value="melhor-api">Melhor API / DX</option>
              <option value="mais-features">Mais features</option>
              <option value="faster-settlement">Settlement mais rapido</option>
            </select>
          </div>
        </div>

        {hasFilters && (
          <div style={{ marginTop: "16px", padding: "12px 16px", background: "var(--primary-bg)", borderRadius: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}>
              Recomendado: {topPSP}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              (score: {scored[0]?.score}/30)
            </span>
          </div>
        )}
      </div>

      {/* ---- View toggle ---- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          {scored.length} PSPs {hasFilters ? "ordenados por recomendacao" : "listados"}
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => setViewMode("table")}
            style={{
              padding: "6px 16px",
              borderRadius: "8px",
              border: viewMode === "table" ? "2px solid var(--primary)" : "1px solid var(--border)",
              background: viewMode === "table" ? "var(--primary-bg)" : "var(--surface)",
              color: viewMode === "table" ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            Tabela
          </button>
          <button
            onClick={() => setViewMode("cards")}
            style={{
              padding: "6px 16px",
              borderRadius: "8px",
              border: viewMode === "cards" ? "2px solid var(--primary)" : "1px solid var(--border)",
              background: viewMode === "cards" ? "var(--primary-bg)" : "var(--surface)",
              color: viewMode === "cards" ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            Cards
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  TABLE VIEW                                                       */}
      {/* ================================================================ */}
      {viewMode === "table" && (
        <div style={s.card({ padding: "0", overflowX: "auto" })}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...s.th(false), textAlign: "left", minWidth: "120px" }}>Recurso</th>
                {scored.map(({ psp }) => (
                  <th key={psp.name} style={s.th(psp.name === topPSP)}>
                    <div>{psp.name}</div>
                    <div style={{ fontSize: "0.65rem", fontWeight: 400, color: "var(--text-secondary)", marginTop: "2px" }}>
                      {psp.tipo}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Pricing */}
              <tr>
                <td style={{ ...s.td(false), textAlign: "left", fontWeight: 600, fontSize: "0.78rem", color: "var(--text-secondary)" }}>Take Rate</td>
                {scored.map(({ psp }) => (
                  <td key={psp.name} style={s.td(psp.name === topPSP)}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{psp.takeRate}</span>
                  </td>
                ))}
              </tr>

              {/* Settlement */}
              <tr>
                <td style={{ ...s.td(false), textAlign: "left", fontWeight: 600, fontSize: "0.78rem", color: "var(--text-secondary)" }}>Settlement</td>
                {scored.map(({ psp }) => (
                  <td key={psp.name} style={s.td(psp.name === topPSP)}>
                    <span style={{ fontSize: "0.82rem" }}>{psp.settlement}</span>
                  </td>
                ))}
              </tr>

              {/* Feature rows */}
              {FEATURE_ROWS.map((row) => (
                <tr key={row.key}>
                  <td style={{ ...s.td(false), textAlign: "left", fontWeight: 600, fontSize: "0.78rem", color: "var(--text-secondary)" }}>{row.label}</td>
                  {scored.map(({ psp }) => {
                    const val = psp.features[row.key as keyof typeof psp.features];
                    return (
                      <td key={psp.name} style={s.td(psp.name === topPSP)}>
                        {val ? (
                          <span style={{ color: "#10b981", fontWeight: 700 }}>&#10003;</span>
                        ) : (
                          <span style={{ color: "#ef4444", fontWeight: 700 }}>&#10005;</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Features Score */}
              <tr>
                <td style={{ ...s.td(false), textAlign: "left", fontWeight: 600, fontSize: "0.78rem", color: "var(--text-secondary)" }}>Features Score</td>
                {scored.map(({ psp }) => (
                  <td
                    key={psp.name}
                    style={{ ...s.td(psp.name === topPSP), cursor: "pointer", position: "relative" }}
                    onClick={() => setActiveTooltip(activeTooltip === `feat-${psp.name}` ? null : `feat-${psp.name}`)}
                  >
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{psp.featuresScore}/10</span>
                    {activeTooltip === `feat-${psp.name}` && (
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "12px",
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        width: "260px",
                        zIndex: 10,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        textAlign: "left",
                      }}>
                        {psp.scoreExplanation}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* API Score */}
              <tr>
                <td style={{ ...s.td(false), textAlign: "left", fontWeight: 600, fontSize: "0.78rem", color: "var(--text-secondary)" }}>API / DX Score</td>
                {scored.map(({ psp }) => (
                  <td key={psp.name} style={s.td(psp.name === topPSP)}>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{psp.apiScore}/10</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ================================================================ */}
      {/*  CARD VIEW                                                        */}
      {/* ================================================================ */}
      {viewMode === "cards" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {scored.map(({ psp, score }, idx) => {
            const tc = tipoColor(psp.tipo);
            const isTop = idx === 0 && hasFilters;
            return (
              <div
                key={psp.name}
                style={s.card({
                  border: isTop ? "2px solid var(--primary)" : "1px solid var(--border)",
                  position: "relative",
                })}
              >
                {/* Top badge */}
                {isTop && (
                  <div style={{
                    position: "absolute",
                    top: "-1px",
                    right: "20px",
                    background: "var(--primary)",
                    color: "#fff",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "4px 14px",
                    borderRadius: "0 0 8px 8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    Recomendado
                  </div>
                )}

                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>{psp.name}</span>
                      <span style={s.badge(tc.bg, tc.color)}>{psp.tipo}</span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, maxWidth: "600px" }}>
                      {psp.description}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexShrink: 0 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "2px" }}>Features</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}>{psp.featuresScore}/10</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "2px" }}>API</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}>{psp.apiScore}/10</div>
                    </div>
                    {hasFilters && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "2px" }}>Score</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)" }}>{score}/30</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key stats */}
                <div style={{ display: "flex", gap: "24px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "2px" }}>Take Rate</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)" }}>{psp.takeRate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "2px" }}>Settlement</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)" }}>{psp.settlement}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "2px" }}>Diferencial</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--foreground)", maxWidth: "400px" }}>{psp.differentiator}</div>
                  </div>
                </div>

                {/* Payment methods */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {psp.methods.map((m) => (
                    <span key={m} style={s.badge("var(--primary-bg)", "var(--primary)")}>
                      {METHOD_LABELS[m]}
                    </span>
                  ))}
                </div>

                {/* Pros and Cons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", marginBottom: "8px" }}>Vantagens</div>
                    {psp.pros.map((p, i) => (
                      <div key={i} style={{ fontSize: "0.82rem", color: "var(--foreground)", marginBottom: "4px", lineHeight: 1.4 }}>
                        <span style={{ color: "#10b981", marginRight: "6px" }}>+</span>{p}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", marginBottom: "8px" }}>Desvantagens</div>
                    {psp.cons.map((c, i) => (
                      <div key={i} style={{ fontSize: "0.82rem", color: "var(--foreground)", marginBottom: "4px", lineHeight: 1.4 }}>
                        <span style={{ color: "#ef4444", marginRight: "6px" }}>-</span>{c}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best for / Score explanation */}
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 300px", background: "var(--primary-bg)", borderRadius: "10px", padding: "12px 16px" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", marginBottom: "4px" }}>Ideal para</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.5 }}>{psp.bestFor}</div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <Link
                      href="/tools/integration-checklist"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        background: "var(--primary)",
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Ver integracao &rarr;
                    </Link>
                  </div>
                </div>

                {/* Score explanation (collapsible) */}
                <div style={{ marginTop: "12px" }}>
                  <button
                    onClick={() => setActiveTooltip(activeTooltip === `card-${psp.name}` ? null : `card-${psp.name}`)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-secondary)",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      textDecoration: "underline",
                      padding: "0",
                    }}
                  >
                    {activeTooltip === `card-${psp.name}` ? "Ocultar detalhes do score" : "Ver detalhes do score"}
                  </button>
                  {activeTooltip === `card-${psp.name}` && (
                    <div style={{
                      marginTop: "8px",
                      padding: "12px 16px",
                      background: "var(--background)",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}>
                      {psp.scoreExplanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Disclaimer ---- */}
      <div style={{
        marginTop: "28px",
        padding: "14px 20px",
        background: "var(--surface)",
        borderRadius: "10px",
        border: "1px solid var(--border)",
        fontSize: "0.82rem",
        color: "var(--text-secondary)",
        lineHeight: 1.6,
      }}>
        Precos e features podem mudar. Verifique diretamente com cada PSP. Valores de referencia para o mercado brasileiro em 2024/2025. Taxas reais dependem de negociacao, volume, MCC e perfil de risco.
      </div>
    </div>
  );
}
