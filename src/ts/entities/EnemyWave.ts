import { Enemy, type UpdateContext } from './Enemy';
import { RedEnemy } from './RedEnemy';
import { YellowEnemy } from './YellowEnemy';
import { OrangeEnemy } from './OrangeEnemy';
import { VioletEnemy } from './VioletEnemy';
import {
  DIFFICULTY_SPEED_INCREMENT,
  LOSE_CONDITION_Y_OFFSET,
  ENEMY_DROP_DISTANCE,
  ENEMY_SPACING_X,
  ENEMY_SPACING_Y,
  GAME_PADDING,
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_WAVE_START_X,
  ENEMY_WAVE_START_Y
} from '../constants';

type Vector2 = { x: number; y: number; };

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
  enemyTypes?: Record<string, number>;
}

export interface RedFormationConfig {
  rows: number;
  cols: number;
  startX: number;
  startY: number;
  spacingX: number;
  spacingY: number;
  enemyHealth: number;
}

interface WaveUpdateResult {
  continue: boolean;
  pendingBullets: { x: number; y: number; isPlayer: boolean; vx?: number; vy?: number; isOrangeBullet?: boolean; }[];
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

  private createGridSlots(rows: number, cols: number): { row: number, col: number }[] {
    const slots: { row: number, col: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        slots.push({ row, col });
      }
    }
    return slots;
  }

  private spawnRedEnemies(slots: { row: number, col: number }[], startX: number, startY: number, spacingX: number, spacingY: number, enemyHealth: number): void {
    for (const slot of slots) {
      const x = startX + slot.col * spacingX;
      const y = startY + slot.row * spacingY;
      this.enemies.push(new RedEnemy(x, y, enemyHealth));
    }
  }

  private spawnYellowEnemies(count: number, canvasWidth: number, enemyHealth: number): void {
    for (let i = 0; i < count; i++) {
      const x = GAME_PADDING + Math.random() * (canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
      const y = 0;
      this.enemies.push(new YellowEnemy(x, y, enemyHealth));
    }
  }

  private spawnOrangeEnemies(count: number, canvasWidth: number, enemyHealth: number): void {
    for (let i = 0; i < count; i++) {
      const x = GAME_PADDING + Math.random() * (canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
      const y = 0;
      this.enemies.push(new OrangeEnemy(x, y, enemyHealth));
    }
  }

  private spawnVioletEnemies(count: number, canvasHeight: number, canvasWidth: number, enemyHealth: number): void {
    const middleY = canvasHeight * 0.5 - ENEMY_HEIGHT * 0.5;
    for (let i = 0; i < count; i++) {
      const x = GAME_PADDING + Math.random() * (canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
      const y = middleY;
      this.enemies.push(new VioletEnemy(x, y, enemyHealth));
    }
  }

  private initializeEnemies(config: EnemyWaveConfig): void {
    if (!config.enemyTypes || Object.keys(config.enemyTypes).length === 0) {
      // Legacy all red
      const totalSlots = config.rows * config.cols;
      let slots = this.createGridSlots(config.rows, config.cols);
      if (config.enemyCount < totalSlots) {
        slots = slots.slice(0, config.enemyCount);
      }
      this.spawnRedEnemies(slots, config.startX, config.startY, config.spacingX, config.spacingY, config.enemyHealth);
    } else {
      const typeCounts: Record<string, number> = {};
      const sortedTypes = ['red', 'yellow', 'orange', 'violet'];
      let allocated = 0;
      let cumulativePct = 0;

      for (const type of sortedTypes) {
        if (config.enemyTypes[type] !== undefined) {
          cumulativePct += config.enemyTypes[type];
          const targetCumulative = Math.ceil(config.enemyCount * (cumulativePct / 100));
          const count = targetCumulative - allocated;
          typeCounts[type] = Math.max(0, count);
          allocated += typeCounts[type];
        }
      }
      // Red in formation
      const redCount = typeCounts['red'] || 0;
      const totalSlots = config.rows * config.cols;
      let slots = this.createGridSlots(config.rows, config.cols);
      if (redCount < totalSlots) {
        slots = slots.slice(0, redCount);
      }
      this.spawnRedEnemies(slots, config.startX, config.startY, config.spacingX, config.spacingY, config.enemyHealth);
      // Yellow top
      this.spawnYellowEnemies(typeCounts['yellow'] || 0, config.canvasWidth, config.enemyHealth);
      // Orange top
      this.spawnOrangeEnemies(typeCounts['orange'] || 0, config.canvasWidth, config.enemyHealth);
      // Violet middle
      this.spawnVioletEnemies(typeCounts['violet'] || 0, config.canvasHeight, config.canvasWidth, config.enemyHealth);
    }
  }

  private moveRedEnemies(offsetX: number, offsetY: number): void {
    for (const enemy of this.enemies) {
      if (enemy instanceof RedEnemy) {
        enemy.move(offsetX, offsetY);
      }
    }
  }

  private checkRedEdgeHit(): boolean {
    for (const enemy of this.enemies) {
      if (enemy instanceof RedEnemy) {
        const bounds = enemy.getBounds();
        if ((this.direction < 0 && bounds.x <= 0) || (this.direction > 0 && bounds.x + bounds.width >= this.canvasWidth)) {
          return true;
        }
      }
    }
    return false;
  }

  private updateWaveMovement(): void {
    const offsetX = this.speed * this.direction;
    this.moveRedEnemies(offsetX, 0);
    if (this.checkRedEdgeHit()) {
      this.direction *= -1;
      this.moveRedEnemies(0, this.dropDistance);
      this.speed *= DIFFICULTY_SPEED_INCREMENT;
    }
  }

  private checkLoseCondition(): boolean {
    for (const enemy of this.enemies) {
      const bounds = enemy.getBounds();
      if (bounds.y + bounds.height >= this.canvasHeight - LOSE_CONDITION_Y_OFFSET) {
        return true;
      }
    }
    return false;
  }

  public update(playerX: number, playerY: number): WaveUpdateResult {
    const pendingBullets: { x: number; y: number; isPlayer: boolean; vx?: number; vy?: number; isOrangeBullet?: boolean; }[] = [];
    const context: UpdateContext = {
      playerX,
      playerY,
      spawnBullet: (x: number, y: number, isPlayer: boolean, vx?: number, vy?: number, isOrangeBullet?: boolean) => pendingBullets.push({ x, y, isPlayer, vx, vy, isOrangeBullet })
    };
    this.updateWaveMovement();
    for (const enemy of this.enemies) {
      enemy.update(context);
    }
    if (this.checkLoseCondition()) {
      return { continue: false, pendingBullets: [] };
    }
    return { continue: true, pendingBullets };
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

  public spawnRedFormation(config: RedFormationConfig): void {
    const slots = this.createGridSlots(config.rows, config.cols);
    this.spawnRedEnemies(slots, config.startX, config.startY, config.spacingX, config.spacingY, config.enemyHealth);
  }

  public hasRedEnemies(): boolean {
    return this.enemies.some(enemy => enemy instanceof RedEnemy);
  }

  public spawnEnemies(config: EnemyWaveConfig): void {
    this.initializeEnemies(config);
  }
}