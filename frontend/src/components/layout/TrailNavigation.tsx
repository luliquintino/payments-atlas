"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getTrailNavigation } from "@/data/learning-trails";
import { useTrailProgress } from "@/hooks/useTrailProgress";

export default function TrailNavigation() {
  const pathname = usePathname();
  const { progress, markVisited, getTrailProgress } = useTrailProgress();

  // Auto-mark current page as visited
  useEffect(() => {
    if (pathname) {
      markVisited(pathname);
    }
  }, [pathname, markVisited]);

  const nav = getTrailNavigation(pathname, progress.activeTrailId ?? undefined);

  if (!nav) return null;

  const { trail, currentIndex, prev, next } = nav;
  const trailProgress = getTrailProgress(trail.id);

  return (
    <div className="animate-fade-in" style={{ margin: "2rem 0 0 0", padding: "0" }}>
      <div
        className="card-flat"
        style={{
          padding: "1.5rem",
          borderLeft: `4px solid ${trail.color}`,
        }}
      >
        {/* Trail info + step counter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem" }}>{trail.icon}</span>
            <span
              style={{
                fontWeight: 600,
                color: trail.color,
                fontSize: "0.9rem",
              }}
            >
              {trail.title}
            </span>
          </div>
          <span
            className="chip-muted"
            style={{
              fontSize: "0.8rem",
              padding: "0.25rem 0.75rem",
            }}
          >
            Passo {currentIndex + 1} de {trail.pages.length}
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            background: "var(--border)",
            marginBottom: "1.25rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${trailProgress.percent}%`,
              height: "100%",
              borderRadius: "3px",
              background: trail.color,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {/* Prev / Next navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {prev ? (
            <Link
              href={prev.path}
              className="interactive-hover"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                transition: "color 0.2s",
              }}
            >
              <span>←</span>
              <span>{prev.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={next.path}
              className="interactive-hover"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                color: trail.color,
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                transition: "color 0.2s",
              }}
            >
              <span>{next.title}</span>
              <span>→</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="interactive-hover"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                color: "var(--success)",
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
              }}
            >
              <span>✅ Trilha concluida! Voltar ao inicio</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
