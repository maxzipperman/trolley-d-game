import React, { useEffect, useMemo, useState } from "react";
import type { Scenario } from "@/types";
import { usePersonas } from "@/hooks/usePersonas";
import { useDecisions } from "@/hooks/useDecisions";
import NPCAvatar from "./NPCAvatar";
import TrolleyDiagram from "./TrolleyDiagram";
import InlineError from "./InlineError";

interface ScenarioCardProps {
  scenario: Scenario;
  onPick: (choice: "A" | "B") => void;
  onNext: () => void;
  choice: "A" | "B" | null;
  stats: { A: number; B: number } | null;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onPick, onNext, choice, stats }) => {
  const [showNPC, setShowNPC] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rationale, setRationale] = useState("");
  const { personas, error: personasError } = usePersonas();
  const { decisions, error: decisionsError, retry: retryDecisions } = useDecisions();
  const [picked, setPicked] = useState<"A" | "B" | null>(null);

  const scenarioResponses = decisions?.filter(d => d.scenarioId === scenario.id) ?? [];

  const handlePick = (choice: "A" | "B") => {
    setPicked(choice);
    
    // Save choice with rationale to localStorage
    const choiceWithRationale = {
      choice,
      rationale: rationale.trim() || undefined
    };
    
    const existingChoices = JSON.parse(localStorage.getItem('userChoices') || '{}');
    existingChoices[scenario.id] = choiceWithRationale;
    localStorage.setItem('userChoices', JSON.stringify(existingChoices));
    
    onPick(choice);

    const aligned = scenarioResponses
      .filter((r) => r.choice === choice)
      .map((r) => r.persona);

    if (typeof window !== "undefined") {
      let counts: Record<string, number> = {};
      try {
        counts = JSON.parse(window.localStorage.getItem("alignmentCounts") ?? "{}");
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
      .map((r) => r.persona)
      .filter(Boolean);
    return personas?.filter((p) => alignedNames.includes(p.name)) ?? [];
  }, [picked, scenarioResponses, personas]);

  const samples = useMemo(() => {
    const shuffled = [...scenarioResponses].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [scenarioResponses]);

  const share = () => {
    const url = `${window.location.origin}/scenario/${scenario.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (personasError || decisionsError) {
    return (
      <div className="p-6 border rounded-lg bg-card">
        <InlineError
          message={personasError || decisionsError || "Unknown error"}
          onRetry={retryDecisions}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 border rounded-lg bg-card space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{scenario.title}</h2>
        <p className="text-muted-foreground leading-relaxed">{scenario.description}</p>
      </div>

      <TrolleyDiagram scenario={scenario} />

      {!choice ? (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium">Your rationale (optional):</label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Explain your reasoning..."
              className="w-full p-3 border rounded-lg bg-background resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handlePick("A")}
              className="p-4 text-left border rounded-lg hover:bg-accent transition-all duration-200 space-y-2"
            >
              <div className="font-semibold text-primary">Track A</div>
              <div className="text-sm text-muted-foreground">{scenario.trackA.description}</div>
              <div className="text-xs text-muted-foreground">
                Casualties: {scenario.trackA.casualties}
              </div>
            </button>
            <button
              onClick={() => handlePick("B")}
              className="p-4 text-left border rounded-lg hover:bg-accent transition-all duration-200 space-y-2"
            >
              <div className="font-semibold text-primary">Track B</div>
              <div className="text-sm text-muted-foreground">{scenario.trackB.description}</div>
              <div className="text-xs text-muted-foreground">
                Casualties: {scenario.trackB.casualties}
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center p-4 border rounded-lg bg-accent/50">
            <p className="font-semibold">
              You chose Track {choice}: {choice === "A" ? scenario.trackA.description : scenario.trackB.description}
            </p>
          </div>

          {showNPC && alignedPersonas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">
                Personas who made the same choice:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {alignedPersonas.map((persona) => (
                  <div key={persona.name} className="p-4 border rounded-lg bg-accent/30 space-y-2">
                    <div className="flex items-center gap-3">
                      <NPCAvatar name={persona.name} size="sm" />
                      <div className="font-medium text-sm">{persona.name}</div>
                    </div>
                    {persona.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {persona.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => setShowNPC(!showNPC)}
              className="text-primary hover:underline text-sm font-medium"
            >
              {showNPC ? "Hide" : "Show"} aligned personas
            </button>
          </div>

          {samples.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Sample responses:</h3>
              <div className="space-y-3 animate-fade-in">
                {samples.map((r, i) => (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-[hsl(var(--npc-bg))] border border-border/50" key={i}>
                    <NPCAvatar
                      name={r.persona ?? "NPC"}
                      size="md"
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">{r.persona ?? "NPC"}</span>
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
            </div>
          )}

          <div className="space-y-4">
            {stats && (
              <p className="text-sm text-muted-foreground text-center">
                {stats.A}% chose Track A · {stats.B}% chose Track B
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={share}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 font-medium"
              >
                Share
              </button>
              <button
                onClick={onNext}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 font-medium"
              >
                Next
              </button>
            </div>
            {copied && (
              <p className="text-xs text-muted-foreground text-center">Link copied!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioCard;