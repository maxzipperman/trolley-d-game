
import { useCallback, useEffect, useState } from "react";
import { fetchWithRetry } from "@/utils/fetchWithRetry";
import type { Decision } from "@/types";
import { z } from "zod";

const DecisionSchema = z.object({
  "scenario id": z.string().optional(),
  scenarioId: z.string().optional(),
  persona: z.string(),
  choice: z.union([z.enum(["A", "B"]), z.enum(["track_a", "track_b"])]),
  rationale: z.string().optional(),
}).transform(data => ({
  scenarioId: data.scenarioId || data["scenario id"] || "",
  persona: data.persona,
  choice: data.choice === "track_a" ? "A" as const : data.choice === "track_b" ? "B" as const : data.choice,
  rationale: data.rationale
}));

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decision[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("../../data/decisions.json", import.meta.url);
      const json = await fetchWithRetry(url.href);
      const parsed = DecisionSchema.array().safeParse(json);
      if (parsed.success) {
        setDecisions(parsed.data as Decision[]);
      } else {
        console.warn("Decision schema validation failed", parsed.error);
        setError("Failed to load decisions");
      }
    } catch (err) {
      console.warn("Failed to fetch decisions", err);
      setError("Failed to load decisions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { decisions, error, loading, retry: load };
}
