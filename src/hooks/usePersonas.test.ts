import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePersonas } from './usePersonas';

describe('usePersonas', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns personas on success', async () => {
    const data = [{ name: 'Alice' }];
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ json: () => Promise.resolve(data) })) as any);
    const { result } = renderHook(() => usePersonas());
    await waitFor(() => expect(result.current.personas).toEqual(data));
    expect(result.current.error).toBeNull();
  });

  it('reports error on failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('fail'))));
    const { result } = renderHook(() => usePersonas());
    await waitFor(() => expect(result.current.error).toBe('Failed to load personas'));
    expect(result.current.personas).toBeNull();
  });
});
