import { useCallback, useEffect, useState } from "react";
import { PersonaSchema, type Persona } from "@/types";
import { fetchWithRetry } from "@/utils/fetchWithRetry";

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("../../data/personas.json", import.meta.url);
      const json = await fetchWithRetry(url.href);
      const parsed = PersonaSchema.array().safeParse(json);
      if (parsed.success) {
        setPersonas(parsed.data);
      } else {
        console.warn("Persona schema validation failed", parsed.error);
        setError("Failed to load personas");
      }
    } catch (err) {
      console.error("Failed to load personas", err);
      setError("Failed to load personas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reload = useCallback(() => {
    setError(null);
    setPersonas(null);
    load();
  }, [load]);

  return { personas, error, loading: personas === null && !error, reload, retry: reload };
}