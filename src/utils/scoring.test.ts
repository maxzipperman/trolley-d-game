import { describe, expect, it } from 'vitest';
import { countAB, computeAxes, computeBaseCounts } from './scoring';
import type { Scenario } from '@/types';

describe('countAB', () => {
  it('counts A and B choices', () => {
    const answers = { one: 'A', two: 'B', three: 'skip' } as const;
    expect(countAB(answers)).toEqual({ A: 1, B: 1 });
  });
});

describe('computeAxes', () => {
  it('derives axis totals from scenarios', () => {
    const scenarios: Scenario[] = [
      { id: '1', title: 's1', track_a: 'Help', track_b: 'Harm', tags: ['bureaucracy', 'reality'] },
      { id: '2', title: 's2', track_a: 'Aid', track_b: 'Tow', tags: ['absurd', 'identity'] },
      { id: '3', title: 's3', track_a: 'foo', track_b: 'bar', tags: ['space'] },
    ];
    const answers = { '1': 'A', '2': 'B', '3': 'skip' } as const;
    const axes = computeAxes(answers, scenarios);
    expect(axes).toEqual({ order: 1, chaos: 1, material: 2, social: 1, mercy: 1, mischief: 1 });
  });
});

describe('computeBaseCounts', () => {
  it('maps countAB to legacy structure', () => {
    const answers = { a: 'A', b: 'B', c: 'B' } as const;
    expect(computeBaseCounts(answers)).toEqual({ scoreA: 1, scoreB: 2 });
  });
});
