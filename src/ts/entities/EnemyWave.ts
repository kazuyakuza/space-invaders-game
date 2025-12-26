import { Enemy } from './Enemy';
type Vector2 = { x: number; y: number };

interface EnemyWaveConfig {
    canvasWidth: number;
    canvasHeight: number;
    cols: number;
    rows: number;
    spacingX: number;
    spacingY: number;
    startX: number;
    startY: number;
    speed: number;
    dropDistance: number;
}

export class EnemyWave {
    private enemies: Enemy[] = [];
    private direction: number = 1;
    private readonly speed: number;
    private readonly dropDistance: number;
    private readonly canvasWidth: number;
    private readonly canvasHeight: number;

    constructor(config: EnemyWaveConfig) {
        this.speed = config.speed;
        this.dropDistance = config.dropDistance;
        this.canvasWidth = config.canvasWidth;
        this.canvasHeight = config.canvasHeight;
        this.initializeEnemies(config);
    }

    private initializeEnemies(config: EnemyWaveConfig): void {
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                const x = config.startX + col * config.spacingX;
                const y = config.startY + row * config.spacingY;
                this.enemies.push(new Enemy(x, y));
            }
        }
    }

    public update(): boolean {
        const offset: Vector2 = { x: this.speed * this.direction, y: 0 };
        let hitEdge = false;

        for (const enemy of this.enemies) {
            enemy.move(offset);
        }

        for (const enemy of this.enemies) {
            const bounds = enemy.getBounds();
            if ((this.direction < 0 && bounds.x <= 0) || (this.direction > 0 && bounds.x + bounds.width >= this.canvasWidth)) {
                hitEdge = true;
                break;
            }
        }

        if (hitEdge) {
            this.direction *= -1;
            const dropOffset: Vector2 = { x: 0, y: this.dropDistance };
            for (const enemy of this.enemies) {
                enemy.move(dropOffset);
            }
        }

        // Check lose condition
        for (const enemy of this.enemies) {
            if (enemy.getBounds().y + enemy.getBounds().height >= this.canvasHeight - 100) {
                return false; // lose
            }
        }

        return true; // continue
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (const enemy of this.enemies) {
            enemy.draw(ctx);
        }
    }

    public getEnemies(): Enemy[] {
        return this.enemies;
    }

    public removeEnemy(enemy: Enemy): void {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    }

    public isEmpty(): boolean {
        return this.enemies.length === 0;
    }
}