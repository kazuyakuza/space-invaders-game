# Plan: Update levels.json to 1000 Levels

This plan outlines the strategy for scaling the Space Invaders game from 3 levels to 1000 levels, ensuring a gradual and engaging difficulty progression.

## High-Level Approach

The game utilizes a cumulative level resolution logic (`resolveLevelConfig` in `Game.ts`). We will leverage this by defining a sequence of levels in `src/assets/levels.json` that introduce changes at specific milestones and provide small incremental increases (`+` prefix) in between.

We will provide a script for the Coder to generate the complete `levels.json` file. The script will implement a non-linear scaling algorithm to keep the game balanced as it progresses to level 1000.

## Scaling Logic

### 1. Movement Speed (`speed`)
- **Level 1-100**: Increase base speed by 0.01 per level. (Ending at ~2.0)
- **Level 101-500**: Increase base speed by 0.005 per level. (Ending at ~4.0)
- **Level 501-1000**: Increase base speed by 0.002 per level. (Ending at ~5.0)

### 2. Grid Size (`rows` & `cols`)
- **Rows**: Start at 5. Increase by 1 every 100 levels, up to a max of 10.
- **Cols**: Start at 6. Increase by 1 every 50 levels, up to a max of 15.

### 3. Enemy Health (`enemyHealth`)
- **Level 1-100**: 1 hit.
- **Level 101-1000**: Increase by 1 every 200 levels (e.g., Level 201: 2 hits, Level 401: 3 hits, etc.).

### 4. Enemy Type Distribution (`enemyTypes`)
We will gradually shift the percentage distribution to favor specialized enemies.

| Level Range | Red (Standard) | Yellow (Fast) | Orange (Targeting) | Violet (Boss) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 100% | 0% | 0% | 0% |
| 10 | 90% | 10% | 0% | 0% |
| 50 | 80% | 15% | 5% | 0% |
| 100 | 70% | 20% | 7% | 3% |
| 500 | 40% | 30% | 20% | 10% |
| 1000 | 10% | 30% | 40% | 20% |

## Implementation Plan for Coder

### Step 1: Prepare Generation Script
Create a temporary Node.js script `scripts/generate-levels.js` that generates the JSON structure based on the logic above.

### Step 2: Generate JSON
Run the script to overwrite `src/assets/levels.json` with 1000 entries.

### Step 3: Validation
- Verify the first few levels match expectations.
- Verify mid-game levels (e.g., 500) have increased rows/cols/speed.
- Verify level 1000 is extremely challenging but theoretically possible.

## Exact JSON Structure (Example for first levels)
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
    "+speed": 0.01
  },
  ...
  "10": {
    "+speed": 0.01,
    "enemyTypes": { "red": 90, "yellow": 10 }
  }
}
```

## Tiny Steps for Coder
1. Create `scripts` directory if it doesn't exist.
2. Create `scripts/generate-levels.js`.
3. Implement logic in `generate-levels.js` to iterate from 1 to 1000.
4. For Level 1, define the full base config.
5. For levels > 1, determine if any property needs to change or accumulate.
6. Write the resulting object to `src/assets/levels.json`.
7. Run `node scripts/generate-levels.js`.
8. Clean up by deleting `scripts/generate-levels.js`.
