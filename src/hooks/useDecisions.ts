
import { useCallback, useEffect, useState } from "react";
import { fetchWithRetry } from "@/utils/fetchWithRetry";
import { decisionSchema } from "@/utils/decisions.schema";
import type { Decision } from "@/types";

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
      const parsed = decisionSchema.array().safeParse(json);
      if (parsed.success) {
        setDecisions(parsed.data);
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
