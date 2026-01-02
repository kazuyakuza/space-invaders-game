# Level Configuration Documentation

This document describes the structure and loading logic of the multi-level progression system in Space Invaders, defined in [`src/assets/levels.json`](../src/assets/levels.json).

## JSON Structure

The `levels.json` file is an object where keys are level numbers (as strings, "1" through "100") and values are configuration objects. All levels from 1 to 100 are explicitly defined.

### Level Configuration Object

Each level must include the following properties:

- `rows` (number): Number of enemy rows.
- `cols` (number): Number of enemy columns.
- `speed` (number): Base movement speed of enemies.
- `enemyCount` (number): Total number of enemies (calculated as `rows * cols`).
- `enemyHealth` (number): Base health/lives of enemies.
- `enemyTypes` (object): Distribution of enemy types (percentages adding up to 100).
  - `red`: Standard enemy.
  - `yellow`: Fast enemy.
  - `orange`: Targeting enemy.
  - `violet`: Boss enemy.

## Level Loading Logic

The game uses a simplified direct-lookup system managed by [`src/ts/LevelManager.ts`](../src/ts/LevelManager.ts):

1.  **Direct Lookup**: When a level is requested, the system attempts to retrieve the configuration directly from the `levels.json` object using the level number as the key.
2.  **Explicit Definitions**: All levels from 1 to 100 are fully defined in the JSON file. The system no longer uses incremental accumulation or delta properties (prefixed with `+`).
3.  **Fallback (Infinity Mode)**: For any level requested beyond the last defined level (Level 100), the system uses Level 100 as the base configuration.

## Validation

The system enforces strict validation during level initialization. A runtime error is thrown if:
- A configuration for a requested level is missing (for levels 1-100).
- Any required property (`rows`, `cols`, `speed`, `enemyCount`, `enemyHealth`) is undefined in the configuration.

## Difficulty Scaling

While the base configuration is static per level, dynamic difficulty scaling still applies during gameplay:
- **Velocity Increment**: Enemy velocity increases by 0.1% ([`DIFFICULTY_SPEED_INCREMENT`](../src/ts/constants.ts)) every time the wave drops a row.
- **Infinity Mode Scaling**: In Infinity Mode (Level 101+), the game continues to repeat the Level 100 configuration while maintaining the dynamic velocity scaling.
