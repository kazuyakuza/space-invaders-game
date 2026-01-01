import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levels = {};

function getSpeedInc(level) {
  if (level > 2) {
    if (level <= 10) return 0.01;
    if (level <= 20) return 0.02;
    if (level <= 35) return 0.03;
    if (level <= 50) return 0.04;
    if (level <= 75) return 0.05;
    return 0.06;
  }
  return 0;
}

function getHealthInc(level) {
  if (level > 5) {
    if (level <= 20) return 0.5;
    if (level <= 30) return 1;
    if (level <= 50) return 2;
    if (level <= 75) return 3;
    return 4;
  }
  return 0;
}

function getRows(level) {
  return Math.min(5 + Math.floor((level - 1) / 10), 10);
}

function getCols(level) {
  return Math.min(6 + Math.floor((level - 1) / 11), 15);
}

function getLastDefinedLevelFrom(level) {
  let lvlNum = level - 1;
  while (!levels[`${lvlNum}`]) lvlNum--;
  return levels[`${lvlNum}`];
}

function getLevel1Config({ currRows, currCols }) {
  return {
    rows: currRows,
    cols: currCols,
    speed: 1.0,
    enemyCount: currRows * currCols,
    enemyHealth: 1,
  };
}

function getUpToLevel100Config({ level, prev, curr }) {
  const config = {};

  if (curr.rows !== prev.rows) {
    config.rows = curr.rows;
  }
  if (curr.cols !== prev.cols) {
    config.cols = curr.cols;
  }
  if (curr.enemyCount !== prev.enemyCount) {
    config.enemyCount = curr.enemyCount;
  }
  if (JSON.stringify(curr.types) !== JSON.stringify(prev.types)) {
    config.enemyTypes = curr.types;
  }

  if (!Object.keys(config).length) {
    const speed = getSpeedInc(level);
    if (speed > 0) config['+speed'] = speed;
    const enemyHealth = getHealthInc(level);
    if (enemyHealth > 0) config['+enemyHealth'] = enemyHealth;
  } else {
    config.rows = curr.rows;
    config.cols = curr.cols;
    config.enemyCount = curr.enemyCount;
    config.enemyTypes = curr.types;
    config.speed = getSpeedInc(level) * (level - 1);
    config.health = 1 + Math.floor(getHealthInc(level) * level - 1);
  }

  if (JSON.stringify(config) == JSON.stringify(getLastDefinedLevelFrom(level))) return undefined;

  return config;
}

function getLevelConfig({ level, prev, curr }) {
  if (level === 1) {
    return getLevel1Config({ currRows: curr.rows, currCols: curr.cols });
  } else if (level <= 100) {
    return getUpToLevel100Config({ level, prev, curr });
  } else {
    return undefined;
  }
}

function getTypes(level) {
  if (level < 7) return { red: 100 };
  if (level < 14) return { red: 95, yellow: 5 };
  if (level < 21) return { red: 86, yellow: 7, orange: 7 };
  if (level < 28) return { red: 75, yellow: 10, orange: 10, violet: 5 };
  if (level < 35) return { red: 60, yellow: 15, orange: 15, violet: 10 };
  if (level < 42) return { red: 30, yellow: 20, orange: 30, violet: 20 };
  return { red: 25, yellow: 25, orange: 25, violet: 25 };
}

let prev = {
  rows: 0,
  cols: 0,
  enemyCount: 0,
  types: undefined,
};
let curr = {
  rows: undefined,
  cols: undefined,
  enemyCount: undefined,
  types: undefined,
};

for (let level = 1; level <= 100; level++) {
  curr.rows = getRows(level);
  curr.cols = getCols(level);
  curr.enemyCount = curr.rows * curr.cols;
  curr.types = getTypes(level);

  const config = getLevelConfig({ level, prev, curr });
  if (config && Object.keys(config).length) levels[`${level}`] = config;

  prev = { ...curr };
}

const outputPath = path.join(__dirname, '../src/assets/levels.json');
fs.writeFileSync(outputPath, JSON.stringify(levels, null, 2));

console.log(`Generated levels.json with ${Object.keys(levels).length} level configurations.`);
