"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useGameProgress } from "@/hooks/useGameProgress";
import { useTrailProgress } from "@/hooks/useTrailProgress";
import { LEARNING_TRAILS } from "@/data/learning-trails";
import { BADGES } from "@/data/badges";
import { getLevelProgress } from "@/data/levels";

export default function Home() {
  const { xp, badges, streak, quizScores, pagesVisited, level, levelProgress } = useGameProgress();
  const { progress, setActiveTrail, getTrailProgress } = useTrailProgress();

  const completedTrails = LEARNING_TRAILS.filter((t) =>
    t.pages.every((p) => pagesVisited.includes(p.path))
  ).length;

  const quizAvg = useMemo(() => {
    const scores = Object.values(quizScores);
    if (scores.length === 0) return 0;
    const totalCorrect = scores.reduce((s, q) => s + q.correct, 0);
    const totalQuestions = scores.reduce((s, q) => s + q.total, 0);
    return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  }, [quizScores]);

  const earnedBadges = BADGES.filter((b) => badges.includes(b.id));
  const lockedBadges = BADGES.filter((b) => !badges.includes(b.id));

  const isFirstVisit = pagesVisited.length === 0;

  // Find the next unvisited page in a trail
  function getNextPage(trailId: string) {
    const trail = LEARNING_TRAILS.find((t) => t.id === trailId);
    if (!trail) return undefined;
    const next = trail.pages.find((p) => !progress.visitedPages.includes(p.path));
    return next || trail.pages[0];
  }

  // Active trail data
  const activeTrail = progress.activeTrailId
    ? LEARNING_TRAILS.find((t) => t.id === progress.activeTrailId)
    : null;
  const activeTrailProgress = activeTrail ? getTrailProgress(activeTrail.id) : null;
  const activeTrailNext = activeTrail
    ? activeTrail.pages.find((p) => !progress.visitedPages.includes(p.path))
    : null;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem" }}>

      {/* ── 1. Header ──────────────────────────────────────── */}
      <section
        className="animate-fade-in"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.25rem",
            }}
          >
            {isFirstVisit ? "Bem-vindo!" : "Bom dia!"} 👋
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
            {isFirstVisit
              ? "Pronto para começar sua jornada em pagamentos?"
              : "Continue de onde parou"}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            className="streak-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.4rem 0.85rem",
              borderRadius: "999px",
              background: "rgba(245,158,11,0.12)",
              color: "#f59e0b",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            🔥 {streak.count} dias
          </span>
          <span
            className="xp-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.4rem 0.85rem",
              borderRadius: "999px",
              background: "rgba(99,102,241,0.12)",
              color: "#6366f1",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            ⚡ {xp} XP
          </span>
        </div>
      </section>

      {/* ── 2. First-time visitor ──────────────────────────── */}
      {isFirstVisit && (
        <section
          className="animate-fade-in stagger-1"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "16px",
            padding: "2.5rem",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎓</div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.5rem",
            }}
          >
            Bem-vindo à Payments Academy!
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              marginBottom: "0.25rem",
            }}
          >
            Aprenda tudo sobre pagamentos — do básico ao avançado.
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.95rem",
              marginBottom: "2rem",
            }}
          >
            Escolha uma trilha para começar sua jornada.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" as const }}>
            <Link
              href={LEARNING_TRAILS[0].pages[0].path}
              onClick={() => setActiveTrail("fundamentos")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "10px",
                background: "#6366f1",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              🚀 Começar pelos Fundamentos
            </Link>
            <Link
              href="/explore/payments-map"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "10px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                fontSize: "0.95rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              🧭 Explorar livremente
            </Link>
          </div>
        </section>
      )}

      {/* ── 3. Continue Studying ───────────────────────────── */}
      {!isFirstVisit && activeTrail && activeTrailProgress && activeTrailProgress.visited > 0 && activeTrailProgress.visited < activeTrailProgress.total && activeTrailNext && (
        <section
          className="animate-fade-in stagger-1"
          style={{
            background: "var(--surface)",
            borderRadius: "16px",
            padding: "1.75rem",
            marginBottom: "2.5rem",
            borderLeft: `4px solid ${activeTrail.color}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
              marginBottom: "1rem",
            }}
          >
            Continuar Estudando
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{activeTrail.icon}</span>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.15rem" }}>
                    {activeTrail.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Próximo: {activeTrailNext.title}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ width: "300px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {activeTrailProgress.visited} de {activeTrailProgress.total} páginas
                  </span>
                  <span style={{ fontSize: "0.75rem", color: activeTrail.color, fontWeight: 600 }}>
                    {activeTrailProgress.percent}%
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
                      width: `${activeTrailProgress.percent}%`,
                      height: "100%",
                      borderRadius: "3px",
                      background: activeTrail.color,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            </div>
            <Link
              href={activeTrailNext.path}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.5rem",
                borderRadius: "10px",
                background: activeTrail.color,
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap" as const,
                transition: "opacity 0.2s",
              }}
            >
              Continuar →
            </Link>
          </div>
        </section>
      )}

      {/* ── 4. My Progress ─────────────────────────────────── */}
      <section className="animate-fade-in stagger-2" style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            marginBottom: "1rem",
            paddingLeft: "0.25rem",
          }}
        >
          Meu Progresso
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {[
            { label: "Páginas", value: `${pagesVisited.length}/30`, icon: "📄" },
            { label: "Trilhas", value: `${completedTrails}/${LEARNING_TRAILS.length}`, icon: "🛤️" },
            { label: "Badges", value: `${badges.length}/13`, icon: "🏅" },
            { label: "Quiz Avg", value: `${quizAvg}%`, icon: "🎯" },
          ].map((s) => (
            <div
              key={s.label}
              className="stat-card"
              style={{
                textAlign: "center",
                padding: "1.25rem 1rem",
                background: "var(--surface)",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
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

      {/* ── 5. Learning Trails ─────────────────────────────── */}
      <section className="animate-fade-in stagger-3" style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            marginBottom: "1rem",
            paddingLeft: "0.25rem",
          }}
        >
          Trilhas de Aprendizado
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1rem",
          }}
        >
          {LEARNING_TRAILS.map((trail, idx) => {
            const tp = getTrailProgress(trail.id);
            const nextPage = getNextPage(trail.id);
            const started = tp.visited > 0;
            const completed = tp.visited === tp.total;
            const isLocked = idx > 0 && !started;

            return (
              <div
                key={trail.id}
                style={{
                  background: "var(--surface)",
                  borderRadius: "14px",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                  borderTop: `3px solid ${trail.color}`,
                  opacity: isLocked ? 0.85 : 1,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Trail header */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: trail.colorBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.35rem",
                    }}
                  >
                    {trail.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>
                        {trail.title}
                      </h3>
                      {isLocked && (
                        <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>🔒</span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                      {trail.subtitle}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {tp.visited} de {tp.total} páginas
                    </span>
                    <span style={{ fontSize: "0.75rem", color: trail.color, fontWeight: 600 }}>
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

                {/* CTA Button */}
                <Link
                  href={nextPage?.path || trail.pages[0].path}
                  onClick={() => setActiveTrail(trail.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 1.15rem",
                    borderRadius: "8px",
                    background: completed ? "var(--success, #22c55e)" : trail.color,
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                >
                  {completed ? "✅ Concluída" : started ? "Continuar →" : "Começar →"}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. Recent Achievements ─────────────────────────── */}
      <section className="animate-fade-in stagger-4" style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
              paddingLeft: "0.25rem",
            }}
          >
            Conquistas Recentes
          </h2>
          <Link
            href="/progress"
            style={{
              fontSize: "0.8rem",
              color: "#6366f1",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Ver todas →
          </Link>
        </div>
        <div style={{ display: "flex", gap: "1rem", overflowX: "auto" as const }}>
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              style={{
                minWidth: "90px",
                textAlign: "center",
                padding: "1rem 0.75rem",
                background: "var(--surface)",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>{badge.icon}</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3 }}>
                {badge.name}
              </div>
            </div>
          ))}
          {lockedBadges.slice(0, 4).map((badge) => (
            <div
              key={badge.id}
              style={{
                minWidth: "90px",
                textAlign: "center",
                padding: "1rem 0.75rem",
                background: "var(--surface, #f8f9fa)",
                borderRadius: "12px",
                border: "1px dashed var(--border)",
                opacity: 0.5,
              }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>???</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", lineHeight: 1.3 }}>
                ???
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Quick Access ────────────────────────────────── */}
      <section
        className="animate-fade-in stagger-5"
        style={{
          paddingTop: "1.5rem",
          marginBottom: "2rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <h2
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            marginBottom: "1rem",
            paddingLeft: "0.25rem",
          }}
        >
          Acesso Rápido
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.75rem",
          }}
        >
          {[
            { name: "Glossário", href: "/knowledge/taxonomy", icon: "📖" },
            { name: "Buscar", href: "/knowledge/features", icon: "🔍" },
            { name: "Simulador", href: "/simulation/payment-simulator", icon: "⚡" },
            { name: "Consultor AI", href: "/ai/payments-advisor", icon: "🤖" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "1rem",
                background: "var(--surface)",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--foreground)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
