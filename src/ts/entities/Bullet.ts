export class Bullet {
    private x: number;
    private y: number;
    private readonly width: number = 5;
    private readonly height: number = 15;
    private readonly speed: number = 7;
    private readonly color: string = '#ffffff';

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