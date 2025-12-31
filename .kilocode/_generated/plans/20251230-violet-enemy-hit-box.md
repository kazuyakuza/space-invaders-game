# Plan: Review and Fix Violet Enemy Hit Box

The Violet enemy in Space Invaders is a "mini-boss" composed of three pentagons drawn side-by-side. However, it currently uses a single standard enemy bounding box for collision detection, which only covers the central pentagon. This results in player bullets passing through its sides without dealing damage. This plan outlines the steps to adjust the bounding box to match the rendered area.

## High-Level Approach

1.  **Analyze current dimensions**: The `VioletEnemy` draws three pentagons. Each pentagon uses the base `ENEMY_WIDTH` (30px) and `ENEMY_HEIGHT` (20px). They are spaced 12px apart.
2.  **Calculate new bounding box**:
    *   The total width will be `ENEMY_WIDTH + 2 * spacing`.
    *   The x-offset will be adjusted to center this box around the three pentagons.
3.  **Override `getBounds()`**: Implement a custom `getBounds()` method in `VioletEnemy.ts` that returns the correct dimensions.
4.  **Verify collision logic**: Ensure `CollisionManager.ts` correctly uses the new bounds (it already uses `getBounds()`, so no changes should be needed there).
5.  **Verify rendering**: Ensure the bounding box correctly encompasses the rendered pentagons.

## Detailed Step-by-Step Plan

### 1. Preparation and Analysis

*   [ ] Research `src/ts/entities/VioletEnemy.ts` (Done)
*   [ ] Research `src/ts/CollisionManager.ts` (Done)
*   [ ] Confirm `ENEMY_WIDTH` and `ENEMY_HEIGHT` in `src/ts/constants.ts` (Done)

### 2. Implementation

*   [ ] **Create a new branch**: `git checkout -b fix-violet-hitbox`
*   [ ] **Modify `src/ts/entities/VioletEnemy.ts`**:
    *   Override `getBounds()` to account for the three pentagons.
    *   Update `draw()` if necessary to ensure it remains centered within the new bounds (though it's better to keep the `draw()` logic and just adjust `getBounds()` to match it).

#### Proposed Code Change for `src/ts/entities/VioletEnemy.ts`:

```typescript
// src/ts/entities/VioletEnemy.ts

// Current draw logic:
// const spacing = 12;
// const centerX = this.x + this.width / 2;
// const centerY = this.y + this.height / 2;
// for (let i = -1; i <= 1; i++) {
//   this.drawPentagon(ctx, centerX + i * spacing - this.width / 2, centerY - this.height / 2);
// }

// Bounding box calculation:
// Leftmost pentagon center: centerX - spacing
// Rightmost pentagon center: centerX + spacing
// Left edge: (centerX - spacing) - width / 2
// Right edge: (centerX + spacing) + width / 2
// Total width: (centerX + spacing + width / 2) - (centerX - spacing - width / 2)
// Total width: 2 * spacing + width

public getBounds() {
  const spacing = 12;
  return {
    x: this.x - spacing,
    y: this.y,
    width: this.width + 2 * spacing,
    height: this.height
  };
}
```

*Wait, if I change `getBounds()`, I should also check if the `draw()` method uses `this.x` correctly.*
Current `draw()` uses `this.x + this.width / 2` as `centerX`.
If `getBounds().x` is `this.x - spacing`, then the bounding box starts before `this.x`.

Actually, it might be cleaner to redefine `this.width` in the constructor or use a custom property if `Enemy` allowed it, but `width` is protected and readonly in `Enemy`.

Let's refine the plan to simply override `getBounds()`.

### 3. Git Commits

*   [ ] Commit implementation: `git commit -m "fix: adjust VioletEnemy bounding box to include sides"`

### 4. Verification

*   [ ] **Manual Verification**: Run the game and test shooting the sides of the Violet enemy.
*   [ ] **Visual Verification**: If `SHOW_DEBUG_INFO` is enabled (it is in `constants.ts`), the bounding box should be visible (if rendering logic draws it). *Note: Need to check if Renderer.ts draws bounding boxes when debug is on.*
*   [ ] **Unit Testing**: Create or update a test in `src/ts/__tests__/VioletEnemy.test.ts` (if it exists) or `src/ts/__tests__/Game.test.ts` to verify the `getBounds()` output.

## Verification Tasks

- [ ] Check if `Renderer.ts` draws debug hitboxes.
- [ ] Verify `VioletEnemy` collision with player bullets on sides.
