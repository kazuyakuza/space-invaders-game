# Architecture

## System Architecture

Canvas-based 2D Space Invaders game using HTML5 Canvas and TypeScript. Main game loop driven by requestAnimationFrame targeting 60fps.

## Source Code Paths

- `src/index.html`: Entry point with canvas element
- `src/styles.css`: Night mode color scheme
- `src/ts/main.ts`: Initializes and starts the game
- `src/ts/Game.ts`: Manages game loop, entities, and rendering
- `src/ts/InputHandler.ts`: Keyboard input processing
- `src/ts/entities/Player.ts`: Player spaceship entity
- `src/ts/entities/Enemy.ts`: Individual enemy entity
- `src/ts/entities/Bullet.ts`: Projectile entity
- `src/ts/entities/EnemyWave.ts`: Manages formation and movement of enemies

## Key Technical Decisions

- Vanilla HTML/CSS/TypeScript - no frameworks or libraries
- OOP design with entity classes featuring update() and draw() methods
- Centralized game state management in Game class
- Keyboard controls: arrow keys for movement, space for shooting
- Geometric shapes for sprites (no images)

## Design Patterns

- Entity pattern: Game objects inherit common update/render behavior

## Component Relationships

- Game owns instances of Player, EnemyWave, and handles Bullet lifecycle
- EnemyWave creates and positions multiple Enemy instances
- Player creates player Bullets on shoot
- InputHandler observes keyboard events and updates Player position/shoot state
- Game orchestrates update/render cycle for all entities each frame

## Critical Implementation Paths

`main.ts` → `new Game(canvas)` → `gameLoop()` → `Game.update(deltaTime)` → entities.update() → `Game.render(ctx)` → entities.draw()