import type { Bounds } from './Bounds.ts';
import { Tile } from '../Tile.ts';
import type { Coordinates } from './Coordinates.ts';

export function overlapsAnyTile(tiles: Array<Tile>, tile: Tile) {
  return tiles.some((other) => overlapsTile(other, tile));
}

export function overlapsTile(tileA: Tile, tileB: Tile) {
  const overlapX =
    Math.min(tileA.topRightCorner.x, tileB.topRightCorner.x) -
    Math.max(tileA.topLeftCorner.x, tileB.topLeftCorner.x);

  const overlapY =
    Math.min(tileA.bottomLeftCorner.y, tileB.bottomLeftCorner.y) -
    Math.max(tileA.topLeftCorner.y, tileB.topLeftCorner.y);

  return overlapX > 0 && overlapY > 0;
}

export function overlapsCoordinate(tile: Tile, x: number, y: number) {
  const isInXRange = (x >= tile.topLeftCorner.x && x <= tile.topRightCorner.x);
  const isInYRange = (y >= tile.topLeftCorner.y && y <= tile.bottomLeftCorner.y);

  return isInXRange && isInYRange;
}

export function isInsideBounds(tile: Tile, bounds: Bounds) {
  // these two corners are enough to cover all possible ways to exit the bounds
  const tileCorners: Array<Coordinates> = [tile.topLeftCorner, tile.bottomRightCorner];

  for (const corner of tileCorners) {
    const isHorizontallyInside = corner.x >= 0 && corner.x <= bounds.width;
    const isVerticallyInside = corner.y >= 0 && corner.y <= bounds.height;

    if (!isHorizontallyInside || !isVerticallyInside) {
      return false;
    }
  }

  return true;
}
