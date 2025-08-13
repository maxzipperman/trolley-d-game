import { useEffect, useState } from "react";

const STORAGE_KEY = "trolleyd-reduced-motion";

function getInitialValue() {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored !== null) return stored === "true";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState<boolean>(getInitialValue);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(getInitialValue());
    const storage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) update();
    };
    media.addEventListener("change", update);
    window.addEventListener("storage", storage);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("storage", storage);
    };
  }, []);

  return reduced;
}
