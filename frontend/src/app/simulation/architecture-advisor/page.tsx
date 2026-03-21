"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

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
// Business profile options
// ---------------------------------------------------------------------------

const BUSINESS_TYPES: { value: BusinessType; label: string; icon: string }[] = [
  { value: "E-commerce", label: "E-commerce", icon: "🛒" },
  { value: "SaaS", label: "SaaS / Assinatura", icon: "☁️" },
  { value: "Marketplace", label: "Marketplace", icon: "🏪" },
  { value: "Travel", label: "Turismo", icon: "✈️" },
  { value: "Gaming", label: "Gaming", icon: "🎮" },
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

// ---------------------------------------------------------------------------
// Design tokens (inline-friendly)
// ---------------------------------------------------------------------------

const PRIORITY_META: Record<Priority, { color: string; bg: string; label: string; icon: string }> = {
  "must-have":   { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Essencial", icon: "●" },
  recommended:   { color: "#3b82f6", bg: "rgba(59,130,246,0.12)", label: "Recomendado", icon: "◆" },
  "nice-to-have":{ color: "#9ca3af", bg: "rgba(156,163,175,0.12)", label: "Desejável", icon: "○" },
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
// Recommendation logic (unchanged)
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
// Component
// ---------------------------------------------------------------------------

export default function ArchitectureAdvisorPage() {
  const [businessType, setBusinessType] = useState<BusinessType>("E-commerce");
  const [volume, setVolume] = useState<VolumeRange>("$100K-$1M");
  const [region, setRegion] = useState<Region>("North America");
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());

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

  // Count priorities across all layers
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

  // Shared styles
  const selectCardStyle = (isActive: boolean) => ({
    padding: "12px 16px",
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
      <div className="grid grid-cols-2 lg:grid-cols-5 animate-fade-in stagger-1" style={{ gap: "12px", marginBottom: "24px" }}>
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

      {/* ---- Business Profile ---- */}
      <div className="card-glow animate-fade-in stagger-2" style={{ padding: "24px", marginBottom: "24px" }}>
        <h2 className="text-lg font-semibold" style={{ marginBottom: "20px" }}>🎯 Perfil do Negócio</h2>

        {/* Business Type */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--text-muted)", marginBottom: "8px" }}>
            Tipo de Negócio
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5" style={{ gap: "8px" }}>
            {BUSINESS_TYPES.map(bt => (
              <button
                key={bt.value}
                onClick={() => setBusinessType(bt.value)}
                style={selectCardStyle(businessType === bt.value)}
                className="interactive-hover"
              >
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{bt.icon}</div>
                <div style={{ fontSize: "12px", fontWeight: businessType === bt.value ? 600 : 400 }}>{bt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Volume + Region row */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "20px", marginBottom: "20px" }}>
          {/* Volume */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--text-muted)", marginBottom: "8px" }}>
              Volume Mensal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "8px" }}>
              {VOLUME_OPTIONS.map(v => (
                <button
                  key={v.value}
                  onClick={() => setVolume(v.value)}
                  style={selectCardStyle(volume === v.value)}
                  className="interactive-hover"
                >
                  <div style={{ fontSize: "16px", marginBottom: "2px" }}>{v.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: volume === v.value ? 600 : 400 }}>{v.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--text-muted)", marginBottom: "8px" }}>
              Região Principal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: "8px" }}>
              {REGION_OPTIONS.map(r => (
                <button
                  key={r.value}
                  onClick={() => setRegion(r.value)}
                  style={selectCardStyle(region === r.value)}
                  className="interactive-hover"
                >
                  <div style={{ fontSize: "16px", marginBottom: "2px" }}>{r.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: region === r.value ? 600 : 400 }}>{r.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Tolerance */}
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--text-muted)", marginBottom: "8px" }}>
            Tolerância a Risco:{" "}
            <span style={{ fontWeight: 700, color: riskColor, fontSize: "14px" }}>{riskLabel}</span>
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
          <div className="flex justify-between" style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>
            <span>Conservador</span>
            <span>Moderado</span>
            <span>Agressivo</span>
          </div>
        </div>
      </div>

      {/* ---- Architecture Diagram ---- */}
      <div className="card-glow animate-fade-in stagger-3" style={{ padding: "24px", marginBottom: "24px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
          <h2 className="text-lg font-semibold">📐 Arquitetura Recomendada</h2>
          <div className="flex items-center" style={{ gap: "8px" }}>
            <button
              onClick={expandAll}
              className="interactive-hover"
              style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              Expandir Tudo
            </button>
            <button
              onClick={collapseAll}
              className="interactive-hover"
              style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              Recolher
            </button>
          </div>
        </div>

        {/* Priority Legend */}
        <div className="flex items-center" style={{ gap: "16px", marginBottom: "16px" }}>
          {(Object.keys(PRIORITY_META) as Priority[]).map(p => (
            <div key={p} className="flex items-center" style={{ gap: "6px" }}>
              <span style={{
                display: "inline-block", width: "10px", height: "10px", borderRadius: "3px",
                background: PRIORITY_META[p].bg, border: `1px solid ${PRIORITY_META[p].color}`,
              }} />
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{PRIORITY_META[p].label}</span>
            </div>
          ))}
        </div>

        {/* Layers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {architecture.map((layer, idx) => {
            const lc = LAYER_COLORS[layer.name] || LAYER_COLORS["Camada de Experiência"];
            const isExpanded = expandedLayers.has(layer.name);
            const mustHaveCount = layer.features.filter(f => f.priority === "must-have").length;

            return (
              <div key={layer.name}>
                {/* Connector */}
                {idx > 0 && (
                  <div className="flex justify-center" style={{ marginBottom: "8px" }}>
                    <div style={{ width: "2px", height: "16px", background: "var(--border)" }} />
                  </div>
                )}

                <div
                  style={{
                    border: `1px solid ${isExpanded ? lc.border : "var(--border)"}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "all 0.2s",
                    background: isExpanded ? lc.bg : "transparent",
                  }}
                >
                  {/* Layer header */}
                  <button
                    onClick={() => toggleLayer(layer.name)}
                    className="w-full text-left interactive-hover"
                    style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}
                  >
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: `linear-gradient(135deg, ${lc.color}, ${lc.color}88)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", flexShrink: 0,
                    }}>
                      {lc.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="text-sm font-semibold">{layer.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{layer.description}</div>
                    </div>
                    <div className="flex items-center" style={{ gap: "8px", flexShrink: 0 }}>
                      <span style={{
                        fontSize: "11px", padding: "2px 8px", borderRadius: "6px",
                        background: PRIORITY_META["must-have"].bg, color: PRIORITY_META["must-have"].color,
                      }}>
                        {mustHaveCount} essenciais
                      </span>
                      <span style={{
                        fontSize: "11px", padding: "2px 8px", borderRadius: "6px",
                        background: "var(--surface)", color: "var(--text-muted)",
                      }}>
                        {layer.features.length} total
                      </span>
                      <span style={{ fontSize: "16px", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                    </div>
                  </button>

                  {/* Expandable features */}
                  <div style={{
                    display: "grid",
                    gridTemplateRows: isExpanded ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.3s ease",
                  }}>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 16px 16px 64px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {layer.features.map(feat => {
                          const pm = PRIORITY_META[feat.priority];
                          return (
                            <span
                              key={feat.name}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: "6px",
                                fontSize: "13px", padding: "6px 12px", borderRadius: "8px",
                                fontWeight: 500, background: pm.bg, color: pm.color,
                                border: `1px solid ${pm.color}33`,
                              }}
                            >
                              <span style={{ fontSize: "8px" }}>{pm.icon}</span>
                              {feat.name}
                            </span>
                          );
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

      {/* ---- Projected Metrics ---- */}
      <div className="animate-fade-in stagger-4" style={{ marginBottom: "24px" }}>
        <h2 className="text-lg font-semibold" style={{ marginBottom: "12px" }}>📊 Métricas Projetadas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" style={{ gap: "12px" }}>
          {[
            { label: "Taxa de Auth", value: projectedMetrics.authorizationRate, icon: "✅", color: "#10b981" },
            { label: "Conversão", value: projectedMetrics.conversionRate, icon: "📈", color: "#3b82f6" },
            { label: "Taxa de Fraude", value: projectedMetrics.fraudRate, icon: "🚨", color: "#ef4444" },
            { label: "Chargebacks", value: projectedMetrics.chargebackRate, icon: "⚠️", color: "#f59e0b" },
            { label: "Liquidação", value: projectedMetrics.settlementTime, icon: "⏱️", color: "#8b5cf6" },
            { label: "Custo", value: projectedMetrics.processingCost, icon: "💵", color: "#6366f1" },
          ].map(m => (
            <div key={m.label} className="card-glow" style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>{m.icon}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>{m.label}</div>
              <div className="metric-value" style={{ color: m.color, fontSize: "22px" }}>{m.value}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", fontStyle: "italic" }}>
          * Esses números podem ter sofrido alteração com o tempo. Verifique novamente se permanecem atuais.
        </p>
      </div>

      {/* ---- Roadmap ---- */}
      <div className="card-glow animate-fade-in stagger-5" style={{ padding: "24px", marginBottom: "24px" }}>
        <h2 className="text-lg font-semibold" style={{ marginBottom: "16px" }}>🗺️ Roadmap de Implementação</h2>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "16px" }}>
          {roadmap.map((phase) => {
            const pc = PHASE_COLORS[phase.phase - 1];
            return (
              <div
                key={phase.phase}
                style={{
                  border: `2px solid ${pc.border}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.2s",
                }}
                className="interactive-hover"
              >
                {/* Phase header */}
                <div style={{
                  padding: "12px 16px",
                  background: pc.bg,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: pc.color }}>
                      Fase {phase.phase}: {phase.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{phase.duration}</div>
                  </div>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: pc.color, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "14px",
                  }}>
                    {phase.phase}
                  </div>
                </div>

                {/* Phase items */}
                <div style={{ padding: "16px" }}>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start" style={{ gap: "8px", fontSize: "12px" }}>
                        <span style={{
                          marginTop: "4px", width: "6px", height: "6px",
                          borderRadius: "50%", background: pc.color, flexShrink: 0,
                        }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
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
