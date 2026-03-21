"use client";

import { useState } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import {
  treasuryFunctions,
  TREASURY_CATEGORY_COLORS,
  type TreasuryCategory,
  type TreasuryFunction,
} from "@/data/infrastructure-data";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Agrupa funcoes por categoria, preservando a ordem de aparicao. */
function groupByCategory(
  functions: TreasuryFunction[],
): { category: TreasuryCategory; items: TreasuryFunction[] }[] {
  const map = new Map<TreasuryCategory, TreasuryFunction[]>();

  for (const fn of functions) {
    const existing = map.get(fn.category);
    if (existing) {
      existing.push(fn);
    } else {
      map.set(fn.category, [fn]);
    }
  }

  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    items,
  }));
}

const CATEGORY_DESCRIPTIONS: Record<TreasuryCategory, string> = {
  Liquidez:
    "Gestao de fundos disponiveis para cumprir obrigacoes de pagamento, incluindo liquidez intraday, pooling e reservas compulsorias.",
  FX:
    "Operacoes de cambio spot, forward e estrategias de hedge para proteger contra variacao cambial em operacoes internacionais.",
  "Cash Management":
    "Previsao de fluxos de caixa, execucao de pagamentos e reconciliacao — o dia a dia da operacao financeira.",
  Funding:
    "Captacao de recursos de curto e longo prazo, gestao de capital regulatorio e otimizacao da estrutura de financiamento.",
  Risk:
    "Identificacao, mensuracao e mitigacao de riscos de taxa de juros e contraparte que afetam a posicao financeira.",
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function LiquidityTreasuryPage() {
  const quiz = getQuizForPage("/infrastructure/liquidity-treasury");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const grouped = groupByCategory(treasuryFunctions);

  const toggleCard = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Filter grouped data based on search
  const filteredGrouped = search.trim()
    ? grouped
        .map(({ category, items }) => ({
          category,
          items: items.filter(
            (fn) =>
              fn.name.toLowerCase().includes(search.toLowerCase()) ||
              fn.keyActivities.some((a) =>
                a.toLowerCase().includes(search.toLowerCase())
              ),
          ),
        }))
        .filter(({ items }) => items.length > 0)
    : grouped;

  return (
    <div className="max-w-6xl mx-auto">
      {/* ---- Cabecalho da pagina ---- */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Liquidez & Tesouraria</h1>
        <p className="page-description">
          Funcoes essenciais de tesouraria e gestao de liquidez que sustentam a
          infraestrutura financeira. Da gestao de caixa intraday ao hedge
          cambial, estas funcoes garantem que instituicoes financeiras e
          corporacoes mantenham solvencia, otimizem capital e gerenciem riscos de
          mercado.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>O que é gestão de liquidez</li>
          <li>Como funciona a tesouraria de instituições financeiras</li>
          <li>Estratégias de gestão de caixa</li>
        </ul>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 animate-fade-in stagger-2" style={{ gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>📋</div>
          <div className="metric-value" style={{ fontSize: "1.5rem" }}>{treasuryFunctions.length}</div>
          <div className="text-xs text-[var(--text-muted)]">Funcoes</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>📂</div>
          <div className="metric-value" style={{ fontSize: "1.5rem" }}>{Object.keys(grouped).length}</div>
          <div className="text-xs text-[var(--text-muted)]">Categorias</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🔗</div>
          <div className="metric-value" style={{ fontSize: "1.5rem" }}>{new Set(treasuryFunctions.flatMap(f => f.relatedSystems || [])).size}</div>
          <div className="text-xs text-[var(--text-muted)]">Sistemas</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>👥</div>
          <div className="metric-value" style={{ fontSize: "1.5rem" }}>{new Set(treasuryFunctions.flatMap(f => f.actors || [])).size}</div>
          <div className="text-xs text-[var(--text-muted)]">Atores</div>
        </div>
      </div>

      {/* ---- Disclaimer ---- */}
      <p className="text-xs text-[var(--text-muted)] animate-fade-in stagger-3" style={{ marginBottom: "1.5rem", fontStyle: "italic" }}>
        * Esses numeros podem ter sofrido alteracao com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* ---- Search ---- */}
      <div className="relative animate-fade-in stagger-3" style={{ marginBottom: "1.5rem" }}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" style={{ fontSize: "1rem" }}>🔎</span>
        <input
          type="text"
          placeholder="Buscar funcao, atividade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-lighter)]"
          style={{ padding: "0.75rem 1rem 0.75rem 2.5rem" }}
        />
      </div>

      {/* ---- Categorias agrupadas ---- */}
      <div className="flex flex-col" style={{ gap: "2.5rem" }}>
        {filteredGrouped.map(({ category, items }, catIdx) => {
          const color = TREASURY_CATEGORY_COLORS[category];

          return (
            <section
              key={category}
              className={`animate-fade-in stagger-${Math.min(catIdx + 1, 6)}`}
            >
              {/* Cabecalho da categoria */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div className="flex items-center" style={{ gap: "0.75rem", marginBottom: "0.375rem" }}>
                  <div
                    className="w-2 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <h2 className="text-xl font-bold">{category}</h2>
                </div>
                <p className="text-sm text-[var(--text-muted)] max-w-2xl" style={{ marginLeft: "1.25rem" }}>
                  {CATEGORY_DESCRIPTIONS[category]}
                </p>
              </div>

              {/* Grid de funcoes */}
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1rem" }}>
                {items.map((fn) => {
                  const isExpanded = expandedId === fn.id;

                  return (
                    <div
                      key={fn.id}
                      className={`card-glow text-left transition-all duration-200 ${
                        isExpanded
                          ? "ring-1 ring-[var(--primary)]/40 shadow-lg"
                          : ""
                      }`}
                      style={{
                        borderTopColor: isExpanded ? color : undefined,
                        borderTopWidth: isExpanded ? "2px" : undefined,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCard(fn.id)}
                        className="w-full text-left"
                        style={{ padding: "1rem 1.25rem" }}
                      >
                        {/* Indicador de cor da categoria */}
                        <div className="flex items-start" style={{ gap: "0.75rem", marginBottom: "0.5rem" }}>
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: color, marginTop: "0.375rem" }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold leading-snug">
                              {fn.name}
                            </h3>
                          </div>
                          {/* Chevron */}
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 20 20"
                            fill="none"
                            className={`text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            style={{ marginTop: "0.125rem" }}
                          >
                            <path
                              d="M5 7.5L10 12.5L15 7.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        {/* Descricao — sempre visivel */}
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed" style={{ marginBottom: "0.25rem" }}>
                          {fn.description}
                        </p>
                      </button>

                      {/* Conteudo expandido — CSS Grid animation */}
                      <div className="grid transition-all duration-300 ease-in-out" style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}>
                        <div className="overflow-hidden">
                          <div style={{ padding: "1rem 1.25rem" }}>
                            <div className="border-t border-[var(--border)]" style={{ paddingTop: "1rem" }}>
                              <div className="flex flex-col" style={{ gap: "1rem" }}>
                                {/* Atividades-chave */}
                                <div>
                                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]" style={{ marginBottom: "0.5rem" }}>
                                    Atividades-chave
                                  </h4>
                                  <ul className="flex flex-col" style={{ gap: "0.375rem" }}>
                                    {fn.keyActivities.map((activity) => (
                                      <li
                                        key={activity}
                                        className="flex items-start text-sm"
                                        style={{ gap: "0.5rem" }}
                                      >
                                        <span
                                          className="w-1.5 h-1.5 rounded-full shrink-0"
                                          style={{ backgroundColor: color, marginTop: "0.375rem" }}
                                        />
                                        <span className="text-[var(--foreground)]">
                                          {activity}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Sistemas relacionados */}
                                <div>
                                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]" style={{ marginBottom: "0.5rem" }}>
                                    Sistemas Relacionados
                                  </h4>
                                  <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                                    {fn.relatedSystems.map((system) => (
                                      <span
                                        key={system}
                                        className="text-xs rounded-lg font-medium border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--text-muted)]"
                                        style={{ padding: "0.25rem 0.625rem" }}
                                      >
                                        {system}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Atores */}
                                <div>
                                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]" style={{ marginBottom: "0.5rem" }}>
                                    Atores
                                  </h4>
                                  <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                                    {fn.actors.map((actor) => (
                                      <span
                                        key={actor}
                                        className="text-xs rounded-lg font-medium"
                                        style={{
                                          backgroundColor: `${color}18`,
                                          color: color,
                                          border: `1px solid ${color}30`,
                                          padding: "0.25rem 0.625rem",
                                        }}
                                      >
                                        {actor}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ---- Paginas Relacionadas ---- */}
      <div style={{ marginTop: "2.5rem" }}>
        <div className="divider-text animate-fade-in" style={{ marginBottom: "0.75rem" }}>
          Páginas Relacionadas
        </div>
        <div className="flex flex-col" style={{ gap: "0.75rem" }}>
          {[
            { label: "Sistemas Bancários", href: "/infrastructure/banking-systems", icon: "🏛️", color: "#3b82f6" },
            { label: "Sistemas de Liquidação", href: "/infrastructure/settlement-systems", icon: "⚙️", color: "#f59e0b" },
            { label: "Sistema Financeiro Global", href: "/explore/financial-system", icon: "🌍", color: "#8b5cf6" },
          ].map((page) => (
            <a key={page.href} href={page.href} className="card-flat interactive-hover flex items-center" style={{ gap: "0.75rem", padding: "1rem", textDecoration: "none" }}>
              <span style={{ fontSize: "1.25rem" }}>{page.icon}</span>
              <span className="font-medium text-sm">{page.label}</span>
              <span className="text-[var(--text-muted)] text-xs" style={{ marginLeft: "auto" }}>→</span>
            </a>
          ))}
        </div>
      </div>

      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
            🧠 Teste seu Conhecimento
          </h2>
          <PageQuiz
            questions={quiz.questions}
            xpPerQuestion={5}
            onComplete={(correct, total) => {
              recordQuiz(quiz.pageRoute, correct, total);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
