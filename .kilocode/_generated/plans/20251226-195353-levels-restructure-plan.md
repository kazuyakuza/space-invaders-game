# Level Restructure and Enemy Health Plan

This plan outlines the steps to restructure the level configuration system and implement enemy health in the Space Invaders game.

## 1. Data Structure Migration

### 1.1 Update `src/assets/levels.json`
- Migrate from an array structure to an object structure where keys are stringified level numbers.
- Add `enemyHealth` property to level definitions.
- Implement the `+` prefix for incremental property updates.

**New Structure Example:**
```json
{
  "1": {
    "rows": 5,
    "cols": 6,
    "speed": 1.0,
    "enemyCount": 30,
    "enemyHealth": 1
  },
  "2": {
    "+enemyHealth": 1,
    "+speed": 0.2
  },
  "5": {
    "rows": 6,
    "cols": 8,
    "speed": 1.5,
    "enemyCount": 48,
    "enemyHealth": 3
  }
}
```

## 2. Interface and Type Definitions

### 2.1 Update `LevelConfig` in `src/ts/Game.ts`
- Ensure it includes `enemyHealth`.
- Define `LevelData` interface to handle the raw JSON structure with optional `+` prefixed keys.

```typescript
interface LevelConfig {
  rows: number;
  cols: number;
  speed: number;
  enemyCount: number;
  enemyHealth: number;
}

interface RawLevelConfig {
  rows?: number;
  cols?: number;
  speed?: number;
  enemyCount?: number;
  enemyHealth?: number;
  "+rows"?: number;
  "+cols"?: number;
  "+speed"?: number;
  "+enemyCount"?: number;
  "+enemyHealth"?: number;
}

interface LevelsData {
  [key: string]: RawLevelConfig;
}
```

## 3. Level Resolution Logic

### 3.1 Implement `resolveLevelConfig` in `src/ts/Game.ts`
- This logic will handle finding the base level and accumulating property changes.

**Steps:**
1. Find the highest defined level number `L` in `LevelsData` that is less than or equal to the requested `levelIndex`.
2. Start with the configuration of the nearest "base" level (one that doesn't rely solely on `+` values, or simply the first level).
3. Iterate from level 1 up to `levelIndex`.
4. For each level `i` that exists in `LevelsData`:
   - If property `p` exists, set `currentConfig[p] = levelsData[i][p]`.
   - If `+p` exists, set `currentConfig[p] += levelsData[i]["+p"]`.
5. For infinity fallback (levels beyond the highest defined), use the highest resolved configuration.

## 4. Enemy Health Implementation

### 4.1 Update `src/ts/entities/Enemy.ts`
- Add `private health: number` and `private maxHealth: number`.
- Add `public takeDamage(amount: number): void`.
- Update `draw(ctx: CanvasRenderingContext2D)`:
  - Draw the health number centered inside the enemy's geometric shape.
  - Use a different color or font size for clarity.

### 4.2 Update `src/ts/entities/EnemyWave.ts`
- Update `EnemyWaveConfig` to include `enemyHealth`.
- Pass health to the `Enemy` constructor.

### 4.3 Update `src/ts/Game.ts`
- Update `handleCollisions()`:
  - Decrement enemy health instead of immediate destruction.
  - Only remove the enemy and update score if `enemy.getHealth() <= 0`.

## 5. Implementation Steps

1. **Restructure `levels.json`**: Apply the new object-based format with at least 2-3 levels showing both static and incremental properties.
2. **Update Interfaces**: Modify `src/ts/Game.ts` to include the new level data types.
3. **Refactor `initLevel`**: Replace the array-based index access with the new `resolveLevelConfig` logic.
4. **Modify `Enemy` Class**: Add health property, damage logic, and update the rendering to show health.
5. **Modify Collision Handling**: Update `handleCollisions` in `Game.ts` to respect enemy health.
6. **Verification**: Start the game and verify:
   - Level 1 enemies have the correct health and it's displayed.
   - Shooting an enemy reduces health.
   - Clearing a level correctly triggers the next level.
   - Incremental properties (e.g., `+enemyHealth`) are correctly resolved in Level 2.
