"use client";

import Link from "next/link";

const tools = [
  {
    name: "Simulador",
    href: "/simulation/payment-simulator",
    icon: "🧪",
    description: "Simule fluxos de pagamento e teste cenários reais",
    color: "#6366f1",
  },
  {
    name: "Consultor de Arquitetura",
    href: "/simulation/architecture-advisor",
    icon: "🏗️",
    description: "Receba recomendações de arquitetura para seu sistema",
    color: "#8b5cf6",
  },
  {
    name: "Dashboard",
    href: "/observability/payments-dashboard",
    icon: "📈",
    description: "Monitore métricas e KPIs de pagamentos em tempo real",
    color: "#06b6d4",
  },
  {
    name: "Explorador de Eventos",
    href: "/observability/event-explorer",
    icon: "📋",
    description: "Explore eventos do ciclo de vida de pagamentos",
    color: "#10b981",
  },
  {
    name: "Consultor AI",
    href: "/ai/payments-advisor",
    icon: "🤖",
    description: "Tire dúvidas com o assistente inteligente de pagamentos",
    color: "#f59e0b",
  },
  {
    name: "Analisador de Docs",
    href: "/tools/document-analyzer",
    icon: "📄",
    description: "Analise documentação técnica de pagamentos",
    color: "#ef4444",
  },
];

export default function ToolsPage() {
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
          🔧 Ferramentas
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
          Ferramentas interativas para simular, monitorar e explorar pagamentos.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            style={{
              display: "block",
              background: "var(--surface)",
              borderRadius: "14px",
              padding: "1.5rem",
              textDecoration: "none",
              borderLeft: `4px solid ${tool.color}`,
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              <span style={{ fontSize: "1.75rem" }}>{tool.icon}</span>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                {tool.name}
              </h2>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}
            >
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
