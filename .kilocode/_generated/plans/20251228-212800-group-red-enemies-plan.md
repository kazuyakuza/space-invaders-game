# Implementation Plan: Group Red Enemies without Spaces

The goal is to ensure that red enemies in the `EnemyWave` formation are always grouped together without spaces (sequential slots) instead of being randomly scattered when their count is less than the total available slots.

## User Requirement
"the enemies red color must always be grouped without spaces between them. when the level is instantiated, spawn the red ones following this rule."

## Proposed Changes

### `src/ts/entities/EnemyWave.ts`

- Modify the `initializeEnemies` method to remove the shuffling logic for red enemies.
- For both "Legacy" and "Configured" waves, use sequential slot selection.

## Code Snippets

### Current Legacy Shuffling (Conceptual)
```typescript
      if (config.enemyCount < totalSlots) {
        for (let i = slots.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [slots[i], slots[j]] = [slots[j], slots[i]];
        }
        slots = slots.slice(0, config.enemyCount);
      }
```

### Proposed Legacy Sequential (Conceptual)
```typescript
      if (config.enemyCount < totalSlots) {
        slots = slots.slice(0, config.enemyCount);
      }
```

### Current Configured Shuffling (Conceptual)
```typescript
      if (redCount < totalSlots) {
        for (let i = slots.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [slots[i], slots[j]] = [slots[j], slots[i]];
        }
        slots = slots.slice(0, redCount);
      }
```

### Proposed Configured Sequential (Conceptual)
```typescript
      if (redCount < totalSlots) {
        slots = slots.slice(0, redCount);
      }
```

## Tiny Steps for Coder Agent

1. Open [`src/ts/entities/EnemyWave.ts`](src/ts/entities/EnemyWave.ts:68).
2. Locate the "Legacy all red" initialization block inside `initializeEnemies`.
3. Remove the `for` loop that performs the Fisher-Yates shuffle on the `slots` array.
4. Ensure `slots = slots.slice(0, config.enemyCount);` remains after the removal.
5. Locate the red enemy initialization block in the `else` (configured) part of `initializeEnemies` (around line 110).
6. Remove the `for` loop that performs the Fisher-Yates shuffle on the `slots` array for `redCount`.
7. Ensure `slots = slots.slice(0, redCount);` remains after the removal.
8. Verify that the changes do not introduce any syntax errors.
9. Run tests if available to ensure wave initialization still works.
