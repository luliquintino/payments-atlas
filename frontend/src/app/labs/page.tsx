"use client";

import Link from "next/link";

const labs = [
  {
    title: "Sandbox de API",
    href: "/labs/api-sandbox",
    icon: "🔌",
    description:
      "Construa requests de pagamento, teste validações e veja respostas simuladas em tempo real.",
    color: "#6366F1",
    tags: ["API", "REST", "JSON"],
    difficulty: "Intermediário",
  },
  {
    title: "Estudo de Caso Interativo",
    href: "/labs/case-study",
    icon: "📊",
    description:
      "Tome decisões estratégicas em cenários reais de e-commerce, marketplace e fintech.",
    color: "#10B981",
    tags: ["Estratégia", "Auth Rate", "Chargeback"],
    difficulty: "Avançado",
  },
  {
    title: "Simulador de Incidente",
    href: "/labs/incident-simulator",
    icon: "🚨",
    description:
      "Responda a incidentes de produção sob pressão com timer e escolhas críticas.",
    color: "#F59E0B",
    tags: ["Incident Response", "On-Call", "SRE"],
    difficulty: "Avançado",
  },
  {
    title: "Role-Play de Disputa",
    href: "/labs/dispute-roleplay",
    icon: "⚖️",
    description:
      "Defenda transações contra chargebacks selecionando evidências e construindo seu caso.",
    color: "#EF4444",
    tags: ["Chargeback", "Disputa", "Evidência"],
    difficulty: "Intermediário",
  },
];

export default function LabsHub() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--foreground)",
            marginBottom: "0.5rem",
          }}
        >
          🧪 Labs
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
          Experiências interativas para praticar pagamentos em cenários simulados.
          Construa APIs, resolva incidentes e defenda disputas.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {labs.map((lab) => (
          <Link key={lab.href} href={lab.href} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = lab.color;
                e.currentTarget.style.boxShadow = `0 4px 20px ${lab.color}22`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span
                  style={{
                    fontSize: "1.75rem",
                    width: "2.75rem",
                    height: "2.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.75rem",
                    background: `${lab.color}15`,
                  }}
                >
                  {lab.icon}
                </span>
                <div>
                  <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)" }}>
                    {lab.title}
                  </h2>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: lab.color,
                      background: `${lab.color}15`,
                      padding: "0.125rem 0.5rem",
                      borderRadius: "999px",
                    }}
                  >
                    {lab.difficulty}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, flex: 1 }}>
                {lab.description}
              </p>

              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                {lab.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      background: "var(--surface-hover)",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "999px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
