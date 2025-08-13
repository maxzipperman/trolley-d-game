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

        <div className="mt-8 max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Streak {streak.current}</span>
            <span>Best {streak.best}</span>
          </div>
          <Progress value={streak.best ? streak.current / streak.best : 0} />
        </div>
      </div>
    </main>
  );
};

export default Index;
