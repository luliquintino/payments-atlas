"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import { FEATURES_REGISTRY } from "@/data/features";
import {
  ALL_LAYERS,
  LAYER_LABELS,
  LAYER_COLORS,
  COMPLEXITY_LABELS,
  COMPLEXITY_COLORS,
} from "@/data/types";
import type { Layer, Complexity } from "@/data/types";

/**
 * Base de Features — Seção de Conhecimento
 *
 * Grade pesquisável e filtrável de features de pagamento.
 * Cada feature pertence a uma camada do stack de pagamentos e exibe
 * sua categoria, complexidade, atores envolvidos e métricas impactadas.
 * Cards linkam para a página de detalhe individual da feature.
 */

export default function FeaturesPage() {
  const quiz = getQuizForPage("/knowledge/features");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLayer, setSelectedLayer] = useState<Layer | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedComplexity, setSelectedComplexity] = useState<Complexity | "all">("all");

  /** Deriva categorias únicas dos dados */
  const allCategories = useMemo(
    () => Array.from(new Set(FEATURES_REGISTRY.map((f) => f.category))).sort(),
    [],
  );

  /** Filtra features com base no estado atual de busca e filtros */
  const filtered = useMemo(() => {
    return FEATURES_REGISTRY.filter((f) => {
      const matchesSearch =
        search === "" ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase());
      const matchesLayer = selectedLayer === "all" || f.layer === selectedLayer;
      const matchesCategory = selectedCategory === "all" || f.category === selectedCategory;
      const matchesComplexity =
        selectedComplexity === "all" || f.complexity === selectedComplexity;
      return matchesSearch && matchesLayer && matchesCategory && matchesComplexity;
    });
  }, [search, selectedLayer, selectedCategory, selectedComplexity]);

  return (
    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
      {/* Cabeçalho da página */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Base de Features</h1>
        <p className="page-description">
          Catálogo pesquisável de features de pagamento em todas as camadas do stack.
          Clique em uma feature para ver detalhes, dependências e regras de negócio.
        </p>
      </div>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>Catálogo de features do stack de pagamentos</li>
          <li>Como features se relacionam entre si</li>
          <li>Complexidade e dependências de cada feature</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Features", value: "300+" },
          { label: "Categorias", value: "8" },
          { label: "Integrações", value: "50+" },
          { label: "Areas", value: "15" },
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

      {/* Barra de busca e filtros */}
      <div className="animate-fade-in stagger-2" style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Campo de busca */}
        <div className="relative">
          <span className="absolute -translate-y-1/2" style={{ left: "0.75rem", top: "50%" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="var(--text-muted)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar features por nome, descrição ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--surface-active)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm transition"
            style={{ paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
          />
        </div>

        {/* Linha de filtros */}
        <div className="flex flex-wrap items-center" style={{ gap: "0.75rem" }}>
          {/* Filtro de camada */}
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value as Layer | "all")}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm transition"
            style={{ padding: "0.625rem 1rem" }}
          >
            <option value="all">Todas as Camadas</option>
            {ALL_LAYERS.map((l) => (
              <option key={l} value={l}>
                {LAYER_LABELS[l]}
              </option>
            ))}
          </select>

          {/* Filtro de categoria */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm transition"
            style={{ padding: "0.625rem 1rem" }}
          >
            <option value="all">Todas as Categorias</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Filtro de complexidade */}
          <select
            value={selectedComplexity}
            onChange={(e) => setSelectedComplexity(e.target.value as Complexity | "all")}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm transition"
            style={{ padding: "0.625rem 1rem" }}
          >
            <option value="all">Todas as Complexidades</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>

          {/* Contagem de resultados */}
          <span className="rounded-full bg-[var(--primary)]/10 text-[var(--primary-light)] text-sm font-semibold" style={{ marginLeft: "auto", padding: "0.375rem 0.875rem" }}>
            {filtered.length} feature{filtered.length !== 1 && "s"}
          </span>
        </div>
      </div>

      {/* Grade de cards de features */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" style={{ gap: "1.25rem" }}>
        {filtered.map((feature, index) => (
          <Link
            key={feature.id}
            href={`/knowledge/features/${feature.id}`}
            className={`group card-glow text-left cursor-pointer w-full animate-fade-in stagger-${Math.min((index % 6) + 1, 6)}`}
          >
            {/* Cabeçalho: nome + badge de complexidade */}
            <div className="flex items-start justify-between" style={{ gap: "0.5rem", marginBottom: "0.75rem" }}>
              <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary-light)] transition-colors">
                {feature.name}
              </h3>
              <span
                className={`text-[13px] font-semibold rounded-full whitespace-nowrap ${COMPLEXITY_COLORS[feature.complexity]}`}
                style={{ padding: "0.25rem 0.625rem" }}
              >
                {COMPLEXITY_LABELS[feature.complexity]}
              </span>
            </div>

            {/* Descrição */}
            <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2" style={{ marginBottom: "1rem" }}>
              {feature.description}
            </p>

            {/* Badges de camada e categoria */}
            <div className="flex flex-wrap" style={{ gap: "0.625rem", marginBottom: "1rem" }}>
              <span
                className={`chip text-xs font-semibold ${LAYER_COLORS[feature.layer]}`}
              >
                {LAYER_LABELS[feature.layer]}
              </span>
              <span className="chip chip-muted text-xs font-medium">
                {feature.category}
              </span>
            </div>

            {/* Footer: deps + seta clicável */}
            <div className="flex items-center justify-between border-t border-[var(--border)]" style={{ paddingTop: "0.75rem" }}>
              <span className="flex items-center text-xs text-[var(--text-muted)]" style={{ gap: "0.375rem" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {feature.dependencies?.length || 0} dependências
              </span>
              <span className="flex items-center text-[var(--primary-light)] font-medium text-xs opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" style={{ gap: "0.25rem" }}>
                Explorar
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Estado vazio */}
      {filtered.length === 0 && (
        <div className="text-center animate-fade-in" style={{ padding: "4rem 0" }}>
          <p className="text-[var(--text-muted)] text-lg">
            Nenhuma feature corresponde aos seus filtros.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedLayer("all");
              setSelectedCategory("all");
              setSelectedComplexity("all");
            }}
            className="text-[var(--primary)] text-sm hover:underline"
            style={{ marginTop: "0.75rem" }}
          >
            Limpar todos os filtros
          </button>
        </div>
      )}

      {/* Related Pages Footer */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Regras de Negocio", href: "/knowledge/business-rules", icon: "📋" },
          { name: "Grafo de Dependencias", href: "/knowledge/dependency-graph", icon: "🔗" },
          { name: "Taxonomia", href: "/knowledge/taxonomy", icon: "🌳" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
          </a>
        ))}
      </div>

      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
            🧠 Teste seu Conhecimento
          </h2>
          <PageQuiz
            questions={quiz.questions}
            onComplete={(correct, total, xpEarned) => {
              recordQuiz(quiz.pageRoute, correct, total, xpEarned);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
