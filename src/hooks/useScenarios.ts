import { useEffect, useState } from "react";
import type { Scenario } from "@/types";

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      .catch(() => setError("Failed to load scenarios"));
  }, []);

  return { scenarios, error, loading: scenarios === null && !error };
}
