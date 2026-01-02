import { Bullet } from './entities/Bullet';
import { Player } from './entities/Player';
import { EnemyWave } from './entities/EnemyWave';
import { SCORE_PER_ENEMY } from './constants';

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollisionContext {
  bullets: Bullet[];
  player: Player;
  enemyWave: EnemyWave;
  scoreCallback: (points: number) => void;
  gameRunningCallback: (running: boolean) => void;
  onLifeLost: () => void;
  spawnBullet: (x: number, y: number, isPlayer: boolean, vx?: number, vy?: number) => void;
}

export class CollisionManager {
  private rectsIntersect(a: Bounds, b: Bounds): boolean {
    return a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y;
  }

  handleCollisions(context: CollisionContext): void {
    for (let i = context.bullets.length - 1; i >= 0; i--) {
      const bulletBounds = context.bullets[i].getBounds();
      const playerBounds = context.player.getBounds();
      if (!context.bullets[i].isPlayerBullet) {
        if (this.rectsIntersect(bulletBounds, playerBounds)) {
          context.player.loseLife();
          context.onLifeLost();
          context.bullets.splice(i, 1);
          if (context.player.getLives() > 0) {
            context.player.resetPosition();
          } else {
            context.gameRunningCallback(false);
          }
          continue;
        }
      }
      const enemies = context.enemyWave.getEnemies();
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemyBounds = enemies[j].getBounds();
        if (this.rectsIntersect(bulletBounds, enemyBounds)) {
          if (!context.bullets[i].isPlayerBullet && context.bullets[i].isOrangeBullet) {
            continue;
          }
          if (enemies[j].takeDamage(1, (x, y, vx, vy) => context.spawnBullet(x, y, false, vx, vy))) {
            context.enemyWave.removeEnemy(enemies[j]);
            context.scoreCallback(SCORE_PER_ENEMY);
          }
          context.bullets.splice(i, 1);
          break;
        }
      }
    }
  }
}