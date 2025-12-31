import { Enemy, type UpdateContext } from './Enemy';
import { RedEnemy } from './RedEnemy';
import { FormationGenerator } from './FormationGenerator';
import {
  DIFFICULTY_SPEED_INCREMENT
} from '../constants';

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
    this.enemies = FormationGenerator.generateFormation(config);
  }

  private moveRedEnemies(offsetX: number, offsetY: number): void {
    for (const enemy of this.enemies) {
      if (enemy instanceof RedEnemy) {
        enemy.move(offsetX, offsetY);
      }
    }
  }

  private isRedEnemyAtEdge(enemy: Enemy): boolean {
    return (this.direction < 0 && enemy.getBounds().x <= 0) || (this.direction > 0 && enemy.getBounds().x + enemy.getBounds().width >= this.canvasWidth);
  }

  private checkRedEdgeHit(): boolean {
    for (const enemy of this.enemies) {
      if (enemy instanceof RedEnemy) {
        if (this.isRedEnemyAtEdge(enemy)) {
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

  private checkLoseCondition(playerY: number): boolean {
    for (const enemy of this.enemies) {
      const bounds = enemy.getBounds();
      // Trigger if enemy bottom reaches or passes player top (playerY)
      if (bounds.y + bounds.height >= playerY) {
        return true;
      }
    }
    return false;
  }

  public update(playerX: number, playerY: number, timestamp: number): WaveUpdateResult {
    const pendingBullets: { x: number; y: number; isPlayer: boolean; vx?: number; vy?: number; isOrangeBullet?: boolean; }[] = [];
    const context: UpdateContext = {
      playerX,
      playerY,
      timestamp,
      spawnBullet: (x: number, y: number, isPlayer: boolean, vx?: number, vy?: number, isOrangeBullet?: boolean) => pendingBullets.push({ x, y, isPlayer, vx, vy, isOrangeBullet })
    };
    this.updateWaveMovement();
    for (const enemy of this.enemies) {
      enemy.update(context);
    }
    if (this.checkLoseCondition(playerY)) {
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
    const newEnemies = FormationGenerator.generateRedFormation(config);
    this.enemies.push(...newEnemies);
  }

  public hasRedEnemies(): boolean {
    return this.enemies.some(enemy => enemy instanceof RedEnemy);
  }

  public spawnEnemies(config: EnemyWaveConfig): void {
    const newEnemies = FormationGenerator.generateFormation(config);
    this.enemies.push(...newEnemies);
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }
}
