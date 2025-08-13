
import { z } from "zod";

export const decisionSchema = z.object({
  scenarioId: z.string(),
  persona: z.string(),
  choice: z.enum(["A", "B"]),
  rationale: z.string().optional(),
});
