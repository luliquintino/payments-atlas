"use client";

import { useState, useMemo } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import { fraudSignals, SignalCategory, SignalStrength } from "@/data/fraud-data";

/**
 * Sinais de Fraude — Catálogo de sinais utilizados na detecção de fraude.
 *
 * 16 sinais organizados em 4 categorias (Device, Comportamental, Identidade,
 * Transacional) com busca e filtro por categoria. Cada sinal mostra força
 * como indicador e risco de falso positivo.
 */

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const ALL_CATEGORIES: ("Todos" | SignalCategory)[] = [
  "Todos",
  "Device",
  "Comportamental",
  "Identidade",
  "Transacional",
];

const CATEGORY_COLORS: Record<SignalCategory, string> = {
  Device: "#6366f1",
  Comportamental: "#0ea5e9",
  Identidade: "#e9a820",
  Transacional: "#1e3a5f",
};

const CATEGORY_ICONS: Record<SignalCategory, string> = {
  Device: "D",
  Comportamental: "C",
  Identidade: "I",
  Transacional: "T",
};

const STRENGTH_CONFIG: Record<
  SignalStrength,
  { bg: string; text: string; border: string; label: string }
> = {
  forte: {
    bg: "rgba(220, 38, 38, 0.1)",
    text: "#dc2626",
    border: "rgba(220, 38, 38, 0.3)",
    label: "Forte",
  },
  moderado: {
    bg: "rgba(234, 88, 12, 0.1)",
    text: "#ea580c",
    border: "rgba(234, 88, 12, 0.3)",
    label: "Moderado",
  },
  fraco: {
    bg: "rgba(202, 138, 4, 0.1)",
    text: "#ca8a04",
    border: "rgba(202, 138, 4, 0.3)",
    label: "Fraco",
  },
};

const FP_RISK_CONFIG: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  alto: {
    bg: "rgba(220, 38, 38, 0.1)",
    text: "#dc2626",
    border: "rgba(220, 38, 38, 0.3)",
  },
  "médio": {
    bg: "rgba(234, 88, 12, 0.1)",
    text: "#ea580c",
    border: "rgba(234, 88, 12, 0.3)",
  },
  baixo: {
    bg: "rgba(30, 58, 95, 0.1)",
    text: "#1e3a5f",
    border: "rgba(30, 58, 95, 0.3)",
  },
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function FraudSignalsPage() {
  const quiz = getQuizForPage("/fraud/fraud-signals");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"Todos" | SignalCategory>("Todos");

  /* ---- Filtragem ---- */
  const filtered = useMemo(() => {
    return fraudSignals.filter((signal) => {
      const matchesCategory =
        activeCategory === "Todos" || signal.category === activeCategory;
      const matchesSearch =
        search.trim() === "" ||
        signal.name.toLowerCase().includes(search.toLowerCase()) ||
        signal.description.toLowerCase().includes(search.toLowerCase()) ||
        signal.category.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  /* ---- Contagens por categoria ---- */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: fraudSignals.length };
    for (const cat of ALL_CATEGORIES.slice(1)) {
      counts[cat] = fraudSignals.filter((s) => s.category === cat).length;
    }
    return counts;
  }, []);

  /* ---- Contagens por forca ---- */
  const strengthCounts = useMemo(() => {
    return {
      forte: filtered.filter((s) => s.strength === "forte").length,
      moderado: filtered.filter((s) => s.strength === "moderado").length,
      fraco: filtered.filter((s) => s.strength === "fraco").length,
    };
  }, [filtered]);

  return (
    <div style={{ maxWidth: "64rem", marginLeft: "auto", marginRight: "auto" }}>
      {/* ---- Cabecalho da pagina ---- */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Sinais de Fraude</h1>
        <p className="page-description">
          Catálogo de sinais utilizados na detecção de fraude em pagamentos.
          Cada sinal indica comportamento potencialmente fraudulento, com
          avaliação de força como indicador e risco de falso positivo.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>Sinais e indicadores de fraude</li>
          <li>Device fingerprinting e análise comportamental</li>
          <li>Modelos de scoring de risco</li>
        </ul>
      </div>

      {/* ---- Stats ---- */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>16</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Sinais</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>4</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Categorias</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>3</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Niveis Risco</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>10+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Indicadores</div>
        </div>
      </div>

      {/* ---- Disclaimer ---- */}
      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem", opacity: 0.7 }}>
        * Numeros podem variar conforme fonte e data de consulta. Valores aproximados para fins didaticos.
      </p>

      {/* ---- Busca e Filtros ---- */}
      <div className="card-glow animate-fade-in stagger-2" style={{ marginBottom: "1.5rem" }}>
        {/* Campo de busca */}
        <div className="relative" style={{ marginBottom: "1rem" }}>
          <span className="absolute" style={{ left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Pesquisar sinais por nome, descricao ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl shadow-sm border text-sm focus:outline-none focus:ring-2"
            style={{
              paddingLeft: "2.5rem",
              paddingRight: "1rem",
              paddingTop: "0.625rem",
              paddingBottom: "0.625rem",
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {/* Filtros de categoria */}
        <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? "shadow-sm" : ""}`}
              style={{
                padding: "0.625rem 1.25rem",
                ...(activeCategory === cat
                  ? { background: "var(--primary)", color: "white" }
                  : { background: "var(--surface-hover)", color: "var(--text-muted)" }),
              }}
            >
              {cat}
              <span className="font-semibold" style={{ marginLeft: "0.375rem", opacity: 0.7 }}>({categoryCounts[cat]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---- Resumo de forca ---- */}
      <div className="flex flex-wrap animate-fade-in stagger-3" style={{ gap: "0.75rem", marginBottom: "1.5rem" }}>
        {(["forte", "moderado", "fraco"] as const).map((str) => {
          const config = STRENGTH_CONFIG[str];
          return (
            <div
              key={str}
              className="flex items-center rounded-xl text-sm font-medium"
              style={{
                background: config.bg,
                color: config.text,
                border: `1px solid ${config.border}`,
                padding: "0.5rem 1rem",
                gap: "0.5rem",
              }}
            >
              <span className="font-bold">{strengthCounts[str]}</span>
              <span>{config.label}</span>
            </div>
          );
        })}
        <div className="flex items-center rounded-xl text-sm font-medium" style={{ color: "var(--text-muted)", padding: "0.5rem 1rem", gap: "0.5rem" }}>
          <span className="font-bold">{filtered.length}</span>
          <span>Total</span>
        </div>
      </div>

      {/* ---- Cards de sinais ---- */}
      {filtered.length === 0 ? (
        <div className="card animate-fade-in stagger-4" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.25rem", marginBottom: "1rem", opacity: 0.3 }}>?</div>
          <h3 className="text-lg font-semibold" style={{ marginBottom: "0.5rem" }}>
            Nenhum sinal encontrado
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Tente ajustar sua pesquisa ou alterar o filtro de categoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1.25rem" }}>
          {filtered.map((signal, idx) => {
            const catColor = CATEGORY_COLORS[signal.category];
            const strConfig = STRENGTH_CONFIG[signal.strength];
            const fpConfig = FP_RISK_CONFIG[signal.falsePositiveRisk];

            return (
              <div
                key={signal.id}
                className={`card-glow hover:shadow-lg transition-all animate-fade-in stagger-${Math.min(idx + 1, 6)}`}
                style={{ borderLeft: `3px solid ${catColor}` }}
              >
                {/* Cabecalho: categoria + nome */}
                <div className="flex items-start" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                    style={{ background: `linear-gradient(to bottom right, ${catColor}, ${catColor}cc)` }}
                  >
                    {CATEGORY_ICONS[signal.category]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold" style={{ marginBottom: "0.125rem" }}>
                      {signal.name}
                    </h3>
                    <span
                      className="text-xs rounded-full font-medium"
                      style={{
                        background: `${catColor}15`,
                        color: catColor,
                        padding: "0.125rem 0.5rem",
                      }}
                    >
                      {signal.category}
                    </span>
                  </div>
                </div>

                {/* Descricao */}
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  {signal.description}
                </p>

                {/* Badges: forca + falso positivo */}
                <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
                  <div className="flex items-center" style={{ gap: "0.375rem" }}>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Forca:
                    </span>
                    <span
                      className="text-[13px] font-semibold rounded-lg"
                      style={{
                        background: strConfig.bg,
                        color: strConfig.text,
                        border: `1px solid ${strConfig.border}`,
                        padding: "0.25rem 0.75rem",
                      }}
                    >
                      {strConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center" style={{ gap: "0.375rem" }}>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Falso Positivo:
                    </span>
                    <span
                      className="text-[13px] font-semibold rounded-lg"
                      style={{
                        background: fpConfig.bg,
                        color: fpConfig.text,
                        border: `1px solid ${fpConfig.border}`,
                        padding: "0.25rem 0.75rem",
                      }}
                    >
                      {signal.falsePositiveRisk}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Nota explicativa ---- */}
      <div className="card-flat animate-fade-in stagger-6" style={{ marginTop: "2rem" }}>
        <h3 className="font-semibold" style={{ marginBottom: "0.75rem" }}>Como interpretar os sinais</h3>
        <div className="text-sm" style={{ color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p>
            <strong style={{ color: "var(--foreground)" }}>Forca do sinal:</strong>{" "}
            Indica o quão confiável o sinal é como indicador de fraude. Sinais
            fortes devem ter mais peso no modelo de scoring; sinais fracos são
            complementares e devem ser combinados com outros indicadores.
          </p>
          <p>
            <strong style={{ color: "var(--foreground)" }}>Risco de falso positivo:</strong>{" "}
            Indica a probabilidade de o sinal bloquear uma transação legítima.
            Sinais com alto risco de falso positivo devem ser usados com cautela
            e combinados com outros sinais antes de gerar bloqueio automático.
          </p>
          <p>
            A combinação de múltiplos sinais de diferentes categorias produz uma
            avaliação de risco mais precisa do que qualquer sinal isolado.
          </p>
        </div>
      </div>

      {/* ---- Footer: Paginas Relacionadas ---- */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Mapa de Fraude", href: "/fraud/fraud-map", icon: "🗺️" },
          { name: "Ciclo de Chargeback", href: "/fraud/chargeback-lifecycle", icon: "🔄" },
          { name: "Biblioteca de Problemas", href: "/problems", icon: "📚" },
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
