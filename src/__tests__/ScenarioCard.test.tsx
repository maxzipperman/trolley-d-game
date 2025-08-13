import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import ScenarioCard from '@/components/ScenarioCard';

vi.mock('@/hooks/usePersonas', () => ({
  usePersonas: () => ({ personas: [] }),
}));

test('lever activation via buttons calls onPick', async () => {
  const onPick = vi.fn();
  const scenario = {
    id: '1',
    title: 'Test',
    track_a: 'A choice',
    track_b: 'B choice',
  } as const;
  render(<ScenarioCard scenario={scenario} onPick={onPick} />);

  await userEvent.click(screen.getByRole('button', { name: /choose track a/i }));
  expect(onPick).toHaveBeenCalledWith('A');

  await userEvent.click(screen.getByRole('button', { name: /choose track b/i }));
  expect(onPick).toHaveBeenCalledWith('B');
});

