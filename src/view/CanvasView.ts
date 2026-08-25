import type { Tile } from '../model/Tile.ts';
import type { Bounds } from '../model/support/Bounds.ts';
import type { Coordinates } from '../model/support/Coordinates.ts';
import type { ScoreValues } from '../model/Score.ts';

export class CanvasView {
  #gameCanvas: HTMLCanvasElement;
  #gameCanvasContainer: HTMLElement;
  #gameCanvasContext: CanvasRenderingContext2D;
  #scoreValue: HTMLElement;
  #highScoreValue: HTMLElement;

  constructor(gameCanvas: HTMLCanvasElement) {
    const context = gameCanvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get a 2D rendering context for the game canvas');
    }

    const container = gameCanvas.parentElement;
    if (!container) {
      throw new Error('The game canvas must be nested inside a container element');
    }

    const scoreValue = document.getElementById('score-value');
    if (!scoreValue) {
      throw new Error('Could not get the score value HTML element');
    }

    const highScoreValue = document.getElementById('high-score-value');
    if (!highScoreValue) {
      throw new Error('Could not get the high score value HTML element');
    }

    this.#gameCanvas = gameCanvas;
    this.#gameCanvasContainer = container;
    this.#gameCanvasContext = context;
    this.#scoreValue = scoreValue;
    this.#highScoreValue = highScoreValue;
  }

  get bounds(): Bounds {
    return {
      height: this.#gameCanvas.height,
      width: this.#gameCanvas.width,
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
    this.#gameCanvasContext.lineWidth = 1;
    this.#gameCanvasContext.beginPath();
    this.#gameCanvasContext.arc(tile.xPosition, tile.yPosition, tile.radius, 0, 2 * Math.PI);
    this.#gameCanvasContext.fill();
    this.#gameCanvasContext.stroke();
    this.#gameCanvasContext.closePath();
  }

  drawPolyline(color: string, points: Array<Coordinates>, width: number) {
    if (points.length === 0) return;

    this.#gameCanvasContext.lineCap = 'square'; // how the two ends are finished
    this.#gameCanvasContext.lineJoin = 'miter'; // how the band behaves where segments meet
    this.#gameCanvasContext.fillStyle = color;
    this.#gameCanvasContext.strokeStyle = color;
    this.#gameCanvasContext.lineWidth = width;

    if (points.length === 1) {
      this.#gameCanvasContext.fillRect(points[0].x - width / 2, points[0].y - width / 2, width, width);
    } else {
      this.#gameCanvasContext.beginPath();
      this.#gameCanvasContext.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        this.#gameCanvasContext.lineTo(points[i].x, points[i].y);
      }
      this.#gameCanvasContext.stroke();
    }
  }

  updateScores(values: ScoreValues) {
    this.#scoreValue.innerText = values.score.toString();
    this.#highScoreValue.innerText = values.highScore.toString();
  }
}
