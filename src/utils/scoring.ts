export type Choice = "A" | "B" | "skip";

export interface TrackOption {
  description?: string;
  [k: string]: unknown;
}

export interface Scenario {
  id: string;
  title: string;
  theme?: string;
  description?: string;
  tags?: string[];
  trackA?: TrackOption;
  trackB?: TrackOption;
  options?: { A?: TrackOption; B?: TrackOption };
  responses?: Array<{ name?: string; choice?: "A" | "B"; rationale?: string }>;
  [k: string]: unknown;
}

const KEYWORDS_MISCHIEF = ["deny", "tow", "hit", "erase"];

function getTrackText(s: Scenario, choice: "A" | "B"): string {
  const opt = choice === "A" ? s.trackA ?? s.options?.A : s.trackB ?? s.options?.B;
  const text = (opt as TrackOption | undefined)?.description
    ?? (choice === "A" ? (s as any)?.A : (s as any)?.B)
    ?? "";
  return typeof text === "string" ? text : "";
}

export function computeBaseCounts(answers: Record<string, Choice>) {
  let scoreA = 0, scoreB = 0;
  for (const v of Object.values(answers)) {
    if (v === "A") scoreA++;
    if (v === "B") scoreB++;
  }
  return { scoreA, scoreB };
}

export function computeAxes(scenarios: Scenario[], answers: Record<string, Choice>) {
  let order = 0, chaos = 0;
  let material = 0, social = 0;
  let mercy = 0, mischief = 0;

  for (const s of scenarios) {
    const tags = s.tags ?? [];
    // Order vs Chaos tags
    if (tags.some(t => ["bureaucracy","standards","logistics"].includes(t))) order++;
    if (tags.some(t => ["absurd","paradox","infinite"].includes(t))) chaos++;

    // Material vs Social tags
    if (tags.some(t => ["reality","manufacturing_defects","quality_control","space"].includes(t))) material++;
    if (tags.some(t => ["identity","meaning","workers_rights","existential"].includes(t))) social++;

    const choice = answers[s.id];
    if (choice === "A" || choice === "B") {
      const text = getTrackText(s, choice).toLowerCase();
      const isMischief = KEYWORDS_MISCHIEF.some(k => text.includes(k));
      if (isMischief) mischief++; else mercy++;
    }
  }

  const clamp = (n: number) => Math.max(-10, Math.min(10, n));
  return {
    orderChaos: clamp(order - chaos),
    materialSocial: clamp(material - social),
    mercyMischief: clamp(mercy - mischief),
  };
}
