import { ENEMY_WIDTH, ENEMY_HEIGHT } from '../constants';

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UpdateContext {
  playerX: number;
  playerY: number;
  spawnBullet(x: number, y: number, isPlayer: boolean, vx?: number, vy?: number, isOrangeBullet?: boolean): void;
}

export abstract class Enemy {
  protected x: number;
  protected y: number;
  protected readonly width: number = ENEMY_WIDTH;
  protected readonly height: number = ENEMY_HEIGHT;
  protected readonly color: string;
  protected health: number;

  constructor(x: number, y: number, health: number, color: string) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.color = color;
  }

  public abstract update(context: UpdateContext): void;
  public abstract draw(ctx: CanvasRenderingContext2D): void;

  public move(offsetX: number, offsetY: number): void {
    this.x += offsetX;
    this.y += offsetY;
  }

  public takeDamage(amount: number = 1): boolean {
    this.health -= amount;
    return this.health <= 0;
  }

  public getBounds(): Bounds {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  protected drawPentagon(ctx: CanvasRenderingContext2D, drawX: number = this.x, drawY: number = this.y): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(drawX + this.width / 2, drawY);
    ctx.lineTo(drawX + this.width, drawY + this.height * 0.4);
    ctx.lineTo(drawX + this.width * 0.8, drawY + this.height);
    ctx.lineTo(drawX + this.width * 0.2, drawY + this.height);
    ctx.lineTo(drawX, drawY + this.height * 0.4);
    ctx.closePath();
    ctx.fill();
  }

  protected drawHealth(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.health.toString(), this.x + this.width / 2, this.y + this.height / 2);
    ctx.restore();
  }
}