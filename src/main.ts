import { SnakeGameController } from './controller/SnakeGameController.ts';
import { CanvasView } from './view/CanvasView.ts';

const gameCanvas = document.getElementById('game-canvas')! as HTMLCanvasElement;
const canvasView = new CanvasView(gameCanvas);
let snakeGameController: SnakeGameController;

function main() {
  canvasView.resizeCanvas();

  snakeGameController = new SnakeGameController(canvasView);
  snakeGameController.play();
}

window.addEventListener('resize', () => {
  if (snakeGameController.isGameInProgress) {
    snakeGameController.stopGame('The screen has been resized during the game!');
  }
  canvasView.resizeCanvas();
});

document.addEventListener('keydown', (event) => {
  if (event.repeat) return;
  snakeGameController.handleKeyDown(event.key);
});

main();
