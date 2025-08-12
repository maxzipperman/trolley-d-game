import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Progress from "@/components/Progress";
import ScenarioCard from "@/components/ScenarioCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import type { Choice, Scenario } from "@/utils/scoring";

const ANSWERS_KEY = "trolleyd-answers";

const Play = () => {
  useEffect(() => { document.title = "Trolley’d · Play"; }, []);
  const navigate = useNavigate();
  const { scenarios, loading } = useScenarios();
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

  return (
    <main className="min-h-screen container max-w-2xl py-8 space-y-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Q {index + 1} of {total}</span>
          <button onClick={() => navigate("/results")} className="underline underline-offset-4">End & See Results</button>
        </div>
        <Progress value={progress} />
      </section>

      {s && (
        <ScenarioCard scenario={s} onPick={pick} />
      )}

      <div className="flex items-center justify-between pt-2">
        <button onClick={skip} className="text-sm underline underline-offset-4">Skip</button>
        <div className="text-xs text-muted-foreground">Shortcuts: ← A · → B · S Skip</div>
      </div>
    </main>
  );
};

export default Play;
