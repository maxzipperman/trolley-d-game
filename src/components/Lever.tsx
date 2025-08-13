import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { usePersonas } from '@/hooks/usePersonas';
import { useDecisions } from '@/hooks/useDecisions';

interface LeverProps {
  onChoice: (choice: 'A' | 'B', rationale?: string) => void;
  disabled?: boolean;
  scenario?: {
    id?: string;
    title?: string;
    track_a?: string;
    track_b?: string;
  };
}

const DEFAULT_RATIONALES = [
  { text: "Because I'm optimizing for the greater good... obviously.", nihilism: 1 },
  { text: "Meh, they're all doomed anyway. Might as well pick randomly.", nihilism: 3 },
  { text: "Nothing matters in the heat death of the universe, but this felt right.", nihilism: 4 },
  { text: "I flipped a mental coin. Free will is an illusion anyway.", nihilism: 5 }
];

export const Lever: React.FC<LeverProps> = ({ onChoice, disabled, scenario }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showPersonaChoice, setShowPersonaChoice] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<'A' | 'B' | null>(null);
  const [leverPosition, setLeverPosition] = useState(0); // -1 = A, 0 = center, 1 = B
  const [isDragging, setIsDragging] = useState(false);
  const [rationales, setRationales] = useState<any[]>([]);
  const leverRef = useRef<HTMLDivElement>(null);
  const { personas } = usePersonas();
  const { decisions } = useDecisions();

  // Load rationales from static file
  useEffect(() => {
    fetch('/data/rationales.json')
      .then(r => r.json())
      .then(data => setRationales(data))
      .catch(console.error);
  }, []);

  const playCreakSound = () => {
    // Create a creaky, rusty lever sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create multiple oscillators for complex rusty sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
    const noiseSource = audioContext.createBufferSource();
    
    // Generate noise for rust/friction effect
    const noiseArray = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseArray.length; i++) {
      noiseArray[i] = (Math.random() * 2 - 1) * 0.1;
    }
    noiseSource.buffer = noiseBuffer;
    
    // Create gain nodes
    const gainNode1 = audioContext.createGain();
    const gainNode2 = audioContext.createGain();
    const noiseGain = audioContext.createGain();
    
    // Connect audio graph
    oscillator1.connect(gainNode1);
    oscillator2.connect(gainNode2);
    noiseSource.connect(noiseGain);
    gainNode1.connect(audioContext.destination);
    gainNode2.connect(audioContext.destination);
    noiseGain.connect(audioContext.destination);
    
    // Set frequencies for creaky sound
    oscillator1.frequency.setValueAtTime(120, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.3);
    
    oscillator2.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
    
    // Set gain envelopes
    gainNode1.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    gainNode2.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    noiseGain.gain.setValueAtTime(0.05, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // Start and stop
    oscillator1.start();
    oscillator2.start();
    noiseSource.start();
    oscillator1.stop(audioContext.currentTime + 0.4);
    oscillator2.stop(audioContext.currentTime + 0.4);
    noiseSource.stop(audioContext.currentTime + 0.3);
  };

  const triggerHaptics = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  const handleLeverClick = (choice: 'A' | 'B') => {
    if (disabled) return;
    
    playCreakSound();
    triggerHaptics();
    
    setPendingChoice(choice);
    setLeverPosition(choice === 'A' ? -1 : 1);
    setShowDialog(true);
  };

  const handleRationaleSelect = (rationale: string) => {
    if (pendingChoice) {
      onChoice(pendingChoice, rationale);
      setShowDialog(false);
      setShowPersonaChoice(true);
    }
  };

  const closePersonaDialog = () => {
    setShowPersonaChoice(false);
    setPendingChoice(null);
    setLeverPosition(0);
  };

  // Get persona choices for current scenario
  const scenarioPersonaChoices = scenario 
    ? decisions?.filter(d => d.scenarioId === scenario.id) || []
    : [];
    
  const personalityOptions = rationales.filter(r => r.category !== 'custom');

  return (
    <>
      <div className="flex flex-col items-center gap-6 p-8 bg-card rounded-lg border">
        {/* Track Labels */}
        {scenario && (
          <div className="w-full max-w-md space-y-3">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="text-xs font-semibold text-muted-foreground mb-1">TRACK A</div>
                <div className="text-sm font-medium">{scenario.track_a}</div>
              </div>
              <div className="flex-1 p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="text-xs font-semibold text-muted-foreground mb-1">TRACK B</div>
                <div className="text-sm font-medium">{scenario.track_b}</div>
              </div>
            </div>
          </div>
        )}

        {/* Stick Figure */}
        <div className="relative">
          <svg width="140" height="120" viewBox="0 0 140 120" className="text-foreground">
            {/* Body */}
            <circle cx="70" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="70" y1="35" x2="70" y2="80" stroke="currentColor" strokeWidth="2" />
            
            {/* Arms - animated based on lever position */}
            <line x1="70" y1="50" x2="50" y2="40" stroke="currentColor" strokeWidth="2" />
            <line 
              x1="70" 
              y1="50" 
              x2={leverPosition === 0 ? "90" : leverPosition < 0 ? "85" : "95"} 
              y2={leverPosition === 0 ? "40" : leverPosition < 0 ? "35" : "45"} 
              stroke="currentColor" 
              strokeWidth="2"
              className="transition-all duration-500 ease-in-out"
              style={{ transformOrigin: '70px 50px' }}
            />
            
            {/* Legs */}
            <line x1="70" y1="80" x2="55" y2="105" stroke="currentColor" strokeWidth="2" />
            <line x1="70" y1="80" x2="85" y2="105" stroke="currentColor" strokeWidth="2" />
            
            {/* Effort lines when pushing */}
            {leverPosition !== 0 && (
              <>
                <line x1="75" y1="30" x2="78" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                <line x1="75" y1="32" x2="79" y2="29" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                <line x1="76" y1="34" x2="80" y2="31" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              </>
            )}
          </svg>
          
          {/* Speech bubble */}
          {!disabled && (
            <div className="absolute -top-10 left-24 bg-background border rounded-lg px-3 py-2 text-sm whitespace-nowrap shadow-lg">
              "This lever's seen better days..."
              <div className="absolute -bottom-1 left-4 w-2 h-2 bg-background border-l border-b rotate-45"></div>
            </div>
          )}
        </div>

        {/* Enhanced Lever Mechanism */}
        <div className="relative w-40 h-56 bg-gradient-to-b from-muted to-muted/80 rounded-lg border border-border/50 flex flex-col items-center justify-center shadow-lg">
          {/* Rust effects */}
          <div className="absolute inset-0 rounded-lg opacity-20">
            <div className="absolute top-2 left-2 w-2 h-1 bg-destructive/60 rounded-full"></div>
            <div className="absolute top-8 right-3 w-1 h-2 bg-destructive/40 rounded-full"></div>
            <div className="absolute bottom-12 left-4 w-3 h-1 bg-destructive/50 rounded-full"></div>
          </div>
          
          {/* Track indicators */}
          <div className="absolute -left-20 top-6 text-sm font-bold text-primary">← A</div>
          <div className="absolute -left-20 bottom-6 text-sm font-bold text-primary">← B</div>
          
          {/* Lever track/slot */}
          <div className="absolute inset-x-4 top-8 bottom-8 bg-background/50 rounded-full border border-border/30"></div>
          
          {/* Lever handle with rust texture */}
          <div 
            ref={leverRef}
            className={`absolute w-12 h-16 bg-gradient-to-b from-primary to-primary/80 rounded-lg cursor-pointer transition-all duration-500 shadow-md border border-primary/30
              ${isDragging ? 'scale-110 shadow-lg' : ''} 
              ${leverPosition !== 0 ? 'shadow-xl' : ''}
              hover:scale-105`}
            style={{
              transform: `translateY(${leverPosition * 50}px) ${leverPosition !== 0 ? 'rotate(2deg)' : ''}`,
              boxShadow: leverPosition !== 0 ? '0 8px 25px rgba(0,0,0,0.15)' : undefined
            }}
            onClick={() => {
              if (leverPosition < 0) handleLeverClick('A');
              else if (leverPosition > 0) handleLeverClick('B');
            }}
          >
            {/* Handle grip texture */}
            <div className="absolute inset-x-2 inset-y-1 border border-primary-foreground/20 rounded"></div>
            <div className="absolute inset-x-3 inset-y-2 border border-primary-foreground/10 rounded"></div>
          </div>
          
          {/* Click zones with visual feedback */}
          <button
            className="absolute top-0 w-full h-24 hover:bg-primary/5 rounded-t-lg transition-all duration-200 group"
            onClick={() => handleLeverClick('A')}
            disabled={disabled}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
              Pull Up
            </div>
          </button>
          <button
            className="absolute bottom-0 w-full h-24 hover:bg-primary/5 rounded-b-lg transition-all duration-200 group"
            onClick={() => handleLeverClick('B')}
            disabled={disabled}
          >
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
              Push Down
            </div>
          </button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          This old lever controls the track switch.<br />
          <span className="text-xs">Pull up for Track A, push down for Track B</span>
        </p>
      </div>

      {/* Rationale Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Why did you choose Track {pendingChoice}?</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {personalityOptions.map((rationale, index) => (
              <Card 
                key={index}
                className="p-3 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleRationaleSelect(rationale.text)}
              >
                <p className="text-sm">{rationale.text}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground capitalize">{rationale.category}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: rationale.nihilism }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-muted-foreground rounded-full" />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Persona Choice Revelation Dialog */}
      <Dialog open={showPersonaChoice} onOpenChange={setShowPersonaChoice}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>What would the personas choose?</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {pendingChoice && (
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">You chose Track {pendingChoice}</p>
              </div>
            )}
            
            {scenarioPersonaChoices.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Persona breakdown:</h4>
                {['A', 'B'].map(choice => {
                  const personasForChoice = scenarioPersonaChoices.filter(d => d.choice === choice);
                  const percentage = Math.round((personasForChoice.length / scenarioPersonaChoices.length) * 100);
                  
                  return personasForChoice.length > 0 ? (
                    <div key={choice} className={`p-3 rounded-lg border ${choice === pendingChoice ? 'bg-primary/10 border-primary/30' : 'bg-muted/50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Track {choice}</span>
                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {personasForChoice.slice(0, 3).map((decision, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{decision.persona}</span>
                            {decision.rationale && (
                              <span className="italic truncate ml-2 max-w-32">"{decision.rationale}"</span>
                            )}
                          </div>
                        ))}
                        {personasForChoice.length > 3 && (
                          <div className="text-muted-foreground">+{personasForChoice.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center">No persona data available for this scenario.</p>
            )}
            
            <Button onClick={closePersonaDialog} className="w-full">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};