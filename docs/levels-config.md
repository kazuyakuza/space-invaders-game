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

Properties prefixed with `+` use absolute formulas based on the current level number, overriding any hardcoded base values when present in the target configuration.

#### Enemy Speed Scaling

The `+speed` property defines an increment applied per level.
**Formula:** `effectiveSpeed = 1 + (+speed * (currentLevel - 1))`

#### Enemy Health Scaling

The `+enemyHealth` property defines a health increment factor.
**Formula:** `effectiveHealth = 1 + floor(+enemyHealth * currentLevel - 1)`

### Level Resolution Logic

The game resolves the configuration for a target level as follows:

1. **Find Base Level**: Searches backwards from the target level for the latest level definition that does **not** contain any `+` prefixed keys.
2. **Inherit Base Values**: Loads all properties from this base level.
3. **Apply Increments**: If the target level's own configuration contains `+speed` or `+enemyHealth`, the absolute formulas above are applied, overriding the inherited base values.

## Infinity Mode

If a player clears all 100 predefined levels, the game enters Infinity Mode starting at level 101. It repeats the configuration of level 100, while continuing to apply dynamic difficulty scaling (0.1% speed increase per row drop).
