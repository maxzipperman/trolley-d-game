import { useEffect, useState } from "react";
import type { Scenario } from "@/types";

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const modules = import.meta.glob<Scenario>("../../data/scenarios/*.json", {
        eager: true,
        import: "default",
      });
      const loaded = Object.values(modules);
      setScenarios(loaded);
    } catch {
      setError("Failed to load scenarios");
    }
  }, []);

  return { scenarios, error, loading: scenarios === null && !error };
}
