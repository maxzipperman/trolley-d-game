
import { useCallback, useEffect, useState } from "react";
import { fetchWithRetry } from "@/utils/fetchWithRetry";
import type { Decision } from "@/types";
import { z } from "zod";

const DecisionSchema = z.object({
  scenarioId: z.string(),
  persona: z.string(),
  choice: z.enum(["A", "B"]),
  rationale: z.string().optional(),
});

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
