import type { Tile } from '../model/Tile.ts';

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

  resizeCanvas() {
    this.#gameCanvas.width = this.#gameCanvasContainer.clientWidth;
    this.#gameCanvas.height = this.#gameCanvasContainer.clientHeight;
  }

  clearRectangle() {
    this.#gameCanvasContext.clearRect(0, 0, this.#gameCanvas.width, this.#gameCanvas.height);
  }

  drawRectangle(color: string, tile: Tile) {
    this.#gameCanvasContext.fillStyle = color;
    this.#gameCanvasContext.fillRect(
      tile.xPosition,
      tile.yPosition,
      tile.width,
      tile.height,
    );
  }
}
