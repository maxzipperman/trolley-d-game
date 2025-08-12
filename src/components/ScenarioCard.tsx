import React, { useMemo, useState } from "react";
import type { Scenario } from "@/types";
import { usePersonas } from "@/hooks/usePersonas";

interface ScenarioCardProps {
  scenario: Scenario;
  onPick: (choice: "A" | "B") => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onPick }) => {
  const [showNPC, setShowNPC] = useState(false);
  const { personas } = usePersonas();

  const samples = useMemo(() => {
    const r = scenario.responses ?? [];
    const fromScenario = [...r].sort(() => Math.random() - 0.5).slice(0, 3);
    if (fromScenario.length > 0) return fromScenario;

    const p = personas ?? [];
    if (p.length === 0) return [];
    const picked = [...p].sort(() => Math.random() - 0.5).slice(0, 3);
    return picked.map((per) => ({
      name: per.name,
      choice: Math.random() < 0.5 ? "A" : "B",
      rationale:
        per.example_lines?.[
          Math.floor(Math.random() * (per.example_lines?.length ?? 0))
        ],
    }));
  }, [scenario, personas]);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          className="w-full py-4 px-4 rounded-md border border-border bg-card hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-ring text-left"
          onClick={() => onPick("A")}
          aria-label="Choose Track A"
        >
          <div className="font-semibold mb-1">Track A</div>
          <div className="text-sm text-muted-foreground">{scenario.track_a}</div>
        </button>
        <button
          className="w-full py-4 px-4 rounded-md border border-border bg-card hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-ring text-left"
          onClick={() => onPick("B")}
          aria-label="Choose Track B"
        >
          <div className="font-semibold mb-1">Track B</div>
          <div className="text-sm text-muted-foreground">{scenario.track_b}</div>
        </button>
      </div>

      {samples.length > 0 && (
        <div className="pt-2">
          <button
            className="text-sm underline underline-offset-4 text-foreground/80 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
            onClick={() => setShowNPC(v => !v)}
            aria-expanded={showNPC}
          >
            {showNPC ? "Hide" : "See"} sample NPC takes
          </button>
          {showNPC && (
            <ul className="mt-3 space-y-2">
              {samples.map((r, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-md border border-border">
                  <div className="h-8 w-8 rounded-full bg-muted grid place-items-center text-sm font-semibold select-none">
                    {(r.avatar?.[0] ?? "N").toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{r.avatar ?? "NPC"} · chose {r.choice ?? "?"}</div>
                    {r.rationale && (
                      <p className="text-sm text-muted-foreground">{r.rationale}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
};

export default ScenarioCard;
