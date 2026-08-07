import type { Tile } from '../model/Tile.ts';

export function overlapsTile(tileA: Tile, tileB: Tile): boolean {
  const overlapX =
    Math.min(tileA.topRightCorner.x, tileB.topRightCorner.x) -
    Math.max(tileA.topLeftCorner.x, tileB.topLeftCorner.x);

  const overlapY =
    Math.min(tileA.bottomLeftCorner.y, tileB.bottomLeftCorner.y) -
    Math.max(tileA.topLeftCorner.y, tileB.topLeftCorner.y);

  return overlapX > 0 && overlapY > 0;
}

export function overlapsCoordinate(tile: Tile, x: number, y: number): boolean {
  const isInXRange = (x >= tile.topLeftCorner.x && x <= tile.topRightCorner.x);
  const isInYRange = (y >= tile.topLeftCorner.y && y <= tile.bottomLeftCorner.y);

  return isInXRange && isInYRange;
}
