import React from "react";
import type { Scenario } from "@/types";

interface SimpleTrolleySceneProps {
  scenario: Scenario;
}

const SimpleTrolleyScene: React.FC<SimpleTrolleySceneProps> = ({ scenario }) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 400 200"
        className="w-full h-auto text-foreground"
        role="img"
        aria-label="Trolley problem illustration"
      >
        {/* Main track (straight) */}
        <line x1="50" y1="120" x2="350" y2="120" stroke="currentColor" strokeWidth="3" />
        <line x1="50" y1="125" x2="350" y2="125" stroke="currentColor" strokeWidth="3" />
        
        {/* Diverging track (Track B) */}
        <line x1="200" y1="120" x2="350" y2="160" stroke="currentColor" strokeWidth="3" />
        <line x1="200" y1="125" x2="350" y2="165" stroke="currentColor" strokeWidth="3" />
        
        {/* Track switch mechanism */}
        <circle cx="200" cy="122.5" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        
        {/* Trolley */}
        <g transform="translate(80, 100)">
          {/* Trolley body */}
          <rect x="0" y="0" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Wheels */}
          <circle cx="8" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Motion lines */}
          <line x1="-10" y1="5" x2="-5" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="-12" y1="10" x2="-7" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="-8" y1="15" x2="-3" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </g>
        
        {/* People on Track A (straight track) */}
        <g transform="translate(280, 95)">
          {/* Stick figure 1 */}
          <circle cx="0" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="8" x2="0" y2="20" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="12" x2="-5" y2="10" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="12" x2="5" y2="10" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="20" x2="-4" y2="28" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="20" x2="4" y2="28" stroke="currentColor" strokeWidth="1" />
          
          {/* Stick figure 2 */}
          <circle cx="15" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="15" y1="8" x2="15" y2="20" stroke="currentColor" strokeWidth="1" />
          <line x1="15" y1="12" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
          <line x1="15" y1="12" x2="20" y2="10" stroke="currentColor" strokeWidth="1" />
          <line x1="15" y1="20" x2="11" y2="28" stroke="currentColor" strokeWidth="1" />
          <line x1="15" y1="20" x2="19" y2="28" stroke="currentColor" strokeWidth="1" />
        </g>
        
        {/* Person on Track B (diverging track) */}
        <g transform="translate(320, 135)">
          <circle cx="0" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="8" x2="0" y2="20" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="12" x2="-5" y2="10" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="12" x2="5" y2="10" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="20" x2="-4" y2="28" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="20" x2="4" y2="28" stroke="currentColor" strokeWidth="1" />
        </g>
      </svg>
      
      {/* Track descriptions positioned on sides */}
      <div className="absolute top-4 right-8 max-w-32 text-right">
        <div className="text-xs font-bold text-muted-foreground mb-1">TRACK A (DO NOTHING)</div>
        <div className="text-sm border rounded p-2 bg-background/80 backdrop-blur-sm">
          {scenario.track_a}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-8 max-w-32 text-right">
        <div className="text-xs font-bold text-muted-foreground mb-1">TRACK B (PULL LEVER)</div>
        <div className="text-sm border rounded p-2 bg-background/80 backdrop-blur-sm">
          {scenario.track_b}
        </div>
      </div>
    </div>
  );
};

export default SimpleTrolleyScene;