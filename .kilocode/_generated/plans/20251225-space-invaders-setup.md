# Space Invaders Game Setup Plan

This document outlines the plan for setting up the basic Space Invaders game.

## 1. File Structure

All files will be located in the `src` directory.

```
src/
|-- index.html
|-- styles.css
|-- ts/
    |-- main.ts
    |-- player.ts
    |-- enemy.ts
    |-- bullet.ts
    |-- game.ts
```

- **`index.html`**: The main entry point of the game.
- **`styles.css`**: The stylesheet for the game, including the "night mode" theme.
- **`ts/main.ts`**: The main TypeScript file that initializes the game.
- **`ts/player.ts`**:  Handles the player's ship, including movement and shooting.
- **`ts/enemy.ts`**:  Handles the enemies, including their movement and behavior.
- **`ts/bullet.ts`**: Handles the bullets fired by the player.
- **`ts/game.ts`**: Contains the main game loop and logic, managing the game state.

## 2. Implementation Steps

### Step 1: HTML Structure (`src/index.html`)

- Create a basic HTML5 structure.
- Add a `<canvas>` element for the game.
- Link the `styles.css` stylesheet and the compiled JavaScript file from `ts/main.ts`.

### Step 2: CSS Styling (`src/styles.css`)

- Style the `body` with a black background for the "night mode" theme.
- Center the `<canvas>` element on the page.
- Add any other basic styles for the game.

### Step 3: TypeScript Game Logic

#### A. Game Setup (`src/ts/game.ts`)

- Create a `Game` class to manage the game state.
- Initialize the canvas and its 2D rendering context.
- Create a game loop to update and render the game elements.

#### B. Player (`src/ts/player.ts`)

- Create a `Player` class for the player's ship.
- Implement player movement based on cursor key input.
- Implement a `shoot` method to create new bullets.

#### C. Enemy (`src/ts/enemy.ts`)

- Create an `Enemy` class for the aliens.
- Implement the logic to create a grid of enemies.
- Implement the enemy movement pattern.

#### D. Bullet (`src/ts/bullet.ts`)

- Create a `Bullet` class for the projectiles.
- Implement the bullet's movement.

#### E. Main (`src/ts/main.ts`)

- Create an instance of the `Game` class.
- Start the game loop.

## 3. Workflow

This plan will be implemented by the `Code` mode. The `Code` mode will follow the steps outlined above to create the necessary files and implement the game logic.
