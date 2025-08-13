export interface Response {
  avatar: string;
  choice: "A" | "B";
  rationale?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description?: string;
  track_a: string;
  track_b: string;
  theme?: string;
  tags?: string[];
}

export interface Decision extends Scenario {
  responses: Response[];
}
