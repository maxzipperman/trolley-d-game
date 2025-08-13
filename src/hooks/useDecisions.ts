import { useEffect, useState } from "react";
import type { Decision } from "@/types";

export function useDecisions() {
  const [decisions, setDecisions] = useState<Decision[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL("../../data/decisions.json", import.meta.url);
    fetch(url)
      .then(r => r.json())
      .then((json: unknown) => {
        if (Array.isArray(json)) {
          setDecisions(json as Decision[]);
        } else {
          setDecisions([]);
        }
      })
      .catch(() => setError("Failed to load decisions"));
  }, []);

  return { decisions, error, loading: decisions === null && !error };
}
