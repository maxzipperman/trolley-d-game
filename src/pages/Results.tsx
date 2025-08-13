import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxisVisualization from "@/components/AxisVisualization";
import TrolleyDiagram from "@/components/TrolleyDiagram";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import { Choice, computeAxes_legacy as computeAxes, computeBaseCounts } from "@/utils/scoring";

const ANSWERS_KEY = "trolleyd-answers";

const Results = () => {
  useEffect(() => { document.title = "Trolley’d · Results"; }, []);
  const navigate = useNavigate();
  const { scenarios } = useScenarios();
  const [answers, setAnswers, { recordHistory }] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});

  const { scoreA, scoreB } = useMemo(() => computeBaseCounts(answers), [answers]);
  const axes = useMemo(() => computeAxes(scenarios ?? [], answers), [scenarios, answers]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      recordHistory(answers);
    }
  }, [answers, recordHistory]);

  if (!scenarios) return (
    <main className="min-h-screen container py-10" />
  );

  return (
    <main className="min-h-screen container max-w-3xl py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Your Results</h1>
      </header>

      <div className="mb-8 animate-fade-in">
        <TrolleyDiagram 
          trackALabel="Your Journey" 
          trackBLabel="Complete"
          className="opacity-60"
        />
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="p-6 rounded-lg border border-border bg-card animate-scale-in">
          <h2 className="font-semibold mb-2">Your Choices</h2>
          <p className="text-sm text-muted-foreground mb-4">Track A vs Track B selections</p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Track A</div>
              <div className="text-3xl font-bold text-primary mt-1">{scoreA}</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Track B</div>
              <div className="text-3xl font-bold text-secondary-foreground mt-1">{scoreB}</div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/play")}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 font-medium"
            >Play Again</button>
          </div>
        </article>

        <article className="p-6 rounded-lg border border-border bg-card">
          <h2 className="font-semibold mb-4">Your Philosophical Position</h2>
          <div className="space-y-4">
            <AxisVisualization 
              label="Order ↔ Chaos" 
              value={axes.orderChaos}
              leftLabel="Order" 
              rightLabel="Chaos"
            />
            <AxisVisualization 
              label="Material ↔ Social" 
              value={axes.materialSocial}
              leftLabel="Material" 
              rightLabel="Social"
            />
            <AxisVisualization 
              label="Mercy ↔ Mischief" 
              value={axes.mercyMischief}
              leftLabel="Mercy" 
              rightLabel="Mischief"
            />
          </div>
        </article>
      </section>

      <section className="p-4 rounded-lg border border-border bg-card">
        <h2 className="font-semibold mb-3">Your run</h2>
        <ul className="space-y-2">
          {scenarios.map((s) => {
            const pick = answers[s.id] ?? "—";
            return (
              <li key={s.id} className="flex items-center justify-between gap-3 border-b border-border/60 py-2">
                <Link to={`/play?jump=${s.id}`} className="underline underline-offset-4">{s.title}</Link>
                <span className="text-sm text-muted-foreground">{pick}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => { localStorage.removeItem(ANSWERS_KEY); setAnswers({}); navigate("/play"); }}
            className="px-4 py-2 rounded-md border border-border hover:bg-accent"
          >Reset game</button>
          <Link
            to="/history"
            className="px-4 py-2 rounded-md border border-border hover:bg-accent"
          >View History</Link>
        </div>
      </section>
    </main>
  );
};

export default Results;
