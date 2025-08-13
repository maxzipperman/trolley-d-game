import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Play from '@/pages/Play';

vi.mock('@/hooks/usePersonas', () => ({
  usePersonas: () => ({ personas: [] }),
}));

const scenarios = [
  { id: '1', title: 'S1', track_a: 'A1', track_b: 'B1' },
  { id: '2', title: 'S2', track_a: 'A2', track_b: 'B2' },
];

vi.mock('@/hooks/useScenarios', () => ({
  useScenarios: () => ({ scenarios, error: null, loading: false, retry: vi.fn() }),
}));

describe('Play flow', () => {
  beforeEach(() => localStorage.clear());

  test('skip and review skipped', async () => {
    render(
      <MemoryRouter initialEntries={['/play']}>
        <Play />
      </MemoryRouter>
    );

    expect(screen.getByText(/skipped 0/i)).toBeInTheDocument();
    expect(screen.getByText(/remaining 2/i)).toBeInTheDocument();
    expect(screen.getByTestId('progress-announcer').textContent).toMatch('Question 1 of 2');

    await userEvent.click(screen.getByText(/skip this scenario/i));

    expect(await screen.findByText(/skipped 1/i)).toBeInTheDocument();
    expect(screen.getByText(/remaining 1/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /review skipped/i })).toBeInTheDocument();
    expect(screen.getByTestId('progress-announcer').textContent).toMatch('1 skipped');

    await userEvent.click(screen.getByRole('button', { name: /review skipped/i }));
    expect(await screen.findByRole('heading', { name: 'S1' })).toBeInTheDocument();
  });
});

