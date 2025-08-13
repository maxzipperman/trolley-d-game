import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRationales, type Rationale } from '@/hooks/useRationales';

const mockData: Rationale[] = [
  { id: '1', tone: 'sarcastic', nihilism: 1, text: 'one', tags: ['bureaucracy'] },
  { id: '2', tone: 'deadpan', nihilism: 2, text: 'two', tags: ['absurd'] },
];

vi.mock('@/utils/fetchWithRetry', () => ({
  fetchWithRetry: vi.fn(async () => mockData),
}));

describe('useRationales', () => {
  it('loads data and filters by tags', async () => {
    const { result } = renderHook(() => useRationales());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.rationales).toHaveLength(2);
    const filtered = result.current.getForTags(['absurd']);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });

  it('returns empty array when no tags match', async () => {
    const { result } = renderHook(() => useRationales());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.getForTags(['space'])).toEqual([]);
  });
});
