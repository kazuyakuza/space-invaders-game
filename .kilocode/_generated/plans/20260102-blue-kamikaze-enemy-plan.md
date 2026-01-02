# Implementation Plan - Blue Kamikaze Enemy

This document outlines the detailed plan for implementing the "Blue Kamikaze Enemy" in the Space Invaders game.

## Overview

The Blue Kamikaze Enemy is a new enemy type that starts appearing from level 36. It spawns within the main enemy grid (alongside Red enemies) but has a unique appearance (Blue Hexagon) and behavior (explodes on contact with player bullets, firing 3 bullets at specific targets).

## 1. Constants Update

Update [`src/ts/constants.ts`](src/ts/constants.ts) to include:

- `BLUE_ENEMY_COLOR`: `#0000ff`
- Kamikaze bullet targets:
    - `KAMIKAZE_TARGET_HUD`: `(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20)`
    - `KAMIKAZE_TARGET_LEFT`: `(CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2)`
    - `KAMIKAZE_TARGET_RIGHT`: `(5 * CANVAS_WIDTH / 6, CANVAS_HEIGHT / 2)`

## 2. Base Class Refactor

Update [`src/ts/entities/Enemy.ts`](src/ts/entities/Enemy.ts):

- Add `drawHexagon(ctx: CanvasRenderingContext2D, drawX?: number, drawY?: number): void` protected method.
- Update `takeDamage(amount: number, spawnBullet?: (x: number, y: number, vx: number, vy: number) => void): boolean` signature.
- This allows enemies to trigger actions (like spawning bullets) when they receive damage or die.

## 3. Implement BlueEnemy Class

Create [`src/ts/entities/BlueEnemy.ts`](src/ts/entities/BlueEnemy.ts):

- Inherit from `Enemy`.
- Use `BLUE_ENEMY_COLOR` and health 1 (or as defined by level).
- Override `draw`: call `drawHexagon` and `drawHealth`.
- Override `takeDamage`:
    - Calculate direction vectors for 3 bullets targeting the points defined in step 1.
    - Normalize vectors and multiply by `BULLET_SPEED`.
    - Call the `spawnBullet` callback for each of the 3 bullets.
    - Always return `true` to ensure immediate death upon being shot.

## 4. Collision Manager Update

Update [`src/ts/CollisionManager.ts`](src/ts/CollisionManager.ts):

- Update `CollisionContext` to include `spawnBullet: (x: number, y: number, isPlayer: boolean, vx?: number, vy?: number) => void`.
- Update the bullet-enemy collision loop:
    ```typescript
    if (enemies[j].takeDamage(1, (x, y, vx, vy) => context.spawnBullet(x, y, false, vx, vy))) {
      context.enemyWave.removeEnemy(enemies[j]);
      context.scoreCallback(SCORE_PER_ENEMY);
    }
    ```

Update [`src/ts/Game.ts`](src/ts/Game.ts) in `update()`:
- Pass the `spawnBullet` logic to `collisionManager.handleCollisions`:
    ```typescript
    spawnBullet: (x, y, isPlayer, vx, vy) => {
      this.bullets.push(new Bullet(x, y, isPlayer, vx, vy));
    }
    ```

## 5. Formation Generator Update

Update [`src/ts/entities/FormationGenerator.ts`](src/ts/entities/FormationGenerator.ts):

- Add `blue` to `sortedTypes` and ensure it's handled.
- Implement random grid placement for Red/Blue mix:
    - Get all grid slots.
    - Shuffle the slots array.
    - Allocate the first `redCount` slots to `RedEnemy`.
    - Allocate the next `blueCount` slots to `BlueEnemy`.
- Ensure `BlueEnemy` instances are created correctly in the grid.

## 6. Enemy Wave Update

Update [`src/ts/entities/EnemyWave.ts`](src/ts/entities/EnemyWave.ts):

- Update movement and edge detection methods (`moveRedEnemies`, `checkRedEdgeHit`) to include `BlueEnemy` instances.
- Consider renaming them to `moveGridEnemies` and `checkGridEdgeHit` for clarity.
- Update `hasRedEnemies` to `hasWinningEnemies` or similar if Blue enemies also count towards level completion (usually grid enemies all need to be destroyed).

## 7. Level Configuration Update

Update [`src/assets/levels.json`](src/assets/levels.json):

- Modify level 36 (or the nearest base level) to include `"blue": 10` (or appropriate percentage) in `enemyTypes`.
- Ensure subsequent levels inherit or explicitly define the blue enemy presence.

## Verification Plan

### Unit Tests
- Create tests for `BlueEnemy` to verify it fires 3 bullets on `takeDamage`.
- Verify `FormationGenerator` correctly randomizes grid positions.

### Manual Verification
- Start game and use developer console to jump to level 36.
- Verify Blue enemies appear in the grid at random positions.
- Verify Blue enemies have a hexagon shape.
- Verify Blue enemies explode and fire 3 bullets when hit.
- Verify kamikaze bullets damage the player ship.
