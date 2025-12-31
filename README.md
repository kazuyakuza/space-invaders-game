# Space Invaders

Modern TypeScript/HTML5 Canvas remake of the classic arcade game.

## Features

- **Multi-level system**: JSON-driven ([`src/assets/levels.json`](src/assets/levels.json)) with sparse definitions and '+' incremental accumulation, supporting 1000 unique levels.
- **Enemy varieties** (geometric pentagons):
  - **Red** ([`RedEnemy.ts`](src/ts/entities/RedEnemy.ts)): Standard. Level ends when all cleared (others preserved).
  - **Yellow**: Faster movement.
  - **Orange** ([`OrangeEnemy.ts`](src/ts/entities/OrangeEnemy.ts)): Player-targeting shots, bullets pass through enemies.
  - **Violet** ([`VioletEnemy.ts`](src/ts/entities/VioletEnemy.ts)): 10x health mini-boss (triple visual).
- **Difficulty scaling**: +0.1% speed per row drop ([`DIFFICULTY_SPEED_INCREMENT`](src/ts/constants.ts:23)).
- **Player lives**: 3 lives with respawn.
- **Game over**: Enemies reach player Y or 0 lives ([`checkLoseCondition`](src/ts/entities/EnemyWave.ts:107)).
- **Infinity mode**: Repeats last level.
- **Pause/Start**: ESC pause, Space start after countdown, R/Enter restart ([`Game.handlePauseAndStart`](src/ts/Game.ts:124)).
- **UI**: Live score/level/lives ([`UIManager`](src/ts/UIManager.ts)).
- **No audio/images**: Pure canvas shapes, night theme.
- **Tests**: Vitest headless ([`Game.test.ts`](src/ts/__tests__/Game.test.ts)).

## Controls

- Arrow keys: Move
- Space: Shoot
- ESC: Pause/unpause
- R/Enter: Restart

## Setup

```bash
npm install
npm run dev
```

Canvas: [`1000x800`](src/ts/constants.ts:1) @60fps via [`requestAnimationFrame`](src/ts/main.ts).

## Architecture

See [`architecture.md`](.kilocode/rules/memory-bank/architecture.md).
