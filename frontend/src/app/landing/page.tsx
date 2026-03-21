"use client";

import Link from "next/link";

const stats = [
  { label: "Paginas", value: "40+", icon: "📄" },
  { label: "Conceitos", value: "300+", icon: "💡" },
  { label: "Trilhas", value: "5", icon: "🛤️" },
  { label: "Termos", value: "60+", icon: "📖" },
];

const features = [
  {
    icon: "🛤️",
    title: "Trilhas Guiadas",
    desc: "Caminhos estruturados do basico ao avancado, com progresso visual e recomendacoes personalizadas.",
  },
  {
    icon: "🎮",
    title: "Gamificacao",
    desc: "Ganhe XP, desbloqueie badges, mantenha streaks e suba de nivel enquanto aprende.",
  },
  {
    icon: "⚡",
    title: "Ferramentas Interativas",
    desc: "Simulador de pagamentos, diagnostico de fluxos e consultor AI para tirar duvidas.",
  },
  {
    icon: "✅",
    title: "Sistema de Credibilidade",
    desc: "Todas as fontes sao verificadas e classificadas por nivel de confiabilidade.",
  },
  {
    icon: "🌙",
    title: "Dark Mode",
    desc: "Interface escura para estudo confortavel em qualquer horario, sem cansar a vista.",
  },
  {
    icon: "🔓",
    title: "Open Source",
    desc: "Codigo aberto no GitHub. Contribua, aprenda com o codigo e ajude a comunidade.",
  },
];

const communityPoints = [
  "Corrija conteudo existente",
  "Adicione novas paginas e trilhas",
  "Traduza para outros idiomas",
  "Reporte bugs e sugira melhorias",
];

export default function LandingPage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem" }}>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        className="animate-fade-in"
        style={{
          textAlign: "center",
          padding: "4rem 2rem 3rem",
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 50%, rgba(99,102,241,0.03) 100%)",
          border: "1px solid var(--border)",
          marginTop: "1.5rem",
          marginBottom: "2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 1rem",
            borderRadius: "999px",
            background: "rgba(99,102,241,0.12)",
            color: "var(--primary)",
            fontSize: "0.8rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          🔓 Open Source
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "var(--foreground)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          Payments{" "}
          <span
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Academy
          </span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--text-muted)",
            maxWidth: "560px",
            margin: "0 auto",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          A plataforma open-source que ensina tudo sobre sistemas de pagamento
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap" as const,
          }}
        >
          <Link
            href="/learn/how-payments-work"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 2rem",
              borderRadius: "12px",
              background: "var(--gradient-primary)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.2s, transform 0.2s",
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            }}
          >
            🚀 Comece a Aprender
          </Link>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 2rem",
              borderRadius: "12px",
              background: "transparent",
              color: "var(--foreground)",
              fontSize: "1rem",
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid var(--border)",
              transition: "border-color 0.2s",
            }}
          >
            ⭐ GitHub
          </a>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────── */}
      <section
        className="animate-fade-in stagger-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{
              textAlign: "center",
              padding: "1.5rem 1rem",
              background: "var(--surface)",
              borderRadius: "14px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
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
      </section>

      {/* ── Features Grid (2x3) ───────────────────────────── */}
      <section className="animate-fade-in stagger-2" style={{ marginBottom: "3rem" }}>
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
          Recursos
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1rem",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                padding: "1.75rem",
                background: "var(--surface)",
                borderRadius: "14px",
                border: "1px solid var(--border)",
                transition: "border-color 0.2s, transform 0.2s",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(99,102,241,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.35rem",
                  marginBottom: "1rem",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "0.5rem",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Community Section ─────────────────────────────── */}
      <section
        className="animate-fade-in stagger-3"
        style={{
          padding: "2.5rem",
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(16,185,129,0.04) 100%)",
          border: "1px solid var(--border)",
          marginBottom: "3rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🤝</div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.5rem",
            }}
          >
            Este projeto e open source!
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Ajude a construir o maior material educacional de pagamentos
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          {communityPoints.map((point) => (
            <div
              key={point}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.75rem 1rem",
                background: "var(--surface)",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                fontSize: "0.9rem",
                color: "var(--foreground)",
              }}
            >
              <span style={{ color: "var(--primary)", fontWeight: 700 }}>+</span>
              {point}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 2rem",
              borderRadius: "12px",
              background: "var(--gradient-primary)",
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
            }}
          >
            ⭐ Contribua no GitHub
          </a>
        </div>
      </section>

      {/* ── License ───────────────────────────────────────── */}
      <section
        className="animate-fade-in stagger-4"
        style={{
          textAlign: "center",
          padding: "2rem",
          borderRadius: "14px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          marginBottom: "3rem",
        }}
      >
        <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>📜</div>
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--foreground)",
            marginBottom: "0.5rem",
          }}
        >
          Gratuito para ONGs, educacao e uso pessoal
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
          }}
        >
          Uso comercial: entre em contato —{" "}
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>
            luiza@payments.dev
          </span>
        </p>
      </section>

      {/* ── Footer Links ──────────────────────────────────── */}
      <footer
        className="animate-fade-in stagger-5"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          flexWrap: "wrap" as const,
          padding: "1.5rem 0 2.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        {[
          { label: "Home", href: "/" },
          { label: "Glossario", href: "/knowledge/taxonomy" },
          { label: "Simulador", href: "/simulation/payment-simulator" },
          { label: "Login", href: "/auth/login" },
        ].map((link) => (
          <Link
            key={link.label}
            href={link.href}
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            {link.label}
          </Link>
        ))}
      </footer>
    </div>
  );
}
