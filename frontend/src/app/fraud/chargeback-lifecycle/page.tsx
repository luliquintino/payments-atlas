"use client";

import { useState } from "react";
import FeatureLink from "@/components/ui/FeatureLink";
import { chargebackLifecycle } from "@/data/fraud-data";

/**
 * Ciclo de Chargeback — Timeline vertical do ciclo de vida completo de um
 * chargeback em 8 etapas.
 *
 * Cada etapa mostra atores envolvidos, prazos, documentos necessários e
 * dicas para o lojista. Design de timeline com círculos numerados e linhas
 * conectoras, similar à página de transaction-flows.
 */

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function ChargebackLifecyclePage() {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (step: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) {
        next.delete(step);
      } else {
        next.add(step);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSteps(new Set(chargebackLifecycle.map((s) => s.step)));
  };

  const collapseAll = () => {
    setExpandedSteps(new Set());
  };

  return (
    <div style={{ maxWidth: "64rem", marginLeft: "auto", marginRight: "auto" }}>
      {/* ---- Cabecalho da pagina ---- */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Ciclo de Chargeback</h1>
        <p className="page-description">
          O ciclo de vida completo de um chargeback em 8 etapas, desde a
          transação original até a arbitragem final. Cada etapa detalha atores,
          prazos, documentos necessários e dicas para o lojista maximizar suas
          chances de defesa.
        </p>
      </header>

      {/* ---- Stats ---- */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Etapas</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>4</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Atores</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>120</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Dias Prazo</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Motivos</div>
        </div>
      </div>

      {/* ---- Disclaimer ---- */}
      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem", opacity: 0.7 }}>
        * Numeros podem variar conforme fonte e data de consulta. Valores aproximados para fins didaticos.
      </p>

      {/* ---- Feature relacionada + controles ---- */}
      <div className="card-glow animate-fade-in stagger-2" style={{ marginBottom: "1.5rem" }}>
        <div className="flex items-center justify-between flex-wrap" style={{ gap: "0.75rem" }}>
          <div className="flex items-center" style={{ gap: "0.75rem" }}>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Feature relacionada:
            </span>
            <FeatureLink name="Chargeback Management" />
          </div>
          <div className="flex items-center" style={{ gap: "0.5rem" }}>
            <button
              onClick={expandAll}
              className="rounded-xl border font-medium text-sm transition-all"
              style={{
                padding: "0.5rem 1rem",
                background: "var(--surface-hover)",
                borderColor: "var(--border)",
              }}
            >
              Expandir tudo
            </button>
            <button
              onClick={collapseAll}
              className="rounded-xl border font-medium text-sm transition-all"
              style={{
                padding: "0.5rem 1rem",
                background: "var(--surface-hover)",
                borderColor: "var(--border)",
              }}
            >
              Recolher tudo
            </button>
          </div>
        </div>
      </div>

      {/* ---- Resumo de prazos ---- */}
      <div className="flex flex-wrap animate-fade-in stagger-3" style={{ gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div className="flex items-center rounded-xl text-sm font-medium shadow-sm" style={{ gap: "0.5rem", padding: "0.5rem 1rem", background: "rgba(220, 38, 38, 0.15)", color: "#dc2626" }}>
          <span className="font-bold">120 dias</span>
          <span>Prazo do portador para contestar</span>
        </div>
        <div className="flex items-center rounded-xl text-sm font-medium shadow-sm" style={{ gap: "0.5rem", padding: "0.5rem 1rem", background: "rgba(234, 88, 12, 0.15)", color: "#ea580c" }}>
          <span className="font-bold">30-45 dias</span>
          <span>Prazo do lojista para responder</span>
        </div>
        <div className="flex items-center rounded-xl text-sm font-medium shadow-sm" style={{ gap: "0.5rem", padding: "0.5rem 1rem", background: "rgba(202, 138, 4, 0.15)", color: "#ca8a04" }}>
          <span className="font-bold">60-90 dias</span>
          <span>Prazo de arbitragem final</span>
        </div>
      </div>

      {/* ---- Timeline vertical ---- */}
      <div className="relative animate-fade-in stagger-4">
        {chargebackLifecycle.map((stage, idx) => {
          const isExpanded = expandedSteps.has(stage.step);
          const isLast = idx === chargebackLifecycle.length - 1;

          return (
            <div key={stage.step} className="flex" style={{ gap: "1.25rem", marginBottom: 0 }}>
              {/* Coluna da timeline: circulo + linha */}
              <div className="flex flex-col items-center shrink-0">
                <button
                  onClick={() => toggleStep(stage.step)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 transition-colors z-10"
                  style={{ background: "linear-gradient(to bottom right, var(--primary), var(--primary-light))" }}
                >
                  {stage.step}
                </button>
                {!isLast && (
                  <div className="w-0.5 flex-1" style={{ background: "linear-gradient(to bottom, rgba(var(--primary-rgb, 30, 58, 95), 0.2), var(--border))", minHeight: "24px" }} />
                )}
              </div>

              {/* Conteudo da etapa */}
              <div className="flex-1" style={{ paddingBottom: isLast ? "0" : "1.5rem" }}>
                {/* Card da etapa */}
                <div className="card-glow">
                  {/* Cabecalho clicavel */}
                  <button
                    onClick={() => toggleStep(stage.step)}
                    className="w-full text-left flex items-start justify-between transition-colors"
                    style={{ padding: "1rem", background: "var(--surface)", gap: "0.75rem" }}
                  >
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold" style={{ marginBottom: "0.25rem" }}>
                        {stage.name}
                      </h2>
                      <p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
                        {stage.description}
                      </p>
                    </div>

                    {/* Badges de atores */}
                    <div className="hidden sm:flex items-center shrink-0" style={{ gap: "0.375rem" }}>
                      <span className="text-xs rounded-full" style={{ padding: "0.25rem 0.625rem", background: "var(--surface-hover)", color: "var(--text-muted)" }}>
                        {stage.actors.length} atores
                      </span>
                    </div>

                    {/* Chevron */}
                    <span
                      className={`transition-transform duration-200 shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      style={{ color: "var(--text-muted)", marginTop: "0.125rem" }}
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

                  {/* Detalhes expandidos */}
                  {isExpanded && (
                    <div className="animate-fade-in" style={{ borderTop: "1px solid var(--border)", background: "var(--surface)", padding: "1.25rem" }}>
                      {/* Descricao completa */}
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                        {stage.description}
                      </p>

                      {/* Atores */}
                      <div style={{ marginBottom: "1.25rem" }}>
                        <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                          Atores Envolvidos
                        </h4>
                        <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
                          {stage.actors.map((actor) => (
                            <span
                              key={actor}
                              className="text-xs rounded-lg border"
                              style={{
                                padding: "0.25rem 0.625rem",
                                background: "var(--surface-hover)",
                                color: "var(--foreground)",
                                borderColor: "var(--border)",
                              }}
                            >
                              {actor}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Prazos */}
                      <div style={{ marginBottom: "1.25rem" }}>
                        <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                          Prazos
                        </h4>
                        <ul style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                          {stage.deadlines.map((deadline, i) => (
                            <li
                              key={i}
                              className="flex items-start text-sm"
                              style={{ gap: "0.5rem" }}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--primary)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="shrink-0"
                                style={{ marginTop: "0.125rem" }}
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span style={{ color: "var(--foreground)" }}>
                                {deadline}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Documentos necessarios */}
                      <div style={{ marginBottom: "1.25rem" }}>
                        <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                          Documentos Necessarios
                        </h4>
                        <ul style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                          {stage.requiredDocuments.map((doc, i) => (
                            <li
                              key={i}
                              className="flex items-start text-sm"
                              style={{ gap: "0.5rem" }}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--text-muted)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="shrink-0"
                                style={{ marginTop: "0.125rem" }}
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              <span style={{ color: "var(--foreground)" }}>
                                {doc}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dicas para o lojista */}
                      <div className="rounded-xl" style={{ padding: "1rem", background: "rgba(var(--primary-lighter-rgb, 30, 58, 95), 0.1)", border: "1px solid rgba(var(--primary-lighter-rgb, 30, 58, 95), 0.3)" }}>
                        <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>
                          Dicas para o Lojista
                        </h4>
                        <ul style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                          {stage.merchantTips.map((tip, i) => (
                            <li
                              key={i}
                              className="flex items-start text-sm"
                              style={{ gap: "0.5rem" }}
                            >
                              <span
                                className="shrink-0 w-2 h-2 rounded-full"
                                style={{ background: "var(--primary)", marginTop: "0.375rem" }}
                              />
                              <span style={{ color: "var(--foreground)" }}>
                                {tip}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Nota explicativa ---- */}
      <div className="card-glow animate-fade-in stagger-5" style={{ marginTop: "2rem" }}>
        <h3 className="font-semibold" style={{ marginBottom: "0.75rem" }}>Entendendo o ciclo de chargeback</h3>
        <div className="text-sm" style={{ color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p>
            O processo de chargeback envolve múltiplas partes e pode levar de 30
            a 120 dias para ser resolvido. A taxa de ganho em representments
            varia entre 20-40% dependendo do reason code e da qualidade das
            evidências apresentadas.
          </p>
          <p>
            A prevenção sempre é mais eficaz que a contestação. Investir em
            autenticação forte (3D Secure), descritores claros de cobrança e
            serviços de alerta de pré-disputa pode reduzir significativamente o
            volume de chargebacks recebidos.
          </p>
          <p>
            Para gestão completa de disputas, consulte a feature{" "}
            <FeatureLink name="Chargeback Management" />.
          </p>
        </div>
      </div>

      {/* ---- Footer: Paginas Relacionadas ---- */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Mapa de Fraude", href: "/fraud/fraud-map", icon: "🗺️" },
          { name: "Sinais de Fraude", href: "/fraud/fraud-signals", icon: "🔍" },
          { name: "Dashboard", href: "/", icon: "📊" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
