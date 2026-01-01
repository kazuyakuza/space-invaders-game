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

export class CollisionManager {
  private rectsIntersect(a: Bounds, b: Bounds): boolean {
    return a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y;
  }

  handleCollisions(
    bullets: Bullet[],
    player: Player,
    enemyWave: EnemyWave,
    scoreCallback: (points: number) => void,
    gameRunningCallback: (running: boolean) => void,
    onLifeLost: () => void
  ): void {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bulletBounds = bullets[i].getBounds();
      const playerBounds = player.getBounds();
      if (!bullets[i].isPlayerBullet) {
        if (this.rectsIntersect(bulletBounds, playerBounds)) {
          player.loseLife();
          onLifeLost();
          bullets.splice(i, 1);
          if (player.getLives() > 0) {
            player.resetPosition();
          } else {
            gameRunningCallback(false);
          }
          continue;
        }
      }
      const enemies = enemyWave.getEnemies();
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemyBounds = enemies[j].getBounds();
        if (this.rectsIntersect(bulletBounds, enemyBounds)) {
          if (!bullets[i].isPlayerBullet && bullets[i].isOrangeBullet) {
            continue;
          }
          if (enemies[j].takeDamage(1)) {
            enemyWave.removeEnemy(enemies[j]);
            scoreCallback(SCORE_PER_ENEMY);
          }
          bullets.splice(i, 1);
          break;
        }
      }
    }
  }
}