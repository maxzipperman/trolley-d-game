export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export interface ScenarioStats {
  percentA: number;
  percentB: number;
}

export async function submitChoice(
  scenarioId: string,
  choice: "A" | "B" | "skip"
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/choice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioId, choice }),
    });
  } catch (e) {
    console.error("submitChoice failed", e);
  }
}

export async function fetchScenarioStats(
  scenarioId: string
): Promise<ScenarioStats> {
  const res = await fetch(`${API_BASE_URL}/api/stats/${scenarioId}`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchOverallStats(): Promise<ScenarioStats> {
  const res = await fetch(`${API_BASE_URL}/api/stats/overall`);
  if (!res.ok) throw new Error("Failed to fetch overall stats");
  return res.json();
}
