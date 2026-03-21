"use client";

import { useGameProgress } from "@/hooks/useGameProgress";
import { BADGES, BADGE_CATEGORIES } from "@/data/badges";
import { LEARNING_TRAILS } from "@/data/learning-trails";
import { getLevelProgress, LEVELS } from "@/data/levels";

export default function ProgressPage() {
  const {
    xp,
    badges,
    streak,
    quizScores,
    pagesVisited,
    resetProgress,
  } = useGameProgress();

  const levelInfo = getLevelProgress(xp);
  const { current: currentLevel, next: nextLevel, percent: levelPercent } = levelInfo;

  const quizAvg = (() => {
    const scores = Object.values(quizScores);
    if (scores.length === 0) return 0;
    const totalCorrect = scores.reduce((s, q) => s + q.correct, 0);
    const totalQuestions = scores.reduce((s, q) => s + q.total, 0);
    return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  })();

  const handleReset = () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja recomecar? Todo o seu progresso sera perdido."
    );
    if (confirmed) {
      resetProgress();
    }
  };

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
      {/* ── Header ──────────────────────────────────────── */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Meu Progresso
        </h1>
        <p className="page-description">
          Acompanhe sua jornada de aprendizado: XP, nivel, badges conquistados, streak e desempenho nos quizzes.
        </p>
      </div>

      {/* ── Stats Row ───────────────────────────────────── */}
      <div
        className="animate-fade-in stagger-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          { icon: "\u26A1", label: "XP Total", value: String(xp) },
          { icon: "\uD83D\uDD25", label: "Streak", value: `${streak.count} dias` },
          { icon: "\uD83C\uDFC6", label: "Badges", value: `${badges.length}/13` },
          { icon: "\uD83E\uDDE0", label: "Quiz Avg", value: `${quizAvg}%` },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{s.icon}</div>
            <div
              className="metric-value"
              style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Level Section ───────────────────────────────── */}
      <div
        className="card animate-fade-in stagger-2"
        style={{ padding: "1.5rem", marginBottom: "2rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted)",
                marginBottom: "0.25rem",
              }}
            >
              Nivel {currentLevel.level}
            </div>
            <div style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--foreground)" }}>
              {currentLevel.name}
            </div>
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--xp-gold)",
            }}
          >
            {xp}/{nextLevel ? nextLevel.minXP : currentLevel.minXP} XP
          </div>
        </div>

        <div className="level-bar" style={{ marginBottom: "0.75rem" }}>
          <div
            className="level-bar-fill"
            style={{ width: `${levelPercent}%` }}
          />
        </div>

        {/* Level names */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "0.75rem",
          }}
        >
          {LEVELS.map((lvl) => (
            <div
              key={lvl.level}
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                background:
                  lvl.level === currentLevel.level
                    ? "var(--primary)"
                    : "var(--surface-hover)",
                color:
                  lvl.level === currentLevel.level
                    ? "#ffffff"
                    : "var(--text-muted)",
                border:
                  lvl.level === currentLevel.level
                    ? "1px solid var(--primary)"
                    : "1px solid var(--border)",
              }}
            >
              {lvl.level}. {lvl.name}
            </div>
          ))}
        </div>
      </div>

      {/* ── Badges Grid ─────────────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 className="text-h2 animate-fade-in stagger-3" style={{ marginBottom: "1.25rem" }}>
          Badges
        </h2>

        {BADGE_CATEGORIES.map((cat) => {
          const catBadges = BADGES.filter((b) => b.category === cat.id);
          return (
            <div key={cat.id} style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--foreground)",
                }}
              >
                <span style={{ fontSize: "1.125rem" }}>{cat.icon}</span>
                {cat.name}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {catBadges.map((b) => {
                  const unlocked = badges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className="badge-cell"
                      data-unlocked={unlocked ? "true" : "false"}
                      title={b.description}
                    >
                      <span style={{ fontSize: "2rem" }}>{b.icon}</span>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "0.8125rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        {b.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--xp-gold)",
                          fontWeight: 700,
                        }}
                      >
                        +{b.xpReward} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Trail Progress ──────────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 className="text-h2 animate-fade-in stagger-4" style={{ marginBottom: "1.25rem" }}>
          Progresso nas Trilhas
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {LEARNING_TRAILS.map((trail) => {
            const visitedCount = trail.pages.filter((p) =>
              pagesVisited.includes(p.path)
            ).length;
            const totalPages = trail.pages.length;
            const trailPercent =
              totalPages > 0 ? Math.round((visitedCount / totalPages) * 100) : 0;

            return (
              <div
                key={trail.id}
                className="card"
                style={{ padding: "1.25rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1.25rem" }}>{trail.icon}</span>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "var(--foreground)",
                      }}
                    >
                      {trail.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color:
                        trailPercent === 100
                          ? "var(--success)"
                          : "var(--text-muted)",
                    }}
                  >
                    {visitedCount}/{totalPages}
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "var(--surface-hover)",
                    borderRadius: "3px",
                    overflow: "hidden",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${trailPercent}%`,
                      background: trail.color,
                      borderRadius: "3px",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>

                {/* Pages checklist */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.375rem",
                  }}
                >
                  {trail.pages.map((page) => {
                    const visited = pagesVisited.includes(page.path);
                    return (
                      <div
                        key={page.path}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.8125rem",
                          color: visited
                            ? "var(--success)"
                            : "var(--text-muted)",
                        }}
                      >
                        <span style={{ fontSize: "0.875rem" }}>
                          {visited ? "\u2705" : "\u2B1C"}
                        </span>
                        <span
                          style={{
                            fontWeight: visited ? 500 : 400,
                            textDecoration: visited ? "none" : "none",
                          }}
                        >
                          {page.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Reset Button ────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "3rem",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={handleReset}
          style={{
            padding: "0.75rem 2rem",
            borderRadius: "10px",
            border: "1px solid var(--danger)",
            background: "rgba(239, 68, 68, 0.08)",
            color: "var(--danger)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "var(--danger)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
            e.currentTarget.style.color = "var(--danger)";
          }}
        >
          Recomecar
        </button>
      </div>
    </div>
  );
}
