import { Enemy } from './Enemy';
import { DIFFICULTY_SPEED_INCREMENT, LOSE_CONDITION_Y_OFFSET, ENEMY_DROP_DISTANCE, ENEMY_SPACING_X, ENEMY_SPACING_Y } from '../constants';

type Vector2 = { x: number; y: number };

export interface EnemyWaveConfig {
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
    enemyCount: number;
       enemyHealth: number;
 }

export class EnemyWave {
    private enemies: Enemy[] = [];
    private direction: number = 1;
    private speed: number;
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
        const totalSlots = config.rows * config.cols;
        let slots: {row: number, col: number}[] = [];
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                slots.push({row, col});
            }
        }

        if (config.enemyCount >= totalSlots) {
            // Fill all slots
        } else {
            // Fisher-Yates shuffle
            for (let i = slots.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [slots[i], slots[j]] = [slots[j], slots[i]];
            }
            slots = slots.slice(0, config.enemyCount);
        }

        for (const slot of slots) {
            const x = config.startX + slot.col * config.spacingX;
            const y = config.startY + slot.row * config.spacingY;
            this.enemies.push(new Enemy(x, y, config.enemyHealth));
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
            this.speed *= DIFFICULTY_SPEED_INCREMENT;
        }

        // Check lose condition
        for (const enemy of this.enemies) {
            if (enemy.getBounds().y + enemy.getBounds().height >= this.canvasHeight - LOSE_CONDITION_Y_OFFSET) {
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