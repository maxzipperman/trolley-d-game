import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxisBar from "@/components/AxisBar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import { Choice, computeAxes_legacy as computeAxes, computeBaseCounts } from "@/utils/scoring";

const ANSWERS_KEY = "trolleyd-answers";

const Results = () => {
  useEffect(() => { document.title = "Trolley’d · Results"; }, []);
  const navigate = useNavigate();
  const { scenarios } = useScenarios();
  const [answers, setAnswers] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});

  const { scoreA, scoreB } = useMemo(() => computeBaseCounts(answers), [answers]);
  const axes = useMemo(() => computeAxes(scenarios ?? [], answers), [scenarios, answers]);

  if (!scenarios) return (
    <main className="min-h-screen container py-10" />
  );

  return (
    <main className="min-h-screen container max-w-3xl py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Your Results</h1>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <article className="p-4 rounded-lg border border-border bg-card">
          <h2 className="font-semibold mb-2">Your tally</h2>
          <p className="text-sm text-muted-foreground">A vs B</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-md bg-muted">
              <div className="text-xs text-muted-foreground">A</div>
              <div className="text-2xl font-bold">{scoreA}</div>
            </div>
            <div className="p-3 rounded-md bg-muted">
              <div className="text-xs text-muted-foreground">B</div>
              <div className="text-2xl font-bold">{scoreB}</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigate("/play")}
              className="px-4 py-2 rounded-md border border-border hover:bg-accent"
            >Play again</button>
          </div>
        </article>

        <article className="p-4 rounded-lg border border-border bg-card">
          <h2 className="font-semibold mb-3">Your axes</h2>
          <div className="space-y-4">
            <AxisBar label="Order ↔ Chaos" value={axes.orderChaos} />
            <AxisBar label="Material ↔ Social" value={axes.materialSocial} />
            <AxisBar label="Mercy ↔ Mischief" value={axes.mercyMischief} />
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
        </div>
      </section>
    </main>
  );
};

export default Results;
