import type { Tile } from '../model/Tile.ts';
import type { Bounds } from '../model/support/Bounds.ts';

export class CanvasView {
  #gameCanvas: HTMLCanvasElement;
  #gameCanvasContainer: HTMLElement;
  #gameCanvasContext: CanvasRenderingContext2D;

  constructor(gameCanvas: HTMLCanvasElement) {
    const context = gameCanvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get a 2D rendering context for the game canvas');
    }

    const container = gameCanvas.parentElement;
    if (!container) {
      throw new Error('The game canvas must be nested inside a container element');
    }

    this.#gameCanvas = gameCanvas;
    this.#gameCanvasContainer = container;
    this.#gameCanvasContext = context;
  }

  get bounds(): Bounds {
    return {
      height: this.#gameCanvas.height,
      width: this.#gameCanvas.width
    };
  }

  resizeCanvas() {
    this.#gameCanvas.width = this.#gameCanvasContainer.clientWidth;
    this.#gameCanvas.height = this.#gameCanvasContainer.clientHeight;
  }

  clearRectangle() {
    this.#gameCanvasContext.clearRect(0, 0, this.#gameCanvas.width, this.#gameCanvas.height);
  }

  drawRectangle(color: string, tile: Tile) {
    this.#gameCanvasContext.fillStyle = color;
    this.#gameCanvasContext.fillRect(tile.xPosition, tile.yPosition, tile.size, tile.size);
  }

  drawCircle(color: string, tile: Tile) {
    this.#gameCanvasContext.fillStyle = color;
    this.#gameCanvasContext.strokeStyle = color;
    this.#gameCanvasContext.beginPath();
    this.#gameCanvasContext.arc(tile.xPosition, tile.yPosition, tile.radius, 0, 2 * Math.PI);
    this.#gameCanvasContext.fill();
    this.#gameCanvasContext.stroke();
    this.#gameCanvasContext.closePath();
  }
}
