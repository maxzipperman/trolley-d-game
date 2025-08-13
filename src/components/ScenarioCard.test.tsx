import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ScenarioCard from './ScenarioCard';
import type { Scenario } from '@/types';

const scenario: Scenario = {
  id: '1',
  title: 'Title',
  track_a: 'Do A',
  track_b: 'Do B',
  responses: [{ avatar: 'NPC', choice: 'A', rationale: 'Because' }],
};

describe('ScenarioCard', () => {
  it('handles A/B choices', () => {
    const onPick = vi.fn();
    render(<ScenarioCard scenario={scenario} onPick={onPick} />);
    fireEvent.click(screen.getByRole('button', { name: /choose track a/i }));
    fireEvent.click(screen.getByRole('button', { name: /choose track b/i }));
    expect(onPick).toHaveBeenCalledWith('A');
    expect(onPick).toHaveBeenCalledWith('B');
  });

  it('toggles NPC samples', () => {
    render(<ScenarioCard scenario={scenario} onPick={() => {}} />);
    const toggle = screen.getByRole('button', { name: /see sample npc takes/i });
    expect(screen.queryByText('NPC')).toBeNull();
    fireEvent.click(toggle);
    expect(screen.queryByText('NPC')).not.toBeNull();
  });
});
