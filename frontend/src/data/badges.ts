export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "explorer" | "student" | "trailblazer" | "consistency";
  xpReward: number;
  condition: {
    type: "pages_visited" | "quizzes_perfect" | "quizzes_completed" | "trails_completed" | "streak_days";
    threshold: number;
  };
}

export const BADGES: Badge[] = [
  { id: "first-step", name: "Primeiro Passo", icon: "🌟", description: "Visitou sua primeira página", category: "explorer", xpReward: 10, condition: { type: "pages_visited", threshold: 1 } },
  { id: "dedicated-reader", name: "Leitor Dedicado", icon: "📚", description: "Visitou 10 páginas", category: "explorer", xpReward: 25, condition: { type: "pages_visited", threshold: 10 } },
  { id: "explorer", name: "Explorador", icon: "🗺️", description: "Visitou 20 páginas", category: "explorer", xpReward: 50, condition: { type: "pages_visited", threshold: 20 } },
  { id: "cartographer", name: "Cartógrafo", icon: "🌍", description: "Visitou todas as 30 páginas", category: "explorer", xpReward: 100, condition: { type: "pages_visited", threshold: 30 } },
  { id: "curious", name: "Curioso", icon: "🧠", description: "Completou seu primeiro quiz", category: "student", xpReward: 10, condition: { type: "quizzes_completed", threshold: 1 } },
  { id: "precision", name: "Precisão", icon: "🎯", description: "Acertou 3 quizzes com 100%", category: "student", xpReward: 30, condition: { type: "quizzes_perfect", threshold: 3 } },
  { id: "perfection", name: "Perfeição", icon: "💯", description: "Acertou todos os quizzes com 100%", category: "student", xpReward: 200, condition: { type: "quizzes_perfect", threshold: 99 } },
  { id: "takeoff", name: "Decolagem", icon: "🏁", description: "Completou sua primeira trilha", category: "trailblazer", xpReward: 50, condition: { type: "trails_completed", threshold: 1 } },
  { id: "specialist", name: "Especialista", icon: "⭐", description: "Completou 3 trilhas", category: "trailblazer", xpReward: 100, condition: { type: "trails_completed", threshold: 3 } },
  { id: "master", name: "Mestre", icon: "🏆", description: "Completou todas as trilhas", category: "trailblazer", xpReward: 300, condition: { type: "trails_completed", threshold: 99 } },
  { id: "on-fire", name: "Em Chamas", icon: "🔥", description: "Streak de 3 dias", category: "consistency", xpReward: 20, condition: { type: "streak_days", threshold: 3 } },
  { id: "unstoppable", name: "Imparável", icon: "⚡", description: "Streak de 7 dias", category: "consistency", xpReward: 50, condition: { type: "streak_days", threshold: 7 } },
  { id: "legendary", name: "Lendário", icon: "💎", description: "Streak de 30 dias", category: "consistency", xpReward: 200, condition: { type: "streak_days", threshold: 30 } },
];

export const BADGE_CATEGORIES = [
  { id: "explorer" as const, name: "Explorador", icon: "🧭" },
  { id: "student" as const, name: "Estudante", icon: "📖" },
  { id: "trailblazer" as const, name: "Trilheiro", icon: "🥾" },
  { id: "consistency" as const, name: "Consistência", icon: "📅" },
];
