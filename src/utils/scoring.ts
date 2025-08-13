import type { Scenario } from "@/types";
import { canonicalTags } from "@/utils/tags.schema";

export function countAB(answers: Record<string, "A"|"B"|"skip">) {
  return Object.values(answers).reduce(
    (acc, v) => {
      if (v === "A") acc.A += 1;
      if (v === "B") acc.B += 1;
      return acc;
    },
    { A: 0, B: 0 }
  );
}

const ORDER = new Set(canonicalTags.ORDER);
const CHAOS = new Set(canonicalTags.CHAOS);
const MATERIAL = new Set(canonicalTags.MATERIAL);
const SOCIAL = new Set(canonicalTags.SOCIAL);

// New approach: compute axes based purely on scenario tags, not user decisions
export function computeAxes(
  answers: Record<string, "A"|"B"|"skip">,
  scenarios: Scenario[]
) {
  let order = 0, chaos = 0, material = 0, social = 0;
  
  // Count scenarios by their tags (not dependent on user choices)
  for (const s of scenarios) {
    if (s.tags?.some(t => ORDER.has(t))) order++;
    if (s.tags?.some(t => CHAOS.has(t))) chaos++;
    if (s.tags?.some(t => MATERIAL.has(t))) material++;
    if (s.tags?.some(t => SOCIAL.has(t))) social++;
  }
  
  // For now, removing mercy/mischief as it was decision-dependent
  // This could be re-added if mercy/mischief tags are added to the schema
  return { order, chaos, material, social, mercy: 0, mischief: 0 };
}

// Legacy compatibility functions
export type Choice = "A" | "B" | "skip";

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
    mercyMischief: clamp(raw.mercy - raw.mischief), // will be 0 for now
  };
}
