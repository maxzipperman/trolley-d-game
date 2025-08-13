
import React, { useId } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const reducedMotion = useReducedMotion();

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
        <g className={!reducedMotion ? "motion-safe:animate-trolley-move" : undefined}>
          <rect
            x="40"
            y="90"
            width="40"
            height="20"
            rx="4"
            fill="hsl(var(--trolley-primary))"
            stroke="hsl(var(--trolley-stroke))"
            strokeWidth="1"
          />
          
          {/* Front window */}
          <rect
            x="68"
            y="94"
            width="8"
            height="8"
            rx="1"
            fill="hsl(var(--trolley-window))"
          />
          
          {/* Side windows */}
          <rect
            x="48"
            y="94"
            width="6"
            height="6"
            rx="1"
            fill="hsl(var(--trolley-window))"
          />
          <rect
            x="58"
            y="94"
            width="6"
            height="6"
            rx="1"
            fill="hsl(var(--trolley-window))"
          />
        </g>
        
        {/* Track labels */}
        <text
          x="200"
          y="50"
          textAnchor="middle"
          className="text-xs fill-current text-muted-foreground"
        >
          {trackALabel}
        </text>
        <text
          x="200"
          y="155"
          textAnchor="middle"
          className="text-xs fill-current text-muted-foreground"
        >
          {trackBLabel}
        </text>
      </svg>
    </div>
  );
};

export default TrolleyDiagram;
