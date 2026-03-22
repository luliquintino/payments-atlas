"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getFeatureByName } from "@/data/features";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BusinessType = "E-commerce" | "SaaS" | "Marketplace" | "Travel" | "Gaming";
type VolumeRange = "<$100K" | "$100K-$1M" | "$1M-$10M" | "$10M+";
type Region = "North America" | "Europe" | "LatAm" | "APAC";
type Priority = "must-have" | "recommended" | "nice-to-have";

interface LayerFeature { name: string; priority: Priority }
interface ArchitectureLayer { name: string; description: string; features: LayerFeature[] }
interface RoadmapPhase { phase: number; title: string; duration: string; items: string[] }
interface ProjectedMetrics {
  authorizationRate: string;
  conversionRate: string;
  fraudRate: string;
  chargebackRate: string;
  settlementTime: string;
  processingCost: string;
}

// ---------------------------------------------------------------------------
// Business profile options (with subtitles)
// ---------------------------------------------------------------------------

const BUSINESS_TYPES: { value: BusinessType; label: string; icon: string; subtitle: string }[] = [
  { value: "E-commerce", label: "E-commerce", icon: "🛒", subtitle: "Checkout online, diversidade de meios de pagamento" },
  { value: "SaaS", label: "SaaS / Assinatura", icon: "☁️", subtitle: "Foco em recorrência e gestão de churn" },
  { value: "Marketplace", label: "Marketplace", icon: "🏪", subtitle: "Split payments, onboarding de sellers" },
  { value: "Travel", label: "Turismo", icon: "✈️", subtitle: "Cross-border, multi-moeda, alta sazonalidade" },
  { value: "Gaming", label: "Gaming", icon: "🎮", subtitle: "Microtransações, alto volume, baixo ticket" },
];

const VOLUME_OPTIONS: { value: VolumeRange; label: string; icon: string }[] = [
  { value: "<$100K", label: "< $100K", icon: "📊" },
  { value: "$100K-$1M", label: "$100K–$1M", icon: "📈" },
  { value: "$1M-$10M", label: "$1M–$10M", icon: "🚀" },
  { value: "$10M+", label: "$10M+", icon: "🏦" },
];

const REGION_OPTIONS: { value: Region; label: string; icon: string }[] = [
  { value: "North America", label: "América do Norte", icon: "🇺🇸" },
  { value: "Europe", label: "Europa", icon: "🇪🇺" },
  { value: "LatAm", label: "América Latina", icon: "🌎" },
  { value: "APAC", label: "Ásia Pacífico", icon: "🌏" },
];

const RISK_CONTEXT: { label: string; subtitle: string; range: string }[] = [
  { label: "Conservador", subtitle: "Menos features, menor risco operacional", range: "0-34" },
  { label: "Moderado", subtitle: "Equilíbrio entre performance e complexidade", range: "35-65" },
  { label: "Agressivo", subtitle: "Máxima performance, mais complexidade técnica", range: "66-100" },
];

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

const PRIORITY_META: Record<Priority, { color: string; bg: string; label: string; icon: string; borderStyle: string }> = {
  "must-have":    { color: "#10b981", bg: "rgba(16,185,129,0.15)", label: "Essencial", icon: "●", borderStyle: `2px solid rgba(16,185,129,0.4)` },
  recommended:    { color: "#3b82f6", bg: "rgba(59,130,246,0.06)", label: "Recomendado", icon: "◆", borderStyle: `1.5px solid rgba(59,130,246,0.35)` },
  "nice-to-have": { color: "#9ca3af", bg: "transparent", label: "Desejável", icon: "○", borderStyle: `1.5px solid rgba(156,163,175,0.3)` },
};

const LAYER_COLORS: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  "Camada de Experiência":   { color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.25)", icon: "🎨" },
  "Camada de Orquestração":  { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)", icon: "🔀" },
  "Camada de Processamento": { color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", icon: "⚙️" },
  "Camada de Risco":         { color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.25)",  icon: "🛡️" },
  "Camada de Liquidação":    { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", icon: "💰" },
};

const PHASE_COLORS = [
  { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
  { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)" },
  { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)" },
];

// ---------------------------------------------------------------------------
// Benchmarks
// ---------------------------------------------------------------------------

const BENCHMARKS = {
  authorizationRate: 82,
  conversionRate: 68,
  fraudRate: 2.5,
  chargebackRate: 0.9,
  settlementTime: 2, // T+2
  processingCost: 3.5,
};

const PHASE_METRICS = [
  { auth: "~78%", fraud: "~2.5%" },
  { auth: "~84%", fraud: "~1.8%" },
  { auth: "~88%", fraud: "~1.2%" },
];

// ---------------------------------------------------------------------------
// Recommendation logic (why text generator)
// ---------------------------------------------------------------------------

function getWhyText(featureName: string, businessType: BusinessType, volume: VolumeRange): string {
  const typeLabel: Record<BusinessType, string> = {
    "E-commerce": "e-commerce",
    SaaS: "SaaS/assinatura",
    Marketplace: "marketplace",
    Travel: "turismo",
    Gaming: "gaming",
  };
  const volLabel = volume === "$10M+" ? "alto volume ($10M+)" : volume === "$1M-$10M" ? "volume significativo ($1M-$10M)" : volume === "$100K-$1M" ? "volume médio ($100K-$1M)" : "volume inicial (< $100K)";

  const specifics: Record<string, string> = {
    "Smart Routing": `otimizar custos e taxa de aprovação distribuindo transações entre múltiplos adquirentes.`,
    "Cascade Routing": `aumentar a taxa de aprovação com fallback automático para adquirentes alternativos.`,
    "Retry Logic": `recuperar soft declines automaticamente, aumentando a taxa de sucesso sem fricção.`,
    "Network Tokens": `melhorar taxas de aprovação em 2-4% substituindo PANs por tokens de rede.`,
    "PCI Vault": `armazenar dados sensíveis com segurança e reduzir escopo de PCI compliance.`,
    "Hosted Checkout": `acelerar a integração mantendo conformidade PCI sem esforço adicional.`,
    "Fraud Scoring Engine": `identificar transações fraudulentas em tempo real, protegendo receita.`,
    "Chargeback Management": `gerenciar disputas de forma eficiente e reduzir perdas com chargebacks.`,
    "Settlement & Reconciliation": `garantir controle financeiro preciso e liquidação eficiente.`,
  };

  const specific = specifics[featureName] || `melhorar a performance e resiliência do sistema de pagamentos.`;
  return `Perfil de ${typeLabel[businessType]} com ${volLabel} se beneficia desta feature para ${specific}`;
}

// ---------------------------------------------------------------------------
// Recommendation logic (architecture)
// ---------------------------------------------------------------------------

function getArchitecture(
  businessType: BusinessType, volume: VolumeRange, region: Region, riskTolerance: number,
): ArchitectureLayer[] {
  const isHighVolume = volume === "$1M-$10M" || volume === "$10M+";
  const isAggressive = riskTolerance > 65;
  const isConservative = riskTolerance < 35;
  const needsCrossBorder = region === "LatAm" || region === "APAC" || region === "Europe";

  const experienceFeatures: LayerFeature[] = [
    { name: "Hosted Checkout", priority: "must-have" },
    { name: "Saved Cards (CoF)", priority: isHighVolume ? "must-have" : "recommended" },
    { name: "Alternative Payment Methods", priority: needsCrossBorder ? "must-have" : "recommended" },
    { name: "One-Click Payments", priority: businessType === "E-commerce" || businessType === "Gaming" ? "must-have" : "nice-to-have" },
    { name: "Mobile SDKs", priority: businessType === "Gaming" ? "must-have" : "recommended" },
  ];
  const orchestrationFeatures: LayerFeature[] = [
    { name: "Smart Routing", priority: isHighVolume ? "must-have" : "recommended" },
    { name: "Cascade Routing", priority: isHighVolume ? "recommended" : "nice-to-have" },
    { name: "Retry Logic", priority: "must-have" },
    { name: "Dynamic 3D Secure", priority: isConservative ? "must-have" : "recommended" },
    { name: "Subscription Engine", priority: businessType === "SaaS" ? "must-have" : "nice-to-have" },
    { name: "Split Payments", priority: businessType === "Marketplace" ? "must-have" : "nice-to-have" },
  ];
  const processingFeatures: LayerFeature[] = [
    { name: "Network Tokens", priority: "must-have" },
    { name: "PCI Vault", priority: "must-have" },
    { name: "BIN Lookup", priority: "recommended" },
    { name: "Currency Conversion (DCC/MCC)", priority: needsCrossBorder ? "must-have" : "nice-to-have" },
    { name: "Account Updater", priority: businessType === "SaaS" ? "must-have" : "recommended" },
    { name: "Batch Processing", priority: businessType === "Marketplace" ? "recommended" : "nice-to-have" },
  ];
  const networkFeatures: LayerFeature[] = [
    { name: "Visa / Mastercard Direct", priority: isHighVolume ? "must-have" : "recommended" },
    { name: "Local Acquirers", priority: needsCrossBorder ? "must-have" : "nice-to-have" },
    { name: "Multi-Acquirer Setup", priority: isHighVolume ? "must-have" : "nice-to-have" },
    { name: "Real-Time Auth", priority: "must-have" },
    { name: "Debit Network Support", priority: region === "LatAm" ? "must-have" : "recommended" },
  ];
  const bankingFeatures: LayerFeature[] = [
    { name: "Fraud Scoring Engine", priority: isAggressive ? "recommended" : "must-have" },
    { name: "Device Fingerprinting", priority: "recommended" },
    { name: "Velocity Checks", priority: isConservative ? "must-have" : "recommended" },
    { name: "Chargeback Management", priority: "must-have" },
    { name: "Settlement & Reconciliation", priority: "must-have" },
    { name: "Regulatory Compliance (PSD2 / PCI)", priority: "must-have" },
  ];

  return [
    { name: "Camada de Experiência", description: "Experiência de pagamento e fluxos de checkout voltados ao usuário", features: experienceFeatures },
    { name: "Camada de Orquestração", description: "Roteamento, retentativas e lógica de orquestração de pagamentos", features: orchestrationFeatures },
    { name: "Camada de Processamento", description: "Tokenização, vaulting e processamento de transações", features: processingFeatures },
    { name: "Camada de Risco", description: "Conexões com bandeiras de cartão e integrações com adquirentes", features: networkFeatures },
    { name: "Camada de Liquidação", description: "Fraude, compliance, liquidação e infraestrutura bancária", features: bankingFeatures },
  ];
}

function getProjectedMetrics(
  businessType: BusinessType, volume: VolumeRange, region: Region, riskTolerance: number,
): ProjectedMetrics {
  const baseAuth: Record<BusinessType, number> = { "E-commerce": 92, SaaS: 95, Marketplace: 89, Travel: 87, Gaming: 91 };
  const baseFraud: Record<BusinessType, number> = { "E-commerce": 0.8, SaaS: 0.3, Marketplace: 1.2, Travel: 1.5, Gaming: 1.8 };

  let auth = baseAuth[businessType];
  let fraud = baseFraud[businessType];

  if (volume === "$10M+") auth += 2;
  if (volume === "<$100K") auth -= 2;
  if (region === "LatAm") { auth -= 3; fraud += 0.3; }
  if (region === "APAC") { auth -= 1; }
  if (riskTolerance > 65) { auth += 1.5; fraud += 0.4; }
  if (riskTolerance < 35) { auth -= 1; fraud -= 0.2; }

  return {
    authorizationRate: `${Math.min(99, auth).toFixed(1)}%`,
    conversionRate: `${(auth * 0.85).toFixed(1)}%`,
    fraudRate: `${Math.max(0.1, fraud).toFixed(2)}%`,
    chargebackRate: `${(Math.max(0.1, fraud) * 0.4).toFixed(2)}%`,
    settlementTime: volume === "$10M+" ? "T+1" : "T+2",
    processingCost: volume === "$10M+" ? "1.8%" : volume === "$1M-$10M" ? "2.2%" : "2.9%",
  };
}

function getRoadmap(businessType: BusinessType, volume: VolumeRange, region: Region): RoadmapPhase[] {
  const needsCrossBorder = region !== "North America";
  const isSaaS = businessType === "SaaS";
  const isMarketplace = businessType === "Marketplace";

  return [
    {
      phase: 1, title: "Fundação", duration: "4-6 semanas",
      items: [
        "Integrar PSP principal com hosted checkout",
        "Configurar vault de tokenização com PCI compliance",
        "Implementar regras básicas de fraud scoring",
        "Implantar retry logic para soft declines",
        isSaaS ? "Configurar engine de billing para assinaturas" : "Habilitar fluxos de cartão salvo (Card on File)",
      ],
    },
    {
      phase: 2, title: "Otimização", duration: "6-8 semanas",
      items: [
        "Habilitar Network Tokens para aumentar taxas de auth",
        "Implementar Smart Routing entre adquirentes",
        needsCrossBorder ? "Adicionar adquirentes locais e conversão de moeda" : "Otimizar configuração de adquirente para tráfego doméstico",
        "Implantar device fingerprinting e velocity checks",
        isMarketplace ? "Construir fluxos de split payment e escrow" : "Implementar Account Updater para ciclo de vida do cartão",
        "Adicionar 3D Secure com triggers baseados em risco",
      ],
    },
    {
      phase: 3, title: "Escala e Diferenciação", duration: "8-12 semanas",
      items: [
        "Adicionar cascade routing com adquirentes de fallback",
        "Implementar modelo avançado de fraude baseado em ML",
        "Construir dashboards de liquidação e reconciliação em tempo real",
        needsCrossBorder ? "Expandir métodos de pagamento alternativos (Pix, iDEAL, GrabPay, etc.)" : "Adicionar trilhos de pagamento ACH / Open Banking",
        "Implantar autenticação biométrica para transações de alto valor",
        "Testes A/B contínuos de checkout e estratégias de roteamento",
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseNumeric(val: string): number {
  return parseFloat(val.replace("%", "").replace("T+", ""));
}

function metricComparison(projected: string, benchmarkVal: number, lowerIsBetter: boolean): { delta: number; isBetter: boolean } {
  const num = parseNumeric(projected);
  const delta = num - benchmarkVal;
  const isBetter = lowerIsBetter ? delta < 0 : delta > 0;
  return { delta, isBetter };
}

// ---------------------------------------------------------------------------
// Section Header helper
// ---------------------------------------------------------------------------

function SectionHeader({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div className="flex items-center" style={{ gap: "10px", marginBottom: "6px" }}>
        <span style={{ fontSize: "22px" }}>{icon}</span>
        <h2 className="text-lg font-semibold" style={{ margin: 0 }}>{title}</h2>
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, paddingLeft: "32px" }}>{description}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ArchitectureAdvisorPage() {
  const [businessType, setBusinessType] = useState<BusinessType>("E-commerce");
  const [volume, setVolume] = useState<VolumeRange>("$100K-$1M");
  const [region, setRegion] = useState<Region>("North America");
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());
  const [generated, setGenerated] = useState(false);

  const architecture = useMemo(
    () => getArchitecture(businessType, volume, region, riskTolerance),
    [businessType, volume, region, riskTolerance],
  );
  const projectedMetrics = useMemo(
    () => getProjectedMetrics(businessType, volume, region, riskTolerance),
    [businessType, volume, region, riskTolerance],
  );
  const roadmap = useMemo(
    () => getRoadmap(businessType, volume, region),
    [businessType, volume, region],
  );

  const riskLabel = riskTolerance < 35 ? "Conservador" : riskTolerance > 65 ? "Agressivo" : "Moderado";
  const riskColor = riskTolerance < 35 ? "#10b981" : riskTolerance > 65 ? "#ef4444" : "#f59e0b";

  const priorityCounts = useMemo(() => {
    const counts = { "must-have": 0, recommended: 0, "nice-to-have": 0 };
    architecture.forEach(l => l.features.forEach(f => counts[f.priority]++));
    return counts;
  }, [architecture]);

  const toggleLayer = (name: string) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const expandAll = () => setExpandedLayers(new Set(architecture.map(l => l.name)));
  const collapseAll = () => setExpandedLayers(new Set());

  const handleGenerate = () => {
    setGenerated(true);
    expandAll();
  };

  // Shared styles
  const selectCardStyle = (isActive: boolean) => ({
    padding: "14px 12px",
    borderRadius: "12px",
    border: `2px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
    background: isActive ? "rgba(99,102,241,0.08)" : "var(--surface)",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center" as const,
    minWidth: 0,
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "8px" }}>🏗️ Consultor de Arquitetura</h1>
        <p className="page-description">
          Obtenha uma arquitetura de pagamento recomendada, personalizada para o perfil do seu negócio.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 animate-fade-in stagger-1" style={{ gap: "12px", marginBottom: "28px" }}>
        {[
          { label: "Camadas", value: "5", icon: "📐", color: "#8b5cf6" },
          { label: "Essenciais", value: String(priorityCounts["must-have"]), icon: "●", color: "#10b981" },
          { label: "Recomendadas", value: String(priorityCounts.recommended), icon: "◆", color: "#3b82f6" },
          { label: "Desejáveis", value: String(priorityCounts["nice-to-have"]), icon: "○", color: "#9ca3af" },
          { label: "Fases do Roadmap", value: "3", icon: "🗺️", color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>{s.icon} {s.label}</div>
            <div className="metric-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* SECTION 1: Perfil do Negócio                                        */}
      {/* ==================================================================== */}
      <div className="card-glow animate-fade-in stagger-2" style={{ padding: "28px", marginBottom: "40px" }}>
        <SectionHeader
          icon="🎯"
          title="Perfil do Negócio"
          description="Configure o perfil do seu negócio para receber recomendações personalizadas de arquitetura."
        />

        {/* Business Type */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Tipo de Negócio
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5" style={{ gap: "10px" }}>
            {BUSINESS_TYPES.map(bt => {
              const isActive = businessType === bt.value;
              return (
                <button
                  key={bt.value}
                  onClick={() => setBusinessType(bt.value)}
                  style={{
                    ...selectCardStyle(isActive),
                    padding: "16px 12px 14px",
                  }}
                  className="interactive-hover"
                >
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>{bt.icon}</div>
                  <div style={{ fontSize: "13px", fontWeight: isActive ? 700 : 500, marginBottom: "4px" }}>{bt.label}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)", lineHeight: 1.3 }}>{bt.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Volume + Region row */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "24px", marginBottom: "24px" }}>
          {/* Volume */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Volume Mensal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "10px" }}>
              {VOLUME_OPTIONS.map(v => (
                <button
                  key={v.value}
                  onClick={() => setVolume(v.value)}
                  style={selectCardStyle(volume === v.value)}
                  className="interactive-hover"
                >
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>{v.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: volume === v.value ? 600 : 400 }}>{v.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Região Principal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "10px" }}>
              {REGION_OPTIONS.map(r => (
                <button
                  key={r.value}
                  onClick={() => setRegion(r.value)}
                  style={selectCardStyle(region === r.value)}
                  className="interactive-hover"
                >
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>{r.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: region === r.value ? 600 : 400 }}>{r.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Tolerance */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Tolerância a Risco:{" "}
            <span style={{ fontWeight: 700, color: riskColor, fontSize: "14px", textTransform: "none" }}>{riskLabel}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(Number(e.target.value))}
            className="w-full"
            style={{
              height: "8px",
              borderRadius: "999px",
              appearance: "none",
              cursor: "pointer",
              background: `linear-gradient(to right, var(--success) 0%, var(--warning) 50%, var(--error) 100%)`,
            }}
          />
          {/* Risk context labels */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", marginTop: "10px", gap: "8px" }}>
            {RISK_CONTEXT.map((rc, i) => {
              const isActiveRange = (i === 0 && riskTolerance < 35) || (i === 1 && riskTolerance >= 35 && riskTolerance <= 65) || (i === 2 && riskTolerance > 65);
              return (
                <div
                  key={rc.label}
                  style={{
                    textAlign: i === 0 ? "left" : i === 1 ? "center" : "right",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    background: isActiveRange ? "rgba(99,102,241,0.06)" : "transparent",
                    border: isActiveRange ? "1px solid var(--border)" : "1px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: isActiveRange ? 600 : 400, color: isActiveRange ? "var(--foreground)" : "var(--text-secondary)" }}>
                    {rc.label}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px" }}>{rc.subtitle}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generate button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            className="interactive-hover"
            style={{
              padding: "14px 48px",
              borderRadius: "12px",
              background: "var(--primary)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            }}
          >
            🚀 Gerar Recomendação
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 2: Arquitetura Recomendada                                   */}
      {/* ==================================================================== */}
      <div className="card-glow animate-fade-in stagger-3" style={{ padding: "28px", marginBottom: "40px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "6px" }}>
          <SectionHeader
            icon="📐"
            title="Arquitetura Recomendada"
            description="Camadas e features recomendadas baseadas no seu perfil de negócio."
          />
          <div className="flex items-center" style={{ gap: "8px", flexShrink: 0 }}>
            <button
              onClick={expandAll}
              className="interactive-hover"
              style={{ fontSize: "11px", padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              Expandir Tudo
            </button>
            <button
              onClick={collapseAll}
              className="interactive-hover"
              style={{ fontSize: "11px", padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              Recolher
            </button>
          </div>
        </div>

        {/* Priority Legend */}
        <div className="flex items-center" style={{ gap: "20px", marginBottom: "20px", paddingLeft: "32px" }}>
          {(Object.keys(PRIORITY_META) as Priority[]).map(p => {
            const pm = PRIORITY_META[p];
            return (
              <div key={p} className="flex items-center" style={{ gap: "8px" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "18px", height: "18px", borderRadius: "4px",
                  background: pm.bg, border: pm.borderStyle, fontSize: "9px", color: pm.color,
                }}>
                  {pm.icon}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{pm.label}</span>
              </div>
            );
          })}
        </div>

        {/* Layers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {architecture.map((layer, idx) => {
            const lc = LAYER_COLORS[layer.name] || LAYER_COLORS["Camada de Experiência"];
            const isExpanded = expandedLayers.has(layer.name);
            const mustHaveCount = layer.features.filter(f => f.priority === "must-have").length;

            return (
              <div key={layer.name}>
                {/* Connector */}
                {idx > 0 && (
                  <div className="flex justify-center" style={{ marginBottom: "10px" }}>
                    <div style={{ width: "2px", height: "20px", background: "var(--border)", borderRadius: "1px" }} />
                  </div>
                )}

                <div
                  style={{
                    border: `1.5px solid ${isExpanded ? lc.border : "var(--border)"}`,
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "all 0.2s",
                    background: isExpanded ? lc.bg : "transparent",
                  }}
                >
                  {/* Layer header */}
                  <button
                    onClick={() => toggleLayer(layer.name)}
                    className="w-full text-left interactive-hover"
                    style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}
                  >
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "12px",
                      background: `linear-gradient(135deg, ${lc.color}, ${lc.color}88)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", flexShrink: 0,
                    }}>
                      {lc.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="text-sm font-semibold" style={{ marginBottom: "2px" }}>{layer.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{layer.description}</div>
                    </div>
                    <div className="flex items-center" style={{ gap: "10px", flexShrink: 0 }}>
                      <span style={{
                        fontSize: "11px", padding: "3px 10px", borderRadius: "6px",
                        background: PRIORITY_META["must-have"].bg, color: PRIORITY_META["must-have"].color, fontWeight: 600,
                      }}>
                        {mustHaveCount} essenciais
                      </span>
                      <span style={{
                        fontSize: "11px", padding: "3px 10px", borderRadius: "6px",
                        background: "var(--surface)", color: "var(--text-secondary)", fontWeight: 500,
                      }}>
                        {layer.features.length} total
                      </span>
                      <span style={{ fontSize: "18px", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", color: "var(--text-secondary)" }}>▾</span>
                    </div>
                  </button>

                  {/* Expandable features — vertical cards */}
                  <div style={{
                    display: "grid",
                    gridTemplateRows: isExpanded ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.3s ease",
                  }}>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ padding: "4px 20px 20px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {layer.features.map(feat => {
                          const pm = PRIORITY_META[feat.priority];
                          const featureData = getFeatureByName(feat.name);
                          const featureId = featureData?.id;
                          const featureDesc = featureData?.description;
                          const whyText = getWhyText(feat.name, businessType, volume);

                          const card = (
                            <div
                              style={{
                                padding: "16px 18px",
                                borderRadius: "10px",
                                border: pm.borderStyle,
                                background: pm.bg,
                                transition: "all 0.15s",
                              }}
                            >
                              {/* Feature header row */}
                              <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                                <div className="flex items-center" style={{ gap: "8px" }}>
                                  <span style={{ fontSize: "12px", color: pm.color, fontWeight: 700 }}>{pm.icon}</span>
                                  <span style={{ fontSize: "14px", fontWeight: 600 }}>{feat.name}</span>
                                </div>
                                <span style={{
                                  fontSize: "10px", fontWeight: 600, padding: "3px 10px", borderRadius: "6px",
                                  background: feat.priority === "must-have" ? pm.color : "transparent",
                                  color: feat.priority === "must-have" ? "#fff" : pm.color,
                                  border: feat.priority !== "must-have" ? `1.5px solid ${pm.color}` : "none",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.04em",
                                }}>
                                  {pm.label}
                                </span>
                              </div>

                              {/* Description */}
                              {featureDesc && (
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 8px 0" }}>
                                  {featureDesc}
                                </p>
                              )}

                              {/* Why recommended */}
                              <p style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.4, margin: "0 0 8px 0", fontStyle: "italic" }}>
                                <span style={{ fontWeight: 600, fontStyle: "normal", color: pm.color }}>Por que recomendado: </span>
                                {whyText}
                              </p>

                              {/* Link */}
                              {featureId && (
                                <Link
                                  href={`/knowledge/features/${featureId}`}
                                  style={{ fontSize: "12px", color: pm.color, fontWeight: 600, textDecoration: "none" }}
                                >
                                  Ver detalhes →
                                </Link>
                              )}
                            </div>
                          );

                          return <div key={feat.name}>{card}</div>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 3: Métricas Projetadas                                       */}
      {/* ==================================================================== */}
      <div className="card-glow animate-fade-in stagger-4" style={{ padding: "28px", marginBottom: "40px" }}>
        <SectionHeader
          icon="📊"
          title="Métricas Projetadas"
          description="Projeção de performance baseada na arquitetura recomendada, comparada com benchmarks de mercado."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" style={{ gap: "14px" }}>
          {([
            { label: "Taxa de Auth", value: projectedMetrics.authorizationRate, icon: "✅", color: "#10b981", benchmark: BENCHMARKS.authorizationRate, unit: "%", lowerIsBetter: false },
            { label: "Conversão", value: projectedMetrics.conversionRate, icon: "📈", color: "#3b82f6", benchmark: BENCHMARKS.conversionRate, unit: "%", lowerIsBetter: false },
            { label: "Taxa de Fraude", value: projectedMetrics.fraudRate, icon: "🚨", color: "#ef4444", benchmark: BENCHMARKS.fraudRate, unit: "%", lowerIsBetter: true },
            { label: "Chargebacks", value: projectedMetrics.chargebackRate, icon: "⚠️", color: "#f59e0b", benchmark: BENCHMARKS.chargebackRate, unit: "%", lowerIsBetter: true },
            { label: "Liquidação", value: projectedMetrics.settlementTime, icon: "⏱️", color: "#8b5cf6", benchmark: BENCHMARKS.settlementTime, unit: "T+", lowerIsBetter: true },
            { label: "Custo", value: projectedMetrics.processingCost, icon: "💵", color: "#6366f1", benchmark: BENCHMARKS.processingCost, unit: "%", lowerIsBetter: true },
          ] as const).map(m => {
            const comp = metricComparison(m.value, m.benchmark, m.lowerIsBetter);
            const arrowColor = comp.isBetter ? "#10b981" : "#ef4444";
            const arrow = comp.isBetter ? "▲" : "▼";
            const benchmarkDisplay = m.unit === "T+" ? `T+${m.benchmark}` : `${m.benchmark}%`;

            return (
              <div key={m.label} style={{ padding: "18px 14px", textAlign: "center", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface)" }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>{m.icon}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: 500 }}>{m.label}</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: m.color, marginBottom: "8px" }}>{m.value}</div>

                {/* Benchmark comparison */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                  <div className="flex items-center justify-center" style={{ gap: "4px" }}>
                    <span style={{ fontSize: "12px", color: arrowColor, fontWeight: 700 }}>{arrow}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{benchmarkDisplay}</span>
                  </div>
                  <span style={{ fontSize: "9px", color: "var(--text-secondary)" }}>vs. média do mercado</span>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "12px", fontStyle: "italic" }}>
          * Benchmarks baseados em médias de mercado. Valores projetados variam conforme implementação e contexto.
        </p>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 4: Roadmap (Visual Timeline)                                 */}
      {/* ==================================================================== */}
      <div className="card-glow animate-fade-in stagger-5" style={{ padding: "28px", marginBottom: "40px" }}>
        <SectionHeader
          icon="🗺️"
          title="Roadmap de Implementação"
          description="Plano de execução em fases com estimativa de impacto progressivo nas métricas."
        />

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block">
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0px", position: "relative" }}>
            {roadmap.map((phase, idx) => {
              const pc = PHASE_COLORS[phase.phase - 1];
              const pm = PHASE_METRICS[phase.phase - 1];
              const isLast = idx === roadmap.length - 1;

              return (
                <div key={phase.phase} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                  {/* Top: numbered circle + connector */}
                  <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center", marginBottom: "16px", position: "relative" }}>
                    {/* Left connector */}
                    {idx > 0 && (
                      <div style={{
                        position: "absolute", left: 0, top: "50%", width: "50%", height: "0px",
                        borderTop: "2px dashed var(--border)", transform: "translateY(-50%)",
                      }} />
                    )}
                    {/* Right connector */}
                    {!isLast && (
                      <div style={{
                        position: "absolute", right: 0, top: "50%", width: "50%", height: "0px",
                        borderTop: "2px dashed var(--border)", transform: "translateY(-50%)",
                      }} />
                    )}
                    {/* Circle */}
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "50%",
                      background: pc.color, color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "18px", zIndex: 1,
                      boxShadow: `0 0 0 4px var(--background), 0 0 0 6px ${pc.border}`,
                    }}>
                      {phase.phase}
                    </div>
                  </div>

                  {/* Phase card */}
                  <div style={{
                    border: `1.5px solid ${pc.border}`,
                    borderRadius: "14px",
                    overflow: "hidden",
                    width: "100%",
                    margin: "0 8px",
                  }}>
                    {/* Phase header */}
                    <div style={{
                      padding: "14px 16px",
                      background: pc.bg,
                      borderBottom: `1px solid ${pc.border}`,
                    }}>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: pc.color }}>
                        Fase {phase.phase}: {phase.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{phase.duration}</div>
                    </div>

                    {/* Phase items */}
                    <div style={{ padding: "16px" }}>
                      <ul style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0, padding: 0, listStyle: "none" }}>
                        {phase.items.map((item, i) => (
                          <li key={i} className="flex items-start" style={{ gap: "8px", fontSize: "12px", lineHeight: 1.5 }}>
                            <span style={{
                              marginTop: "6px", width: "6px", height: "6px",
                              borderRadius: "50%", background: pc.color, flexShrink: 0,
                            }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Estimated metrics after phase */}
                    <div style={{
                      padding: "12px 16px",
                      background: pc.bg,
                      borderTop: `1px solid ${pc.border}`,
                      display: "flex", alignItems: "center", gap: "12px",
                    }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: pc.color }}>Após Fase {phase.phase}:</span>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Auth {pm.auth}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Fraude {pm.fraud}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden">
          <div style={{ display: "flex", flexDirection: "column", gap: "0px", position: "relative", paddingLeft: "28px" }}>
            {/* Vertical dashed line */}
            <div style={{
              position: "absolute", left: "21px", top: "22px", bottom: "22px", width: "0px",
              borderLeft: "2px dashed var(--border)",
            }} />

            {roadmap.map((phase) => {
              const pc = PHASE_COLORS[phase.phase - 1];
              const pm = PHASE_METRICS[phase.phase - 1];

              return (
                <div key={phase.phase} style={{ position: "relative", marginBottom: "20px" }}>
                  {/* Circle on the line */}
                  <div style={{
                    position: "absolute", left: "-28px", top: "0px",
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: pc.color, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "16px", zIndex: 1,
                    boxShadow: `0 0 0 4px var(--background), 0 0 0 6px ${pc.border}`,
                  }}>
                    {phase.phase}
                  </div>

                  {/* Card */}
                  <div style={{
                    marginLeft: "28px",
                    border: `1.5px solid ${pc.border}`,
                    borderRadius: "14px",
                    overflow: "hidden",
                  }}>
                    <div style={{ padding: "14px 16px", background: pc.bg, borderBottom: `1px solid ${pc.border}` }}>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: pc.color }}>Fase {phase.phase}: {phase.title}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{phase.duration}</div>
                    </div>
                    <div style={{ padding: "16px" }}>
                      <ul style={{ display: "flex", flexDirection: "column", gap: "10px", margin: 0, padding: 0, listStyle: "none" }}>
                        {phase.items.map((item, i) => (
                          <li key={i} className="flex items-start" style={{ gap: "8px", fontSize: "12px", lineHeight: 1.5 }}>
                            <span style={{ marginTop: "6px", width: "6px", height: "6px", borderRadius: "50%", background: pc.color, flexShrink: 0 }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ padding: "12px 16px", background: pc.bg, borderTop: `1px solid ${pc.border}`, display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: pc.color }}>Após Fase {phase.phase}:</span>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Auth {pm.auth}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Fraude {pm.fraud}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginBottom: "16px" }}>Páginas Relacionadas</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 animate-fade-in stagger-6" style={{ gap: "12px", marginBottom: "32px" }}>
        {[
          { label: "Simulador de Pagamento", desc: "Simule o impacto de features na performance", href: "/simulation/payment-simulator", icon: "⚡" },
          { label: "Base de Features", desc: "Catálogo completo de features de pagamento", href: "/build/features", icon: "🧱" },
          { label: "Conta Comigo", desc: "Diagnóstico automatizado do seu sistema", href: "/diagnostics/conta-comigo", icon: "🩺" },
        ].map(p => (
          <Link key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <span style={{ fontSize: "24px" }}>{p.icon}</span>
            <div>
              <div className="text-sm font-semibold">{p.label}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{p.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
