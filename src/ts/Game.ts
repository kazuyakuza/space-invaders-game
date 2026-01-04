import { InputHandler } from './InputHandler';
import { Player, type PlayerConfig } from './entities/Player';
import { Bullet } from './entities/Bullet';
import { EnemyWave, type EnemyWaveConfig } from './entities/EnemyWave';
import { CollisionManager, type CollisionContext } from './CollisionManager';
import { UIManager } from './UIManager';
import { EntityRenderer } from './Renderer';
import { LevelManager, type LevelConfig } from './LevelManager';
import { PauseManager } from './PauseManager';
import { HedgeDefense } from './entities/HedgeDefense';
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
  SCORE_PER_ENEMY,
  PLAYER_START_Y_OFFSET,
  HEDGE_MAX_COUNT,
  MARKET_ITEM_LIFE_PRICE,
  MARKET_ITEM_HEDGE_PRICE,
  HEDGE_START_Y_OFFSET,
  HEDGE_SPACING
} from './constants';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input: InputHandler;
  private collisionManager: CollisionManager;
  private uiManager: UIManager;
  private levelManager!: LevelManager;
  private pauseManager!: PauseManager;
  private player!: Player;
  private enemyWave!: EnemyWave;
  private bullets: Bullet[] = [];
  private hedgeDefenses: HedgeDefense[] = [];
  private gameRunning: boolean = true;
  private shootCooldown: number = 0;
  private gameTime: number = 0;
  private livesLostInLevel: number = 0;
  private score: number = 0;
  private currentLevel: number = 0;
  private currentLevelConfig: LevelConfig | null = null;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.input = new InputHandler();
    this.collisionManager = new CollisionManager();
    this.uiManager = new UIManager();
    this.levelManager = new LevelManager();
    this.pauseManager = new PauseManager();
    this.reset();
  }

  private initLevel(level: number): void {
    const config = this.levelManager.getResolvedConfig(level);
    this.currentLevelConfig = config;
    const waveConfig: EnemyWaveConfig = {
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

    if (level === 1 || !this.enemyWave) {
      this.enemyWave = new EnemyWave(waveConfig);
    } else {
      this.enemyWave.spawnEnemies(waveConfig);
      this.enemyWave.setSpeed(config.speed);
    }
    this.bullets = [];
  }

  private resetGameState(): void {
    this.score = 0;
    this.currentLevel = 1;
    this.gameRunning = true;
    this.shootCooldown = 0;
    this.gameTime = 0;
    this.livesLostInLevel = 0;
    this.hedgeDefenses = [];
  }

  private reset(): void {
    this.resetGameState();
    this.player = new Player({ canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT, speed: PLAYER_SPEED, padding: GAME_PADDING });
    this.pauseManager.reset();
    this.initLevel(1);
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
    if (this.pauseManager.handle(this.input, (i) => this.purchaseItem(i), () => this.reset())) return;
    if (this.pauseManager.getCountdown() > 0) { 
      this.pauseManager.updateCountdown(); 
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
      onLifeLost: () => this.livesLostInLevel++,
      hedgeDefenses: this.hedgeDefenses,
      spawnBullet: (x, y, isPlayer, vx, vy) => {
        this.bullets.push(new Bullet(x, y, isPlayer, vx, vy));
      }
    });
    if (!this.enemyWave.hasRedEnemies()) this.nextLevel();
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
    this.hedgeDefenses.forEach(h => h.update(16.67));
    this.hedgeDefenses = this.hedgeDefenses.filter(h => h.isActive());
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

  private purchaseItem(index: number): void {
    if (index === 0) {
      if (this.score >= MARKET_ITEM_LIFE_PRICE) {
        this.score -= MARKET_ITEM_LIFE_PRICE;
        this.player.addLife();
      }
    } else if (index === 1) {
      const activeCount = this.hedgeDefenses.filter(h => h.isActive()).length;
      if (activeCount < HEDGE_MAX_COUNT && this.score >= MARKET_ITEM_HEDGE_PRICE) {
        this.score -= MARKET_ITEM_HEDGE_PRICE;
        const y = CANVAS_HEIGHT - PLAYER_START_Y_OFFSET - HEDGE_START_Y_OFFSET - (activeCount * HEDGE_SPACING);
        this.hedgeDefenses.push(new HedgeDefense(y));
      }
    }
  }

  private render(): void {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    EntityRenderer.render(this.ctx, this.player, this.enemyWave, this.bullets, this.hedgeDefenses, this.pauseManager.getHasStarted());
    this.uiManager.render(this.ctx, {
      score: this.score,
      currentLevel: this.currentLevel,
      lives: this.player.getLives(),
      hasStarted: this.pauseManager.getHasStarted(),
      countdown: this.pauseManager.getCountdown(),
      isPaused: this.pauseManager.getIsPaused(),
      gameRunning: this.gameRunning,
      currentLevelConfig: this.currentLevelConfig,
      gameTime: this.gameTime
    });
  }

  public tick(): void {
    this.update();
    this.render();
  }

  public getHasStarted(): boolean {
    return this.pauseManager.getHasStarted();
  }

  public getCountdown(): number {
    return this.pauseManager.getCountdown();
  }

  public getScore(): number {
    return this.score;
  }

  public getCurrentLevel(): number {
    return this.currentLevel;
  }

  public getEnemyWave(): EnemyWave {
    return this.enemyWave;
  }

  public getPlayer(): Player {
    return this.player;
  }

  public getBullets(): Bullet[] {
    return this.bullets;
  }
}