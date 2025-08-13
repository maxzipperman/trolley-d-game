import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Progress from "@/components/Progress";
import ScenarioCard from "@/components/ScenarioCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import type { Scenario } from "@/types";
import type { Choice } from "@/utils/scoring";

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
        pick("A");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        pick("B");
      } else if (e.key === "s" || e.key === "S") {
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const s = scenarios?.[index] as Scenario | undefined;
  const progress = total ? (index + 1) / total : 0;
  const skipped = scenarios?.filter(sc => answers[sc.id] === "skip").length ?? 0;
  const remaining = scenarios?.filter(sc => answers[sc.id] == null).length ?? 0;
  const firstSkipped = scenarios?.find(sc => answers[sc.id] === "skip");
  const progressAnnouncement = `Question ${index + 1} of ${total}. ${remaining} remaining. ${skipped} skipped.`;

  if (error) {
    return (
      <main className="min-h-screen container max-w-2xl py-8 space-y-4">
        <p className="text-destructive">{error}</p>
        <button
          onClick={retry}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
        >
          Retry
        </button>
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

  const pick = (choice: Choice) => {
    if (!s) return;
    setAnswers({ ...answers, [s.id]: choice });
    
    // Auto-advance to next scenario or results
    if (index < total - 1) {
      const nextId = scenarios[index + 1].id;
      navigate(`/play?jump=${nextId}`);
    } else {
      navigate("/results");
    }
  };

  const skip = () => {
    if (!s) return;
    setAnswers({ ...answers, [s.id]: "skip" });
    
    // Auto-advance to next scenario or results
    if (index < total - 1) {
      const nextId = scenarios[index + 1].id;
      navigate(`/play?jump=${nextId}`);
    } else {
      navigate("/results");
    }
  };

  function reviewSkipped() {
    if (!firstSkipped) return;
    navigate(`/play?jump=${firstSkipped.id}`);
  }

  return (
    <main className="min-h-screen container max-w-2xl py-8 space-y-6">
      <div aria-live="polite" className="sr-only" data-testid="progress-announcer">
        {progressAnnouncement}
      </div>
      <section className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground font-medium">
            Question {index + 1} of {total}
          </div>
          <button
            onClick={() => navigate("/results")}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            View Progress
          </button>
        </div>
        <div className="space-y-2">
          <Progress value={progress * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Start</span>
            <span>{Math.round(progress * 100)}% Complete</span>
            <span>Finish</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Skipped {skipped}</span>
            <span>Remaining {remaining}</span>
          </div>
          {skipped > 0 && (
            <button
              onClick={reviewSkipped}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Review skipped
            </button>
          )}
        </div>
      </section>

      {s && (
        <ScenarioCard scenario={s} onPick={pick} />
      )}

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={skip}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
        >
          Skip this scenario
        </button>
        <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          Shortcuts: ← A · → B · S Skip
        </div>
      </div>
    </main>
  );
};

export default Play;