import { useEffect, useState } from "react";
import type { LLMResponse } from "@/types";

function isLLMResponse(item: unknown): item is LLMResponse {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as { scenarioId?: unknown }).scenarioId === "string" &&
    typeof (item as { modelName?: unknown }).modelName === "string" &&
    (((item as { choice?: unknown }).choice) === "A" || ((item as { choice?: unknown }).choice) === "B")
  );
}

export function useLLMResponses() {
  const [responses, setResponses] = useState<LLMResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL("../../data/llm_answers.json", import.meta.url);
    fetch(url)
      .then((r) => r.json())
      .then((json: unknown) => {
        if (Array.isArray(json) && json.every(isLLMResponse)) {
          setResponses(json);
        } else {
          setResponses([]);
        }
      })
      .catch(() => setError("Failed to load LLM responses"));
  }, []);

  return { responses, error, loading: responses === null && !error };
}
