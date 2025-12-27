import { Enemy, type UpdateContext } from './Enemy';
import { RED_ENEMY_COLOR } from '../constants';

export class RedEnemy extends Enemy {
  constructor(x: number, y: number, health: number) {
    super(x, y, health, RED_ENEMY_COLOR);
  }

  public update(context: UpdateContext): void {
    // Movement handled by EnemyWave
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.drawPentagon(ctx);
    this.drawHealth(ctx);
  }
}