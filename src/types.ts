import { z } from "zod";
import { tagsSchema } from "@/utils/tags.schema";

export const ScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  track_a: z.string(),
  track_b: z.string(),
  theme: z.string().optional(),
  tags: tagsSchema.optional(),
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

export type Scenario = z.infer<typeof ScenarioSchema>;

export const PersonaSchema = z.object({
  name: z.string(),
  era_origin: z.string().optional(),
  occupation_or_role: z.string().optional(),
  worldview_values: z.string().optional(),
  tone_style: z.string().optional(),
  example_lines: z.array(z.string()).optional(),
});

export type Persona = z.infer<typeof PersonaSchema>;
