import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Game } from '../Game';
import { LevelManager } from '../LevelManager';

vi.mock('../../assets/levels.json', () => ({
  default: {
    "1": {
      rows: 5,
      cols: 6,
      speed: 1.0,
      enemyCount: 30,
      enemyHealth: 1,
      enemyTypes: { "red": 100 }
    },
    "2": {
      rows: 6,
      cols: 8
    },
    "3": {
      "+speed": 0.5,
      "+enemyHealth": 1
    }
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
    expect(config.rows).toBe(6);
    expect(config.cols).toBe(8);
    expect(config.speed).toBe(1.0);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyHealth).toBe(1);
    expect(config.enemyTypes).toMatchObject({ red: 100 });
  });

  it('resolves level 3 with delta accumulation', () => {
    const config = manager.getResolvedConfig(3);
    expect(config.rows).toBe(6);
    expect(config.cols).toBe(8);
    expect(config.speed).toBe(1.5);
    expect(config.enemyHealth).toBe(2);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyTypes).toMatchObject({ red: 100 });
  });

  it('resolves infinity level 4 config', () => {
    const config = manager.getResolvedConfig(4);
    expect(config.rows).toBe(6);
    expect(config.cols).toBe(8);
    expect(config.speed).toBe(2.0);
    expect(config.enemyHealth).toBe(3);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyTypes).toMatchObject({ red: 100 });
  });

  it('resolves infinity level 5 config', () => {
    const config = manager.getResolvedConfig(5);
    expect(config.rows).toBe(6);
    expect(config.cols).toBe(8);
    expect(config.speed).toBe(2.5);
    expect(config.enemyHealth).toBe(4);
    expect(config.enemyCount).toBe(30);
    expect(config.enemyTypes).toMatchObject({ red: 100 });
  });
});

describe('Game', () => {
  it('starts at level 1', () => {
    const game = new Game();
    expect((game as any).currentLevel).toBe(1);
  });
});
