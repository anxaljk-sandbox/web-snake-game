import type { PathElement } from './support/PathElement.ts';
import type { Coordinates } from './support/Coordinates.ts';
import { Direction, directionDeltas, oppositeDirection } from './support/Direction.ts';

export class Path {
  readonly #pathElements: Array<PathElement>;

  constructor() {
    this.#pathElements = [];
  }

  extendTo(coordinates: Coordinates) {
    const lastEntry = this.#pathElements.at(-1);
    if (lastEntry?.from.x === coordinates.x && lastEntry?.from.y === coordinates.y) return;
    if (lastEntry) lastEntry.to = coordinates;
  }

  turn(turningPoint: Coordinates, direction: Direction) {
    this.#pathElements.push({
      from: turningPoint,
      to: turningPoint,
      direction,
    });
  }

  getPositionFrom(coordinates: Coordinates, distance: number, forward: boolean): Coordinates | undefined {
    let pathElement = this.#getPathElementAt(coordinates);
    if (!pathElement) return;

    const points = this.getPointsFrom(coordinates, distance, forward);
    if (points) {
      return points[points.length - 1];
    }
  }

  getPointsFrom(coordinates: Coordinates, distance: number, forward: boolean) {
    let pathElement = this.#getPathElementAt(coordinates);
    if (!pathElement) return;

    const points = [coordinates];
    let current = coordinates;
    let remaining = distance;

    while (remaining > 0 && pathElement) {
      const corner = forward ? pathElement.to : pathElement.from;
      const distanceToCorner = Math.abs(corner.x - current.x) + Math.abs(corner.y - current.y);

      if (distanceToCorner === 0) {
        pathElement = forward ? this.#next(pathElement) : this.#previous(pathElement);
        continue;
      }

      if (distanceToCorner >= remaining) {
        const delta = forward ? directionDeltas[pathElement.direction] : directionDeltas[oppositeDirection[pathElement.direction]];
        points.push({ x: current.x + delta.x * remaining, y: current.y + delta.y * remaining });
        return points;
      }

      points.push(corner);
      remaining -= distanceToCorner;
      current = corner;
      pathElement = forward ? this.#next(pathElement) : this.#previous(pathElement);
    }
    return points;
  }

  #getPathElementAt(coordinates: Coordinates) {
    for (let i = this.#pathElements.length - 1; i >= 0; i--) {
      if (this.#isBetweenCoordinates(coordinates, this.#pathElements[i].from, this.#pathElements[i].to ?? coordinates)) {
        return this.#pathElements[i];
      }
    }
  }

  #next(pathElement: PathElement) {
    const index = this.#pathElements.indexOf(pathElement);
    if (index === -1) return undefined;
    return this.#pathElements[index + 1];
  }

  #previous(pathElement: PathElement) {
    const index = this.#pathElements.indexOf(pathElement);
    if (index === -1) return undefined;
    return this.#pathElements[index - 1];
  }

  #isBetweenCoordinates(currentPosition: Coordinates, pointA: Coordinates, pointB: Coordinates) {
    const isHorizontallyAligned = Math.max(pointA.x, pointB.x) >= currentPosition.x && currentPosition.x >= Math.min(
      pointA.x,
      pointB.x);
    const isVerticallyAligned = Math.max(pointA.y, pointB.y) >= currentPosition.y && currentPosition.y >= Math.min(
      pointA.y,
      pointB.y);

    return isHorizontallyAligned && isVerticallyAligned;
  }
}
