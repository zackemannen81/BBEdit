export interface EnemyData {
  id: string;
  type: string;
  time: number;
  [key: string]: any;
}

export interface EnemyConfig {
  name: string;
  properties: Record<string, string | null>;
}
