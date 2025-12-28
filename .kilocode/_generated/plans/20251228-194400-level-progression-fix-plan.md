# Plan: Fix Level Progression Crash and Refactor resolveLevelConfig

## Problem Description
The game crashes when transitioning from Level 1 to Level 2 because [`src/assets/levels.json`](../../src/assets/levels.json) defines Level 2 sparsely (only `enemyTypes`), and the current [`resolveLevelConfig`](../../src/ts/Game.ts:118) implementation in [`src/ts/Game.ts`](../../src/ts/Game.ts) resets the configuration when it encounters a level without '+' prefixes, leading to `undefined` values for critical parameters like `rows` and `cols`.

## Proposed Solution
Refactor `resolveLevelConfig` to use an iterative accumulation approach. Instead of searching for the latest static level and applying deltas, the new implementation will start with a default base and iterate through all levels from 1 up to the target level, merging properties (and accumulating for '+' prefixed keys) along the way.

### Iterative Accumulation Logic
1.  Initialize an `effective` config with safe defaults.
2.  Get all defined level keys from `levels.json`.
3.  Loop from level 1 to `targetLevel` (capped at the maximum defined level).
4.  For each level `i`:
    *   If `levels[i]` exists:
        *   For each `key`, `value` in `levels[i]`:
            *   If `key` starts with `+`:
                *   `prop = key.slice(1)`
                *   `effective[prop] += value`
            *   Else:
                *   `effective[key] = value` (Direct replacement, handles `enemyTypes` objects)

```mermaid
graph TD
    A[Start resolveLevelConfig targetLevel] --> B[Initialize effective config with defaults]
    B --> C[Loop i from 1 to min targetLevel, maxDefinedLevel]
    C --> D{levelConfigs[i] exists?}
    D -- Yes --> E[Loop entries in levelConfigs[i]]
    E --> F{Key starts with '+'?}
    F -- Yes --> G[Add value to effective[prop]]
    F -- No --> H[Replace effective[key] with value]
    G --> I[Next Entry]
    H --> I
    I --> J{More Entries?}
    J -- Yes --> E
    J -- No --> K[Next Level]
    K --> L{More Levels?}
    L -- Yes --> C
    L -- No --> M[Return effective config]
    D -- No --> K
```

## Implementation Steps

### 1. Refactor `src/ts/Game.ts`
*   Replace the current `resolveLevelConfig` implementation with the iterative logic.
*   Remove helper methods `isStaticLevel` and `hasDeltas` as they will no longer be needed.
*   Ensure `effective` starts with sane defaults (matching Level 1's base values).

### 2. Verification / Testing
*   **Unit Test**: Create or update a test case in `src/ts/__tests__/Game.test.ts` to verify that `resolveLevelConfig(2)` returns a complete object with inherited values from Level 1.
*   **Manual Test**: Play through Level 1 in the browser and ensure Level 2 starts correctly with the new `enemyTypes` (Orange enemies should appear) and preserved `rows`/`cols`.

## Instructions for Coder Agent
1.  Modify [`src/ts/Game.ts`](../../src/ts/Game.ts):
    *   Locate [`resolveLevelConfig`](../../src/ts/Game.ts:118).
    *   Implement the iterative merge logic.
    *   Remove [`isStaticLevel`](../../src/ts/Game.ts:108) and [`hasDeltas`](../../src/ts/Game.ts:113).
2.  Ensure that the `enemyTypes` object is correctly replaced when specified in a level (e.g., Level 2's `enemyTypes` should replace Level 1's, not merge at the object level, unless specified otherwise).
3.  Verify that `targetLevel` is handled correctly for levels beyond those defined in JSON (Infinity mode).
4.  Run existing tests using `npm run test` to ensure no regressions.
