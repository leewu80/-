/** 机型系列。Neo 是 2026 年的入门 MacBook。 */
export type Series = 'Air' | 'Pro' | 'Neo';

/** 芯片代际。A18 用于 MacBook Neo。 */
export type Chip = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'A18' | 'Intel';

/** 成新度，顺序由高到低见打分模块 */
export type Condition = '官翻' | '99新' | '95新' | '9成新' | '8成新' | '7成新';

/** 比价渠道。apple 是苹果官网翻新的真实在售。 */
export type ChannelId = 'jd' | 'web' | 'live' | 'xianyu' | 'apple';

export interface ChannelMeta {
  id: ChannelId;
  name: string;
  shortName: string;
  description: string;
}

/** 一条在售挂牌。样本自带 linkUrl，指向该机型在对应渠道的公开页面。 */
export interface Listing {
  id: string;
  series: Series;
  model: string;
  year: number;
  chip: Chip;
  chipDetail: string;
  memoryGb: number;
  storageGb: number;
  gpu: string;
  condition: Condition;
  price: number;
  channel: ChannelId;
  seller: string;
  note: string;
  linkUrl?: string;
  /** sample 为内置演示；quote 为本场录入并存在这台浏览器里 */
  origin?: 'sample' | 'quote';
}

export interface ScoreWeights {
  condition: number;
  price: number;
}

export interface ScoreBreakdown {
  conditionScore: number;
  priceScore: number;
  total: number;
  groupAverage: number;
  groupMin: number;
  groupSize: number;
  cheaperThanAverage: number;
  reasons: string[];
}

export interface ScoredListing {
  listing: Listing;
  specKey: string;
  score: ScoreBreakdown;
}

export interface Filters {
  series: Series[];
  chips: Chip[];
  memories: number[];
  storages: number[];
  gpus: string[];
  conditions: Condition[];
  channels: ChannelId[];
  priceMin: string;
  priceMax: string;
  keyword: string;
}
