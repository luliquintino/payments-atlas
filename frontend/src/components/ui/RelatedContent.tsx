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

function RelatedCard({ page }: { page: PageRelation }) {
  const icon = getCategoryIcon(page.category);
  const color = getCategoryColor(page.category);

  return (
    <Link href={page.href}>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "16px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = `0 4px 12px ${color}15`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
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

function SectionHeader({ title }: { title: string }) {
  return (
    <h3
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "var(--text-secondary)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 16,
      }}
    >
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
    <div
      style={{
        marginTop: 48,
        paddingTop: 32,
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Related Pages */}
      {hasRelated && (
        <div style={{ marginBottom: hasNextSteps ? 32 : 0 }}>
          <SectionHeader title="Conteudo Relacionado" />
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
          <SectionHeader title="Proximos Passos" />
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
  );
}
