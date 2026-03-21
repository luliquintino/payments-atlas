"use client";

import { useState, useCallback } from "react";
import {
  TAXONOMY,
  TAXONOMY_COLORS,
  TAXONOMY_ICONS,
  collectIds,
  countLeafNodes,
  type TaxonomyItem,
} from "@/data/taxonomy-data";

/**
 * Taxonomia Completa de Pagamentos, Fintech e Cripto.
 *
 * Arvore hierarquica cobrindo 9 categorias: Payments Core, Payment Infrastructure,
 * Fraud & Risk, Financial Infrastructure, Crypto & Blockchain, DeFi,
 * Payment Metrics, Payment Optimization, Settlement & Reconciliation.
 *
 * ~200+ conceitos organizados em ~60 subcategorias.
 */

// ---------------------------------------------------------------------------
// Componente de No de Arvore Recursivo
// ---------------------------------------------------------------------------

function TreeNode({
  item,
  depth,
  expandedIds,
  onToggle,
  search,
  rootId,
}: {
  item: TaxonomyItem;
  depth: number;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  search: string;
  rootId: string;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedIds.has(item.id);
  const isRoot = depth === 0;
  const colors = TAXONOMY_COLORS[item.id];
  const icon = TAXONOMY_ICONS[item.id];

  /** Verifica se este item ou algum descendente corresponde a busca */
  const matchesSearch = (node: TaxonomyItem): boolean => {
    if (search === "") return true;
    const term = search.toLowerCase();
    if (
      node.label.toLowerCase().includes(term) ||
      (node.description && node.description.toLowerCase().includes(term))
    ) {
      return true;
    }
    return node.children?.some(matchesSearch) ?? false;
  };

  if (search !== "" && !matchesSearch(item)) return null;

  /** Destaca texto correspondente */
  const highlight = (text: string) => {
    if (search === "") return text;
    const idx = text.toLowerCase().indexOf(search.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 dark:bg-yellow-800 rounded" style={{ padding: "0 0.125rem" }}>
          {text.slice(idx, idx + search.length)}
        </mark>
        {text.slice(idx + search.length)}
      </>
    );
  };

  return (
    <div style={isRoot ? { marginBottom: "0.75rem" } : undefined}>
      {/* Node row */}
      <div
        className={`flex items-start rounded-lg transition-all ${
          isRoot
            ? "border border-[var(--border)] bg-[var(--surface)] hover:shadow-md hover:border-[var(--primary)]/20"
            : "hover:bg-[var(--surface-hover)]"
        }`}
        style={{
          gap: "0.5rem",
          ...(isRoot
            ? { padding: "1rem" }
            : { paddingLeft: `${depth * 20 + 12}px`, paddingRight: "0.75rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }),
        }}
      >
        {/* Expand toggle */}
        {hasChildren ? (
          <button
            onClick={() => onToggle(item.id)}
            className={`flex-shrink-0 flex items-center justify-center rounded transition-transform cursor-pointer ${
              isRoot
                ? "text-[var(--primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
            style={{ marginTop: "0.125rem", width: "1.25rem", height: "1.25rem" }}
          >
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="flex-shrink-0 flex items-center justify-center" style={{ marginTop: "0.125rem", width: "1.25rem", height: "1.25rem" }}>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: TAXONOMY_COLORS[rootId]?.accent || "var(--primary)" }}
            />
          </span>
        )}

        {/* Icon (root only) */}
        {isRoot && icon && (
          <span className="text-lg shrink-0" style={{ marginTop: "0.125rem" }}>{icon}</span>
        )}

        {/* Label + description */}
        <div className="flex-1 min-w-0">
          <span
            className={`font-medium ${
              isRoot
                ? "text-base text-[var(--foreground)]"
                : depth === 1
                  ? "text-sm font-semibold text-[var(--foreground)]"
                  : "text-sm text-[var(--foreground)]"
            }`}
          >
            {highlight(item.label)}
          </span>
          {item.description && (
            <p
              className={`text-[var(--text-muted)] leading-relaxed ${
                isRoot ? "text-sm" : "text-xs"
              }`}
              style={{ marginTop: isRoot ? "0.25rem" : "0.125rem" }}
            >
              {highlight(item.description)}
            </p>
          )}
        </div>

        {/* Child count badge */}
        {hasChildren && (
          <span className="flex-shrink-0 text-[13px] font-medium text-[var(--text-muted)] bg-[var(--surface-hover)] rounded-full" style={{ padding: "0.25rem 0.625rem", marginTop: "0.125rem" }}>
            {item.children!.length}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div style={isRoot ? { marginTop: "0.25rem" } : undefined}>
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
              search={search}
              rootId={rootId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function TaxonomyPage() {
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(TAXONOMY.map((t) => t.id)),
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const totalItems = collectIds(TAXONOMY).length;
  const leafCount = countLeafNodes(TAXONOMY);

  /** Toggle a single node */
  const toggleNode = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /** Expand all */
  const expandAll = useCallback(() => {
    setExpandedIds(new Set(collectIds(TAXONOMY)));
  }, []);

  /** Collapse all */
  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  /** Filter taxonomy by active category */
  const displayedTaxonomy = activeCategory
    ? TAXONOMY.filter((t) => t.id === activeCategory)
    : TAXONOMY;

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Taxonomia de Pagamentos</h1>
        <p className="page-description">
          Ontologia completa do sistema financeiro digital — {totalItems} conceitos
          organizados em {TAXONOMY.length} categorias, cobrindo pagamentos, infraestrutura,
          fraude, cripto, DeFi, metricas e otimizacao.
        </p>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Termos", value: "200+" },
          { label: "Categorias", value: "10" },
          { label: "Niveis", value: "5" },
          { label: "Sub-categorias", value: "30" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{s.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem", opacity: 0.7 }}>
        * Numeros podem variar conforme fonte e data de consulta. Valores aproximados para fins didaticos.
      </p>

      {/* Category filter chips */}
      <div className="animate-fade-in stagger-2" style={{ marginBottom: "1.5rem" }}>
        <div className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]" style={{ marginBottom: "0.5rem" }}>
          Filtrar por categoria
        </div>
        <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-xs rounded-full font-medium transition-all border ${
              !activeCategory
                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]/30"
            }`}
            style={{ padding: "0.375rem 0.75rem" }}
          >
            Todas ({TAXONOMY.length})
          </button>
          {TAXONOMY.map((cat) => {
            const isActive = activeCategory === cat.id;
            const icon = TAXONOMY_ICONS[cat.id];
            const childCount = collectIds([cat]).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(isActive ? null : cat.id);
                  // Expand clicked category
                  if (!isActive) {
                    setExpandedIds((prev) => {
                      const next = new Set(prev);
                      next.add(cat.id);
                      return next;
                    });
                  }
                }}
                className={`text-xs rounded-full font-medium transition-all border flex items-center ${
                  isActive
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30"
                    : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]/30 hover:text-[var(--foreground)]"
                }`}
                style={{ padding: "0.375rem 0.75rem", gap: "0.375rem" }}
              >
                {icon && <span>{icon}</span>}
                <span>{cat.label}</span>
                <span className="opacity-60">({childCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + controls */}
      <div className="flex flex-wrap items-center animate-fade-in stagger-3" style={{ marginBottom: "1.5rem", gap: "0.75rem" }}>
        <div className="relative flex-1 min-w-[250px]">
          <svg
            className="absolute -translate-y-1/2"
            style={{ left: "0.875rem", top: "50%", color: "var(--text-muted)" }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar conceito, categoria ou descricao..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value !== "") {
                setExpandedIds(new Set(collectIds(TAXONOMY)));
              }
            }}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)] transition-all"
            style={{ paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)]"
              style={{ right: "0.875rem", top: "50%" }}
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={expandAll}
          className="text-sm rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
          style={{ padding: "0.5rem 0.75rem" }}
        >
          Expandir Tudo
        </button>
        <button
          onClick={collapseAll}
          className="text-sm rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
          style={{ padding: "0.5rem 0.75rem" }}
        >
          Recolher Tudo
        </button>

        <span className="text-sm text-[var(--text-muted)]">
          {totalItems} itens
        </span>
      </div>

      {/* Taxonomy tree */}
      <div className="flex flex-col animate-fade-in stagger-4" style={{ gap: "0.25rem" }}>
        {displayedTaxonomy.map((rootItem) => (
          <TreeNode
            key={rootItem.id}
            item={rootItem}
            depth={0}
            expandedIds={expandedIds}
            onToggle={toggleNode}
            search={search}
            rootId={rootItem.id}
          />
        ))}
      </div>

      {/* Empty state */}
      {search && displayedTaxonomy.length === 0 && (
        <div className="text-center text-[var(--text-muted)]" style={{ padding: "4rem 0" }}>
          <div className="text-4xl" style={{ marginBottom: "0.75rem" }}>🔍</div>
          <p className="text-sm">
            Nenhum conceito encontrado para &ldquo;{search}&rdquo;.
          </p>
          <button
            onClick={() => { setSearch(""); setActiveCategory(null); }}
            className="text-sm text-[var(--primary)] hover:text-[var(--primary-light)]"
            style={{ marginTop: "0.75rem" }}
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Knowledge Graph taxonomy */}
      <div className="card-glow animate-fade-in stagger-5" style={{ marginTop: "2.5rem" }}>
        <h3 className="font-semibold flex items-center" style={{ marginBottom: "0.75rem", gap: "0.5rem" }}>
          <span>🔗</span>
          Knowledge Graph — Tipos de Nós e Relações
        </h3>
        <p className="text-xs text-[var(--text-muted)]" style={{ marginBottom: "1rem" }}>
          A taxonomia define os tipos de nós e relações do Knowledge Graph do Atlas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1rem" }}>
          {/* Node types */}
          <div className="rounded-xl bg-[var(--surface-hover)]" style={{ padding: "1rem" }}>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]" style={{ marginBottom: "0.5rem" }}>
              Tipos de Nós
            </div>
            <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
              {[
                { label: "concept", color: "#2563eb" },
                { label: "feature", color: "#059669" },
                { label: "system", color: "#d97706" },
                { label: "company", color: "#6366f1" },
                { label: "protocol", color: "#ec4899" },
                { label: "metric", color: "#0891b2" },
                { label: "problem", color: "#ef4444" },
                { label: "solution", color: "#10b981" },
              ].map((n) => (
                <span
                  key={n.label}
                  className="text-xs font-mono rounded-lg text-white"
                  style={{ backgroundColor: n.color, padding: "0.25rem 0.625rem" }}
                >
                  {n.label}
                </span>
              ))}
            </div>
          </div>
          {/* Edge types */}
          <div className="rounded-xl bg-[var(--surface-hover)]" style={{ padding: "1rem" }}>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]" style={{ marginBottom: "0.5rem" }}>
              Tipos de Relações
            </div>
            <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
              {[
                "depends_on",
                "part_of",
                "causes",
                "solves",
                "used_in",
                "integrates_with",
                "improves",
                "issues",
                "runs_on",
              ].map((e) => (
                <span
                  key={e}
                  className="text-xs font-mono rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]"
                  style={{ padding: "0.25rem 0.625rem" }}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Example connections */}
        <div className="rounded-xl bg-[var(--surface-hover)]" style={{ marginTop: "1rem", padding: "1rem" }}>
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]" style={{ marginBottom: "0.5rem" }}>
            Exemplos de Conexões
          </div>
          <div className="flex flex-col" style={{ gap: "0.5rem" }}>
            {[
              { from: "Network Token", rel: "improves", to: "Approval Rate", desc: "+2-5% taxa de aprovacao" },
              { from: "Smart Routing", rel: "depends_on", to: "Multi-Acquirer", desc: "Precisa de multiplos adquirentes" },
              { from: "USDC", rel: "issued_by", to: "Circle", desc: "Emitido e gerenciado pela Circle" },
              { from: "Uniswap", rel: "deployed_on", to: "Ethereum", desc: "Smart contracts na EVM" },
              { from: "Card Testing", rel: "causes", to: "Chargeback Rate ↑", desc: "Fraude aumenta chargebacks" },
              { from: "3D Secure", rel: "solves", to: "Friendly Fraud", desc: "Autenticacao reduz disputas" },
            ].map((c, i) => (
              <div key={i} className="flex items-center text-sm flex-wrap" style={{ gap: "0.5rem" }}>
                <span className="font-semibold text-[var(--foreground)]">{c.from}</span>
                <span className="text-xs font-mono rounded bg-[var(--surface)] text-[var(--primary)] border border-[var(--border)]" style={{ padding: "0.125rem 0.5rem" }}>
                  {c.rel}
                </span>
                <span className="font-semibold text-[var(--primary)]">{c.to}</span>
                <span className="text-xs text-[var(--text-muted)] hidden sm:block" style={{ marginLeft: "auto" }}>
                  {c.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card-glow animate-fade-in" style={{ marginTop: "1.5rem" }}>
        <h3 className="font-semibold" style={{ marginBottom: "0.75rem" }}>Sobre esta taxonomia</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Esta ontologia financeira cobre todo o universo de pagamentos digitais —
          desde meios de pagamento tradicionais e infraestrutura bancaria ate
          blockchain, stablecoins e protocolos DeFi. Ela alimenta a busca
          inteligente, o diagnostico automatizado (Conta Comigo) e as simulacoes
          de arquitetura do Payments Atlas.
        </p>
      </div>

      {/* Related Pages Footer */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Base de Features", href: "/knowledge/features", icon: "⚡" },
          { name: "Mapa de Pagamentos", href: "/knowledge/payments-map", icon: "🗺️" },
          { name: "Ecossistema", href: "/knowledge/ecosystem", icon: "🌐" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
