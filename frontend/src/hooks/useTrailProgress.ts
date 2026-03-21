"use client";
import { useState, useEffect, useCallback } from "react";
import { LEARNING_TRAILS } from "@/data/learning-trails";

const STORAGE_KEY = "pks-trail-progress";
const ACTIVE_TRAIL_KEY = "pks-active-trail";

interface TrailProgress {
  visitedPages: string[]; // array of pathnames
  activeTrailId: string | null;
}

function loadProgress(): TrailProgress {
  if (typeof window === "undefined") return { visitedPages: [], activeTrailId: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const activeTrail = localStorage.getItem(ACTIVE_TRAIL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { visitedPages: parsed.visitedPages || [], activeTrailId: activeTrail };
    }
  } catch {}
  return { visitedPages: [], activeTrailId: null };
}

export function useTrailProgress() {
  const [progress, setProgress] = useState<TrailProgress>({ visitedPages: [], activeTrailId: null });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const markVisited = useCallback((pathname: string) => {
    setProgress((prev) => {
      if (prev.visitedPages.includes(pathname)) return prev;
      const next = { ...prev, visitedPages: [...prev.visitedPages, pathname] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ visitedPages: next.visitedPages }));
      return next;
    });
  }, []);

  const setActiveTrail = useCallback((trailId: string) => {
    setProgress((prev) => {
      localStorage.setItem(ACTIVE_TRAIL_KEY, trailId);
      return { ...prev, activeTrailId: trailId };
    });
  }, []);

  const getTrailProgress = useCallback(
    (trailId: string) => {
      const trail = LEARNING_TRAILS.find((t) => t.id === trailId);
      if (!trail) return { visited: 0, total: 0, percent: 0 };
      const visited = trail.pages.filter((p) => progress.visitedPages.includes(p.path)).length;
      return { visited, total: trail.pages.length, percent: Math.round((visited / trail.pages.length) * 100) };
    },
    [progress.visitedPages]
  );

  const getSectionProgress = useCallback(
    (sectionPaths: string[]) => {
      const visited = sectionPaths.filter((p) => progress.visitedPages.includes(p)).length;
      return { visited, total: sectionPaths.length };
    },
    [progress.visitedPages]
  );

  return { progress, markVisited, setActiveTrail, getTrailProgress, getSectionProgress };
}
