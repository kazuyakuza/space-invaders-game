import { Enemy, type UpdateContext } from './Enemy';
import { ORANGE_ENEMY_COLOR, ENEMY_SHOOT_CHANCE, BULLET_SPEED } from '../constants';

export class OrangeEnemy extends Enemy {
  constructor(x: number, y: number, health: number) {
    super(x, y, health, ORANGE_ENEMY_COLOR);
  }

  public update(context: UpdateContext): void {
    if (Math.random() < ENEMY_SHOOT_CHANCE) {
      const spawnX = this.x + this.width / 2;
      const spawnY = this.y + this.height;
      const dx = context.playerX - spawnX;
      const dy = context.playerY - spawnY;
      const dist = Math.hypot(dx, dy);
      if (dist > 0) {
        const vx = (dx / dist) * BULLET_SPEED;
        const vy = (dy / dist) * BULLET_SPEED;
        context.spawnBullet(spawnX, spawnY, false, vx, vy, true);
      } else {
        context.spawnBullet(spawnX, spawnY, false);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.drawPentagon(ctx);
    this.drawHealth(ctx);
  }
}