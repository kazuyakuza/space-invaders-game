import { Enemy, type UpdateContext } from './Enemy';
import { YELLOW_ENEMY_COLOR, YELLOW_ENEMY_SPEED } from '../constants';

export class YellowEnemy extends Enemy {
  private readonly speed: number = YELLOW_ENEMY_SPEED;

  constructor(x: number, y: number, health: number) {
    super(x, y, health, YELLOW_ENEMY_COLOR);
  }

  public update(context: UpdateContext): void {
    this.y += this.speed;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.drawPentagon(ctx);
    this.drawHealth(ctx);
  }
}