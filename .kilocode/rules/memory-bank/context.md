# Context

## Current State

Space Invaders game now features a complete multi-level progression system. Players can progress through waves of enemies with increasing difficulty, tracked by a scoring system and level display.

## Recent Changes

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
