import React, { useMemo, useState } from "react";
import type { Scenario } from "@/types";
import { usePersonas } from "@/hooks/usePersonas";
import NPCAvatar from "./NPCAvatar";
import TrolleyDiagram from "./TrolleyDiagram";
import InlineError from "./InlineError";

interface ScenarioCardProps {
  scenario: Scenario;
  onPick: (choice: "A" | "B") => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onPick }) => {
  const [showNPC, setShowNPC] = useState(false);
  const { personas, error, retry } = usePersonas();

  const samples = useMemo(() => {
    const r = scenario.responses ?? [];
    const fromScenario = [...r].sort(() => Math.random() - 0.5).slice(0, 3);
    if (fromScenario.length > 0) return fromScenario;

    const p = personas ?? [];
    if (p.length === 0) return [];
    const picked = [...p].sort(() => Math.random() - 0.5).slice(0, 3);
    return picked.map((per) => ({
      avatar: per.name,
      choice: Math.random() < 0.5 ? "A" : "B",
      rationale:
        per.example_lines?.[
          Math.floor(Math.random() * (per.example_lines?.length ?? 0))
        ],
    }));
  }, [scenario.id, personas]);

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold leading-tight">{scenario.title}</h2>
        {scenario.theme && (
          <p className="text-sm uppercase tracking-wide text-muted-foreground">{scenario.theme}</p>
        )}
        {scenario.description && (
          <p className="text-base text-foreground/90">{scenario.description}</p>
        )}
      </header>

      {error && <InlineError message={error} onRetry={retry} />}

      {/* Trolley Diagram */}
      <div className="py-4">
        <TrolleyDiagram
          trackALabel="A"
          trackBLabel="B"
          className="animate-fade-in"
        />