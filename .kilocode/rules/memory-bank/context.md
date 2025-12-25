# Context

## Current State

Space Invaders game base implemented. Core entities (Player, Enemy, Bullet, EnemyWave) and game loop in place. Player movement and shooting functional, enemies spawn in waves.

## Recent Changes

- Implemented Player, Enemy, Bullet, EnemyWave classes in src/ts/entities/
- Added Game class managing update/render loop
- InputHandler for keyboard controls
- Merged feat/game-base to main, completed todo-3

## Next Steps

- Add collision detection between bullets and enemies/player
- Implement scoring system
- Add game over/win conditions
- Polish UI