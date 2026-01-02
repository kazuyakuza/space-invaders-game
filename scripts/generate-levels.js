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

function getSpeedFor(level) {
  return Math.round((1 + (getSpeedInc(level) * (level - 2))) * 100) / 100;
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

function getHealthFor(level) {
  return 1 + Math.floor(getHealthInc(level) * (level - 5));
}

function getRows(level) {
  return Math.min(5 + Math.floor((level - 1) / 10), 10);
}

function getCols(level) {
  return Math.min(6 + Math.floor((level - 1) / 11), 15);
}

function getLastDefinedLevelFrom({ level, foundBaseLevel }) {
  let num = level - 1;
  while (
    !levels[`${num}`]
    || (foundBaseLevel
      && Object.keys(levels[`${num}`])
        .some(k => k.startsWith('+'))
    )) num--;
  return {
    config: levels[`${num}`],
    num,
  };
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
  config.rows = curr.rows;
  config.cols = curr.cols;
  config.enemyCount = curr.enemyCount;
  config.enemyTypes = curr.types;
  config.speed = getSpeedFor(level);
  config.enemyHealth = getHealthFor(level);
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
