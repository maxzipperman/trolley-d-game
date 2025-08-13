import React from "react";

interface ScorecardProps {
  name: string;
  scoreA: number;
  scoreB: number;
}

const Scorecard: React.FC<ScorecardProps> = ({ name, scoreA, scoreB }) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">{name}</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Track A</div>
          <div className="text-3xl font-bold text-primary mt-1">{scoreA}</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Track B</div>
          <div className="text-3xl font-bold text-secondary-foreground mt-1">{scoreB}</div>
        </div>
      </div>
    </div>
  );
};

export default Scorecard;
