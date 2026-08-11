import { Tile } from '../Tile.ts';
import { TileType } from './TileType.ts';
import { overlapsTile } from './collision.ts';
import type { Bounds } from './Bounds.ts';
import type { Coordinates } from './Coordinates.ts';

export function getCoordinatesOfRandomFreeTile(size: number, tileType: TileType, bounds: Bounds, occupied: Array<Tile>): Coordinates | undefined{
  // This is the amount of tiles that fit onto the canvas, but random sampling never proves that the canvas
  // is full, so it's still a heuristic.
  const maxPlacementAttempts = bounds.width / size * bounds.height / size;

  for (let attempt = 0; attempt < maxPlacementAttempts; attempt++) {
    const randomTile = getRandomTile(size, tileType, bounds);

    const isFree = occupied.every((tile) => !overlapsTile(randomTile, tile));

    if (isFree) return { x: randomTile.xPosition, y: randomTile.yPosition };
  }
}

function getRandomTile(size: number, tileType: TileType, bounds: Bounds) {
  const radius = tileType === TileType.Circle ? size / 2 : 0;

  // By making sure x and y are inside the canvas, we won't have to add a check for that later.
  const randomX = radius + Math.floor(Math.random() * (bounds.width - size));
  const randomY = radius + Math.floor(Math.random() * (bounds.height - size));

  return new Tile(tileType, randomX, randomY, size);
}
