import React from "react";

interface ProgressProps {
  value: number; // 0..1
}

const Progress: React.FC<ProgressProps> = ({ value }) => {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="w-full h-2 rounded-md bg-muted overflow-hidden" aria-hidden>
      <div
        className="h-full bg-foreground/80 motion-safe:transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default Progress;
