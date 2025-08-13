import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrolleyDiagram from "@/components/TrolleyDiagram";

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => { document.title = "Trolley'd — Minimal Game"; }, []);
  
  return (
    <main className="min-h-screen container max-w-2xl py-16">
      <div className="text-center motion-safe:animate-fade-in">
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
        
        <button
          onClick={() => navigate("/play")}
          className="px-8 py-4 rounded-lg border border-border bg-card hover:bg-accent motion-safe:transition-all motion-safe:duration-200 focus:outline-none focus:ring-2 focus:ring-ring motion-safe:transform motion-safe:hover:scale-105 motion-safe:active:scale-95 font-medium text-lg"
          aria-label="Start playing Trolley'd"
        >
          Begin Your Journey
        </button>
      </div>
    </main>
  );
};

export default Index;