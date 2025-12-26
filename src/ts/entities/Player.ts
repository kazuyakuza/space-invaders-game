interface PlayerConfig {
    canvasWidth: number;
    canvasHeight: number;
    speed: number;
    padding: number;
}

export class Player {
    private x: number;
    private y: number;
    private readonly width: number = 40;
    private readonly height: number = 30;
    private readonly speed: number;
    private readonly color: string = '#00ff00'; // green
    private readonly canvasWidth: number;
    private readonly canvasHeight: number;
    private readonly padding: number;

    constructor(config: PlayerConfig) {
        this.speed = config.speed;
        this.canvasWidth = config.canvasWidth;
        this.canvasHeight = config.canvasHeight;
        this.padding = config.padding;
        this.x = (this.canvasWidth / 2) - (this.width / 2);
        this.y = this.canvasHeight - 50;
    }

    public update(inputHandler: import('../InputHandler').InputHandler): void {
        if (inputHandler.isPressed('ArrowLeft') && this.x > this.padding) {
            this.x -= this.speed;
        }
        if (inputHandler.isPressed('ArrowRight') && this.x < this.canvasWidth - this.width - this.padding) {
            this.x += this.speed;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    public getShootPosition(): {x: number, y: number} {
        return {
            x: this.x + (this.width / 2),
            y: this.y
        };
    }
}