# PLAN: Fix TypeError in CollisionManager

This plan addresses the unhandled TypeError in `src/ts/CollisionManager.ts` that causes the game to freeze when a level starts.

## High-Level Approach
1. **Analyze and Debug**: Identify the exact state causing `context.enemyWave.getEnemies()` to return `undefined` or `enemies` variable to be null.
2. **Defensive Coding**: Add guards in `CollisionManager.ts` to prevent accessing properties of `undefined`.
3. **Robust Initialization**: Ensure `enemyWave` is correctly initialized and passed from `Game.ts`.
4. **Validation**: Verify the fix prevents the freeze and allows levels to start correctly.

## Detailed Step-by-Step Plan

### 1. Git Feature Branch Setup (Step 2)
- [ ] Run `git status` and commit any pending changes.
- [ ] Switch to `main` branch.
- [ ] Create and switch to branch `fix/collision-manager-type-error`.

### 2. Version Update (Step 3)
- [ ] Increment version in `package.json` from `1.1.21` to `1.1.22`.
- [ ] Commit version change: `chore: increment version to 1.1.22`.

### 3. Task Execution (Step 4.2)
#### 3.1. Modify `src/ts/CollisionManager.ts`
- [ ] Locate the "Hedge defense - enemy collisions" section (around line 70).
- [ ] Add a check for `context.enemyWave` existence.
- [ ] Add a check for the `enemies` array returned by `getEnemies()`.
- [ ] Add a debug log if `enemies` is unexpectedly `undefined`.
- [ ] Example fix:
  ```typescript
  const enemies = context.enemyWave?.getEnemies();
  if (!enemies) {
    console.warn('CollisionManager: enemies array is undefined');
    return;
  }
  for (let i = 0; i < enemies.length; i++) { ... }
  ```

#### 3.2. Review `src/ts/Game.ts`
- [ ] Ensure `handleCollisions` is only called when `this.enemyWave` is valid.
- [ ] Ensure `this.enemyWave` is not cleared or set to null during the frame when `update()` is running.

### 4. Code Review (Step 4.3)
- [ ] Verify changes adhere to project rules (no commented code, private members, etc.).
- [ ] Check for any potential regressions in collision logic.

### 5. Documentation (Step 4.4)
- [ ] Update `memory-bank/context.md` with details of the fix.
- [ ] Add comments to `CollisionManager.ts` explaining the defensive checks.

### 6. Item Completion (Step 4.5)
- [ ] Mark the item in `.ai-agent/todos/20260103/20260103-todo-1.md` as `[DONE]`.
- [ ] Commit all changes with a meaningful message: `fix: prevent TypeError in CollisionManager and game freeze`.

### 7. TODO File Completion (Step 5)
- [ ] Rename `.ai-agent/todos/20260103/20260103-todo-1.md` to `20260103-todo-1-DONE.md`.
- [ ] Commit renamed TODO.
- [ ] Switch to `main` branch.
- [ ] Merge `fix/collision-manager-type-error` into `main`.
- [ ] Delete the feature branch.
- [ ] Push to `origin` if applicable.
