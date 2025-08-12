import React from "react";

interface AxisBarProps {
  label: string;
  value: number; // -10..10
}

const AxisBar: React.FC<AxisBarProps> = ({ label, value }) => {
  const clamped = Math.max(-10, Math.min(10, value));
  const mid = 10; // center at 0
  const fill = (Math.abs(clamped) / 10) * 50; // percent on each side
  const isPos = clamped >= 0;

  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label} ({clamped})</div>
      <div className="h-2 bg-muted rounded-md relative overflow-hidden">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
        <div
          className={`absolute top-0 bottom-0 ${isPos ? 'left-1/2 bg-foreground/80' : 'right-1/2 bg-foreground/80'}`}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  );
};

export default AxisBar;
