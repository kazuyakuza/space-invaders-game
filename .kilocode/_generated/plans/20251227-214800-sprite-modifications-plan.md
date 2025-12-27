# Sprite Modifications Plan

This plan outlines the modifications required to change the geometric shapes (sprites) used for the Player and Enemy entities in the Space Invaders game.

## Objectives
1.  **Modify the Player sprite** to be a triangle pointing upwards.
2.  **Modify the Enemy sprite** to be a pentagon pointing upwards.

## Proposed Changes

### 1. Player Sprite (`src/ts/entities/Player.ts`)

The current implementation uses `ctx.fillRect` to draw a rectangle. This will be replaced with a path-based triangle.

**Geometry Logic:**
Given the bounding box defined by `(this.x, this.y)` with `this.width` and `this.height`:
-   **Vertex 1 (Top Center):** `(this.x + this.width / 2, this.y)`
-   **Vertex 2 (Bottom Left):** `(this.x, this.y + this.height)`
-   **Vertex 3 (Bottom Right):** `(this.x + this.width, this.y + this.height)`

**Implementation Strategy:**
-   Update `draw(ctx: CanvasRenderingContext2D)`:
    -   Call `ctx.beginPath()`
    -   Call `ctx.moveTo(this.x + this.width / 2, this.y)`
    -   Call `ctx.lineTo(this.x, this.y + this.height)`
    -   Call `ctx.lineTo(this.x + this.width, this.y + this.height)`
    -   Call `ctx.closePath()`
    -   Call `ctx.fill()`

### 2. Enemy Sprite (`src/ts/entities/Enemy.ts`)

The current implementation uses `ctx.fillRect` and then draws the health text. The rectangle will be replaced with a pentagon.

**Geometry Logic:**
Given the bounding box defined by `(this.x, this.y)` with `this.width` and `this.height`:
-   **Vertex 1 (Top Center):** `(this.x + this.width / 2, this.y)`
-   **Vertex 2 (Middle Right):** `(this.x + this.width, this.y + this.height * 0.4)`
-   **Vertex 3 (Bottom Right):** `(this.x + this.width * 0.8, this.y + this.height)`
-   **Vertex 4 (Bottom Left):** `(this.x + this.width * 0.2, this.y + this.height)`
-   **Vertex 5 (Middle Left):** `(this.x, this.y + this.height * 0.4)`

**Implementation Strategy:**
-   Update `draw(ctx: CanvasRenderingContext2D)`:
    -   Call `ctx.beginPath()`
    -   Call `ctx.moveTo(this.x + this.width / 2, this.y)`
    -   Call `ctx.lineTo(this.x + this.width, this.y + this.height * 0.4)`
    -   Call `ctx.lineTo(this.x + this.width * 0.8, this.y + this.height)`
    -   Call `ctx.lineTo(this.x + this.width * 0.2, this.y + this.height)`
    -   Call `ctx.lineTo(this.x, this.y + this.height * 0.4)`
    -   Call `ctx.closePath()`
    -   Call `ctx.fill()`
    -   Ensure the health text drawing logic remains unchanged and is rendered over the pentagon.

## Considerations
-   **Collision Detection:** This modification only affects the visual representation. The collision detection logic currently relies on the rectangular bounding box (`getBounds()` in `Enemy.ts` and implicit dimensions in `Player.ts`). Since the new shapes fit within the original bounding box, the gameplay mechanics will remain consistent, though visually there might be small gaps where collisions occur.
-   **Scaling:** The geometry logic uses relative coordinates within the entity's width and height, ensuring the shapes scale correctly if entity dimensions are adjusted in `constants.ts`.

## Verification Plan
1.  Run the game using `npm run dev`.
2.  Verify the Player is rendered as a green triangle.
3.  Verify Enemies are rendered as red pentagons.
4.  Verify health numbers are still visible and centered on Enemies.
