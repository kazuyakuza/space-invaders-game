import { InputHandler } from './InputHandler';
import { Player, type PlayerConfig } from './entities/Player';
import { Bullet } from './entities/Bullet';
import { EnemyWave, type EnemyWaveConfig } from './entities/EnemyWave';
import levelsData from '../assets/levels.json';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SHOOT_INTERVAL,
  GAME_PADDING,
  ENEMY_WAVE_START_X,
  ENEMY_WAVE_START_Y,
  SCORE_PER_ENEMY,
  PLAYER_SPEED,
  ENEMY_SPACING_X,
  ENEMY_SPACING_Y,
  ENEMY_DROP_DISTANCE
} from './constants';

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LevelConfig {
  rows: number;
  cols: number;
  speed: number;
  enemyCount: number;
}

function rectsIntersect(a: Bounds, b: Bounds): boolean {
  return a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input: InputHandler;
  private player!: Player;
  private enemyWave!: EnemyWave;
  private bullets: Bullet[] = [];
  private gameRunning: boolean = true;
  private shootCooldown: number = 0;

  private score: number = 0;
  private currentLevel: number = 0;
  private levels: LevelConfig[];

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    this.input = new InputHandler();

    const canvasConfig = {
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT
    };

    const playerConfig: PlayerConfig = {
      ...canvasConfig,
      speed: PLAYER_SPEED,
      padding: GAME_PADDING
    };
    this.player = new Player(playerConfig);

    this.levels = levelsData as LevelConfig[];
    this.initLevel(0);
  }

  private initLevel(levelIndex: number): void {
    const configIndex = Math.min(levelIndex, this.levels.length - 1);
    const levelConfig = this.levels[configIndex];

    const canvasConfig = {
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT
    };

    const enemyConfig: EnemyWaveConfig = {
      ...canvasConfig,
      cols: levelConfig.cols,
      rows: levelConfig.rows,
      spacingX: ENEMY_SPACING_X,
      spacingY: ENEMY_SPACING_Y,
      startX: ENEMY_WAVE_START_X,
      startY: ENEMY_WAVE_START_Y,
      speed: levelConfig.speed,
      dropDistance: ENEMY_DROP_DISTANCE,
      enemyCount: levelConfig.enemyCount
    };
    this.enemyWave = new EnemyWave(enemyConfig);
    this.bullets = [];
  }

  private reset(): void {
    this.score = 0;
    this.bullets = [];
    const canvasConfig = {
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT
    };
    const playerConfig: PlayerConfig = {
      ...canvasConfig,
      speed: PLAYER_SPEED,
      padding: GAME_PADDING
    };
    this.player = new Player(playerConfig);
    this.currentLevel = 0;
    this.initLevel(0);
    this.gameRunning = true;
    this.shootCooldown = 0;
  }

  public start(): void {
    this.gameLoop();
  }

  private gameLoop(): void {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  private update(): void {
    if (!this.gameRunning && this.input.isPressed('Enter')) {
      this.reset();
      return;
    }
    if (!this.gameRunning) {
      return;
    }
    this.player.update(this.input);

    if (this.shootCooldown <= 0 && this.input.isPressed('Space')) {
      const pos = this.player.getShootPosition();
      this.bullets.push(new Bullet(pos.x, pos.y));
      this.shootCooldown = SHOOT_INTERVAL;
    } else {
      this.shootCooldown--;
    }

    // Update bullets
    this.bullets = this.bullets.filter(bullet => bullet.update());

    // Update enemies
    this.gameRunning = this.enemyWave.update();

    this.handleCollisions();


    // Level transition
    if (this.enemyWave.isEmpty()) {
      this.currentLevel++;
      this.initLevel(this.currentLevel);
    }
  }

  private handleCollisions(): void {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bulletBounds = this.bullets[i].getBounds();
      const enemies = this.enemyWave.getEnemies();
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemyBounds = enemies[j].getBounds();
        if (rectsIntersect(bulletBounds, enemyBounds)) {
          this.enemyWave.removeEnemy(enemies[j]);
          this.score += SCORE_PER_ENEMY;
          this.bullets.splice(i, 1);
          break;
        }
      }
    }
  }

  private render(): void {
    // Clear with black background
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Score
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, GAME_PADDING, 30);

    // Level
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Level: ${this.currentLevel}`, CANVAS_WIDTH - GAME_PADDING, 30);
    this.ctx.textAlign = 'left';

    this.player.draw(this.ctx);
    this.enemyWave.draw(this.ctx);
    for (const bullet of this.bullets) {
      bullet.draw(this.ctx);
    }

    // Game over text
    if (!this.gameRunning) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      const message = 'Game Over';
      this.ctx.fillText(message, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      this.ctx.font = '24px Arial';
      this.ctx.fillText('Press ENTER to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    }
  }
}