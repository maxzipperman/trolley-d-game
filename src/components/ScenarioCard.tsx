import React, { useMemo, useState } from "react";
import type { Scenario } from "@/types";
import { usePersonas } from "@/hooks/usePersonas";
import { useDecisions } from "@/hooks/useDecisions";
import NPCAvatar from "./NPCAvatar";
import TrolleyDiagram from "./TrolleyDiagram";
import InlineError from "./InlineError";

interface ScenarioCardProps {
  scenario: Scenario;
  onPick: (choice: "A" | "B") => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onPick }) => {
  const [showNPC, setShowNPC] = useState(false);
  const { personas, error: personasError, retry: retryPersonas } = usePersonas();
  const { decisions, error: decisionsError, retry: retryDecisions } = useDecisions();
  const [picked, setPicked] = useState<"A" | "B" | null>(null);

  // Find responses for this scenario from the decisions data
  const scenarioResponses = useMemo(() => {
    const scenarioData = decisions?.find(d => d.id === scenario.id);
    return scenarioData?.responses ?? [];
  }, [decisions, scenario.id]);

  const handlePick = (choice: "A" | "B") => {
    setPicked(choice);
    onPick(choice);
    
    // Update alignment counts using responses from useDecisions
    const aligned = scenarioResponses
      .filter((r) => r.choice === choice)
      .map((r) => r.avatar);
      
    if (typeof window !== "undefined") {
      let counts: Record<string, number> = {};
      try {
        counts = JSON.parse(
          window.localStorage.getItem("alignmentCounts") ?? "{}"
        );
      } catch {
        counts = {};
      }
      aligned.forEach((name) => {
        counts[name] = (counts[name] || 0) + 1;
      });
      window.localStorage.setItem("alignmentCounts", JSON.stringify(counts));
    }
  };

  const alignedPersonas = useMemo(() => {
    if (!picked) return [];
    const alignedNames = scenarioResponses
      .filter((r) => r.choice === picked)
      .map((r) => r.avatar);
    return (personas ?? []).filter((p) => alignedNames.includes(p.name));
  }, [picked, scenarioResponses, personas]);

  const samples = useMemo(() => {
    // Use responses from useDecisions instead of embedded responses
    const fromScenario = [...scenarioResponses].sort(() => Math.random() - 0.5).slice(0, 3);
    if (fromScenario.length > 0) return fromScenario;
    
    // Fallback to random personas if no scenario responses available
    const p = personas ?? [];
    if (p.length === 0) return [];
    const pickedPersonas = [...p].sort(() => Math.random() - 0.5).slice(0, 3);
    return pickedPersonas.map((per) => ({
      avatar: per.name,
      choice: Math.random() < 0.5 ? "A" : "B" as const,
      rationale:
        per.example_lines?.[
          Math.floor(Math.random() * (per.example_lines?.length ?? 0))
        ],
    }));
  }, [scenarioResponses, personas]);

  const error = personasError || decisionsError;
  const retry = () => {
    retryPersonas();
    retryDecisions();
  };

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
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          className="group w-full py-4 px-4 rounded-lg border border-border bg-card hover:bg-[hsl(var(--choice-hover))] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring text-left transform hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handlePick("A")}
          aria-label="Choose Track A"
        >
          <div className="font-semibold mb-2 text-primary group-hover:text-primary/90">Track A</div>
          <div className="text-sm text-muted-foreground group-hover:text-foreground/80">{scenario.track_a}</div>
        </button>
        <button
          className="group w-full py-4 px-4 rounded-lg border border-border bg-card hover:bg-[hsl(var(--choice-hover))] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring text-left transform hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handlePick("B")}
          aria-label="Choose Track B"
        >
          <div className="font-semibold mb-2 text-primary group-hover:text-primary/90">Track B</div>
          <div className="text-sm text-muted-foreground group-hover:text-foreground/80">{scenario.track_b}</div>
        </button>
      </div>
      
      {picked && alignedPersonas.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Philosophers aligned with you</h3>
          <div className="flex flex-wrap gap-4">
            {alignedPersonas.map((p) => (
              <div className="flex items-center gap-2" key={p.name}>
                <NPCAvatar name={p.name} size="sm" />
                <span className="text-sm">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
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
            <div className="mt-4 space-y-3 animate-fade-in">
              {samples.map((r, i) => (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-[hsl(var(--npc-bg))] border border-border/50" key={i}>
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
