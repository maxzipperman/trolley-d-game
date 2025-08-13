import type { Scenario, LLMResponse } from "@/types";

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

export function computeAgreement(
  answers: Record<string, "A"|"B"|"skip">,
  llmResponses: LLMResponse[]
) {
  const result: Record<string, { matches: number; total: number; percentage: number }> = {};

  for (const r of llmResponses) {
    const model = r.modelName;
    if (!result[model]) {
      result[model] = { matches: 0, total: 0, percentage: 0 };
    }
    result[model].total += 1;
    if (answers[r.scenarioId] === r.choice) {
      result[model].matches += 1;
    }
  }

  for (const model of Object.keys(result)) {
    const { matches, total } = result[model];
    result[model].percentage = total ? matches / total : 0;
  }

  return result;
}

// Legacy compatibility functions
export type Choice = "A" | "B" | "skip";

export function computeBaseCounts(answers: Record<string, Choice>, llmResponses?: LLMResponse[]) {
  const counts = countAB(answers);
  const agreement = llmResponses ? computeAgreement(answers, llmResponses) : undefined;
  return { scoreA: counts.A, scoreB: counts.B, agreement };
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
