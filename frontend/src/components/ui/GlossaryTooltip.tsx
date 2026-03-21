"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { getTermByName, getTermById, CATEGORY_META } from "@/data/glossary";

interface GlossaryTooltipProps {
  /** Nome ou alias do termo (resolve automaticamente) */
  term: string;
  /** ID do termo (se já conhecido, evita busca por nome) */
  termId?: string;
  /** Classes CSS adicionais */
  className?: string;
  /** Mostrar tooltip no hover (default: true) */
  showTooltip?: boolean;
  /** Conteúdo exibido inline (se não fornecido, usa o nome do termo) */
  children?: React.ReactNode;
}

/**
 * GlossaryTooltip — Exibe definição de um termo do glossário no hover.
 *
 * Resolve o nome para o ID e linka para `/glossary#term-id`.
 * Se o termo não for encontrado, renderiza como texto plano.
 */
export default function GlossaryTooltip({
  term,
  termId,
  className = "",
  showTooltip = true,
  children,
}: GlossaryTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const glossaryTerm = termId ? getTermById(termId) : getTermByName(term);

  if (!glossaryTerm) {
    return (
      <span className={`text-[var(--foreground)] ${className}`}>
        {children || term}
      </span>
    );
  }

  const categoryMeta = CATEGORY_META[glossaryTerm.category];

  return (
    <span className="relative inline-block">
      <Link
        ref={linkRef}
        href={`/glossary#${glossaryTerm.id}`}
        className={`inline-flex items-center gap-0.5 text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium underline decoration-dotted decoration-[var(--primary)]/30 underline-offset-2 hover:decoration-[var(--primary)] transition-all duration-200 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children || term}
      </Link>

      {showTooltip && isHovered && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 pointer-events-none animate-fade-in">
          <div className="bg-[var(--foreground)] text-[var(--background)] rounded-xl shadow-xl text-xs leading-relaxed" style={{ padding: "0.75rem" }}>
            <div className="font-semibold" style={{ marginBottom: "0.25rem" }}>
              {glossaryTerm.term}
            </div>
            <p className="opacity-80 line-clamp-3">{glossaryTerm.definition}</p>
            <div className="flex items-center" style={{ marginTop: "0.5rem", gap: "0.5rem" }}>
              <span
                className={`rounded text-[10px] font-medium uppercase ${categoryMeta.color}`}
                style={{ padding: "0.125rem 0.375rem" }}
              >
                {categoryMeta.label}
              </span>
              <span className="opacity-50 text-[10px]">
                Clique para ver mais →
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-[var(--foreground)] rotate-45 -mt-1" />
          </div>
        </div>
      )}
    </span>
  );
}
