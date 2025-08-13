import React, { useEffect, useMemo, useState } from "react";
import type { Scenario, Settings } from "@/types";
import { usePersonas } from "@/hooks/usePersonas";
import { useDecisions } from "@/hooks/useDecisions";
import NPCAvatar from "./NPCAvatar";
import TrolleyDiagram from "./TrolleyDiagram";
import InlineError from "./InlineError";

interface ScenarioCardProps {
  scenario: Scenario;
  onPick: (choice: "A" | "B") => void;
  settings: Settings;
  onNext: () => void;
  choice: "A" | "B" | null;
  stats: { A: number; B: number } | null;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onPick, settings, onNext, choice, stats }) => {
  const [showNPC, setShowNPC] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rationale, setRationale] = useState("");
  const { personas, error: personasError } = usePersonas();
  const { decisions, error: decisionsError, retry: retryDecisions } = useDecisions();
  const [picked, setPicked] = useState<"A" | "B" | null>(null);

  const scenarioResponses = decisions?.filter(d => d.scenarioId === scenario.id) ?? [];

  const handlePick = (choice: "A" | "B") => {
    setPicked(choice);

    // Save choice with rationale to localStorage
    const choiceWithRationale = {
      choice,
      rationale: rationale.trim() || undefined
    };

    const existingChoices = JSON.parse(localStorage.getItem('userChoices') || '{}');
    existingChoices[scenario.id] = choiceWithRationale;
    localStorage.setItem('userChoices', JSON.stringify(existingChoices));

    onPick(choice);

    const aligned = scenarioResponses
      .filter((r) => r.choice === choice)
      .map((r) => r.persona);

    if (typeof window !== "undefined") {
      let counts: Record<string, number> = {};
      try {
        counts = JSON.parse(window.localStorage.getItem("alignmentCounts") ?? "{}");
      } catch {