import type { Scenario } from "@/types";

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

const ORDER = new Set(["bureaucracy", "standards", "logistics"]);
const CHAOS = new Set(["absurd", "paradox", "infinite"]);
const MATERIAL = new Set(["reality", "manufacturing_defects", "quality_control", "space"]);
const SOCIAL = new Set(["identity", "meaning", "workers_rights", "existential"]);

const MISCHIEF_WORDS = ["hit", "tow", "deny", "erase", "confine", "condemn", "break"];

export function computeAxes(
  answers: Record<string, "A"|"B"|"skip">,
  scenarios: Scenario[]
) {
  let order = 0, chaos = 0, material = 0, social = 0, mercy = 0, mischief = 0;

  for (const s of scenarios) {
    // Order/Chaos from tags
    if (s.tags?.some(t => ORDER.has(t))) order++;
    if (s.tags?.some(t => CHAOS.has(t))) chaos++;
    if (s.tags?.some(t => MATERIAL.has(t))) material++;
    if (s.tags?.some(t => SOCIAL.has(t))) social++;

    const pick = answers[s.id];
    if (!pick || pick === "skip") continue;

    const text = (pick === "A" ? s.track_a : s.track_b).toLowerCase();
    const isMischief = MISCHIEF_WORDS.some(w => text.includes(w));
    if (isMischief) mischief++; else mercy++;
  }

  return { order, chaos, material, social, mercy, mischief };
}

export function mapScenarioToDecisionParams(scenario: Scenario) {
  return {
    axes: {
      order: scenario.tags?.some(t => ORDER.has(t)) ? 1 : 0,
      chaos: scenario.tags?.some(t => CHAOS.has(t)) ? 1 : 0,
      material: scenario.tags?.some(t => MATERIAL.has(t)) ? 1 : 0,
      social: scenario.tags?.some(t => SOCIAL.has(t)) ? 1 : 0,
    },
    mischiefA: MISCHIEF_WORDS.some(w => scenario.track_a.toLowerCase().includes(w)),
    mischiefB: MISCHIEF_WORDS.some(w => scenario.track_b.toLowerCase().includes(w)),
  };
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
    mercyMischief: clamp(raw.mercy - raw.mischief),
  };
}