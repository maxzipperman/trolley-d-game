import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

interface LeverProps {
  onChoice: (choice: 'A' | 'B', rationale?: string) => void;
  disabled?: boolean;
}

const DEFAULT_RATIONALES = [
  { text: "Because I'm optimizing for the greater good... obviously.", nihilism: 1 },
  { text: "Meh, they're all doomed anyway. Might as well pick randomly.", nihilism: 3 },
  { text: "Nothing matters in the heat death of the universe, but this felt right.", nihilism: 4 },
  { text: "I flipped a mental coin. Free will is an illusion anyway.", nihilism: 5 }
];

export const Lever: React.FC<LeverProps> = ({ onChoice, disabled }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<'A' | 'B' | null>(null);
  const [leverPosition, setLeverPosition] = useState(0); // -1 = A, 0 = center, 1 = B
  const [isDragging, setIsDragging] = useState(false);
  const leverRef = useRef<HTMLDivElement>(null);

  const playSound = () => {
    // Create a simple click sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const triggerHaptics = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  const handleLeverClick = (choice: 'A' | 'B') => {
    if (disabled) return;
    
    playSound();
    triggerHaptics();
    
    setPendingChoice(choice);
    setLeverPosition(choice === 'A' ? -1 : 1);
    setShowDialog(true);
  };

  const handleRationaleSelect = (rationale: string) => {
    if (pendingChoice) {
      onChoice(pendingChoice, rationale);
      setShowDialog(false);
      setPendingChoice(null);
      setLeverPosition(0);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-6 p-8 bg-card rounded-lg border">
        {/* Stick Figure */}
        <div className="relative">
          <svg width="120" height="100" viewBox="0 0 120 100" className="text-foreground">
            {/* Body */}
            <circle cx="60" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="60" y1="28" x2="60" y2="65" stroke="currentColor" strokeWidth="2" />
            
            {/* Arms */}
            <line x1="60" y1="40" x2="45" y2="30" stroke="currentColor" strokeWidth="2" />
            <line 
              x1="60" 
              y1="40" 
              x2={leverPosition === 0 ? "75" : leverPosition < 0 ? "75" : "75"} 
              y2={leverPosition === 0 ? "30" : leverPosition < 0 ? "25" : "35"} 
              stroke="currentColor" 
              strokeWidth="2"
              className="transition-all duration-300"
            />
            
            {/* Legs */}
            <line x1="60" y1="65" x2="45" y2="85" stroke="currentColor" strokeWidth="2" />
            <line x1="60" y1="65" x2="75" y2="85" stroke="currentColor" strokeWidth="2" />
          </svg>
          
          {/* Speech bubble */}
          {!disabled && (
            <div className="absolute -top-8 left-20 bg-background border rounded-lg px-3 py-1 text-sm whitespace-nowrap">
              "Why this choice?"
            </div>
          )}
        </div>

        {/* Lever Mechanism */}
        <div className="relative w-32 h-48 bg-muted rounded-lg border flex flex-col items-center justify-center">
          {/* Track labels */}
          <div className="absolute -left-16 top-4 text-sm font-medium">Track A</div>
          <div className="absolute -left-16 bottom-4 text-sm font-medium">Track B</div>
          
          {/* Lever handle */}
          <div 
            ref={leverRef}
            className={`absolute w-8 h-12 bg-primary rounded cursor-pointer transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}
            style={{
              transform: `translateY(${leverPosition * 40}px)`
            }}
            onClick={() => {
              if (leverPosition < 0) handleLeverClick('A');
              else if (leverPosition > 0) handleLeverClick('B');
            }}
          />
          
          {/* Click zones */}
          <button
            className="absolute top-0 w-full h-20 hover:bg-primary/10 rounded transition-colors"
            onClick={() => handleLeverClick('A')}
            disabled={disabled}
          />
          <button
            className="absolute bottom-0 w-full h-20 hover:bg-primary/10 rounded transition-colors"
            onClick={() => handleLeverClick('B')}
            disabled={disabled}
          />
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Pull the lever up for Track A, down for Track B
        </p>
      </div>

      {/* Rationale Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Why did you choose Track {pendingChoice}?</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {DEFAULT_RATIONALES.map((rationale, index) => (
              <Card 
                key={index}
                className="p-3 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleRationaleSelect(rationale.text)}
              >
                <p className="text-sm">{rationale.text}</p>
                <div className="flex justify-end mt-2">
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
    </>
  );
};