import React, { useMemo, useState } from "react";
import type { Scenario } from "@/types";
import { usePersonas } from "@/hooks/usePersonas";
import NPCAvatar from "./NPCAvatar";
import TrolleyDiagram from "./TrolleyDiagram";

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
      avatar: per.name,
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

      {/* Trolley Diagram */}
      <div className="py-4">
        <TrolleyDiagram
          trackALabel="A"
          trackBLabel="B"
          className="motion-safe:animate-fade-in"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          className="group w-full py-4 px-4 rounded-lg border border-border bg-card hover:bg-[hsl(var(--choice-hover))] motion-safe:transition-all motion-safe:duration-200 focus:outline-none focus:ring-2 focus:ring-ring text-left motion-safe:transform motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
          onClick={() => onPick("A")}
          aria-label="Choose Track A"
        >
          <div className="font-semibold mb-2 text-primary group-hover:text-primary/90">Track A</div>
          <div className="text-sm text-muted-foreground group-hover:text-foreground/80">{scenario.track_a}</div>
        </button>
        <button
          className="group w-full py-4 px-4 rounded-lg border border-border bg-card hover:bg-[hsl(var(--choice-hover))] motion-safe:transition-all motion-safe:duration-200 focus:outline-none focus:ring-2 focus:ring-ring text-left motion-safe:transform motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
          onClick={() => onPick("B")}
          aria-label="Choose Track B"
        >
          <div className="font-semibold mb-2 text-primary group-hover:text-primary/90">Track B</div>
          <div className="text-sm text-muted-foreground group-hover:text-foreground/80">{scenario.track_b}</div>
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
            <div className="mt-4 space-y-3 motion-safe:animate-fade-in">
              {samples.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-[hsl(var(--npc-bg))] border border-border/50">
                  <NPCAvatar 
                    name={r.avatar ?? "NPC"} 
                    size="md"
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium truncate">{r.avatar ?? "NPC"}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        r.choice === "A" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-secondary/50 text-secondary-foreground"
                      }`}>
                        Track {r.choice ?? "?"}
                      </span>
                    </div>
                    {r.rationale && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.rationale}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default ScenarioCard;
