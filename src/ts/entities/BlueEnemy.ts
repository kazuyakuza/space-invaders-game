import { Enemy } from './Enemy';
import { BLUE_ENEMY_COLOR, BULLET_SPEED, KAMIKAZE_TARGET_HUD_X, KAMIKAZE_TARGET_HUD_Y, KAMIKAZE_TARGET_LEFT_X, KAMIKAZE_TARGET_LEFT_Y, KAMIKAZE_TARGET_RIGHT_X, KAMIKAZE_TARGET_RIGHT_Y } from '../constants';
import type { UpdateContext } from './Enemy';

export class BlueEnemy extends Enemy {
  constructor(x: number, y: number, health: number) {
    super(x, y, health, BLUE_ENEMY_COLOR);
  }

  public update(context: UpdateContext): void {
    // Kamikaze enemies don't have active behavior while alive
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.drawHexagon(ctx);
    this.drawHealth(ctx);
  }

  public takeDamage(amount: number, spawnBullet?: (x: number, y: number, vx: number, vy: number) => void): boolean {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    const targets = [
      { x: KAMIKAZE_TARGET_HUD_X, y: KAMIKAZE_TARGET_HUD_Y },
      { x: KAMIKAZE_TARGET_LEFT_X, y: KAMIKAZE_TARGET_LEFT_Y },
      { x: KAMIKAZE_TARGET_RIGHT_X, y: KAMIKAZE_TARGET_RIGHT_Y }
    ];

    if (spawnBullet) {
      for (const target of targets) {
        const dx = target.x - centerX;
        const dy = target.y - centerY;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          const vx = (dx / dist) * BULLET_SPEED;
          const vy = (dy / dist) * BULLET_SPEED;
          spawnBullet(centerX, centerY, vx, vy);
        }
      }
    }

    return true;
  }
}