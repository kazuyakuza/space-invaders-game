# Plan: Fix Orange Enemy Spawn Position

The goal is to modify `src/ts/entities/EnemyWave.ts` to ensure that orange enemies spawn at the top of the game area, similar to yellow enemies, instead of at the bottom.

## Analysis
Currently, `OrangeEnemy` instances are initialized in the `initializeEnemies` method of [`EnemyWave.ts`](src/ts/entities/EnemyWave.ts) with a `y` coordinate set to `bottomY`.

```typescript
      // Orange bottom
      const orangeCount = typeCounts['orange'] || 0;
      const bottomY = config.canvasHeight - ENEMY_HEIGHT - GAME_PADDING * 2;
      for (let i = 0; i < orangeCount; i++) {
        const x = GAME_PADDING + Math.random() * (config.canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
        const y = bottomY;
        this.enemies.push(new OrangeEnemy(x, y, config.enemyHealth));
      }
```

This needs to be updated to use `y = 0` (or some other top-aligned value).

## Proposed Changes

### 1. Update [`EnemyWave.ts`](src/ts/entities/EnemyWave.ts)

Modify the `initializeEnemies` method to set the `y` coordinate for `OrangeEnemy` to `0`.

#### Code Snippet

```typescript
<<<<<<< SEARCH
      // Orange bottom
      const orangeCount = typeCounts['orange'] || 0;
      const bottomY = config.canvasHeight - ENEMY_HEIGHT - GAME_PADDING * 2;
      for (let i = 0; i < orangeCount; i++) {
        const x = GAME_PADDING + Math.random() * (config.canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
        const y = bottomY;
        this.enemies.push(new OrangeEnemy(x, y, config.enemyHealth));
      }
=======
      // Orange top
      const orangeCount = typeCounts['orange'] || 0;
      for (let i = 0; i < orangeCount; i++) {
        const x = GAME_PADDING + Math.random() * (config.canvasWidth - 2 * GAME_PADDING - ENEMY_WIDTH);
        const y = 0;
        this.enemies.push(new OrangeEnemy(x, y, config.enemyHealth));
      }
>>>>>>> REPLACE
```

## Tiny Steps for Coder Agent

1. Open [`src/ts/entities/EnemyWave.ts`](src/ts/entities/EnemyWave.ts).
2. Locate the section in `initializeEnemies` that handles `orangeCount`.
3. Remove the `bottomY` calculation.
4. Update the loop to set `y = 0`.
5. Update the comment from `// Orange bottom` to `// Orange top`.
6. Verify the changes and run tests if available (`npm run test`).
7. Run the game to confirm orange enemies spawn at the top.
