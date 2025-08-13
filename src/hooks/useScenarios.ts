
import { useCallback, useEffect, useState } from "react";
import type { Scenario } from "@/types";
import { scenarioSchema } from "@/utils/tags.schema";
import { toCanonicalTags } from "@/utils/tags";

export function useScenarios() {
  const [staticScenarios, setStaticScenarios] = useState<Scenario[] | null>(null);
  const [generatedScenarios, setGeneratedScenarios] = useState<Scenario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadStatic = useCallback(() => {
    setError(null);
    setStaticScenarios(null);
    const url = "/data/scenarios.json"; // Use simple string path instead of URL object
    fetch(url)
      .then(r => r.json())
      .then((json: unknown) => {
        if (Array.isArray(json)) {
          const valid: Scenario[] = [];
          for (const raw of json) {
            if (typeof raw !== "object" || raw === null) continue;
            const obj = raw as Record<string, unknown>;
            const id = typeof obj.id === "string" ? obj.id : undefined;
            const tags = Array.isArray(obj.tags)
              ? toCanonicalTags(obj.tags as string[])
              : undefined;
            const withCanonical = { ...obj, tags };
            const parsed = scenarioSchema.safeParse(withCanonical);
            if (parsed.success) {
              valid.push(parsed.data);
            } else if (import.meta.env.DEV && id) {
              console.error(`Invalid scenario ${id}: ${parsed.error.message}`);
            }
          }
          setStaticScenarios(valid);
        } else {
          setStaticScenarios([]);
        }
      })
      .catch(() => setError("Failed to load scenarios"));
  }, []);

  const loadGenerated = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('generatedScenarios') || '[]');
      setGeneratedScenarios(saved);
    } catch {
      setGeneratedScenarios([]);
    }
  }, []);

  const generateMore = useCallback(async (personalityProfile?: any) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Get user preferences
      const spicyMode = localStorage.getItem('spicyMode') === 'true';
      
      // Generate new scenarios based on personality profile
      const newScenarios = await generateScenariosBasedOnProfile(personalityProfile, spicyMode);
      
      // Add to generated scenarios
      const updated = [...generatedScenarios, ...newScenarios];
      setGeneratedScenarios(updated);
      localStorage.setItem('generatedScenarios', JSON.stringify(updated));
      
    } catch (error) {
      console.error('Failed to generate scenarios:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [generatedScenarios, isGenerating]);

  useEffect(() => {
    loadStatic();
    loadGenerated();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadGenerated();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadStatic, loadGenerated]);

  // Combine static and generated scenarios
  const allScenarios = staticScenarios ? [...staticScenarios, ...generatedScenarios] : null;

  return {
    scenarios: allScenarios,
    error,
    loading: staticScenarios === null && !error,
    retry: loadStatic,
    generateMore,
    isGenerating,
  };
}

// Mock generation function - replace with real AI generation later
async function generateScenariosBasedOnProfile(profile: any, spicyMode: boolean): Promise<Scenario[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const topics = [
    'social-media', 'climate-guilt', 'ai-ethics', 'gig-economy', 
    'remote-work', 'crypto-mania', 'dating-apps', 'wellness-culture'
  ];
  
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const timestamp = Date.now();
  
  const scenarios: Scenario[] = [];
  
  for (let i = 0; i < 3; i++) {
    scenarios.push({
      id: `GEN_${randomTopic}_${timestamp + i}`,
      title: `${spicyMode ? 'Provocative' : 'Modern'} ${randomTopic.replace('-', ' ')} Dilemma ${i + 1}`,
      description: `A runaway trolley approaches a contemporary moral dilemma involving ${randomTopic.replace('-', ' ')}. The absurdity of choice meets the futility of modern existence in this ${spicyMode ? 'edgy and controversial' : 'thoughtful'} scenario.`,
      track_a: `Option A: ${spicyMode ? 'Aggressively challenge' : 'Gently question'} the status quo`,
      track_b: `Option B: ${spicyMode ? 'Burn down' : 'Slowly reform'} the system`,
      theme: randomTopic,
      tags: ['absurd', 'paradox'] // Use existing tag types
    });
  }
  
  return scenarios;
}
