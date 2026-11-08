/** 机型系列 */
export type Series = 'Air' | 'Pro';

/** 芯片代际，Intel 作为可选项保留 */
export type Chip = 'M1' | 'M2' | 'M3' | 'M4' | 'Intel';

/** 成新度，顺序由高到低见打分模块 */
export type Condition = '官翻' | '99新' | '95新' | '9成新' | '8成新' | '7成新';

/** 五类比价渠道，华强北为档口市场报价 */
export type ChannelId = 'jd' | 'web' | 'live' | 'xianyu' | 'hqb';

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
