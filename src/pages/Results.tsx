
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useScenarios } from "@/hooks/useScenarios";

type UserChoice = {
  choice?: "A" | "B";
  rationale?: string;
};

const Results: React.FC = () => {
  const { scenarios, loading, error } = useScenarios();

  const userChoices: Record<string, UserChoice> = useMemo(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("userChoices") : null;
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-muted-foreground">Loading results…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-destructive">Failed to load scenarios.</p>
      </div>
    );
  }

  const answeredIds = new Set(Object.keys(userChoices));
  const answered = (scenarios ?? []).filter(s => answeredIds.has(s.id));

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Results</h1>

      {answered.length === 0 ? (
        <p className="text-muted-foreground">
          You haven’t answered any scenarios yet.{" "}
          <Link to="/play" className="underline underline-offset-4">Start playing</Link>.
        </p>
      ) : (
        <div className="space-y-4">
          {answered.map((s) => {
            const userChoice = userChoices[s.id];
            return (
              <div key={s.id} className="p-4 rounded-lg border bg-card">
                <Link
                  to={`/play?jump=${s.id}`}
                  className="underline underline-offset-4"
                >
                  {s.title}
                </Link>
                {userChoice?.rationale && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {userChoice.rationale}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;
