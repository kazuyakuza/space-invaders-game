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

## Scaling Logic (1 to 1000 Levels)

The game scales through 1000 unique levels with increasing difficulty.

### 1. Movement Speed (`speed`)
- **Level 1-100**: +0.01 per level.
- **Level 101-500**: +0.005 per level.
- **Level 501-1000**: +0.002 per level.

### 2. Grid Size
- **Rows**: Starts at 5, increases by 1 every 100 levels (max 10).
- **Columns**: Starts at 6, increases by 1 every 50 levels (max 15).

### 3. Enemy Health (`enemyHealth`)
- **Level 1-100**: 1 hit.
- **Level 101-1000**: Increases by 1 every 200 levels (Level 201: 2 hits, Level 401: 3 hits, etc.).

### 4. Enemy Type Distribution
The distribution shifts from 100% Red enemies to a more challenging mix.

| Level | Red | Yellow | Orange | Violet |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 100% | 0% | 0% | 0% |
| 10 | 90% | 10% | 0% | 0% |
| 50 | 80% | 15% | 5% | 0% |
| 100 | 70% | 20% | 7% | 3% |
| 500 | 40% | 30% | 20% | 10% |
| 1000 | 10% | 30% | 40% | 20% |

## Infinity Mode

If a player clears all 1000 predefined levels, the game continues using the configuration of level 1000, with further difficulty scaling applied dynamically (e.g., speed increases per row drop).
