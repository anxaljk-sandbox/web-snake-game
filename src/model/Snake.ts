import { Direction, directionDeltas } from './support/Direction.ts';
import { Path } from './Path.ts';
import { Tile } from './Tile.ts';
import { TileType } from './support/TileType.ts';
import type { Coordinates } from './support/Coordinates.ts';

export class Snake {
  static readonly #SNAKE_SPEED = 3;
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
  readonly #path: Path;
  #currentDirection = Direction.Right;

  constructor(xStartingPoint: number, yStartingPoint: number) {
    this.body = [new Tile(TileType.Square, xStartingPoint, yStartingPoint)];

    let snakeEyes: Array<Tile> = [];
    for (let i = 0; i <= 1; i++) {
      snakeEyes.push(new Tile(TileType.Square, this.body[0].xPosition, this.body[0].yPosition, Snake.#SNAKE_EYE_SIZE));
    }
    this.#snakeEyes = snakeEyes;

    this.#path = new Path();
    this.turn(this.#currentDirection)
  }

  get head() {
    return this.body[0];
  }

  get tail() {
    return this.body[this.body.length - 1];
  }

  get length() {
    return this.body.length;
  }

  get direction() {
    return this.#currentDirection;
  }

  turn(newDirection: Direction) {
    this.#path.turn({ x: this.head.xPosition, y: this.head.yPosition }, newDirection);
    this.#currentDirection = newDirection;
  }

  grow() {
    const position = this.#path.getPositionFrom(
      { x: this.tail.xPosition, y: this.tail.yPosition },
      this.tail.size,
      false
    );

    if (position !== undefined) {
      this.body.push(new Tile(this.tail.tileType, position.x, position.y));
    }
  }

  move() {
    this.#moveHead()

    for (let i = 1; i < this.length; i++) {
      const newPosition = this.#path.getPositionFrom(
        { x: this.body[i].xPosition, y: this.body[i].yPosition },
        Snake.#SNAKE_SPEED,
        true
      )

      if (newPosition !== undefined) {
        this.body[i].xPosition = newPosition.x;
        this.body[i].yPosition = newPosition.y;
      } else {
        throw Error(`Cannot move body at index ${i}`);
      }
    }

    this.#path.extendTo({ x: this.head.xPosition, y: this.head.yPosition });
  }

  getSnakeEyes() {
    const snakeHead = this.body[0];
    const offsets = Snake.#EYE_OFFSETS[this.#currentDirection];

    this.#snakeEyes.forEach((eye, i) => {
      eye.xPosition = snakeHead.xPosition + offsets[i].x;
      eye.yPosition = snakeHead.yPosition + offsets[i].y;
    });

    return this.#snakeEyes;
  }

  #moveHead() {
    const delta = directionDeltas[this.#currentDirection];
    this.head.xPosition += delta.x * Snake.#SNAKE_SPEED;
    this.head.yPosition += delta.y * Snake.#SNAKE_SPEED;
  }
}
