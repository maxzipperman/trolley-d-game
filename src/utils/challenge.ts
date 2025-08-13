import type { Scenario } from "@/types";

const KEY = "trolleyd-daily-completions";

function dayString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function loadDates(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveDates(dates: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(dates));
  } catch {
    // ignore
  }
}

export function getDailyScenario(scenarios: Scenario[], date = new Date()) {
  if (scenarios.length === 0) return null;
  const day = dayString(date);
  let hash = 0;
  for (const ch of day) {
    hash = (hash * 31 + ch.charCodeAt(0)) % 2_147_483_647;
  }
  const index = hash % scenarios.length;
  return scenarios[index];
}

export function recordCompletion(date = new Date()) {
  const day = dayString(date);
  const dates = loadDates();
  if (!dates.includes(day)) {
    dates.push(day);
    saveDates(dates);
  }
}

export function getStreakInfo(today = new Date()) {
  const dates = loadDates().sort();
  const set = new Set(dates);
  let current = 0;
  const d = new Date(today);
  while (set.has(dayString(d))) {
    current++;
    d.setDate(d.getDate() - 1);
  }

  let best = 0;
  let prev: Date | null = null;
  let streak = 0;
  for (const ds of dates) {
    const dt = new Date(ds);
    if (prev) {
      const diff = (dt.getTime() - prev.getTime()) / 86_400_000;
      if (diff === 1) {
        streak++;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }
    if (streak > best) best = streak;
    prev = dt;
  }
  return { current, best };
}

