export class Tile {
  static readonly #DEFAULT_TILE_SIZE = 70;

  readonly #width: number;
  readonly #height: number;

  #xPosition: number;
  #yPosition: number;

  constructor(xPosition: number, yPosition: number, width?: number, height?: number) {
    this.#xPosition = xPosition;
    this.#yPosition = yPosition;
    this.#width = width ?? Tile.#DEFAULT_TILE_SIZE;
    this.#height = height ?? Tile.#DEFAULT_TILE_SIZE;
  }

  get xPosition() {
    return this.#xPosition;
  }

  set xPosition(value: number) {
    this.#xPosition = value;
  }

  get yPosition() {
    return this.#yPosition;
  }

  set yPosition(value: number) {
    this.#yPosition = value;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }
}
