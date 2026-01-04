import { Game } from '../../Game';
import { PlayerController } from './PlayerController';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../constants';

export class GameSimulation {
  private game: Game;
  private playerController: PlayerController;

  constructor() {
    this.playerController = new PlayerController();

    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    (document.body as HTMLBodyElement).appendChild(canvas);

    this.game = new Game();
  }

  step(frames: number): void {
    for (let i = 0; i < frames; i++) {
      this.game.tick();
    }
  }

  press(key: string): void {
    this.playerController.press(key);
  }

  release(key: string): void {
    this.playerController.release(key);
  }

  getState() {
    return {
      hasStarted: this.game.getHasStarted(),
      countdown: this.game.getCountdown(),
      score: this.game.getScore(),
      currentLevel: this.game.getCurrentLevel(),
      enemyWave: this.game.getEnemyWave(),
      bullets: this.game.getBullets(),
      player: this.game.getPlayer(),
    };
  }
}