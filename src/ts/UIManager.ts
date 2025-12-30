import {
  GAME_PADDING,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LABEL_FONT,
  LABEL_COLOR,
  LABEL_PAUSE,
  LABEL_RESTART,
  SHOW_DEBUG_INFO,
  PLAYER_COLOR
} from './constants';

interface LevelConfigPartial {
  rows?: number;
  cols?: number;
  speed?: number;
  enemyCount?: number;
  enemyHealth?: number;
}

interface GameRenderState {
  score: number;
  currentLevel: number;
  lives: number;
  hasStarted: boolean;
  countdown: number;
  isPaused: boolean;
  gameRunning: boolean;
  currentLevelConfig: LevelConfigPartial | null;
}

export class UIManager {
  render(ctx: CanvasRenderingContext2D, state: GameRenderState): void {
    this.renderHUD(ctx, state);
    this.renderOverlays(ctx, state);
  }

  private renderHUD(ctx: CanvasRenderingContext2D, state: GameRenderState): void {
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${state.score}`, GAME_PADDING, 30);

    ctx.textAlign = 'right';
    ctx.fillText(`Level: ${state.currentLevel}`, CANVAS_WIDTH - GAME_PADDING, 30);

    const dotRadius = 6;
    const spacing = 20;
    const startX = CANVAS_WIDTH - GAME_PADDING - dotRadius;
    const startY = CANVAS_HEIGHT - GAME_PADDING - dotRadius;
    ctx.fillStyle = PLAYER_COLOR;
    for (let i = 0; i < state.lives; i++) {
      ctx.beginPath();
      ctx.arc(startX - i * spacing, startY, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = LABEL_FONT;
    ctx.fillStyle = LABEL_COLOR;
    ctx.textAlign = 'center';

    if (state.hasStarted && state.countdown === 0 && state.gameRunning && !state.isPaused) {
      ctx.fillText(LABEL_PAUSE, CANVAS_WIDTH / 2, 30);
    }

    if (state.isPaused) {
      ctx.fillText(LABEL_RESTART, CANVAS_WIDTH / 2, 30);
    }

    ctx.textAlign = 'left';

    if (SHOW_DEBUG_INFO && state.currentLevelConfig) {
      ctx.save();
      ctx.font = '16px Arial';
      ctx.fillStyle = '#ffff00';
      ctx.fillText('Debug Info:', GAME_PADDING, 60);
      ctx.fillText(`Rows: ${state.currentLevelConfig.rows ?? 'N/A'}`, GAME_PADDING, 80);
      ctx.fillText(`Cols: ${state.currentLevelConfig.cols ?? 'N/A'}`, GAME_PADDING, 100);
      ctx.fillText(`Speed: ${(state.currentLevelConfig.speed ?? 0).toFixed(2)}`, GAME_PADDING, 120);
      ctx.fillText(`Enemy Count: ${state.currentLevelConfig.enemyCount ?? 'N/A'}`, GAME_PADDING, 140);
      ctx.fillText(`Enemy Health: ${state.currentLevelConfig.enemyHealth ?? 'N/A'}`, GAME_PADDING, 160);
      ctx.restore();
    }
  }

  private renderOverlays(ctx: CanvasRenderingContext2D, state: GameRenderState): void {
    if (!state.hasStarted) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACE to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.textAlign = 'left';
    }

    if (state.countdown > 0) {
      ctx.fillStyle = '#ff0000';
      ctx.font = '96px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(Math.ceil(state.countdown / 60).toString(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.textAlign = 'left';
    }

    if (state.isPaused) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED - Press ESC to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.textAlign = 'left';
    }

    if (!state.gameRunning) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '24px Arial';
      ctx.fillText('Press ENTER to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
      ctx.textAlign = 'left';
    }
  }
}