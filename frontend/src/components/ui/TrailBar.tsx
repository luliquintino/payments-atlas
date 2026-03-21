"use client";
import Link from "next/link";

interface TrailBarProps {
  trailName: string;
  currentPage: number;
  totalPages: number;
  percent: number;
  prevHref?: string;
  nextHref?: string;
}

export default function TrailBar({ trailName, currentPage, totalPages, percent, prevHref, nextHref }: TrailBarProps) {
  return (
    <div className="trail-bar">
      <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
        Trilha: {trailName}
      </span>
      <span style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>
        {currentPage} de {totalPages}
      </span>
      <div className="trail-bar-progress">
        <div className="trail-bar-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div style={{ display: "flex", gap: "0.5rem", whiteSpace: "nowrap" }}>
        {prevHref ? (
          <Link href={prevHref} style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.8125rem", fontWeight: 500 }}>
            ← Anterior
          </Link>
        ) : (
          <span style={{ color: "var(--text-light)", fontSize: "0.8125rem" }}>← Anterior</span>
        )}
        <span style={{ color: "var(--border)" }}>|</span>
        {nextHref ? (
          <Link href={nextHref} style={{ color: "var(--primary)", textDecoration: "none", fontSize: "0.8125rem", fontWeight: 500 }}>
            Próximo →
          </Link>
        ) : (
          <span style={{ color: "var(--text-light)", fontSize: "0.8125rem" }}>Próximo →</span>
        )}
      </div>
    </div>
  );
}
