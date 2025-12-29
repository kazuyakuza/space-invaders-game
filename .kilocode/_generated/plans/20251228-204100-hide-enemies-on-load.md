# Plan: Hide Enemies on Load

This plan addresses the requirement that enemies should not be visible when the page is loaded. They should only become visible once the player starts the game.

## Analysis
The current implementation in `src/ts/Game.ts` initializes the first level in the constructor, which creates the `EnemyWave` object. The `render()` method then draws this wave unconditionally. Although the `update()` loop is paused until the player presses SPACE, the rendering continues to show the initial formation.

## Proposed Changes

### `src/ts/Game.ts`
Modify the `render()` method to only draw the enemies if the game has started (`this.hasStarted` is true).

```typescript
// src/ts/Game.ts

// ... inside render() method
    this.player.draw(this.ctx);
    
    // Only draw enemies if the game has started
    if (this.hasStarted) {
      this.enemyWave.draw(this.ctx);
    }
    
    for (const bullet of this.bullets) {
// ...
```

## Implementation Steps

1. **Modify `src/ts/Game.ts`**
    - Locate the `render()` method.
    - Wrap the call to `this.enemyWave.draw(this.ctx)` with an `if (this.hasStarted)` condition.

## Verification Plan

### Automated Tests
- Run `npm run test` to ensure no regressions in game logic.
- Add a test case in `src/ts/__tests__/Game.test.ts` (if possible) to verify that `enemyWave.draw` is not called when `hasStarted` is false. *Note: Testing canvas calls in Vitest might be complex, so manual verification is prioritized.*

### Manual Verification
1. Load the game in the browser.
2. Observe that the "Press SPACE to start" message is visible.
3. Observe that the player ship is visible at the bottom.
4. **Confirm that no enemies are visible on the screen.**
5. Press SPACE.
6. **Confirm that the enemies appear as the countdown begins.**
7. Verify that the game proceeds normally after the countdown.
