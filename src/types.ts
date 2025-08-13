export interface Scenario {
  id: string;
  title: string;
  description?: string;
  track_a: string;
  track_b: string;
  theme?: string;
  tags?: string[];
  responses?: Array<{
    avatar: string;
    choice: "A" | "B";
    rationale?: string;
  }>;
}

export interface LLMResponse {
  scenarioId: string;
  modelName: string;
  choice: "A" | "B";
  rationale?: string;
}
