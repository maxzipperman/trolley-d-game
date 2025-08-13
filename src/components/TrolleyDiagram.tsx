import React, { useId } from "react";

interface TrolleyDiagramProps {
  trackALabel?: string;
  trackBLabel?: string;
  className?: string;
}

const TrolleyDiagram: React.FC<TrolleyDiagramProps> = ({ 
  trackALabel = "Track A", 
  trackBLabel = "Track B",
  className = ""
}) => {
  const titleId = useId();
  const descId = useId();
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <svg
        viewBox="0 0 300 200"
        className="w-full h-auto"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
      >
        <title id={titleId}>Trolley track diagram</title>
        <desc id={descId}>
          Trolley track diagram showing choice between two paths
        </desc>
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
