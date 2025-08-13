/**
 * Canonical tag vocabulary for classifying scenarios.
 * Each tag belongs to one of four axes that influence scoring.
 */

// Order axis: structured, rule-bound situations
export const ORDER_TAGS = ["bureaucracy", "standards", "logistics"] as const;
// Chaos axis: absurd or paradoxical situations
export const CHAOS_TAGS = ["absurd", "paradox", "infinite"] as const;
// Material axis: physical or tangible concerns
export const MATERIAL_TAGS = [
  "reality",
  "manufacturing_defects",
  "quality_control",
  "space",
] as const;
// Social axis: identity and societal concerns
export const SOCIAL_TAGS = [
  "identity",
  "meaning",
  "workers_rights",
  "existential",
] as const;

export const CANONICAL_TAGS = [
  ...ORDER_TAGS,
  ...CHAOS_TAGS,
  ...MATERIAL_TAGS,
  ...SOCIAL_TAGS,
] as const;

export type Tag = (typeof CANONICAL_TAGS)[number];

export const ORDER = new Set<Tag>(ORDER_TAGS);
export const CHAOS = new Set<Tag>(CHAOS_TAGS);
export const MATERIAL = new Set<Tag>(MATERIAL_TAGS);
export const SOCIAL = new Set<Tag>(SOCIAL_TAGS);
export const CANONICAL_TAG_SET = new Set<Tag>(CANONICAL_TAGS);

/** Legacy tag mapping to canonical tags */
export const LEGACY_TAG_MAP: Record<string, Tag> = {
  classic: "logistics",
  numbers: "logistics",
  action_vs_inaction: "standards",
  identity: "identity",
  preservation: "meaning",
  modern: "standards",
  age: "identity",
  law: "standards",
  technology: "space",
  medical: "quality_control",
  active_harm: "manufacturing_defects",
  time_travel: "paradox",
  existence: "existential",
  large_numbers: "logistics",
};

/**
 * Convert an arbitrary tag list to canonical tags.
 * Unknown tags trigger a DEV-only console error.
 */
export function toCanonicalTags(tags: string[] = [], id?: string): Tag[] {
  const result: Tag[] = [];
  for (const t of tags) {
    const canonical = CANONICAL_TAG_SET.has(t as Tag)
      ? (t as Tag)
      : LEGACY_TAG_MAP[t];
    if (canonical) {
      result.push(canonical);
    } else if (import.meta.env.DEV && id) {
      console.error(`Invalid tag '${t}' in scenario ${id}`);
    }
  }
  return result;
}
