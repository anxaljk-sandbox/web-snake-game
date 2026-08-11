import { TileType } from './support/TileType.ts';
import type { Coordinates } from './support/Coordinates.ts';

export class Tile {
  static readonly #DEFAULT_TILE_SIZE = 70;

  readonly tileType: TileType;
  xPosition: number;
  yPosition: number;
  readonly size: number;

  constructor(tileType: TileType, xPosition: number, yPosition: number, size?: number) {
    this.tileType = tileType;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.size = size ?? Tile.#DEFAULT_TILE_SIZE;
  }

  get radius() {
    return this.size / 2;
  }

  get topLeftCorner(): Coordinates {
    // a circle's xPosition & yPosition store its center, for a square they store the corner
    const offset = this.tileType === TileType.Circle ? this.radius : 0;

    return {
      x: this.xPosition - offset,
      y: this.yPosition - offset,
    };
  }

  get topRightCorner(): Coordinates {
    return {
      x: this.topLeftCorner.x + this.size,
      y: this.topLeftCorner.y,
    };
  }

  get bottomLeftCorner(): Coordinates {
    return {
      x: this.topLeftCorner.x,
      y: this.topLeftCorner.y + this.size,
    };
  }

  get bottomRightCorner(): Coordinates {
    return {
      x: this.topLeftCorner.x + this.size,
      y: this.topLeftCorner.y + this.size,
    };
  }
}
