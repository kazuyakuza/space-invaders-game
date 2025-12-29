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
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  ENEMY_SPACING_X,
  ENEMY_SPACING_Y,
  ENEMY_DROP_DISTANCE,
   SHOW_DEBUG_INFO,
  BULLET_WIDTH,
  BULLET_SPEED,
  COUNTDOWN_FRAMES,
   LABEL_PAUSE,
   LABEL_RESTART,
   LABEL_FONT,
   LABEL_COLOR
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
  enemyHealth: number;
  enemyTypes?: Record<string, number>;
}

interface RawLevelConfig {
  [key: string]: any;
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
  private levelConfigs: Record<string, RawLevelConfig> = {};

  private currentLevelConfig: LevelConfig | null = null;
  private isPaused: boolean = false;
  private hasStarted: boolean = false;
  private countdown: number = 0;
  private lastEscapePressed: boolean = false;
  private lastSpacePressed: boolean = false;

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

    this.loadLevels();
    this.initLevel(0);
    this.hasStarted = false;
    this.isPaused = false;
    this.countdown = 0;
    this.lastEscapePressed = false;
    this.lastSpacePressed = false;
  }

  private loadLevels(): void {
    this.levelConfigs = levelsData as Record<string, RawLevelConfig>;
  }

  private applyLevelDelta(levelConfig: RawLevelConfig, effective: Partial<LevelConfig>): void {
    Object.entries(levelConfig).forEach(([key, value]) => {
      if (key.startsWith('+')) {
        const prop = key.slice(1) as keyof LevelConfig;
        const current = effective[prop] as number | undefined;
        if (typeof current === 'number' && typeof value === 'number') {
          (effective as any)[prop] = current + value;
        }
      } else {
        (effective as any)[key] = value;
      }
    });
  }

  private resolveLevelConfig(targetLevel: number): LevelConfig {
    const levelKeys = Object.keys(this.levelConfigs)
      .map(k => parseInt(k))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    const maxLevel = levelKeys.length > 0 ? Math.max(...levelKeys) : 0;


    const effective: Partial<LevelConfig> = {
      rows: 5,
      cols: 6,
      speed: 1.0,
      enemyCount: 30,
      enemyHealth: 1
    };

    for (let i = 1; i <= targetLevel; i++) {
      const levelKey = i <= maxLevel ? i.toString() : maxLevel.toString();
      const levelConfig = this.levelConfigs[levelKey];
      if (levelConfig) {
        this.applyLevelDelta(levelConfig, effective);
      }
    }

    return effective as LevelConfig;
  }

  private initLevel(levelIndex: number): void {
    const levelConfig: LevelConfig = this.resolveLevelConfig(levelIndex + 1);
    this.currentLevelConfig = levelConfig;

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
      enemyCount: levelConfig.enemyCount,
      enemyHealth: levelConfig.enemyHealth,
      enemyTypes: levelConfig.enemyTypes
    };
    this.enemyWave = new EnemyWave(enemyConfig);
    this.bullets = [];
  }

  private nextLevel(): void {
    this.currentLevel++;
    const levelConfig = this.resolveLevelConfig(this.currentLevel + 1);
    this.enemyWave.spawnRedFormation(
      levelConfig.rows,
      levelConfig.cols,
      ENEMY_WAVE_START_X,
      ENEMY_WAVE_START_Y,
      ENEMY_SPACING_X,
      ENEMY_SPACING_Y,
      levelConfig.enemyHealth
    );
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
    this.hasStarted = false;
    this.isPaused = false;
    this.countdown = 0;
    this.lastEscapePressed = false;
    this.lastSpacePressed = false;
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
  const escapePressed = this.input.isPressed('Escape');
  if (escapePressed && !this.lastEscapePressed) {
    this.isPaused = !this.isPaused;
  }
  this.lastEscapePressed = escapePressed;

  if (this.isPaused && this.input.isPressed('KeyR')) {
    this.reset();
    return;
  }

  if (!this.hasStarted) {
    const spacePressed = this.input.isPressed('Space');
    if (spacePressed && !this.lastSpacePressed) {
      this.hasStarted = true;
      this.countdown = COUNTDOWN_FRAMES;
    }
    this.lastSpacePressed = spacePressed;
    return;
  }

  if (this.countdown > 0) {
    this.countdown--;
    return;
  }

  if (this.isPaused) {
    return;
  }

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
      this.bullets.push(new Bullet(pos.x - BULLET_WIDTH / 2, pos.y, true));
      this.shootCooldown = SHOOT_INTERVAL;
    } else {
      this.shootCooldown--;
    }

    // Update bullets
    this.bullets = this.bullets.filter(bullet => bullet.update());

    // Update enemies
    const playerPos = this.player.getShootPosition();
    const playerCenterX = playerPos.x;
    const playerCenterY = playerPos.y + PLAYER_HEIGHT / 2;
    const result = this.enemyWave.update(playerCenterX, playerCenterY);
    this.gameRunning = result.continue;
    for (const pb of result.pendingBullets) {
      this.bullets.push(new Bullet(pb.x - BULLET_WIDTH / 2, pb.y, pb.isPlayer, pb.vx ?? 0, pb.vy ?? (pb.isPlayer ? -BULLET_SPEED : BULLET_SPEED), pb.isOrangeBullet ?? false));
    }

    this.handleCollisions();


    // Level transition
    if (!this.enemyWave.hasRedEnemies()) {
      this.nextLevel();
    }
  }

  private handleCollisions(): void {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bulletBounds = this.bullets[i].getBounds();
      const enemies = this.enemyWave.getEnemies();
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemyBounds = enemies[j].getBounds();
        if (rectsIntersect(bulletBounds, enemyBounds)) {
          const bullet = this.bullets[i];
          if (!bullet.isPlayerBullet && bullet.isOrangeBullet) {
            continue;
          }
          if (enemies[j].takeDamage(1)) {
            this.enemyWave.removeEnemy(enemies[j]);
            this.score += SCORE_PER_ENEMY;
          }
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

    this.ctx.font = LABEL_FONT;
    this.ctx.fillStyle = LABEL_COLOR;
    this.ctx.textAlign = 'center';

    if (this.hasStarted && this.countdown === 0 && this.gameRunning && !this.isPaused) {
      this.ctx.fillText(LABEL_PAUSE, CANVAS_WIDTH / 2, 30);
    }

    if (this.isPaused) {
      this.ctx.fillText(LABEL_RESTART, CANVAS_WIDTH / 2, 30);
    }

    this.ctx.textAlign = 'left';

    if (SHOW_DEBUG_INFO && this.currentLevelConfig) {
      this.ctx.save();
      this.ctx.font = '16px Arial';
      this.ctx.fillStyle = '#ffff00';
      this.ctx.fillText('Debug Info:', GAME_PADDING, 60);
      this.ctx.fillText(`Rows: ${this.currentLevelConfig.rows ?? 'N/A'}`, GAME_PADDING, 80);
      this.ctx.fillText(`Cols: ${this.currentLevelConfig.cols ?? 'N/A'}`, GAME_PADDING, 100);
      this.ctx.fillText(`Speed: ${(this.currentLevelConfig.speed ?? 0).toFixed(2)}`, GAME_PADDING, 120);
      this.ctx.fillText(`Enemy Count: ${this.currentLevelConfig.enemyCount ?? 'N/A'}`, GAME_PADDING, 140);
      this.ctx.fillText(`Enemy Health: ${this.currentLevelConfig.enemyHealth ?? 'N/A'}`, GAME_PADDING, 160);
      this.ctx.restore();
    }

    if (!this.hasStarted) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Press SPACE to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      this.ctx.textAlign = 'left';
    }

    if (this.countdown > 0) {
      this.ctx.fillStyle = '#ff0000';
      this.ctx.font = '96px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(Math.ceil(this.countdown / 60).toString(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      this.ctx.textAlign = 'left';
    }

    this.player.draw(this.ctx);
    
    // Only draw enemies if the game has started
    if (this.hasStarted) {
      this.enemyWave.draw(this.ctx);
    }
    
    for (const bullet of this.bullets) {
      bullet.draw(this.ctx);
    }

    if (this.isPaused) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED - Press ESC to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      this.ctx.textAlign = 'left';
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