# Plan: Fix BULLET_WIDTH ReferenceError

## Problem Statement
The game fails with 'Uncaught ReferenceError: BULLET_WIDTH is not defined at Game.ts:279:44'.
Analysis shows that `BULLET_WIDTH` is defined in `src/ts/constants.ts` but not imported in `src/ts/Game.ts`.

## Proposed Solution
Add `BULLET_WIDTH` to the named imports from `./constants` in `src/ts/Game.ts`.

## Implementation Steps

### 1. Git Branch Setup
- Create and switch to a new branch `fix/bullet-width-reference`.
```bash
git checkout -b fix/bullet-width-reference
```

### 2. Version Update
- Increment the version number in `package.json`.
  - Current version is likely 1.x.y, increment the patch version.

### 3. Code Modification
- Update `src/ts/Game.ts` to include `BULLET_WIDTH` in the imports.

```typescript
// src/ts/Game.ts

// SEARCH
  ENEMY_DROP_DISTANCE,
   SHOW_DEBUG_INFO,
  COUNTDOWN_FRAMES,
// REPLACE
  ENEMY_DROP_DISTANCE,
   SHOW_DEBUG_INFO,
  BULLET_WIDTH,
  COUNTDOWN_FRAMES,
```

### 4. Verification
- Run `npm run dev` to start the development server.
- Verify that the game loads without ReferenceErrors in the console.
- Verify that bullets are correctly centered when shooting.

### 5. Completion
- Mark the task as DONE in `.ai-agent/todos/20251227/20251227-todo-2.md`.
- Merge the branch into `main` and delete the feature branch.
