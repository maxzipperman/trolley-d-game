import React from "react";

const StickFigure: React.FC = () => (
  <g stroke="currentColor" fill="none" strokeWidth={2}>
    <circle cx={0} cy={-4} r={2} />
    <line x1={0} y1={-2} x2={0} y2={4} />
    <line x1={0} y1={0} x2={-3} y2={2} />
    <line x1={0} y1={0} x2={3} y2={2} />
    <line x1={0} y1={4} x2={-3} y2={6} />
    <line x1={0} y1={4} x2={3} y2={6} />
  </g>
);

export default StickFigure;
