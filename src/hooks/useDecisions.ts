
import { useCallback, useEffect, useState } from "react";
import { fetchWithRetry } from "@/utils/fetchWithRetry";
import { decisionSchema, type Decision } from "@/utils/decisions.schema";
import { toCanonicalTags } from "@/utils/tags";

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
      if (Array.isArray(json)) {
        const valid: Decision[] = [];
        for (const raw of json) {
          if (typeof raw !== "object" || raw === null) continue;
          const obj = raw as Record<string, unknown>;
          const tags = Array.isArray(obj.tags)
            ? toCanonicalTags(obj.tags as string[])
            : undefined;
          const parsed = decisionSchema.safeParse({ ...obj, tags });
          if (parsed.success) {
            valid.push(parsed.data);
          } else if (import.meta.env.DEV) {
            console.error(`Invalid decision: ${parsed.error.message}`);
          }
        }
        setDecisions(valid);
      } else {
        setDecisions([]);
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
