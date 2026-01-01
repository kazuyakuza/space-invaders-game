# Game Updates Plan - 2026-01-01

This plan covers multiple updates to the Space Invaders game, including player behavior changes, bug fixes in spawn logic and level loading, and new features like a game timer and level completion bonuses.

## 1. Player Auto-Shooting

Modify player behavior to shoot automatically while the game is in play status.

- **File**: `src/ts/Game.ts`
- **Change**: In `updateEntities()`, remove the requirement for `this.input.isPressed('Space')` to trigger player shooting.
- **Code snippet**:
  ```typescript
  // src/ts/Game.ts
  private updateEntities(): void {
    this.player.update(this.input);
    // Remove Space key check for auto-shooting
    if (this.shootCooldown <= 0) {
      const pos = this.player.getShootPosition();
      this.bullets.push(new Bullet(pos.x - BULLET_WIDTH / 2, pos.y, true));
      this.shootCooldown = SHOOT_INTERVAL;
    } else {
      this.shootCooldown--;
    }
    // ... rest of method
  }
  ```

## 2. Enemy Spawn Logic Fix

Ensure non-red enemies do not spawn in the same position or too close to each other.

- **File**: `src/ts/entities/FormationGenerator.ts`
- **Change**: Implement a position validation check during random spawning.
- **Implementation**:
  - Add a helper method `isPositionSafe(x, y, existingEnemies)` that checks distance between `(x, y)` and all `existingEnemies`.
  - Use a minimum distance threshold (e.g., `ENEMY_WIDTH * 1.5`).
  - Update `spawnYellowEnemies`, `spawnOrangeEnemies`, and `spawnVioletEnemies` to use this check in a loop with a maximum attempt limit.

## 3. Level Config Calculation Fix (+speed and +enemyHealth)

Correct the logic for incremental level properties using the specified formulas.

- **File**: `src/ts/Game.ts`
- **Change**: Refactor `resolveLevelConfig(targetLevel: number)` to implement the new formulas.
- **Logic**:
  1. Find the latest level config `<= targetLevel` that has no keys starting with `+` (the "base level").
  2. If the current target level config has `+speed`: `speed = increment * (targetLevel - 1)`.
  3. If the current target level config has `+enemyHealth`: `enemyHealth = 1 + Math.floor(increment * targetLevel - 1)`.
  4. Inherit other properties (rows, cols, etc.) from the base level.

## 4. Game Timer

Add a count-up timer to the HUD.

- **Files**: `src/ts/Game.ts`, `src/ts/UIManager.ts`
- **Game class changes**:
  - Add `private gameTime: number = 0;` (in milliseconds).
  - In `update()`, increment `gameTime` by `16.67` (approx 1/60s) if the game is running, started, and not paused.
  - Reset `gameTime` in `reset()`.
- **UIManager changes**:
  - Update `GameRenderState` interface to include `gameTime`.
  - In `renderHUD()`, format `gameTime` into `mm:ss` string.
  - Render the formatted string to the left of the Level label.

## 5. Level Completion Points

Implement a scoring bonus when completing a level, with a multiplier for perfect play.

- **Files**: `src/ts/Game.ts`, `src/ts/CollisionManager.ts`
- **Tracking logic**:
  - Add `private livesLostInLevel: number = 0;` to `Game`.
  - Update `CollisionManager.handleCollisions` to accept an `onLifeLost` callback.
  - Increment `livesLostInLevel` in the callback.
- **Bonus calculation**:
  - In `Game.nextLevel()`:
    - `let bonus = this.currentLevel * 10;`
    - `if (this.livesLostInLevel === 0) bonus *= 2;`
    - `this.score += bonus;`
    - `this.livesLostInLevel = 0;` (Reset for next level).

## Verification Steps

1.  Start game: Player should start shooting immediately without pressing Space.
2.  Check timer: Timer should start at 00:00 and pause when ESC is pressed.
3.  Load Level 3/6/8: Verify speed and health values in debug info match the new formulas.
4.  Complete a level: Verify score increases by `level * 10` (or `level * 20` if no lives lost).
5.  Check spawning: Observe yellow/orange enemies to ensure they don't overlap.
