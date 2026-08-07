import { Direction } from './Direction.ts';
import { Tile } from './Tile.ts';
import { TileType } from './TileType.ts';
import type { Coordinates } from './Coordinates.ts';

export class Snake {
  static readonly #SNAKE_EYE_SIZE = 20;
  static readonly #EYE_OFFSETS: Record<Direction, Array<Coordinates>> = {
    [Direction.Up]: [
      { x: -5, y: 15, },
      { x: 55, y: 15, }
    ],
    [Direction.Down]: [
      { x: -5, y: 35, },
      { x: 55, y: 35, }
    ],
    [Direction.Left]: [
      { x: 15, y: 55, },
      { x: 15, y: -5, }
    ],
    [Direction.Right]: [
      { x: 35, y: 55, },
      { x: 35, y: -5, }
    ],
  };

  readonly body: Array<Tile>;
  readonly #snakeEyes: Array<Tile>;

  constructor(xStartingPoint: number, yStartingPoint: number) {
    this.body = [new Tile(TileType.Square, xStartingPoint, yStartingPoint)];

    let snakeEyes: Array<Tile> = [];
    for (let i = 0; i <= 1; i++) {
      snakeEyes.push(new Tile(TileType.Square, this.body[0].xPosition, this.body[0].yPosition, Snake.#SNAKE_EYE_SIZE));
    }
    this.#snakeEyes = snakeEyes;
  }

  get head(): Tile {
    return this.body[0];
  }

  getSnakeEyes(currentDirection: Direction) {
    const snakeHead = this.body[0];
    const offsets = Snake.#EYE_OFFSETS[currentDirection];

    this.#snakeEyes.forEach((eye, i) => {
      eye.xPosition = snakeHead.xPosition + offsets[i].x;
      eye.yPosition = snakeHead.yPosition + offsets[i].y;
    });

    return this.#snakeEyes;
  }
}
