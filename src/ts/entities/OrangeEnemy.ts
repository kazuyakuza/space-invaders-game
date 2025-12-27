import { Enemy, type UpdateContext } from './Enemy';
import { ORANGE_ENEMY_COLOR, ENEMY_SHOOT_CHANCE } from '../constants';

export class OrangeEnemy extends Enemy {
  constructor(x: number, y: number, health: number) {
    super(x, y, health, ORANGE_ENEMY_COLOR);
  }

  public update(context: UpdateContext): void {
    if (Math.random() < ENEMY_SHOOT_CHANCE) {
      context.spawnBullet(this.x + this.width / 2, this.y + this.height, false);
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.drawPentagon(ctx);
    this.drawHealth(ctx);
  }
}