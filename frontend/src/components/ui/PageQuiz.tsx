"use client";
import { useState } from "react";
import { type QuizQuestion, type Difficulty } from "@/data/quizzes";

const XP_MAP: Record<Difficulty, number> = { easy: 3, medium: 5, hard: 10 };
const SCENARIO_XP = 15;

function getQuestionXP(q: QuizQuestion): number {
  if (q.type === "scenario") return SCENARIO_XP;
  return XP_MAP[q.difficulty];
}

interface PageQuizProps {
  questions: QuizQuestion[];
  onComplete: (correct: number, total: number, xpEarned: number) => void;
}

export default function PageQuiz({ questions, onComplete }: PageQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [xpAccum, setXpAccum] = useState(0);

  // ordering state
  const [orderValues, setOrderValues] = useState<number[]>([]);

  const question = questions[currentQ];
  const qXP = getQuestionXP(question);

  // Initialize ordering values when question changes
  const initOrdering = () => {
    if (question.type === "ordering" && orderValues.length !== question.options.length) {
      setOrderValues(question.options.map((_, i) => i));
    }
  };
  initOrdering();

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedIndex(idx);
  };

  const handleOrderChange = (itemIdx: number, newVal: number) => {
    if (answered) return;
    setOrderValues((prev) => {
      const next = [...prev];
      next[itemIdx] = newVal;
      return next;
    });
  };

  const handleConfirm = () => {
    if (question.type === "ordering") {
      if (!question.correctOrder) return;
      const isCorrect = question.correctOrder.every((v, i) => orderValues[i] === v);
      setAnswered(true);
      setResults((prev) => [...prev, isCorrect]);
      if (isCorrect) setXpAccum((prev) => prev + qXP);
      return;
    }
    if (selectedIndex === null || answered) return;
    const isCorrect = selectedIndex === question.correctIndex;
    setAnswered(true);
    setResults((prev) => [...prev, isCorrect]);
    if (isCorrect) setXpAccum((prev) => prev + qXP);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      const correctCount = [...results].filter(Boolean).length;
      setFinished(true);
      onComplete(correctCount, questions.length, xpAccum);
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelectedIndex(null);
      setAnswered(false);
      setOrderValues([]);
    }
  };

  const isOrderingCorrect = (): boolean => {
    if (!question.correctOrder) return false;
    return question.correctOrder.every((v, i) => orderValues[i] === v);
  };

  const difficultyClass =
    question.difficulty === "easy"
      ? "quiz-difficulty-easy"
      : question.difficulty === "medium"
        ? "quiz-difficulty-medium"
        : "quiz-difficulty-hard";
  const difficultyLabel =
    question.difficulty === "easy" ? "Facil" : question.difficulty === "medium" ? "Medio" : "Dificil";

  if (finished) {
    const correctCount = results.filter(Boolean).length;
    return (
      <div className="quiz-card">
        <div className="quiz-header">
          <span>Quiz Completo!</span>
          <span className="xp-badge animate-xp-bounce">+{xpAccum} XP</span>
        </div>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            {correctCount === questions.length ? "\u{1F389}" : correctCount > 0 ? "\u{1F44D}" : "\u{1F4DA}"}
          </p>
          <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--foreground)" }}>
            {correctCount}/{questions.length} corretas
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {correctCount === questions.length
              ? "Perfeito! Voce domina este tema!"
              : "Continue estudando para melhorar!"}
          </p>
        </div>
      </div>
    );
  }

  // Determine if current question was answered correctly
  const wasCorrect =
    answered &&
    (question.type === "ordering"
      ? isOrderingCorrect()
      : selectedIndex === question.correctIndex);

  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          Pergunta {currentQ + 1} de {questions.length}
          <span className={difficultyClass}>{difficultyLabel}</span>
        </span>
        <span className="xp-badge">+{qXP} XP</span>
      </div>
      <div style={{ padding: "1.25rem" }}>
        {/* Scenario box */}
        {question.type === "scenario" && question.scenario && (
          <div
            className="quiz-scenario-box"
            style={{ padding: "1rem 1.25rem", marginBottom: "1rem" }}
          >
            <p style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem", color: "var(--primary)" }}>
              Cenario
            </p>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--foreground)" }}>
              {question.scenario}
            </p>
          </div>
        )}

        <p style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--foreground)" }}>
          {question.question}
        </p>

        {/* ── TRUE-FALSE ── */}
        {question.type === "true-false" && (
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            {question.options.map((opt, i) => {
              const dataAttr: Record<string, string> = {};
              if (answered && i === question.correctIndex) dataAttr["data-correct"] = "true";
              if (answered && i === selectedIndex && i !== question.correctIndex) dataAttr["data-incorrect"] = "true";
              if (!answered && i === selectedIndex) dataAttr["data-selected"] = "true";

              return (
                <button
                  key={i}
                  className="quiz-option"
                  onClick={() => handleSelect(i)}
                  style={{ flex: 1, justifyContent: "center", fontWeight: 600, fontSize: "1rem" }}
                  {...dataAttr}
                >
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── ORDERING ── */}
        {question.type === "ordering" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
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
                    background: isRight ? "rgba(16, 185, 129, 0.08)" : isWrong ? "rgba(239, 68, 68, 0.08)" : "var(--surface)",
                    border: `1px solid ${isRight ? "var(--success)" : isWrong ? "var(--danger)" : "var(--border)"}`,
                    borderRadius: "10px",
                  }}
                >
                  <select
                    value={orderValues[i] ?? i}
                    onChange={(e) => handleOrderChange(i, parseInt(e.target.value))}
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
                  {answered && isRight && <span style={{ marginLeft: "auto", color: "var(--success)", fontWeight: 700 }}>✓</span>}
                  {answered && isWrong && (
                    <span style={{ marginLeft: "auto", color: "var(--danger)", fontSize: "0.75rem" }}>
                      (correto: {(question.correctOrder?.[i] ?? 0) + 1})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── MULTIPLE-CHOICE / SCENARIO ── */}
        {(question.type === "multiple-choice" || question.type === "scenario") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
            {question.options.map((opt, i) => {
              const dataAttr: Record<string, string> = {};
              if (answered && i === question.correctIndex) dataAttr["data-correct"] = "true";
              if (answered && i === selectedIndex && i !== question.correctIndex) dataAttr["data-incorrect"] = "true";
              if (!answered && i === selectedIndex) dataAttr["data-selected"] = "true";

              return (
                <button
                  key={i}
                  className="quiz-option"
                  onClick={() => handleSelect(i)}
                  {...dataAttr}
                >
                  <span
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "50%",
                      border: `2px solid ${i === selectedIndex ? "var(--primary)" : "var(--border)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      flexShrink: 0,
                      background:
                        answered && i === question.correctIndex
                          ? "var(--success)"
                          : answered && i === selectedIndex
                            ? "var(--danger)"
                            : "transparent",
                      color:
                        answered && (i === question.correctIndex || i === selectedIndex)
                          ? "#fff"
                          : "transparent",
                    }}
                  >
                    {answered && i === question.correctIndex
                      ? "✓"
                      : answered && i === selectedIndex && i !== question.correctIndex
                        ? "✗"
                        : ""}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Explanation ── */}
        {answered && (
          <div
            className="animate-fade-in"
            style={{
              padding: "0.875rem 1rem",
              background: wasCorrect ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
              borderRadius: "10px",
              borderLeft: `3px solid ${wasCorrect ? "var(--success)" : "var(--danger)"}`,
              marginBottom: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "0.25rem",
                color: wasCorrect ? "var(--success)" : "var(--danger)",
              }}
            >
              {wasCorrect ? `Correto! +${qXP} XP` : "Incorreto"}
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              {question.explanation}
            </p>
            {/* Wrong explanation for the chosen answer */}
            {!wasCorrect &&
              question.wrongExplanations &&
              selectedIndex !== null &&
              question.wrongExplanations[selectedIndex] !== undefined && (
                <p className="quiz-wrong-why" style={{ marginTop: "0.5rem" }}>
                  Por que &ldquo;{question.options[selectedIndex]}&rdquo; esta errado:{" "}
                  {question.wrongExplanations[selectedIndex]}
                </p>
              )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          {!answered ? (
            <button
              onClick={handleConfirm}
              disabled={question.type !== "ordering" && selectedIndex === null}
              style={{
                padding: "0.625rem 1.5rem",
                background:
                  question.type !== "ordering" && selectedIndex === null
                    ? "var(--surface-hover)"
                    : "var(--primary)",
                color:
                  question.type !== "ordering" && selectedIndex === null
                    ? "var(--text-muted)"
                    : "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor:
                  question.type !== "ordering" && selectedIndex === null
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
              {currentQ + 1 >= questions.length ? "Ver Resultado" : "Proxima \u2192"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
