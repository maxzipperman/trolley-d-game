import { z } from "zod";
import { CANONICAL_TAGS } from "./tags";

export const tagSchema = z.enum(CANONICAL_TAGS);

export const scenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  track_a: z.string(),
  track_b: z.string(),
  theme: z.string().optional(),
  tags: z.array(tagSchema).optional(),
  responses: z
    .array(
      z.object({
        avatar: z.string(),
        choice: z.enum(["A", "B"]),
        rationale: z.string().optional(),
      })
    )
    .optional(),
});

export const personaSchema = z.object({
  name: z.string(),
  era_origin: z.string().optional(),
  occupation_or_role: z.string().optional(),
  worldview_values: z.string().optional(),
  tone_style: z.string().optional(),
  example_lines: z.array(z.string()).optional(),
});

export type Scenario = z.infer<typeof scenarioSchema>;
export type Persona = z.infer<typeof personaSchema>;
export type Tag = z.infer<typeof tagSchema>;
