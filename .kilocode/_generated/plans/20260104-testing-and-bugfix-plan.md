# Plan: Testing Framework Implementation and Collision Bug Fix

This plan outlines the steps to fix a TypeError in the collision detection system and implement a headless E2E testing framework for the game.

## 1. Analysis

### Collision Bug
- **Error**: `Uncaught TypeError: Cannot read properties of undefined (reading 'length')` at `CollisionManager.ts:78:34`.
- **Cause**: The `handleCollisions` method in `CollisionManager.ts` accesses `hedges.length`. `hedges` is initialized from `context.hedgeDefenses`. In `src/ts/Game.ts`, the `CollisionContext` passed to `handleCollisions` is missing the `hedgeDefenses` property.

### Testing Framework
- **Goal**: Implement a headless E2E testing framework using Vitest and jsdom.
- **Components**:
    - `GameSimulation`: A controller object that manages the `Game` instance, allowing manual "ticking" of the game loop and inspection of internal state.
    - `PlayerController`: A utility to simulate keyboard events (keydown/keyup) that the `InputHandler` reacts to.
- **Requirements**:
    - `Game.ts` needs to be more test-friendly (exposing a public `tick` method and state getters).
    - Tests must be deterministic (mocking `performance.now()`).

## 2. Approach

### Fix
- Add `hedgeDefenses: this.hedgeDefenses` to the `CollisionContext` in `src/ts/Game.ts`.

### Testing Framework
- **Refactor `Game.ts`**:
    - Add `public tick(): void` which calls private `update()` and `render()`.
    - Add getters for: `hasStarted`, `countdown`, `score`, `currentLevel`, `enemyWave`, `bullets`, `player`.
- **Helpers**:
    - `GameSimulation.ts`: Wraps `Game`, provides `step(count)` and `getState()`.
    - `PlayerController.ts`: Dispatches `KeyboardEvent` to `document`.
- **E2E Test**:
    - Verify game starts correctly upon "Space" bar simulation.
    - Verify countdown behavior.

## 3. Tiny Steps

### Phase 1: Bug Fix
- [ ] In `src/ts/Game.ts`, update line 136 (the `handleCollisions` call) to include `hedgeDefenses: this.hedgeDefenses`.
- [ ] Run current tests to ensure no regressions: `npm run test`.

### Phase 2: Game Testability Refactor
- [ ] In `src/ts/Game.ts`:
    - [ ] Add `public tick(): void { this.update(); this.render(); }`.
    - [ ] Add `public getHasStarted(): boolean { return this.hasStarted; }`.
    - [ ] Add `public getCountdown(): number { return this.countdown; }`.
    - [ ] Add `public getScore(): number { return this.score; }`.
    - [ ] Add `public getCurrentLevel(): number { return this.currentLevel; }`.
    - [ ] Add `public getEnemyWave(): any { return this.enemyWave; }`.
    - [ ] Add `public getPlayer(): any { return this.player; }`.
    - [ ] Add `public getBullets(): any[] { return this.bullets; }`.

### Phase 3: Helper Implementation
- [ ] Create `src/ts/__tests__/helpers/PlayerController.ts`:
    - [ ] Implement `press(key: string)`: `document.dispatchEvent(new KeyboardEvent('keydown', { code: key }))`.
    - [ ] Implement `release(key: string)`: `document.dispatchEvent(new KeyboardEvent('keyup', { code: key }))`.
- [ ] Create `src/ts/__tests__/helpers/GameSimulation.ts`:
    - [ ] Constructor initializes `new Game()`.
    - [ ] Implement `step(frames: number)`: Calls `game.tick()` N times.
    - [ ] Implement `getState()`: Returns aggregated object from game getters.

### Phase 4: E2E Test Case
- [ ] Create `src/ts/__tests__/StartGame.e2e.test.ts`:
    - [ ] Setup Vitest with `jsdom` and `vitest-canvas-mock`.
    - [ ] Mock `performance.now()` using `vi.spyOn(performance, 'now')` or `vi.useFakeTimers()`.
    - [ ] Test Case: "Game starts and proceeds through countdown":
        - [ ] Assert `state.hasStarted` is false initially.
        - [ ] Simulate "Space" press/release.
        - [ ] Assert `state.hasStarted` is true.
        - [ ] Assert `state.countdown` is `COUNTDOWN_FRAMES`.
        - [ ] Step simulation N times.
        - [ ] Assert `state.countdown` decreases.
        - [ ] Step simulation past `COUNTDOWN_FRAMES`.
        - [ ] Assert `state.countdown` is 0.
        - [ ] Verify enemy wave has moved (comparing positions).

## 4. Verification
- [ ] Run `npm run test`.
- [ ] Ensure all tests pass.
