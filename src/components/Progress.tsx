
import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0..100
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("w-full h-2 rounded-md bg-muted overflow-hidden", className)}
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
