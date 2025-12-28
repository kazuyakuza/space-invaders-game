# Plan: Fix render toFixed TypeError

The game crashes with `Uncaught TypeError: Cannot read properties of undefined (reading 'toFixed')` at `Game.ts:361:65`. This happens because `this.currentLevelConfig.speed` is undefined when `SHOW_DEBUG_INFO` is true and a level is loaded without an explicit `speed` property (like Level 3 in `levels.json`).

## Proposed Changes

### 1. Safe Debug Info Rendering
Update `src/ts/Game.ts` to safely access `currentLevelConfig` properties in the `render` method.

- Add nullish coalescing operators or default values when rendering `rows`, `cols`, `speed`, `enemyCount`, and `enemyHealth`.
- Specifically, ensure `speed` is treated as a number before calling `toFixed(2)`.

### 2. Robust Level Configuration Resolution
Refactor `resolveLevelConfig` in `src/ts/Game.ts` to ensure it always returns a complete `LevelConfig` object, even if the requested level is sparsely defined.

- Initialize the `effective` configuration with sensible default values (from Level 1 or constants).
- Correct the logic that identifies "static" levels to ensure incomplete levels don't wipe out existing configuration properties.
- Ensure that properties are correctly merged or overridden as the logic iterates through levels.

## Detailed Steps

1.  **Modify `src/ts/Game.ts` - `render` method**:
    - Change line 359: `this.ctx.fillText(\`Rows: \${this.currentLevelConfig.rows ?? 'N/A'}\`, GAME_PADDING, 80);`
    - Change line 360: `this.ctx.fillText(\`Cols: \${this.currentLevelConfig.cols ?? 'N/A'}\`, GAME_PADDING, 100);`
    - Change line 361: `this.ctx.fillText(\`Speed: \${(this.currentLevelConfig.speed ?? 0).toFixed(2)}\`, GAME_PADDING, 120);`
    - Change line 362: `this.ctx.fillText(\`Enemy Count: \${this.currentLevelConfig.enemyCount ?? 'N/A'}\`, GAME_PADDING, 140);`
    - Change line 363: `this.ctx.fillText(\`Enemy Health: \${this.currentLevelConfig.enemyHealth ?? 'N/A'}\`, GAME_PADDING, 160);`

2.  **Modify `src/ts/Game.ts` - `resolveLevelConfig` method**:
    - Initialize `effective` with Level 1 values as a baseline if `targetLevel > 0`.
    - Improve the property merging loop to ensure all properties from previous levels are retained unless explicitly overridden.

## Verification Plan

1.  Set `SHOW_DEBUG_INFO` to `true` in `src/ts/constants.ts` (if not already).
2.  Start the game and progress to Level 2 and Level 3.
3.  Verify that the debug info displays correctly without crashing.
4.  Verify that Level 3 correctly inherits `rows`, `cols`, and `speed` from Level 1, while using its own `enemyTypes`.
