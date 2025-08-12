import { useEffect, useState } from "react";
import type { Scenario } from "@/utils/scoring";

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL("../../data/scenarios.json", import.meta.url);
    fetch(url)
      .then(r => r.json())
      .then((json: unknown) => {
        if (Array.isArray(json)) {
          // Normalize and validate scenarios
          const normalizedScenarios = json
            .filter(item => 
              typeof item === 'object' && 
              item !== null && 
              'id' in item && 
              'title' in item &&
              (('track_a' in item && 'track_b' in item) || ('trackA' in item && 'trackB' in item))
            )
            .map((item: any) => {
              const scenario = { ...item };
              
              // Normalize track field names
              if ('track_a' in scenario && !('trackA' in scenario)) {
                scenario.trackA = typeof scenario.track_a === 'string' 
                  ? { description: scenario.track_a }
                  : scenario.track_a;
                delete scenario.track_a;
              }
              if ('track_b' in scenario && !('trackB' in scenario)) {
                scenario.trackB = typeof scenario.track_b === 'string'
                  ? { description: scenario.track_b }
                  : scenario.track_b;
                delete scenario.track_b;
              }
              
              // Ensure trackA/trackB are objects with description
              if (typeof scenario.trackA === 'string') {
                scenario.trackA = { description: scenario.trackA };
              }
              if (typeof scenario.trackB === 'string') {
                scenario.trackB = { description: scenario.trackB };
              }
              
              return scenario;
            });
          
          setScenarios(normalizedScenarios as Scenario[]);
        } else {
          setScenarios([]);
        }
      })
      .catch(() => setError("Failed to load scenarios"));
  }, []);

  return { scenarios, error, loading: scenarios === null && !error };
}
