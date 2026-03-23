"use client";

import Link from "next/link";

export interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        padding: "8px 16px",
        borderRadius: "8px",
        marginBottom: "16px",
        fontSize: "13px",
        flexWrap: "wrap" as const,
      }}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <span
            key={idx}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            {idx > 0 && (
              <span
                aria-hidden="true"
                style={{ color: "var(--text-secondary)", fontWeight: 400 }}
              >
                ›
              </span>
            )}
            {isLast || !item.href ? (
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                style={{
                  color: "var(--primary)",
                  textDecoration: "none",
                  fontWeight: 400,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
