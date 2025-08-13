import { useLocalStorage } from "./useLocalStorage";

export interface Score {
  scoreA: number;
  scoreB: number;
}

export type Scores = Record<string, Score>;

export const SCORES_KEY = "trolleyd-scores";

export function useScores() {
  return useLocalStorage<Scores>(SCORES_KEY, {});
}
