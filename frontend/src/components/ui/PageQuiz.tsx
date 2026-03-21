"use client";
import { useState } from "react";
import { type QuizQuestion } from "@/data/quizzes";

interface PageQuizProps {
  questions: QuizQuestion[];
  xpPerQuestion: number;
  onComplete: (correct: number, total: number) => void;
}

export default function PageQuiz({ questions, xpPerQuestion, onComplete }: PageQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedIndex(idx);
  };

  const handleConfirm = () => {
    if (selectedIndex === null || answered) return;
    const isCorrect = selectedIndex === question.correctIndex;
    setAnswered(true);
    setResults((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      const correctCount = [...results].filter(Boolean).length;
      setFinished(true);
      onComplete(correctCount, questions.length);
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelectedIndex(null);
      setAnswered(false);
    }
  };

  if (finished) {
    const correctCount = results.filter(Boolean).length;
    return (
      <div className="quiz-card">
        <div className="quiz-header">
          <span>Quiz Completo!</span>
          <span className="xp-badge animate-xp-bounce">+{correctCount * xpPerQuestion} XP</span>
        </div>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            {correctCount === questions.length ? "🎉" : correctCount > 0 ? "👍" : "📚"}
          </p>
          <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--foreground)" }}>
            {correctCount}/{questions.length} corretas
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {correctCount === questions.length
              ? "Perfeito! Você domina este tema!"
              : "Continue estudando para melhorar!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <span>Pergunta {currentQ + 1} de {questions.length}</span>
        <span className="xp-badge">+{xpPerQuestion} XP cada</span>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <p style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--foreground)" }}>
          {question.question}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          {question.options.map((opt, i) => {
            let dataAttr: Record<string, string> = {};
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
                <span style={{
                  width: "1.5rem", height: "1.5rem", borderRadius: "50%",
                  border: `2px solid ${i === selectedIndex ? "var(--primary)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", flexShrink: 0,
                  background: answered && i === question.correctIndex ? "var(--success)" : answered && i === selectedIndex ? "var(--danger)" : "transparent",
                  color: answered && (i === question.correctIndex || i === selectedIndex) ? "#fff" : "transparent",
                }}>
                  {answered && i === question.correctIndex ? "✓" : answered && i === selectedIndex && i !== question.correctIndex ? "✗" : ""}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="animate-fade-in" style={{
            padding: "0.875rem 1rem",
            background: selectedIndex === question.correctIndex ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
            borderRadius: "10px",
            borderLeft: `3px solid ${selectedIndex === question.correctIndex ? "var(--success)" : "var(--danger)"}`,
            marginBottom: "1rem",
          }}>
            <p style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem", color: selectedIndex === question.correctIndex ? "var(--success)" : "var(--danger)" }}>
              {selectedIndex === question.correctIndex ? "Correto!" : "Incorreto"}
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              {question.explanation}
            </p>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          {!answered ? (
            <button
              onClick={handleConfirm}
              disabled={selectedIndex === null}
              style={{
                padding: "0.625rem 1.5rem",
                background: selectedIndex === null ? "var(--surface-hover)" : "var(--primary)",
                color: selectedIndex === null ? "var(--text-muted)" : "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: selectedIndex === null ? "default" : "pointer",
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
              {currentQ + 1 >= questions.length ? "Ver Resultado" : "Próxima →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
