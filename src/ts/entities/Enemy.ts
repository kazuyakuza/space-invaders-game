interface Vector2 {
    x: number;
    y: number;
}

export class Enemy {
    private x: number;
    private y: number;
    private readonly width: number = 30;
    private readonly height: number = 20;
    private readonly color: string = '#ff0000';

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public move(offset: Vector2): void {
        this.x += offset.x;
        this.y += offset.y;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    public getBounds(): {x: number, y: number, width: number, height: number} {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}