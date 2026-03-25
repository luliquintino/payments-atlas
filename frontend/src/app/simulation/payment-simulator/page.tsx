"use client";

import { useState, useMemo, useCallback, Suspense } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  impact: RadarImpact;
}

interface RadarImpact {
  authRate: number;
  custo: number;
  fraude: number;
  velocidade: number;
  conversao: number;
  compliance: number;
}

type RadarAxis = keyof RadarImpact;

interface SavedScenario {
  name: string;
  features: Set<string>;
  radar: RadarImpact;
}

interface Preset {
  id: string;
  label: string;
  description: string;
  features: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RADAR_AXES: { key: RadarAxis; label: string }[] = [
  { key: "authRate", label: "Auth Rate" },
  { key: "custo", label: "Custo" },
  { key: "fraude", label: "Fraude" },
  { key: "velocidade", label: "Velocidade" },
  { key: "conversao", label: "Conversão" },
  { key: "compliance", label: "Compliance" },
];

const BASELINE: RadarImpact = {
  authRate: 50,
  custo: 50,
  fraude: 50,
  velocidade: 50,
  conversao: 50,
  compliance: 50,
};

const FEATURES: FeatureToggle[] = [
  {
    id: "smart-routing",
    name: "Smart Routing",
    description: "Roteamento inteligente entre adquirentes",
    impact: { authRate: 12, custo: 8, fraude: 2, velocidade: 6, conversao: 10, compliance: 3 },
  },
  {
    id: "3ds2",
    name: "3DS2",
    description: "Autenticação 3D Secure 2.0",
    impact: { authRate: -4, custo: 2, fraude: 15, velocidade: -3, conversao: -5, compliance: 12 },
  },
  {
    id: "network-tokens",
    name: "Network Tokens",
    description: "Tokenização via bandeira",
    impact: { authRate: 10, custo: 4, fraude: 6, velocidade: 3, conversao: 8, compliance: 8 },
  },
  {
    id: "retry-logic",
    name: "Retry Logic",
    description: "Retentativas automáticas inteligentes",
    impact: { authRate: 7, custo: -2, fraude: 0, velocidade: -4, conversao: 6, compliance: 1 },
  },
  {
    id: "cascading",
    name: "Cascading",
    description: "Cascateamento entre adquirentes",
    impact: { authRate: 9, custo: -3, fraude: 1, velocidade: -5, conversao: 8, compliance: 2 },
  },
  {
    id: "account-updater",
    name: "Account Updater",
    description: "Atualização automática de cartões",
    impact: { authRate: 8, custo: 3, fraude: 2, velocidade: 2, conversao: 7, compliance: 4 },
  },
  {
    id: "fraud-scoring",
    name: "Fraud Scoring",
    description: "Análise de risco em tempo real",
    impact: { authRate: -2, custo: -1, fraude: 18, velocidade: -2, conversao: -3, compliance: 10 },
  },
  {
    id: "bin-lookup",
    name: "BIN Lookup",
    description: "Identificação do emissor do cartão",
    impact: { authRate: 3, custo: 2, fraude: 5, velocidade: 4, conversao: 2, compliance: 6 },
  },
  {
    id: "dcc",
    name: "DCC",
    description: "Conversão dinâmica de moeda",
    impact: { authRate: 2, custo: -4, fraude: 0, velocidade: -1, conversao: 5, compliance: 3 },
  },
  {
    id: "split-payments",
    name: "Split Payments",
    description: "Divisão de pagamentos (marketplace)",
    impact: { authRate: 0, custo: -3, fraude: 3, velocidade: -3, conversao: 4, compliance: 7 },
  },
];

const PRESETS: Preset[] = [
  {
    id: "ecommerce-br",
    label: "E-commerce BR",
    description: "Otimizado para e-commerce brasileiro",
    features: ["smart-routing", "3ds2", "fraud-scoring", "retry-logic", "bin-lookup"],
  },
  {
    id: "marketplace-latam",
    label: "Marketplace LATAM",
    description: "Para marketplaces na América Latina",
    features: ["smart-routing", "cascading", "split-payments", "fraud-scoring", "dcc"],
  },
  {
    id: "saas-global",
    label: "SaaS Global",
    description: "Recorrência global com alta conversão",
    features: ["network-tokens", "account-updater", "retry-logic", "smart-routing", "bin-lookup"],
  },
  {
    id: "varejo-fisico",
    label: "Varejo Físico",
    description: "Otimizado para ponto de venda",
    features: ["smart-routing", "bin-lookup", "3ds2", "fraud-scoring"],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeRadar(activeIds: Set<string>): RadarImpact {
  const result = { ...BASELINE };
  for (const f of FEATURES) {
    if (activeIds.has(f.id)) {
      for (const axis of RADAR_AXES) {
        result[axis.key] = Math.min(100, Math.max(0, result[axis.key] + f.impact[axis.key]));
      }
    }
  }
  return result;
}

function buildImpactSummary(activeIds: Set<string>): string {
  if (activeIds.size === 0) return "Nenhuma feature ativa. Ative features para ver o impacto.";
  const names = FEATURES.filter((f) => activeIds.has(f.id)).map((f) => f.name);
  const radar = computeRadar(activeIds);
  const authDelta = radar.authRate - BASELINE.authRate;
  const custoDelta = radar.custo - BASELINE.custo;
  const parts: string[] = [];
  if (authDelta !== 0)
    parts.push(`auth rate ${authDelta > 0 ? "+" : ""}${authDelta.toFixed(1)}%`);
  if (custoDelta !== 0)
    parts.push(`custo ${custoDelta > 0 ? "+" : ""}${custoDelta.toFixed(1)}%`);
  if (parts.length === 0) parts.push("impacto neutro nas métricas principais");
  return `Ligando ${names.join(" + ")}: ${parts.join(", ")}`;
}

// ---------------------------------------------------------------------------
// SVG Radar Chart
// ---------------------------------------------------------------------------

function RadarChart({
  data,
  scenarios,
  size = 300,
}: {
  data: RadarImpact;
  scenarios: SavedScenario[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 36;
  const levels = [20, 40, 60, 80, 100];
  const axisCount = RADAR_AXES.length;
  const scenarioColors = ["#f59e0b", "#10b981", "#f43f5e"];

  function polarToCart(value: number, index: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * index) / axisCount - Math.PI / 2;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function buildPolygonPoints(radarData: RadarImpact): string {
    return RADAR_AXES.map((axis, i) => {
      const pt = polarToCart(radarData[axis.key], i);
      return `${pt.x},${pt.y}`;
    }).join(" ");
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      style={{ width: "100%", maxWidth: `${size}px`, height: "auto" }}
    >
      {/* Grid rings */}
      {levels.map((level) => (
        <polygon
          key={level}
          points={RADAR_AXES.map((_, i) => {
            const pt = polarToCart(level, i);
            return `${pt.x},${pt.y}`;
          }).join(" ")}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
          opacity="0.4"
        />
      ))}
      {/* Axis lines */}
      {RADAR_AXES.map((_, i) => {
        const pt = polarToCart(100, i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={pt.x}
            y2={pt.y}
            stroke="var(--border)"
            strokeWidth="1"
            opacity="0.3"
          />
        );
      })}
      {/* Saved scenario polygons */}
      {scenarios.map((sc, si) => (
        <polygon
          key={sc.name}
          points={buildPolygonPoints(sc.radar)}
          fill={scenarioColors[si % scenarioColors.length]}
          fillOpacity="0.07"
          stroke={scenarioColors[si % scenarioColors.length]}
          strokeWidth="1.5"
          strokeDasharray="6 3"
        />
      ))}
      {/* Current data polygon */}
      <polygon
        points={buildPolygonPoints(data)}
        fill="var(--primary)"
        fillOpacity="0.15"
        stroke="var(--primary)"
        strokeWidth="2.5"
      />
      {/* Current data dots */}
      {RADAR_AXES.map((axis, i) => {
        const pt = polarToCart(data[axis.key], i);
        return <circle key={axis.key} cx={pt.x} cy={pt.y} r="4" fill="var(--primary)" />;
      })}
      {/* Axis labels */}
      {RADAR_AXES.map((axis, i) => {
        const pt = polarToCart(115, i);
        return (
          <text
            key={axis.key}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--foreground)"
            fontSize="11"
            fontWeight="600"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
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
  const [activeFeatures, setActiveFeatures] = useState<Set<string>>(new Set());
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [scenarioName, setScenarioName] = useState("");

  const radar = useMemo(() => computeRadar(activeFeatures), [activeFeatures]);
  const impactSummary = useMemo(() => buildImpactSummary(activeFeatures), [activeFeatures]);

  const applyPreset = useCallback((preset: Preset) => {
    setActiveFeatures(new Set(preset.features));
  }, []);

  const toggleFeature = useCallback((id: string) => {
    setActiveFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const saveScenario = useCallback(() => {
    if (!scenarioName.trim()) return;
    if (savedScenarios.length >= 3) return;
    setSavedScenarios((prev) => [
      ...prev,
      { name: scenarioName.trim(), features: new Set(activeFeatures), radar: { ...radar } },
    ]);
    setScenarioName("");
  }, [scenarioName, savedScenarios.length, activeFeatures, radar]);

  const removeScenario = useCallback((index: number) => {
    setSavedScenarios((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const loadScenario = useCallback((sc: SavedScenario) => {
    setActiveFeatures(new Set(sc.features));
  }, []);

  // Styles
  const card: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "24px",
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--foreground)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "16px",
  };

  return (
    <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#fff",
            }}
          >
            {"⚙"}
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--foreground)",
              lineHeight: 1.2,
            }}
          >
            Simulador de Pagamentos
          </h1>
        </div>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          Monte sua arquitetura, ative features e compare cenários. O radar atualiza em
          tempo real.
        </p>
      </div>

      {/* Presets */}
      <div style={{ ...card, marginBottom: "20px" }}>
        <div style={sectionTitle}>Presets</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {PRESETS.map((p) => {
            const isActive =
              p.features.length === activeFeatures.size &&
              p.features.every((f) => activeFeatures.has(f));
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: isActive ? "2px solid var(--primary)" : "1px solid var(--border)",
                  background: isActive ? "var(--primary-bg)" : "var(--background)",
                  color: isActive ? "var(--primary)" : "var(--foreground)",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                title={p.description}
              >
                {p.label}
              </button>
            );
          })}
          <button
            onClick={() => setActiveFeatures(new Set())}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Main grid: Features + Radar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Feature Toggles */}
        <div style={card}>
          <div style={sectionTitle}>Feature Toggles</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {FEATURES.map((f) => {
              const isOn = activeFeatures.has(f.id);
              return (
                <div
                  key={f.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: isOn ? "var(--primary-bg)" : "var(--background)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onClick={() => toggleFeature(f.id)}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: isOn ? "var(--primary)" : "var(--foreground)",
                      }}
                    >
                      {f.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginTop: "2px",
                      }}
                    >
                      {f.description}
                    </div>
                  </div>
                  {/* Toggle Switch */}
                  <div
                    style={{
                      width: "44px",
                      height: "24px",
                      borderRadius: "12px",
                      background: isOn ? "var(--primary)" : "var(--border)",
                      position: "relative",
                      transition: "background 0.2s ease",
                      flexShrink: 0,
                      marginLeft: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "#fff",
                        position: "absolute",
                        top: "3px",
                        left: isOn ? "23px" : "3px",
                        transition: "left 0.2s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Radar Chart + Impact Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={sectionTitle}>Radar de Performance</div>
            <RadarChart data={radar} scenarios={savedScenarios} size={300} />
            {/* Legend for scenarios */}
            {savedScenarios.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "12px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      background: "var(--primary)",
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Atual</span>
                </div>
                {savedScenarios.map((sc, i) => (
                  <div
                    key={sc.name}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "2px",
                        background: ["#f59e0b", "#10b981", "#f43f5e"][i % 3],
                      }}
                    />
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                      {sc.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Impact Summary */}
          <div
            style={{
              ...card,
              background:
                activeFeatures.size > 0
                  ? "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(139,92,246,0.06))"
                  : "var(--surface)",
              borderColor: activeFeatures.size > 0 ? "var(--primary)" : "var(--border)",
            }}
          >
            <div style={sectionTitle}>Resumo de Impacto</div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--foreground)",
                lineHeight: 1.6,
                fontWeight: activeFeatures.size > 0 ? 500 : 400,
              }}
            >
              {impactSummary}
            </p>
            {activeFeatures.size > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "8px",
                  marginTop: "14px",
                }}
              >
                {RADAR_AXES.map((axis) => {
                  const delta = radar[axis.key] - BASELINE[axis.key];
                  const isPositive = delta > 0;
                  return (
                    <div
                      key={axis.key}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "6px",
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                          marginBottom: "2px",
                        }}
                      >
                        {axis.label}
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: delta === 0 ? "var(--text-secondary)" : isPositive ? "#10b981" : "#ef4444",
                        }}
                      >
                        {delta > 0 ? "+" : ""}
                        {delta.toFixed(1)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Scenario */}
      <div style={{ ...card, marginBottom: "20px" }}>
        <div style={sectionTitle}>Salvar Cenário ({savedScenarios.length}/3)</div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Nome do cenário..."
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveScenario();
            }}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              color: "var(--foreground)",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={saveScenario}
            disabled={!scenarioName.trim() || savedScenarios.length >= 3 || activeFeatures.size === 0}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background:
                !scenarioName.trim() || savedScenarios.length >= 3 || activeFeatures.size === 0
                  ? "var(--border)"
                  : "var(--primary)",
              color:
                !scenarioName.trim() || savedScenarios.length >= 3 || activeFeatures.size === 0
                  ? "var(--text-secondary)"
                  : "#fff",
              fontWeight: 600,
              fontSize: "13px",
              cursor:
                !scenarioName.trim() || savedScenarios.length >= 3 || activeFeatures.size === 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Salvar
          </button>
        </div>
        {savedScenarios.length >= 3 && (
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px" }}>
            Limite de 3 cenários atingido. Remova um para salvar outro.
          </p>
        )}
      </div>

      {/* Scenario Comparison Table */}
      {savedScenarios.length > 0 && (
        <div style={{ ...card, marginBottom: "20px", overflowX: "auto" }}>
          <div style={sectionTitle}>Comparação de Cenários</div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderBottom: "2px solid var(--border)",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                  }}
                >
                  Métrica
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "10px 12px",
                    borderBottom: "2px solid var(--border)",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                  }}
                >
                  Baseline
                </th>
                {savedScenarios.map((sc, i) => (
                  <th
                    key={sc.name}
                    style={{
                      textAlign: "center",
                      padding: "10px 12px",
                      borderBottom: "2px solid var(--border)",
                      color: ["#f59e0b", "#10b981", "#f43f5e"][i % 3],
                      fontWeight: 600,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <span>{sc.name}</span>
                      <button
                        onClick={() => loadScenario(sc)}
                        title="Carregar cenário"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          padding: "0",
                          lineHeight: 1,
                        }}
                      >
                        {"↗"}
                      </button>
                      <button
                        onClick={() => removeScenario(i)}
                        title="Remover cenário"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "#ef4444",
                          padding: "0",
                          lineHeight: 1,
                        }}
                      >
                        {"×"}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RADAR_AXES.map((axis) => (
                <tr key={axis.key}>
                  <td
                    style={{
                      padding: "8px 12px",
                      borderBottom: "1px solid var(--border)",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    {axis.label}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "8px 12px",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {BASELINE[axis.key]}
                  </td>
                  {savedScenarios.map((sc) => {
                    const val = sc.radar[axis.key];
                    const delta = val - BASELINE[axis.key];
                    return (
                      <td
                        key={sc.name}
                        style={{
                          textAlign: "center",
                          padding: "8px 12px",
                          borderBottom: "1px solid var(--border)",
                          color: delta > 0 ? "#10b981" : delta < 0 ? "#ef4444" : "var(--text-secondary)",
                          fontWeight: delta !== 0 ? 600 : 400,
                        }}
                      >
                        {val}{" "}
                        {delta !== 0 && (
                          <span style={{ fontSize: "11px" }}>
                            ({delta > 0 ? "+" : ""}
                            {delta})
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Features row */}
              <tr>
                <td
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid var(--border)",
                    fontWeight: 600,
                    color: "var(--foreground)",
                  }}
                >
                  Features
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 12px",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  0
                </td>
                {savedScenarios.map((sc) => (
                  <td
                    key={sc.name}
                    style={{
                      textAlign: "center",
                      padding: "8px 12px",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: "12px",
                    }}
                  >
                    {FEATURES.filter((f) => sc.features.has(f.id))
                      .map((f) => f.name)
                      .join(", ")}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Back link */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <a
          href="/simulation"
          style={{
            fontSize: "14px",
            color: "var(--primary)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          {"← Voltar para Simulação"}
        </a>
      </div>
    </div>
  );
}
