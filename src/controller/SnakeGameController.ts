import { Direction, oppositeDirection } from '../model/support/Direction.ts';
import { Snake } from '../model/Snake.ts';
import { Tile } from '../model/Tile.ts';
import { Score } from '../model/Score.ts';
import { TileType } from '../model/support/TileType.ts';
import type { CanvasView } from '../view/CanvasView.ts';
import { isInsideBounds, overlapsCoordinate, overlapsTile } from '../model/support/collision.ts';
import { getCoordinatesOfRandomFreeTile } from '../model/support/placement.ts';
import type { Coordinates } from '../model/support/Coordinates.ts';

export class SnakeGameController {
  static readonly #INITIAL_SNAKE_X_POSITION = 100;

  readonly #canvasView: CanvasView;
  readonly #currentFood: Tile;
  readonly #score: Score;

  #snake: Snake;
  #pendingDirection: Direction | undefined;
  #isMoving = false;
  #gameOver = false;

  constructor(canvasView: CanvasView) {
    this.#canvasView = canvasView;

    this.#snake = new Snake(this.#initialSnakePosition);
    this.#currentFood = new Tile(TileType.Circle, this.#initialFoodPosition.x, this.#initialFoodPosition.y);

    this.#score = new Score();
  }

  get #isGameInProgress() {
    return !this.#gameOver && this.#isMoving;
  }

  get #initialSnakePosition(): Coordinates {
    return {
      x: SnakeGameController.#INITIAL_SNAKE_X_POSITION,
      y: this.#canvasView.bounds.height / 2,
    };
  }

  get #initialFoodPosition(): Coordinates {
    const initialSnakePosition = this.#initialSnakePosition;

    return {
      x: this.#canvasView.bounds.width - initialSnakePosition.x,
      y: initialSnakePosition.y + this.#snake.head.radius,
    };
  }

  play() {
    this.#canvasView.clearRectangle();

    this.#placeFoodOnCanvas();
    this.#drawSnake();

    if (this.#isMoving) {
      this.#moveSnake();
    }

    this.#handleEvents();

    this.#updateScore();

    // Passing this.play() would invoke it immediately and pass its void return value,
    // requestAnimationFrame, however, needs a function reference, not a call.
    window.requestAnimationFrame(() => this.play());
  }

  handleDirectionInput(direction: Direction) {
    if (this.#gameOver) return;
    if (direction === oppositeDirection[this.#snake.direction]) return;
    if (direction === this.#snake.direction && this.#isMoving) return;

    this.#pendingDirection = direction;
    this.#isMoving = true;
    this.#canvasView.hideStartHint();
  }

  handleRestartInput() {
    if (this.#gameOver) {
      this.#restartGame();
    }
  }

  handleResize() {
    if (this.#isGameInProgress) {
      this.#stopGame('The screen has been resized during the game!');
    } else {
      this.#reset();
    }
  }

  #reset() {
    this.#snake = new Snake(this.#initialSnakePosition);
    this.#placeFoodOnCanvas(this.#initialFoodPosition.x, this.#initialFoodPosition.y);
    this.#pendingDirection = undefined;
    this.#isMoving = false;
    this.#gameOver = false;
    this.#canvasView.showStartHint();
  }

  #stopGame(reason: string) {
    this.#isMoving = false;
    this.#gameOver = true;
    this.#canvasView.showGameOverScreen(reason, this.#score.values);
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
    this.#canvasView.drawPolyline('black', this.#snake.getRenderPoints(), this.#snake.head.size);

    for (let eye of this.#snake.getSnakeEyes()) {
      this.#canvasView.drawRectangle('white', eye);
    }
  }

  #moveSnake() {
    this.#applyPendingDirection();

    this.#snake.move();
  }

  #applyPendingDirection() {
    if (this.#pendingDirection === undefined) return;

    this.#snake.turn(this.#pendingDirection);
    this.#pendingDirection = undefined;
  }

  #handleEvents() {
    const head = this.#snake.head;

    if (!isInsideBounds(head, this.#canvasView.bounds)) {
      this.#stopGame('You crashed into a wall!');
      return;
    }

    for (let i = 2; i < this.#snake.length; i++) {
      if (overlapsTile(head, this.#snake.body[i])) {
        this.#stopGame('You crashed into yourself!');
      }
    }

    if (overlapsCoordinate(head, this.#currentFood.xPosition, this.#currentFood.yPosition)) {
      this.#onFoodEaten();
    }
  }

  #onFoodEaten() {
    this.#snake.grow();

    const occupiedTiles = [
      ...this.#snake.body,
      ...this.#snake.getCornerTiles()
    ]

    const newFoodCoordinates = getCoordinatesOfRandomFreeTile(
      this.#currentFood.size,
      this.#currentFood.tileType,
      this.#canvasView.bounds,
      occupiedTiles,
    );
    if (newFoodCoordinates === undefined) {
      this.#stopGame('You have eaten so much, that there is no more space for new food! Congratulations!');
    } else {
      this.#placeFoodOnCanvas(newFoodCoordinates.x, newFoodCoordinates.y);
    }
  }

  #updateScore() {
    this.#score.updateScore(this.#snake.length - 1);
    this.#canvasView.updateScores(this.#score.values);
  }

  #restartGame() {
    this.#reset();
    this.#canvasView.hideGameOverScreen();
  }
}
