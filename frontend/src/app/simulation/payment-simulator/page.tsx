"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

interface Feature {
  id: string;
  name: string;
  category: FeatureCategory;
  dependencies: string[];
  impact: MetricImpact;
}

type FeatureCategory =
  | "Autenticação"
  | "Tokenização"
  | "Roteamento"
  | "Fraude"
  | "Recuperação"
  | "Processamento";

interface MetricImpact {
  authorizationRate: number;
  conversionRate: number;
  fraudRate: number;
  chargebackRate: number;
  settlementTime: number;
  processingCost: number;
}

interface MetricDefinition {
  key: keyof MetricImpact;
  label: string;
  unit: string;
  baseline: number;
  lowerIsBetter: boolean;
}

// ---------------------------------------------------------------------------
// Feature catalogue
// ---------------------------------------------------------------------------

const FEATURES: Feature[] = [
  { id: "3d-secure", name: "3D Secure", category: "Autenticação", dependencies: [], impact: { authorizationRate: -1.5, conversionRate: -2.0, fraudRate: -3.0, chargebackRate: -2.5, settlementTime: 0, processingCost: 0.3 } },
  { id: "biometric-auth", name: "Biometric Auth", category: "Autenticação", dependencies: ["3d-secure"], impact: { authorizationRate: 1.0, conversionRate: 1.5, fraudRate: -2.0, chargebackRate: -1.0, settlementTime: 0, processingCost: 0.5 } },
  { id: "network-tokens", name: "Network Tokens", category: "Tokenização", dependencies: [], impact: { authorizationRate: 3.5, conversionRate: 2.0, fraudRate: -1.5, chargebackRate: -0.5, settlementTime: 0, processingCost: -0.2 } },
  { id: "pci-vault", name: "PCI Vault", category: "Tokenização", dependencies: [], impact: { authorizationRate: 1.0, conversionRate: 0.5, fraudRate: -1.0, chargebackRate: -0.5, settlementTime: 0, processingCost: 0.4 } },
  { id: "smart-routing", name: "Smart Routing", category: "Roteamento", dependencies: [], impact: { authorizationRate: 4.0, conversionRate: 3.0, fraudRate: 0, chargebackRate: 0, settlementTime: -5, processingCost: -1.0 } },
  { id: "cascade-routing", name: "Cascade Routing", category: "Roteamento", dependencies: ["smart-routing"], impact: { authorizationRate: 2.5, conversionRate: 2.0, fraudRate: 0, chargebackRate: 0, settlementTime: 2, processingCost: 0.3 } },
  { id: "fraud-scoring", name: "Fraud Scoring", category: "Fraude", dependencies: [], impact: { authorizationRate: -0.5, conversionRate: -0.5, fraudRate: -4.0, chargebackRate: -3.0, settlementTime: 0, processingCost: 0.6 } },
  { id: "velocity-checks", name: "Velocity Checks", category: "Fraude", dependencies: ["fraud-scoring"], impact: { authorizationRate: -0.3, conversionRate: -0.3, fraudRate: -2.0, chargebackRate: -1.5, settlementTime: 0, processingCost: 0.2 } },
  { id: "device-fingerprint", name: "Device Fingerprint", category: "Fraude", dependencies: [], impact: { authorizationRate: 0, conversionRate: 0, fraudRate: -2.5, chargebackRate: -1.0, settlementTime: 0, processingCost: 0.3 } },
  { id: "retry-logic", name: "Retry Logic", category: "Recuperação", dependencies: [], impact: { authorizationRate: 2.0, conversionRate: 1.5, fraudRate: 0, chargebackRate: 0, settlementTime: 1, processingCost: 0.1 } },
  { id: "account-updater", name: "Account Updater", category: "Recuperação", dependencies: ["network-tokens"], impact: { authorizationRate: 3.0, conversionRate: 2.5, fraudRate: 0, chargebackRate: -0.5, settlementTime: 0, processingCost: 0.3 } },
  { id: "bin-lookup", name: "BIN Lookup", category: "Processamento", dependencies: [], impact: { authorizationRate: 1.0, conversionRate: 0.5, fraudRate: -1.0, chargebackRate: -0.5, settlementTime: -2, processingCost: 0.1 } },
  { id: "currency-conversion", name: "Currency Conversion", category: "Processamento", dependencies: ["bin-lookup"], impact: { authorizationRate: 1.5, conversionRate: 2.0, fraudRate: 0, chargebackRate: 0, settlementTime: 3, processingCost: 0.8 } },
];

const METRICS: MetricDefinition[] = [
  { key: "authorizationRate", label: "Taxa de Autorização", unit: "%", baseline: 78, lowerIsBetter: false },
  { key: "conversionRate", label: "Taxa de Conversão", unit: "%", baseline: 65, lowerIsBetter: false },
  { key: "fraudRate", label: "Taxa de Fraude", unit: "%", baseline: 4.5, lowerIsBetter: true },
  { key: "chargebackRate", label: "Taxa de Chargeback", unit: "%", baseline: 1.8, lowerIsBetter: true },
  { key: "settlementTime", label: "Tempo de Liquidação", unit: "hrs", baseline: 48, lowerIsBetter: true },
  { key: "processingCost", label: "Custo de Processamento", unit: "%", baseline: 2.9, lowerIsBetter: true },
];

// ---------------------------------------------------------------------------
// Category metadata — inline-style-friendly colours
// ---------------------------------------------------------------------------

const CATEGORY_META: Record<FeatureCategory, { color: string; lightBg: string; icon: string }> = {
  "Autenticação": { color: "#8b5cf6", lightBg: "rgba(139,92,246,0.08)", icon: "🛡️" },
  "Tokenização": { color: "#06b6d4", lightBg: "rgba(6,182,212,0.08)", icon: "🔑" },
  "Roteamento": { color: "#d97706", lightBg: "rgba(217,119,6,0.08)", icon: "🔀" },
  "Fraude": { color: "#dc2626", lightBg: "rgba(220,38,38,0.08)", icon: "🚨" },
  "Recuperação": { color: "#059669", lightBg: "rgba(5,150,105,0.08)", icon: "🔄" },
  "Processamento": { color: "#2563eb", lightBg: "rgba(37,99,235,0.08)", icon: "⚡" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupByCategory(features: Feature[]): Record<FeatureCategory, Feature[]> {
  const groups: Partial<Record<FeatureCategory, Feature[]>> = {};
  for (const f of features) {
    (groups[f.category] ??= []).push(f);
  }
  return groups as Record<FeatureCategory, Feature[]>;
}

function calculateMetrics(activeIds: Set<string>): Record<keyof MetricImpact, number> {
  const result: Record<string, number> = {};
  for (const m of METRICS) {
    let value = m.baseline;
    for (const f of FEATURES) {
      if (activeIds.has(f.id)) value += f.impact[m.key];
    }
    if (m.unit === "%") value = Math.max(0, Math.min(100, value));
    if (m.key === "settlementTime") value = Math.max(1, value);
    result[m.key] = parseFloat(value.toFixed(2));
  }
  return result as Record<keyof MetricImpact, number>;
}

function getMissingDeps(activeIds: Set<string>, proposedIds: Set<string>): { featureId: string; missing: string[] }[] {
  const allActive = new Set([...activeIds, ...proposedIds]);
  const warnings: { featureId: string; missing: string[] }[] = [];
  for (const id of proposedIds) {
    const feature = FEATURES.find((f) => f.id === id);
    if (!feature) continue;
    const missing = feature.dependencies.filter((dep) => !allActive.has(dep));
    if (missing.length > 0) warnings.push({ featureId: id, missing });
  }
  return warnings;
}

function getRecommendations(activeIds: Set<string>, proposedIds: Set<string>): string[] {
  const all = new Set([...activeIds, ...proposedIds]);
  const recs: string[] = [];
  if (!all.has("network-tokens") && !all.has("pci-vault"))
    recs.push("Considere adicionar tokenização (Network Tokens ou PCI Vault) para melhorar as taxas de autorização e reduzir fraudes.");
  if (!all.has("smart-routing"))
    recs.push("Smart Routing pode aumentar significativamente as taxas de autorização e conversão ao escolher caminhos ideais de adquirentes.");
  if (!all.has("fraud-scoring") && !all.has("device-fingerprint"))
    recs.push("Adicionar uma camada de prevenção a fraudes (Fraud Scoring ou Device Fingerprint) é recomendado para reduzir chargebacks.");
  if (all.has("3d-secure") && !all.has("biometric-auth"))
    recs.push("Combine 3D Secure com Biometric Auth para recuperar a queda de conversão causada pela autenticação adicional.");
  if (all.has("network-tokens") && !all.has("account-updater"))
    recs.push("Network Tokens habilitam o Account Updater, que reduz significativamente recusas por cartões expirados.");
  if (all.has("smart-routing") && !all.has("cascade-routing"))
    recs.push("Cascade Routing complementa o Smart Routing ao retentar autorizações falhas em adquirentes alternativos.");
  if (recs.length === 0)
    recs.push("Sua arquitetura de pagamento está completa! Monitore suas métricas e continue iterando.");
  return recs;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PaymentSimulatorPageWrapper() {
  return (
    <Suspense>
      <PaymentSimulatorPage />
    </Suspense>
  );
}

function PaymentSimulatorPage() {
  const searchParams = useSearchParams();

  const [activeFeatures, setActiveFeatures] = useState<Set<string>>(new Set());
  const [proposedFeatures, setProposedFeatures] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showTip, setShowTip] = useState(true);

  // URL params on mount
  useEffect(() => {
    const proposeParam = searchParams.get("propose");
    const activeParam = searchParams.get("active");
    const featureIds = FEATURES.map((f) => f.id);
    if (activeParam) {
      const ids = activeParam.split(",").filter((id) => featureIds.includes(id));
      if (ids.length > 0) setActiveFeatures(new Set(ids));
    }
    if (proposeParam) {
      const ids = proposeParam.split(",").filter((id) => featureIds.includes(id));
      if (ids.length > 0) setProposedFeatures(new Set(ids));
    }
  }, [searchParams]);

  // ---- Derived data ----
  const grouped = useMemo(() => groupByCategory(FEATURES), []);
  const currentMetrics = useMemo(() => calculateMetrics(activeFeatures), [activeFeatures]);
  const projectedMetrics = useMemo(
    () => calculateMetrics(new Set([...activeFeatures, ...proposedFeatures])),
    [activeFeatures, proposedFeatures],
  );
  const missingDeps = useMemo(() => getMissingDeps(activeFeatures, proposedFeatures), [activeFeatures, proposedFeatures]);
  const recommendations = useMemo(() => getRecommendations(activeFeatures, proposedFeatures), [activeFeatures, proposedFeatures]);
  const availableFeatures = useMemo(() => FEATURES.filter((f) => !activeFeatures.has(f.id)), [activeFeatures]);
  const availableGrouped = useMemo(() => {
    const g: Partial<Record<FeatureCategory, Feature[]>> = {};
    for (const f of availableFeatures) (g[f.category] ??= []).push(f);
    return g;
  }, [availableFeatures]);

  // Search filter: null = show all, Set = matching IDs
  const searchMatchIds = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return new Set(
      FEATURES.filter(
        (f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q),
      ).map((f) => f.id),
    );
  }, [searchQuery]);

  // Stack health score (0–100)
  const stackScore = useMemo(() => {
    const m = projectedMetrics;
    const scores = [
      m.authorizationRate,
      m.conversionRate,
      Math.max(0, 100 - m.fraudRate * 15),
      Math.max(0, 100 - m.chargebackRate * 25),
      Math.max(0, 100 - (m.settlementTime / 72) * 100),
      Math.max(0, 100 - m.processingCost * 15),
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [projectedMetrics]);

  const scoreColor =
    stackScore >= 80 ? "var(--success)" : stackScore >= 60 ? "var(--warning)" : "var(--error)";

  // ---- Handlers ----

  const featureMatchesSearch = (id: string) => !searchMatchIds || searchMatchIds.has(id);

  const toggleActive = (id: string) => {
    setActiveFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setProposedFeatures((p) => { const np = new Set(p); np.delete(id); return np; });
      } else {
        next.add(id);
        setProposedFeatures((p) => { const np = new Set(p); np.delete(id); return np; });
      }
      return next;
    });
  };

  const toggleProposed = (id: string) => {
    setProposedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetAll = () => {
    setActiveFeatures(new Set());
    setProposedFeatures(new Set());
  };

  // ---- Render ----

  return (
    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>

      {/* ===== PAGE HEADER ===== */}
      <div className="page-header animate-fade-in" style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              color: "#fff",
            }}
          >
            ⚙
          </div>
          <h1 className="page-title">Simulador de Pagamentos</h1>
        </div>
        <p className="page-description">
          Monte sua arquitetura de pagamento, explore o impacto de cada feature e receba
          recomendações personalizadas para otimizar suas métricas.
        </p>
      </div>

      {/* ===== STATS ROW: Score + 6 Metrics ===== */}
      <div
        className="animate-fade-in stagger-1"
        style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "stretch" }}
      >
        {/* Stack Health Score */}
        <div
          className="stat-card"
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "130px",
            flex: "0 0 auto",
            borderColor: scoreColor,
          }}
        >
          <div
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.375rem",
            }}
          >
            Health Score
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
            {stackScore}
          </div>
          <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            de 100
          </div>
        </div>

        {/* 6 Baseline Metric Cards */}
        <div
          className="grid grid-cols-3 lg:grid-cols-6"
          style={{ gap: "0.75rem", flex: 1 }}
        >
          {METRICS.map((m) => {
            const val = projectedMetrics[m.key];
            const delta = parseFloat((val - m.baseline).toFixed(2));
            const isImproved = m.lowerIsBetter ? delta < 0 : delta > 0;
            return (
              <div key={m.key} className="stat-card" style={{ padding: "0.875rem 0.75rem" }}>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.375rem",
                    lineHeight: 1.3,
                  }}
                >
                  {m.label}
                </div>
                <div className="metric-value" style={{ fontSize: "1.125rem" }}>
                  {val}
                  {m.unit}
                </div>
                {delta !== 0 && (
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: isImproved ? "var(--success)" : "var(--error)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {delta > 0 ? "+" : ""}
                    {delta}
                    {m.unit}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "-12px", marginBottom: "12px", fontStyle: "italic" }}>
        * Esses números podem ter sofrido alteração com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* ===== TIP ===== */}
      {showTip && (
        <div
          className="animate-fade-in stagger-2"
          style={{
            marginBottom: "1.5rem",
            padding: "1rem 1.25rem",
            borderRadius: "10px",
            background: "rgba(37, 99, 235, 0.05)",
            border: "1px solid rgba(37, 99, 235, 0.12)",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.125rem", lineHeight: 1 }}>💡</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
              Como usar o simulador
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              <strong>1.</strong> Marque as features ativas na sua stack &nbsp;→&nbsp;{" "}
              <strong>2.</strong> Adicione features propostas &nbsp;→&nbsp; <strong>3.</strong>{" "}
              Analise o impacto e siga as recomendações
            </div>
          </div>
          <button
            onClick={() => setShowTip(false)}
            style={{
              color: "var(--text-muted)",
              cursor: "pointer",
              background: "none",
              border: "none",
              fontSize: "1.125rem",
              lineHeight: 1,
              padding: "0.25rem",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ===== SEARCH ===== */}
      <div className="animate-fade-in stagger-2" style={{ marginBottom: "1.5rem" }}>
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar features por nome ou categoria..."
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.75rem",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "var(--surface-hover)",
                border: "none",
                borderRadius: "50%",
                width: "1.5rem",
                height: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-muted)",
                fontSize: "0.75rem",
              }}
            >
              ×
            </button>
          )}
        </div>
        {searchMatchIds && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
            {searchMatchIds.size} feature{searchMatchIds.size !== 1 ? "s" : ""} encontrada
            {searchMatchIds.size !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ===== FEATURE PANELS ===== */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{ gap: "1.5rem", marginBottom: "2rem" }}
      >
        {/* ---- LEFT: Sua Arquitetura Atual ---- */}
        <div className="card-glow animate-fade-in stagger-3" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.25rem",
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Sua Arquitetura Atual</h2>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--primary-light)",
                background: "rgba(37, 99, 235, 0.08)",
                padding: "0.125rem 0.5rem",
                borderRadius: "9999px",
              }}
            >
              {activeFeatures.size} ativas
            </div>
          </div>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
            }}
          >
            Marque as features que já estão na sua stack
          </p>

          {activeFeatures.size > 0 && (
            <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={resetAll}
                style={{
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                Limpar tudo
              </button>
            </div>
          )}

          <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "0.25rem" }}>
            {(Object.keys(grouped) as FeatureCategory[]).map((cat) => {
              const meta = CATEGORY_META[cat];
              const catFeatures = grouped[cat];
              const anyMatch = catFeatures.some((f) => featureMatchesSearch(f.id));
              if (searchMatchIds && !anyMatch) return null;

              return (
                <div
                  key={cat}
                  style={{
                    marginBottom: "1rem",
                    transition: "opacity 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.125rem 0.625rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: meta.color,
                      background: meta.lightBg,
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "0.8125rem" }}>{meta.icon}</span>
                    {cat}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                      marginLeft: "0.25rem",
                    }}
                  >
                    {catFeatures.map((feature) => {
                      const isMatch = featureMatchesSearch(feature.id);
                      const isActive = activeFeatures.has(feature.id);
                      return (
                        <label
                          key={feature.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            cursor: "pointer",
                            padding: "0.375rem 0.5rem",
                            borderRadius: "6px",
                            transition: "all 0.15s",
                            opacity: isMatch ? 1 : 0.25,
                            background: isActive ? meta.lightBg : "transparent",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => toggleActive(feature.id)}
                            style={{
                              width: "1rem",
                              height: "1rem",
                              accentColor: meta.color,
                              cursor: "pointer",
                            }}
                          />
                          <span
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {feature.name}
                          </span>
                          {feature.dependencies.length > 0 && (
                            <span
                              style={{
                                fontSize: "0.625rem",
                                color: "var(--text-muted)",
                                background: "var(--surface-hover)",
                                padding: "0 0.375rem",
                                borderRadius: "4px",
                              }}
                            >
                              req:{" "}
                              {feature.dependencies
                                .map((d) => FEATURES.find((f) => f.id === d)?.name)
                                .join(", ")}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active summary chips */}
          {activeFeatures.size > 0 && (
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                {[...activeFeatures].map((id) => {
                  const f = FEATURES.find((feat) => feat.id === id)!;
                  const meta = CATEGORY_META[f.category];
                  return (
                    <span
                      key={id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.6875rem",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                        background: meta.lightBg,
                        color: meta.color,
                        fontWeight: 500,
                      }}
                    >
                      {f.name}
                      <button
                        onClick={() => toggleActive(id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: meta.color,
                          fontSize: "0.75rem",
                          lineHeight: 1,
                          padding: "0 0.125rem",
                        }}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ---- RIGHT: Explorar Features ---- */}
        <div className="card-glow animate-fade-in stagger-4" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.25rem",
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Explorar Features</h2>
            {proposedFeatures.size > 0 && (
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#059669",
                  background: "rgba(5, 150, 105, 0.08)",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                }}
              >
                {proposedFeatures.size} propostas
              </div>
            )}
          </div>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
            }}
          >
            Adicione features para simular o impacto
          </p>

          {availableFeatures.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
                color: "var(--text-muted)",
                fontSize: "0.875rem",
              }}
            >
              Todas as features já estão na sua stack!
            </div>
          ) : (
            <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "0.25rem" }}>
              {(Object.keys(availableGrouped) as FeatureCategory[]).map((cat) => {
                const features = availableGrouped[cat];
                if (!features || features.length === 0) return null;
                const meta = CATEGORY_META[cat];
                const anyMatch = features.some((f) => featureMatchesSearch(f.id));
                if (searchMatchIds && !anyMatch) return null;

                return (
                  <div key={cat} style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        padding: "0.125rem 0.625rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: meta.color,
                        background: meta.lightBg,
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span style={{ fontSize: "0.8125rem" }}>{meta.icon}</span>
                      {cat}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {features.map((feature) => {
                        const isProposed = proposedFeatures.has(feature.id);
                        const isMatch = featureMatchesSearch(feature.id);
                        return (
                          <button
                            key={feature.id}
                            onClick={() => toggleProposed(feature.id)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "0.5rem",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "8px",
                              fontSize: "0.8125rem",
                              border: isProposed
                                ? `1px solid ${meta.color}`
                                : "1px solid var(--border)",
                              background: isProposed ? meta.lightBg : "transparent",
                              color: isProposed ? meta.color : "var(--foreground)",
                              fontWeight: isProposed ? 600 : 400,
                              cursor: "pointer",
                              transition: "all 0.15s",
                              opacity: isMatch ? 1 : 0.25,
                            }}
                          >
                            <span>{feature.name}</span>
                            <span style={{ fontSize: "0.6875rem", opacity: 0.7, fontWeight: 500 }}>
                              {isProposed ? "✓ Adicionado" : "+ Adicionar"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Proposed summary */}
          {proposedFeatures.size > 0 && (
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                {[...proposedFeatures].map((id) => {
                  const f = FEATURES.find((feat) => feat.id === id)!;
                  const meta = CATEGORY_META[f.category];
                  return (
                    <span
                      key={id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.6875rem",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                        border: `1px solid ${meta.color}`,
                        color: meta.color,
                        fontWeight: 500,
                      }}
                    >
                      {f.name}
                      <button
                        onClick={() => toggleProposed(id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: meta.color,
                          fontSize: "0.75rem",
                          lineHeight: 1,
                          padding: "0 0.125rem",
                        }}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== IMPACT DASHBOARD ===== */}
      <div className="card-glow animate-fade-in stagger-5" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Análise de Impacto</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
            }}
          >
            <span>Ativas:</span>
            <span style={{ fontWeight: 700, color: "var(--foreground)" }}>
              {activeFeatures.size}
            </span>
            <span style={{ margin: "0 0.125rem" }}>+</span>
            <span>Propostas:</span>
            <span style={{ fontWeight: 700, color: "var(--foreground)" }}>
              {proposedFeatures.size}
            </span>
          </div>
        </div>

        {/* Metric comparison cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          style={{ gap: "1rem", marginBottom: "1.5rem" }}
        >
          {METRICS.map((m) => {
            const current = currentMetrics[m.key];
            const projected = projectedMetrics[m.key];
            const delta = parseFloat((projected - current).toFixed(2));
            const isImprovement = m.lowerIsBetter ? delta < 0 : delta > 0;
            const isNeutral = delta === 0;
            const maxVal = m.key === "settlementTime" ? 72 : 100;
            const currentWidth = Math.min(100, (current / maxVal) * 100);
            const projectedWidth = Math.min(100, (projected / maxVal) * 100);

            return (
              <div key={m.key} className="card-flat" style={{ padding: "1.25rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{m.label}</span>
                  {!isNeutral && (
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                        background: isImprovement
                          ? "rgba(22, 163, 74, 0.1)"
                          : "rgba(220, 38, 38, 0.1)",
                        color: isImprovement ? "var(--success)" : "var(--error)",
                      }}
                    >
                      {delta > 0 ? "+" : ""}
                      {delta}
                      {m.unit}
                    </span>
                  )}
                </div>

                {/* Current bar */}
                <div style={{ marginBottom: "0.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.6875rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span>Atual</span>
                    <span style={{ fontWeight: 500 }}>
                      {current}
                      {m.unit}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: "var(--surface-hover)",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "9999px",
                        background: "var(--text-muted)",
                        width: `${currentWidth}%`,
                        transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </div>
                </div>

                {/* Projected bar */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.6875rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span>Projetado</span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: isNeutral
                          ? "var(--text-muted)"
                          : isImprovement
                            ? "var(--success)"
                            : "var(--error)",
                      }}
                    >
                      {projected}
                      {m.unit}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: "var(--surface-hover)",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "9999px",
                        background: isNeutral
                          ? "var(--text-muted)"
                          : isImprovement
                            ? "linear-gradient(90deg, #16a34a, #4ade80)"
                            : "linear-gradient(90deg, #dc2626, #f87171)",
                        width: `${projectedWidth}%`,
                        transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dependency warnings */}
        {missingDeps.length > 0 && (
          <div
            style={{
              marginBottom: "1.25rem",
              padding: "1rem 1.25rem",
              borderRadius: "10px",
              background: "rgba(217, 119, 6, 0.06)",
              border: "1px solid rgba(217, 119, 6, 0.15)",
            }}
          >
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--warning)",
                marginBottom: "0.5rem",
              }}
            >
              Dependências Ausentes
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {missingDeps.map(({ featureId, missing }) => {
                const feature = FEATURES.find((f) => f.id === featureId)!;
                return (
                  <div
                    key={featureId}
                    style={{ fontSize: "0.8125rem", color: "var(--foreground)" }}
                  >
                    <span style={{ fontWeight: 600 }}>{feature.name}</span>
                    <span style={{ color: "var(--text-muted)" }}> requer </span>
                    <span style={{ fontWeight: 500 }}>
                      {missing
                        .map((dep) => FEATURES.find((f) => f.id === dep)?.name ?? dep)
                        .join(", ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div
          style={{
            padding: "1.25rem",
            borderRadius: "10px",
            background: "rgba(37, 99, 235, 0.04)",
            border: "1px solid rgba(37, 99, 235, 0.1)",
          }}
        >
          <h3 style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            Recomendações
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {recommendations.map((rec, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--primary), var(--primary-light))",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    marginTop: "0.125rem",
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    lineHeight: 1.5,
                    color: "var(--foreground)",
                  }}
                >
                  {rec}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ marginTop: "3rem", marginBottom: "2rem" }}>
        <div className="divider-text" style={{ marginBottom: "1.25rem" }}>
          Páginas Relacionadas
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{ gap: "1rem" }}
        >
          {[
            {
              href: "/simulation/architecture-advisor",
              title: "Architecture Advisor",
              desc: "Recomendações de arquitetura personalizadas para seu negócio",
              icon: "🏗️",
            },
            {
              href: "/explore/financial-system",
              title: "Sistema Financeiro",
              desc: "Visão geral do ecossistema de pagamentos",
              icon: "🏦",
            },
            {
              href: "/diagnostics/conta-comigo",
              title: "Conta Comigo",
              desc: "Diagnóstico inteligente de problemas de pagamento",
              icon: "🔍",
            },
          ].map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="card-flat interactive-hover"
              style={{
                padding: "1.25rem",
                display: "block",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{page.icon}</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                {page.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{page.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
