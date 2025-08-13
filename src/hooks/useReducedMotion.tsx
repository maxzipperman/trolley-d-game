import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function useReducedMotion() {
  const prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
  const [reducedMotion, setReducedMotion] = useLocalStorage(
    "reduce-motion",
    prefersReduced
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("reduce-motion", reducedMotion);
    document.querySelectorAll("audio, video").forEach((el) => {
      (el as HTMLMediaElement).muted = reducedMotion;
    });
  }, [reducedMotion]);

  return [reducedMotion, setReducedMotion] as const;
}
