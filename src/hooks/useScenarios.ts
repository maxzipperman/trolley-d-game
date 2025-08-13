import { useCallback, useEffect, useState } from "react";
import type { Scenario } from "@/types";

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    const url = new URL("../../data/scenarios.json", import.meta.url);
    fetch(url)
      .then(r => r.json())
      .then((json: unknown) => {
        if (Array.isArray(json)) {
          setScenarios(json as Scenario[]);
        } else {
          setScenarios([]);
        }
      })
      .catch(err => {
        console.error("Failed to load scenarios", err);
        setError("Failed to load scenarios");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reload = useCallback(() => {
    setError(null);
    setScenarios(null);
    load();
  }, [load]);

  return { scenarios, error, loading: scenarios === null && !error, reload };
}
