import React, { useState } from "react";

interface LeverProps {
  /** Current value of the lever */
  value?: number;
  /** Minimum value allowed */
  min?: number;
  /** Maximum value allowed */
  max?: number;
  /** Increment applied on each movement */
  step?: number;
  /** Callback fired when the value changes */
  onChange?: (value: number) => void;
  /** Optional aria label for screen readers */
  "aria-label"?: string;
}

/**
 * Accessible lever component that behaves like a slider.
 * Supports keyboard interaction via arrow keys and WASD.
 */
const Lever: React.FC<LeverProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  "aria-label": ariaLabel,
}) => {
  const [internalValue, setInternalValue] = useState(value ?? min);
  const val = value ?? internalValue;

  const updateValue = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (value === undefined) {
      setInternalValue(clamped);
    }
    onChange?.(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key.toLowerCase();
    if (["arrowleft", "a", "arrowdown", "s"].includes(key)) {
      e.preventDefault();
      updateValue(val - step);
    }
    if (["arrowright", "d", "arrowup", "w"].includes(key)) {
      e.preventDefault();
      updateValue(val + step);
    }
  };

  return (
    <div
      tabIndex={0}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={val}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className="relative flex items-center justify-center w-20 h-6 bg-muted rounded select-none cursor-pointer"
    >
      <div
        className="absolute left-0 top-0 h-full bg-primary transition-all"
        style={{ width: `${((val - min) / (max - min)) * 100}%` }}
      />
      <span className="relative text-xs font-medium">{val}</span>
    </div>
  );
};

export default Lever;
