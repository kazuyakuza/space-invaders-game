# Context

## Current State

Space Invaders game features a complete multi-level progression system. The codebase now uses a centralized `constants.ts` file and a simplified level JSON structure for easier configuration and maintenance.

## Recent Changes

- Refactored level configuration and extracted core constants into `src/ts/constants.ts`.
- Implemented random enemy spawning logic for more varied gameplay.
- Refactored `Game.ts` to stay under the 200-line limit by extracting collision handling logic.
- Implemented JSON-based level configuration system (`src/assets/levels.json`).
- Added level management logic in `Game.ts` including level loading and infinity fallback.
- Implemented immediate next-level spawning upon clearing a wave.
- Added velocity scaling in `EnemyWave.ts` (0.1% speed increase per row drop).
- Integrated real-time score and level display in the UI.
- Implemented basic collision detection and game over state.

## Next Steps

- Polish UI and visual effects.
- Add sound effects and background music.
- Implement player lives and health system.
- Add more diverse level configurations to `levels.json`.
- Implement specialized enemy behaviors or boss levels.
