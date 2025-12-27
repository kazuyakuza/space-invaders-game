# Plan: New Enemy Types and Level Configuration System

This plan outlines the implementation of four distinct enemy types and an enhanced level configuration system to support dynamic distribution of these types.

## 1. Enemy Type Definitions

We will transition from a single `Enemy` class to a hierarchy of enemy types to support unique behaviors and visual representations.

### Enemy Hierarchy
- **`Enemy` (Base Class)**: Common properties (position, health, size) and methods (`takeDamage`, `getBounds`).
- **`RedEnemy`**: Standard Space Invaders behavior (moves horizontally, drops at edges).
- **`YellowEnemy`**: Spawns at the top, random X position, moves vertically down independently.
- **`OrangeEnemy`**: Spawns at the bottom area, random X position, static, shoots bullets at random intervals.
- **`VioletEnemy`**: Spawns in the middle area, random X position, static, rendered as a formation of 3 pentagons.

### Code Snippets for Behaviors

```typescript
// src/ts/entities/Enemy.ts (Base)
export abstract class Enemy {
    // ... existing properties ...
    public abstract update(context: UpdateContext): void;
    public abstract draw(ctx: CanvasRenderingContext2D): void;
}

// YellowEnemy behavior
public update(context: UpdateContext): void {
    this.y += this.speed * context.deltaTime;
}

// OrangeEnemy behavior
public update(context: UpdateContext): void {
    if (Math.random() < SHOOT_CHANCE) {
        context.spawnBullet(this.x + this.width / 2, this.y + this.height, false); // isPlayer = false
    }
}

// VioletEnemy rendering (3 pentagons)
public draw(ctx: CanvasRenderingContext2D): void {
    const spacing = 10;
    for (let i = 0; i < 3; i++) {
        this.drawPentagon(ctx, this.x + i * spacing, this.y);
    }
}
```

## 2. `EnemyWave` Enhancements

The `EnemyWave` class will be responsible for distributing and managing different enemy types.

### Distribution Logic
1.  Receive `enemyTypes` percentages from level configuration (e.g., `{"red": 50, "yellow": 30, "orange": 20}`).
2.  Calculate the count for each type based on `totalEnemyCount`.
3.  Populate a "type pool" and shuffle it.
4.  Instantiate the appropriate subclass for each slot or random position.

### Update Loop
Modified `EnemyWave.update()`:
```typescript
public update(deltaTime: number): WaveUpdateResult {
    // 1. Move the "wave" (RedEnemies) as a group
    this.updateWaveMovement(deltaTime);

    // 2. Update individual behaviors
    const context = { deltaTime, spawnBullet: (x, y, isPlayer) => this.pendingBullets.push({x, y, isPlayer}) };
    for (const enemy of this.enemies) {
        enemy.update(context);
    }
    
    // ... check lose condition ...
}
```

## 3. Level Configuration Updates

### `levels.json` Structure
Levels will support an optional `enemyTypes` object. If missing, it defaults to 100% red.

```json
{
  "1": {
    "rows": 5,
    "cols": 6,
    "enemyCount": 30,
    "enemyTypes": {
      "red": 70,
      "yellow": 30
    }
  },
  "2": {
    "+enemyCount": 10,
    "enemyTypes": {
      "red": 50,
      "yellow": 25,
      "orange": 25
    }
  }
}
```

### `Game.ts` Logic
`resolveLevelConfig` will be updated to merge `enemyTypes` objects, supporting the `+` prefix for incremental updates (e.g., `"+orange": 10` to add 10% more orange enemies while reducing others proportionally or as defined).

## 4. Bullet Logic Update
`Bullet.ts` will be updated to include an `isPlayerBullet` flag to distinguish between player and enemy projectiles. Collision logic in `Game.ts` will handle enemy bullets hitting the player.

## Implementation Steps

1.  **Refactor `Enemy`**: Convert to an abstract class and create subclasses in `src/ts/entities/`.
2.  **Update `constants.ts`**: Add colors and specific speeds/intervals for new enemy types.
3.  **Update `EnemyWave`**: Implement type distribution logic and individual `update()` calls.
4.  **Update `Game.ts`**: Update level loading/resolving logic and handle enemy bullets.
5.  **Update `levels.json`**: Populate with new level configurations using different enemy mixes.
