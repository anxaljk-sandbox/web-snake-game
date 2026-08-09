import { Direction } from '../model/Direction';
import { Snake } from '../model/Snake.ts';
import { Tile } from '../model/Tile.ts';
import type { CanvasView } from '../view/CanvasView.ts';
import { TileType } from '../model/TileType.ts';
import type { Coordinates } from '../model/Coordinates.ts';
import { overlapsCoordinate, overlapsTile } from './collision-utils.ts';

export class SnakeGameController {
  // -1 = backwards, 0 = don't move on this axis, 1 = forwards
  static readonly #DIRECTION_DELTAS: Record<Direction, Coordinates> = {
    [Direction.Up]: { x: 0, y: -1, },
    [Direction.Down]: { x: 0, y: 1, },
    [Direction.Left]: { x: -1, y: 0, },
    [Direction.Right]: { x: 1, y: 0, },
  };
  static readonly #KEY_TO_DIRECTION: Record<string, Direction> = {
    ArrowUp: Direction.Up,
    ArrowDown: Direction.Down,
    ArrowLeft: Direction.Left,
    ArrowRight: Direction.Right,
  };
  static readonly #OPPOSITE_DIRECTION: Record<Direction, Direction> = {
    [Direction.Up]: Direction.Down,
    [Direction.Down]: Direction.Up,
    [Direction.Left]: Direction.Right,
    [Direction.Right]: Direction.Left,
  };
  static readonly #SNAKE_SPEED = 3;

  #canvasView: CanvasView;
  #snake: Snake;
  #currentFood: Tile;
  #isMoving = false;
  #currentDirection = Direction.Right;

  constructor(canvasView: CanvasView, xStartingPoint: number, yStartingPoint: number) {
    this.#canvasView = canvasView;

    this.#snake = new Snake(xStartingPoint, yStartingPoint);

    this.#currentFood = new Tile(TileType.Circle, this.#canvasView.canvasWidth - xStartingPoint, yStartingPoint + this.#snake.head.radius);
  }

  play() {
    this.#canvasView.clearRectangle();

    this.#drawFood();
    this.#drawSnake();

    if (this.#isMoving) {
      this.#moveSnake();
    }

    this.#handleEvents();

    // Passing this.play() would invoke it immediately and pass its void return value,
    // requestAnimationFrame, however, needs a function reference, not a call.
    window.requestAnimationFrame(() => this.play());
  }

  handleKeyDown(event: KeyboardEvent) {
    const newDirection = SnakeGameController.#KEY_TO_DIRECTION[event.key];

    if (newDirection === undefined || newDirection === SnakeGameController.#OPPOSITE_DIRECTION[this.#currentDirection]) {
      return;
    }

    this.#currentDirection = newDirection;
    this.#isMoving = true;
  }

  #drawFood(xPosition?: number, yPosition?: number) {
    if (xPosition !== undefined) {
      this.#currentFood.xPosition = xPosition;
    }
    if (yPosition !== undefined) {
      this.#currentFood.yPosition = yPosition;
    }
    this.#canvasView.drawCircle('red', this.#currentFood);
  }

  #drawSnake() {
    for (let tile of this.#snake.body) {
      this.#canvasView.drawRectangle('black', tile);
    }
    for (let eye of this.#snake.getSnakeEyes(this.#currentDirection)) {
      this.#canvasView.drawRectangle('white', eye);
    }
  }

  #moveSnake() {
    const delta = SnakeGameController.#DIRECTION_DELTAS[this.#currentDirection];

    for (const bodyPart of this.#snake.body) {
      bodyPart.xPosition += delta.x * SnakeGameController.#SNAKE_SPEED;
      bodyPart.yPosition += delta.y * SnakeGameController.#SNAKE_SPEED;
    }
  }

  #handleEvents() {
    const head = this.#snake.head;

    // Handle crash into the wall
    if (!this.#canvasView.isInsideCanvas(head)) {
      this.#isMoving = false;
      return;
    }

    // Handle snake eating food
    if (overlapsCoordinate(head, this.#currentFood.xPosition, this.#currentFood.yPosition)) {
      const newFoodCoordinates = this.#getCoordinatesOfRandomFreeTile();
      if (newFoodCoordinates === null) {
        this.#isMoving = false;
      } else {
        this.#drawFood(newFoodCoordinates.x, newFoodCoordinates.y);
      }
    }
  }

  #getCoordinatesOfRandomFreeTile(): Coordinates | null {
    // This is the amount of food-tiles that fit onto the canvas, but random sampling never proves that
    // the canvas is full, so it's still a heuristic.
    const maxFoodPlacementAttempts =
      this.#canvasView.canvasWidth / this.#currentFood.size * this.#canvasView.canvasWidth / this.#currentFood.size;

    for (let attempt = 0; attempt < maxFoodPlacementAttempts; attempt++) {
      // By making sure x and y are inside the canvas, we won't have to add a check for that later.
      const randomX = this.#currentFood.radius + Math.floor(Math.random() * (this.#canvasView.canvasWidth - this.#currentFood.size));
      const randomY = this.#currentFood.radius + Math.floor(Math.random() * (this.#canvasView.canvasHeight - this.#currentFood.size));

      const randomTile = new Tile(TileType.Circle, randomX, randomY);

      // Make sure the food is not inside the snake.
      const isFree = this.#snake.body.every((tile) => !overlapsTile(randomTile, tile));

      if (isFree) {
        return {
          x: randomTile.xPosition,
          y: randomTile.yPosition,
        };
      }
    }

    return null;
  }
}
