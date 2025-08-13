import { Choice } from "./scoring";

export const ACHIEVEMENTS_KEY = "trolleyd-achievements";

export interface Achievement {
  id: AchievementId;
  label: string;
}

export type AchievementId = "allA" | "allB" | "balanced";

export const achievements: Achievement[] = [
  { id: "allA", label: "All Track A" },
  { id: "allB", label: "All Track B" },
  { id: "balanced", label: "Balanced Play" },
];

export function computeAchievements(answers: Record<string, Choice>): AchievementId[] {
  const choices = Object.values(answers).filter(c => c !== "skip");
  if (choices.length === 0) return [];
  const aCount = choices.filter(c => c === "A").length;
  const bCount = choices.filter(c => c === "B").length;
  const res: AchievementId[] = [];
  if (aCount > 0 && bCount === 0) res.push("allA");
  if (bCount > 0 && aCount === 0) res.push("allB");
  if (aCount === bCount && choices.length > 0) res.push("balanced");
  return res;
}
