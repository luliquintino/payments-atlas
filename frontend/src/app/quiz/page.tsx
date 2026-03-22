"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  type QuizQuestion,
  type QuizCategory,
  type Difficulty,
  getAllQuestions,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
} from "@/data/quizzes";
import { useGameProgress } from "@/hooks/useGameProgress";

/* ── constants ── */
const QUIZ_LENGTH = 20;
const XP_MAP: Record<Difficulty, number> = { easy: 3, medium: 5, hard: 10 };
const SCENARIO_XP = 15;
const LEADERBOARD_KEY = "pks-quiz-hub-leaderboard";

type QuizPhase = "setup" | "playing" | "results";

interface CategoryMeta {
  key: QuizCategory;
  label: string;
  icon: string;
}

const CATEGORIES: CategoryMeta[] = [
  { key: "fundamentos", label: "Fundamentos", icon: "\uD83D\uDCDA" },
  { key: "autorizacao", label: "Autorizacao", icon: "\uD83D\uDD10" },
  { key: "liquidacao", label: "Liquidacao", icon: "\uD83D\uDCB0" },
  { key: "fraude", label: "Fraude", icon: "\uD83D\uDEE1\uFE0F" },
  { key: "infraestrutura", label: "Infraestrutura", icon: "\u2699\uFE0F" },
  { key: "produto", label: "Produto", icon: "\uD83C\uDFAF" },
  { key: "crypto", label: "Crypto", icon: "\uD83D\uDD17" },
  { key: "regulacao", label: "Regulacao", icon: "\uD83D\uDCCB" },
];

const DIFF_OPTIONS: { key: Difficulty | "all"; label: string; color: string }[] = [
  { key: "easy", label: "Facil", color: "#10b981" },
  { key: "medium", label: "Medio", color: "#f59e0b" },
  { key: "hard", label: "Dificil", color: "#ef4444" },
  { key: "all", label: "Todos", color: "#8b5cf6" },
];

function getQuestionXP(q: QuizQuestion): number {
  if (q.type === "scenario") return SCENARIO_XP;
  return XP_MAP[q.difficulty];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(
  pool: QuizQuestion[],
  difficulty: Difficulty | "all",
  count: number,
): QuizQuestion[] {
  if (difficulty !== "all") {
    const filtered = pool.filter((q) => q.difficulty === difficulty);
    return shuffle(filtered).slice(0, count);
  }
  // Distribution: 20% easy, 30% medium, 50% hard
  const easy = shuffle(pool.filter((q) => q.difficulty === "easy"));
  const medium = shuffle(pool.filter((q) => q.difficulty === "medium"));
  const hard = shuffle(pool.filter((q) => q.difficulty === "hard"));
  const easyCount = Math.min(Math.round(count * 0.2), easy.length);
  const mediumCount = Math.min(Math.round(count * 0.3), medium.length);
  const hardCount = Math.min(count - easyCount - mediumCount, hard.length);
  const selected = [
    ...easy.slice(0, easyCount),
    ...medium.slice(0, mediumCount),
    ...hard.slice(0, hardCount),
  ];
  // Fill remaining from any
  const remaining = count - selected.length;
  if (remaining > 0) {
    const ids = new Set(selected.map((q) => q.id));
    const extra = shuffle(pool.filter((q) => !ids.has(q.id))).slice(0, remaining);
    selected.push(...extra);
  }
  return shuffle(selected);
}

/* ── Leaderboard helpers ── */
interface LeaderboardEntry {
  theme: string;
  score: number;
  total: number;
  xp: number;
  date: string;
}

function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

/* ── Component ── */
export default function QuizHubPage() {
  const { recordQuiz } = useGameProgress();

  /* ── setup state ── */
  const [selectedCategories, setSelectedCategories] = useState<Set<QuizCategory>>(new Set());
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
  const [allSelected, setAllSelected] = useState(false);

  /* ── quiz state ── */
  const [phase, setPhase] = useState<QuizPhase>("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [orderValues, setOrderValues] = useState<number[]>([]);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [xpAccum, setXpAccum] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── leaderboard ── */
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(loadLeaderboard());
  }, []);

  /* ── timer ── */
  useEffect(() => {
    if (phase === "playing" && !timerRef.current) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    if (phase !== "playing" && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  /* ── computed ── */
  const allQuestions = getAllQuestions();

  const pool = (() => {
    let p = allQuestions;
    if (selectedCategories.size > 0 && !allSelected) {
      p = p.filter((q) => q.category && selectedCategories.has(q.category));
    }
    return p;
  })();

  const countByDiff = (diff: Difficulty | "all") => {
    if (diff === "all") return pool.length;
    return pool.filter((q) => q.difficulty === diff).length;
  };

  const canStart = (allSelected || selectedCategories.size > 0) && pool.length >= 5;

  /* ── handlers ── */
  const toggleCategory = (cat: QuizCategory) => {
    setAllSelected(false);
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const selectAll = () => {
    setAllSelected(true);
    setSelectedCategories(new Set());
  };

  const startQuiz = () => {
    const picked = pickQuestions(pool, selectedDifficulty, QUIZ_LENGTH);
    setQuestions(picked);
    setCurrentIdx(0);
    setSelectedOption(null);
    setOrderValues([]);
    setAnswered(false);
    setResults([]);
    setXpAccum(0);
    setElapsed(0);
    setPhase("playing");
  };

  const question = questions[currentIdx] as QuizQuestion | undefined;
  const qXP = question ? getQuestionXP(question) : 0;

  // Init ordering values
  useEffect(() => {
    if (question?.type === "ordering" && orderValues.length !== question.options.length) {
      setOrderValues(question.options.map((_, i) => i));
    }
  }, [currentIdx, question]);

  const handleConfirm = () => {
    if (!question) return;
    if (question.type === "ordering") {
      if (!question.correctOrder) return;
      const correct = question.correctOrder.every((v, i) => orderValues[i] === v);
      setAnswered(true);
      setResults((prev) => [...prev, correct]);
      if (correct) setXpAccum((p) => p + qXP);
      return;
    }
    if (selectedOption === null) return;
    const correct = selectedOption === question.correctIndex;
    setAnswered(true);
    setResults((prev) => [...prev, correct]);
    if (correct) setXpAccum((p) => p + qXP);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      // Finish quiz
      const correctCount = results.filter(Boolean).length;
      recordQuiz("/quiz", correctCount, questions.length, xpAccum);
      // Save to leaderboard
      const themeLabel = allSelected
        ? "Todos os Temas"
        : Array.from(selectedCategories)
            .map((c) => CATEGORIES.find((m) => m.key === c)?.label ?? c)
            .join(", ");
      const entry: LeaderboardEntry = {
        theme: themeLabel,
        score: correctCount,
        total: questions.length,
        xp: xpAccum,
        date: new Date().toISOString().slice(0, 10),
      };
      const updated = [entry, ...loadLeaderboard()].slice(0, 20);
      saveLeaderboard(updated);
      setLeaderboard(updated);
      setPhase("results");
    } else {
      setCurrentIdx((p) => p + 1);
      setSelectedOption(null);
      setAnswered(false);
      setOrderValues([]);
    }
  };

  const resetToSetup = () => {
    setPhase("setup");
    setQuestions([]);
    setResults([]);
    setXpAccum(0);
    setElapsed(0);
  };

  const correctCount = results.filter(Boolean).length;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  /* ── difficulty breakdown ── */
  const breakdownByDiff = (diff: Difficulty) => {
    let correct = 0;
    let total = 0;
    questions.forEach((q, i) => {
      if (q.difficulty === diff) {
        total++;
        if (results[i]) correct++;
      }
    });
    return { correct, total };
  };

  const breakdownByCategory = () => {
    const map: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      const cat = q.category || "outros";
      if (!map[cat]) map[cat] = { correct: 0, total: 0 };
      map[cat].total++;
      if (results[i]) map[cat].correct++;
    });
    return map;
  };

  const resultMessage = () => {
    if (correctCount >= 16) return { text: "Especialista!", emoji: "\uD83C\uDFC6" };
    if (correctCount >= 12) return { text: "Muito bom! Quase especialista", emoji: "\uD83D\uDD25" };
    if (correctCount >= 8) return { text: "Bom comeco! Continue estudando", emoji: "\uD83D\uDCAA" };
    return { text: "Revise o conteudo e tente novamente", emoji: "\uD83D\uDCDA" };
  };

  /* ── RENDER ── */

  /* ── SETUP PHASE ── */
  if (phase === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)" }}>
        {/* Header */}
        <div
          style={{
            padding: "2rem 1.5rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.8125rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                marginBottom: "1rem",
              }}
            >
              &larr; Voltar
            </Link>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--foreground)",
                marginBottom: "0.5rem",
              }}
            >
              Quiz de Pagamentos
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
              Teste seus conhecimentos com questoes de especialista
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>
          {/* Theme selector */}
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "1rem",
            }}
          >
            Escolha o tema
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            {/* All themes card */}
            <button
              onClick={selectAll}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                border: `2px solid ${allSelected ? "var(--primary)" : "var(--border)"}`,
                background: allSelected ? "var(--primary-bg)" : "var(--surface)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.375rem" }}>{"\uD83C\uDF1F"}</div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "0.25rem",
                }}
              >
                Todos os Temas
              </div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>
                {allQuestions.length} questoes
              </div>
            </button>

            {CATEGORIES.map((cat) => {
              const count = allQuestions.filter((q) => q.category === cat.key).length;
              const isSelected = selectedCategories.has(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategory(cat.key)}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    border: `2px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                    background: isSelected ? "var(--primary-bg)" : "var(--surface)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.375rem" }}>{cat.icon}</div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {cat.label}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>
                    {count} questoes
                  </div>
                </button>
              );
            })}
          </div>

          {/* Difficulty selector */}
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "1rem",
            }}
          >
            Dificuldade
          </h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {DIFF_OPTIONS.map((d) => {
              const active = selectedDifficulty === d.key;
              const cnt = countByDiff(d.key);
              return (
                <button
                  key={d.key}
                  onClick={() => setSelectedDifficulty(d.key)}
                  style={{
                    padding: "0.625rem 1.25rem",
                    borderRadius: "10px",
                    border: `2px solid ${active ? d.color : "var(--border)"}`,
                    background: active ? `${d.color}18` : "var(--surface)",
                    color: active ? d.color : "var(--text-secondary)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {d.label} ({cnt})
                </button>
              );
            })}
          </div>

          {/* Start button */}
          <button
            onClick={startQuiz}
            disabled={!canStart}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              background: canStart ? "var(--primary)" : "var(--border)",
              color: canStart ? "#fff" : "var(--text-secondary)",
              fontWeight: 800,
              fontSize: "1.125rem",
              cursor: canStart ? "pointer" : "default",
              transition: "all 0.15s",
              marginBottom: "3rem",
            }}
          >
            Iniciar Quiz ({Math.min(QUIZ_LENGTH, pool.length)} questoes)
          </button>

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "1rem",
                }}
              >
                Historico de Quizzes
              </h2>
              <div
                style={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.8125rem",
                  }}
                >
                  <thead>
                    <tr style={{ background: "var(--surface)" }}>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        Tema
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "center",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        Score
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "center",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        XP
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "right",
                          color: "var(--text-secondary)",
                          fontWeight: 600,
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.slice(0, 10).map((e, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td
                          style={{
                            padding: "0.625rem 1rem",
                            color: "var(--foreground)",
                            fontWeight: 500,
                          }}
                        >
                          {e.theme}
                        </td>
                        <td
                          style={{
                            padding: "0.625rem 1rem",
                            textAlign: "center",
                            color: "var(--foreground)",
                            fontWeight: 700,
                          }}
                        >
                          {e.score}/{e.total}
                        </td>
                        <td
                          style={{
                            padding: "0.625rem 1rem",
                            textAlign: "center",
                            color: "var(--xp-gold)",
                            fontWeight: 700,
                          }}
                        >
                          +{e.xp}
                        </td>
                        <td
                          style={{
                            padding: "0.625rem 1rem",
                            textAlign: "right",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {e.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginTop: "1rem",
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span>
                  Total quizzes: <strong style={{ color: "var(--foreground)" }}>{leaderboard.length}</strong>
                </span>
                <span>
                  Media:{" "}
                  <strong style={{ color: "var(--foreground)" }}>
                    {(leaderboard.reduce((s, e) => s + e.score, 0) / leaderboard.length).toFixed(1)}/
                    {leaderboard[0]?.total ?? 20}
                  </strong>
                </span>
                <span>
                  Melhor:{" "}
                  <strong style={{ color: "var(--primary)" }}>
                    {Math.max(...leaderboard.map((e) => e.score))}/{leaderboard[0]?.total ?? 20}
                  </strong>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ── PLAYING PHASE ── */
  if (phase === "playing" && question) {
    const diffColor =
      question.difficulty === "easy"
        ? "#10b981"
        : question.difficulty === "medium"
          ? "#f59e0b"
          : "#ef4444";
    const diffLabel =
      question.difficulty === "easy" ? "Facil" : question.difficulty === "medium" ? "Medio" : "Dificil";
    const catMeta = CATEGORIES.find((c) => c.key === question.category);
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const wasCorrect =
      answered &&
      (question.type === "ordering"
        ? question.correctOrder?.every((v, i) => orderValues[i] === v)
        : selectedOption === question.correctIndex);

    return (
      <div style={{ minHeight: "100vh", background: "var(--background)" }}>
        {/* Top bar */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
              Pergunta {currentIdx + 1} de {questions.length}
            </span>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              {formatTime(elapsed)}
            </span>
          </div>
          {/* Progress bar */}
          <div
            style={{
              maxWidth: "800px",
              margin: "0.5rem auto 0",
              height: "4px",
              borderRadius: "2px",
              background: "var(--border)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "var(--primary)",
                borderRadius: "2px",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {/* Question card */}
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem" }}>
          <div
            style={{
              borderRadius: "14px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              overflow: "hidden",
            }}
          >
            {/* Card header */}
            <div
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    padding: "0.2rem 0.625rem",
                    borderRadius: "6px",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    background: `${diffColor}18`,
                    color: diffColor,
                  }}
                >
                  {diffLabel}
                </span>
                {catMeta && (
                  <span
                    style={{
                      padding: "0.2rem 0.625rem",
                      borderRadius: "6px",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      background: "var(--primary-bg)",
                      color: "var(--primary)",
                    }}
                  >
                    {catMeta.icon} {catMeta.label}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--xp-gold)",
                }}
              >
                +{qXP} XP
              </span>
            </div>

            {/* Card body */}
            <div style={{ padding: "1.25rem" }}>
              {/* Scenario */}
              {question.type === "scenario" && question.scenario && (
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    marginBottom: "1rem",
                    borderRadius: "10px",
                    background: "var(--primary-bg)",
                    borderLeft: "3px solid var(--primary)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      marginBottom: "0.375rem",
                      color: "var(--primary)",
                    }}
                  >
                    Cenario
                  </p>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--foreground)" }}>
                    {question.scenario}
                  </p>
                </div>
              )}

              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  color: "var(--foreground)",
                  lineHeight: 1.5,
                }}
              >
                {question.question}
              </p>

              {/* TRUE-FALSE */}
              {question.type === "true-false" && (
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                  {question.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => !answered && setSelectedOption(i)}
                      style={{
                        flex: 1,
                        padding: "0.875rem",
                        borderRadius: "10px",
                        border: `2px solid ${
                          answered && i === question.correctIndex
                            ? "#10b981"
                            : answered && i === selectedOption && i !== question.correctIndex
                              ? "#ef4444"
                              : i === selectedOption
                                ? "var(--primary)"
                                : "var(--border)"
                        }`,
                        background:
                          answered && i === question.correctIndex
                            ? "rgba(16,185,129,0.08)"
                            : answered && i === selectedOption && i !== question.correctIndex
                              ? "rgba(239,68,68,0.08)"
                              : "var(--surface)",
                        color: "var(--foreground)",
                        fontWeight: 600,
                        fontSize: "1rem",
                        cursor: answered ? "default" : "pointer",
                        textAlign: "center",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* ORDERING */}
              {question.type === "ordering" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {question.options.map((opt, i) => {
                    const isRight = answered && question.correctOrder?.[i] === orderValues[i];
                    const isWrong = answered && question.correctOrder?.[i] !== orderValues[i];
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.75rem 1rem",
                          background: isRight
                            ? "rgba(16,185,129,0.08)"
                            : isWrong
                              ? "rgba(239,68,68,0.08)"
                              : "var(--surface)",
                          border: `1px solid ${isRight ? "#10b981" : isWrong ? "#ef4444" : "var(--border)"}`,
                          borderRadius: "10px",
                        }}
                      >
                        <select
                          value={orderValues[i] ?? i}
                          onChange={(e) => {
                            if (answered) return;
                            setOrderValues((prev) => {
                              const next = [...prev];
                              next[i] = parseInt(e.target.value);
                              return next;
                            });
                          }}
                          disabled={answered}
                          style={{
                            width: "3rem",
                            padding: "0.25rem",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            background: "var(--surface)",
                            color: "var(--foreground)",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            textAlign: "center",
                          }}
                        >
                          {question.options.map((_, j) => (
                            <option key={j} value={j}>
                              {j + 1}
                            </option>
                          ))}
                        </select>
                        <span style={{ fontSize: "0.9375rem", color: "var(--foreground)" }}>{opt}</span>
                        {answered && isRight && (
                          <span style={{ marginLeft: "auto", color: "#10b981", fontWeight: 700 }}>
                            {"\u2713"}
                          </span>
                        )}
                        {answered && isWrong && (
                          <span
                            style={{
                              marginLeft: "auto",
                              color: "#ef4444",
                              fontSize: "0.75rem",
                            }}
                          >
                            (correto: {(question.correctOrder?.[i] ?? 0) + 1})
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MULTIPLE-CHOICE / SCENARIO */}
              {(question.type === "multiple-choice" || question.type === "scenario") && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {question.options.map((opt, i) => {
                    const isCorrect = answered && i === question.correctIndex;
                    const isWrong = answered && i === selectedOption && i !== question.correctIndex;
                    const isSelected = !answered && i === selectedOption;
                    return (
                      <button
                        key={i}
                        onClick={() => !answered && setSelectedOption(i)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.875rem 1rem",
                          borderRadius: "10px",
                          border: `2px solid ${
                            isCorrect
                              ? "#10b981"
                              : isWrong
                                ? "#ef4444"
                                : isSelected
                                  ? "var(--primary)"
                                  : "var(--border)"
                          }`,
                          background: isCorrect
                            ? "rgba(16,185,129,0.08)"
                            : isWrong
                              ? "rgba(239,68,68,0.08)"
                              : "var(--surface)",
                          cursor: answered ? "default" : "pointer",
                          textAlign: "left",
                          color: "var(--foreground)",
                          fontSize: "0.9375rem",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            borderRadius: "50%",
                            border: `2px solid ${isCorrect ? "#10b981" : isWrong ? "#ef4444" : isSelected ? "var(--primary)" : "var(--border)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            flexShrink: 0,
                            background: isCorrect
                              ? "#10b981"
                              : isWrong
                                ? "#ef4444"
                                : "transparent",
                            color: isCorrect || isWrong ? "#fff" : "transparent",
                          }}
                        >
                          {isCorrect ? "\u2713" : isWrong ? "\u2717" : ""}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation */}
              {answered && (
                <div
                  style={{
                    padding: "0.875rem 1rem",
                    background: wasCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                    borderRadius: "10px",
                    borderLeft: `3px solid ${wasCorrect ? "#10b981" : "#ef4444"}`,
                    marginBottom: "1rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                      color: wasCorrect ? "#10b981" : "#ef4444",
                    }}
                  >
                    {wasCorrect ? `Correto! +${qXP} XP` : "Incorreto"}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {question.explanation}
                  </p>
                  {!wasCorrect &&
                    question.wrongExplanations &&
                    selectedOption !== null &&
                    question.wrongExplanations[selectedOption] !== undefined && (
                      <p
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          fontStyle: "italic",
                        }}
                      >
                        Por que &ldquo;{question.options[selectedOption]}&rdquo; esta errado:{" "}
                        {question.wrongExplanations[selectedOption]}
                      </p>
                    )}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                {!answered ? (
                  <button
                    onClick={handleConfirm}
                    disabled={question.type !== "ordering" && selectedOption === null}
                    style={{
                      padding: "0.625rem 1.5rem",
                      background:
                        question.type !== "ordering" && selectedOption === null
                          ? "var(--border)"
                          : "var(--primary)",
                      color:
                        question.type !== "ordering" && selectedOption === null
                          ? "var(--text-secondary)"
                          : "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor:
                        question.type !== "ordering" && selectedOption === null
                          ? "default"
                          : "pointer",
                    }}
                  >
                    Confirmar
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    style={{
                      padding: "0.625rem 1.5rem",
                      background: "var(--primary)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    {currentIdx + 1 >= questions.length ? "Ver Resultado" : "Proxima \u2192"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── RESULTS PHASE ── */
  if (phase === "results") {
    const msg = resultMessage();
    const easyB = breakdownByDiff("easy");
    const medB = breakdownByDiff("medium");
    const hardB = breakdownByDiff("hard");
    const catB = breakdownByCategory();

    return (
      <div style={{ minHeight: "100vh", background: "var(--background)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem" }}>
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{msg.emoji}</div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "var(--foreground)",
                  marginBottom: "0.5rem",
                }}
              >
                {msg.text}
              </h2>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                  marginBottom: "0.25rem",
                }}
              >
                {correctCount}/{questions.length}
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--xp-gold)", fontWeight: 700 }}>
                +{xpAccum} XP ganhos
              </p>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Tempo: {formatTime(elapsed)}
              </p>
            </div>

            {/* Breakdown */}
            <div style={{ padding: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "0.75rem",
                }}
              >
                Por dificuldade
              </h3>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {[
                  { label: "Facil", data: easyB, color: "#10b981" },
                  { label: "Medio", data: medB, color: "#f59e0b" },
                  { label: "Dificil", data: hardB, color: "#ef4444" },
                ].map((d) =>
                  d.data.total > 0 ? (
                    <div
                      key={d.label}
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                        flex: 1,
                        minWidth: "100px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          color: d.color,
                          fontWeight: 700,
                          marginBottom: "0.25rem",
                        }}
                      >
                        {d.label}
                      </div>
                      <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--foreground)" }}>
                        {d.data.correct}/{d.data.total}
                      </div>
                    </div>
                  ) : null,
                )}
              </div>

              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  marginBottom: "0.75rem",
                }}
              >
                Por categoria
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.375rem",
                  marginBottom: "1.5rem",
                }}
              >
                {Object.entries(catB).map(([cat, data]) => {
                  const meta = CATEGORIES.find((c) => c.key === cat);
                  const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
                  return (
                    <div
                      key={cat}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.5rem 0",
                      }}
                    >
                      <span style={{ fontSize: "0.8125rem", width: "120px", color: "var(--foreground)" }}>
                        {meta ? `${meta.icon} ${meta.label}` : cat}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: "6px",
                          borderRadius: "3px",
                          background: "var(--border)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            borderRadius: "3px",
                            background: pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--text-secondary)",
                          width: "40px",
                          textAlign: "right",
                        }}
                      >
                        {data.correct}/{data.total}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={startQuiz}
                  style={{
                    flex: 1,
                    padding: "0.875rem",
                    borderRadius: "10px",
                    border: "2px solid var(--primary)",
                    background: "transparent",
                    color: "var(--primary)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  Tentar Novamente
                </button>
                <button
                  onClick={resetToSetup}
                  style={{
                    flex: 1,
                    padding: "0.875rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "var(--primary)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  Escolher Outro Tema
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
