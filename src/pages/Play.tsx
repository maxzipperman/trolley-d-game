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
  useEffect(() => { document.title = "Trolley’d · Play"; }, []);
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { pick("A"); }
      if (e.key === "ArrowRight") { pick("B"); }
      if (e.key.toLowerCase() === "s") { skip(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (loading || !scenarios) {
    return (
      <main className="min-h-screen container py-10">
        <div className="h-2 w-full bg-muted rounded-md overflow-hidden">
          <div className="h-full w-1/3 bg-foreground/60 animate-pulse" />
        </div>
      </main>
    );
  }

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

  const total = scenarios.length;
  if (total === 0) {
    return (
      <main className="min-h-screen container max-w-2xl py-8">
        <p className="text-muted-foreground">No scenarios available. Please add data/scenarios.json.</p>
      </main>
    );
  }
  const s = scenarios[index] as Scenario;
  const progress = (index + 1) / total;
  const skipped = scenarios.filter(sc => answers[sc.id] === "skip").length;
  const remaining = scenarios.filter(sc => answers[sc.id] == null).length;
  const firstSkipped = scenarios.find(sc => answers[sc.id] === "skip");
  const progressAnnouncement = `Question ${index + 1} of ${total}. ${remaining} remaining. ${skipped} skipped.`;

  function advance() {
    // next unanswered or end
    const nextIdx = scenarios.findIndex((sc, i) => i > index && answers[sc.id] == null);
    if (nextIdx >= 0) {
      navigate(`/play?jump=${scenarios[nextIdx].id}`);
    } else if (index + 1 < total) {
      navigate(`/play?jump=${scenarios[index + 1].id}`);
    } else {
      navigate("/results");
    }
  }

  function pick(choice: "A" | "B") {
    if (!s) return;
    setAnswers({ ...answers, [s.id]: choice });
    advance();
  }

  function skip() {
    if (!s) return;
    setAnswers({ ...answers, [s.id]: "skip" });
    advance();
  }

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
            End & See Results
          </button>
        </div>
        <div className="space-y-2">
          <div className="h-2 animate-scale-in">
            <Progress value={progress * 100} />
          </div>
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
