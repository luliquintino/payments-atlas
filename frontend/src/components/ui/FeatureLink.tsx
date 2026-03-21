"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { getFeatureByName, getFeatureById } from "@/data/features";

interface FeatureLinkProps {
  /** Nome da feature (resolve automaticamente para o ID via alias map) */
  name: string;
  /** ID da feature (se já conhecido, evita busca por nome) */
  featureId?: string;
  /** Classes CSS adicionais */
  className?: string;
  /** Mostrar tooltip no hover (default: true) */
  showTooltip?: boolean;
  /** Filhos customizados (se não fornecido, usa o nome) */
  children?: React.ReactNode;
}

/**
 * FeatureLink — Componente de link clicável para features de pagamento.
 *
 * Resolve o nome da feature para uma rota dinâmica `/knowledge/features/[id]`.
 * Exibe tooltip com descrição curta no hover.
 * Se a feature não for encontrada, renderiza como texto plano (graceful degradation).
 */
export default function FeatureLink({
  name,
  featureId,
  className = "",
  showTooltip = true,
  children,
}: FeatureLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Resolve a feature
  const feature = featureId ? getFeatureById(featureId) : getFeatureByName(name);

  // Graceful degradation: se não encontrou, renderiza como texto
  if (!feature) {
    return (
      <span className={`text-[var(--foreground)] ${className}`}>
        {children || name}
      </span>
    );
  }

  return (
    <span className="relative inline-block">
      <Link
        ref={linkRef}
        href={`/knowledge/features/${feature.id}`}
        className={`inline-flex items-center gap-1 text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium underline decoration-[var(--primary)]/30 underline-offset-2 hover:decoration-[var(--primary)] transition-all duration-200 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children || name}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50 shrink-0"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>

      {/* Tooltip */}
      {showTooltip && isHovered && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 pointer-events-none animate-fade-in">
          <div className="bg-[var(--foreground)] text-[var(--background)] rounded-xl p-3 shadow-xl text-xs leading-relaxed">
            <div className="font-semibold mb-1">{feature.name}</div>
            <p className="opacity-80 line-clamp-2">{feature.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-xs font-medium uppercase">
                {feature.layer}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-xs font-medium">
                {feature.category}
              </span>
            </div>
          </div>
          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-[var(--foreground)] rotate-45 -mt-1" />
          </div>
        </div>
      )}
    </span>
  );
}
