"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useTrailProgress } from "@/hooks/useTrailProgress";
import { LEARNING_TRAILS } from "@/data/learning-trails";

export default function TrilhasPage() {
  const { pagesVisited } = useGameProgress();
  const { progress, setActiveTrail, getTrailProgress } = useTrailProgress();

  /* ── Aggregated stats ────────────────────────────────── */
  const stats = useMemo(() => {
    const totalTrails = LEARNING_TRAILS.length;
    const completedTrails = LEARNING_TRAILS.filter((t) =>
      t.pages.every((p) => pagesVisited.includes(p.path))
    ).length;

    const allPages = LEARNING_TRAILS.flatMap((t) => t.pages.map((p) => p.path));
    const uniquePages = [...new Set(allPages)];
    const visitedUnique = uniquePages.filter((p) => pagesVisited.includes(p)).length;
    const overallPercent =
      uniquePages.length > 0 ? Math.round((visitedUnique / uniquePages.length) * 100) : 0;

    return {
      totalTrails,
      completedTrails,
      totalPages: uniquePages.length,
      visitedPages: visitedUnique,
      overallPercent,
    };
  }, [pagesVisited]);

  /* ── Helpers ─────────────────────────────────────────── */
  function getNextPage(trailId: string) {
    const trail = LEARNING_TRAILS.find((t) => t.id === trailId);
    if (!trail) return undefined;
    return trail.pages.find((p) => !progress.visitedPages.includes(p.path)) || trail.pages[0];
  }

  function estimateTime(pageCount: number) {
    const totalMin = pageCount * 30;
    if (totalMin < 60) return `${totalMin}min`;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem" }}>
      {/* ── Header ─────────────────────────────────────── */}
      <section
        className="animate-fade-in"
        style={{ paddingTop: "2rem", marginBottom: "2rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.75rem" }}>🛤️</span>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Trilhas de Aprendizado
          </h1>
        </div>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", maxWidth: "640px" }}>
          Percorra trilhas estruturadas para dominar pagamentos do zero ao avancado.
          Cada trilha conecta conceitos em uma sequencia logica de aprendizado.
        </p>
      </section>

      {/* ── Stats Row ──────────────────────────────────── */}
      <section
        className="animate-fade-in stagger-1"
        style={{ marginBottom: "2.5rem" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {[
            { label: "Trilhas", value: `${stats.totalTrails}`, icon: "🛤️" },
            { label: "Concluidas", value: `${stats.completedTrails}`, icon: "✅" },
            { label: "Paginas Cobertas", value: `${stats.visitedPages}/${stats.totalPages}`, icon: "📄" },
            { label: "Progresso Geral", value: `${stats.overallPercent}%`, icon: "📊" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                padding: "1.25rem 1rem",
                background: "var(--surface)",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "0.25rem",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trail Cards ────────────────────────────────── */}
      <section className="animate-fade-in stagger-2" style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.5rem" }}>
          {LEARNING_TRAILS.map((trail) => {
            const tp = getTrailProgress(trail.id);
            const nextPage = getNextPage(trail.id);
            const started = tp.visited > 0;
            const completed = tp.visited === tp.total;

            return (
              <div
                key={trail.id}
                style={{
                  background: "var(--surface)",
                  borderRadius: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                  borderLeft: `4px solid ${trail.color}`,
                  overflow: "hidden",
                }}
              >
                {/* Card Header */}
                <div style={{ padding: "1.5rem 1.5rem 0 1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: trail.colorBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          flexShrink: 0,
                        }}
                      >
                        {trail.icon}
                      </div>
                      <div>
                        <h2
                          style={{
                            fontSize: "1.15rem",
                            fontWeight: 700,
                            color: "var(--foreground)",
                            marginBottom: "0.15rem",
                          }}
                        >
                          {trail.title}
                        </h2>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          {trail.subtitle}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexShrink: 0,
                      }}
                    >
                      {/* Estimated time */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          background: "var(--background, #f8f9fa)",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "8px",
                          whiteSpace: "nowrap" as const,
                        }}
                      >
                        ⏱️ {estimateTime(trail.pages.length)}
                      </span>

                      {/* CTA */}
                      <Link
                        href={nextPage?.path || trail.pages[0].path}
                        onClick={() => setActiveTrail(trail.id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          padding: "0.55rem 1.25rem",
                          borderRadius: "8px",
                          background: completed ? "var(--success, #22c55e)" : trail.color,
                          color: "#ffffff",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          whiteSpace: "nowrap" as const,
                          transition: "opacity 0.2s",
                        }}
                      >
                        {completed ? "Revisar" : started ? "Continuar" : "Comecar"} →
                      </Link>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {tp.visited} de {tp.total} paginas concluidas
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: trail.color,
                          fontWeight: 600,
                        }}
                      >
                        {tp.percent}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        borderRadius: "3px",
                        background: "var(--border)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${tp.percent}%`,
                          height: "100%",
                          borderRadius: "3px",
                          background: trail.color,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Pages List */}
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    padding: "0.75rem 1.5rem 1rem 1.5rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.1em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Conteudo da Trilha
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.25rem" }}>
                    {trail.pages.map((page, pageIdx) => {
                      const visited = progress.visitedPages.includes(page.path);
                      return (
                        <Link
                          key={page.path}
                          href={page.path}
                          onClick={() => setActiveTrail(trail.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.6rem 0.75rem",
                            borderRadius: "8px",
                            textDecoration: "none",
                            transition: "background 0.15s",
                            background: visited
                              ? trail.colorBg
                              : "transparent",
                          }}
                        >
                          {/* Step indicator */}
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              flexShrink: 0,
                              background: visited ? trail.color : "var(--border)",
                              color: visited ? "#ffffff" : "var(--text-muted)",
                              transition: "background 0.3s, color 0.3s",
                            }}
                          >
                            {visited ? "✓" : pageIdx + 1}
                          </div>

                          {/* Page icon */}
                          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>
                            {page.icon}
                          </span>

                          {/* Page info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "0.88rem",
                                fontWeight: 600,
                                color: visited
                                  ? trail.color
                                  : "var(--foreground)",
                                marginBottom: "0.1rem",
                              }}
                            >
                              {page.title}
                            </div>
                            <div
                              style={{
                                fontSize: "0.78rem",
                                color: "var(--text-muted)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap" as const,
                              }}
                            >
                              {page.description}
                            </div>
                          </div>

                          {/* Time estimate */}
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "var(--text-muted)",
                              flexShrink: 0,
                              opacity: 0.7,
                            }}
                          >
                            ~30min
                          </span>

                          {/* Visited badge */}
                          {visited && (
                            <span
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                color: trail.color,
                                background: trail.colorBg,
                                padding: "0.15rem 0.5rem",
                                borderRadius: "6px",
                                flexShrink: 0,
                              }}
                            >
                              Visitado
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Back to Home ───────────────────────────────── */}
      <section
        className="animate-fade-in stagger-3"
        style={{
          textAlign: "center",
          paddingBottom: "3rem",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontWeight: 600,
            transition: "color 0.2s",
          }}
        >
          ← Voltar para Home
        </Link>
      </section>
    </div>
  );
}
