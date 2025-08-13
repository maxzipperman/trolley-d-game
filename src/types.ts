export interface Scenario {
  id: string;
  title: string;
  description?: string;
  track_a: string;
  track_b: string;
  theme?: string;
  tags?: string[];
  axes?: Partial<Record<AxisName, { A?: number; B?: number }>>;
  responses?: Array<{
    avatar: string;
    choice: "A" | "B";
    rationale?: string;
  }>;
}

export type AxisName = "orderChaos" | "materialSocial" | "mercyMischief";