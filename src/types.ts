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

export interface Settings {
  sound: boolean;
  haptics: boolean;
  animations: boolean;
}

export type { Scenario, Persona, Tag } from "./utils/tags.schema";
export type { Decision } from "./utils/decisions.schema";