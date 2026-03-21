"use client";
import { type Badge } from "@/data/badges";

interface BadgeNotificationProps {
  badges: Badge[];
  onDismiss: () => void;
}

export default function BadgeNotification({ badges, onDismiss }: BadgeNotificationProps) {
  if (badges.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed", bottom: "1.5rem", right: "1.5rem",
        zIndex: 200, display: "flex", flexDirection: "column", gap: "0.5rem",
      }}
    >
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="animate-fade-in"
          style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "1rem 1.25rem", background: "var(--surface)",
            border: "2px solid var(--xp-gold)", borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)", cursor: "pointer",
            minWidth: "280px",
          }}
          onClick={onDismiss}
        >
          <span style={{ fontSize: "2rem" }} className="animate-confetti">{badge.icon}</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--foreground)" }}>
              Nova Conquista!
            </p>
            <p style={{ fontWeight: 600, color: "var(--xp-gold)", fontSize: "0.8125rem" }}>
              {badge.name}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              +{badge.xpReward} XP
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
