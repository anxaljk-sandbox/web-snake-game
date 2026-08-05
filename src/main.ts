import { SnakeGameController } from './controller/SnakeGameController.ts';
import { CanvasView } from './view/CanvasView.ts';

const gameCanvas = document.getElementById('game-canvas')! as HTMLCanvasElement;
const canvasView = new CanvasView(gameCanvas);
let snakeGameController: SnakeGameController;

function main() {
  canvasView.resizeCanvas();

  snakeGameController = new SnakeGameController(canvasView, 50, gameCanvas.height / 2);
  snakeGameController.play();
}

// giving the bare reference to canvasView.resizeCanvas would grab the function itself and detach it from CanvasView, so this becomes undefined
window.addEventListener('resize', () => {
  canvasView.resizeCanvas();
});

document.addEventListener('keydown', (event) => {
  snakeGameController.handleKeyDown(event);
});

main();
