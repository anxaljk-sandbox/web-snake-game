import type { Coordinates } from './Coordinates.ts';

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export const oppositeDirection: Record<Direction, Direction> = {
  [Direction.Up]: Direction.Down,
  [Direction.Down]: Direction.Up,
  [Direction.Left]: Direction.Right,
  [Direction.Right]: Direction.Left,
};

// -1 = backwards, 0 = don't move on this axis, 1 = forwards
export const directionDeltas: Record<Direction, Coordinates> = {
  [Direction.Up]: { x: 0, y: -1, },
  [Direction.Down]: { x: 0, y: 1, },
  [Direction.Left]: { x: -1, y: 0, },
  [Direction.Right]: { x: 1, y: 0, },
};
