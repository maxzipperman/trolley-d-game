import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Trolley Dilemmas
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore moral philosophy through interactive trolley problems. Make difficult choices and discover your ethical framework.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/avatar">Start Playing</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/results">View Results</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}