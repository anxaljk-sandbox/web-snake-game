import { Direction, oppositeDirection } from '../model/support/Direction.ts';
import { Snake } from '../model/Snake.ts';
import { Tile } from '../model/Tile.ts';
import type { CanvasView } from '../view/CanvasView.ts';
import { TileType } from '../model/support/TileType.ts';
import { isInsideBounds, overlapsCoordinate, overlapsTile } from '../model/support/collision.ts';
import { getCoordinatesOfRandomFreeTile } from '../model/support/placement.ts';

export class SnakeGameController {
  static readonly #KEY_TO_DIRECTION: Record<string, Direction> = {
    ArrowUp: Direction.Up,
    ArrowDown: Direction.Down,
    ArrowLeft: Direction.Left,
    ArrowRight: Direction.Right,
  };

  readonly #canvasView: CanvasView;
  readonly #currentFood: Tile;

  #snake: Snake;
  #isMoving = false;
  #pendingDirection: Direction | undefined;

  constructor(canvasView: CanvasView, xStartingPoint: number, yStartingPoint: number) {
    this.#canvasView = canvasView;

    this.#snake = new Snake(xStartingPoint, yStartingPoint);

    this.#currentFood = new Tile(
      TileType.Circle,
      this.#canvasView.bounds.width - xStartingPoint,
      yStartingPoint + this.#snake.head.radius
    );
  }

  play() {
    this.#canvasView.clearRectangle();

    this.#placeFoodOnCanvas();
    this.#drawSnake();

    if (this.#isMoving) {
      this.#moveSnake();
    }

    this.#handleEvents();

    // Passing this.play() would invoke it immediately and pass its void return value,
    // requestAnimationFrame, however, needs a function reference, not a call.
    window.requestAnimationFrame(() => this.play());
  }

  handleKeyDown(key: string) {
    const newDirection = SnakeGameController.#KEY_TO_DIRECTION[key];

    if (newDirection === undefined || newDirection === oppositeDirection[this.#snake.direction]) return
    if (newDirection === this.#snake.direction && this.#isMoving) return

    this.#pendingDirection = newDirection;
    this.#isMoving = true;
  }

  #placeFoodOnCanvas(xPosition?: number, yPosition?: number) {
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
    for (let eye of this.#snake.getSnakeEyes()) {
      this.#canvasView.drawRectangle('white', eye);
    }
  }

  #moveSnake() {
    this.#applyPendingDirection()

    this.#snake.move();
  }

  #applyPendingDirection() {
    if (this.#pendingDirection === undefined) return

    this.#snake.turn(this.#pendingDirection);
    this.#pendingDirection = undefined;
  }

  #handleEvents() {
    const head = this.#snake.head;

    // Handle crash into the wall
    if (!isInsideBounds(head, this.#canvasView.bounds)) {
      this.#isMoving = false;
      return;
    }

    // handle snake crashing into itself
    for (let i = 2; i < this.#snake.length; i++) {
      if (overlapsTile(head, this.#snake.body[i])) {
        this.#isMoving = false;
      }
    }

    // Handle snake eating food
    if (overlapsCoordinate(head, this.#currentFood.xPosition, this.#currentFood.yPosition)) {
      this.#generateNewFood()
    }
  }

  #generateNewFood() {
    const newFoodCoordinates = getCoordinatesOfRandomFreeTile(
      this.#currentFood.size,
      this.#currentFood.tileType,
      this.#canvasView.bounds, this.#snake.body
    );
    if (newFoodCoordinates === undefined) {
      this.#isMoving = false;
    } else {
      this.#snake.grow();
      this.#placeFoodOnCanvas(newFoodCoordinates.x, newFoodCoordinates.y);
    }
  }
}
