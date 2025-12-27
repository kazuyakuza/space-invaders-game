# UI Labels and Restart Logic Plan

## Goal
Add UI labels for pausing and restarting the game, and implement the restart logic when the game is paused.

## Current State
- `Game.ts` has `isPaused`, `hasStarted`, and `gameRunning` flags.
- `update()` toggles `isPaused` with 'Escape'.
- `render()` shows 'PAUSED' and 'Game Over' screens.
- `InputHandler.ts` tracks keys using `e.code`.

## Proposed Changes

### 1. Update `src/ts/constants.ts`
- Add new constants for the UI labels:
  - `LABEL_PAUSE = 'Press ESC to pause'`
  - `LABEL_RESTART = 'Press R to restart'`
  - `LABEL_FONT = '20px Arial'`
  - `LABEL_COLOR = '#ffffff'`

### 2. Update `src/ts/Game.ts`

#### `update()` method
- Add logic to check for the 'R' key when `isPaused` is true.
- If 'KeyR' is pressed while paused, call `this.reset()`.

#### `render()` method
- Implement drawing the "Press ESC to pause" label:
  - Condition: `hasStarted` is true, `countdown` is 0, `gameRunning` is true, and `isPaused` is false.
  - Position: Top middle (`CANVAS_WIDTH / 2`, `30`).
- Implement drawing the "Press R to restart" label:
  - Condition: `isPaused` is true.
  - Position: Top middle (`CANVAS_WIDTH / 2`, `30`). (Note: The user asked for it at the top middle when paused, possibly in addition to the center PAUSED text or replacing it in that position).
- Use `this.ctx.textAlign = 'center'` for these labels.

## Implementation Details

### Logic for labels
```typescript
// In render()
this.ctx.font = LABEL_FONT;
this.ctx.fillStyle = LABEL_COLOR;
this.ctx.textAlign = 'center';

if (this.hasStarted && this.countdown === 0 && this.gameRunning && !this.isPaused) {
    this.ctx.fillText(LABEL_PAUSE, CANVAS_WIDTH / 2, 30);
}

if (this.isPaused) {
    this.ctx.fillText(LABEL_RESTART, CANVAS_WIDTH / 2, 30);
}
```

### Logic for restart key
```typescript
// In update()
if (this.isPaused && this.input.isPressed('KeyR')) {
    this.reset();
    return;
}
```

## Verification Plan
1. Start the game.
2. Verify "Press ESC to pause" appears at the top middle while playing.
3. Press ESC.
4. Verify the game pauses and "Press R to restart" appears at the top middle.
5. Press R while paused.
6. Verify the game restarts (score resets, wave resets).
