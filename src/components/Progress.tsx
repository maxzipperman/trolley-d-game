import React from "react";

interface ProgressProps {
  value: number; // 0..100
}

const Progress: React.FC<ProgressProps> = ({ value }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className="w-full h-2 rounded-md bg-muted overflow-hidden"
      role="progressbar"
      aria-label="Progress"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-foreground/80 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default Progress;
