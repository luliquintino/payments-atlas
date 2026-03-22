"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import { FEATURES_REGISTRY } from "@/data/features";
import { Layer, LAYER_LABELS, COMPLEXITY_LABELS } from "@/data/types";

// ---------------------------------------------------------------------------
// Shared inline styles (globals.css resets margin/padding, so all spacing inline)
// ---------------------------------------------------------------------------

const sectionStyle: React.CSSProperties = {
  padding: "1.5rem",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  marginBottom: "1.25rem",
};

const headingStyle: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 700,
  color: "var(--foreground)",
  marginBottom: "0.75rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  lineHeight: 1.7,
  color: "var(--text-secondary)",
  marginBottom: "0.75rem",
};

const subheadingStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "var(--foreground)",
  marginBottom: "0.5rem",
  marginTop: "1rem",
};

const chipStyle = (bg: string, fg: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "0.15rem 0.55rem",
  borderRadius: 9999,
  fontSize: "0.7rem",
  fontWeight: 600,
  background: bg,
  color: fg,
  marginRight: "0.35rem",
  marginBottom: "0.25rem",
  whiteSpace: "nowrap",
});

const cardStyle: React.CSSProperties = {
  padding: "1.25rem",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--background)",
  marginBottom: "1rem",
};

// ---------------------------------------------------------------------------
// Layer color map for sequence diagram
// ---------------------------------------------------------------------------

const LAYER_COLOR_MAP: Record<Layer, { bg: string; fg: string; accent: string }> = {
  experience: { bg: "rgba(99,102,241,0.08)", fg: "#6366f1", accent: "#818cf8" },
  orchestration: { bg: "rgba(139,92,246,0.08)", fg: "#8b5cf6", accent: "#a78bfa" },
  processing: { bg: "rgba(16,185,129,0.08)", fg: "#10b981", accent: "#34d399" },
  network: { bg: "rgba(245,158,11,0.08)", fg: "#f59e0b", accent: "#fbbf24" },
  banking: { bg: "rgba(239,68,68,0.08)", fg: "#ef4444", accent: "#f87171" },
  settlement: { bg: "rgba(20,184,166,0.08)", fg: "#14b8a6", accent: "#5eead4" },
};

const LAYER_BADGE_COLORS: Record<Layer, { bg: string; fg: string }> = {
  experience: { bg: "rgba(99,102,241,0.12)", fg: "#6366f1" },
  orchestration: { bg: "rgba(139,92,246,0.12)", fg: "#8b5cf6" },
  processing: { bg: "rgba(16,185,129,0.12)", fg: "#10b981" },
  network: { bg: "rgba(245,158,11,0.12)", fg: "#f59e0b" },
  banking: { bg: "rgba(239,68,68,0.12)", fg: "#ef4444" },
  settlement: { bg: "rgba(20,184,166,0.12)", fg: "#14b8a6" },
};

const COMPLEXITY_BADGE: Record<string, { bg: string; fg: string }> = {
  low: { bg: "rgba(16,185,129,0.12)", fg: "#10b981" },
  medium: { bg: "rgba(234,179,8,0.12)", fg: "#ca8a04" },
  high: { bg: "rgba(249,115,22,0.12)", fg: "#ea580c" },
  critical: { bg: "rgba(239,68,68,0.12)", fg: "#dc2626" },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SequenceActor {
  id: string;
  label: string;
  color: string;
}

interface SequenceStep {
  from: number; // index of actor
  to: number; // index of actor
  label: string;
  features: string[];
  payload?: string;
  timing?: string;
  errors?: string;
  async?: boolean;
  layer: Layer;
}

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Collapsible section wrapper
// ---------------------------------------------------------------------------

function CollapsibleSection({
  section,
  index,
}: {
  section: Section;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      className={`animate-fade-in stagger-${Math.min(index + 2, 5)}`}
      style={sectionStyle}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          ...headingStyle,
          cursor: "pointer",
          width: "100%",
          background: "none",
          border: "none",
          textAlign: "left",
          justifyContent: "space-between",
          marginBottom: open ? "0.75rem" : 0,
        }}
        aria-expanded={open}
      >
        <span
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
              flexShrink: 0,
              background: "var(--primary)",
              color: "#fff",
            }}
          >
            {section.icon}
          </span>
          {section.title}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            flexShrink: 0,
            color: "var(--text-secondary)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && section.content}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature chip component
// ---------------------------------------------------------------------------

function FeatureChip({ featureId }: { featureId: string }) {
  const feat = FEATURES_REGISTRY.find((f) => f.id === featureId);
  if (!feat) {
    return (
      <span style={chipStyle("var(--surface)", "var(--text-secondary)")}>
        {featureId}
      </span>
    );
  }
  const c = LAYER_BADGE_COLORS[feat.layer];
  return (
    <Link
      href={`/knowledge/features/${feat.id}`}
      style={{ textDecoration: "none" }}
    >
      <span style={{ ...chipStyle(c.bg, c.fg), cursor: "pointer" }}>
        {feat.name}
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Sequence Diagram Component
// ---------------------------------------------------------------------------

function SequenceDiagram({
  actors,
  steps,
  title,
}: {
  actors: SequenceActor[];
  steps: SequenceStep[];
  title: string;
}) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
      <p style={{ ...subheadingStyle, marginBottom: "0.75rem" }}>{title}</p>

      {/* Actor headers */}
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          marginBottom: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.25rem",
        }}
      >
        {actors.map((actor) => (
          <div
            key={actor.id}
            style={{
              flex: "1 1 0",
              minWidth: 90,
              padding: "0.5rem 0.35rem",
              borderRadius: 8,
              background: actor.color,
              textAlign: "center",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {actor.label}
          </div>
        ))}
      </div>

      {/* Steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
        }}
      >
        {steps.map((step, idx) => {
          const isExpanded = expandedStep === idx;
          const layerColors = LAYER_COLOR_MAP[step.layer];
          const fromIdx = Math.min(step.from, step.to);
          const toIdx = Math.max(step.from, step.to);
          const isReverse = step.to < step.from;

          return (
            <div key={idx}>
              <button
                onClick={() =>
                  setExpandedStep(isExpanded ? null : idx)
                }
                style={{
                  width: "100%",
                  border: `1px solid ${isExpanded ? layerColors.fg : "var(--border)"}`,
                  borderRadius: 8,
                  background: isExpanded
                    ? layerColors.bg
                    : "var(--background)",
                  cursor: "pointer",
                  padding: "0.6rem 0.75rem",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                {/* Step number */}
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    flexShrink: 0,
                    background: layerColors.fg,
                    color: "#fff",
                  }}
                >
                  {step.async ? "~" : idx + 1}
                </span>

                {/* Arrow visualization */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    <span style={{ color: layerColors.fg }}>
                      {actors[step.from].label}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        color: layerColors.fg,
                      }}
                    >
                      {isReverse ? (
                        <svg
                          width="16"
                          height="10"
                          viewBox="0 0 16 10"
                          fill="none"
                        >
                          <path
                            d="M15 5H1M1 5L5 1M1 5L5 9"
                            stroke={layerColors.fg}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="10"
                          viewBox="0 0 16 10"
                          fill="none"
                        >
                          <path
                            d="M1 5H15M15 5L11 1M15 5L11 9"
                            stroke={layerColors.fg}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span style={{ color: layerColors.fg }}>
                      {actors[step.to].label}
                    </span>
                    {step.async && (
                      <span
                        style={{
                          ...chipStyle(
                            "rgba(139,92,246,0.12)",
                            "#8b5cf6"
                          ),
                          fontSize: "0.6rem",
                        }}
                      >
                        async
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.4,
                    }}
                  >
                    {step.label}
                  </div>
                </div>

                {/* Expand indicator */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: isExpanded
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.15s ease",
                    flexShrink: 0,
                    color: "var(--text-secondary)",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    marginTop: "0.25rem",
                    marginBottom: "0.35rem",
                    borderRadius: 8,
                    border: `1px solid ${layerColors.accent}40`,
                    background: layerColors.bg,
                  }}
                >
                  {/* Feature chips */}
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        display: "block",
                        marginBottom: "0.3rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Features envolvidas
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {step.features.map((fId) => (
                        <FeatureChip key={fId} featureId={fId} />
                      ))}
                    </div>
                  </div>

                  {/* Payload */}
                  {step.payload && (
                    <div style={{ marginBottom: "0.5rem" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          display: "block",
                          marginBottom: "0.3rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Payload exemplo
                      </span>
                      <pre
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: 6,
                          padding: "0.6rem 0.8rem",
                          fontSize: "0.7rem",
                          lineHeight: 1.5,
                          overflowX: "auto",
                          color: "var(--foreground)",
                          fontFamily: "monospace",
                          margin: 0,
                        }}
                      >
                        {step.payload}
                      </pre>
                    </div>
                  )}

                  {/* Timing */}
                  {step.timing && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Timing:
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--foreground)",
                        }}
                      >
                        {step.timing}
                      </span>
                    </div>
                  )}

                  {/* Errors */}
                  {step.errors && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: "#ef4444",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          flexShrink: 0,
                        }}
                      >
                        Falhas possiveis:
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.5,
                        }}
                      >
                        {step.errors}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dependency Chain Component
// ---------------------------------------------------------------------------

function DependencyChain({
  chain,
  label,
}: {
  chain: string[];
  label: string;
}) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--text-secondary)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.25rem",
        }}
      >
        {chain.map((fId, i) => {
          const feat = FEATURES_REGISTRY.find((f) => f.id === fId);
          const layer = feat?.layer || "experience";
          const c = LAYER_BADGE_COLORS[layer];
          return (
            <span
              key={fId}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
            >
              <Link
                href={`/knowledge/features/${fId}`}
                style={{
                  textDecoration: "none",
                  padding: "0.2rem 0.6rem",
                  borderRadius: 6,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  background: c.bg,
                  color: c.fg,
                  border: `1px solid ${c.fg}30`,
                  whiteSpace: "nowrap",
                }}
              >
                {feat?.name || fId}
              </Link>
              {i < chain.length - 1 && (
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M1 5H15M15 5L11 1M15 5L11 9"
                    stroke="var(--text-secondary)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature Catalogue Card
// ---------------------------------------------------------------------------

function FeatureCatalogueCard({
  feature,
  flowAppearances,
}: {
  feature: (typeof FEATURES_REGISTRY)[number];
  flowAppearances: string[];
}) {
  const c = LAYER_BADGE_COLORS[feature.layer];
  const cx = COMPLEXITY_BADGE[feature.complexity] || COMPLEXITY_BADGE.medium;
  return (
    <Link
      href={`/knowledge/features/${feature.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          padding: "0.85rem 1rem",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--background)",
          marginBottom: "0.5rem",
          cursor: "pointer",
          transition: "border-color 0.15s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.5rem",
            marginBottom: "0.3rem",
          }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            {feature.name}
          </span>
          <span style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
            <span style={chipStyle(cx.bg, cx.fg)}>
              {COMPLEXITY_LABELS[feature.complexity]}
            </span>
            <span style={chipStyle(c.bg, c.fg)}>
              {feature.dependencies?.length || 0} deps
            </span>
          </span>
        </div>
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            marginBottom: "0.3rem",
          }}
        >
          {feature.description.length > 120
            ? feature.description.slice(0, 120) + "..."
            : feature.description}
        </p>
        {flowAppearances.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.2rem" }}>
            {flowAppearances.map((flow) => (
              <span
                key={flow}
                style={chipStyle("rgba(99,102,241,0.08)", "#6366f1")}
              >
                {flow}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Data: Sequence Diagram Definitions
// ---------------------------------------------------------------------------

const CARD_ACTORS: SequenceActor[] = [
  { id: "cliente", label: "Cliente", color: "#6366f1" },
  { id: "checkout", label: "Checkout", color: "#818cf8" },
  { id: "gateway", label: "Gateway/PSP", color: "#8b5cf6" },
  { id: "orchestrator", label: "Orquestrador", color: "#a78bfa" },
  { id: "processor", label: "Processador", color: "#10b981" },
  { id: "network", label: "Rede/Bandeira", color: "#f59e0b" },
  { id: "issuer", label: "Emissor", color: "#ef4444" },
  { id: "settlement", label: "Liquidacao", color: "#14b8a6" },
];

const CARD_STEPS: SequenceStep[] = [
  {
    from: 0,
    to: 1,
    label: "Inicia pagamento (dados do cartao)",
    features: ["checkout-ui", "payment-method-selection", "mobile-sdks"],
    timing: "Interacao do usuario (1-30s)",
    errors: "Formulario invalido, timeout de sessao",
    layer: "experience",
  },
  {
    from: 1,
    to: 2,
    label: "Tokeniza e envia (HTTPS/TLS)",
    features: ["pci-vault", "idempotency", "webhooks"],
    payload: `{
  "card_token": "tok_xxx",
  "amount": 15000,
  "currency": "BRL",
  "idempotency_key": "uuid-v4"
}`,
    timing: "50-200ms",
    errors: "Tokenizacao falhou, chave duplicada",
    layer: "processing",
  },
  {
    from: 2,
    to: 3,
    label: "Roteia transacao para melhor adquirente",
    features: ["smart-routing", "bin-lookup", "retry-logic", "cascading"],
    payload: `{
  "route": {
    "acquirer": "stone",
    "reason": "best_auth_rate",
    "bin_country": "BR"
  }
}`,
    timing: "5-15ms (decisao de roteamento)",
    errors: "Todos adquirentes indisponiveis, BIN nao reconhecido",
    layer: "orchestration",
  },
  {
    from: 3,
    to: 4,
    label: "Processa autorizacao com analise de fraude",
    features: ["fraud-scoring", "velocity-checks", "3d-secure", "emv-3ds"],
    payload: `{
  "fraud_score": 23,
  "velocity_ok": true,
  "threeds": {
    "eci": "05",
    "cavv": "AJkBBkhAAAAg..."
  }
}`,
    timing: "100-500ms (inclui 3DS se aplicavel)",
    errors: "Score de fraude alto -> bloqueio, challenge 3DS timeout",
    layer: "processing",
  },
  {
    from: 4,
    to: 5,
    label: "Envia mensagem ISO 8583 para a rede",
    features: ["iso-8583", "network-tokenization", "interchange-qualification"],
    payload: `{
  "mti": "0100",
  "de2": "tok_network_xxx",
  "de4": "000000015000",
  "de49": "986"
}`,
    timing: "50-150ms",
    errors: "Timeout de rede, formato ISO invalido",
    layer: "network",
  },
  {
    from: 5,
    to: 6,
    label: "Solicita autorizacao ao emissor",
    features: ["issuer-authorization", "real-time-auth", "account-updater"],
    payload: `{
  "auth_decision": "approved",
  "auth_code": "A12345",
  "avs_result": "Y"
}`,
    timing: "200-800ms",
    errors: "Saldo insuficiente, cartao bloqueado, suspeita de fraude",
    layer: "banking",
  },
  {
    from: 6,
    to: 5,
    label: "Retorna resposta de autorizacao",
    features: [],
    timing: "<100ms",
    layer: "banking",
  },
  {
    from: 5,
    to: 4,
    label: "Resposta da rede com codigo de autorizacao",
    features: [],
    timing: "<100ms",
    layer: "network",
  },
  {
    from: 4,
    to: 2,
    label: "Resultado da autorizacao",
    features: ["webhooks", "soft-descriptor"],
    payload: `{
  "status": "approved",
  "auth_code": "A12345",
  "descriptor": "LOJA*PED123"
}`,
    timing: "<50ms",
    layer: "processing",
  },
  {
    from: 2,
    to: 0,
    label: "Confirmacao ao cliente",
    features: ["checkout-ui"],
    timing: "Imediato",
    layer: "experience",
  },
  {
    from: 4,
    to: 7,
    label: "Clearing D+1 — compensacao",
    features: [
      "clearing-compensation",
      "settlement-reconciliation",
      "interchange-optimization",
    ],
    timing: "T+1 (proximo dia util)",
    errors: "Discrepancias de clearing, rejeicao de batch",
    async: true,
    layer: "settlement",
  },
  {
    from: 7,
    to: 2,
    label: "Funding D+2 — repasse ao merchant",
    features: [
      "settlement-cycles",
      "reserve-retention",
      "ledger-reconciliation",
    ],
    timing: "T+2 a T+30 (depende do adquirente)",
    errors: "Retencao de reserva, atraso de liquidacao",
    async: true,
    layer: "settlement",
  },
];

const PIX_ACTORS: SequenceActor[] = [
  { id: "cliente", label: "Cliente", color: "#10b981" },
  { id: "app", label: "App Banco/PSP", color: "#34d399" },
  { id: "spi", label: "SPI (BCB)", color: "#f59e0b" },
  { id: "recebedor", label: "Banco Recebedor", color: "#14b8a6" },
  { id: "merchant", label: "Merchant", color: "#6366f1" },
];

const PIX_STEPS: SequenceStep[] = [
  {
    from: 0,
    to: 1,
    label: "Gera QR Code / Copia-e-Cola",
    features: ["pix-integration", "qr-code-payments", "checkout-ui"],
    timing: "Interacao do usuario",
    errors: "QR expirado, valor divergente",
    layer: "experience",
  },
  {
    from: 1,
    to: 2,
    label: "Envia ordem de pagamento via SPI",
    features: ["pix-integration"],
    timing: "1-3 segundos",
    errors: "Falha SPI, saldo insuficiente",
    layer: "network",
  },
  {
    from: 2,
    to: 3,
    label: "Credita em tempo real",
    features: ["settlement-reconciliation", "webhooks"],
    timing: "< 10 segundos",
    layer: "settlement",
  },
  {
    from: 3,
    to: 4,
    label: "Notificacao instantanea de recebimento",
    features: ["webhooks"],
    timing: "Imediato",
    layer: "experience",
  },
];

const CROSSBORDER_ACTORS: SequenceActor[] = [
  { id: "cliente", label: "Cliente (EU)", color: "#0ea5e9" },
  { id: "checkout", label: "Checkout", color: "#38bdf8" },
  { id: "psp", label: "PSP", color: "#8b5cf6" },
  { id: "orchestrator", label: "Orquestrador", color: "#a78bfa" },
  { id: "network", label: "Rede", color: "#f59e0b" },
  { id: "issuer", label: "Emissor (EU)", color: "#ef4444" },
  { id: "settlement", label: "Settlement", color: "#14b8a6" },
];

const CROSSBORDER_STEPS: SequenceStep[] = [
  {
    from: 0,
    to: 1,
    label: "Pagamento em EUR",
    features: ["checkout-ui", "currency-conversion", "payment-method-selection"],
    timing: "Interacao do usuario",
    layer: "experience",
  },
  {
    from: 1,
    to: 2,
    label: "DCC offer (Dynamic Currency Conversion)",
    features: ["currency-conversion", "bin-lookup"],
    payload: `{
  "original_currency": "EUR",
  "offer_currency": "BRL",
  "fx_rate": 5.42,
  "markup": "3.5%"
}`,
    timing: "100-300ms",
    layer: "processing",
  },
  {
    from: 2,
    to: 3,
    label: "Roteamento cross-border otimizado",
    features: [
      "smart-routing",
      "cross-border-optimization",
      "local-acquiring",
    ],
    timing: "5-15ms",
    errors: "Nenhum adquirente local disponivel, fallback cross-border",
    layer: "orchestration",
  },
  {
    from: 3,
    to: 4,
    label: "Autorizacao internacional",
    features: ["iso-8583", "network-tokenization", "sca"],
    timing: "300-1200ms (latencia cross-border)",
    layer: "network",
  },
  {
    from: 4,
    to: 5,
    label: "Auth com SCA (Strong Customer Authentication)",
    features: ["issuer-authorization", "emv-3ds", "sca"],
    timing: "500ms-2min (challenge SCA)",
    errors: "SCA timeout, autenticacao falhou",
    layer: "banking",
  },
  {
    from: 5,
    to: 6,
    label: "Clearing + FX conversion (async)",
    features: ["fx-conversion", "clearing-compensation", "settlement-cycles"],
    timing: "T+1 a T+3",
    errors: "Variacao cambial, discrepancia FX",
    async: true,
    layer: "settlement",
  },
];

const MARKETPLACE_ACTORS: SequenceActor[] = [
  { id: "cliente", label: "Cliente", color: "#f59e0b" },
  { id: "checkout", label: "Checkout MKP", color: "#fbbf24" },
  { id: "psp", label: "PSP", color: "#8b5cf6" },
  { id: "submerchants", label: "Sub-merchants", color: "#10b981" },
  { id: "settlement", label: "Liquidacao", color: "#14b8a6" },
];

const MARKETPLACE_STEPS: SequenceStep[] = [
  {
    from: 0,
    to: 1,
    label: "Compra de multiplos sellers em pedido unico",
    features: ["checkout-ui", "payment-facilitator"],
    timing: "Interacao do usuario",
    layer: "experience",
  },
  {
    from: 1,
    to: 2,
    label: "Pagamento unico com instrucoes de split",
    features: ["pci-vault", "split-payments"],
    payload: `{
  "total": 30000,
  "splits": [
    { "seller_id": "s1", "amount": 18000 },
    { "seller_id": "s2", "amount": 10000 },
    { "marketplace_fee": 2000 }
  ]
}`,
    timing: "2-5s (auth completa)",
    layer: "orchestration",
  },
  {
    from: 2,
    to: 3,
    label: "Split de liquidacao por sub-merchant",
    features: [
      "split-payments",
      "sub-merchant-onboarding",
      "settlement-reconciliation",
    ],
    timing: "T+1 a T+30",
    errors: "Sub-merchant nao cadastrado, saldo retido",
    layer: "settlement",
  },
  {
    from: 3,
    to: 4,
    label: "Repasse aos sellers (async)",
    features: [
      "settlement-cycles",
      "reserve-retention",
      "ledger-reconciliation",
    ],
    timing: "D+2 a D+30 (conforme contrato)",
    async: true,
    layer: "settlement",
  },
];

const RECURRING_ACTORS: SequenceActor[] = [
  { id: "merchant", label: "Merchant", color: "#8b5cf6" },
  { id: "gateway", label: "Gateway/PSP", color: "#a78bfa" },
  { id: "network", label: "Rede", color: "#f59e0b" },
  { id: "issuer", label: "Emissor", color: "#ef4444" },
  { id: "dunning", label: "Dunning", color: "#f43f5e" },
];

const RECURRING_STEPS: SequenceStep[] = [
  {
    from: 0,
    to: 1,
    label: "Setup inicial com credential-on-file",
    features: [
      "recurring-billing",
      "credential-on-file",
      "pci-vault",
      "network-tokenization",
    ],
    payload: `{
  "type": "setup",
  "cof_type": "recurring",
  "initial_transaction": true,
  "consent": "cardholder_initiated"
}`,
    timing: "Primeira cobranca (CIT)",
    layer: "orchestration",
  },
  {
    from: 0,
    to: 1,
    label: "Cobranças subsequentes (MIT - Merchant Initiated)",
    features: ["mit", "account-updater", "retry-logic", "recurring-billing"],
    payload: `{
  "type": "recurring",
  "cof_type": "recurring",
  "initial_transaction": false,
  "stored_credential_ref": "sc_xxx"
}`,
    timing: "Conforme ciclo (mensal, anual...)",
    errors: "Cartao expirado, saldo insuficiente",
    layer: "processing",
  },
  {
    from: 1,
    to: 4,
    label: "Falha na cobranca -> ativa dunning",
    features: ["retry-logic", "cascading", "webhooks"],
    timing: "Imediato apos falha",
    errors: "Todas tentativas falharam",
    layer: "orchestration",
  },
  {
    from: 4,
    to: 0,
    label: "Cancelamento ou disputa do assinante",
    features: ["chargeback-management", "refund-processing"],
    timing: "Variavel",
    layer: "settlement",
  },
];

// ---------------------------------------------------------------------------
// Flow-to-feature mapping for Section 6 "Em quais fluxos aparece"
// ---------------------------------------------------------------------------

const FLOW_FEATURE_MAP: Record<string, string[]> = {
  "Cartao": CARD_STEPS.flatMap((s) => s.features),
  "PIX": PIX_STEPS.flatMap((s) => s.features),
  "Cross-Border": CROSSBORDER_STEPS.flatMap((s) => s.features),
  "Marketplace": MARKETPLACE_STEPS.flatMap((s) => s.features),
  "Recorrencia": RECURRING_STEPS.flatMap((s) => s.features),
};

function getFlowAppearances(featureId: string): string[] {
  const flows: string[] = [];
  for (const [flow, feats] of Object.entries(FLOW_FEATURE_MAP)) {
    if (feats.includes(featureId)) flows.push(flow);
  }
  return flows;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function FeatureDiscoveryPage() {
  const quiz = getQuizForPage("/knowledge/feature-discovery");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Group features by layer for Section 6
  const featuresByLayer = useMemo(() => {
    const grouped: Record<Layer, (typeof FEATURES_REGISTRY)[number][]> = {
      experience: [],
      orchestration: [],
      processing: [],
      network: [],
      banking: [],
      settlement: [],
    };
    for (const f of FEATURES_REGISTRY) {
      grouped[f.layer].push(f);
    }
    // sort each group by category, then name
    for (const layer of Object.keys(grouped) as Layer[]) {
      grouped[layer].sort((a, b) =>
        a.category === b.category
          ? a.name.localeCompare(b.name)
          : a.category.localeCompare(b.category)
      );
    }
    return grouped;
  }, []);

  // -----------------------------------------------------------------------
  // Sections
  // -----------------------------------------------------------------------

  const sections: Section[] = [
    // ─── Section 1: Card Payment Flow ───
    {
      id: "fluxo-cartao",
      title: "Fluxo Completo de um Pagamento com Cartao",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Este diagrama mostra todas as etapas de um pagamento com cartao de credito — desde o
            momento em que o cliente insere os dados ate a liquidacao final ao merchant. Cada etapa
            indica as features envolvidas e um payload de exemplo.
          </p>
          <SequenceDiagram
            actors={CARD_ACTORS}
            steps={CARD_STEPS}
            title="Pagamento com Cartao — Sequence Diagram"
          />
        </>
      ),
    },

    // ─── Section 2: PIX Flow ───
    {
      id: "fluxo-pix",
      title: "Fluxo PIX — Pagamento Instantaneo",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            O PIX e o meio de pagamento instantaneo brasileiro, operado pelo Banco Central.
            A liquidacao ocorre em tempo real (menos de 10 segundos), 24/7, sem intermediarios
            tradicionais como redes de cartao.
          </p>
          <SequenceDiagram
            actors={PIX_ACTORS}
            steps={PIX_STEPS}
            title="PIX — Sequence Diagram"
          />
        </>
      ),
    },

    // ─── Section 3: Cross-Border Flow ───
    {
      id: "fluxo-cross-border",
      title: "Fluxo Cross-Border — Pagamento Internacional",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Transacoes cross-border envolvem conversao de moeda, autenticacao SCA (obrigatoria na
            UE/EEA), roteamento otimizado para adquirencia local, e clearing com conversao FX.
            A latencia e significativamente maior que em transacoes domesticas.
          </p>
          <SequenceDiagram
            actors={CROSSBORDER_ACTORS}
            steps={CROSSBORDER_STEPS}
            title="Cross-Border — Sequence Diagram"
          />
        </>
      ),
    },

    // ─── Section 4: Marketplace/Split Flow ───
    {
      id: "fluxo-marketplace",
      title: "Fluxo Marketplace / Split Payment",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Marketplaces processam um unico pagamento do cliente e dividem a liquidacao entre
            multiplos sellers (sub-merchants). O Payment Facilitator (PayFac) assume a
            responsabilidade pelo KYC e compliance dos sellers.
          </p>
          <SequenceDiagram
            actors={MARKETPLACE_ACTORS}
            steps={MARKETPLACE_STEPS}
            title="Marketplace / Split — Sequence Diagram"
          />
        </>
      ),
    },

    // ─── Section 5: Recurring/Subscription Flow ───
    {
      id: "fluxo-recorrencia",
      title: "Fluxo de Recorrencia / Assinatura",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Assinaturas usam credential-on-file para armazenar credenciais e realizar cobranças
            periodicas (MIT). O Account Updater garante que cartoes expirados sejam atualizados
            automaticamente. Quando uma cobranca falha, o fluxo de dunning entra em acao com
            retentativas inteligentes.
          </p>
          <SequenceDiagram
            actors={RECURRING_ACTORS}
            steps={RECURRING_STEPS}
            title="Recorrencia / Assinatura — Sequence Diagram"
          />
        </>
      ),
    },

    // ─── Section 6: Complete Feature Catalogue by Layer ───
    {
      id: "catalogo-camadas",
      title: "Catalogo Completo por Camada",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Todas as {FEATURES_REGISTRY.length} features organizadas por camada. Cada feature
            indica sua complexidade, quantidade de dependencias e em quais fluxos aparece nos
            diagramas acima.
          </p>

          {(Object.keys(featuresByLayer) as Layer[]).map((layer) => {
            const features = featuresByLayer[layer];
            const lc = LAYER_BADGE_COLORS[layer];
            if (features.length === 0) return null;

            // Group by category within layer
            const byCategory: Record<string, typeof features> = {};
            for (const f of features) {
              if (!byCategory[f.category]) byCategory[f.category] = [];
              byCategory[f.category].push(f);
            }

            return (
              <div
                key={layer}
                style={{
                  marginBottom: "1.25rem",
                  padding: "1rem",
                  borderRadius: 10,
                  border: `1px solid ${lc.fg}25`,
                  background: lc.bg,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={chipStyle(lc.bg, lc.fg)}>
                    {LAYER_LABELS[layer]}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    {features.length} features
                  </span>
                </div>

                {Object.entries(byCategory).map(([cat, feats]) => (
                  <div key={cat} style={{ marginBottom: "0.75rem" }}>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {cat}
                    </p>
                    {feats.map((f) => (
                      <FeatureCatalogueCard
                        key={f.id}
                        feature={f}
                        flowAppearances={getFlowAppearances(f.id)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </>
      ),
    },

    // ─── Section 7: Critical Dependency Map ───
    {
      id: "mapa-dependencias",
      title: "Mapa de Dependencias Criticas",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            As cadeias de dependencia mais criticas do ecossistema de pagamentos. Cada seta indica
            que a feature da esquerda depende da feature da direita para funcionar corretamente.
            Uma falha em qualquer elo afeta toda a cadeia.
          </p>

          <DependencyChain
            chain={[
              "checkout-ui",
              "pci-vault",
              "network-tokenization",
              "account-updater",
            ]}
            label="Cadeia de Tokenizacao (Checkout -> Vault -> Network Token -> Account Updater)"
          />
          <DependencyChain
            chain={["smart-routing", "bin-lookup"]}
            label="Cadeia de Roteamento (Routing -> BIN Lookup)"
          />
          <DependencyChain
            chain={["3d-secure", "fraud-scoring", "velocity-checks"]}
            label="Cadeia de Autenticacao (3DS -> Fraud Score -> Velocity)"
          />
          <DependencyChain
            chain={[
              "recurring-billing",
              "account-updater",
              "network-tokenization",
            ]}
            label="Cadeia de Recorrencia (Billing -> Account Updater -> Network Token)"
          />
          <DependencyChain
            chain={[
              "chargeback-management",
              "settlement-reconciliation",
              "clearing-compensation",
            ]}
            label="Cadeia de Disputa (Chargeback -> Reconciliation -> Clearing)"
          />
          <DependencyChain
            chain={[
              "split-payments",
              "sub-merchant-onboarding",
              "payment-facilitator",
            ]}
            label="Cadeia Marketplace (Split -> Sub-Merchant -> PayFac)"
          />
          <DependencyChain
            chain={["iso-8583", "interchange-qualification", "clearing-compensation"]}
            label="Cadeia de Rede (ISO 8583 -> Interchange -> Clearing)"
          />
        </>
      ),
    },
  ];

  // -----------------------------------------------------------------------
  // Stats
  // -----------------------------------------------------------------------

  const stats = [
    {
      label: "Features",
      value: `${FEATURES_REGISTRY.length}+`,
      color: "#6366f1",
    },
    { label: "Camadas", value: "6", color: "#10b981" },
    { label: "Fluxos Interativos", value: "5", color: "#f59e0b" },
    { label: "Diagramas", value: "50+", color: "#ef4444" },
  ];

  // -----------------------------------------------------------------------
  // Learning Objectives
  // -----------------------------------------------------------------------

  const objectives = [
    "Como cada feature se encaixa no fluxo de pagamento",
    "Sequence diagrams de interacao entre atores",
    "Exemplos praticos de payloads em cada etapa",
    "Dependencias e impacto entre features",
  ];

  // -----------------------------------------------------------------------
  // Related Pages
  // -----------------------------------------------------------------------

  const relatedPages = [
    {
      href: "/knowledge/payments-map",
      title: "Mapa de Pagamentos",
      desc: "Visao geral do ecossistema",
    },
    {
      href: "/explore/transaction-flows",
      title: "Fluxos de Transacao",
      desc: "8 fluxos detalhados passo a passo",
    },
    {
      href: "/explore/dependency-graph",
      title: "Grafo de Dependencias",
      desc: "Visualizacao interativa de dependencias",
    },
    {
      href: "/explore/features",
      title: "Base de Features",
      desc: "Busca e filtro de todas as features",
    },
  ];

  return (
    <div
      style={{
        maxWidth: 960,
        marginLeft: "auto",
        marginRight: "auto",
        paddingTop: "2.5rem",
        paddingBottom: "4rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      }}
    >
      {/* ── Header ── */}
      <div className="animate-fade-in" style={{ marginBottom: "2rem" }}>
        <Link
          href="/knowledge"
          style={{
            fontSize: "0.8rem",
            color: "var(--primary)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "1rem",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Knowledge Base
        </Link>

        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--foreground)",
            marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}
        >
          Feature Discovery — Guia Completo
        </h1>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: "1.25rem",
          }}
        >
          Todas as features de pagamento com sequence diagrams interativos e
          exemplos de fluxo
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                padding: "0.85rem 1rem",
                borderRadius: 10,
                border: "1px solid var(--border)",
                borderLeft: `4px solid ${s.color}`,
                background: "var(--surface)",
              }}
            >
              <div
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  color: s.color,
                  marginBottom: "0.15rem",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Learning objectives */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: 10,
            border: "1px solid rgba(99,102,241,0.2)",
            background: "rgba(99,102,241,0.04)",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--primary)",
              marginBottom: "0.5rem",
            }}
          >
            Objetivos de Aprendizado
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.35rem",
            }}
          >
            {objectives.map((obj, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.4rem",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    color: "var(--primary)",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: "0.1rem",
                  }}
                >
                  *
                </span>
                {obj}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sections ── */}
      {sections.map((section, idx) => (
        <CollapsibleSection key={section.id} section={section} index={idx} />
      ))}

      {/* ── Quiz ── */}
      {quiz && (
        <div
          className="animate-fade-in stagger-5"
          style={{
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <PageQuiz
            questions={quiz.questions}
            onComplete={(correct, total, xpEarned) => {
              recordQuiz(quiz.pageRoute, correct, total, xpEarned);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}

      {/* ── Related Pages ── */}
      <div
        className="animate-fade-in stagger-5"
        style={{
          padding: "1.25rem",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          marginTop: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--foreground)",
            marginBottom: "0.75rem",
          }}
        >
          Paginas Relacionadas
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {relatedPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              style={{
                textDecoration: "none",
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--background)",
                transition: "border-color 0.15s ease",
              }}
            >
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                  marginBottom: "0.2rem",
                }}
              >
                {page.title}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-secondary)",
                }}
              >
                {page.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
