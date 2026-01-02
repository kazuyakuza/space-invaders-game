import { PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, PLAYER_START_Y_OFFSET } from '../constants';

export interface PlayerConfig {
    canvasWidth: number;
    canvasHeight: number;
    speed: number;
    padding: number;
}

export class Player {
    private x: number;
    private y: number;
    private readonly width: number = PLAYER_WIDTH;
    private readonly height: number = PLAYER_HEIGHT;
    private readonly speed: number;
    private readonly color: string = PLAYER_COLOR;
    private readonly canvasWidth: number;
    private readonly canvasHeight: number;
    private readonly padding: number;
    private lives: number = 3;

    constructor(config: PlayerConfig) {
        this.speed = config.speed;
        this.canvasWidth = config.canvasWidth;
        this.canvasHeight = config.canvasHeight;
        this.padding = config.padding;
        this.x = (this.canvasWidth / 2) - (this.width / 2);
        this.y = this.canvasHeight - PLAYER_START_Y_OFFSET;
        this.lives = 3;
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
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }

    public getShootPosition(): {x: number, y: number} {
        return {
            x: this.x + (this.width / 2),
            y: this.y
        };
    }

    public getLives(): number {
        return this.lives;
    }

    public loseLife(): void {
        this.lives--;
    }

    public addLife(): void {
        this.lives++;
    }

    public resetPosition(): void {
        this.x = (this.canvasWidth / 2) - (this.width / 2);
    }

    public getBounds(): {x: number, y: number, width: number, height: number} {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
}