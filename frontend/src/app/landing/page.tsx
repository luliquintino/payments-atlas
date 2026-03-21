"use client";

import Link from "next/link";
import { useState } from "react";

/* ── Data ──────────────────────────────────────────────────────── */

const stats = [
  { label: "Paginas", value: "40+", icon: "📄" },
  { label: "Conceitos", value: "300+", icon: "💡" },
  { label: "Trilhas", value: "5", icon: "🛤️" },
  { label: "Termos no Glossario", value: "60+", icon: "📖" },
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
    title: "Credibilidade",
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

const steps = [
  { num: "1", title: "Cadastre-se gratis", desc: "Crie sua conta em segundos, sem cartao de credito." },
  { num: "2", title: "Escolha uma trilha", desc: "Fundamentos, intermediario, avancado e mais." },
  { num: "3", title: "Aprenda e ganhe XP", desc: "Leia, faca quizzes e desbloqueie conquistas." },
];

const communityPoints = [
  "Contribua com conteudo e correcoes",
  "Traduza para outros idiomas",
  "Melhore o codigo e a interface",
  "Reporte bugs e sugira funcionalidades",
];

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Glossario", href: "/knowledge/taxonomy" },
  { label: "Simulador", href: "/simulation/payment-simulator" },
  { label: "GitHub", href: "#" },
];

/* ── Page ──────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>

      {/* ═══════════════════════════════════════════════════════════
          TOP NAVIGATION BAR
         ═══════════════════════════════════════════════════════════ */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--background)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Logo */}
          <Link
            href="/landing"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--gradient-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.85rem",
                fontWeight: 800,
              }}
            >
              PA
            </div>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              Payments Academy
            </span>
          </Link>

          {/* Desktop nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              {[
                { label: "Recursos", href: "#recursos" },
                { label: "Comunidade", href: "#comunidade" },
                { label: "Licenca", href: "#licenca" },
              ].map((link) => (
                <a
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
                </a>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link
                href="/auth/login"
                style={{
                  fontSize: "0.9rem",
                  color: "var(--foreground)",
                  textDecoration: "none",
                  fontWeight: 600,
                  padding: "0.45rem 1rem",
                  borderRadius: "8px",
                  transition: "background 0.2s",
                }}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                style={{
                  fontSize: "0.9rem",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 600,
                  padding: "0.5rem 1.25rem",
                  borderRadius: "10px",
                  background: "var(--gradient-primary)",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.25)",
                  transition: "opacity 0.2s",
                }}
              >
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
          background:
            "linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 60%, transparent 100%)",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "720px", margin: "0 auto" }}>
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
              marginBottom: "1.75rem",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            Open Source
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              color: "var(--foreground)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
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

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--text-muted)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
              marginBottom: "2.5rem",
            }}
          >
            A plataforma open-source que ensina tudo sobre sistemas de pagamento — do checkout a liquidacao
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
              href="/auth/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 2.25rem",
                borderRadius: "12px",
                background: "var(--gradient-primary)",
                color: "#fff",
                fontSize: "1.05rem",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                transition: "opacity 0.2s, transform 0.2s",
              }}
            >
              Comece Gratis
            </Link>
            <a
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 2.25rem",
                borderRadius: "12px",
                background: "transparent",
                color: "var(--foreground)",
                fontSize: "1.05rem",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid var(--border)",
                transition: "border-color 0.2s",
              }}
            >
              Ver no GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS BAR
         ═══════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 1.5rem",
          marginTop: "-1rem",
          marginBottom: "4rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES GRID (2x3)
         ═══════════════════════════════════════════════════════════ */}
      <section
        id="recursos"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 1.5rem",
          marginBottom: "5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--foreground)",
              marginBottom: "0.5rem",
            }}
          >
            Tudo que voce precisa para aprender pagamentos
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", maxWidth: "550px", margin: "0 auto" }}>
            Ferramentas, conteudo e gamificacao em um unico lugar
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                padding: "2rem",
                background: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                transition: "border-color 0.2s, transform 0.2s",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(99,102,241,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  marginBottom: "1.25rem",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
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
                  lineHeight: 1.65,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS (3 steps)
         ═══════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 1.5rem",
          marginBottom: "5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--foreground)",
              marginBottom: "0.5rem",
            }}
          >
            Como funciona
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)" }}>
            Tres passos para comecar sua jornada
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                textAlign: "center",
                padding: "2rem 1.5rem",
                background: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--gradient-primary)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  margin: "0 auto",
                  marginBottom: "1.25rem",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "0.5rem",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMMUNITY SECTION
         ═══════════════════════════════════════════════════════════ */}
      <section
        id="comunidade"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 1.5rem",
          marginBottom: "5rem",
        }}
      >
        <div
          style={{
            padding: "3rem",
            borderRadius: "20px",
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(16,185,129,0.04) 100%)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--foreground)",
                marginBottom: "0.5rem",
              }}
            >
              Este projeto precisa de voce!
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--text-muted)",
                maxWidth: "500px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Ajude a construir o maior material educacional de pagamentos em portugues
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
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
                  padding: "0.85rem 1.15rem",
                  background: "var(--surface)",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  fontSize: "0.9rem",
                  color: "var(--foreground)",
                }}
              >
                <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "1rem" }}>+</span>
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
                padding: "0.8rem 2rem",
                borderRadius: "12px",
                background: "var(--gradient-primary)",
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(99,102,241,0.25)",
                transition: "opacity 0.2s",
              }}
            >
              Contribua no GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          LICENSE SECTION
         ═══════════════════════════════════════════════════════════ */}
      <section
        id="licenca"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 1.5rem",
          marginBottom: "4rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2.5rem 2rem",
            borderRadius: "16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📜</div>
          <h3
            style={{
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.75rem",
            }}
          >
            Gratuito para ONGs, educacao e uso pessoal
          </h3>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: "0.5rem",
            }}
          >
            Use livremente para fins educacionais e sem fins lucrativos.
          </p>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            Uso comercial: entre em contato —{" "}
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>
              luiza@payments.dev
            </span>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap" as const,
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "var(--gradient-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.65rem",
                fontWeight: 800,
              }}
            >
              PA
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Payments Academy
            </span>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" as const }}>
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            2024 Payments Academy. Open Source.
          </p>
        </div>
      </footer>
    </div>
  );
}
