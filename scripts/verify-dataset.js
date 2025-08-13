import fs from 'node:fs';

const decisions = JSON.parse(fs.readFileSync('data/decisions.json', 'utf-8'));
const scenarios = JSON.parse(fs.readFileSync('data/scenarios.json', 'utf-8'));

const scenarioIds = new Set(scenarios.map(s => s.id));
for (const decision of decisions) {
  if (!scenarioIds.has(decision.scenarioId)) {
    throw new Error(`Missing scenarioId: ${decision.scenarioId}`);
  }
}

console.log('All decisions reference existing scenarios.');
