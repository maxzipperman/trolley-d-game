import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => { document.title = "Trolley’d — Minimal Game"; }, []);
  return (
    <main className="min-h-screen container max-w-2xl py-16">
      <h1 className="text-4xl font-bold mb-4">Trolley’d</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A tiny, monochrome thought‑experiment game. Pick Track A or B through a series of scenarios and see where your compass points.
      </p>
      <button
        onClick={() => navigate("/play")}
        className="px-6 py-3 rounded-md border border-border bg-card hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Play"
      >
        Play
      </button>
    </main>
  );
};

export default Index;
