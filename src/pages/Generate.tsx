import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { usePersonalityProfile } from '@/hooks/usePersonalityProfile';
import { useScenarios } from '@/hooks/useScenarios';
import { toast } from 'sonner';

const CULTURAL_TOPICS = [
  {
    id: 'social-media',
    title: 'Social Media Anxiety',
    description: 'The paradoxes of digital connection and validation',
    keywords: ['influencers', 'cancel culture', 'algorithm bias', 'digital wellness']
  },
  {
    id: 'climate-guilt',
    title: 'Climate Guilt',
    description: 'Environmental anxiety in an unsustainable world',
    keywords: ['carbon footprint', 'greenwashing', 'eco-anxiety', 'sustainability']
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics',
    description: 'The implications of artificial intelligence on humanity',
    keywords: ['automation', 'algorithmic bias', 'privacy', 'job displacement']
  },
  {
    id: 'gig-economy',
    title: 'Gig Economy',
    description: 'The precarious nature of modern work',
    keywords: ['platform capitalism', 'worker rights', 'rating systems', 'flexibility']
  },
  {
    id: 'remote-work',
    title: 'Remote Work Culture',
    description: 'The blurred boundaries of digital-first work',
    keywords: ['Zoom fatigue', 'work-life balance', 'digital surveillance', 'async communication']
  },
  {
    id: 'crypto-mania',
    title: 'Crypto Mania',
    description: 'The absurdity of digital currencies and speculation',
    keywords: ['NFTs', 'blockchain', 'FOMO', 'decentralization']
  }
];

export default function Generate() {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [spicyMode, setSpicyMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewScenario, setPreviewScenario] = useState<any>(null);
  
  const { scenarios } = useScenarios();
  const personalityProfile = usePersonalityProfile(scenarios || []);

  const generateScenario = async () => {
    if (!selectedTopic && !customPrompt.trim()) {
      toast.error('Please select a topic or enter a custom prompt');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Get the base prompt template
      const basePrompt = "An engaging scenario in Trolley'd combines absurdist and nihilistic elements with the classic trolley problem, presenting humorous, sarcastic, or culturally relevant dilemmas that highlight the futility of choice, provoke thought on existential themes, and encourage social discussion through paradoxical or ironic outcomes. It should be concise, easy to grasp, blend everyday absurdities with philosophical twists, and offer two options that are equally ridiculous or morally ambiguous, making players question the point of deciding while enjoying the wit and creativity.";
      
      let topicContext = '';
      if (selectedTopic) {
        const topic = CULTURAL_TOPICS.find(t => t.id === selectedTopic);
        if (topic) {
          topicContext = `Focus on "${topic.title}" - ${topic.description}. Keywords: ${topic.keywords.join(', ')}.`;
        }
      }

      const personalityContext = personalityProfile ? 
        `The user tends toward ${personalityProfile.alignment} choices with ${personalityProfile.nihilismLevel.toFixed(1)}/5 nihilism level and shows ${personalityProfile.choicePattern} decision patterns.` : '';

      const spicyContext = spicyMode ? 
        'Make this scenario more controversial, edgy, and thought-provoking. Include darker humor and more morally ambiguous choices.' : '';

      const fullPrompt = `${basePrompt}

${topicContext}

${personalityContext}

${spicyContext}

${customPrompt ? `Custom request: ${customPrompt}` : ''}

Generate a trolley problem scenario in this exact JSON format:
{
  "id": "GEN_[TOPIC]_[TIMESTAMP]",
  "title": "Brief catchy title",
  "description": "2-3 sentence scenario description with absurdist elements",
  "track_a": "Brief description of option A outcome",
  "track_b": "Brief description of option B outcome",
  "theme": "Main theme/topic",
  "tags": ["relevant", "tags"]
}`;

      // For now, create a mock scenario since we're not implementing Perplexity yet
      const mockScenario = {
        id: `GEN_${selectedTopic || 'CUSTOM'}_${Date.now()}`,
        title: selectedTopic ? 
          `The ${CULTURAL_TOPICS.find(t => t.id === selectedTopic)?.title} Dilemma` :
          'Custom Moral Paradox',
        description: `A runaway trolley is heading toward ${selectedTopic ? 'a group of social media influencers livestreaming their morning routine' : 'a crowd of people'}. You can pull a lever to divert it to another track where ${spicyMode ? 'something equally absurd but more controversial awaits' : 'a different moral conundrum presents itself'}. Either choice seems pointless in the grand scheme of cosmic insignificance, but here we are.`,
        track_a: selectedTopic === 'social-media' ? 'Save the influencers but destroy a server farm hosting cat videos' : 'Save the crowd but crash into a philosophy classroom',
        track_b: selectedTopic === 'social-media' ? 'Let the livestream end but preserve digital cat culture' : 'Let fate decide while pondering determinism',
        theme: selectedTopic || 'existential',
        tags: selectedTopic ? CULTURAL_TOPICS.find(t => t.id === selectedTopic)?.keywords || [] : ['custom', 'philosophical']
      };

      setPreviewScenario(mockScenario);
      toast.success('Scenario generated! Preview it below.');
      
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error('Failed to generate scenario. Try again?');
    } finally {
      setIsGenerating(false);
    }
  };

  const addToQueue = () => {
    if (!previewScenario) return;

    // Add to localStorage for immediate use
    const existingCustom = JSON.parse(localStorage.getItem('customScenarios') || '[]');
    existingCustom.push(previewScenario);
    localStorage.setItem('customScenarios', JSON.stringify(existingCustom));

    toast.success('Scenario added to your queue!');
    setPreviewScenario(null);
    setSelectedTopic('');
    setCustomPrompt('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Generate Trolley Scenarios</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create custom trolley problems tailored to contemporary cultural anxieties, 
          personal philosophical leanings, and the existential dread of modern life.
        </p>
      </div>

      {personalityProfile && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 className="font-semibold mb-3">Your Personality Profile</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Dominant axis:</span> {personalityProfile.dominantAxis}
            </div>
            <div>
              <span className="text-muted-foreground">Nihilism level:</span> {personalityProfile.nihilismLevel.toFixed(1)}/5
            </div>
            <div>
              <span className="text-muted-foreground">Choice pattern:</span> {personalityProfile.choicePattern}
            </div>
            <div>
              <span className="text-muted-foreground">Total scenarios:</span> {personalityProfile.totalChoices}
            </div>
          </div>
          {personalityProfile.badges.length > 0 && (
            <div className="mt-3">
              <span className="text-muted-foreground text-sm">Badges:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {personalityProfile.badges.map((badge, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-primary/10 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      <div className="grid gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Cultural Topics</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="spicy-mode" className="text-sm">Spicy Mode</Label>
              <Switch
                id="spicy-mode"
                checked={spicyMode}
                onCheckedChange={setSpicyMode}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CULTURAL_TOPICS.map((topic) => (
              <Card
                key={topic.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedTopic === topic.id ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedTopic(selectedTopic === topic.id ? '' : topic.id)}
              >
                <h4 className="font-medium mb-2">{topic.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                <div className="flex flex-wrap gap-1">
                  {topic.keywords.slice(0, 3).map((keyword, i) => (
                    <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">Custom Prompt</Label>
          <Textarea
            placeholder="Describe your own scenario idea... (e.g., 'A trolley problem about choosing between saving a coffee shop or a co-working space')"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="min-h-20"
          />
        </div>

        <Button 
          onClick={generateScenario} 
          disabled={isGenerating || (!selectedTopic && !customPrompt.trim())}
          className="w-full"
          size="lg"
        >
          {isGenerating ? 'Generating...' : 'Generate Scenario'}
        </Button>
      </div>

      {previewScenario && (
        <Card className="p-6 space-y-4 border-primary/30 bg-primary/5">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">Generated Scenario Preview</h3>
            <span className="text-xs bg-primary/20 px-2 py-1 rounded">{previewScenario.theme}</span>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">{previewScenario.title}</h4>
            <p className="text-muted-foreground">{previewScenario.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-background rounded-lg border">
                <div className="text-xs font-semibold text-muted-foreground mb-1">TRACK A</div>
                <div className="text-sm">{previewScenario.track_a}</div>
              </div>
              <div className="p-3 bg-background rounded-lg border">
                <div className="text-xs font-semibold text-muted-foreground mb-1">TRACK B</div>
                <div className="text-sm">{previewScenario.track_b}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={addToQueue} className="flex-1">
              Add to Queue
            </Button>
            <Button 
              variant="outline" 
              onClick={generateScenario}
              disabled={isGenerating}
              className="flex-1"
            >
              Regenerate
            </Button>
          </div>
        </Card>
      )}

      {spicyMode && (
        <div className="text-center text-sm text-muted-foreground bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          🌶️ Spicy Mode is enabled - scenarios may contain more controversial or edgy content
        </div>
      )}
    </div>
  );
}