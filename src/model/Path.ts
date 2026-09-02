import type { Coordinates } from './support/Coordinates.ts';
import { Direction, directionDeltas, oppositeDirection } from './support/Direction.ts';

type PathElement = {
  from: Coordinates;
  to: Coordinates;
  direction: Direction;
}

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

  setLength(length: number) {
    let remaining = length;

    for (let i = this.#pathElements.length - 1; i >= 0; i--) {
      const pathElement = this.#pathElements[i];
      const elementLength = this.#distanceBetween(pathElement.from, pathElement.to);

      if (elementLength < remaining) {
        remaining -= elementLength;
        continue;
      }

      const startOfPath = this.#movePoint(pathElement.to, oppositeDirection[pathElement.direction], remaining);
      this.#pathElements.splice(0, i + 1, { ...pathElement, from: startOfPath, });
      return;
    }

    const oldestElement = this.#pathElements[0];
    if (!oldestElement) return;

    this.#pathElements[0] = {
      ...oldestElement,
      from: this.#movePoint(oldestElement.from, oppositeDirection[oldestElement.direction], remaining),
    };
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
      const distanceToCorner = this.#distanceBetween(current, corner);

      if (distanceToCorner === 0) {
        pathElement = forward ? this.#next(pathElement) : this.#previous(pathElement);
        continue;
      }

      if (distanceToCorner >= remaining) {
        const direction = forward ? pathElement.direction : oppositeDirection[pathElement.direction];
        points.push(this.#movePoint(current, direction, remaining));
        return points;
      }

      points.push(corner);
      remaining -= distanceToCorner;
      current = corner;
      pathElement = forward ? this.#next(pathElement) : this.#previous(pathElement);
    }
    return points;
  }

  #distanceBetween(pointA: Coordinates, pointB: Coordinates) {
    return Math.abs(pointB.x - pointA.x) + Math.abs(pointB.y - pointA.y);
  }

  #movePoint(point: Coordinates, direction: Direction, distance: number): Coordinates {
    const delta = directionDeltas[direction];

    return {
      x: point.x + delta.x * distance,
      y: point.y + delta.y * distance,
    };
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
