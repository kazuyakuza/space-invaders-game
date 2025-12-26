import { BULLET_WIDTH, BULLET_HEIGHT, BULLET_SPEED, BULLET_COLOR } from '../constants';

export class Bullet {
    private x: number;
    private y: number;
    private readonly width: number = BULLET_WIDTH;
    private readonly height: number = BULLET_HEIGHT;
    private readonly speed: number = BULLET_SPEED;
    private readonly color: string = BULLET_COLOR;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public update(): boolean {
        this.y -= this.speed;
        return this.y > -this.height;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    public getBounds(): {x: number, y: number, width: number, height: number} {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}