import { Enemy, type UpdateContext } from './Enemy';
import { VIOLET_ENEMY_COLOR } from '../constants';

export class VioletEnemy extends Enemy {
  constructor(x: number, y: number, health: number) {
    super(x, y, health * 10, VIOLET_ENEMY_COLOR);
  }

  public update(context: UpdateContext): void {
    // Static formation
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const spacing = 12;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    for (let i = -1; i <= 1; i++) {
      this.drawPentagon(ctx, centerX + i * spacing, centerY);
    }
    this.drawHealth(ctx);
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    const spacing = 12;
    return {
      x: this.x - spacing,
      y: this.y,
      width: this.width + 2 * spacing,
      height: this.height
    };
  }
}