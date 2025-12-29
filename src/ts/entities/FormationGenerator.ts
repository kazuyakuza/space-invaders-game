import { Enemy } from './Enemy';
import { RedEnemy } from './RedEnemy';
import { YellowEnemy } from './YellowEnemy';
import { OrangeEnemy } from './OrangeEnemy';
import { VioletEnemy } from './VioletEnemy';
import {
  GAME_PADDING,
  ENEMY_WIDTH,
  ENEMY_HEIGHT
} from '../constants';

interface LocalEnemyWaveConfig {
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

interface LocalRedFormationConfig {
  rows: number;
  cols: number;
  startX: number;
  startY: number;
  spacingX: number;
  spacingY: number;
  enemyHealth: number;
}

export class FormationGenerator {
  private static createGridSlots(rows: number, cols: number): { row: number; col: number }[] {
    const slots: { row: number; col: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        slots.push({ row, col });
      }
    }
    return slots;
  }

  private static spawnRedEnemies(
    slots: { row: number; col: number }[],
    startX: number,
    startY: number,
    spacingX: number,
    spacingY: number,
    enemyHealth: number
  ): Enemy[] {
    const enemies: Enemy[] = [];
    for (const slot of slots) {
      const x = startX + slot.col * spacingX;
      const y = startY + slot.row * spacingY;
      enemies.push(new RedEnemy(x, y, enemyHealth));
    }
    return enemies;
  }

  private static spawnYellowEnemies(count: number, canvasWidth: number, enemyHealth: number): Enemy[] {
    const enemies: Enemy[] = [];
    for (let i = 0; i < count; i++) {
      const x = GAME_PADDING + Math.random() * (canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
      const y = 0;
      enemies.push(new YellowEnemy(x, y, enemyHealth));
    }
    return enemies;
  }

  private static spawnOrangeEnemies(count: number, canvasWidth: number, enemyHealth: number): Enemy[] {
    const enemies: Enemy[] = [];
    for (let i = 0; i < count; i++) {
      const x = GAME_PADDING + Math.random() * (canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
      const y = 0;
      enemies.push(new OrangeEnemy(x, y, enemyHealth));
    }
    return enemies;
  }

  private static spawnVioletEnemies(count: number, canvasHeight: number, canvasWidth: number, enemyHealth: number): Enemy[] {
    const middleY = canvasHeight * 0.5 - ENEMY_HEIGHT * 0.5;
    const enemies: Enemy[] = [];
    for (let i = 0; i < count; i++) {
      const x = GAME_PADDING + Math.random() * (canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
      const y = middleY;
      enemies.push(new VioletEnemy(x, y, enemyHealth));
    }
    return enemies;
  }

  static generateRedFormation(config: LocalRedFormationConfig): Enemy[] {
    const slots = this.createGridSlots(config.rows, config.cols);
    return this.spawnRedEnemies(slots, config.startX, config.startY, config.spacingX, config.spacingY, config.enemyHealth);
  }

  static generateFormation(config: LocalEnemyWaveConfig): Enemy[] {
    const enemies: Enemy[] = [];
    if (!config.enemyTypes || Object.keys(config.enemyTypes).length === 0) {
      // Legacy all red
      const totalSlots = config.rows * config.cols;
      let slots = this.createGridSlots(config.rows, config.cols);
      if (config.enemyCount < totalSlots) {
        slots = slots.slice(0, config.enemyCount);
      }
      enemies.push(...this.spawnRedEnemies(slots, config.startX, config.startY, config.spacingX, config.spacingY, config.enemyHealth));
    } else {
      const typeCounts: Record<string, number> = {};
      const sortedTypes = ['red', 'yellow', 'orange', 'violet'];
      let allocated = 0;
      let cumulativePct = 0;

      for (const type of sortedTypes) {
        if (config.enemyTypes![type] !== undefined) {
          cumulativePct += config.enemyTypes![type];
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
      enemies.push(...this.spawnRedEnemies(slots, config.startX, config.startY, config.spacingX, config.spacingY, config.enemyHealth));
      // Yellow top
      enemies.push(...this.spawnYellowEnemies(typeCounts['yellow'] || 0, config.canvasWidth, config.enemyHealth));
      // Orange top
      enemies.push(...this.spawnOrangeEnemies(typeCounts['orange'] || 0, config.canvasWidth, config.enemyHealth));
      // Violet middle
      enemies.push(...this.spawnVioletEnemies(typeCounts['violet'] || 0, config.canvasHeight, config.canvasWidth, config.enemyHealth));
    }
    return enemies;
  }
}
