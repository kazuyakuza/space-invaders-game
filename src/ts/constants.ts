export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 800;
export const SHOOT_INTERVAL = 10;
export const GAME_PADDING = 20;
export const ENEMY_WAVE_START_X = 50;
export const ENEMY_WAVE_START_Y = 50;
export const SCORE_PER_ENEMY = 10;
export const DIFFICULTY_SPEED_INCREMENT = 1.001;

export const ENEMY_SPACING_X = 60;
export const ENEMY_SPACING_Y = 50;
export const ENEMY_DROP_DISTANCE = 20;

export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 30;
export const PLAYER_SPEED = 5;
export const PLAYER_COLOR = '#00ff00';
export const PLAYER_START_Y_OFFSET = 50;

export const ENEMY_WIDTH = 30;
export const ENEMY_HEIGHT = 20;
export const RED_ENEMY_COLOR = '#ff0000';
export const YELLOW_ENEMY_COLOR = '#ffff00';
export const ORANGE_ENEMY_COLOR = '#ffaa00';
export const VIOLET_ENEMY_COLOR = '#aa00ff';
export const BLUE_ENEMY_COLOR = '#0000ff';
export const ENEMY_SHOOT_CHANCE = 0.002;
export const YELLOW_ENEMY_SPEED = 1.0;

export const BULLET_WIDTH = 5;
export const BULLET_HEIGHT = 15;
export const BULLET_SPEED = 7;
export const BULLET_COLOR = '#ffffff';
export const SHOW_DEBUG_INFO = true;

export const COUNTDOWN_FRAMES = 180;

export const LABEL_PAUSE = 'Press ESC to Pause & Access Market';
export const LABEL_RESTART = 'Press R to restart';
export const LABEL_FONT = '20px Arial';
export const LABEL_COLOR = '#ffffff';

export const ORANGE_SHOOT_COOLDOWN = 60000;
export const KAMIKAZE_TARGET_HUD_X = CANVAS_WIDTH / 2;
export const KAMIKAZE_TARGET_HUD_Y = CANVAS_HEIGHT - 20;
export const KAMIKAZE_TARGET_LEFT_X = CANVAS_WIDTH / 6;
export const KAMIKAZE_TARGET_LEFT_Y = CANVAS_HEIGHT / 2;
export const KAMIKAZE_TARGET_RIGHT_X = 5 * CANVAS_WIDTH / 6;
export const KAMIKAZE_TARGET_RIGHT_Y = CANVAS_HEIGHT / 2;

export const HEDGE_COLOR = '#00ff00';
export const HEDGE_HEIGHT = 2;
export const HEDGE_MAX_COUNT = 10;
export const HEDGE_START_Y_OFFSET = 100;
export const HEDGE_SPACING = 20;
export const MARKET_ITEM_LIFE_PRICE = 25000;
export const MARKET_ITEM_HEDGE_PRICE = 5000;

export interface MarketItem {
  index: number;
  name: string;
  symbol: string;
  price: number;
}