import React from "react";

interface InlineErrorProps {
  message: string;
  onRetry: () => void;
}

const InlineError: React.FC<InlineErrorProps> = ({ message, onRetry }) => (
  <div className="p-4 rounded-md bg-destructive/10 text-destructive flex items-center justify-between gap-4">
    <span className="text-sm">{message}</span>
    <button
      onClick={onRetry}
      className="text-sm underline underline-offset-4"
    >
      Retry
    </button>
  </div>
);

export default InlineError;
