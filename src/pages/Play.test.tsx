import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Play from './Play';
import type { Scenario } from '@/types';
import { useScenarios } from '@/hooks/useScenarios';

vi.mock('@/hooks/useScenarios');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockedUseScenarios = useScenarios as unknown as vi.Mock;

describe('Play page', () => {
  const scenarios: Scenario[] = [
    { id: '1', title: 'One', track_a: 'A1', track_b: 'B1' },
    { id: '2', title: 'Two', track_a: 'A2', track_b: 'B2' },
  ];

  beforeEach(() => {
    mockedUseScenarios.mockReturnValue({ scenarios, loading: false });
    mockNavigate.mockReset();
    window.localStorage.clear();
  });

  it('picks A with left arrow', async () => {
    render(<MemoryRouter initialEntries={['/play']}><Play /></MemoryRouter>);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem('trolleyd-answers') || '{}');
      return stored['1'] === 'A';
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('picks B with right arrow', async () => {
    render(<MemoryRouter initialEntries={['/play']}><Play /></MemoryRouter>);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem('trolleyd-answers') || '{}');
      return stored['1'] === 'B';
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('skips with S key', async () => {
    render(<MemoryRouter initialEntries={['/play']}><Play /></MemoryRouter>);
    fireEvent.keyDown(window, { key: 's' });
    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem('trolleyd-answers') || '{}');
      return stored['1'] === 'skip';
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('navigates to first skipped scenario', () => {
    window.localStorage.setItem('trolleyd-answers', JSON.stringify({ '1': 'skip' }));
    render(<MemoryRouter initialEntries={['/play']}><Play /></MemoryRouter>);
    const review = screen.getByRole('button', { name: /review skipped/i });
    fireEvent.click(review);
    expect(mockNavigate).toHaveBeenCalledWith('/play?jump=1');
  });
});
