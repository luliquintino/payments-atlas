"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import {
  financialLayers,
  FLOW_STEPS,
  CROSS_CONNECTIONS,
  STAT_COLORS,
} from "@/data/financial-system";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FinancialSystemPage() {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());
  const quiz = getQuizForPage("/explore/financial-system");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const toggleLayer = (id: string) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const [showFlow, setShowFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(-1);
  const [flowComplete, setFlowComplete] = useState(false);

  // Compute stats
  const stats = useMemo(() => {
    const totalSubs = financialLayers.reduce((t, l) => t + l.subcategories.length, 0);
    const totalEntities = financialLayers.reduce(
      (t, l) => t + l.subcategories.reduce((s, c) => s + c.items.length, 0), 0
    );
    return { totalSubs, totalEntities };
  }, []);

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
          document.getElementById(`layer-${FLOW_STEPS[i].layer}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          setFlowComplete(true);
          setTimeout(() => { setShowFlow(false); setFlowStep(-1); setFlowComplete(false); }, 2500);
        }
      }, i * stepDelay);
    }
    setTimeout(() => {
      document.getElementById(`layer-${FLOW_STEPS[0].layer}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* ================================================================= */}
      {/* HEADER                                                            */}
      {/* ================================================================= */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Mapa do Sistema Financeiro Global
        </h1>
        <p className="page-description">
          Visao completa de toda a infraestrutura financeira moderna — de usuarios a bancos centrais,
          conectando pagamentos tradicionais, banking, blockchain, stablecoins e DeFi em um unico modelo.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>Como funciona a infraestrutura financeira global</li>
          <li>O papel de câmaras de compensação e bancos centrais</li>
          <li>Diferença entre RTGS e DNS</li>
        </ul>
      </div>

      {/* ================================================================= */}
      {/* STATS                                                             */}
      {/* ================================================================= */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 animate-fade-in stagger-1"
        style={{ gap: "1rem", marginBottom: "2rem" }}
      >
        {[
          { label: "Camadas", value: financialLayers.length, emoji: "📊" },
          { label: "Subcategorias", value: stats.totalSubs, emoji: "📁" },
          { label: "Entidades", value: stats.totalEntities, emoji: "🏢" },
          { label: "Pontes Crypto", value: CROSS_CONNECTIONS.length, emoji: "🔗" },
        ].map((stat, idx) => (
          <div key={stat.label} className="stat-card" style={{ padding: "1.25rem" }}>
            <div className="flex items-center" style={{ gap: "0.875rem" }}>
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${STAT_COLORS[idx].from}, ${STAT_COLORS[idx].to})`,
                  fontSize: "1.125rem",
                }}
              >
                {stat.emoji}
              </div>
              <div>
                <div className="metric-value" style={{ fontSize: "1.5rem" }}>{stat.value}</div>
                <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16, fontStyle: "italic" }}>
        * Esses números (volumes, ativos, transações) podem ter sofrido alteração com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* ================================================================= */}
      {/* CONTROLS                                                          */}
      {/* ================================================================= */}
      <div className="animate-fade-in stagger-2" style={{ marginBottom: "1.5rem" }}>
        <div className="flex items-center" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
          <button
            onClick={startFlowAnimation}
            disabled={showFlow}
            className="rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              padding: "0.625rem 1.25rem",
              background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
              boxShadow: showFlow ? "none" : "0 4px 12px rgba(37,99,235,0.25)",
            }}
          >
            {showFlow ? "Animando fluxo..." : "▶ Ver fluxo de uma transacao"}
          </button>
          {expandedLayers.size > 0 && !showFlow && (
            <button
              onClick={() => setExpandedLayers(new Set())}
              className="rounded-lg border border-[var(--border)] text-sm text-[var(--text-muted)] hover:bg-[var(--surface-hover)] transition-colors"
              style={{ padding: "0.5rem 0.75rem" }}
            >
              Limpar selecao
            </button>
          )}
          <span className="text-xs text-[var(--text-muted)]" style={{ marginLeft: "auto" }}>
            Clique em uma camada para explorar
          </span>
        </div>

        {/* Flow progress bar */}
        {showFlow && (
          <div
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] animate-fade-in"
            style={{ padding: "1rem" }}
          >
            <div className="flex items-center" style={{ gap: "0.25rem", marginBottom: "0.75rem" }}>
              {FLOW_STEPS.map((step, i) => {
                const isActive = flowStep === i;
                const isCompleted = flowStep > i || flowComplete;
                const layerData = financialLayers.find((l) => l.id === step.layer);
                return (
                  <div key={step.layer} className="flex items-center flex-1">
                    <div
                      className="flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-500"
                      style={{
                        width: "1.75rem",
                        height: "1.75rem",
                        borderRadius: "50%",
                        background: isCompleted
                          ? "#10b981"
                          : isActive
                          ? `linear-gradient(135deg, ${layerData?.colorFrom || "#2563eb"}, ${layerData?.colorTo || "#60a5fa"})`
                          : "var(--surface-hover)",
                        color: isCompleted || isActive ? "white" : "var(--text-muted)",
                        transform: isActive ? "scale(1.1)" : isCompleted ? "scale(1)" : "scale(0.9)",
                        boxShadow: isActive ? `0 4px 12px ${layerData?.colorFrom}50` : "none",
                      }}
                    >
                      {isCompleted ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : i + 1}
                    </div>
                    {i < FLOW_STEPS.length - 1 && (
                      <div
                        className="flex-1 rounded-full overflow-hidden"
                        style={{ height: "3px", margin: "0 0.375rem", background: "var(--surface-hover)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: flowStep > i || flowComplete ? "100%" : flowStep === i ? "50%" : "0%",
                            background: flowStep > i || flowComplete ? "#10b981" : layerData?.colorFrom || "var(--primary-light)",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              {flowComplete ? (
                <span className="text-sm font-semibold" style={{ color: "#10b981" }}>
                  Fluxo completo — transacao processada com sucesso
                </span>
              ) : (
                <span className="text-sm font-medium">
                  <span className="font-semibold" style={{ color: financialLayers.find((l) => l.id === FLOW_STEPS[flowStep]?.layer)?.colorFrom || "var(--primary-light)" }}>
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
      {/* LAYER STACK                                                       */}
      {/* ================================================================= */}
      <div className="flex flex-col animate-fade-in stagger-3">
        {financialLayers.map((layer, index) => {
          const isSelected = expandedLayers.has(layer.id);
          const isDimmed = false;
          const flowIndex = FLOW_STEPS.findIndex((s) => s.layer === layer.id);
          const isFlowActive = showFlow && flowStep === flowIndex && !flowComplete;
          const isFlowCompleted = showFlow && (flowComplete || flowIndex < flowStep);
          const isFlowUpcoming = showFlow && flowIndex > flowStep && !flowComplete;

          return (
            <div key={layer.id}>
              {/* Connector between layers during flow */}
              {showFlow && index > 0 && (
                <div className="flex justify-center relative" style={{ padding: "0.25rem 0", zIndex: 10 }}>
                  <div
                    className={`flex flex-col items-center transition-all duration-500`}
                    style={{
                      opacity: flowIndex <= flowStep || flowComplete ? 1 : flowIndex === flowStep + 1 ? 0.6 : 0.2,
                    }}
                  >
                    <div
                      className="rounded-full transition-colors duration-500"
                      style={{
                        width: "3px",
                        height: "0.75rem",
                        background: flowIndex <= flowStep || flowComplete ? "#10b981" : "var(--border)",
                      }}
                    />
                    <svg
                      width="16" height="10" viewBox="0 0 16 10" fill="none"
                      className={`transition-colors duration-500 ${isFlowActive ? "animate-bounce" : ""}`}
                      style={{ color: flowIndex <= flowStep || flowComplete ? "#10b981" : "var(--border)" }}
                    >
                      <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Spacer between layers (no flow) */}
              {!showFlow && index > 0 && <div style={{ height: "1rem" }} />}

              {/* Layer card */}
              <div
                id={`layer-${layer.id}`}
                className="card overflow-hidden transition-all duration-500 ease-out"
                style={{
                  borderLeft: isFlowActive
                    ? `4px solid ${layer.colorFrom}`
                    : isFlowCompleted
                    ? "4px solid #10b98170"
                    : "4px solid transparent",
                  opacity: isFlowUpcoming ? 0.5 : isDimmed ? 0.4 : 1,
                  transform: isFlowActive
                    ? "scale(1.01)"
                    : isFlowUpcoming || isDimmed
                    ? "scale(0.98)"
                    : "scale(1)",
                  boxShadow: isFlowActive ? `0 8px 24px ${layer.colorFrom}30` : undefined,
                }}
              >
                {/* Layer header */}
                <button
                  onClick={() => { if (!showFlow) toggleLayer(layer.id); }}
                  className={`w-full flex items-center text-left text-white transition-all ${
                    !showFlow ? "hover:brightness-110 cursor-pointer" : "cursor-default"
                  }`}
                  style={{
                    padding: "1.25rem 1.5rem",
                    gap: "0.75rem",
                    background: `linear-gradient(135deg, ${layer.colorFrom}, ${layer.colorTo})`,
                  }}
                >
                  {/* Layer number / flow state */}
                  {showFlow ? (
                    isFlowCompleted ? (
                      <span
                        className="flex items-center justify-center shrink-0"
                        style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "#10b981" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                    ) : isFlowActive ? (
                      <span
                        className="flex items-center justify-center shrink-0 animate-pulse"
                        style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }}
                      >
                        <span style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", background: "white" }} />
                      </span>
                    ) : (
                      <span
                        className="flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}
                      >
                        C{index + 1}
                      </span>
                    )
                  ) : (
                    <span
                      className="flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }}
                    >
                      C{index + 1}
                    </span>
                  )}

                  <h2 className="text-lg font-bold flex-1">{layer.name}</h2>

                  {isFlowActive && (
                    <span
                      className="text-sm animate-pulse font-medium"
                      style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", background: "rgba(255,255,255,0.15)" }}
                    >
                      ← {FLOW_STEPS[flowStep]?.label}
                    </span>
                  )}

                  {!showFlow && (
                    <svg
                      width="20" height="20" viewBox="0 0 20 20" fill="none"
                      className={`transition-transform duration-200 ${isSelected ? "rotate-180" : ""}`}
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Layer body */}
                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: isSelected ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div style={{ padding: "1.5rem" }}>
                      <p className="text-sm text-[var(--text-muted)]" style={{ marginBottom: "1rem" }}>
                        {layer.description}
                      </p>

                      {/* Subcategories grid */}
                      <div style={{ marginBottom: "1rem" }}>
                        <h3
                          className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]"
                          style={{ marginBottom: "0.75rem" }}
                        >
                          Subcategorias
                        </h3>
                        <div
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                          style={{ gap: "0.75rem" }}
                        >
                          {layer.subcategories.map((sub) => (
                            <div
                              key={sub.name}
                              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] transition-all hover:shadow-sm"
                              style={{
                                padding: "0.875rem",
                                borderTop: `3px solid ${layer.colorFrom}`,
                              }}
                            >
                              <h4 className="text-sm font-bold" style={{ marginBottom: "0.5rem" }}>
                                {sub.name}
                              </h4>
                              <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                                {sub.items.map((item) => (
                                  <span
                                    key={item}
                                    className="chip-muted"
                                    style={{ fontSize: "0.8125rem", padding: "0.2rem 0.5rem" }}
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dados callout */}
                      <div
                        className="rounded-r-lg"
                        style={{
                          borderLeft: `3px solid ${layer.colorFrom}`,
                          background: "var(--surface-hover)",
                          padding: "0.75rem 1rem",
                          marginTop: "0.75rem",
                        }}
                      >
                        <h3
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: layer.colorFrom, marginBottom: "0.5rem" }}
                        >
                          Dados
                        </h3>
                        <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
                          {layer.examples.map((ex) => (
                            <span
                              key={ex}
                              className="text-sm font-medium"
                              style={{
                                padding: "0.25rem 0.75rem",
                                borderRadius: "9999px",
                                border: `1px solid ${layer.colorFrom}30`,
                                color: "var(--foreground)",
                                background: `${layer.colorFrom}10`,
                              }}
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Atlas links */}
                      <div style={{ marginTop: "1rem" }}>
                        <h3
                          className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]"
                          style={{ marginBottom: "0.5rem" }}
                        >
                          Explorar no Atlas
                        </h3>
                        <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
                          {layer.atlasLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="text-sm font-medium transition-colors"
                              style={{
                                padding: "0.375rem 0.875rem",
                                borderRadius: "0.5rem",
                                border: `1px solid ${layer.colorFrom}40`,
                                color: layer.colorFrom,
                                background: `${layer.colorFrom}08`,
                              }}
                            >
                              → {link.name}
                            </Link>
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
      {/* CROSS CONNECTIONS                                                 */}
      {/* ================================================================= */}
      <div className="animate-fade-in" style={{ marginTop: "2.5rem" }}>
        <h2
          className="text-lg font-bold flex items-center"
          style={{ gap: "0.5rem", marginBottom: "1rem" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--primary-light)]">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Conexoes: Tradicional ↔ Crypto
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "1rem" }}
        >
          {CROSS_CONNECTIONS.map((conn) => (
            <div
              key={conn.via}
              className="card-glow"
              style={{
                padding: "1.25rem",
                borderLeft: `4px solid ${conn.color}`,
              }}
            >
              <div className="flex items-center" style={{ gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span
                  className="text-xs font-bold rounded-full"
                  style={{
                    padding: "0.2rem 0.625rem",
                    background: `${conn.color}15`,
                    color: conn.color,
                    border: `1px solid ${conn.color}30`,
                  }}
                >
                  {conn.direction}
                </span>
              </div>
              <div className="flex items-center text-sm" style={{ gap: "0.5rem", marginBottom: "0.375rem" }}>
                <span className="font-semibold">{conn.from}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0" style={{ color: conn.color }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className="font-semibold">{conn.to}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">via {conn.via}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* COVERAGE                                                          */}
      {/* ================================================================= */}
      <div
        className="card-glow animate-fade-in"
        style={{ marginTop: "2rem", padding: "1.5rem" }}
      >
        <h3 className="font-bold" style={{ marginBottom: "1rem" }}>
          O que o Payments Atlas cobre
        </h3>
        <div
          className="grid grid-cols-2 sm:grid-cols-4"
          style={{ gap: "0.75rem" }}
        >
          {[
            { label: "Pagamentos", href: "/explore/payments-map", color: "#2563eb" },
            { label: "Fraude", href: "/fraud/fraud-map", color: "#ef4444" },
            { label: "Chargebacks", href: "/fraud/chargeback-lifecycle", color: "#f59e0b" },
            { label: "Infra Financeira", href: "/infrastructure/banking-systems", color: "#1e3a5f" },
            { label: "Banking", href: "/infrastructure/settlement-systems", color: "#0ea5e9" },
            { label: "Blockchain", href: "/crypto/blockchain-map", color: "#8b5cf6" },
            { label: "Stablecoins", href: "/crypto/stablecoin-systems", color: "#10b981" },
            { label: "DeFi", href: "/crypto/defi-protocols", color: "#f59e0b" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card-flat interactive-hover flex items-center rounded-lg transition-all"
              style={{
                gap: "0.5rem",
                padding: "0.75rem",
                borderTop: `3px solid ${item.color}`,
              }}
            >
              <span
                className="shrink-0 rounded-full"
                style={{ width: "0.5rem", height: "0.5rem", backgroundColor: item.color }}
              />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: "1rem" }}>
          O Payments Atlas mapeia todo o ecossistema financeiro digital — bancos, pagamentos, fintechs, blockchain — em um unico modelo mental conectado.
        </p>
      </div>

      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
            🧠 Teste seu Conhecimento
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
