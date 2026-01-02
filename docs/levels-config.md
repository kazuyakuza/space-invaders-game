# Level Configuration Documentation

This document describes the structure and scaling logic of the multi-level progression system in Space Invaders, defined in [`src/assets/levels.json`](../src/assets/levels.json).

## JSON Structure

The `levels.json` file is an object where keys are level numbers (as strings) and values are configuration objects.

### Level Configuration Object

- `rows` (number): Number of enemy rows.
- `cols` (number): Number of enemy columns.
- `speed` (number): Base movement speed of enemies.
- `enemyCount` (number): Total number of enemies (usually `rows * cols`).
- `enemyHealth` (number): Base health/lives of enemies.
- `enemyTypes` (object): Distribution of enemy types (percentages adding up to 100).
  - `red`: Standard enemy.
  - `yellow`: Fast enemy.
  - `orange`: Targeting enemy.
  - `violet`: Boss enemy.

### Scaling Formulas (`+` prefix)

Properties prefixed with `+` use incremental formulas based on the distance from the nearest **base level** (a level defined without any `+` properties).

#### Enemy Speed Scaling

The `+speed` property defines an increment applied per level distance.
**Formula:** `effectiveSpeed = baseSpeed + (+speed * (currentLevel - baseLevel))`

#### Enemy Health Scaling

The `+enemyHealth` property defines a health increment factor applied per level distance.
**Formula:** `effectiveHealth = floor(baseHealth + (+enemyHealth * (currentLevel - baseLevel)))`

### Level Resolution Logic

The game uses a sparse level resolution system managed by [`src/ts/LevelManager.ts`](../src/ts/LevelManager.ts):

1.  **Identify Target Level**: The game starts at Level 1 by default.
2.  **Find Nearest Defined Level ($L_{defined}$)**: Searches backwards from the target level ($L_{target}$) for the closest level explicitly defined in `levels.json`.
3.  **Resolve Base Configuration**:
    - If $L_{defined}$ has no `+` properties, it is treated as a **base level**. Its properties are merged with global defaults.
    - If $L_{defined}$ contains `+` properties, the system searches further back for the nearest **base level** ($L_{base}$).
4.  **Accumulate and Apply**:
    - Non-delta properties (e.g., `rows`, `cols`, `enemyTypes`) are inherited from the nearest defined level ($L_{defined}$).
    - Delta properties (prefixed with `+`) are calculated using the formulas above, where the distance is $L_{target} - L_{base}$.

## Infinity Mode

If a player clears all 100 predefined levels, the game enters Infinity Mode starting at level 101. It repeats the configuration of level 100, while continuing to apply dynamic difficulty scaling (0.1% speed increase per row drop).
