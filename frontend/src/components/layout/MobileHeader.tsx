"use client";

import Link from "next/link";

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

/**
 * MobileHeader — Barra fixa no topo em telas mobile.
 * Visível apenas abaixo de 768px via CSS (classe .mobile-header).
 */
export default function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  return (
    <header className="mobile-header">
      <button
        onClick={onMenuToggle}
        className="flex items-center justify-center rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
        style={{ width: "2.5rem", height: "2.5rem" }}
        aria-label="Abrir menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <Link href="/" className="flex items-center" style={{ gap: "0.5rem" }}>
        <div
          className="rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-lighter)] flex items-center justify-center"
          style={{ width: "1.75rem", height: "1.75rem" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <span className="text-sm font-bold text-[var(--foreground)]">
          Payments Academy
        </span>
      </Link>

      <Link
        href="/search"
        className="flex items-center justify-center rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
        style={{ width: "2.5rem", height: "2.5rem" }}
        aria-label="Buscar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </Link>
    </header>
  );
}
