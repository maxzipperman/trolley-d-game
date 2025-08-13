import { useEffect, useState } from "react";
import { useScenarios } from "@/hooks/useScenarios";
import { supabase } from "@/integrations/supabase/client";

const ANSWERS_KEY = "trolleyd-answers";

/**
 * Minimal progress hook to satisfy Play.tsx import.
 * Returns total, answered, and percent (also aliased as value).
 */
export function useProgress(): any {
  const { scenarios } = useScenarios();
  const [answered, setAnswered] = useState(0);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { count } = await supabase
          .from("answers")
          .select("id", { count: "exact", head: true })
          .eq("user_id", session.user.id);
        setAnswered(count ?? 0);
      } else {
        const stored = localStorage.getItem(ANSWERS_KEY);
        const local = stored ? JSON.parse(stored) : {};
        setAnswered(Object.keys(local).length);
      }
    };
    load();
  }, [scenarios]);

  const total = scenarios?.length ?? 0;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return { total, answered, percent, value: percent };
}
