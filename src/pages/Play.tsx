import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Progress from "@/components/Progress";
import ScenarioCard from "@/components/ScenarioCard";
import SettingsModal from "@/components/SettingsModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useScenarios } from "@/hooks/useScenarios";
import { useAnswers } from "@/hooks/useAnswers";
import type { Scenario, Settings } from "@/types";
import type { Choice } from "@/utils/scoring";
import { Progress as UIProgress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { submitChoice, fetchScenarioStats } from "@/lib/api";

const ANSWERS_KEY = "trolleyd-answers";

const Play = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jump = searchParams.get("jump");

  const { scenarios, loading } = useScenarios();
  const [answers, setAnswers] = useLocalStorage<Record<string, Choice>>(ANSWERS_KEY, {});
  const [settings, setSettings] = useLocalStorage<Settings>("trolleyd-settings", {
    sound: true,
    haptics: true,
    animations: true,
  });
  const { answers: hookAnswers, setAnswers: setHookAnswers } = useAnswers();

  const [progressAnnouncement, setProgressAnnouncement] = useState("");

  useEffect(() => {
    document.title = "Trolley'd · Play";
  }, []);

  const total = scenarios?.length || 0;
  const answered = Object.keys(answers).length;
  const progress = total > 0 ? answered / total : 0;

  // Current scenario logic
  const currentIndex = useMemo(() => {
    if (!scenarios?.length) return 0;

    if (jump) {
      const jumpIndex = scenarios.findIndex(s => s.id === jump);
      return jumpIndex >= 0 ? jumpIndex : 0;
    }

    // Find first unanswered scenario
    const unanswered = scenarios.find(s => !(s.id in answers));
    if (unanswered) {
      return scenarios.findIndex(s => s.id === unanswered.id);