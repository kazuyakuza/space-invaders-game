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

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
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
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  public getBounds(): { x: number, y: number, width: number, height: number; } {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}