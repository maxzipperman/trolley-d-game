import React from "react";

interface TrolleyDiagramProps {
  trackALabel?: string;
  trackBLabel?: string;
  className?: string;
  choice?: "A" | "B";
}

const TrolleyDiagram: React.FC<TrolleyDiagramProps> = ({
  trackALabel = "Track A",
  trackBLabel = "Track B",
  className = "",
  choice,
}) => {
  const leverY = choice === "A" ? 70 : choice === "B" ? 130 : 100;

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <svg
        viewBox="0 0 300 200"
        className="w-full h-auto"
        role="img"
        aria-label="Trolley track diagram showing choice between two paths"
      >
        {/* Track base */}
        <path
          d="M20 100 L120 100"
          stroke="hsl(var(--trolley-track))"
          strokeWidth="4"
          fill="none"
        />

        {/* Track fork - A (top) */}
        <path
          d="M120 100 L200 60"
          stroke="hsl(var(--trolley-track))"
          strokeWidth="4"
          fill="none"
        />

        {/* Track fork - B (bottom) */}
        <path
          d="M120 100 L200 140"
          stroke="hsl(var(--trolley-track))"
          strokeWidth="4"
          fill="none"
        />

        {/* Lever */}
        <line
          x1="120"
          y1="100"
          x2="120"
          y2={leverY}
          stroke="hsl(var(--trolley-track))"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle
          cx="120"
          cy={leverY}
          r="6"
          fill="hsl(var(--trolley-body))"
          stroke="hsl(var(--trolley-track))"
          strokeWidth="2"
        />

        {/* Trolley */}
        <g className="animate-trolley-move">
          <rect
            x="40"
            y="88"
            width="32"
            height="24"
            rx="4"
            fill="hsl(var(--trolley-body))"
          />
          {/* Wheels */}
          <circle cx="48" cy="116" r="4" fill="hsl(var(--trolley-track))" />
          <circle cx="64" cy="116" r="4" fill="hsl(var(--trolley-track))" />
        </g>

        {/* Track labels */}
        <text
          x="200"
          y="50"
          className="text-xs fill-muted-foreground"
          textAnchor="middle"
        >
          {trackALabel}
        </text>
        <text
          x="200"
          y="155"
          className="text-xs fill-muted-foreground"
          textAnchor="middle"
        >
          {trackBLabel}
        </text>
      </svg>
    </div>
  );
};

export default TrolleyDiagram;
