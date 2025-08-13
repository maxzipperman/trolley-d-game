import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useScenarios } from './useScenarios';

describe('useScenarios', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns scenarios on success', async () => {
    const data = [{ id: '1', title: 't', track_a: 'a', track_b: 'b' }];
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ json: () => Promise.resolve(data) })) as any);
    const { result } = renderHook(() => useScenarios());
    await waitFor(() => expect(result.current.scenarios).toEqual(data));
    expect(result.current.error).toBeNull();
  });

  it('reports error on failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('fail'))));
    const { result } = renderHook(() => useScenarios());
    await waitFor(() => expect(result.current.error).toBe('Failed to load scenarios'));
    expect(result.current.scenarios).toBeNull();
  });
});
