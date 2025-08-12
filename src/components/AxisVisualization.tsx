import React from "react";

interface AxisVisualizationProps {
  label: string;
  value: number; // -10..10
  leftLabel: string;
  rightLabel: string;
}

const AxisVisualization: React.FC<AxisVisualizationProps> = ({ 
  label, 
  value, 
  leftLabel, 
  rightLabel 
}) => {
  const clamped = Math.max(-10, Math.min(10, value));
  const percentage = ((clamped + 10) / 20) * 100; // Convert -10..10 to 0..100%
  const isNeutral = Math.abs(clamped) <= 1;
  
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {clamped > 0 ? `+${clamped}` : clamped}
        </span>
      </div>
      
      {/* Axis line with position indicator */}
      <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-100 via-gray-100 to-green-100 dark:from-red-900/20 dark:via-gray-700 dark:to-green-900/20" />
        
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
        
        {/* Position indicator */}
        <div 
          className={`absolute top-1 bottom-1 w-2 rounded-sm transition-all duration-500 ${
            isNeutral 
              ? 'bg-muted-foreground' 
              : clamped < 0 
                ? 'bg-red-500' 
                : 'bg-green-500'
          }`}
          style={{ 
            left: `calc(${percentage}% - 4px)`,
            transform: `translateX(0)`
          }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

export default AxisVisualization;