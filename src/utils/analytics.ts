export function scenario_shown(id: string) {
  if (import.meta.env.DEV) return;
  // TODO: integrate with Supabase or external persistence to record when a scenario is viewed
}

export function choice_made(id: string, choice: string) {
  if (import.meta.env.DEV) return;
  // TODO: integrate with Supabase or external persistence to record a player's choice
}

export function results_viewed() {
  if (import.meta.env.DEV) return;
  // TODO: integrate with Supabase or external persistence to record when results are viewed
}
