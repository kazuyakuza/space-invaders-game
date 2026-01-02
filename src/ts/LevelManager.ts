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

  private readonly DEFAULTS: LevelConfig = {
    rows: 5,
    cols: 6,
    speed: 1.0,
    enemyCount: 30,
    enemyHealth: 1
  };

  private getSortedLevelKeys(): number[] {
    return Object.keys(this.levelsData)
      .map(Number)
      .filter(Boolean)
      .sort((a, b) => a - b);
  }

  private getNearestDefinedLevel(targetLevel: number, sortedKeys: number[]): number {
    return sortedKeys.filter(l => l <= targetLevel).pop() || 0;
  }

  private configHasDeltas(config: Record<string, any>): boolean {
    return Object.keys(config).some(k => k.startsWith('+'));
  }

  private findLastNonDeltaLevel(definedLevel: number): number {
    for (let l = definedLevel - 1; l >= 1; l--) {
      const key = l.toString();
      if (this.levelsData[key]) {
        const config = this.levelsData[key];
        if (!this.configHasDeltas(config)) {
          return l;
        }
      }
    }
    return 0;
  }

  private accumulateNonDeltaConfigs(upToLevel: number): LevelConfig {
    let effective = { ...this.DEFAULTS };
    for (let l = 1; l <= upToLevel; l++) {
      const key = l.toString();
      if (this.levelsData[key]) {
        const config = this.levelsData[key];
        if (!this.configHasDeltas(config)) {
          Object.assign(effective, config);
        }
      }
    }
    return effective;
  }

  public getResolvedConfig(targetLevel: number): LevelConfig {
    const sortedKeys = this.getSortedLevelKeys();
    const L_defined = this.getNearestDefinedLevel(targetLevel, sortedKeys);
    if (L_defined === 0) {
      return this.DEFAULTS;
    }
    const definedConfig = this.levelsData[L_defined.toString()];
    if (!this.configHasDeltas(definedConfig)) {
      return this.accumulateNonDeltaConfigs(L_defined);
    }
    const L_base = this.findLastNonDeltaLevel(L_defined);
    const baseConfig = L_base > 0 ? this.getResolvedConfig(L_base) : this.DEFAULTS;
    let effective: any = { ...baseConfig };
    for (const [k, v] of Object.entries(definedConfig)) {
      if (!k.startsWith('+')) {
        (effective as any)[k as keyof LevelConfig] = v;
      }
    }
    const deltaDistance = targetLevel - L_base;
    for (const [k, deltaValue] of Object.entries(definedConfig)) {
      if (k.startsWith('+')) {
        const prop = k.slice(1) as keyof LevelConfig;
        let baseValue = (effective as any)[prop] ?? this.DEFAULTS[prop as keyof LevelConfig] ?? 0;
        (effective as any)[prop] = baseValue + (deltaValue as number) * deltaDistance;
        if (prop === 'enemyHealth') {
          (effective as any)[prop] = Math.floor((effective as any)[prop]);
        }
      }
    }
    return effective as LevelConfig;
  }
}
