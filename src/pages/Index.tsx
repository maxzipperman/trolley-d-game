import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Progress from "@/components/Progress";
import TrolleyDiagram from "@/components/TrolleyDiagram";
import { getStreakInfo } from "@/utils/challenge";

const Index = () => {
  const navigate = useNavigate();
  const [streak, setStreak] = useState({ current: 0, best: 0 });

  useEffect(() => {
    document.title = "Trolley'd — Minimal Game";
    setStreak(getStreakInfo());
  }, []);

  return (
    <main className="min-h-screen container max-w-2xl py-16">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">Trolley'd</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          A tiny, monochrome thought‑experiment game. Pick Track A or B through a series of scenarios and see where your compass points.
        </p>

        {/* Hero trolley diagram */}
        <div className="mb-10">
          <TrolleyDiagram 
            trackALabel="Your Choice" 
            trackBLabel="Awaits"
            className="opacity-80"
          />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/avatars")}
            className="px-8 py-4 w-full rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring transform hover:scale-105 active:scale-95 font-medium text-lg"
            aria-label="Select avatar before playing"
          >
            Select Avatar & Play
          </button>

          <button
            onClick={() => navigate("/play")}
            className="px-8 py-4 w-full rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring transform hover:scale-105 active:scale-95 font-medium text-lg"
            aria-label="Start playing Trolley'd"
          >
            Begin Your Journey
          </button>

          <button
            onClick={() => navigate("/play?daily=1")}
            className="px-8 py-4 w-full rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring transform hover:scale-105 active:scale-95 font-medium text-lg"
          >
            Daily Challenge
          </button>
        </div>

        <div className="mt-6 space-x-6">
          <button
            onClick={() => navigate("/settings")}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Settings
          </button>
          <button
            onClick={() => navigate("/history")}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            View History
          </button>
        </div>

        {/* Current streak info */}
        {streak.current > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Current streak: <span className="font-medium">{streak.current}</span>
              {streak.best > streak.current && (
                <span> | Best: {streak.best}</span>
              )}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Index;