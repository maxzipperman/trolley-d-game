
import { z } from "zod";
import { tagSchema } from "./tags.schema";

export const decisionSchema = z.object({
  scenarioId: z.string(),
  persona: z.string(),
  choice: z.enum(["A", "B"]),
  rationale: z.string().optional(),
  tags: z.array(tagSchema).optional(),
});

export type Decision = z.infer<typeof decisionSchema>;
