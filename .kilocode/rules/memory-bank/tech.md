# Tech

## Technologies Used

- **HTML5 Canvas**: Core rendering engine for 2D graphics.
- **TypeScript**: Used for all game logic, providing type safety and better developer experience.
- **Vite**: Modern build tool and development server for bundling assets and TypeScript.
- **JSON**: Used for externalizing level configurations (`src/assets/levels.json`).
- **Vitest**: Headless unit testing framework.
- **jsdom**: DOM implementation for headless testing.
- **vitest-canvas-mock**: Mocking for HTML5 Canvas API in tests.

## Development Setup

- **Prerequisites**: Node.js and npm installed.
- **Installation**: Run `npm install` to install dependencies (Vite).
- **Execution**: Use `npm run dev` to start the local development server.
- **Testing**: Use `npm run test` to execute headless unit tests.

## Technical Constraints

- **Frame Rate**: Targeting 60fps using `requestAnimationFrame`.
- **Canvas Dimensions**: Hardcoded to 1000x800 for consistent layout across devices.
- **No External Libraries**: Pure vanilla implementation to minimize overhead and dependencies.

## Dependencies

- **Vite**: Build system and dev server.
- **TypeScript**: Language support and compilation.
- **Vitest**: Testing framework.
- **jsdom**: Headless DOM environment.
- **vitest-canvas-mock**: Canvas API mocking.

## Tool Usage Patterns

- **AI-Agent Driven Development**: This project is designed to be developed with the assistance of AI agents like Kilo Code, following strict rules for code quality and documentation.
- **Memory Bank**: The Memory Bank system is the core tool for maintaining project context and knowledge across sessions.
