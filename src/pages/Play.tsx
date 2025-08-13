import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScenarios } from "@/hooks/useScenarios";
import { useAnswers } from "@/hooks/useAnswers";
import ScenarioCard from "@/components/ScenarioCard";
import Progress from "@/components/Progress";
import { usePersonalityProfile } from "@/hooks/usePersonalityProfile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Play = () => {
  const navigate = useNavigate();
  const { scenarios, loading, generateMore } = useScenarios();
  const { answers, setAnswers } = useAnswers();
  const [progressAnnouncement, setProgressAnnouncement] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const personalityProfile = usePersonalityProfile(scenarios || []);

  const answered = Object.values(answers).filter(a => a !== "skip").length;
  const total = scenarios?.length ?? 0;
  const progress = total > 0 ? answered / total : 0;

  // Get jump parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const jump = urlParams.get("jump");

  const currentIndex = useMemo(() => {
    if (!scenarios) return 0;

    // Handle jump to specific scenario
    if (jump) {
      const jumpIndex = scenarios.findIndex(s => s.id === jump);
      return jumpIndex >= 0 ? jumpIndex : 0;
    }

    // Find first unanswered scenario (no skips allowed)
    const unanswered = scenarios.find(s => !(s.id in answers));
    if (unanswered) {
      return scenarios.findIndex(s => s.id === unanswered.id);
    }

    // All answered - generate more or go to results
    return scenarios.length - 1;
  }, [scenarios, jump, answers]);

  const s = scenarios?.[currentIndex];
  const index = currentIndex;

  // Check if we need to generate more scenarios
  const needsMoreScenarios = useMemo(() => {
    if (!scenarios) return false;
    const remaining = scenarios.length - answered;
    return remaining <= 3; // Generate when 3 or fewer remain
  }, [scenarios, answered]);

  // Progress announcement for screen readers
  useEffect(() => {
    if (total > 0) {
      const announcement = `Question ${index + 1} of ${total}. ${Math.round(progress * 100)}% complete.`;
      setProgressAnnouncement(announcement);
    }
  }, [index, total, progress]);

  // Auto-generate more scenarios when running low
  useEffect(() => {
    if (needsMoreScenarios && !isGenerating && scenarios && answered > 5) {
      handleGenerateMore();
    }
  }, [needsMoreScenarios, isGenerating, scenarios, answered]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
        <div className="motion-safe:animate-pulse">Loading scenarios...</div>
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

    // Auto-advance to next scenario
    if (index < total - 1) {
      const nextId = scenarios[index + 1].id;
      navigate(`/play?jump=${nextId}`);
    } else {
      // Generate more scenarios or go to results
      if (answered >= 10) {
        navigate("/results");
      } else {
        handleGenerateMore();
      }
    }
  };

  const handleGenerateMore = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      await generateMore(personalityProfile);
      toast.success("Generated new scenarios!");
    } catch (error) {
      console.error("Failed to generate scenarios:", error);
      toast.error("Failed to generate more scenarios");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen container max-w-2xl py-8 space-y-6">
      <div aria-live="polite" className="sr-only" data-testid="progress-announcer">
        {progressAnnouncement}
      </div>

      <section className="space-y-4 motion-safe:animate-fade-in">
        <div className="flex items-center justify-between">
          <div
            className="text-sm text-muted-foreground font-medium"
            aria-live="polite"
          >
            Question {index + 1} of {total}
          </div>
          <button
            onClick={() => navigate("/results")}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            View Progress
          </button>
        </div>

        <div className="space-y-2">
          <div className="h-2 motion-safe:animate-scale-in">
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

      {needsMoreScenarios && !isGenerating && (
        <div className="flex items-center justify-center pt-4">
          <Button 
            onClick={handleGenerateMore}
            variant="outline"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate More Scenarios"}
          </Button>
        </div>
      )}

      {isGenerating && (
        <div className="text-center text-sm text-muted-foreground pt-4">
          Generating new scenarios based on your choices...
        </div>
      )}
    </main>
  );
};

export default Play;