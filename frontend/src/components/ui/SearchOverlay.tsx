"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { searchAll, TYPE_LABELS, TYPE_ICONS, TYPE_COLORS, type SearchResult, type SearchResultType } from "@/lib/search-index";

/**
 * SearchOverlay — Modal de busca global ativado por Cmd+K.
 *
 * Renderizado no layout raiz, escuta por atalho de teclado globalmente.
 * Navegação por setas + Enter. Esc para fechar.
 */
export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchAll(query).slice(0, 20);
  }, [query]);

  // Open/close with Cmd+K or custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    const handleOpenSearch = () => setIsOpen(true);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("open-search", handleOpenSearch);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("open-search", handleOpenSearch);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      setSelectedIndex(0);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selected = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selected) selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const navigateTo = useCallback(
    (result: SearchResult) => {
      setIsOpen(false);
      router.push(result.href);
    },
    [router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigateTo(results[selectedIndex]);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [results, selectedIndex, navigateTo],
  );

  if (!isOpen) return null;

  return (
    <div className="search-overlay-backdrop" onClick={() => setIsOpen(false)}>
      <div
        className="search-overlay-container"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center border-b border-[var(--border)]" style={{ padding: "0.75rem 1rem", gap: "0.75rem" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar features, termos, regras, páginas..."
            className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none"
            style={{ fontSize: "1rem" }}
          />
          <kbd className="text-xs font-mono text-[var(--text-muted)] bg-[var(--surface-hover)] rounded border border-[var(--border)]" style={{ padding: "0.125rem 0.375rem" }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="overflow-y-auto" style={{ maxHeight: "24rem" }}>
          {results.length > 0 ? (
            results.map((result, i) => {
              const colorStyle = TYPE_COLORS[result.type];
              return (
                <button
                  key={result.id}
                  onClick={() => navigateTo(result)}
                  className={`w-full flex items-start text-left transition-colors ${
                    i === selectedIndex ? "bg-[var(--primary)]/10" : "hover:bg-[var(--surface-hover)]"
                  }`}
                  style={{ padding: "0.75rem 1rem", gap: "0.75rem", borderBottom: "1px solid var(--border)" }}
                >
                  <span style={{ fontSize: "1.25rem", marginTop: "0.125rem" }}>
                    {TYPE_ICONS[result.type]}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center" style={{ gap: "0.5rem", marginBottom: "0.125rem" }}>
                      <span className="font-medium text-[var(--foreground)] truncate">
                        {result.name}
                      </span>
                      <span
                        className="text-[11px] font-semibold rounded-full whitespace-nowrap shrink-0"
                        style={{ padding: "0.125rem 0.5rem", ...colorStyle }}
                      >
                        {TYPE_LABELS[result.type]}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {result.description}
                    </p>
                  </div>
                  {i === selectedIndex && (
                    <span className="text-xs text-[var(--text-muted)] shrink-0 self-center">
                      ↵
                    </span>
                  )}
                </button>
              );
            })
          ) : query.trim() ? (
            <div className="text-center text-sm text-[var(--text-muted)]" style={{ padding: "2rem 1rem" }}>
              Nenhum resultado para &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="text-center text-sm text-[var(--text-muted)]" style={{ padding: "2rem 1rem" }}>
              Digite para buscar em features, glossário, regras e páginas
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center border-t border-[var(--border)] text-xs text-[var(--text-muted)]" style={{ padding: "0.5rem 1rem", gap: "1rem" }}>
          <span className="flex items-center" style={{ gap: "0.25rem" }}>
            <kbd className="font-mono bg-[var(--surface-hover)] rounded border border-[var(--border)]" style={{ padding: "0.0625rem 0.25rem" }}>↑</kbd>
            <kbd className="font-mono bg-[var(--surface-hover)] rounded border border-[var(--border)]" style={{ padding: "0.0625rem 0.25rem" }}>↓</kbd>
            navegar
          </span>
          <span className="flex items-center" style={{ gap: "0.25rem" }}>
            <kbd className="font-mono bg-[var(--surface-hover)] rounded border border-[var(--border)]" style={{ padding: "0.0625rem 0.25rem" }}>↵</kbd>
            abrir
          </span>
          <span className="flex items-center" style={{ gap: "0.25rem" }}>
            <kbd className="font-mono bg-[var(--surface-hover)] rounded border border-[var(--border)]" style={{ padding: "0.0625rem 0.25rem" }}>esc</kbd>
            fechar
          </span>
          {results.length > 0 && (
            <span style={{ marginLeft: "auto" }}>
              {results.length} resultado{results.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
