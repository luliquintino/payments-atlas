"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PAGE_RELATIONS } from "@/data/page-relations";

/**
 * RelatedSection — Seção "Relacionados" reutilizável.
 *
 * Automaticamente exibe páginas relacionadas com base na rota atual.
 * Posicionar no rodapé de cada página.
 */

export default function RelatedSection() {
  const pathname = usePathname();
  const related = PAGE_RELATIONS[pathname];

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-10 pt-6 border-t border-[var(--border)] animate-fade-in">
      <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">
        Páginas relacionadas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {related.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group card-flat !p-4 hover:border-[var(--primary-lighter)] transition-all"
          >
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-base">{page.emoji}</span>
              <span className="text-sm font-semibold group-hover:text-[var(--primary)] transition-colors">
                {page.name}
              </span>
            </div>
            <div className="text-xs text-[var(--text-muted)] ml-7">
              {page.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
