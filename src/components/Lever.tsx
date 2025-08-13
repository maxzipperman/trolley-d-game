import React, { useState } from "react";

interface LeverProps {
  onChange?: (direction: "up" | "down") => void;
  className?: string;
}

const Lever: React.FC<LeverProps> = ({ onChange, className = "" }) => {
  const [position, setPosition] = useState<"up" | "down">("down");

  function move(dir: "up" | "down") {
    setPosition(dir);
    onChange?.(dir);
  }

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "ArrowUp") move("up");
        if (e.key === "ArrowDown") move("down");
      }}
    >
      <div className="relative h-40 w-4 bg-muted rounded" onClick={e => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const y = e.clientY - rect.top;
        if (y < rect.height / 2) move("up");
        else move("down");
      }}>
        <div
          className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary shadow transition-all duration-200"
          style={{ top: position === "up" ? "0.25rem" : "calc(100% - 2.25rem)" }}
        />
      </div>
    </div>
  );
};

export default Lever;
