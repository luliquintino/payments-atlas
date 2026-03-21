"use client";
import Link from "next/link";

interface CompletionCardProps {
  xpEarned: number;
  quizScore?: { correct: number; total: number };
  prevPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
}

export default function CompletionCard({ xpEarned, quizScore, prevPage, nextPage }: CompletionCardProps) {
  return (
    <div className="completion-card animate-fade-in">
      <p style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉</p>
      <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
        Página Completa!
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
        <span className="xp-badge animate-xp-bounce" style={{ fontSize: "0.875rem", padding: "0.375rem 0.75rem" }}>
          +{xpEarned} XP
        </span>
        {quizScore && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.25rem",
            padding: "0.375rem 0.75rem", background: "rgba(16, 185, 129, 0.1)",
            color: "var(--success)", fontWeight: 700, fontSize: "0.875rem", borderRadius: "999px",
          }}>
            Quiz: {quizScore.correct}/{quizScore.total}
          </span>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        {prevPage && (
          <Link href={prevPage.href} style={{
            padding: "0.625rem 1.25rem", border: "1px solid var(--border)",
            borderRadius: "8px", textDecoration: "none", color: "var(--foreground)",
            fontWeight: 500, fontSize: "0.875rem",
          }}>
            ← {prevPage.title}
          </Link>
        )}
        {nextPage && (
          <Link href={nextPage.href} style={{
            padding: "0.625rem 1.25rem", background: "var(--primary)",
            borderRadius: "8px", textDecoration: "none", color: "#fff",
            fontWeight: 600, fontSize: "0.875rem", border: "none",
          }}>
            {nextPage.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
