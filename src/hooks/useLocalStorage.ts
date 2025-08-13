import { useEffect, useState } from "react";

export interface HistoryEntry<T> {
  timestamp: number;
  value: T;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const historyKey = `${key}-history`;

  function getHistory(): HistoryEntry<T>[] {
    try {
      const raw = window.localStorage.getItem(historyKey);
      return raw ? (JSON.parse(raw) as HistoryEntry<T>[]) : [];
    } catch {
      return [];
    }
  }

  function recordHistory(entry: T) {
    try {
      const history = getHistory();
      const last = history[history.length - 1];
      // Avoid recording duplicate consecutive runs
      if (!last || JSON.stringify(last.value) !== JSON.stringify(entry)) {
        history.push({ timestamp: Date.now(), value: entry });
        window.localStorage.setItem(historyKey, JSON.stringify(history));
      }
    } catch {
      // ignore write errors
    }
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors
    }
  }, [key, value]);

  return [value, setValue, { history: getHistory(), recordHistory }] as const;
}
