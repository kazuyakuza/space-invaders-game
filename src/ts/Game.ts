import { InputHandler } from './InputHandler';
import { Player, type PlayerConfig } from './entities/Player';
import { Bullet } from './entities/Bullet';
import { EnemyWave, type EnemyWaveConfig } from './entities/EnemyWave';
import { CollisionManager, type CollisionContext } from './CollisionManager';
import { UIManager } from './UIManager';
import { EntityRenderer } from './Renderer';
import levelsData from '../assets/levels.json';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SHOOT_INTERVAL,
  GAME_PADDING,
  ENEMY_WAVE_START_X,
  ENEMY_WAVE_START_Y,
  PLAYER_SPEED,
  ENEMY_SPACING_X,
  ENEMY_SPACING_Y,
  ENEMY_DROP_DISTANCE,
  BULLET_WIDTH,
  BULLET_SPEED,
  COUNTDOWN_FRAMES,
  PLAYER_HEIGHT,
  SCORE_PER_ENEMY
} from './constants';

interface LevelConfig {
  rows: number;
  cols: number;
  speed: number;
  enemyCount: number;
  enemyHealth: number;
  enemyTypes?: Record<string, number>;
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input: InputHandler;
  private collisionManager: CollisionManager;
  private uiManager: UIManager;
  private player!: Player;
  private enemyWave!: EnemyWave;
  private bullets: Bullet[] = [];
  private gameRunning: boolean = true;
  private shootCooldown: number = 0;
  private gameTime: number = 0;
  private livesLostInLevel: number = 0;
  private score: number = 0;
  private currentLevel: number = 0;
  private levelConfigs: Record<string, any> = {};
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
    this.collisionManager = new CollisionManager();
    this.uiManager = new UIManager();
    this.levelConfigs = levelsData as Record<string, any>;
    this.reset();
  }

  private resolveLevelConfig(targetLevel: number): LevelConfig {
    const levelKeys = Object.keys(this.levelConfigs).map(k => parseInt(k)).filter(n => !isNaN(n)).sort((a, b) => a - b);
    const maxLevel = levelKeys.length > 0 ? Math.max(...levelKeys) : 0;

    // Find base level: latest <= targetLevel with no + keys
    let baseLevel = 0;
    for (let l = targetLevel; l >= 1; l--) {
      const key = l.toString();
      if (this.levelConfigs[key]) {
        const config = this.levelConfigs[key];
        const hasPlus = Object.keys(config).some(k => k.startsWith('+'));
        if (!hasPlus) {
          baseLevel = l;
          break;
        }
      }
    }

    const effective: any = { rows: 5, cols: 6, speed: 1.0, enemyCount: 30, enemyHealth: 1 };
    if (baseLevel > 0) {
      const baseConfig = this.levelConfigs[baseLevel.toString()];
      Object.assign(effective, baseConfig);
    }

    // Target config for increments
    const targetKey = targetLevel > maxLevel ? maxLevel.toString() : targetLevel.toString();
    const targetConfig = this.levelConfigs[targetKey];
    if (targetConfig) {
      if ('+speed' in targetConfig) {
        effective.speed = targetConfig['+speed'] * (targetLevel - 1);
      }
      if ('+enemyHealth' in targetConfig) {
        effective.enemyHealth = 1 + Math.floor(targetConfig['+enemyHealth'] * targetLevel - 1);
      }
    }
    return effective as LevelConfig;
  }

  private initLevel(levelIndex: number): void {
    const config = this.resolveLevelConfig(levelIndex + 1);
    this.currentLevelConfig = config;
    const waveConfig = {
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      cols: config.cols,
      rows: config.rows,
      spacingX: ENEMY_SPACING_X,
      spacingY: ENEMY_SPACING_Y,
      startX: ENEMY_WAVE_START_X,
      startY: ENEMY_WAVE_START_Y,
      speed: config.speed,
      dropDistance: ENEMY_DROP_DISTANCE,
      enemyCount: config.enemyCount,
      enemyHealth: config.enemyHealth,
      enemyTypes: config.enemyTypes
    };

    if (levelIndex === 0 || !this.enemyWave) {
      this.enemyWave = new EnemyWave(waveConfig);
    } else {
      this.enemyWave.spawnEnemies(waveConfig);
      this.enemyWave.setSpeed(config.speed);
    }
    this.bullets = [];
  }

  private reset(): void {
    this.player = new Player({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT, speed: PLAYER_SPEED, padding: GAME_PADDING });
    this.score = 0;
    this.currentLevel = 0;
    this.initLevel(0);
    this.gameRunning = true;
    this.hasStarted = false;
    this.isPaused = false;
    this.countdown = 0;
    this.shootCooldown = 0;
    this.gameTime = 0;
    this.livesLostInLevel = 0;
    this.lastEscapePressed = false;
    this.lastSpacePressed = false;
  }

  public start(): void {
    const loop = () => {
      this.update();
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
  }

  private update(): void {
    if (this.handlePauseAndStart()) return;
    if (this.countdown > 0) { 
      this.countdown--; 
      return; 
    }
    if (!this.gameRunning) {
      if (this.input.isPressed('Enter')) this.reset();
      return;
    }
      this.gameTime += 16.67;
  this.updateEntities();
    this.collisionManager.handleCollisions({
      bullets: this.bullets,
      player: this.player,
      enemyWave: this.enemyWave,
      scoreCallback: (pts) => this.score += pts,
      gameRunningCallback: (run) => this.gameRunning = run,
      onLifeLost: () => this.livesLostInLevel++
    });
    if (!this.enemyWave.hasRedEnemies()) this.nextLevel();
  }

  private handlePauseAndStart(): boolean {
    const escape = this.input.isPressed('Escape');
    if (escape && !this.lastEscapePressed) this.isPaused = !this.isPaused;
    this.lastEscapePressed = escape;
    if (this.isPaused) {
      if (this.input.isPressed('KeyR')) this.reset();
      return true;
    }
    if (!this.hasStarted) {
      const space = this.input.isPressed('Space');
      if (space && !this.lastSpacePressed) { 
        this.hasStarted = true; 
        this.countdown = COUNTDOWN_FRAMES; 
      }
      this.lastSpacePressed = space;
      return true;
    }
    return false;
  }

  private updateEntities(): void {
    this.player.update(this.input);
    if (this.shootCooldown <= 0) {
      const pos = this.player.getShootPosition();
      this.bullets.push(new Bullet(pos.x - BULLET_WIDTH / 2, pos.y, true));
      this.shootCooldown = SHOOT_INTERVAL;
    } else {
      this.shootCooldown--;
    }
    this.bullets = this.bullets.filter(b => b.update());
    const pPos = this.player.getShootPosition();
    const result = this.enemyWave.update(pPos.x, pPos.y, performance.now());
    this.gameRunning = result.continue;
    result.pendingBullets.forEach(pb => this.bullets.push(new Bullet(pb.x - BULLET_WIDTH / 2, pb.y, pb.isPlayer, pb.vx, pb.vy, pb.isOrangeBullet)));
  }

  private nextLevel(): void {
    let bonus = this.currentLevel * 10;
    if (this.livesLostInLevel === 0) bonus *= 2;
    this.score += bonus;
    this.livesLostInLevel = 0;
    this.currentLevel++;
    this.initLevel(this.currentLevel);
  }

  private getUIState(): any {
    return {
      score: this.score,
      currentLevel: this.currentLevel,
      lives: this.player.getLives(),
      hasStarted: this.hasStarted,
      countdown: this.countdown,
      isPaused: this.isPaused,
      gameRunning: this.gameRunning,
      currentLevelConfig: this.currentLevelConfig,
      gameTime: this.gameTime
    };
  }

  private render(): void {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    EntityRenderer.render(this.ctx, this.player, this.enemyWave, this.bullets, this.hasStarted);
    this.uiManager.render(this.ctx, {
      score: this.score,
      currentLevel: this.currentLevel,
      lives: this.player.getLives(),
      hasStarted: this.hasStarted,
      countdown: this.countdown,
      isPaused: this.isPaused,
      gameRunning: this.gameRunning,
      currentLevelConfig: this.currentLevelConfig,
      gameTime: this.gameTime
    });
  }
}