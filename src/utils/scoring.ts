import type { Scenario } from "@/types";
import { ORDER, CHAOS, MATERIAL, SOCIAL } from "./tags";

export type Choice = "A" | "B" | "skip";

export function countAB(answers: Record<string, Choice>) {
  return Object.values(answers).reduce(
    (acc, v) => {
      if (v === "A") acc.A += 1;
      if (v === "B") acc.B += 1;
      return acc;
    },
    { A: 0, B: 0 }
  );
}

const MISCHIEF_WORDS = ["hit", "tow", "deny", "erase", "confine", "condemn", "break"];
const MERCY_WORDS = ["help", "save", "care", "protect", "assist", "support", "heal"];

// New approach: compute axes based purely on scenario tags, not user decisions
export function computeAxes(
  answers: Record<string, Choice>,
  scenarios: Scenario[]
) {
  let order = 0, chaos = 0, material = 0, social = 0, mercy = 0, mischief = 0;

  // Count scenarios by their tags (not dependent on user choices)
  for (const s of scenarios) {
    if (s.tags?.some(t => ORDER.has(t))) order++;
    if (s.tags?.some(t => CHAOS.has(t))) chaos++;
    if (s.tags?.some(t => MATERIAL.has(t))) material++;
    if (s.tags?.some(t => SOCIAL.has(t))) social++;

    // Add mercy/mischief scoring based on choice text analysis
    const choice = answers[s.id];
    if (choice === "A" || choice === "B") {
      const choiceText = choice === "A" ? s.track_a : s.track_b;
      const lowerText = choiceText.toLowerCase();

      if (MERCY_WORDS.some(word => lowerText.includes(word))) mercy++;
      if (MISCHIEF_WORDS.some(word => lowerText.includes(word))) mischief++;
    }
  }

  return { order, chaos, material, social, mercy, mischief };
}

export function computeBaseCounts(answers: Record<string, Choice>) {
  const counts = countAB(answers);
  return { scoreA: counts.A, scoreB: counts.B };
}

export function computeAxes_legacy(scenarios: Scenario[], answers: Record<string, Choice>) {
  const raw = computeAxes(answers, scenarios);
  const clamp = (n: number) => Math.max(-10, Math.min(10, n));
  return {
    orderChaos: clamp(raw.order - raw.chaos),
    materialSocial: clamp(raw.material - raw.social),
    mercyMischief: clamp(raw.mercy - raw.mischief),
  };
}