import { useCallback, useEffect, useState } from "react";
import { ScenarioSchema, type Scenario } from "@/types";
import { fetchWithRetry } from "@/utils/fetchWithRetry";

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("../../data/scenarios.json", import.meta.url);
      const json = await fetchWithRetry(url.href);
      const parsed = ScenarioSchema.array().safeParse(json);
      if (parsed.success) {
        setScenarios(parsed.data);
      } else {
        console.warn("Scenario schema validation failed", parsed.error);
        setError("Failed to load scenarios");
      }
    } catch (err) {
      console.error("Failed to load scenarios", err);
      setError("Failed to load scenarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reload = useCallback(() => {
    setError(null);
    setScenarios(null);
    load();
  }, [load]);

  return { scenarios, error, loading: scenarios === null && !error, reload, retry: reload };
}