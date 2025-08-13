import { useEffect, useState } from "react";
import type { Persona } from "@/types";
import { personaSchema } from "@/utils/tags.schema";

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL("../../data/personas.json", import.meta.url);
    fetch(url)
      .then((r) => r.json())
      .then((json: unknown) => {
        if (Array.isArray(json)) {
          const valid: Persona[] = [];
          for (const raw of json) {
            const parsed = personaSchema.safeParse(raw);
            if (parsed.success) {
              valid.push(parsed.data);
            } else if (import.meta.env.DEV) {
              console.error(`Invalid persona: ${parsed.error.message}`);
            }
          }
          setPersonas(valid);
        } else {
          setPersonas([]);
        }
      })
      .catch(() => setError("Failed to load personas"));
  }, []);

  return { personas, error, loading: personas === null && !error };
}