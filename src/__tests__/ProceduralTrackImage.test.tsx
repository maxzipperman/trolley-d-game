import { render } from '@testing-library/react';
import ProceduralTrackImage from '@/components/procedural/ProceduralTrackImage';
import type { Tag } from '@/types';

test('procedural image is deterministic with seed', () => {
  const tags: Tag[] = ['logistics', 'identity'];
  const { container: first } = render(<ProceduralTrackImage tags={tags} seed={1} />);
  const { container: second } = render(<ProceduralTrackImage tags={tags} seed={1} />);
  const { container: third } = render(<ProceduralTrackImage tags={tags} seed={2} />);
  expect(first.innerHTML).toBe(second.innerHTML);
  expect(first.innerHTML).not.toBe(third.innerHTML);
});

test('procedural image has accessible role and label', () => {
  const tags: Tag[] = ['logistics'];
  const { getByRole } = render(<ProceduralTrackImage tags={tags} />);
  getByRole('img', { name: /track illustration/i });
});
