import { useLocalStorage } from "./useLocalStorage";
import type { Choice } from "@/utils/scoring";

const ANSWERS_KEY = "trolleyd-answers";

export function useAnswers() {
  const [answers, setAnswers] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});
  return { answers, setAnswers };
}
