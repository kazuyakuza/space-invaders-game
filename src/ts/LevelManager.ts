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

  private getLevelConfig(level: number): Record<string, any> | undefined {
    return this.levelsData[level.toString()];
  }

  private findLastNonDeltaLevel(definedLevel: number): number {
    for (let l = definedLevel - 1; l >= 1; l--) {
      const config = this.getLevelConfig(l);
      if (config && !this.configHasDeltas(config)) {
        return l;
      }
    }
    return 0;
  }

  private accumulateNonDeltaConfigs(upToLevel: number): LevelConfig {
    let effective = { ...this.DEFAULTS };
    for (let l = 1; l <= upToLevel; l++) {
      const config = this.getLevelConfig(l);
      if (config && !this.configHasDeltas(config)) {
        Object.assign(effective, config);
      }
    }
    return effective;
  }

  private overrideNonDeltaProps(effective: any, config: Record<string, any>): void {
    for (const [key, value] of Object.entries(config)) {
      if (!key.startsWith('+')) {
        (effective as any)[key as keyof LevelConfig] = value;
      }
    }
  }

  private applyDeltas(effective: any, config: Record<string, any>, distance: number): void {
    for (const [key, deltaValue] of Object.entries(config)) {
      if (key.startsWith('+')) {
        const prop = key.slice(1) as keyof LevelConfig;
        const baseValue = (effective as any)[prop] ?? (this.DEFAULTS as any)[prop] ?? 0;
        (effective as any)[prop] = baseValue + (deltaValue as number) * distance;
        if (prop === 'enemyHealth') {
          (effective as any)[prop] = Math.floor((effective as any)[prop]);
        }
      }
    }
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
    this.overrideNonDeltaProps(effective, definedConfig);
    const deltaDistance = targetLevel - L_base;
    this.applyDeltas(effective, definedConfig, deltaDistance);
    return effective as LevelConfig;
  }
}
