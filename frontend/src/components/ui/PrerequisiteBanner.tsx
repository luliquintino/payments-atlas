"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGameProgress } from "@/hooks/useGameProgress";
import { CONTENT_MAP } from "@/data/content-map";
import type { PageRelation } from "@/data/content-map";

const DISMISS_PREFIX = "pks-prereq-dismissed-";

/**
 * PrerequisiteBanner — Shows recommended prerequisite pages that the user
 * has not yet visited. Reads the current pathname, looks up prerequisites
 * in CONTENT_MAP, filters out visited ones via useGameProgress, and renders
 * a dismissible banner when unvisited prerequisites remain.
 */
export default function PrerequisiteBanner() {
  const pathname = usePathname();
  const { isPageVisited } = useGameProgress();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Reset dismiss state on route change
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const key = DISMISS_PREFIX + pathname;
      setDismissed(sessionStorage.getItem(key) === "1");
    }
  }, [pathname]);

  if (!mounted) return null;

  const node = CONTENT_MAP[pathname];
  if (!node || node.prerequisites.length === 0) return null;

  const unvisited: PageRelation[] = node.prerequisites.filter(
    (p) => !isPageVisited(p.href)
  );

  if (unvisited.length === 0 || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(DISMISS_PREFIX + pathname, "1");
    }
  };

  return (
    <div
      style={{
        background: "var(--primary-bg, rgba(99, 102, 241, 0.08))",
        border: "1px solid var(--primary, #6366f1)",
        borderRadius: 10,
        padding: "12px 16px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 16 }}>{"\u{1F4DA}"}</span>
        <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
          Pre-requisitos recomendados:
        </span>
        {unvisited.map((page, i) => (
          <span key={page.href} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            {i > 0 && (
              <span style={{ color: "var(--text-secondary)", margin: "0 2px" }}>{"\u00B7"}</span>
            )}
            <Link
              href={page.href}
              style={{
                color: "var(--primary, #6366f1)",
                fontWeight: 600,
                textDecoration: "none",
                borderBottom: "1px dashed var(--primary, #6366f1)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {page.name}
            </Link>
          </span>
        ))}
      </div>

      <button
        onClick={handleDismiss}
        aria-label="Fechar"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-secondary)",
          fontSize: 18,
          lineHeight: 1,
          padding: 4,
          borderRadius: 4,
          flexShrink: 0,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--foreground)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
      >
        {"\u2715"}
      </button>
    </div>
  );
}
