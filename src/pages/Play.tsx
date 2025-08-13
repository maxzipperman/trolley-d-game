import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useScenarios } from "@/hooks/useScenarios";
import { useAnswers } from "@/hooks/useAnswers";
import ScenarioCard from "@/components/ScenarioCard";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { submitChoice, fetchScenarioStats } from "@/lib/api";

const Play = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jump = searchParams.get("jump");

  const { scenarios, loading } = useScenarios();
  const { answers, setAnswers } = useAnswers();

  const [progressAnnouncement, setProgressAnnouncement] = useState("");

  useEffect(() => {
    document.title = "Trolley'd · Play";
  }, []);

  const total = scenarios?.length || 0;
  const answered = Object.keys(answers).length;
  const progress = total > 0 ? answered / total : 0;

  // Current scenario logic
  const currentIndex = useMemo(() => {
    if (!scenarios?.length) return 0;

    if (jump) {
      const jumpIndex = scenarios.findIndex(s => s.id === jump);
      return jumpIndex >= 0 ? jumpIndex : 0;
    }

    // Find first unanswered scenario
    const unanswered = scenarios.find(s => !(s.id in answers));
    if (unanswered) {
      return scenarios.findIndex(s => s.id === unanswered.id);
    }

    // All answered, go to results
    return scenarios.length - 1;
  }, [scenarios, jump, answers]);

  const s = scenarios?.[currentIndex];
  const index = currentIndex;

  // Skipped scenarios for review
  const skippedScenarios = useMemo(() => {
    if (!scenarios) return [];
    return scenarios.filter(scenario => answers[scenario.id] === "skip");
  }, [scenarios, answers]);

  const firstSkipped = skippedScenarios[0];

  // Progress announcement for screen readers
  useEffect(() => {
    if (total > 0) {
      const announcement = `Question ${index + 1} of ${total}. ${Math.round(progress * 100)}% complete.`;
      setProgressAnnouncement(announcement);
    }
  }, [index, total, progress]);

  // Auto-redirect to results if all scenarios are complete and none are skipped
  useEffect(() => {
    if (scenarios && total > 0 && answered === total && skippedScenarios.length === 0) {
      navigate("/results");
    }
  }, [scenarios, total, answered, skippedScenarios.length, navigate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "s" && e.target === document.body) {
      e.preventDefault();
      skip();
    }
    if (e.key === "ArrowLeft") {
      pick("A");
    }
    if (e.key === "ArrowRight") {
      pick("B");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading || !scenarios) {
    return (
      <main className="min-h-screen container py-10">
        <div className="animate-pulse">Loading scenarios...</div>
      </main>
    );
  }

  if (total === 0) {
    return (
      <main className="min-h-screen container max-w-2xl py-8">
        <p className="text-muted-foreground">No scenarios available. Please add data/scenarios.json.</p>
      </main>
    );
  }

  const pick = (choice: "A" | "B") => {
    if (!s) return;
    setAnswers({ ...answers, [s.id]: choice });

    // Auto-advance to next scenario or results
    if (index < total - 1) {
      const nextId = scenarios[index + 1].id;
      navigate(`/play?jump=${nextId}`);
    } else {
      navigate("/results");
    }
  };

  const skip = () => {
    if (!s) return;
    setAnswers({ ...answers, [s.id]: "skip" });

    // Auto-advance to next scenario or results
    if (index < total - 1) {
      const nextId = scenarios[index + 1].id;
      navigate(`/play?jump=${nextId}`);
    } else {
      navigate("/results");
    }
  };

  function reviewSkipped() {
    if (!firstSkipped) return;
    navigate(`/play?jump=${firstSkipped.id}`);
  }

  return (
    <main className="min-h-screen container max-w-2xl py-8 space-y-6">
      <div aria-live="polite" className="sr-only" data-testid="progress-announcer">
        {progressAnnouncement}
      </div>

      <section className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div
            className="text-sm text-muted-foreground font-medium"
            aria-live="polite"
          >
            Question {index + 1} of {total}
          </div>
          <button
            onClick={() => navigate("/results")}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            View Progress
          </button>
        </div>

        <div className="space-y-2">
          <div className="h-2 animate-scale-in">
            <Progress value={progress * 100} />
          </div>
          <div
            className="flex justify-between text-xs text-muted-foreground"
            aria-live="polite"
          >
            <span>Start</span>
            <span>{Math.round(progress * 100)}% Complete</span>
            <span>Finish</span>
          </div>
        </div>
      </section>

      {s && (
        <ScenarioCard
          scenario={s}
          onPick={pick}
          choice={null}
          stats={null}
          onNext={() => {}}
        />
      )}

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={skip}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
          aria-keyshortcuts="s"
        >
          Skip this scenario
        </button>

        {skippedScenarios.length > 0 && (
          <button
            onClick={reviewSkipped}
            className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            Review {skippedScenarios.length} skipped
          </button>
        )}
      </div>
    </main>
  );
};

export default Play;