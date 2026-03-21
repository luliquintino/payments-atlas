export interface Level {
  level: number;
  name: string;
  minXP: number;
}

export const LEVELS: Level[] = [
  { level: 1, name: "Iniciante", minXP: 0 },
  { level: 2, name: "Curioso", minXP: 100 },
  { level: 3, name: "Estudante", minXP: 250 },
  { level: 4, name: "Analista", minXP: 400 },
  { level: 5, name: "Especialista", minXP: 700 },
  { level: 6, name: "Mestre em Pagamentos", minXP: 1000 },
];

export function getLevelForXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp: number): Level | null {
  const current = getLevelForXP(xp);
  const idx = LEVELS.findIndex((l) => l.level === current.level);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getLevelProgress(xp: number): { current: Level; next: Level | null; percent: number } {
  const current = getLevelForXP(xp);
  const next = getNextLevel(xp);
  if (!next) return { current, next: null, percent: 100 };
  const range = next.minXP - current.minXP;
  const progress = xp - current.minXP;
  return { current, next, percent: Math.round((progress / range) * 100) };
}
