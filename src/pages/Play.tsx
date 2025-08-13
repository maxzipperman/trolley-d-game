import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Progress from "@/components/Progress";
import ScenarioCard from "@/components/ScenarioCard";
import InlineError from "@/components/InlineError";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import type { Scenario } from "@/types";
import type { Choice } from "@/utils/scoring";
import { scenario_shown, choice_made } from "@/utils/analytics";

const ANSWERS_KEY = "trolleyd-answers";

const Play = () => {
  useEffect(() => { document.title = "Trolley'd · Play"; }, []);
  const navigate = useNavigate();
  const { scenarios, loading, error, retry } = useScenarios();
  const [answers, setAnswers] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});
  const [params] = useSearchParams();

  const index = useMemo(() => {
    if (!scenarios) return 0;
    const jump = params.get("jump");
    if (jump) {
      const i = scenarios.findIndex(s => s.id === jump);
      return i >= 0 ? i : 0;
    }
    // find first unanswered
    const i = scenarios.findIndex(s => answers[s.id] == null);
    return i >= 0 ? i : 0;
  }, [scenarios, params, answers]);

  const total = scenarios?.length ?? 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        onPick("A");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        onPick("B");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const s = scenarios?.[index] as Scenario | undefined;
  const progress = total ? (index + 1) / total : 0;

  useEffect(() => {
    if (s) scenario_shown(s.id);
  }, [s]);

  if (error) {
    return (
      <main className="min-h-screen container py-10">
        <InlineError message={error} onRetry={retry} />
      </main>
    );
  }

  if (loading || !scenarios) {
    return (
      <main className="min-h-screen container py-10">
        <div className="animate-pulse">Loading scenarios...</div>
      </main>
    );
  }

  if (total === 0) {
    return (
      <main className="min-h-screen container max-w-2xl py-8">
        <p className="text-muted-foreground">No scenarios available. Please add data/scenarios.json.</p>
      </main>
    );
  }

  const current = scenarios[index];
  const hasAnswered = answers[current.id] != null;
  const progressCount = Object.keys(answers).length;
  const isLast = index === total - 1;

  const onPick = (choice: Choice) => {
    setAnswers({ ...answers, [current.id]: choice });
    choice_made(current.id, choice);
    if (isLast) {
      navigate("/results");
    } else {
      // auto-advance
      const nextIndex = index + 1;
      if (nextIndex < total) {
        const nextId = scenarios[nextIndex].id;
        navigate(`/play?jump=${nextId}`);
      }
    }
  };

  return (
    <main className="min-h-screen container max-w-2xl py-8">
      <div className="space-y-8">
        <Progress current={progressCount} total={total} />
        <ScenarioCard scenario={current} onPick={onPick} />

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => {
              if (index > 0) {
                const prevId = scenarios[index - 1].id;
                navigate(`/play?jump=${prevId}`);
              }
            }}
            disabled={index === 0}
            className="px-4 py-2 text-sm border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex gap-4">
            <button
              onClick={() => onPick("A")}
              className={`px-6 py-2 rounded font-medium ${
                hasAnswered && answers[current.id] === "A"
                  ? "bg-primary text-primary-foreground"
                  : "border border-input hover:bg-accent"
              }`}
            >
              Choice A
            </button>
            <button
              onClick={() => onPick("B")}
              className={`px-6 py-2 rounded font-medium ${
                hasAnswered && answers[current.id] === "B"
                  ? "bg-primary text-primary-foreground"
                  : "border border-input hover:bg-accent"
              }`}
            >
              Choice B
            </button>
          </div>

          <button
            onClick={() => {
              if (index < total - 1) {
                const nextId = scenarios[index + 1].id;
                navigate(`/play?jump=${nextId}`);
              } else {
                navigate("/results");
              }
            }}
            className="px-4 py-2 text-sm border rounded"
          >
            {isLast ? "View Results" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Play;