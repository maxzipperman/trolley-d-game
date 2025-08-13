import { describe, it, expect } from "vitest";
import { computeAxes, countAB, mapScenarioToDecisionParams } from "./scoring";
import type { Scenario } from "@/types";

const fixture: Scenario = {
  id: "S1",
  title: "Fixture",
  track_a: "Hit the brakes",
  track_b: "Let them go",
  tags: ["bureaucracy", "absurd", "reality", "identity"],
};

describe("countAB", () => {
  it("counts A and B choices", () => {
    const counts = countAB({ a: "A", b: "B", c: "skip", d: "A" });
    expect(counts).toEqual({ A: 2, B: 1 });
  });
});

describe("computeAxes", () => {
  it("computes axes and mercy/mischief totals", () => {
    const res = computeAxes({ S1: "A" }, [fixture]);
    expect(res).toEqual({
      order: 1,
      chaos: 1,
      material: 1,
      social: 1,
      mercy: 0,
      mischief: 1,
    });

    const resB = computeAxes({ S1: "B" }, [fixture]);
    expect(resB.mercy).toBe(1);
    expect(resB.mischief).toBe(0);
  });
});

describe("mapScenarioToDecisionParams", () => {
  it("maps scenario tags and mischief flags", () => {
    const mapped = mapScenarioToDecisionParams(fixture);
    expect(mapped.axes).toEqual({
      order: 1,
      chaos: 1,
      material: 1,
      social: 1,
    });
    expect(mapped.mischiefA).toBe(true);
    expect(mapped.mischiefB).toBe(false);
  });
});
