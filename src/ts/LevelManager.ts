import levelsData from '../assets/levels.json';

export interface LevelConfig {
  rows: number;
  cols: number;
  speed: number;
  enemyCount: number;
  enemyHealth: number;
  enemyTypes?: Record<string, number>;
}

export class LevelManager {
  private readonly levelsData: Record<string, any> = levelsData;

  public getResolvedConfig(targetLevel: number): LevelConfig {
    let config = this.levelsData[targetLevel.toString()];
    if (!config) {
      const levelKeys = Object.keys(this.levelsData)
        .map(k => Number(k))
        .filter(n => !isNaN(n))
        .sort((a, b) => b - a);
      const maxLevel = levelKeys[0];
      if (maxLevel === undefined) {
        throw new Error('No levels defined in levels.json');
      }
      config = { ...this.levelsData[maxLevel.toString()] };
    }

    const requiredProps: (keyof LevelConfig)[] = ['rows', 'cols', 'speed', 'enemyCount', 'enemyHealth'];
    for (const prop of requiredProps) {
      if (config[prop] === undefined) {
        throw new Error(`Missing required property '${String(prop)}' in resolved config for level ${targetLevel}`);
      }
    }

    return config as LevelConfig;
  }
}