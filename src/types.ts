
export type { Scenario, Persona, Tag } from "./utils/tags.schema";

export type Decision = {
  scenarioId: string;
  persona: string;
  choice: "A" | "B";
  rationale?: string;
};
