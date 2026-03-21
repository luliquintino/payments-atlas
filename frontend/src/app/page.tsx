"use client";

import Link from "next/link";
import { useRecentPages } from "@/hooks/useRecentPages";
import { LEARNING_TRAILS } from "@/data/learning-trails";
import { useTrailProgress } from "@/hooks/useTrailProgress";

const quickLinks = [
  { name: "Simulador de Pagamentos", href: "/simulation/payment-simulator", icon: "🧪", desc: "Simule impacto de features" },
  { name: "Mapa de Fraude", href: "/fraud/fraud-map", icon: "🛡️", desc: "Pipeline de deteccao" },
  { name: "Dashboard", href: "/observability/payments-dashboard", icon: "📈", desc: "Metricas em tempo real" },
  { name: "Consultor IA", href: "/ai/payments-advisor", icon: "🤖", desc: "Assistente inteligente" },
  { name: "Mapa do Ecossistema", href: "/explore/ecosystem-map", icon: "🌐", desc: "Players do mercado" },
  { name: "Base de Features", href: "/knowledge/features", icon: "📦", desc: "Catalogo de 300+ features" },
];

export default function Home() {
  const recentPages = useRecentPages();
  const { progress, setActiveTrail, getTrailProgress } = useTrailProgress();

  // Find the next unvisited page in a trail
  function getNextPage(trailId: string) {
    const trail = LEARNING_TRAILS.find((t) => t.id === trailId);
    if (!trail) return trail?.pages[0];
    const next = trail.pages.find((p) => !progress.visitedPages.includes(p.path));
    return next || trail.pages[0];
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="animate-fade-in" style={{ textAlign: "center", marginBottom: "3rem", paddingTop: "0.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 1rem",
            borderRadius: "999px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--primary-lighter)",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--primary-lighter)",
              animation: "pulse 2s infinite",
            }}
          />
          Payments Knowledge System
        </div>

        <h1
          className="page-title"
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            lineHeight: 1.15,
          }}
        >
          Bem-vindo ao mundo dos{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--primary-lighter), #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            pagamentos
          </span>
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1.05rem",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Escolha uma trilha de aprendizado e domine pagamentos no seu ritmo — do basico ao avancado.
        </p>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section
        className="animate-fade-in stagger-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        {[
          { label: "Paginas", value: "30", icon: "📄" },
          { label: "Features", value: "300+", icon: "📦" },
          { label: "Problemas", value: "100+", icon: "⚠️" },
          { label: "Areas", value: "8", icon: "🗂️" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ textAlign: "center", padding: "1.25rem 1rem" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{s.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── Learning Trails ───────────────────────────────── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            marginBottom: "1.25rem",
            paddingLeft: "0.25rem",
          }}
        >
          Trilhas de Aprendizado
        </h2>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
          {LEARNING_TRAILS.map((trail, idx) => {
            const tp = getTrailProgress(trail.id);
            const nextPage = getNextPage(trail.id);
            const started = tp.visited > 0;
            const completed = tp.visited === tp.total;

            return (
              <div
                key={trail.id}
                className={`card-flat interactive-hover animate-fade-in stagger-${idx + 2}`}
                style={{
                  padding: "1.75rem",
                  borderLeft: `4px solid ${trail.color}`,
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
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
                      }}
                    >
                      {trail.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.2rem" }}>
                        {trail.title}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{trail.subtitle}</p>
                    </div>
                  </div>

                  <Link
                    href={nextPage?.path || trail.pages[0].path}
                    onClick={() => setActiveTrail(trail.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1.25rem",
                      borderRadius: "8px",
                      background: completed ? "var(--success)" : trail.color,
                      color: "#ffffff",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "opacity 0.2s",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {completed ? "✅ Concluida" : started ? "Continuar →" : "Comecar →"}
                  </Link>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {tp.visited} de {tp.total} paginas
                    </span>
                    <span style={{ fontSize: "0.75rem", color: trail.color, fontWeight: 600 }}>{tp.percent}%</span>
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

                {/* Page preview list */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "0.5rem",
                  }}
                >
                  {trail.pages.slice(0, 4).map((page) => {
                    const visited = progress.visitedPages.includes(page.path);
                    return (
                      <Link
                        key={page.path}
                        href={page.path}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          background: visited ? trail.colorBg : "transparent",
                          textDecoration: "none",
                          fontSize: "0.8rem",
                          color: visited ? trail.color : "var(--text-muted)",
                          transition: "background 0.2s",
                        }}
                      >
                        <span>{page.icon}</span>
                        <span style={{ fontWeight: visited ? 600 : 400 }}>{page.title}</span>
                        {visited && <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>✓</span>}
                      </Link>
                    );
                  })}
                  {trail.pages.length > 4 && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      +{trail.pages.length - 4} mais...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Continue Learning ─────────────────────────────── */}
      {progress.activeTrailId && (() => {
        const trail = LEARNING_TRAILS.find((t) => t.id === progress.activeTrailId);
        if (!trail) return null;
        const tp = getTrailProgress(trail.id);
        if (tp.visited === 0 || tp.visited === tp.total) return null;
        const nextPage = trail.pages.find((p) => !progress.visitedPages.includes(p.path));
        if (!nextPage) return null;
        return (
          <section
            className="card-glow animate-fade-in"
            style={{
              padding: "1.5rem",
              marginBottom: "3rem",
              borderLeft: `4px solid ${trail.color}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  Continuar aprendendo
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{nextPage.icon}</span>
                  <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)" }}>{nextPage.title}</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{nextPage.description}</p>
              </div>
              <Link
                href={nextPage.path}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.5rem",
                  borderRadius: "8px",
                  background: trail.color,
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap" as const,
                }}
              >
                Continuar →
              </Link>
            </div>
          </section>
        );
      })()}

      {/* ── Recent Pages ──────────────────────────────────── */}
      {recentPages.length > 0 && (
        <section className="animate-fade-in stagger-5" style={{ marginBottom: "3rem" }}>
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
            Visitados recentemente
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {recentPages.slice(0, 4).map((page) => (
              <Link
                key={page.path}
                href={page.path}
                className="card-flat interactive-hover"
                style={{ padding: "1rem 1.25rem", textDecoration: "none" }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.25rem" }}>
                  {page.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {new Date(page.timestamp).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Quick Access ──────────────────────────────────── */}
      <section
        className="animate-fade-in stagger-6"
        style={{
          paddingTop: "2rem",
          marginBottom: "1rem",
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
          Acesso rapido
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {quickLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="card-flat interactive-hover"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1rem 1.25rem",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)" }}>{item.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
