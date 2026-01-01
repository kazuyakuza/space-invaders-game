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

### Incremental Updates (`+` prefix)

Properties prefixed with `+` are added to the accumulated values from previous levels. For example, `"+speed": 0.01` increases the current speed by 0.01.

## Infinity Mode

If a player clears all 100 predefined levels, the game enters Infinity Mode starting at level 101. It repeats the configuration of level 100, with further difficulty scaling applied dynamically (e.g., speed increases per row drop).
