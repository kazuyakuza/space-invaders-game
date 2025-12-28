# Headless Testing Plan: Level Configuration & Infinity Fallback

This plan outlines the implementation of comprehensive unit tests for the level configuration logic in `Game.ts`, specifically focusing on `resolveLevelConfig` and the "Infinity" fallback mechanism.

## Analysis Summary

### 1. `resolveLevelConfig` Logic
The current implementation in `Game.ts` follows these rules:
- **Base Level Identification**: Finds the highest level `L <= targetLevel` that is "static" (contains no '+' prefixed keys).
- **Inheritance**: Initializes configuration from this base level.
- **Delta Accumulation**: Iterates from `baseLevel + 1` up to `targetLevel`. For each step `i`, it finds the highest level `Z <= i` that has "deltas" (keys with '+') and applies them.
- **Property Support**:
    - Numeric: `rows`, `cols`, `speed`, `enemyCount`, `enemyHealth`. These are accumulated if prefixed with `+`.
    - Object: `enemyTypes`. Currently overwritten, not accumulated.

### 2. Infinity Fallback
- When `targetLevel` exceeds the maximum defined level in `levels.json`, the logic continues to apply the last known delta configuration for every additional level.
- If the last defined levels are deltas, the challenge increases linearly.
- If the last defined level is static, the configuration remains frozen at that level (except for internal `EnemyWave` scaling).

## Test Strategy

### Mock Data Structure
We will use a controlled mock in `Game.test.ts` to verify all edge cases:
```json
{
  "1": {
    "rows": 5,
    "cols": 6,
    "speed": 1.0,
    "enemyCount": 30,
    "enemyHealth": 1,
    "enemyTypes": { "red": 100 }
  },
  "2": {
    "rows": 6,
    "cols": 8
  },
  "3": {
    "+speed": 0.5,
    "+enemyHealth": 1
  }
}
```

### Mathematically Correct Expectations

| Level | `rows` | `cols` | `speed` | `enemyHealth` | `enemyCount` | `enemyTypes` | Notes |
|-------|--------|--------|---------|---------------|--------------|--------------|-------|
| **1** | 5 | 6 | 1.0 | 1 | 30 | `{red: 100}` | Exact match |
| **2** | 6 | 8 | *NaN/Undef* | *NaN/Undef* | *NaN/Undef* | *Undef* | **Potential Bug Found**: Static levels don't inherit from previous static levels! |
| **3** | 6 | 8 | 0.5 | 1 | 0 | *Undef* | Accumulated from Level 2 + Level 3 deltas |
| **4** | 6 | 8 | 1.0 | 2 | 0 | *Undef* | Infinity Level 1 (Repeats Level 3 deltas) |
| **5** | 6 | 8 | 1.5 | 3 | 0 | *Undef* | Infinity Level 2 (Repeats Level 3 deltas twice) |

### Assertions to Implement
1. **Full Inheritance (L1)**: Verify all 6 properties match exactly.
2. **Static Overwrite (L2)**: Verify that `rows` and `cols` change, and document the behavior of missing properties (they are currently lost).
3. **Delta Accumulation (L3)**: Verify `speed` and `enemyHealth` are added correctly.
4. **Infinity Progression (L4, L5)**: Verify linear increase of `speed` and `enemyHealth` beyond defined levels.
5. **EnemyTypes Preservation**: Verify that `enemyTypes` is correctly carried over or replaced.

## Implementation Steps

1. **Setup Mock**: Update the `vi.mock` in `src/ts/__tests__/Game.test.ts` to match the test structure above.
2. **Test L1**: Implementation of `toMatchObject` covering all fields.
3. **Test L2 (Bug Verification)**: Assert that properties NOT defined in L2 are currently `undefined` (or fix the logic if desired, but this plan focuses on testing existing logic).
4. **Test L3**: Assert accumulated values.
5. **Test Infinity**: Run a loop or multiple assertions for levels 4, 5, and 10 to ensure consistent delta application.
6. **Negative Testing**: Verify that non-prefixed properties in delta levels are NOT accumulated but treated as overwrites (if they were to exist).

## Bug Verification
Tests should specifically fail if:
- `+` prefix is ignored.
- Static levels accidentally accumulate from previous static levels.
- Infinity levels stop at the max defined level.
