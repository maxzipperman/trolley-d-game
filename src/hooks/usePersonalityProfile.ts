import { useState, useEffect } from 'react';
import { computeAxes } from '@/utils/scoring';
import type { Scenario } from '@/types';

export interface PersonalityProfile {
  dominantAxis: string;
  alignment: string;
  nihilismLevel: number;
  choicePattern: 'consistent' | 'chaotic' | 'balanced';
  topPersonas: string[];
  badges: string[];
  totalChoices: number;
}

export function usePersonalityProfile(scenarios: Scenario[]) {
  const [profile, setProfile] = useState<PersonalityProfile | null>(null);

  useEffect(() => {
    // Get user choices and rationales
    const userChoices = JSON.parse(localStorage.getItem('userChoices') || '{}');
    const alignmentCounts = JSON.parse(localStorage.getItem('alignmentCounts') || '{}');
    const scenarioRatings = JSON.parse(localStorage.getItem('scenarioRatings') || '{}');

    if (Object.keys(userChoices).length === 0) {
      setProfile(null);
      return;
    }

    // Convert user choices to the format expected by computeAxes
    const answers: Record<string, 'A' | 'B' | 'skip'> = {};
    for (const [scenarioId, choiceData] of Object.entries(userChoices)) {
      if (typeof choiceData === 'object' && choiceData !== null) {
        answers[scenarioId] = (choiceData as any).choice;
      }
    }

    // Compute personality axes
    const axes = computeAxes(answers, scenarios);
    
    // Calculate nihilism level from rationales
    let totalNihilism = 0;
    let rationaleCount = 0;
    
    for (const choiceData of Object.values(userChoices)) {
      if (typeof choiceData === 'object' && choiceData !== null && (choiceData as any).rationale) {
        // Simple nihilism detection based on rationale keywords
        const rationale = (choiceData as any).rationale.toLowerCase();
        let nihilismScore = 1;
        
        if (rationale.includes('doomed') || rationale.includes('meaningless')) nihilismScore = 4;
        else if (rationale.includes('heat death') || rationale.includes('illusion')) nihilismScore = 5;
        else if (rationale.includes('random') || rationale.includes('anyway')) nihilismScore = 3;
        else if (rationale.includes('greater good') || rationale.includes('optimizing')) nihilismScore = 1;
        
        totalNihilism += nihilismScore;
        rationaleCount++;
      }
    }

    const avgNihilism = rationaleCount > 0 ? totalNihilism / rationaleCount : 2.5;

    // Determine dominant axis
    let dominantAxis = 'balanced';
    let alignment = 'neutral';
    
    if (Math.abs(axes.order - axes.chaos) > Math.abs(axes.material - axes.social)) {
      dominantAxis = 'order-chaos';
      alignment = axes.order > axes.chaos ? 'order' : 'chaos';
    } else if (Math.abs(axes.material - axes.social) > 0) {
      dominantAxis = 'material-social';
      alignment = axes.material > axes.social ? 'material' : 'social';
    }

    // Determine choice pattern
    const choiceValues = Object.values(answers);
    const aCount = choiceValues.filter(c => c === 'A').length;
    const bCount = choiceValues.filter(c => c === 'B').length;
    const totalChoices = aCount + bCount;
    const ratio = totalChoices > 0 ? Math.min(aCount, bCount) / Math.max(aCount, bCount) : 0;
    
    let choicePattern: 'consistent' | 'chaotic' | 'balanced';
    if (ratio > 0.7) choicePattern = 'balanced';
    else if (ratio < 0.3) choicePattern = 'consistent';
    else choicePattern = 'chaotic';

    // Get top aligned personas
    const topPersonas = Object.entries(alignmentCounts)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([name]) => name);

    // Generate personality badges
    const badges: string[] = [];
    
    if (avgNihilism >= 4) badges.push('Existential Void');
    else if (avgNihilism >= 3) badges.push('Cosmic Pessimist');
    else if (avgNihilism <= 1.5) badges.push('Eternal Optimist');
    
    if (choicePattern === 'balanced') badges.push('Philosophical Balance');
    else if (choicePattern === 'chaotic') badges.push('Chaos Agent');
    else badges.push('Unwavering Conviction');
    
    if (alignment === 'order') badges.push('Order Keeper');
    else if (alignment === 'chaos') badges.push('Chaos Embracer');
    else if (alignment === 'material') badges.push('Pragmatist');
    else if (alignment === 'social') badges.push('Humanist');
    
    if (Object.keys(userChoices).length >= 10) badges.push('Trolley Veteran');
    if (Object.keys(userChoices).length >= 25) badges.push('Moral Philosopher');

    setProfile({
      dominantAxis,
      alignment,
      nihilismLevel: avgNihilism,
      choicePattern,
      topPersonas,
      badges,
      totalChoices: Object.keys(userChoices).length
    });

  }, [scenarios]);

  return profile;
}