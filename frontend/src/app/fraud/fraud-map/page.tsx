"use client";

import { useState } from "react";
import FeatureLink from "@/components/ui/FeatureLink";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import { fraudPipelineStages, PipelineStage } from "@/data/fraud-data";

/**
 * Mapa de Fraude — Pipeline visual de detecção de fraude em 4 estágios.
 *
 * Cada estágio mostra etapas coloridas por nível de risco, atores envolvidos,
 * timing e features de pagamento exercitadas. Layout horizontal com cards
 * expandíveis para cada estágio do pipeline.
 */

// ---------------------------------------------------------------------------
// Constantes de cor por nível de risco
// ---------------------------------------------------------------------------

const RISK_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  low: {
    bg: "rgba(30, 58, 95, 0.1)",
    border: "rgba(30, 58, 95, 0.3)",
    text: "#1e3a5f",
  },
  medium: {
    bg: "rgba(202, 138, 4, 0.1)",
    border: "rgba(202, 138, 4, 0.3)",
    text: "#ca8a04",
  },
  high: {
    bg: "rgba(234, 88, 12, 0.1)",
    border: "rgba(234, 88, 12, 0.3)",
    text: "#ea580c",
  },
  critical: {
    bg: "rgba(220, 38, 38, 0.1)",
    border: "rgba(220, 38, 38, 0.3)",
    text: "#dc2626",
  },
};

const STAGE_COLORS: Record<PipelineStage["color"], { bg: string; accent: string }> = {
  blue: { bg: "rgba(30, 58, 95, 0.08)", accent: "#1e3a5f" },
  yellow: { bg: "rgba(202, 138, 4, 0.08)", accent: "#ca8a04" },
  orange: { bg: "rgba(234, 88, 12, 0.08)", accent: "#ea580c" },
  red: { bg: "rgba(220, 38, 38, 0.08)", accent: "#dc2626" },
};

const RISK_LABELS: Record<string, string> = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico",
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function FraudMapPage() {
  const quiz = getQuizForPage("/fraud/fraud-map");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    new Set(fraudPipelineStages.map((s) => s.name))
  );

  const toggleStage = (name: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <div style={{ maxWidth: "72rem", marginLeft: "auto", marginRight: "auto" }}>
      {/* ---- Cabecalho da pagina ---- */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Mapa de Fraude</h1>
        <p className="page-description">
          Pipeline completo de detecção de fraude em 4 estágios. Da triagem
          pré-autenticação até a gestão de disputas, visualize cada etapa do
          processo de proteção contra fraudes em pagamentos.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>Pipeline de detecção de fraude em 4 estágios</li>
          <li>Tipos de fraude em pagamentos</li>
          <li>Controles de prevenção e mitigação</li>
        </ul>
      </div>

      {/* ---- Stats ---- */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>12</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Etapas</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Camadas</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tipos Fraude</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>15+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Controles</div>
        </div>
      </div>

      {/* ---- Disclaimer ---- */}
      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem", opacity: 0.7 }}>
        * Numeros podem variar conforme fonte e data de consulta. Valores aproximados para fins didaticos.
      </p>

      {/* ---- Pipeline horizontal (indicadores de estagio) ---- */}
      <div className="card-glow animate-fade-in stagger-2" style={{ marginBottom: "1.5rem" }}>
        <div className="flex items-center justify-between overflow-x-auto" style={{ gap: "0.5rem", paddingBottom: "0.5rem" }}>
          {fraudPipelineStages.map((stage, idx) => {
            const stageStyle = STAGE_COLORS[stage.color];
            return (
              <div key={stage.name} className="flex items-center min-w-0" style={{ gap: "0.5rem" }}>
                {/* Indicador do estagio */}
                <button
                  onClick={() => toggleStage(stage.name)}
                  className="flex items-center rounded-xl text-sm font-medium transition-all hover:scale-105 shadow-sm min-w-0 shrink-0"
                  style={{
                    background: stageStyle.bg,
                    border: `1.5px solid ${stageStyle.accent}`,
                    color: stageStyle.accent,
                    padding: "0.625rem 1rem",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: stageStyle.accent }}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate">{stage.name}</span>
                </button>

                {/* Seta conectora */}
                {idx < fraudPipelineStages.length - 1 && (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="shrink-0"
                    style={{ color: "var(--text-muted)", opacity: 0.4 }}
                  >
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Cards de estagio detalhados ---- */}
      <div className="flex flex-col" style={{ gap: "1.25rem" }}>
        {fraudPipelineStages.map((stage, stageIdx) => {
          const isExpanded = expandedStages.has(stage.name);
          const stageStyle = STAGE_COLORS[stage.color];

          return (
            <div
              key={stage.name}
              className={`card-glow animate-fade-in stagger-${Math.min(stageIdx + 2, 6)}`}
              style={{ borderLeft: `4px solid ${stageStyle.accent}` }}
            >
              {/* Cabecalho do estagio */}
              <button
                onClick={() => toggleStage(stage.name)}
                className="w-full text-left flex items-start transition-colors"
                style={{
                  gap: "1rem",
                  padding: "1.25rem",
                  background: "var(--surface)",
                }}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: stageStyle.accent, marginTop: "0.125rem" }}
                >
                  {stageIdx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold" style={{ marginBottom: "0.25rem" }}>{stage.name}</h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {stage.description}
                  </p>
                </div>

                {/* Chevron */}
                <span
                  className={`transition-transform duration-200 shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              {/* Conteudo expandido */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid var(--border)", background: "var(--surface)", padding: "1.5rem" }}>
                  {/* Metadados do estagio */}
                  <div className="flex flex-wrap text-sm" style={{ gap: "1.5rem", marginBottom: "1.5rem" }}>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Atores: </span>
                      <span className="font-medium">
                        {stage.actors.join(", ")}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Timing: </span>
                      <span className="font-medium">{stage.timing}</span>
                    </div>
                  </div>

                  {/* Features do estagio */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                      Features Envolvidas
                    </h4>
                    <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
                      {stage.features.map((f) => (
                        <FeatureLink key={f} name={f} />
                      ))}
                    </div>
                  </div>

                  {/* Etapas do estagio */}
                  <div className="relative">
                    {stage.steps.map((step, stepIdx) => {
                      const riskColor = RISK_COLORS[step.riskLevel];
                      return (
                        <div
                          key={step.name}
                          className="flex"
                          style={{ gap: "1rem", marginBottom: stepIdx < stage.steps.length - 1 ? "1.25rem" : "0" }}
                        >
                          {/* Indicador da etapa com linha conectora */}
                          <div className="flex flex-col items-center">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{
                                background: riskColor.bg,
                                border: `2px solid ${riskColor.border}`,
                                color: riskColor.text,
                              }}
                            >
                              {stepIdx + 1}
                            </div>
                            {stepIdx < stage.steps.length - 1 && (
                              <div className="w-0.5 flex-1" style={{ background: "var(--border)", marginTop: "0.25rem" }} />
                            )}
                          </div>

                          {/* Conteudo da etapa */}
                          <div className="flex-1" style={{ paddingBottom: "0.25rem" }}>
                            <div className="flex items-center" style={{ gap: "0.5rem", marginBottom: "0.25rem" }}>
                              <h3 className="text-sm font-semibold">
                                {step.name}
                              </h3>
                              <span
                                className="text-[13px] font-semibold rounded-full"
                                style={{
                                  background: riskColor.bg,
                                  color: riskColor.text,
                                  border: `1px solid ${riskColor.border}`,
                                  padding: "0.25rem 0.75rem",
                                }}
                              >
                                Risco {RISK_LABELS[step.riskLevel]}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---- Legenda de risco ---- */}
      <div className="card-glow animate-fade-in stagger-6" style={{ marginTop: "2rem" }}>
        <h3 className="font-semibold" style={{ marginBottom: "0.75rem" }}>Legenda de Nível de Risco</h3>
        <div className="flex flex-wrap" style={{ gap: "0.75rem", marginBottom: "1rem" }}>
          {(["low", "medium", "high", "critical"] as const).map((level) => {
            const c = RISK_COLORS[level];
            return (
              <div
                key={level}
                className="flex items-center rounded-lg text-xs font-medium"
                style={{
                  background: c.bg,
                  color: c.text,
                  border: `1px solid ${c.border}`,
                  padding: "0.375rem 0.75rem",
                  gap: "0.5rem",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: c.text }}
                />
                {RISK_LABELS[level]}
              </div>
            );
          })}
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          O nível de risco indica a criticidade de cada etapa do pipeline.
          Etapas de risco mais alto exigem maior atenção, monitoramento contínuo
          e mecanismos de proteção robustos para minimizar perdas por fraude.
        </p>
      </div>

      {/* ---- Footer: Paginas Relacionadas ---- */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Sinais de Fraude", href: "/fraud/fraud-signals", icon: "🔍" },
          { name: "Ciclo de Chargeback", href: "/fraud/chargeback-lifecycle", icon: "🔄" },
          { name: "Dashboard", href: "/", icon: "📊" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
          </a>
        ))}
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
