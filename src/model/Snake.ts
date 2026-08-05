import { Direction } from './Direction.ts';
import { Tile } from './Tile.ts';

export class Snake {
  static readonly #SNAKE_EYE_SIZE = 20;
  static readonly #EYE_OFFSETS = {
    [Direction.Up]: [{ deltaX: -5, deltaY: 15 }, { deltaX: 55, deltaY: 15 }],
    [Direction.Down]: [{ deltaX: -5, deltaY: 35 }, { deltaX: 55, deltaY: 35 }],
    [Direction.Left]: [{ deltaX: 15, deltaY: 55 }, { deltaX: 15, deltaY: -5 }],
    [Direction.Right]: [{ deltaX: 35, deltaY: 55 }, { deltaX: 35, deltaY: -5 }],
  };

  readonly #body: Array<Tile>;

  constructor(xStartingPoint: number, yStartingPoint: number) {
    this.#body = [new Tile(xStartingPoint, yStartingPoint)];
  }

  get body() {
    return this.#body;
  }

  getSnakeEyes(currentDirection: Direction) {
    let snakeEyes: Array<Tile> = [];

    for (let i = 0; i <= 1; i++) {
      snakeEyes.push(new Tile(this.#body[0].xPosition, this.#body[0].yPosition, Snake.#SNAKE_EYE_SIZE, Snake.#SNAKE_EYE_SIZE));
    }

    const offsets = Snake.#EYE_OFFSETS[currentDirection];
    snakeEyes.forEach((eye, i) => {
      eye.xPosition += offsets[i].deltaX;
      eye.yPosition += offsets[i].deltaY;
    });

    return snakeEyes;
  }
}
