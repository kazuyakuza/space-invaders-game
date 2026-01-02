# Architecture

## System Architecture

Canvas-based 2D Space Invaders game using HTML5 Canvas and TypeScript. Main game loop driven by requestAnimationFrame targeting 60fps.

## Source Code Paths

- `src/index.html`: Entry point with canvas element
- `src/styles.css`: Night mode color scheme
- `src/assets/levels.json`: External level configuration (rows, cols, speed, spacing)
- `src/ts/main.ts`: Initializes and starts the game
- `src/ts/Game.ts`: Orchestrates game loop, level management, and state
- `src/ts/LevelManager.ts`: Centralizes level resolution and delta accumulation logic
- `src/ts/CollisionManager.ts`: Centralized collision detection logic
- `src/ts/UIManager.ts`: Handles HUD and screen overlay rendering
- `src/ts/Renderer.ts`: Orchestrates entity drawing
- `src/ts/InputHandler.ts`: Keyboard input processing
- `src/ts/entities/Player.ts`: Player spaceship entity
- `src/ts/entities/Enemy.ts`: Base enemy entity and specialized types (Red, Yellow, Orange, Violet)
- `src/ts/entities/Bullet.ts`: Projectile entity
- `src/ts/entities/EnemyWave.ts`: Manages enemy group lifecycle and movement
- `src/ts/entities/FormationGenerator.ts`: Decoupled formation and spawning logic

## Key Technical Decisions

- Vanilla HTML/CSS/TypeScript - no frameworks or libraries
- JSON-based level configuration for easy tuning and expansion
- Infinity levels: repeats last level configuration with increased challenge
- OOP design with entity classes featuring update() and draw() methods
- Centralized game state management in Game class
- Difficulty scaling: enemy velocity increases by 0.1% every time they drop a row
- Keyboard controls: arrow keys for movement, space for shooting, Enter to restart
- Geometric shapes for sprites (no images)

## Design Patterns

- **Entity pattern**: Game objects inherit common update/render behavior.
- **Manager pattern**: specialized logic (collisions, UI, rendering) extracted into dedicated manager classes.
- **State management**: Game class acts as the central coordinator for level transitions and entity lifecycle.

## Component Relationships

- **Game** owns instances of `Player`, `EnemyWave`, `CollisionManager`, `UIManager`, `EntityRenderer`, and `LevelManager`.
- **Game** uses `LevelManager` to resolve level configurations from `levels.json` and initializes `EnemyWave` per level.
- **EnemyWave** uses `FormationGenerator` to create and position multiple `Enemy` instances.
- **Player** creates player `Bullet` instances on shoot.
- **InputHandler** observes keyboard events and updates `Player` position/shoot state.
- **CollisionManager** processes interactions between `Bullet`, `Player`, and `EnemyWave`.
- **UIManager** handles all text and overlay rendering based on current `Game` state.

## Critical Implementation Paths

`main.ts` → `new Game(canvas)` → `initLevel(0)` → `gameLoop()` → `Game.update(deltaTime)` → `CollisionManager.handleCollisions()` → `Game.render(ctx)` → `UIManager.render()` / `EntityRenderer.render()`
