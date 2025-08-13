import { countAB, computeAxes } from '@/utils/scoring';
import type { Scenario } from '@/types';

test('countAB tallies A and B choices', () => {
  const counts = countAB({ s1: 'A', s2: 'B', s3: 'skip' });
  expect(counts).toEqual({ A: 1, B: 1 });
});

test('computeAxes scores based on tags and choice text', () => {
  const scenarios: Scenario[] = [
    {
      id: '1',
      title: 'One',
      track_a: 'Hit the cart',
      track_b: 'Help them',
      tags: ['bureaucracy'],
    },
    {
      id: '2',
      title: 'Two',
      track_a: 'Tow the car',
      track_b: 'Leave it',
      tags: ['absurd'],
    },
  ];
  const answers = { '1': 'A', '2': 'B' } as const;
  const axes = computeAxes(answers, scenarios);
  expect(axes.order).toBe(1);
  expect(axes.chaos).toBe(1);
  expect(axes.mischief).toBe(1);
  expect(axes.mercy).toBe(1);
});

