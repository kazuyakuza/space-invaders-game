import { BULLET_WIDTH, BULLET_HEIGHT, BULLET_SPEED, BULLET_COLOR, CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants';

export class Bullet {
  private x: number;
  private y: number;
  private readonly width: number = BULLET_WIDTH;
  private readonly height: number = BULLET_HEIGHT;
  private readonly speed: number = BULLET_SPEED;
  private readonly color: string = BULLET_COLOR;
  public readonly isPlayerBullet: boolean;
  public readonly vx: number;
  public readonly vy: number;
  public readonly isOrangeBullet: boolean;

  constructor(x: number, y: number, isPlayerBullet: boolean, vx?: number, vy?: number, isOrangeBullet?: boolean) {
    this.x = x;
    this.y = y;
    this.isPlayerBullet = isPlayerBullet;
    this.vx = vx ?? 0;
    this.vy = vy ?? (isPlayerBullet ? -this.speed : this.speed);
    this.isOrangeBullet = isOrangeBullet ?? false;
  }

  public update(): boolean {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.width < 0 || this.x > CANVAS_WIDTH) {
      return false;
    }

    if (this.isPlayerBullet) {
      return this.y + this.height > 0;
    } else {
      return this.y < CANVAS_HEIGHT;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.isOrangeBullet ? '#ffaa00' : this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  public getBounds(): {x: number, y: number, width: number, height: number} {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
