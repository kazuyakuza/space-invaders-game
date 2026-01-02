# Context

## Current State

Space Invaders game features advanced multi-level progression system with sparse object-based levels.json supporting '+' accumulation properties via `LevelManager.ts`, enemy health/lives system, centralized `constants.ts`, simplified level JSON structure for configuration, improved game over detection at player base Y, enemy persistence across levels for non-red types, adjusted orange enemy shooting frequency, violet enemy hitbox planning. HUD timer now displays in "MM:SS" format. A headless unit testing environment using Vitest is in place.

## Recent Changes (v1.1.16)

- **Level Management Overhaul**:
    - Implemented `LevelManager.ts` to centralize level resolution and delta accumulation logic.
    - **Sparse Resolution**: The game now correctly resolves levels even if they aren't explicitly defined in `levels.json` by finding the nearest previous defined level.
    - **Delta Accumulation**: Properties like `+speed` and `+enemyHealth` are accumulated based on the distance from the nearest **base level** (a level without any `+` properties).
    - **Start Level Fix**: Ensured the game correctly initializes and starts at Level 1.
- **UI Improvements**:
    - Updated the HUD survival timer to display in "MM:SS" format for better readability.

## Recent Changes (v1.1.15)

- **Bug Fixes and Reviews (feat/bug-fixes-and-reviews merged to main)**: Fixed enemies game over trigger to reach player base Y position, preserved surviving non-red enemies state (position, config, behavior) on level end, limited orange enemies shooting to ~1 per minute, created detailed plan for violet enemy hitbox fix (wider bounding box for three pentagons), updated README.md and brief.md with comprehensive game details.
- **Architecture Refactor**: Split `Game.ts` and `EnemyWave.ts` into specialized managers:
  - `CollisionManager.ts`: Centralized collision detection logic.
  - `UIManager.ts`: Handles all HUD and screen overlay rendering.
  - `Renderer.ts`: Orchestrates entity drawing.
  - `FormationGenerator.ts`: Decoupled enemy spawning and formation logic.
- **Player Lives System**: Implemented a 3-lives system with respawning and visual UI tracking.
- **Enemy Behavior Enhancements**:
  - **Level Completion**: Levels now end when all Red enemies are cleared; other types are preserved.
  - **Orange Enemy**: Implemented targeting logic and bullet transparency (bullets pass through other enemies).
  - **Violet Enemy**: Increased health to 10x for mini-boss encounters.
- Refactored level configuration and extracted core constants into `src/ts/constants.ts`.
- Implemented random enemy spawning logic for more varied gameplay.
- Refactored `Game.ts` to stay under the 200-line limit by extracting collision handling logic.
- Implemented JSON-based level configuration system (`src/assets/levels.json`).
- Added level management logic in `Game.ts` including level loading and infinity fallback.
- Implemented immediate next-level spawning upon clearing a wave.
- Added velocity scaling in `EnemyWave.ts` (0.1% speed increase per row drop).
- Integrated real-time score and level display in the UI.
- Implemented basic collision detection and game over state.
- Restructured `levels.json` to use object with level numbers as keys, enabling sparse definitions.
- Added '+' prefix support for incremental property accumulation from base levels.
- Implemented enemy health system: configurable lives per enemy, visual display, updated collisions.
- Fixed TypeError in `Game.render()` where `toFixed()` was called on undefined (`src/ts/Game.ts`).
- Implemented headless unit testing using Vitest, jsdom, and vitest-canvas-mock.
- Fixed UI state passing in Game.render() to UIManager by adding gameRunning and currentLevelConfig.
- Refactored UIManager.render() into private renderHUD() and renderOverlays() methods.
- Implemented LOSE_CONDITION_Y_OFFSET usage in EnemyWave.checkLoseCondition() for game over trigger.
- **Level Configuration Refactor**: Reduced levels from 1000 to 100 in `src/assets/levels.json`, implemented new difficulty scaling logic (speed tiers, rows/cols increments, health increments), and updated infinity mode to start at level 101. Updated documentation (`docs/levels-config.md`, memory bank) to reflect these changes.

## Next Steps

- Complete violet enemy hitbox implementation from the plan in `.kilocode/_generated/plans/20251230-violet-enemy-hit-box.md`.
- Polish UI and visual effects.
- Add sound effects and background music.
- Add more diverse level configurations to `levels.json`.
- Implement specialized boss levels with unique patterns.
- Implement power-up system for the player.