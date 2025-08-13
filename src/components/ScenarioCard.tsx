
import React, { useMemo, useState } from "react";
import type { Scenario } from "@/types";
import { usePersonas } from "@/hooks/usePersonas";
import { useDecisions } from "@/hooks/useDecisions";
import NPCAvatar from "./NPCAvatar";
import InlineError from "./InlineError";
import { Lever } from "./Lever";
import { Slider } from "@/components/ui/slider";

interface ScenarioCardProps {
  scenario: Scenario;
  onPick: (choice: "A" | "B") => void;
  onNext?: () => void;
  choice?: "A" | "B" | null;
  stats?: { A: number; B: number } | null;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onPick, onNext, choice = null, stats = null }) => {
  const [showNPC, setShowNPC] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rationale, setRationale] = useState("");
  const [rating, setRating] = useState<number[]>([3]);
  const { personas, error: personasError } = usePersonas();
  const { decisions, error: decisionsError, retry: retryDecisions } = useDecisions();
  const [picked, setPicked] = useState<"A" | "B" | null>(null);

  const scenarioResponses = decisions?.filter(d => d.scenarioId === scenario.id) ?? [];

  const handlePick = (choicePicked: "A" | "B", rationaleFromLever?: string) => {
    setPicked(choicePicked);
    
    // Save choice with rationale to localStorage
    const choiceWithRationale = {
      choice: choicePicked,
      rationale: rationaleFromLever || rationale.trim() || undefined
    };
    
    const existingChoices = JSON.parse(localStorage.getItem('userChoices') || '{}');
    existingChoices[scenario.id] = choiceWithRationale;
    localStorage.setItem('userChoices', JSON.stringify(existingChoices));
    
    onPick(choicePicked);

    // Map both "A"/"B" and "track_a"/"track_b" formats
    const aligned = scenarioResponses
      .filter((r) => r.choice === choicePicked)
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

      {/* Removed TrolleyDiagram pending prop alignment */}

      {!choice ? (
        <div className="space-y-6">
          <Lever onChoice={handlePick} scenario={scenario} />
        </div>
      ) : (
        <>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">You chose Track {choice}</h3>
            <p className="text-sm text-muted-foreground">
              You aligned with {alignedPersonas.length} persona{alignedPersonas.length !== 1 ? 's' : ''}
            </p>
          </div>

          {alignedPersonas.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-center">Aligned personas:</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {alignedPersonas.map((persona) => (
                  <div key={persona.name} className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    <NPCAvatar
                      name={persona.name}
                      size="sm"
                    />
                    <span>{persona.name}</span>
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
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-[hsl(var(--npc-bg))] border border-border/50">
                      <NPCAvatar
                        name={r.persona ?? "NPC"}
                        size="md"
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium truncate">{r.persona ?? "NPC"}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              r.choice === "A"
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary/50 text-secondary-foreground"
                            }`}
                            aria-live="polite"
                          >
                            Track {r.choice ?? "?"}
                          </span>
                        </div>
                        {r.rationale && (
                          <p
                            className="text-sm text-muted-foreground leading-relaxed"
                            aria-live="polite"
                          >
                            {r.rationale}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            {/* Rating Slider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-center">How much did you like this scenario?</label>
              <div className="px-4">
                <Slider
                  value={rating}
                  onValueChange={(value) => {
                    setRating(value);
                    // Save rating to localStorage
                    const ratings = JSON.parse(localStorage.getItem('scenarioRatings') || '{}');
                    ratings[scenario.id] = value[0];
                    localStorage.setItem('scenarioRatings', JSON.stringify(ratings));
                  }}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 - Boring</span>
                  <span>3 - Okay</span>
                  <span>5 - Fascinating</span>
                </div>
              </div>
            </div>
            
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
                onClick={onNext ?? (() => {})}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 font-medium"
              >
                Next
              </button>
            </div>
            {copied && (
              <p className="text-xs text-muted-foreground text-center">Link copied!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ScenarioCard;
