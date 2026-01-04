import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameSimulation } from './helpers/GameSimulation';
import { COUNTDOWN_FRAMES } from '../constants';

describe('E2E: Start the Game', () => {
  let simulation: GameSimulation;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(performance, 'now').mockReturnValue(1000);
    document.body.innerHTML = '';
    simulation = new GameSimulation();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('game starts upon Space press and countdown decreases to 0', () => {
    // Initial
    let state = simulation.getState();
    expect(state.hasStarted).toBe(false);
    expect(state.countdown).toBe(0);

    // Press Space
    simulation.press('Space');
    simulation.step(1);
    simulation.release('Space');

    state = simulation.getState();
    expect(state.hasStarted).toBe(true);
    expect(state.countdown).toBeGreaterThan(0);

    // Advance half
    simulation.step(Math.floor(COUNTDOWN_FRAMES / 2));
    state = simulation.getState();
    expect(state.countdown).toBeGreaterThan(0);

    // Advance to end
    simulation.step(COUNTDOWN_FRAMES);
    state = simulation.getState();
    expect(state.countdown).toBe(0);
    expect(state.currentLevel).toBe(1);
    expect(state.score).toBe(0);

    // Verify enemies move after game starts (countdown reaches 0)
    const initialPositions = state.enemyWave.getEnemies().map(enemy => ({
      x: enemy.getBounds().x,
      y: enemy.getBounds().y
    }));

    simulation.step(120); // 2 seconds at 60fps

    state = simulation.getState();
    const newPositions = state.enemyWave.getEnemies().map(enemy => ({
      x: enemy.getBounds().x,
      y: enemy.getBounds().y
    }));

    const hasMoved = initialPositions.some((initial, index) => 
      index < newPositions.length && (initial.x !== newPositions[index].x || initial.y !== newPositions[index].y)
    );
    expect(hasMoved).toBe(true);
  });
});