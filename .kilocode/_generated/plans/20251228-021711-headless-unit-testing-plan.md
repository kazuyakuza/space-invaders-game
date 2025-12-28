# Implementation Plan: Headless Unit Testing with Vitest

This plan outlines the steps to implement a headless unit testing environment for the Space Invaders project using Vitest, jsdom, and vitest-canvas-mock. The primary focus is testing the complex level resolution logic in `Game.ts`.

## 1. Installation of Dependencies

Install the required testing packages as dev dependencies:
- `vitest`: The test runner.
- `jsdom`: To simulate the browser environment (DOM APIs).
- `vitest-canvas-mock`: To mock the HTML5 Canvas API which is heavily used by `Game.ts`.

```bash
npm install -D vitest jsdom vitest-canvas-mock
```

## 2. Configuration of Vitest

### `vite.config.ts` Update
Add the `test` configuration block to the existing [`vite.config.ts`](vite.config.ts).

```typescript
// vite.config.ts modification
export default defineConfig({
  // ... existing config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/ts/__tests__/**/*.test.ts'],
  },
});
```

### `package.json` Update
Add a test script to [`package.json`](package.json).

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:run": "vitest run"
}
```

## 3. DOM and Canvas Mocking Strategy

### Setup File (`tests/setup.ts`)
Create a setup file to initialize the mock environment before each test. This ensures `vitest-canvas-mock` is loaded and the global `document` is ready.

```typescript
import 'vitest-canvas-mock';
import { beforeEach } from 'vitest';

beforeEach(() => {
  // Ensure a clean canvas element exists for Game.ts to find
  document.body.innerHTML = '<canvas id="gameCanvas"></canvas>';
});
```

## 4. Test Cases for `resolveLevelConfig`

The tests will focus on the `private` method `resolveLevelConfig` by accessing it via `(game as any)`.

### Mock Data Strategy
Use `vi.mock` to provide a controlled `levels.json` for testing.

```typescript
vi.mock('../assets/levels.json', () => ({
  default: {
    "1": {
      "rows": 5,
      "cols": 6,
      "speed": 1.0,
      "enemyCount": 30,
      "enemyHealth": 1
    },
    "2": {
      "rows": 6,
      "cols": 8
    },
    "3": {
      "+speed": 0.5
    }
  }
}));
```

### Case 1: Full Definition (Level 1)
- **Input**: `targetLevel = 1`
- **Expected Output**: Matches Level 1 exactly.
- **Verification**: `rows: 5, cols: 6, speed: 1.0, enemyCount: 30, enemyHealth: 1`.

### Case 2: Sparse Inheritance (Level 2)
- **Input**: `targetLevel = 2`
- **Current Behavior Analysis**: Since Level 2 has no `+` keys, it is considered "static". `resolveLevelConfig` will use it as the base. If it's sparse, the resulting config will be sparse (missing fields from Level 1).
- **Expected Verification**: `rows: 6, cols: 8`. (Note: This test will confirm if fields like `speed` are correctly inherited or lost).

### Case 3: Incremental Accumulation (`+` prefix)
- **Input**: `targetLevel = 3`
- **Logic**: Static base is Level 2. Level 3 has `+speed: 0.5`.
- **Expected Output**: `{ rows: 6, cols: 8, speed: 0.5 }`. (Speed starts at 0 because it's missing in Level 2 base).

### Case 4: Infinity Fallback
- **Input**: `targetLevel = 5`
- **Logic**: Static base is Level 2. Levels 3, 4, and 5 will all use Level 3's deltas (since 3 is the max delta level <= i).
- **Calculation**:
  - Base (L2): `{ rows: 6, cols: 8 }`
  - i=3: apply L3 delta (+0.5 speed) -> 0.5
  - i=4: apply L3 delta (+0.5 speed) -> 1.0
  - i=5: apply L3 delta (+0.5 speed) -> 1.5
- **Expected Output**: `{ rows: 6, cols: 8, speed: 1.5 }`.

## 5. Files to be Created/Modified

- **Modified**: [`vite.config.ts`](vite.config.ts) - Add Vitest configuration.
- **Modified**: [`package.json`](package.json) - Add test scripts.
- **New**: `tests/setup.ts` - Global test setup and DOM initialization.
- **New**: `src/ts/__tests__/Game.test.ts` - The unit tests for `Game.ts`.

## 6. Detailed Implementation Steps

1.  **Dependency Installation**: Run `npm install` for `vitest`, `jsdom`, and `vitest-canvas-mock`.
2.  **Scripts Update**: Add `test` scripts to [`package.json`](package.json).
3.  **Vite Config**: Add `test` section to [`vite.config.ts`](vite.config.ts) with `environment: 'jsdom'`.
4.  **Setup Creation**: Create `tests/setup.ts` and import `vitest-canvas-mock`.
5.  **Test File Creation**: Create `src/ts/__tests__/Game.test.ts`.
6.  **Mock Implementation**: Add `vi.mock` for `../assets/levels.json` at the top of the test file.
7.  **Test Suite Boilerplate**: Implement `describe('Game resolveLevelConfig', () => { ... })`.
8.  **Case 1 Implementation**: Test Level 1 full resolution.
9.  **Case 2 Implementation**: Test Level 2 sparse static behavior.
10. **Case 3 Implementation**: Test Level 3 incremental accumulation.
11. **Case 4 Implementation**: Test Level 5 infinity accumulation logic.
12. **Execution**: Run `npm test` to verify all cases pass and document the behavior of sparse static levels.
