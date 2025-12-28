import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Game } from '../Game';

vi.mock('../../assets/levels.json', () => ({
  default: {
    "1": {
      rows: 5,
      cols: 6,
      speed: 1.0,
      enemyCount: 30,
      enemyHealth: 1
    },
    "2": {
      rows: 6,
      cols: 8
    },
    "3": {
      "+speed": 0.5
    }
  }
}));

describe('Game resolveLevelConfig', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  it('resolves full level 1 config', () => {
    const config = (game as any).resolveLevelConfig(1);
    expect(config).toMatchObject({
      rows: 5,
      cols: 6,
      speed: 1.0,
      enemyCount: 30,
      enemyHealth: 1
    });
  });

  it('resolves sparse level 2 config', () => {
    const config = (game as any).resolveLevelConfig(2);
    expect(config).toMatchObject({
      rows: 6,
      cols: 8
    });
  });

  it('resolves level 3 with delta accumulation', () => {
    const config = (game as any).resolveLevelConfig(3);
    expect(config).toMatchObject({
      rows: 6,
      cols: 8,
      speed: 0.5
    });
  });

  it('resolves infinity level 5 with accumulated deltas', () => {
    const config = (game as any).resolveLevelConfig(5);
    expect(config).toMatchObject({
      rows: 6,
      cols: 8,
      speed: 1.5
    });
  });
});