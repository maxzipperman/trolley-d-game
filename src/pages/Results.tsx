import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxisVisualization from "@/components/AxisVisualization";
import TrolleyDiagram from "@/components/TrolleyDiagram";
import InlineError from "@/components/InlineError";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import { Choice, computeAxes_legacy as computeAxes, computeBaseCounts } from "@/utils/scoring";

const ANSWERS_KEY = "trolleyd-answers";

const Results = () => {
  useEffect(() => { document.title = "Trolley'd · Results"; }, []);
  const navigate = useNavigate();
  const { scenarios, error, loading, retry } = useScenarios();
  const [answers, setAnswers] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});

  const { scoreA, scoreB } = useMemo(() => computeBaseCounts(answers), [answers]);
  const axes = useMemo(() => computeAxes(scenarios ?? [], answers), [scenarios, answers]);

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
              <span>{scoreA + scoreB > 0 ? Math.round((scoreA / (scoreA + scoreB)) * 100) : 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Choice B: {scoreB}</span>
              <span>{scoreA + scoreB > 0 ? Math.round((scoreB / (scoreA + scoreB)) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Ethical Axes</h2>
          <AxisVisualization axes={axes} />
        </div>
      </div>

      <div className="text-center space-y-4">
        <Link to="/play" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
          Play Again
        </Link>
        <button
          onClick={() => {
            setAnswers({});
            navigate("/play");
          }}
          className="ml-4 px-6 py-2 border rounded hover:bg-accent"
        >
          Reset & Start Over
        </button>
      </div>
    </main>
  );
};

export default Results;