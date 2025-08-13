/* eslint-env node */
import { readFileSync } from "fs";

const scoringSource = readFileSync("src/utils/scoring.ts", "utf8");
const tagRegex = /new Set\(\[([^\]]*)\]\)/g;
const canonicalTags = new Set<string>();
let match: RegExpExecArray | null;
while ((match = tagRegex.exec(scoringSource)) !== null) {
  const entries = match[1].split(",");
  for (const e of entries) {
    const tag = e.trim().replace(/['"`]/g, "");
    if (tag) canonicalTags.add(tag);
  }
}

const scenarios = JSON.parse(readFileSync("data/scenarios.json", "utf8"));
const usedTags = new Set<string>();
for (const scenario of scenarios) {
  const num = parseInt(String(scenario.id).replace(/\D/g, ""), 10);
  if (Number.isFinite(num) && num < 6) continue;
  if (Array.isArray(scenario.tags)) {
    for (const t of scenario.tags) usedTags.add(t);
  }
}

const unknown = [...usedTags].filter(t => !canonicalTags.has(t));
if (unknown.length) {
  console.error("Unknown tags:", unknown);
  process.exit(1);
}

console.log("All scenario tags match canonical list.");

