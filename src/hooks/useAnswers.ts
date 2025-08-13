import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Choice } from "@/utils/scoring";
import { useLocalStorage } from "./useLocalStorage";

const ANSWERS_KEY = "trolleyd-answers";

export function useAnswers() {
  const [answers, setAnswersState] = useState<Record<string, Choice>>({});
  const [localAnswers, setLocalAnswers] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase
          .from("answers")
          .select("scenario_id, choice")
          .eq("user_id", session.user.id);
        if (!error && data) {
          const mapped: Record<string, Choice> = {};
          for (const row of data) {
            if (row.scenario_id && row.choice) {
              mapped[row.scenario_id] = row.choice as Choice;
            }
          }
          setAnswersState(mapped);
        }
      } else {
        setAnswersState(localAnswers);
      }
    };
    load();
  }, [localAnswers]);

  const setAnswers = async (newAnswers: Record<string, Choice>) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const rows = Object.entries(newAnswers).map(([scenario_id, choice]) => ({
        user_id: session.user.id,
        scenario_id,
        choice,
      }));
      await supabase.from("answers").upsert(rows, { onConflict: "user_id,scenario_id" });
      setAnswersState(newAnswers);
    } else {
      setLocalAnswers(newAnswers);
      setAnswersState(newAnswers);
    }
  };

  return { answers, setAnswers };
}
