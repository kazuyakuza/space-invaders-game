# Detailed Implementation Plan - 20251230

This plan addresses the level loading bug, the player lives UI enhancement, and the game over trigger adjustment.

## 1. Analysis Summary

### Bug: Level Loading
- **Root Cause**: `Game.nextLevel()` increments `this.currentLevel` but then manually calls `this.enemyWave.spawnRedFormation()`. This bypasses the full level resolution logic and only spawns Red enemies, ignoring other types (Yellow, Orange, Violet) defined in `levels.json`. It also fails to update `this.currentLevelConfig` and other wave-wide properties.
- **Fix**: Update `nextLevel()` to call `this.initLevel(this.currentLevel)`. This ensures that the next level is fully initialized using the resolved configuration, including correct enemy types and proportions.

### UI: Player Lives Dots
- **Current State**: Lives are rendered as text `Lives: X` at (GAME_PADDING, 60).
- **Requirement**: Display lives as dots (circles) in the bottom right corner.
- **Implementation**: Replace the text rendering in `UIManager.ts` with a loop that draws circles. Use `PLAYER_COLOR` for the dots.

### Gameplay: Game Over Trigger
- **Current State**: Game over triggers when enemies reach `canvasHeight - LOSE_CONDITION_Y_OFFSET` (offset is 100).
- **Requirement**: Trigger only when enemies reach the bottom of the game area.
- **Implementation**: Change `checkLoseCondition` in `EnemyWave.ts` to check if `bounds.y + bounds.height >= this.canvasHeight`.

## 2. Tiny Step-by-Step Plan

### Step 1: Git Setup & Version Update
- Create branch `fix/levels-and-ui` from `main`.
- Update `package.json` version to `1.1.14`.
- Commit version update.

### Step 2: Bug Reproduction Test
- Create `src/ts/__tests__/Reproduction.test.ts`.
- Mock `levels.json` with Level 1 (Red only) and Level 2 (with non-red enemies).
- Instantiate `Game`, clear level 1, and verify that level 2 wave contains non-red enemies.
- Run `npm run test` and expect failure.

### Step 3: Fix Level Loading
- File: `src/ts/Game.ts`
- Modify `nextLevel()`:
  ```typescript
  private nextLevel(): void {
    this.currentLevel++;
    this.initLevel(this.currentLevel);
  }
  ```
- Run tests to confirm fix.
- Commit: `fix: correctly load full level configuration and enemy types in nextLevel`

### Step 4: Implement Lives Dots UI
- File: `src/ts/UIManager.ts`
- Import `PLAYER_COLOR` from `./constants`.
- Locate lives text rendering (line 39).
- Replace with dot drawing loop:
  ```typescript
  const dotRadius = 6;
  const spacing = 20;
  const startX = CANVAS_WIDTH - GAME_PADDING - dotRadius;
  const startY = CANVAS_HEIGHT - GAME_PADDING - dotRadius;
  ctx.fillStyle = PLAYER_COLOR;
  for (let i = 0; i < state.lives; i++) {
    ctx.beginPath();
    ctx.arc(startX - (i * spacing), startY, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ```
- Commit: `feat: display player lives as dots in the bottom right corner`

### Step 5: Adjust Game Over Trigger
- File: `src/ts/entities/EnemyWave.ts`
- Modify `checkLoseCondition()`:
  ```typescript
  private checkLoseCondition(): boolean {
    for (const enemy of this.enemies) {
      const bounds = enemy.getBounds();
      if (bounds.y + bounds.height >= this.canvasHeight) {
        return true;
      }
    }
    return false;
  }
  ```
- Commit: `feat: trigger game over only when enemies reach the bottom of the screen`

### Step 6: Final Review & Merge
- Run all tests.
- Visual verification via `npm run dev`.
- Merge into `main`.

## 3. Terminal Commands
- `git checkout -b fix/levels-and-ui`
- `npm run test`
- `npm run dev`
