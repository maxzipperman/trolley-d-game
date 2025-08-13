import { z } from "zod";
import { tagsSchema } from "@/utils/tags.schema";

/**
 * SCENARIO ID GUIDANCE:
 * Use format: [LANGUAGE_CODE][SEQUENCE_NUMBER]
 * - LANGUAGE_CODE: 2-letter ISO 639-1 code (EN, ES, FR, etc.)
 * - SEQUENCE_NUMBER: Zero-padded 2-digit number (01, 02, etc.)
 * Examples: "EN01", "EN02", "ES01", "FR01"
 * 
 * This standardized format enables:
 * - Easy internationalization and content organization
 * - Consistent sorting and filtering by language/sequence
 * - Clear identification of content origin and order
 * - Scalable numbering system as content grows
 */
export const ScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  track_a: z.string(),
  track_b: z.string(),
  theme: z.string().optional(),
  tags: tagsSchema.optional(),
  // Optional image URL for scenario visualization
  // Should be a valid URL pointing to scenario-related imagery
  imageUrl: z.string().url().optional(),
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

/**
 * PERSONA IDENTIFIER GUIDANCE:
 * Use the persona's commonly known name or title
 * - For historical figures: Use widely recognized name ("Socrates", "Kant", "Mill")
 * - For fictional characters: Use character name ("Spock", "Hermione")
 * - For archetypes: Use descriptive title ("The Utilitarian", "The Pragmatist")
 * 
 * Guidelines:
 * - Keep names concise and recognizable
 * - Avoid special characters or numbers
 * - Use proper capitalization
 * - Ensure uniqueness within the persona collection
 * - Consider cultural recognition across target audience
 */
export const PersonaSchema = z.object({
  name: z.string(),
  era_origin: z.string().optional(),
  occupation_or_role: z.string().optional(),
  worldview_values: z.string().optional(),
  tone_style: z.string().optional(),
  // Optional image URL for persona avatar/portrait
  // Should be a valid URL pointing to persona imagery (photo, artwork, etc.)
  imageUrl: z.string().url().optional(),
  example_lines: z.array(z.string()).optional(),
});

export type Persona = z.infer<typeof PersonaSchema>;
