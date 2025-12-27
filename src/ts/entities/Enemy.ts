interface Vector2 {
  x: number;
  y: number;
}

import { ENEMY_WIDTH, ENEMY_HEIGHT, ENEMY_COLOR } from '../constants';

export class Enemy {
  private x: number;
  private y: number;
  private readonly width: number = ENEMY_WIDTH;
  private readonly height: number = ENEMY_HEIGHT;
  private readonly color: string = ENEMY_COLOR;
  private health: number;

  constructor(x: number, y: number, health: number = 1) {
    this.x = x;
    this.y = y;
    this.health = health;
  }

  public move(offset: Vector2): void {
    this.x += offset.x;
    this.y += offset.y;
  }

  public setX(newX: number): void {
    this.x = newX;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height * 0.4);
    ctx.lineTo(this.x + this.width * 0.8, this.y + this.height);
    ctx.lineTo(this.x + this.width * 0.2, this.y + this.height);
    ctx.lineTo(this.x, this.y + this.height * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.health.toString(), this.x + this.width / 2, this.y + this.height / 2);
    ctx.restore();
  }

  public takeDamage(amount: number = 1): boolean {
    this.health -= amount;
    return this.health <= 0;
  }

  public getBounds(): { x: number, y: number, width: number, height: number; } {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}