import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levels = {};

function getSpeedInc(level) {
  if (level <= 20) return 0.05;
  if (level <= 50) return 0.03;
  return 0.02;
}

function getRows(level) {
  return Math.min(5 + Math.floor((level - 1) / 10), 10);
}

function getCols(level) {
  return Math.min(6 + Math.floor((level - 1) / 11), 15);
}

function getHealth(level) {
  return 1 + Math.floor((level - 1) / 25);
}

const typeMilestones = {
  1: { red: 100 },
  10: { red: 90, yellow: 10 },
  25: { red: 80, yellow: 15, orange: 5 },
  50: { red: 70, yellow: 20, orange: 7, violet: 3 },
  75: { red: 50, yellow: 25, orange: 15, violet: 10 },
  100: { red: 20, yellow: 30, orange: 30, violet: 20 }
};

let prevRows = 0;
let prevCols = 0;
let prevHealth = 0;
let prevEnemyCount = 0;
let prevTypesStr = '';

for (let level = 1; level <= 100; level++) {
  const config = {};

  const currRows = getRows(level);
  const currCols = getCols(level);
  const currHealth = getHealth(level);
  const currEnemyCount = currRows * currCols;
  const currTypes = typeMilestones[level];
  const currTypesStr = currTypes ? JSON.stringify(currTypes) : prevTypesStr;

  if (level === 1) {
    config.rows = currRows;
    config.cols = currCols;
    config.speed = 1.0;
    config.enemyCount = currEnemyCount;
    config.enemyHealth = currHealth;
    if (currTypes) {
      config.enemyTypes = currTypes;
    }
  } else {
    const inc = getSpeedInc(level);
    config['+speed'] = inc;

    if (currRows !== prevRows) {
      config.rows = currRows;
    }
    if (currCols !== prevCols) {
      config.cols = currCols;
    }
    if (currHealth !== prevHealth) {
      config.enemyHealth = currHealth;
    }
    if (currEnemyCount !== prevEnemyCount) {
      config.enemyCount = currEnemyCount;
    }
    if (currTypesStr !== prevTypesStr) {
      config.enemyTypes = currTypes;
    }
  }

  levels[`${level}`] = config;

  prevRows = currRows;
  prevCols = currCols;
  prevHealth = currHealth;
  prevEnemyCount = currEnemyCount;
  prevTypesStr = currTypesStr;
}

const outputPath = path.join(__dirname, '../src/assets/levels.json');
fs.writeFileSync(outputPath, JSON.stringify(levels, null, 2));

console.log(`Generated levels.json with ${Object.keys(levels).length} level configurations.`);
