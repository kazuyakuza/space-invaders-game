# Context

## Current State

Space Invaders game features advanced multi-level progression system with sparse object-based levels.json supporting '+' accumulation properties, enemy health/lives system, centralized `constants.ts`, and simplified level JSON structure for configuration. A headless unit testing environment is also in place using Vitest.

## Recent Changes (v1.1.13)

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

## Next Steps

- Polish UI and visual effects.
- Add sound effects and background music.
- Add more diverse level configurations to `levels.json`.
- Implement specialized boss levels with unique patterns.
- Implement power-up system for the player.
