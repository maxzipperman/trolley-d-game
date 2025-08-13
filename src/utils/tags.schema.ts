import { z } from "zod";

export const canonicalTags = {
  ORDER: ["law"] as const,
  CHAOS: ["time_travel"] as const,
  MATERIAL: ["technology", "medical"] as const,
  SOCIAL: ["identity", "existence", "age"] as const,
} as const;

const allTags = [
  ...canonicalTags.ORDER,
  ...canonicalTags.CHAOS,
  ...canonicalTags.MATERIAL,
  ...canonicalTags.SOCIAL,
] as const;

export const tagSchema = z.enum(allTags);
export const tagsSchema = z.array(tagSchema);

export type Tag = z.infer<typeof tagSchema>;
