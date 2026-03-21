"use client";
import { useState, useEffect, useCallback } from "react";
import { BADGES, type Badge } from "@/data/badges";
import { LEARNING_TRAILS } from "@/data/learning-trails";
import { getLevelForXP, getLevelProgress } from "@/data/levels";

const XP_KEY = "pks-xp";
const BADGES_KEY = "pks-badges";
const STREAK_KEY = "pks-streak";
const QUIZ_KEY = "pks-quiz-scores";
const PAGES_KEY = "pks-pages-visited";

interface StreakData {
  count: number;
  lastDate: string;
}

interface QuizScore {
  correct: number;
  total: number;
}

interface GameState {
  xp: number;
  badges: string[];
  streak: StreakData;
  quizScores: Record<string, QuizScore>;
  pagesVisited: string[];
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): GameState {
  if (typeof window === "undefined") {
    return { xp: 0, badges: [], streak: { count: 0, lastDate: "" }, quizScores: {}, pagesVisited: [] };
  }
  try {
    return {
      xp: parseInt(localStorage.getItem(XP_KEY) || "0", 10),
      badges: JSON.parse(localStorage.getItem(BADGES_KEY) || "[]"),
      streak: JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastDate":""}'),
      quizScores: JSON.parse(localStorage.getItem(QUIZ_KEY) || "{}"),
      pagesVisited: JSON.parse(localStorage.getItem(PAGES_KEY) || "[]"),
    };
  } catch {
    return { xp: 0, badges: [], streak: { count: 0, lastDate: "" }, quizScores: {}, pagesVisited: [] };
  }
}

function persist(state: GameState) {
  localStorage.setItem(XP_KEY, String(state.xp));
  localStorage.setItem(BADGES_KEY, JSON.stringify(state.badges));
  localStorage.setItem(STREAK_KEY, JSON.stringify(state.streak));
  localStorage.setItem(QUIZ_KEY, JSON.stringify(state.quizScores));
  localStorage.setItem(PAGES_KEY, JSON.stringify(state.pagesVisited));
}

export function useGameProgress() {
  const [state, setState] = useState<GameState>(loadState);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  useEffect(() => {
    setState(loadState());
  }, []);

  const checkBadges = useCallback((s: GameState): { badges: string[]; earned: Badge[] } => {
    const earned: Badge[] = [];
    const currentBadges = [...s.badges];

    const completedTrails = LEARNING_TRAILS.filter((t) =>
      t.pages.every((p) => s.pagesVisited.includes(p.path))
    ).length;

    const perfectQuizzes = Object.values(s.quizScores).filter(
      (q) => q.total > 0 && q.correct === q.total
    ).length;

    const completedQuizzes = Object.values(s.quizScores).filter(
      (q) => q.total > 0
    ).length;

    for (const badge of BADGES) {
      if (currentBadges.includes(badge.id)) continue;

      let met = false;
      switch (badge.condition.type) {
        case "pages_visited":
          met = s.pagesVisited.length >= badge.condition.threshold;
          break;
        case "quizzes_completed":
          met = completedQuizzes >= badge.condition.threshold;
          break;
        case "quizzes_perfect":
          met = perfectQuizzes >= badge.condition.threshold;
          break;
        case "trails_completed":
          met = completedTrails >= badge.condition.threshold;
          break;
        case "streak_days":
          met = s.streak.count >= badge.condition.threshold;
          break;
      }

      if (met) {
        currentBadges.push(badge.id);
        earned.push(badge);
      }
    }

    return { badges: currentBadges, earned };
  }, []);

  const updateStreak = (streak: StreakData): StreakData => {
    const d = today();
    if (streak.lastDate === d) return streak;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    return streak.lastDate === yesterdayStr
      ? { count: streak.count + 1, lastDate: d }
      : { count: 1, lastDate: d };
  };

  const visitPage = useCallback((pathname: string) => {
    setState((prev) => {
      const streak = updateStreak(prev.streak);
      const isNew = !prev.pagesVisited.includes(pathname);

      const next: GameState = {
        ...prev,
        xp: isNew ? prev.xp + 5 : prev.xp,
        pagesVisited: isNew ? [...prev.pagesVisited, pathname] : prev.pagesVisited,
        streak,
      };

      const { badges, earned } = checkBadges(next);
      const xpBonus = earned.reduce((sum, b) => sum + b.xpReward, 0);
      const final = { ...next, badges, xp: next.xp + xpBonus };
      persist(final);
      if (earned.length > 0) setNewBadges(earned);
      return final;
    });
  }, [checkBadges]);

  const recordQuiz = useCallback((pageRoute: string, correct: number, total: number) => {
    setState((prev) => {
      const xpGain = correct * 5;
      const next: GameState = {
        ...prev,
        xp: prev.xp + xpGain,
        quizScores: { ...prev.quizScores, [pageRoute]: { correct, total } },
      };

      const { badges, earned } = checkBadges(next);
      const xpBonus = earned.reduce((sum, b) => sum + b.xpReward, 0);
      const final = { ...next, badges, xp: next.xp + xpBonus };
      persist(final);
      if (earned.length > 0) setNewBadges(earned);
      return final;
    });
  }, [checkBadges]);

  const dismissBadges = useCallback(() => setNewBadges([]), []);

  const resetProgress = useCallback(() => {
    const fresh: GameState = { xp: 0, badges: [], streak: { count: 0, lastDate: "" }, quizScores: {}, pagesVisited: [] };
    persist(fresh);
    setState(fresh);
  }, []);

  return {
    ...state,
    level: getLevelForXP(state.xp),
    levelProgress: getLevelProgress(state.xp),
    newBadges,
    visitPage,
    recordQuiz,
    dismissBadges,
    resetProgress,
    getQuizScore: (route: string) => state.quizScores[route] || null,
    isPageVisited: (route: string) => state.pagesVisited.includes(route),
  };
}
