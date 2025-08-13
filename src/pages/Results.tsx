import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxisVisualization from "@/components/AxisVisualization";
import TrolleyDiagram from "@/components/TrolleyDiagram";
import Scorecard from "@/components/Scorecard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import { useScores } from "@/hooks/useScores";
import { useFriends } from "@/hooks/useFriends";
import { Choice, computeAxes_legacy as computeAxes, computeBaseCounts } from "@/utils/scoring";

const ANSWERS_KEY = "trolleyd-answers";
const PLAYER_NAME = "You";

const Results = () => {
  useEffect(() => { document.title = "Trolley’d · Results"; }, []);
  const navigate = useNavigate();
  const { scenarios } = useScenarios();
  const [answers, setAnswers] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});
  const [scores, setScores] = useScores();
  const { importFriend } = useFriends();
  const competitorNames = Object.keys(scores);
  const [active, setActive] = useState(competitorNames[0] ?? "");
  useEffect(() => {
    if (competitorNames.length && !competitorNames.includes(active)) {
      setActive(competitorNames[0]);
    }
  }, [competitorNames, active]);
  const [friendInput, setFriendInput] = useState("");
  useEffect(() => {
    if (!scores[PLAYER_NAME] && Object.keys(answers).length) {
      const { scoreA, scoreB } = computeBaseCounts(answers);
      setScores({ ...scores, [PLAYER_NAME]: { scoreA, scoreB } });
    }
  }, [scores, answers, setScores]);

  const axes = useMemo(() => computeAxes(scenarios ?? [], answers), [scenarios, answers]);

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Scores</h2>
            {competitorNames.length > 1 && (
              <select
                value={active}
                onChange={(e) => setActive(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {competitorNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            )}
          </div>
          {active && scores[active] && (
            <Scorecard
              name={active}
              scoreA={scores[active].scoreA}
              scoreB={scores[active].scoreB}
            />
          )}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/play")}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 font-medium"
            >Play Again</button>
          </div>
          <div className="mt-4">
            <textarea
              value={friendInput}
              onChange={(e) => setFriendInput(e.target.value)}
              placeholder="Paste friend JSON"
              className="w-full p-2 border border-border rounded mb-2 text-sm"
            />
            <button
              onClick={() => { importFriend(friendInput); setFriendInput(""); }}
              className="px-4 py-2 rounded-md border border-border hover:bg-accent text-sm"
            >Import Friend</button>
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
        </div>
      </section>
    </main>
  );
};

export default Results;
