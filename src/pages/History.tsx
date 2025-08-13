import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import { computeAxes_legacy as computeAxes, computeBaseCounts, Choice } from "@/utils/scoring";

const ANSWERS_KEY = "trolleyd-answers";

const History = () => {
  useEffect(() => { document.title = "Trolley’d · History"; }, []);
  const navigate = useNavigate();
  const { scenarios } = useScenarios();
  const [, setAnswers, { history }] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});

  if (!history.length) {
    return (
      <main className="min-h-screen container max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-4">History</h1>
        <p className="text-muted-foreground">No completed runs yet.</p>
      </main>
    );
  }

  const runs = [...history].reverse();

  return (
    <main className="min-h-screen container max-w-3xl py-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">History</h1>
      </header>
      <ul className="space-y-4">
        {runs.map((run) => {
          const { scoreA, scoreB } = computeBaseCounts(run.value);
          const axes = computeAxes(scenarios ?? [], run.value);
          const date = new Date(run.timestamp).toLocaleString();
          return (
            <li key={run.timestamp} className="p-4 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{date}</div>
                <button
                  onClick={() => { setAnswers(run.value); navigate("/play"); }}
                  className="text-sm underline underline-offset-4"
                >Replay</button>
              </div>
              <div className="text-sm text-muted-foreground">A: {scoreA} · B: {scoreB}</div>
              <div className="text-xs text-muted-foreground">
                Order-Chaos: {axes.orderChaos} · Material-Social: {axes.materialSocial} · Mercy-Mischief: {axes.mercyMischief}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default History;
