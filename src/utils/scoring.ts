import type { Scenario, AxisName } from "@/types";

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

export function computeBaseCounts(answers: Record<string, Choice>) {
  const counts = countAB(answers);
  return { scoreA: counts.A, scoreB: counts.B };
}

export function computeAxes(
  scenarios: Scenario[],
  answers: Record<string, Choice>
) {
  const totals: Record<AxisName, number> = {
    orderChaos: 0,
    materialSocial: 0,
    mercyMischief: 0,
  };

  for (const s of scenarios) {
    const pick = answers[s.id];
    if (!pick || pick === "skip" || !s.axes) continue;
    for (const [axis, values] of Object.entries(s.axes)) {
      const delta = values[pick as "A" | "B"];
      if (typeof delta === "number") {
        totals[axis as AxisName] += delta;
      }
    }
  }

  const clamp = (n: number) => Math.max(-10, Math.min(10, n));
  return {
    orderChaos: clamp(totals.orderChaos),
    materialSocial: clamp(totals.materialSocial),
    mercyMischief: clamp(totals.mercyMischief),
  };
}

