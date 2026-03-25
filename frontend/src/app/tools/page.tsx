"use client";

import Link from "next/link";

const tools = [
  {
    name: "Simulador de Pagamento",
    href: "/simulation/payment-simulator",
    icon: "\u{1F9EA}",
    description: "Simule o impacto de features na performance",
    color: "#6366F1",
  },
  {
    name: "Consultor de Arquitetura",
    href: "/simulation/architecture-advisor",
    icon: "\u{1F3D7}\uFE0F",
    description: "Arquitetura recomendada para seu neg\u00f3cio",
    color: "#8B5CF6",
  },
  {
    name: "Dashboard",
    href: "/observability/payments-dashboard",
    icon: "\u{1F4C8}",
    description: "M\u00e9tricas e observabilidade",
    color: "#10B981",
  },
  {
    name: "Explorador de Eventos",
    href: "/observability/event-explorer",
    icon: "\u{1F4CB}",
    description: "Timeline de eventos de pagamento",
    color: "#F59E0B",
  },
  {
    name: "Consultor AI",
    href: "/ai/payments-advisor",
    icon: "\u{1F916}",
    description: "Pergunte sobre pagamentos",
    color: "#EF4444",
  },
  {
    name: "Analisador de Docs",
    href: "/tools/document-analyzer",
    icon: "\u{1F4C4}",
    description: "Analise regula\u00e7\u00f5es e docs t\u00e9cnicas com AI",
    color: "#0EA5E9",
  },
  {
    name: "Calculadora de MDR",
    href: "/tools/mdr-calculator",
    icon: "\u{1F4CA}",
    description: "Calcule taxas MDR e compare custos entre adquirentes",
    color: "#14B8A6",
  },
  {
    name: "Simulador P&L",
    href: "/tools/psp-pnl",
    icon: "\u{1F4B0}",
    description: "Simule o P&L de um PSP com diferentes cen\u00e1rios de receita",
    color: "#16A34A",
  },
  {
    name: "Calculadora de Chargeback",
    href: "/tools/chargeback-calculator",
    icon: "\u2696\uFE0F",
    description: "Calcule impacto financeiro de chargebacks e disputas",
    color: "#DC2626",
  },
  {
    name: "Comparador de PSPs",
    href: "/tools/psp-comparator",
    icon: "\u{1F3E2}",
    description: "Compare PSPs lado a lado em features, pre\u00e7o e cobertura",
    color: "#7C3AED",
  },
  {
    name: "Checklist de Integra\u00e7\u00e3o",
    href: "/tools/integration-checklist",
    icon: "\u2705",
    description: "Checklist completo para integra\u00e7\u00e3o com gateways de pagamento",
    color: "#059669",
  },
];

export default function ToolsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.375rem",
            }}
          >
            Ferramentas
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9375rem",
            }}
          >
            {tools.length} ferramentas interativas para simular, monitorar e explorar pagamentos.
          </p>
        </div>

        {/* Tools Grid */}
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
                border: "1px solid var(--border)",
                borderRadius: "0.875rem",
                borderLeft: `4px solid ${tool.color}`,
                padding: "1.5rem",
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
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
                    fontSize: "1.05rem",
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
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
