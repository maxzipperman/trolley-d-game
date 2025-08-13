// Supabase Edge Function: Generate Scenarios with Qwen Integration
// Features: Custom genre mapping, tags/spice level, normalized shapes, cache, batching, rate limiting

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Custom genre mapping for cultural topics
const GENRE_MAPPING = {
  'social-media': {
    name: 'Social Media Dilemmas',
    spiceMultiplier: 1.2,
    tags: ['digital', 'society', 'privacy'],
    prompts: {
      mild: 'influencer culture and cancel dynamics',
      spicy: 'algorithmic manipulation and social validation addiction'
    }
  },
  'climate-anxiety': {
    name: 'Climate Anxiety',
    spiceMultiplier: 1.1,
    tags: ['environment', 'future', 'guilt'],
    prompts: {
      mild: 'eco-guilt and greenwashing choices',
      spicy: 'climate despair and corporate responsibility'
    }
  },
  'ai-ethics': {
    name: 'AI Ethics',
    spiceMultiplier: 1.4,
    tags: ['technology', 'automation', 'humanity'],
    prompts: {
      mild: 'automation impact and privacy concerns',
      spicy: 'AI consciousness and human obsolescence'
    }
  },
  'gig-economy': {
    name: 'Gig Economy',
    spiceMultiplier: 1.3,
    tags: ['work', 'exploitation', 'freedom'],
    prompts: {
      mild: 'worker rights vs platform convenience',
      spicy: 'exploitation disguised as entrepreneurship'
    }
  },
  'remote-work': {
    name: 'Remote Work Culture',
    spiceMultiplier: 1.0,
    tags: ['work', 'isolation', 'productivity'],
    prompts: {
      mild: 'work-life balance and digital fatigue',
      spicy: 'surveillance capitalism and human connection erosion'
    }
  }
};

// Rate limiting storage (in-memory for demo, should use Redis/DB in production)
const rateLimitStore = new Map();

// Cache for generated scenarios
const scenarioCache = new Map();

// Normalize scenario shape
function normalizeScenario(rawScenario: any, genre: string, spiceLevel: number) {
  const genreInfo = GENRE_MAPPING[genre] || GENRE_MAPPING['social-media'];
  
  return {
    id: `GEN_${genre}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: rawScenario.title || 'Generated Scenario',
    description: rawScenario.description || rawScenario.scenario || '',
    track_a: rawScenario.track_a || rawScenario.optionA || rawScenario.choice1 || 'Option A',
    track_b: rawScenario.track_b || rawScenario.optionB || rawScenario.choice2 || 'Option B',
    theme: genreInfo.name,
    tags: [...genreInfo.tags, spiceLevel > 5 ? 'spicy' : 'mild'],
    spice_level: spiceLevel,
    generated: true,
    timestamp: Date.now(),
    rationales: generateRationaleChoices(rawScenario, spiceLevel)
  };
}

// Generate rationale choices for persona responses
function generateRationaleChoices(scenario: any, spiceLevel: number) {
  const baseRationales = [
    'utilitarian', 'deontological', 'nihilistic', 'pragmatic', 
    'emotional', 'cynical', 'optimistic', 'chaotic'
  ];
  
  if (spiceLevel > 6) {
    baseRationales.push('rebellious', 'contrarian', 'anarchic', 'fatalistic');
  }
  
  return baseRationales.slice(0, Math.min(6, baseRationales.length));
}

// Rate limiting check
function checkRateLimit(identifier: string): { allowed: boolean, resetTime?: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const limit = 10; // 10 requests per hour
  
  const userRecord = rateLimitStore.get(identifier) || { count: 0, resetTime: now + windowMs };
  
  if (now > userRecord.resetTime) {
    userRecord.count = 0;
    userRecord.resetTime = now + windowMs;
  }
  
  if (userRecord.count >= limit) {
    return { allowed: false, resetTime: userRecord.resetTime };
  }
  
  userRecord.count++;
  rateLimitStore.set(identifier, userRecord);
  return { allowed: true };
}

// Generate cache key
function getCacheKey(genre: string, spiceLevel: number, personalityProfile: any) {
  const profileHash = personalityProfile ? 
    btoa(JSON.stringify(personalityProfile)).slice(0, 8) : 'default';
  return `${genre}_${spiceLevel}_${profileHash}`;
}

// Call Qwen API (free provider)
async function callQwenAPI(prompt: string, retries = 2): Promise<any> {
  const qwenEndpoint = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
  const apiKey = Deno.env.get('QWEN_API_KEY'); // Fallback to free tier
  
  try {
    const response = await fetch(qwenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-turbo', // Free tier model
        input: {
          messages: [{
            role: 'user',
            content: prompt
          }]
        },
        parameters: {
          temperature: 0.8,
          max_tokens: 400,
          result_format: 'message'
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }
    
    const result = await response.json();
    return result.output.choices[0].message.content;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
      return callQwenAPI(prompt, retries - 1);
    }
    throw error;
  }
}

// Generate 10-pack batch of scenarios
async function generateBatch(genre: string, spiceLevel: number, personalityProfile: any) {
  const genreInfo = GENRE_MAPPING[genre] || GENRE_MAPPING['social-media'];
  const isSpicy = spiceLevel > 5;
  const promptContext = isSpicy ? genreInfo.prompts.spicy : genreInfo.prompts.mild;
  
  const personalityContext = personalityProfile ? 
    `Consider this user profile: ${JSON.stringify(personalityProfile, null, 2)}. ` : '';
    
  const batchPrompt = `${personalityContext}Generate exactly 10 trolley problem scenarios about ${promptContext}. Each scenario should combine absurdist and nihilistic elements with the classic trolley problem format, presenting humorous, sarcastic, or culturally relevant dilemmas that highlight the futility of choice while provoking thought on existential themes.

Return as JSON array with this exact format:
[
  {
    "title": "Scenario title",
    "description": "The scenario description with the trolley problem setup",
    "track_a": "First choice description",
    "track_b": "Second choice description"
  }
]

Spice level: ${spiceLevel}/10 (${isSpicy ? 'controversial/edgy' : 'mild/accessible'}).
Make them concise, easy to grasp, blend everyday absurdities with philosophical twists, and offer two options that are equally ridiculous or morally ambiguous.`;

  try {
    const rawResponse = await callQwenAPI(batchPrompt);
    
    // Parse JSON response
    let scenarios;
    try {
      const jsonMatch = rawResponse.match(/\[.*\]/s);
      if (jsonMatch) {
        scenarios = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError, 'Raw response:', rawResponse);
      throw new Error('Invalid response format from AI');
    }
    
    // Validate and normalize scenarios
    const normalizedScenarios = scenarios
      .filter(s => s.title && s.description && s.track_a && s.track_b)
      .slice(0, 10) // Ensure max 10
      .map(scenario => normalizeScenario(scenario, genre, spiceLevel));
    
    if (normalizedScenarios.length === 0) {
      throw new Error('No valid scenarios generated');
    }
    
    return normalizedScenarios;
  } catch (error) {
    console.error('Batch generation error:', error);
    throw error;
  }
}

// Pool busy toast notification helper
function createPoolBusyResponse(resetTime: number) {
  return new Response(
    JSON.stringify({ 
      error: 'Pool Busy',
      message: 'Generation pool is at capacity. Please try again later.',
      resetTime,
      toast: {
        type: 'warning',
        title: '🚧 Pool Busy',
        description: `Generation pool is full. Resets in ${Math.ceil((resetTime - Date.now()) / 1000 / 60)} minutes.`,
        duration: 5000
      }
    }),
    { 
      status: 429, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { 
      genre = 'social-media', 
      spiceLevel = 3, 
      personalityProfile = null,
      batchSize = 10,
      useCache = true 
    } = await req.json();
    
    // Get client identifier (IP or user ID)
    const clientIP = req.headers.get('x-forwarded-for') || 'anonymous';
    
    // Check rate limiting
    const rateLimitCheck = checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      return createPoolBusyResponse(rateLimitCheck.resetTime!);
    }
    
    // Check cache first
    const cacheKey = getCacheKey(genre, spiceLevel, personalityProfile);
    if (useCache && scenarioCache.has(cacheKey)) {
      const cachedScenarios = scenarioCache.get(cacheKey);
      
      return new Response(
        JSON.stringify({ 
          scenarios: cachedScenarios,
          cached: true,
          toast: {
            type: 'success',
            title: '⚡ Lightning Fast',
            description: 'Retrieved scenarios from cache',
            duration: 2000
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate new batch
    const scenarios = await generateBatch(genre, spiceLevel, personalityProfile);
    
    // Cache the results
    scenarioCache.set(cacheKey, scenarios);
    
    // Clean up old cache entries (simple LRU)
    if (scenarioCache.size > 100) {
      const firstKey = scenarioCache.keys().next().value;
      scenarioCache.delete(firstKey);
    }
    
    return new Response(
      JSON.stringify({ 
        scenarios,
        generated: scenarios.length,
        cached: false,
        toast: {
          type: 'success',
          title: `🎭 ${scenarios.length} Fresh Scenarios`,
          description: `Generated ${GENRE_MAPPING[genre]?.name || genre} scenarios (Spice: ${spiceLevel}/10)`,
          duration: 3000
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Generation error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        toast: {
          type: 'error',
          title: '🚨 Generation Failed',
          description: error.message.includes('rate') ? 'Too many requests' : 'Failed to generate scenarios',
          duration: 5000
        }
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});