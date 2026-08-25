export type ScoreValues = {
  score: number;
  highScore: number;
}

export class Score {
  static readonly #STORAGE_KEY = 'highScore'

  #score = 0;
  #highScore = 0;

  constructor() {
    const existingHighScore = Number(localStorage.getItem(Score.#STORAGE_KEY));
    // NaN is a falsy value, so the highScore won't get corrupted with this check.
    if (existingHighScore) {
      this.#highScore = existingHighScore;
    }
  }

  get values(): ScoreValues {
    return { score: this.#score, highScore: this.#highScore };
  }

  updateScore(score: number) {
    this.#score = score;

    if (score > this.#highScore) {
      this.#highScore = score;
      try {
        localStorage.setItem(Score.#STORAGE_KEY, this.#highScore.toString());
      } catch (error) {
        console.error("Could not write into localStorage", error);
      }
    }
  }
}
