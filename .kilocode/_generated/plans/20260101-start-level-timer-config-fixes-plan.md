# Implementation Plan - Start Level, Timer Format, and Level Config Fixes

This plan outlines the changes required to fix the start level, timer format, and level configuration loading logic.

## Goal
- Fix start level to be 1 instead of 0.
- Fix timer format to be MM:SS.
- Fix level configuration loading logic to correctly handle sparse levels and delta accumulation.

## Proposed Changes

### 1. Game Logic (`src/ts/Game.ts`)

#### Start Level
- Initialize `currentLevel` to `1` instead of `0`.
- Update `reset()` to set `currentLevel` to `1`.
- Update `initLevel(levelIndex: number)` to `initLevel(level: number)`.
- Update `nextLevel()` to increment `currentLevel` and call `initLevel(this.currentLevel)`.

#### Level Config Loading (`resolveLevelConfig`)
- Implement a robust logic for `resolveLevelConfig(targetLevel: number)`:
  1. Find the nearest level `L_defined` <= `targetLevel` that exists in `levels.json`.
  2. If `L_defined` has no "+" keys:
     - Iterate from level 1 up to `L_defined`, merging each defined level that has no "+" keys to create a fully resolved base config.
  3. If `L_defined` has "+" keys:
     - Find the nearest level `L_base` < `L_defined` that has no "+" keys.
     - Resolve `L_base` using the logic above.
     - Apply formula: `effective.speed = base.speed + (defined.+speed * (targetLevel - L_base))`
     - Apply formula: `effective.enemyHealth = base.enemyHealth + Math.floor(defined.+enemyHealth * (targetLevel - L_base))`
  4. Ensure all other properties (rows, cols, enemyTypes, etc.) are inherited from the resolved base config or the latest defined level.

### 2. UI Manager (`src/ts/UIManager.ts`)

#### Timer Format
- Update `formatTime(gameTime: number)`:
  - Use `Math.floor(gameTime / 1000)` to get total seconds.
  - Calculate `minutes` and `seconds` from `totalSeconds`.
  - Return formatted `MM:SS`.

### 3. Tests (`src/ts/__tests__/Game.test.ts`)

- Update tests to expect `currentLevel` to start at 1.
- Update `resolveLevelConfig` tests to verify the new accumulation logic and sparse level inheritance.

## Verification Plan

### Automated Tests
- Run `npm run test` to ensure all tests pass, including updated tests for level resolution.

### Manual Verification
- Start the game and verify "Level: 1" is displayed.
- Verify timer starts at "00:00" and increments correctly.
- Use debug info (if enabled) to verify level configuration values (speed, health) match expectations for different levels.
