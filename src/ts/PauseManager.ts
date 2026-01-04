import { InputHandler } from './InputHandler';
import { COUNTDOWN_FRAMES } from './constants';

export class PauseManager {
  private lastEscapePressed: boolean = false;
  private lastSpacePressed: boolean = false;
  private isPaused: boolean = false;
  private hasStarted: boolean = false;
  private countdown: number = 0;

  handle(input: InputHandler, purchaseCallback: (index: number) => void, restartCallback: () => void): boolean {
    const escape = input.isPressed('Escape');
    if (escape && !this.lastEscapePressed) {
      this.isPaused = !this.isPaused;
    }
    this.lastEscapePressed = escape;

    if (this.isPaused) {
      if (input.isPressed('KeyR')) {
        restartCallback();
      }
      for (let i = 0; i <= 1; i++) {
        if (input.isPressed(`Digit${i}`)) {
          purchaseCallback(i);
        }
      }
      return true;
    }

    if (!this.hasStarted) {
      const space = input.isPressed('Space');
      if (space && !this.lastSpacePressed) {
        this.hasStarted = true;
        this.countdown = COUNTDOWN_FRAMES;
      }
      this.lastSpacePressed = space;
      return true;
    }

    return false;
  }

  updateCountdown(): void {
    if (this.countdown > 0) {
      this.countdown--;
    }
  }

  getCountdown(): number {
    return this.countdown;
  }

  getHasStarted(): boolean {
    return this.hasStarted;
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }

  reset(): void {
    this.lastEscapePressed = false;
    this.lastSpacePressed = false;
    this.isPaused = false;
    this.hasStarted = false;
    this.countdown = 0;
  }
}