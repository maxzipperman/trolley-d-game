import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScenarios } from "@/hooks/useScenarios";
import { useAnswers } from "@/hooks/useAnswers";
import SimpleTrolleyScene from "@/components/SimpleTrolleyScene";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Rationale {
  text: string;
  category: string;
  nihilism?: number;
  order?: number;
  chaos?: number;
  material?: number;
  social?: number;
  mercy?: number;
  mischief?: number;
}

const Play = () => {
  const navigate = useNavigate();
  const { scenarios, loading } = useScenarios();
  const { answers, setAnswers } = useAnswers();
  const [showRationales, setShowRationales] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<"A" | "B" | null>(null);
  const [rationales, setRationales] = useState<Rationale[]>([]);

  const answered = Object.values(answers).filter(a => a !== "skip").length;
  const total = scenarios?.length ?? 0;

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

    // Find first unanswered scenario
    const unanswered = scenarios.find(s => !(s.id in answers));
    if (unanswered) {
      return scenarios.findIndex(s => s.id === unanswered.id);
    }

    // All answered - go to results
    return scenarios.length - 1;
  }, [scenarios, jump, answers]);

  const scenario = scenarios?.[currentIndex];

  // Load rationales from JSON file
  useEffect(() => {
    fetch('/data/rationales.json')
      .then(r => r.json())
      .then(data => setRationales(data))
      .catch(() => setRationales([])); // Empty array if file doesn't exist yet
  }, []);

  // Play creaky lever sound
  const playCreakSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create multiple oscillators for complex rusty sound
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.6, audioContext.sampleRate);
      const noiseSource = audioContext.createBufferSource();
      
      // Generate noise for rust/friction effect
      const noiseArray = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseArray.length; i++) {
        noiseArray[i] = (Math.random() * 2 - 1) * 0.15;
      }
      noiseSource.buffer = noiseBuffer;
      
      // Create gain nodes
      const gainNode1 = audioContext.createGain();
      const gainNode2 = audioContext.createGain();
      const noiseGain = audioContext.createGain();
      
      // Connect audio graph
      oscillator1.connect(gainNode1);
      oscillator2.connect(gainNode2);
      noiseSource.connect(noiseGain);
      gainNode1.connect(audioContext.destination);
      gainNode2.connect(audioContext.destination);
      noiseGain.connect(audioContext.destination);
      
      // Set frequencies for creaky sound
      oscillator1.frequency.setValueAtTime(100, audioContext.currentTime);
      oscillator1.frequency.exponentialRampToValueAtTime(70, audioContext.currentTime + 0.4);
      
      oscillator2.frequency.setValueAtTime(180, audioContext.currentTime);
      oscillator2.frequency.exponentialRampToValueAtTime(130, audioContext.currentTime + 0.4);
      
      // Set gain envelopes for rusty, grinding sound
      gainNode1.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      noiseGain.gain.setValueAtTime(0.08, audioContext.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      // Start and stop
      oscillator1.start();
      oscillator2.start();
      noiseSource.start();
      oscillator1.stop(audioContext.currentTime + 0.5);
      oscillator2.stop(audioContext.currentTime + 0.5);
      noiseSource.stop(audioContext.currentTime + 0.4);
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  const handleChoice = (choice: "A" | "B") => {
    playCreakSound();
    setPendingChoice(choice);
    
    if (rationales.length > 0) {
      setShowRationales(true);
    } else {
      // No rationales available, proceed directly
      finalizeChoice(choice);
    }
  };

  const handleRationaleSelect = (rationale: Rationale) => {
    if (pendingChoice) {
      // Save the choice with rationale
      setAnswers({ ...answers, [scenario!.id]: pendingChoice });
      
      // Save detailed choice data to localStorage
      const choiceData = {
        choice: pendingChoice,
        rationale: rationale.text,
        category: rationale.category,
        scores: {
          nihilism: rationale.nihilism || 0,
          order: rationale.order || 0,
          chaos: rationale.chaos || 0,
          material: rationale.material || 0,
          social: rationale.social || 0,
          mercy: rationale.mercy || 0,
          mischief: rationale.mischief || 0,
        }
      };
      
      const existingChoices = JSON.parse(localStorage.getItem('userChoices') || '{}');
      existingChoices[scenario!.id] = choiceData;
      localStorage.setItem('userChoices', JSON.stringify(existingChoices));

      // Advance to next scenario
      advanceToNext();
    }
  };

  const finalizeChoice = (choice: "A" | "B") => {
    if (!scenario) return;
    
    setAnswers({ ...answers, [scenario.id]: choice });
    advanceToNext();
  };

  const advanceToNext = () => {
    setShowRationales(false);
    setPendingChoice(null);
    
    if (currentIndex < total - 1) {
      const nextId = scenarios![currentIndex + 1].id;
      navigate(`/play?jump=${nextId}`);
    } else {
      if (answered >= 10) {
        navigate("/results");
      } else {
        toast.info("Complete at least 10 scenarios to see results");
      }
    }
  };

  // Get 4 random rationales
  const randomRationales = useMemo(() => {
    if (rationales.length === 0) return [];
    const shuffled = [...rationales].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [rationales, pendingChoice]); // Re-shuffle when choice is made

  if (loading || !scenarios) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg">Loading scenarios...</div>
          <div className="text-sm text-muted-foreground">Preparing your moral dilemmas...</div>
        </div>
      </main>
    );
  }

  if (total === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No Scenarios Available</h1>
          <p className="text-muted-foreground">Please add scenarios to data/scenarios.json</p>
        </div>
      </main>
    );
  }

  if (!scenario) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">All Done!</h1>
          <Button onClick={() => navigate("/results")} className="mt-4">
            View Results
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        {/* Simple progress indicator */}
        <div className="text-center mb-8">
          <div className="text-sm text-muted-foreground font-mono">
            Scenario {currentIndex + 1} of {total}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            ({Math.round(((currentIndex + 1) / total) * 100)}% complete)
          </div>
        </div>

        {/* Scenario title and description */}
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-2xl font-bold font-serif">{scenario.title}</h1>
          {scenario.description && (
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {scenario.description}
            </p>
          )}
        </div>

        {/* Trolley illustration */}
        <div className="mb-8">
          <SimpleTrolleyScene scenario={scenario} />
        </div>

        {/* Choice buttons */}
        {!showRationales && (
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => handleChoice("A")}
              variant="outline"
              size="lg"
              className="font-mono text-lg px-8 py-4 border-2 hover:bg-muted/50"
            >
              Do Nothing
            </Button>
            <Button
              onClick={() => handleChoice("B")}
              variant="outline"
              size="lg"
              className="font-mono text-lg px-8 py-4 border-2 hover:bg-muted/50"
            >
              Pull the Lever
            </Button>
          </div>
        )}

        {/* Rationale selection */}
        {showRationales && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Why did you choose to {pendingChoice === "A" ? "do nothing" : "pull the lever"}?
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose the rationale that best matches your reasoning:
              </p>
            </div>
            
            <div className="grid gap-3 max-w-2xl mx-auto">
              {randomRationales.map((rationale, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary/30"
                  onClick={() => handleRationaleSelect(rationale)}
                >
                  <p className="text-sm leading-relaxed">{rationale.text}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-muted-foreground capitalize">
                      {rationale.category}
                    </span>
                    {rationale.nihilism && (
                      <div className="flex gap-1">
                        {Array.from({ length: rationale.nihilism }).map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-muted-foreground/60 rounded-full" />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            
            {randomRationales.length === 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No rationales available. Proceeding with your choice...
                </p>
                <Button onClick={() => finalizeChoice(pendingChoice!)}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/results")}
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            View Progress So Far
          </button>
        </div>
      </div>
    </main>
  );
};

export default Play;