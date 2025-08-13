import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxisVisualization from "@/components/AxisVisualization";
import TrolleyDiagram from "@/components/TrolleyDiagram";
import InlineError from "@/components/InlineError";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import { Choice, computeAxes_legacy, computeBaseCounts } from "@/utils/scoring";
import { fetchOverallStats, type ScenarioStats } from "@/lib/api";
import { results_viewed } from "@/utils/analytics";

const ANSWERS_KEY = "trolleyd-answers";

const Results = () => {
  useEffect(() => {
    document.title = "Trolley'd · Results";
    results_viewed();
  }, []);

  const navigate = useNavigate();
  const { scenarios, error, loading, retry } = useScenarios();
  const [answers, setAnswers] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});
  
  const { scoreA, scoreB } = useMemo(() => computeBaseCounts(answers), [answers]);
  const axes = useMemo(() => computeAxes_legacy(scenarios ?? [], answers), [scenarios, answers]);
  const [overallStats, setOverallStats] = useState<ScenarioStats | null>(null);

  useEffect(() => {
    fetchOverallStats()
      .then(setOverallStats)
      .catch(() => {});
  }, []);

  if (error) {
    return (
      <main className="min-h-screen container py-10">
        <InlineError message={error} onRetry={retry} />
      </main>
    );
  }

  if (loading || !scenarios) return (
    <main className="min-h-screen container py-10" />
  );

  return (
    <main className="min-h-screen container max-w-3xl py-8 space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Your Results</h1>
        <p className="text-muted-foreground">
          Based on your responses to {Object.keys(answers).length} scenarios
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Choice Distribution</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Choice A: {scoreA}</span>
              <span>
                {scoreA + scoreB > 0 ? Math.round((scoreA / (scoreA + scoreB)) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Choice B: {scoreB}</span>
              <span>
                {scoreA + scoreB > 0 ? Math.round((scoreB / (scoreA + scoreB)) * 100) : 0}%
              </span>
            </div>
            {overallStats && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Global Average</span>
                <span>
                  A {Math.round(overallStats.percentA)}% · B {Math.round(overallStats.percentB)}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Ethical Profile</h2>
          <div className="space-y-4">
            <AxisVisualization
              label="Order vs Chaos"
              value={axes.orderChaos}
              leftLabel="Order"
              rightLabel="Chaos"
            />
            <AxisVisualization
              label="Material vs Social"
              value={axes.materialSocial}
              leftLabel="Material"
              rightLabel="Social"
            />
            <AxisVisualization
              label="Mercy vs Mischief"
              value={axes.mercyMischief}
              leftLabel="Mercy"
              rightLabel="Mischief"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Visual Breakdown</h2>
        <TrolleyDiagram />
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground font-medium rounded-md px-6 py-2 hover:bg-primary/90 transition-colors"
          >
            Start Over
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Results;