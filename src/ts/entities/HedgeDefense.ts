import { CANVAS_WIDTH, HEDGE_COLOR, HEDGE_HEIGHT } from '../constants';

export class HedgeDefense {
  private y: number;
  private active: boolean = true;

  constructor(y: number) {
    this.y = y;
  }

  public update(deltaTime: number): void {
    // Static defense line, no movement
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();
    ctx.strokeStyle = HEDGE_COLOR;
    ctx.lineWidth = HEDGE_HEIGHT;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, this.y);
    ctx.lineTo(CANVAS_WIDTH, this.y);
    ctx.stroke();
    ctx.restore();
  }

  public deactivate(): void {
    this.active = false;
  }

  public isActive(): boolean {
    return this.active;
  }

  public getY(): number {
    return this.y;
  }
}