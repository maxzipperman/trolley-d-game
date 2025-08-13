import { render, screen } from '@testing-library/react';
import ScenarioCard from '@/components/ScenarioCard';
import type { Scenario } from '@/types';

vi.mock('@/hooks/usePersonas', () => ({
  usePersonas: () => ({ personas: [] })
}));
vi.mock('@/hooks/useDecisions', () => ({
  useDecisions: () => ({ decisions: [] })
}));

test('renders procedural images for both tracks', () => {
  const scenario: Scenario = {
    id: '1',
    title: 'Test',
    track_a: 'Track A desc',
    track_b: 'Track B desc',
    tags: ['logistics']
  };
  render(<ScenarioCard scenario={scenario} onPick={() => {}} />);
  const imgs = screen.getAllByRole('img', { name: /track illustration/i });
  expect(imgs).toHaveLength(2);
});
