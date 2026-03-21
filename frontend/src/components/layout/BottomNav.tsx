"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "\u{1F3E0}" },
  { label: "Trilhas", href: "/trilhas", icon: "\u{1F5FA}\uFE0F" },
  { label: "Explorar", href: "/search", icon: "\u{1F50D}" },
  { label: "Progresso", href: "/progress", icon: "\u{1F4CA}" },
  { label: "Perfil", href: "/auth/profile", icon: "\u{1F464}" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "color-mix(in srgb, var(--surface) 85%, transparent)",
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "60px",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
                flex: 1,
                textDecoration: "none",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                fontSize: "0.625rem",
                fontWeight: isActive ? 600 : 400,
                transition: "color 0.15s ease",
                minHeight: "44px",
              }}
            >
              <span style={{ fontSize: "1.25rem", lineHeight: 1 }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
