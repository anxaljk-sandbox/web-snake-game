import { SnakeGameController } from './controller/SnakeGameController.ts';
import { CanvasView } from './view/CanvasView.ts';
import { Direction } from './model/support/Direction.ts';
import type { Coordinates } from './model/support/Coordinates.ts';

const MIN_SWIPE_LENGTH = 25;
const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: Direction.Up,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right,
};

const gameCanvas = document.getElementById('game-canvas')! as HTMLCanvasElement;
const gameOverScreen = document.getElementById('game-over-screen')!;

const canvasView = new CanvasView(gameCanvas, gameOverScreen);

async function main() {
  await waitForFontsToLoad();

  canvasView.resizeCanvas();

  const snakeGameController = new SnakeGameController(canvasView);

  registerInputHandlers(snakeGameController);
  observeGameAreaResize(snakeGameController);

  snakeGameController.play();
}

function waitForFontsToLoad() {
  return Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 500)),
  ]);
}

function registerInputHandlers(snakeGameController: SnakeGameController) {
  let swipeDetected = false;
  let touchStart: Coordinates = { x: 0, y: 0 };

  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;

    if (event.key === 'Enter') snakeGameController.handleRestartInput();

    const direction = KEY_TO_DIRECTION[event.key];
    if (direction === undefined) return;

    snakeGameController.handleDirectionInput(direction);
  });

  gameOverScreen.addEventListener('touchend', () => {
    snakeGameController.handleRestartInput();
  });

  gameCanvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];

    touchStart = {
      x: touch.clientX,
      y: touch.clientY,
    };

    swipeDetected = false;
  });

  gameCanvas.addEventListener('touchmove', (event) => {
    if (swipeDetected) return;

    const touch = event.touches[0];

    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < MIN_SWIPE_LENGTH) {
      return;
    }

    swipeDetected = true;

    let direction: Direction;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? Direction.Right : Direction.Left;
    } else {
      direction = deltaY > 0 ? Direction.Down : Direction.Up;
    }

    snakeGameController.handleDirectionInput(direction);
  });

  gameCanvas.addEventListener('touchend', () => {
    swipeDetected = false;
  });
}

function observeGameAreaResize(snakeGameController: SnakeGameController) {
  new ResizeObserver(() => {
    if (!canvasView.hasContainerSizeChanged) return;
    canvasView.resizeCanvas();
    snakeGameController.handleResize();
  }).observe(canvasView.gameCanvasContainer);
}

main();
