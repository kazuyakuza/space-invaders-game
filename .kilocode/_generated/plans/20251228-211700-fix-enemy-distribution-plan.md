# Plan: Fix Enemy Distribution Bug

## Problem
In `src/ts/entities/EnemyWave.ts`, the distribution of enemies by type based on percentages uses `Math.floor`. This leads to a total number of enemies that is often less than the `enemyCount` defined in `levels.json` due to rounding losses.

## Objective
Ensure the total number of spawned enemies exactly matches `enemyCount` by using a distributive rounding approach (cumulative share calculation). This specifically "rounds up" fractional values in a way that preserves the total.

## Proposed Solution
Implement a cumulative distribution logic:
1. Define a deterministic order for enemy types (Red, Yellow, Orange, Violet).
2. For each type, calculate the target cumulative count based on the sum of percentages so far.
3. The count for the current type is `Math.ceil(total * cumulativePct) - alreadyAllocated`.
4. This ensures that:
   - Major types (like Red at 95%) are rounded up to the nearest integer.
   - The total sum of all types equals exactly `enemyCount`.

## Files to Modify
- `src/ts/entities/EnemyWave.ts`

## Implementation Steps

### 1. Update `initializeEnemies` Logic
- Replace the simple loop that uses `Math.floor` with a cumulative distribution loop.
- Example logic:
  ```typescript
  const typeCounts: Record<string, number> = {};
  const sortedTypes = ['red', 'yellow', 'orange', 'violet'];
  let allocated = 0;
  let cumulativePct = 0;

  for (const type of sortedTypes) {
    if (config.enemyTypes && config.enemyTypes[type] !== undefined) {
      cumulativePct += config.enemyTypes[type];
      const targetCumulative = Math.ceil(config.enemyCount * (cumulativePct / 100));
      const count = targetCumulative - allocated;
      typeCounts[type] = count;
      allocated += count;
    }
  }
  // Safety check: ensure exactly enemyCount if total pct was 100
  // (cumulativePct should be 100 if config is correct)
  ```

### 2. Tiny Steps for Coder Agent
1. **Locate** the `initializeEnemies` method in [`src/ts/entities/EnemyWave.ts`](src/ts/entities/EnemyWave.ts).
2. **Find** the block where `typeCounts` is populated (currently uses `Math.floor`).
3. **Replace** that block with the cumulative rounding logic described above.
4. **Ensure** the loop iterates through types in a fixed order: `['red', 'yellow', 'orange', 'violet']`.
5. **Verify** that the individual spawn loops (for Red, Yellow, etc.) still use the counts from `typeCounts`.
6. **Confirm** that the legacy "all red" fallback logic remains unaffected.

## Verification
- Run the game and check console (if logging added) or observe total enemies in a level where counts were previously low (e.g. 29 instead of 30).
- Run unit tests to ensure no regressions in level resolution.
