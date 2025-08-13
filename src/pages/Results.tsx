import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxisVisualization from "@/components/AxisVisualization";
import TrolleyDiagram from "@/components/TrolleyDiagram";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import { fetchOverallStats } from "@/lib/api";
import { Choice, computeAxes_legacy as computeAxes, computeBaseCounts } from "@/utils/scoring";

const ANSWERS_KEY = "trolleyd-answers";

const Results = () => {
  useEffect(() => { document.title = "Trolley'd · Results"; }, []);
  const navigate = useNavigate();
  const { scenarios } = useScenarios();
  
  const [answers, setAnswers, { recordHistory }] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});
  const [global, setGlobal] = useState<{ percentA: number; percentB: number } | null>(null);

  const { scoreA, scoreB } = useMemo(() => computeBaseCounts(answers), [answers]);
  const axes = useMemo(() => computeAxes(scenarios ?? [], answers), [scenarios, answers]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      recordHistory(answers);
    }
  }, [answers, recordHistory]);

  useEffect(() => {
    fetchOverallStats()
      .then(setGlobal)
      .catch(() => setGlobal(null));
  }, []);

  const totalAnswers = scoreA + scoreB;
  const percentA = totalAnswers ? Math.round((scoreA / totalAnswers) * 100) : 0;
  const percentB = totalAnswers ? 100 - percentA : 0;

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
          <h2 className="text-xl font-semibold mb-4">Personal Score</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Track A choices</span>
              <span className="font-mono">{scoreA} ({percentA}%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Track B choices</span>
              <span className="font-mono">{scoreB} ({percentB}%)</span>
            </div>
          </div>
        </article>

        {global && (
          <article className="p-6 rounded-lg border border-border bg-card animate-scale-in">
            <h2 className="text-xl font-semibold mb-4">Global Stats</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Track A (global)</span>
                <span className="font-mono">{global.percentA}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Track B (global)</span>
                <span className="font-mono">{global.percentB}%</span>
              </div>
            </div>
          </article>
        )}
      </section>

      {axes && (
        <section className="animate-fade-in">
          <AxisVisualization axes={axes} />
        </section>
      )}

      <footer className="flex gap-4 justify-center">
        <button
          onClick={() => {
            setAnswers({});
            navigate("/");
          }}
          className="px-6 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Play Again
        </button>
        <Link
          to="/history"
          className="px-6 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring inline-flex items-center"
        >
          View History
        </Link>
      </footer>
    </main>
  );
};

export default Results;