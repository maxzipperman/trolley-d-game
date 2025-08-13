
import { useEffect, useState } from "react";
import type { Scenario } from "@/types";
import { scenarioSchema } from "@/utils/tags.schema";
import { toCanonicalTags } from "@/utils/tags";

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customScenarios, setCustomScenarios] = useState<Scenario[]>([]);

  const load = () => {
    setError(null);
    setScenarios(null);
    const url = new URL("../../data/scenarios.json", import.meta.url);
    fetch(url)
      .then(r => r.json())
      .then((json: unknown) => {
        if (Array.isArray(json)) {
          const valid: Scenario[] = [];
          for (const raw of json) {
            if (typeof raw !== "object" || raw === null) continue;
            const obj = raw as Record<string, unknown>;
            const id = typeof obj.id === "string" ? obj.id : undefined;
            const tags = Array.isArray(obj.tags)
              ? toCanonicalTags(obj.tags as string[])
              : undefined;
            const withCanonical = { ...obj, tags };
            const parsed = scenarioSchema.safeParse(withCanonical);
            if (parsed.success) {
              valid.push(parsed.data);
            } else if (import.meta.env.DEV && id) {
              console.error(`Invalid scenario ${id}: ${parsed.error.message}`);
            }
          }
          setScenarios(valid);
        } else {
          setScenarios([]);
        }
      })
      .catch(() => setError("Failed to load scenarios"));
  };

  useEffect(() => {
    load();
    
    // Load custom scenarios from localStorage
    const loadCustomScenarios = () => {
      try {
        const custom = JSON.parse(localStorage.getItem('customScenarios') || '[]');
        setCustomScenarios(custom);
      } catch {
        setCustomScenarios([]);
      }
    };
    
    loadCustomScenarios();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadCustomScenarios();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Combine static and custom scenarios
  const allScenarios = scenarios ? [...scenarios, ...customScenarios] : null;

  return {
    scenarios: allScenarios,
    error,
    loading: scenarios === null && !error,
    retry: load,
  };
}
