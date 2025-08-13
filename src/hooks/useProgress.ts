
import { useAnswers } from "@/hooks/useAnswers";
import { useScenarios } from "@/hooks/useScenarios";

/**
 * Minimal progress hook to satisfy Play.tsx import.
 * Returns total, answered, and percent (also aliased as value).
 */
export function useProgress(): any {
  const { scenarios } = useScenarios();
  const { answers } = useAnswers() as any;

  const total = scenarios?.length ?? 0;
  const answered = answers ? Object.keys(answers).length : 0;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return { total, answered, percent, value: percent };
}
