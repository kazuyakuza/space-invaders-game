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
  ENEMY_HEIGHT 
} from '../constants';

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
  enemyTypes?: Record<string, number>;
}

interface WaveUpdateResult {
  continue: boolean;
  pendingBullets: { x: number; y: number; isPlayer: boolean }[];
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
    if (!config.enemyTypes || Object.keys(config.enemyTypes).length === 0) {
      // Legacy all red
      const totalSlots = config.rows * config.cols;
      let slots: {row: number, col: number}[] = [];
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          slots.push({row, col});
        }
      }
      if (config.enemyCount < totalSlots) {
        slots = slots.slice(0, config.enemyCount);
      }
      for (const slot of slots) {
        const x = config.startX + slot.col * config.spacingX;
        const y = config.startY + slot.row * config.spacingY;
        this.enemies.push(new RedEnemy(x, y, config.enemyHealth));
      }
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
      // Safety check: total should equal enemyCount if percentages sum to 100
      // Red in formation
      const redCount = typeCounts['red'] || 0;
      const totalSlots = config.rows * config.cols;
      let slots: {row: number, col: number}[] = [];
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          slots.push({row, col});
        }
      }
      if (redCount < totalSlots) {
        slots = slots.slice(0, redCount);
      }
      for (const slot of slots) {
        const x = config.startX + slot.col * config.spacingX;
        const y = config.startY + slot.row * config.spacingY;
        this.enemies.push(new RedEnemy(x, y, config.enemyHealth));
      }
      // Yellow top
      const yellowCount = typeCounts['yellow'] || 0;
      for (let i = 0; i < yellowCount; i++) {
        const x = GAME_PADDING + Math.random() * (config.canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
        const y = 0;
        this.enemies.push(new YellowEnemy(x, y, config.enemyHealth));
      }
      // Orange top
      const orangeCount = typeCounts['orange'] || 0;
      for (let i = 0; i < orangeCount; i++) {
        const x = GAME_PADDING + Math.random() * (config.canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
        const y = 0;
        this.enemies.push(new OrangeEnemy(x, y, config.enemyHealth));
      }
      // Violet middle
      const violetCount = typeCounts['violet'] || 0;
      const middleY = config.canvasHeight * 0.5 - ENEMY_HEIGHT * 0.5;
      for (let i = 0; i < violetCount; i++) {
        const x = GAME_PADDING + Math.random() * (config.canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
        const y = middleY;
        this.enemies.push(new VioletEnemy(x, y, config.enemyHealth));
      }
    }
  }

  private updateWaveMovement(): void {
    const offsetX = this.speed * this.direction;
    let hitEdge = false;
    for (const enemy of this.enemies) {
      if (enemy instanceof RedEnemy) {
        enemy.move(offsetX, 0);
      }
    }
    for (const enemy of this.enemies) {
      if (enemy instanceof RedEnemy) {
        const bounds = enemy.getBounds();
        if ((this.direction < 0 && bounds.x <= 0) || (this.direction > 0 && bounds.x + bounds.width >= this.canvasWidth)) {
          hitEdge = true;
          break;
        }
      }
    }
    if (hitEdge) {
      this.direction *= -1;
      const dropOffsetY = this.dropDistance;
      for (const enemy of this.enemies) {
        if (enemy instanceof RedEnemy) {
          enemy.move(0, dropOffsetY);
        }
      }
      this.speed *= DIFFICULTY_SPEED_INCREMENT;
    }
  }

  public update(): WaveUpdateResult {
    const pendingBullets: { x: number; y: number; isPlayer: boolean }[] = [];
    const context: UpdateContext = {
      spawnBullet: (x: number, y: number, isPlayer: boolean) => pendingBullets.push({ x, y, isPlayer })
    };
    this.updateWaveMovement();
    for (const enemy of this.enemies) {
      enemy.update(context);
    }
    // Lose condition
    for (const enemy of this.enemies) {
      const bounds = enemy.getBounds();
      if (bounds.y + bounds.height >= this.canvasHeight - LOSE_CONDITION_Y_OFFSET) {
        return { continue: false, pendingBullets: [] };
      }
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
}