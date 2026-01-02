import { Player } from './entities/Player';
import { EnemyWave } from './entities/EnemyWave';
import { Bullet } from './entities/Bullet';
import { HedgeDefense } from './entities/HedgeDefense';

export class EntityRenderer {
  static render(
    ctx: CanvasRenderingContext2D,
    player: Player,
    enemyWave: EnemyWave,
    bullets: Bullet[],
    hedgeDefenses: HedgeDefense[],
    hasStarted: boolean
  ): void {
    player.draw(ctx);
    if (hasStarted) {
      enemyWave.draw(ctx);
    }
    for (const bullet of bullets) {
      bullet.draw(ctx);
    }
    for (const hedge of hedgeDefenses) {
      hedge.draw(ctx);
    }
  }
}