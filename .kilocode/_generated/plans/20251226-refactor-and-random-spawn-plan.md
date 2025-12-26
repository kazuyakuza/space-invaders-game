# Implementation Plan - Refactor and Random Spawn

This plan outlines the steps to refactor hardcoded constants, move specific level properties to constants, and implement a random enemy spawning logic based on level configuration.

## 1. Constants Refactoring

### 1.1. Create `src/ts/constants.ts`
Move all identified hardcoded values and the specific level properties to this file.

- **Game Constants:**
  - `CANVAS_WIDTH = 1000`
  - `CANVAS_HEIGHT = 800`
  - `SHOOT_INTERVAL = 10`
  - `GAME_PADDING = 20`
  - `ENEMY_WAVE_START_X = 50`
  - `ENEMY_WAVE_START_Y = 50`
  - `LOSE_CONDITION_Y_OFFSET = 100`
  - `SCORE_PER_ENEMY = 10`
  - `DIFFICULTY_SPEED_INCREMENT = 1.001` (from `EnemyWave.ts` line 67)

- **Level Constants (moved from `levels.json`):**
  - `ENEMY_SPACING_X = 60`
  - `ENEMY_SPACING_Y = 50`
  - `ENEMY_DROP_DISTANCE = 20`

- **Player Constants:**
  - `PLAYER_WIDTH = 40`
  - `PLAYER_HEIGHT = 30`
  - `PLAYER_SPEED = 5`
  - `PLAYER_COLOR = '#00ff00'`
  - `PLAYER_START_Y_OFFSET = 50`

- **Enemy Constants:**
  - `ENEMY_WIDTH = 30`
  - `ENEMY_HEIGHT = 20`
  - `ENEMY_COLOR = '#ff0000'`

- **Bullet Constants:**
  - `BULLET_WIDTH = 5`
  - `BULLET_HEIGHT = 15`
  - `BULLET_SPEED = 7`
  - `BULLET_COLOR = '#ffffff'`

### 1.2. Update Existing Files to Use Constants
- `src/ts/Game.ts`: Replace literals and local constants with imports from `constants.ts`.
- `src/ts/entities/Player.ts`: Replace literals with imports.
- `src/ts/entities/Enemy.ts`: Replace literals with imports.
- `src/ts/entities/Bullet.ts`: Replace literals with imports.
- `src/ts/entities/EnemyWave.ts`: Replace literals and config properties with imports.

## 2. Level Loading Update

### 2.1. Update `src/assets/levels.json`
- Remove `spacingX`, `spacingY`, and `dropDistance` from all level objects.
- Add `enemyCount` property to each level.
- Example updated structure:
  ```json
  [
    {
      "rows": 5,
      "cols": 6,
      "speed": 1.0,
      "enemyCount": 20
    }
  ]
  ```

### 2.2. Update Interfaces and Configs
- Update `LevelConfig` interface in `src/ts/Game.ts`.
- Update `EnemyWaveConfig` interface in `src/ts/entities/EnemyWave.ts`.
- Ensure `initLevel` in `Game.ts` passes the new `enemyCount` to `EnemyWave`.

## 3. Random Enemy Distribution Logic

### 3.1. Modify `EnemyWave.initializeEnemies`
Implement the logic to distribute `enemyCount` enemies across `rows * cols` available slots.

1. **Calculate Slots:** Create a list of all available coordinate pairs `(row, col)` from `0` to `rows-1` and `0` to `cols-1`.
2. **Handle Density:**
   - If `enemyCount >= rows * cols`: Fill all slots (classic behavior).
   - If `enemyCount < rows * cols`:
     - Shuffle the list of slots using Fisher-Yates shuffle.
     - Select the first `enemyCount` slots from the shuffled list.
3. **Spawn Enemies:** Iterate through the selected slots and create `Enemy` instances at the corresponding coordinates.

## 4. Build and Verification

### 4.1. Run Build
- Execute `npm run build` to check for TypeScript errors or bundling issues.

### 4.2. Fix Errors
- Resolve any type mismatches or missing imports resulting from the refactoring.

## Summary of Changes
- **New File:** `src/ts/constants.ts`
- **Modified Files:** `src/assets/levels.json`, `src/ts/Game.ts`, `src/ts/entities/EnemyWave.ts`, `src/ts/entities/Player.ts`, `src/ts/entities/Enemy.ts`, `src/ts/entities/Bullet.ts`.
