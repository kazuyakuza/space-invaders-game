# Plan: Fix Game Over Trigger

## Objective
Fix a bug where the game over state is triggered prematurely (50 pixels above the player) instead of when enemies reach the player's Y axis.

## Analysis
- Current implementation in [`EnemyWave.checkLoseCondition()`](src/ts/entities/EnemyWave.ts:86) uses `CANVAS_HEIGHT - LOSE_CONDITION_Y_OFFSET`.
- `LOSE_CONDITION_Y_OFFSET` is set to 100 in [`src/ts/constants.ts`](src/ts/constants.ts:7).
- `Player.y` is calculated as `CANVAS_HEIGHT - PLAYER_START_Y_OFFSET` in [`src/ts/entities/Player.ts`](src/ts/entities/Player.ts:28).
- `PLAYER_START_Y_OFFSET` is set to 50 in [`src/ts/constants.ts`](src/ts/constants.ts:19).
- This means the game over triggers at Y=700 while the player's top is at Y=750.

## Approach
1. Refactor [`EnemyWave`](src/ts/entities/EnemyWave.ts) to use the player's actual Y position for the lose condition.
2. Remove the redundant `LOSE_CONDITION_Y_OFFSET` constant from [`src/ts/constants.ts`](src/ts/constants.ts).
3. Update `EnemyWave.update()` to pass the `playerY` to `checkLoseCondition()`.
4. Verify the fix with unit tests.

## Detailed Steps

### 1. Preparation
- Ensure all tests pass before starting.

### 2. Implementation

#### 2.1. Update `src/ts/entities/EnemyWave.ts`
Modify `checkLoseCondition` to accept `playerY` and use it for the boundary check.

```typescript
// src/ts/entities/EnemyWave.ts

// Update signature
private checkLoseCondition(playerY: number): boolean {
    for (const enemy of this.enemies) {
        const bounds = enemy.getBounds();
        // Trigger if enemy bottom reaches or passes player top (playerY)
        if (bounds.y + bounds.height >= playerY) {
            return true;
        }
    }
    return false;
}

// Update call in update method
public update(playerX: number, playerY: number): WaveUpdateResult {
    // ... logic ...
    if (this.checkLoseCondition(playerY)) {
        return { continue: false, pendingBullets: [] };
    }
    return { continue: true, pendingBullets };
}
```

#### 2.2. Update `src/ts/constants.ts`
Remove the unused constant.

```typescript
// src/ts/constants.ts
// DELETE line 7: export const LOSE_CONDITION_Y_OFFSET = 100;
```

### 3. Verification

#### 3.1. Create Unit Test
Create `src/ts/__tests__/EnemyWave.test.ts` to verify the lose condition.

```typescript
import { describe, it, expect } from 'vitest';
import { EnemyWave } from '../entities/EnemyWave';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

describe('EnemyWave', () => {
    it('should trigger lose condition when enemy reaches playerY', () => {
        const wave = new EnemyWave({
            canvasWidth: CANVAS_WIDTH,
            canvasHeight: CANVAS_HEIGHT,
            cols: 1,
            rows: 1,
            spacingX: 0,
            spacingY: 0,
            startX: 0,
            startY: 750, // Set enemy at player Y
            speed: 1,
            dropDistance: 20,
            enemyCount: 1,
            enemyHealth: 1
        });

        // Player is at Y=750
        const result = wave.update(500, 750);
        expect(result.continue).toBe(false);
    });

    it('should NOT trigger lose condition when enemy is above playerY', () => {
        const wave = new EnemyWave({
            canvasWidth: CANVAS_WIDTH,
            canvasHeight: CANVAS_HEIGHT,
            cols: 1,
            rows: 1,
            spacingX: 0,
            spacingY: 0,
            startX: 0,
            startY: 700, // Set enemy above player Y
            speed: 1,
            dropDistance: 20,
            enemyCount: 1,
            enemyHealth: 1
        });

        // Player is at Y=750
        const result = wave.update(500, 750);
        expect(result.continue).toBe(true);
    });
});
```

### 4. Git Commits
- Commit 1: Refactor `EnemyWave` and remove redundant constant.
- Commit 2: Add unit tests for `EnemyWave` lose condition.

## Expected Result
The game should only end when an enemy's bottom edge touches or passes the player's top edge (Y axis).
