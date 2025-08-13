import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScenarios } from "@/hooks/useScenarios";
import ScenarioCard from "@/components/ScenarioCard";
import { useAnswers } from "@/hooks/useAnswers";
import type { Choice } from "@/utils/scoring";

export default function Index() {
  const { scenarios, loading, error } = useScenarios();
  const { answers, setAnswers } = useAnswers();

  const handlePick = (scenarioId: string, choice: "A" | "B") => {
    setAnswers({ ...answers, [scenarioId]: choice });
  };

  const getChoiceForDisplay = (choice: Choice | undefined): "A" | "B" | null => {
    if (choice === "A" || choice === "B") return choice;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Trolley Dilemmas
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore moral philosophy through interactive trolley problems. Make difficult choices and discover your ethical framework.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg">
              <Link to="/avatars">Start Playing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/results">View Results</Link>
            </Button>
          </div>
        </div>

        {/* Scenarios Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Scenarios</h2>
          
          {loading && (
            <div className="text-center py-8">
              <div className="motion-safe:animate-pulse">Loading scenarios...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-destructive">
              Error loading scenarios: {error}
            </div>
          )}

          {scenarios && scenarios.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No scenarios available. Please add data/scenarios.json.
            </div>
          )}

          {scenarios && scenarios.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scenarios.slice(0, 6).map((scenario) => (
                <div key={scenario.id} className="border rounded-lg p-4">
                  <ScenarioCard
                    scenario={scenario}
                    onPick={(choice) => handlePick(scenario.id, choice)}
                    choice={getChoiceForDisplay(answers[scenario.id])}
                    stats={null}
                    onNext={() => {}}
                  />
                </div>
              ))}
            </div>
          )}

          {scenarios && scenarios.length > 6 && (
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/play">View All Scenarios</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}