"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  QUIZ_THEMES,
  getStandaloneQuestionsByDifficulty,
  getStandaloneQuestionCount,
  getStandaloneQuestionsByTheme,
  type StandaloneQuestion,
  type Difficulty,
  type QuizTheme,
} from "@/data/quizzes";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Screen = "themes" | "difficulty" | "quiz" | "results";

interface QuizState {
  theme: QuizTheme | null;
  difficulty: Difficulty | "mixed";
  questions: StandaloneQuestion[];
  currentIndex: number;
  selectedOption: number | null;
  answered: boolean;
  answers: { questionId: string; selected: number; correct: boolean }[];
  startTime: number;
  endTime: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickQuestions(theme: string, difficulty: Difficulty | "mixed"): StandaloneQuestion[] {
  if (difficulty === "mixed") {
    const easy = shuffleArray(getStandaloneQuestionsByDifficulty(theme, "easy")).slice(0, 4);
    const medium = shuffleArray(getStandaloneQuestionsByDifficulty(theme, "medium")).slice(0, 6);
    const hard = shuffleArray(getStandaloneQuestionsByDifficulty(theme, "hard")).slice(0, 10);
    return shuffleArray([...easy, ...medium, ...hard]);
  }
  return shuffleArray(getStandaloneQuestionsByTheme(theme).filter(q => q.difficulty === difficulty)).slice(0, 20);
}

function xpForDifficulty(d: Difficulty): number {
  return d === "easy" ? 3 : d === "medium" ? 5 : 10;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec < 10 ? "0" : ""}${sec}s`;
}

// ---------------------------------------------------------------------------
// Difficulty options
// ---------------------------------------------------------------------------
const TIMER_DURATIONS: Record<Difficulty | "mixed", number> = {
  easy: 60,
  medium: 45,
  hard: 30,
  mixed: 45,
};

function getTimerColor(timeLeft: number, duration: number): string {
  const pct = duration > 0 ? timeLeft / duration : 1;
  if (pct > 0.6) return "#10b981";
  if (pct > 0.3) return "#f59e0b";
  return "#ef4444";
}

const DIFFICULTY_OPTIONS: { value: Difficulty | "mixed"; label: string; desc: string; xp: string }[] = [
  { value: "easy", label: "Facil", desc: "Conceitos basicos e definicoes", xp: "+3 XP" },
  { value: "medium", label: "Medio", desc: "Aplicacao pratica e cenarios", xp: "+5 XP" },
  { value: "hard", label: "Dificil", desc: "Pensamento critico e analise", xp: "+10 XP" },
  { value: "mixed", label: "Misto", desc: "20% facil, 30% medio, 50% dificil", xp: "Variavel" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function QuizPage() {
  const [screen, setScreen] = useState<Screen>("themes");
  const { recordQuiz } = useGameProgress();

  const [quiz, setQuiz] = useState<QuizState>({
    theme: null,
    difficulty: "mixed",
    questions: [],
    currentIndex: 0,
    selectedOption: null,
    answered: false,
    answers: [],
    startTime: 0,
    endTime: 0,
  });

  // --- Timer state ---
  const [timerEnabled, setTimerEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("pks-quiz-timer");
    return stored === null ? true : stored === "true";
  });
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerDuration, setTimerDuration] = useState<number>(45);
  const timerAutoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist timer preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pks-quiz-timer", String(timerEnabled));
    }
  }, [timerEnabled]);

  // Timer countdown effect
  useEffect(() => {
    if (screen !== "quiz" || !timerEnabled || quiz.answered) return;
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, timerEnabled, quiz.answered, timeLeft]);

  // Auto-mark wrong when timer hits 0
  useEffect(() => {
    if (screen !== "quiz" || !timerEnabled || quiz.answered) return;
    if (timeLeft !== 0) return;
    // Timer just hit 0 — mark as wrong
    const q = quiz.questions[quiz.currentIndex];
    if (!q) return;
    setQuiz((prev) => ({
      ...prev,
      selectedOption: -1,
      answered: true,
      answers: [...prev.answers, { questionId: q.id, selected: -1, correct: false }],
    }));
    // Auto-advance after 2s
    timerAutoAdvanceRef.current = setTimeout(() => {
      nextQuestion();
    }, 2000);
    return () => {
      if (timerAutoAdvanceRef.current) clearTimeout(timerAutoAdvanceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, screen, timerEnabled, quiz.answered]);

  // --- Theme selection ---
  const selectTheme = useCallback((theme: QuizTheme) => {
    setQuiz(prev => ({ ...prev, theme }));
    setScreen("difficulty");
  }, []);

  // --- Difficulty selection + start quiz ---
  const selectDifficulty = useCallback((difficulty: Difficulty | "mixed") => {
    if (!quiz.theme) return;
    const questions = pickQuestions(quiz.theme.id, difficulty);
    const dur = TIMER_DURATIONS[difficulty];
    setTimerDuration(dur);
    setTimeLeft(dur);
    setQuiz(prev => ({
      ...prev,
      difficulty,
      questions,
      currentIndex: 0,
      selectedOption: null,
      answered: false,
      answers: [],
      startTime: Date.now(),
      endTime: 0,
    }));
    setScreen("quiz");
  }, [quiz.theme]);

  // --- Answer a question ---
  const selectAnswer = useCallback((idx: number) => {
    if (quiz.answered) return;
    const q = quiz.questions[quiz.currentIndex];
    const correct = idx === q.correctIndex;
    setQuiz(prev => ({
      ...prev,
      selectedOption: idx,
      answered: true,
      answers: [...prev.answers, { questionId: q.id, selected: idx, correct }],
    }));
  }, [quiz.answered, quiz.questions, quiz.currentIndex]);

  // --- Next question or results ---
  const nextQuestion = useCallback(() => {
    if (timerAutoAdvanceRef.current) {
      clearTimeout(timerAutoAdvanceRef.current);
      timerAutoAdvanceRef.current = null;
    }
    if (quiz.currentIndex < quiz.questions.length - 1) {
      setTimeLeft(timerDuration);
      setQuiz(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedOption: null,
        answered: false,
      }));
    } else {
      const now = Date.now();
      setQuiz(prev => {
        const allAnswers = prev.answers;
        const correctCount = allAnswers.filter(a => a.correct).length;
        const total = allAnswers.length;
        let totalXP = 0;
        allAnswers.forEach(a => {
          if (a.correct) {
            const q = prev.questions.find(q2 => q2.id === a.questionId);
            if (q) totalXP += xpForDifficulty(q.difficulty);
          }
        });
        const route = `/quiz/${prev.theme?.id ?? "standalone"}/${prev.difficulty}`;
        recordQuiz(route, correctCount, total, totalXP);
        return { ...prev, endTime: now };
      });
      setScreen("results");
    }
  }, [quiz.currentIndex, quiz.questions.length, recordQuiz, timerDuration]);

  // --- Reset ---
  const goToThemes = useCallback(() => {
    setQuiz({
      theme: null,
      difficulty: "mixed",
      questions: [],
      currentIndex: 0,
      selectedOption: null,
      answered: false,
      answers: [],
      startTime: 0,
      endTime: 0,
    });
    setScreen("themes");
  }, []);

  const retry = useCallback(() => {
    if (!quiz.theme) return;
    selectDifficulty(quiz.difficulty);
  }, [quiz.theme, quiz.difficulty, selectDifficulty]);

  // --- Computed results ---
  const results = useMemo(() => {
    const correctCount = quiz.answers.filter(a => a.correct).length;
    const total = quiz.answers.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    let totalXP = 0;
    quiz.answers.forEach(a => {
      if (a.correct) {
        const q = quiz.questions.find(q2 => q2.id === a.questionId);
        if (q) totalXP += xpForDifficulty(q.difficulty);
      }
    });
    const wrongAnswers = quiz.answers
      .filter(a => !a.correct)
      .map(a => {
        const q = quiz.questions.find(q2 => q2.id === a.questionId);
        return q ? { question: q, selected: a.selected } : null;
      })
      .filter(Boolean) as { question: StandaloneQuestion; selected: number }[];
    const elapsed = quiz.endTime - quiz.startTime;
    return { correctCount, total, percentage, totalXP, wrongAnswers, elapsed };
  }, [quiz.answers, quiz.questions, quiz.endTime, quiz.startTime]);

  // --- Progress ---
  const progress = quiz.questions.length > 0 ? ((quiz.currentIndex + (quiz.answered ? 1 : 0)) / quiz.questions.length) * 100 : 0;

  // =========================================================================
  // Render
  // =========================================================================
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* ===== THEME SELECTION ===== */}
      {screen === "themes" && (
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
            Quiz de Pagamentos
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Teste seus conhecimentos em pagamentos. Escolha um tema para comecar.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {QUIZ_THEMES.map(theme => {
              const count = getStandaloneQuestionCount(theme.id);
              return (
                <button
                  key={theme.id}
                  onClick={() => selectTheme(theme)}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{theme.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>
                    {theme.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem", lineHeight: 1.4 }}>
                    {theme.description}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "var(--primary)",
                      background: "var(--primary-bg)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.375rem",
                      display: "inline-block",
                    }}
                  >
                    {count} perguntas
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== DIFFICULTY SELECTION ===== */}
      {screen === "difficulty" && quiz.theme && (
        <div>
          <button
            onClick={() => setScreen("themes")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
              padding: 0,
            }}
          >
            &larr; Voltar aos temas
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "2rem" }}>{quiz.theme.icon}</span>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>{quiz.theme.name}</h1>
          </div>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
            Escolha o nivel de dificuldade. Voce tera 20 perguntas.
          </p>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              marginBottom: "1.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              background: timerEnabled ? "var(--primary-bg)" : "var(--surface)",
              border: `1px solid ${timerEnabled ? "var(--primary)" : "var(--border)"}`,
              fontSize: "0.875rem",
              color: "var(--foreground)",
              transition: "all 0.2s",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={timerEnabled}
              onChange={(e) => setTimerEnabled(e.target.checked)}
              style={{ accentColor: "var(--primary)", width: 16, height: 16, cursor: "pointer" }}
            />
            <span>&#9201;&#65039; Timer</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              (facil 60s, medio 45s, dificil 30s)
            </span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {DIFFICULTY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => selectDifficulty(opt.value)}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem 1.25rem",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)", marginBottom: "0.375rem" }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem", lineHeight: 1.4 }}>
                  {opt.desc}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: opt.value === "hard" ? "#f59e0b" : "var(--primary)",
                    background: opt.value === "hard" ? "rgba(245,158,11,0.1)" : "var(--primary-bg)",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.375rem",
                    display: "inline-block",
                  }}
                >
                  {opt.xp} por acerto
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== QUIZ ===== */}
      {screen === "quiz" && quiz.questions.length > 0 && (
        <div>
          {/* Progress bar */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                Pergunta {quiz.currentIndex + 1} de {quiz.questions.length}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                {quiz.theme?.name} &middot;{" "}
                {quiz.questions[quiz.currentIndex].difficulty === "easy"
                  ? "Facil"
                  : quiz.questions[quiz.currentIndex].difficulty === "medium"
                  ? "Medio"
                  : "Dificil"}
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "var(--border)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "var(--primary)",
                  borderRadius: 3,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Timer bar */}
          {timerEnabled && (
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.35rem",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  &#9201;&#65039; Tempo restante
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                    color: getTimerColor(timeLeft, timerDuration),
                  }}
                >
                  {timeLeft}s
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "var(--border)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${timerDuration > 0 ? (timeLeft / timerDuration) * 100 : 0}%`,
                    background: getTimerColor(timeLeft, timerDuration),
                    borderRadius: 4,
                    transition: "width 1s linear, background 0.5s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* Question */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              {quiz.questions[quiz.currentIndex].question}
            </h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {quiz.questions[quiz.currentIndex].options.map((opt, idx) => {
                const isSelected = quiz.selectedOption === idx;
                const isCorrect = idx === quiz.questions[quiz.currentIndex].correctIndex;
                let bg = "var(--background)";
                let borderColor = "var(--border)";
                let textColor = "var(--foreground)";

                if (quiz.answered) {
                  if (isCorrect) {
                    bg = "rgba(16,185,129,0.1)";
                    borderColor = "#10b981";
                    textColor = "#10b981";
                  } else if (isSelected && !isCorrect) {
                    bg = "rgba(239,68,68,0.1)";
                    borderColor = "#ef4444";
                    textColor = "#ef4444";
                  }
                } else if (isSelected) {
                  bg = "var(--primary-bg)";
                  borderColor = "var(--primary)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(idx)}
                    disabled={quiz.answered}
                    style={{
                      background: bg,
                      border: `1.5px solid ${borderColor}`,
                      borderRadius: "0.5rem",
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      cursor: quiz.answered ? "default" : "pointer",
                      fontSize: "0.9rem",
                      color: textColor,
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      lineHeight: 1.45,
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        border: `1.5px solid ${borderColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        flexShrink: 0,
                        background: quiz.answered && isCorrect ? "#10b981" : quiz.answered && isSelected ? "#ef4444" : "transparent",
                        color: quiz.answered && (isCorrect || isSelected) ? "#fff" : textColor,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation + Next */}
          {quiz.answered && (
            <div
              style={{
                background: quiz.selectedOption === quiz.questions[quiz.currentIndex].correctIndex
                  ? "rgba(16,185,129,0.08)"
                  : "rgba(239,68,68,0.06)",
                border: `1px solid ${
                  quiz.selectedOption === quiz.questions[quiz.currentIndex].correctIndex ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)"
                }`,
                borderRadius: "0.75rem",
                padding: "1.25rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1rem" }}>
                  {quiz.selectedOption === quiz.questions[quiz.currentIndex].correctIndex ? "\u2705" : "\u274C"}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: quiz.selectedOption === quiz.questions[quiz.currentIndex].correctIndex ? "#10b981" : "#ef4444",
                  }}
                >
                  {quiz.selectedOption === quiz.questions[quiz.currentIndex].correctIndex
                    ? `Correto! +${xpForDifficulty(quiz.questions[quiz.currentIndex].difficulty)} XP`
                    : "Incorreto"}
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.55 }}>
                {quiz.questions[quiz.currentIndex].explanation}
              </p>
            </div>
          )}

          {quiz.answered && (
            <button
              onClick={nextQuestion}
              style={{
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.7rem 1.5rem",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "opacity 0.15s",
                width: "100%",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              {quiz.currentIndex < quiz.questions.length - 1 ? "Proxima Pergunta \u2192" : "Ver Resultado"}
            </button>
          )}
        </div>
      )}

      {/* ===== RESULTS ===== */}
      {screen === "results" && (
        <div>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "2rem",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
              {results.percentage >= 80 ? "\uD83C\uDFC6" : results.percentage >= 50 ? "\uD83D\uDC4F" : "\uD83D\uDCDA"}
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.25rem" }}>
              {results.percentage}% de acerto
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              {results.correctCount} de {results.total} perguntas corretas
            </p>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              <div
                style={{
                  background: "var(--primary-bg)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                }}
              >
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>
                  +{results.totalXP}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>XP ganhos</div>
              </div>
              <div
                style={{
                  background: "rgba(16,185,129,0.08)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                }}
              >
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#10b981" }}>
                  {results.correctCount}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Corretas</div>
              </div>
              <div
                style={{
                  background: "rgba(139,92,246,0.08)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                }}
              >
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#8b5cf6" }}>
                  {formatTime(results.elapsed)}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Tempo</div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={retry}
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.7rem 1.5rem",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Tentar novamente
              </button>
              <button
                onClick={goToThemes}
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  padding: "0.7rem 1.5rem",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Escolher outro tema
              </button>
            </div>
          </div>

          {/* Wrong answers review */}
          {results.wrongAnswers.length > 0 && (
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1rem" }}>
                Revisao das respostas erradas ({results.wrongAnswers.length})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {results.wrongAnswers.map(({ question, selected }, i) => (
                  <div
                    key={question.id}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      padding: "1.25rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          background: "rgba(239,68,68,0.1)",
                          color: "#ef4444",
                          padding: "0.15rem 0.4rem",
                          borderRadius: "0.25rem",
                          flexShrink: 0,
                        }}
                      >
                        #{i + 1}
                      </span>
                      <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--foreground)", lineHeight: 1.45 }}>
                        {question.question}
                      </p>
                    </div>
                    <div style={{ marginBottom: "0.5rem", fontSize: "0.825rem", lineHeight: 1.5 }}>
                      <div style={{ color: "#ef4444", marginBottom: "0.25rem" }}>
                        <strong>Sua resposta:</strong> {question.options[selected]}
                      </div>
                      <div style={{ color: "#10b981" }}>
                        <strong>Correta:</strong> {question.options[question.correctIndex]}
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        background: "var(--background)",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {question.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
