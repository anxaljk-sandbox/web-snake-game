import { Direction } from '../model/Direction';
import { Snake } from '../model/Snake.ts';
import type { CanvasView } from '../view/CanvasView.ts';

export class SnakeGameController {
  static readonly #SNAKE_SPEED = 3;
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

  #canvasView: CanvasView;
  #snake: Snake;
  #isMoving = false;
  #currentDirection = Direction.Right;

  constructor(canvasView: CanvasView, xStartingPoint: number, yStartingPoint: number) {
    this.#canvasView = canvasView;
    this.#snake = new Snake(xStartingPoint, yStartingPoint);

    this.#createSnake();
  }

  play() {
    this.#canvasView.clearRectangle();

    this.#createSnake();

    if (this.#isMoving) {
      this.#moveSnake();
    }

    // passing this.play() would invoke it immediately and pass its void return value
    // requestAnimationFrame, however, needs a function reference, not a call
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

  #createSnake() {
    for (let tile of this.#snake.body) {
      this.#canvasView.drawRectangle('black', tile);
    }
    for (let eye of this.#snake.getSnakeEyes(this.#currentDirection)) {
      this.#canvasView.drawRectangle('white', eye);
    }
  }

  #moveSnake() {
    switch (this.#currentDirection) {
      case Direction.Up:
        for (let bodyPart of this.#snake.body) {
          bodyPart.yPosition -= SnakeGameController.#SNAKE_SPEED;
        }
        break;
      case Direction.Down:
        for (let bodyPart of this.#snake.body) {
          bodyPart.yPosition += SnakeGameController.#SNAKE_SPEED;
        }
        break;
      case Direction.Left:
        for (let bodyPart of this.#snake.body) {
          bodyPart.xPosition -= SnakeGameController.#SNAKE_SPEED;
        }
        break;
      case Direction.Right:
        for (let bodyPart of this.#snake.body) {
          bodyPart.xPosition += SnakeGameController.#SNAKE_SPEED;
        }
        break;
    }
  }
}
