import { Enemy, type UpdateContext } from './Enemy';
import { ORANGE_ENEMY_COLOR, ENEMY_SHOOT_CHANCE, BULLET_SPEED, ORANGE_SHOOT_COOLDOWN } from '../constants';

export class OrangeEnemy extends Enemy {
  private lastShootTime: number = 0;

  constructor(x: number, y: number, health: number) {
    super(x, y, health, ORANGE_ENEMY_COLOR);
  }

  public update(context: UpdateContext): void {
    const canShoot = context.timestamp - this.lastShootTime >= ORANGE_SHOOT_COOLDOWN;

    if (canShoot && Math.random() < ENEMY_SHOOT_CHANCE) {
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
      this.lastShootTime = context.timestamp;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.drawPentagon(ctx);
    this.drawHealth(ctx);
  }
}