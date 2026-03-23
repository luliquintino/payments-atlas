"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTENT_MAP, CATEGORY_META } from "@/data/content-map";
import type { PageRelation } from "@/data/content-map";

/**
 * RelatedContent — Renders "Conteudo Relacionado" + "Proximos Passos"
 * sections automatically based on the current page's content map entry.
 *
 * Reads pathname via usePathname() — no props needed.
 * If no content map entry exists, renders nothing.
 */

const CATEGORY_ICONS: Record<string, string> = {
  explore: "\u{1F9ED}",       // compass
  infrastructure: "\u{1F3D7}",// building construction
  crypto: "\u{1F517}",        // link
  knowledge: "\u{1F4D6}",     // open book
  fraud: "\u{1F6E1}",         // shield
  diagnostics: "\u{1FA7A}",   // stethoscope
  glossary: "\u{1F4DA}",      // books
  simulation: "\u{1F9EA}",    // test tube
  observability: "\u{1F4CA}",  // chart
};

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? "\u{1F4C4}"; // page facing up fallback
}

function getCategoryColor(category: string): string {
  return CATEGORY_META[category]?.color ?? "#6366f1";
}

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  explore: "#6366F1",
  infrastructure: "#10B981",
  crypto: "#8B5CF6",
  knowledge: "#F59E0B",
  fraud: "#EF4444",
  diagnostics: "#EC4899",
  glossary: "#6366F1",
  simulation: "#06B6D4",
  observability: "#06B6D4",
};

function getCategoryBorderColor(category: string): string {
  return CATEGORY_BORDER_COLORS[category] ?? "#6366F1";
}

function RelatedCard({ page }: { page: PageRelation }) {
  const icon = getCategoryIcon(page.category);
  const color = getCategoryColor(page.category);
  const borderColor = getCategoryBorderColor(page.category);

  return (
    <Link href={page.href}>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: `4px solid ${borderColor}`,
          borderRadius: 12,
          padding: "16px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.borderLeftColor = borderColor;
          e.currentTarget.style.borderLeftWidth = "4px";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 4px 12px ${color}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.borderLeftColor = borderColor;
          e.currentTarget.style.borderLeftWidth = "4px";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--foreground)",
              lineHeight: 1.3,
            }}
          >
            {page.name}
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            marginLeft: 28,
          }}
        >
          {page.description}
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <h3
      style={{
        fontSize: 18,
        fontWeight: 700,
        color: "var(--foreground)",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span>{icon}</span>
      {title}
    </h3>
  );
}

export default function RelatedContent() {
  const pathname = usePathname();
  const node = CONTENT_MAP[pathname];

  if (!node) return null;

  const hasRelated = node.relatedPages.length > 0;
  const hasNextSteps = node.nextSteps.length > 0;

  if (!hasRelated && !hasNextSteps) return null;

  return (
    <>
      <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "32px 0" }} />
      <div
        style={{
          background: "var(--surface)",
          padding: "24px",
          borderRadius: 16,
          border: "1px solid var(--border)",
        }}
      >
        {/* Related Pages */}
        {hasRelated && (
          <div style={{ marginBottom: hasNextSteps ? 32 : 0 }}>
            <SectionHeader title="Conteudo Relacionado" icon={"\uD83D\uDD17"} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 12,
              }}
            >
              {node.relatedPages.slice(0, 4).map((page) => (
                <RelatedCard key={page.href} page={page} />
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {hasNextSteps && (
          <div>
            <SectionHeader title="Proximos Passos" icon={"\u27A1\uFE0F"} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 12,
              }}
            >
              {node.nextSteps.slice(0, 3).map((page) => (
                <RelatedCard key={page.href} page={page} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
