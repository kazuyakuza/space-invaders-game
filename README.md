# Space Invaders Game

This project is a classic Space Invaders game. The player controls a spaceship at the bottom of the screen and must shoot down waves of aliens descending from the top.

## Goals

- Recreate the classic Space Invaders arcade experience.
- Implement core gameplay mechanics, including player movement, shooting, and enemy patterns.
- Create a scoring system to track player performance.

## Project Scope

- Developed using HTML, CSS, and TypeScript (using Vite).
- Multi-level system driven by a JSON configuration file (`levels.json`).
- Player lives system: 3 lives with respawning.
- Player controls: cursor keys for movement, space bar for shooting.
- Level-specific enemy waves and patterns (Red, Yellow, Orange, Violet enemies).
- Player loses if enemies reach the bottom of the screen or all lives are lost.
- Uses geometric figures for the ship and enemies, no sound.
- Real-time UI for score, level, and lives tracking.
- "Night mode" color scheme with a black background.

## Development Setup

- **Prerequisites**: Node.js and npm installed.
- **Installation**: Run `npm install` to install dependencies.
- **Execution**: Use `npm run dev` to start the local development server.
- **Testing**: Use `npm run test` to run headless unit tests with Vitest.