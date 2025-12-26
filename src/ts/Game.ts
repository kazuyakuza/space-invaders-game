import { InputHandler } from './InputHandler';
import { Player, type PlayerConfig } from './entities/Player';
import { Bullet } from './entities/Bullet';
import { EnemyWave, type EnemyWaveConfig } from './entities/EnemyWave';

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
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
  private player: Player;
  private enemyWave: EnemyWave;
  private bullets: Bullet[] = [];
  private gameRunning: boolean = true;
  private shootCooldown: number = 0;
  private readonly SHOOT_INTERVAL: number = 10;

  private score: number = 0;
  private readonly PADDING: number = 20;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.width = 1000;
    this.canvas.height = 800;

    this.input = new InputHandler();

    const canvasConfig = {
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height
    };

    const playerConfig: PlayerConfig = {
      ...canvasConfig,
      speed: 5,
      padding: this.PADDING
    };
    this.player = new Player(playerConfig);

    const enemyConfig: EnemyWaveConfig = {
      ...canvasConfig,
      cols: 6,
      rows: 5,
      spacingX: 60,
      spacingY: 50,
      startX: 50,
      startY: 50,
      speed: 1,
      dropDistance: 20
    };
    this.enemyWave = new EnemyWave(enemyConfig);
  }

  private reset(): void {
    this.score = 0;
    this.bullets = [];
    const canvasConfig = {
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height
    };
    const playerConfig: PlayerConfig = {
      ...canvasConfig,
      speed: 5,
      padding: this.PADDING
    };
    this.player = new Player(playerConfig);
    const enemyConfig: EnemyWaveConfig = {
      ...canvasConfig,
      cols: 6,
      rows: 5,
      spacingX: 60,
      spacingY: 50,
      startX: 50,
      startY: 50,
      speed: 1,
      dropDistance: 20
    };
    this.enemyWave = new EnemyWave(enemyConfig);
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
      this.shootCooldown = this.SHOOT_INTERVAL;
    } else {
      this.shootCooldown--;
    }

    // Update bullets
    this.bullets = this.bullets.filter(bullet => bullet.update());

    // Update enemies
    this.gameRunning = this.enemyWave.update();

    // Collision detection
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bulletBounds = this.bullets[i].getBounds();
      const enemies = this.enemyWave.getEnemies();
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemyBounds = enemies[j].getBounds();
        if (rectsIntersect(bulletBounds, enemyBounds)) {
          this.enemyWave.removeEnemy(enemies[j]);
          this.score += 10;
          this.bullets.splice(i, 1);
          break;
        }
      }
    }

    // Win condition
    if (this.enemyWave.isEmpty()) {
      this.gameRunning = false;
      // TODO: win screen
    }
  }

  private render(): void {
    // Clear with black background
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Score
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, this.PADDING, 30);

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
      const message = this.enemyWave.isEmpty() ? 'You Win!' : 'Game Over';
      this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '24px Arial';
      this.ctx.fillText('Press ENTER to restart', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }
  }
}
