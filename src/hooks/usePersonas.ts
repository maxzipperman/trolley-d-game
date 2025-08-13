import { useEffect, useState } from "react";

export interface Persona {
  name: string;
  era_origin?: string;
  occupation_or_role?: string;
  worldview_values?: string;
  tone_style?: string;
  example_lines?: string[];
}

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL("../../data/personas.json", import.meta.url);
    fetch(url)
      .then((r) => r.json())
      .then((json: unknown) => {
        if (
          Array.isArray(json) &&
          json.every(
            (item) =>
              typeof item === "object" &&
              item !== null &&
              typeof (item as { name?: unknown }).name === "string"
          )
        ) {
          setPersonas(json as Persona[]);
        } else {
          setPersonas([]);
        }
      })
      .catch(() => setError("Failed to load personas"));
  }, []);

  return { personas, error, loading: personas === null && !error };
}
