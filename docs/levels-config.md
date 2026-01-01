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

## Scaling Logic (1 to 100 Levels)

The game scales through 100 unique levels with increasing difficulty.

### 1. Movement Speed (`speed`)
- **Level 1-20**: +0.05 per level.
- **Level 21-50**: +0.03 per level.
- **Level 51-100**: +0.02 per level.

### 2. Grid Size
- **Rows**: Starts at 5, increases by 1 every 10 levels (Level 11: 6, Level 21: 7, etc., max 10).
- **Columns**: Starts at 6, increases by 1 roughly every 11 levels (Level 12: 7, Level 23: 8, etc., max 15).

### 3. Enemy Health (`enemyHealth`)
- **Level 1-25**: 1 hit.
- **Level 26-50**: 2 hits.
- **Level 51-100**: 3 hits.

### 4. Enemy Type Distribution
The distribution shifts from 100% Red enemies to a more challenging mix.

| Level | Red | Yellow | Orange | Violet |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 100% | 0% | 0% | 0% |
| 10 | 90% | 10% | 0% | 0% |
| 25 | 80% | 15% | 5% | 0% |
| 50 | 70% | 20% | 7% | 3% |
| 100 | 20% | 30% | 30% | 20% |

## Infinity Mode

If a player clears all 100 predefined levels, the game enters Infinity Mode starting at level 101. It repeats the configuration of level 100, with further difficulty scaling applied dynamically (e.g., speed increases per row drop).
