import 'vitest-canvas-mock';
import { beforeEach } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = '<canvas id="gameCanvas"></canvas>';
});