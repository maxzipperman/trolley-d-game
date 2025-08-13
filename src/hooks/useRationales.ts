import { useCallback, useEffect, useState } from "react";
import { fetchWithRetry } from "@/utils/fetchWithRetry";
import { tagSchema, type Tag } from "@/utils/tags.schema";
import { z } from "zod";

const rationaleSchema = z.object({
  id: z.string(),
  tone: z.enum(["sarcastic", "deadpan", "absurdist", "stoic"]),
  nihilism: z.number().int(),
  text: z.string(),
  tags: z.array(tagSchema),
});

export type Rationale = z.infer<typeof rationaleSchema>;

export function useRationales() {
  const [rationales, setRationales] = useState<Rationale[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("../../data/rationales.json", import.meta.url);
      const json = await fetchWithRetry(url.href);
      const valid: Rationale[] = [];
      if (Array.isArray(json)) {
        for (const raw of json) {
          const parsed = rationaleSchema.safeParse(raw);
          if (parsed.success) {
            valid.push(parsed.data);
          } else if (import.meta.env.DEV) {
            console.error("Invalid rationale", parsed.error);
          }
        }
      }
      setRationales(valid);
    } catch (err) {
      console.warn("Failed to fetch rationales", err);
      setError("Failed to load rationales");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getForTags = useCallback(
    (tags: Tag[]): Rationale[] => {
      if (!rationales || tags.length === 0) return [];
      const set = new Set(tags);
      return rationales.filter(r => r.tags.some(t => set.has(t)));
    },
    [rationales]
  );

  return { rationales, error, loading, retry: load, getForTags };
}

