import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Game } from '../Game';
import { LevelManager } from '../LevelManager';

vi.mock('../../assets/levels.json', () => ({
  default: {
    "1": {
      "rows": 5,
      "cols": 6,
      "speed": 1,
      "enemyCount": 30,
      "enemyHealth": 1
    },
    "3": {
      "+speed": 0.01
    },
    "6": {
      "+speed": 0.01,
      "+enemyHealth": 0.5
    },
    "7": {
      "enemyTypes": {
        "red": 95,
        "yellow": 5
      },
      "rows": 5,
      "cols": 6,
      "enemyCount": 30,
      "speed": 1.06,
      "health": 2
    },
    "8": {
      "+speed": 0.01,
      "+enemyHealth": 0.5
    },
  }
}));

describe('LevelManager getResolvedConfig', () => {
  let manager: LevelManager;

  beforeEach(() => {
    manager = new LevelManager();
  });

  it('resolves full level 1 config', () => {
    const config = manager.getResolvedConfig(1);
    expect(config.rows).toBe(5);
    expect(config.cols).toBe(6);
    expect(config.speed).toBe(1.0);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyHealth).toBe(1);
    expect(config.enemyTypes).toMatchObject({ red: 100 });
  });

  it('resolves sparse level 2 config', () => {
    const config = manager.getResolvedConfig(2);
    expect(config.rows).toBe(5);
    expect(config.cols).toBe(6);
    expect(config.speed).toBe(1.0);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyHealth).toBe(1);
    expect(config.enemyTypes).toMatchObject({ red: 100 });
  });

  it('resolves level 3 with delta accumulation', () => {
    const config = manager.getResolvedConfig(3);
    expect(config.rows).toBe(5);
    expect(config.cols).toBe(6);
    expect(config.speed).toBe(1.02);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyHealth).toBe(1);
    expect(config.enemyTypes).toMatchObject({ red: 100 });
  });

  it('resolves infinity level 4 config', () => {
    const config = manager.getResolvedConfig(4);
    expect(config.rows).toBe(5);
    expect(config.cols).toBe(6);
    expect(config.speed).toBe(1.03);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyHealth).toBe(1);
    expect(config.enemyTypes).toMatchObject({ red: 100 });
  });

  it('resolves infinity level 5 config', () => {
    const config = manager.getResolvedConfig(5);
    expect(config.rows).toBe(5);
    expect(config.cols).toBe(6);
    expect(config.speed).toBe(1.04);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyHealth).toBe(1);
    expect(config.enemyTypes).toMatchObject({ red: 100 });
  });

  it('resolves infinity level 6 config', () => {
    const config = manager.getResolvedConfig(6);
    expect(config.rows).toBe(5);
    expect(config.cols).toBe(6);
    expect(config.speed).toBe(1.05);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyHealth).toBe(1);
    expect(config.enemyTypes).toMatchObject({ red: 100 });
  });

  it('resolves infinity level 7 config', () => {
    const config = manager.getResolvedConfig(7);
    expect(config.rows).toBe(5);
    expect(config.cols).toBe(6);
    expect(config.speed).toBe(1.06);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyHealth).toBe(2);
    expect(config.enemyTypes).toMatchObject({ red: 95, yellow: 5 });
  });
});

describe('Game', () => {
  it('starts at level 1', () => {
    const game = new Game();
    expect((game as any).currentLevel).toBe(1);
  });
});
