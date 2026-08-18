import type { Coordinates } from './Coordinates.ts';
import type { Direction } from './Direction.ts';

export type PathElement = {
  from: Coordinates;
  to?: Coordinates;
  direction: Direction;
}
