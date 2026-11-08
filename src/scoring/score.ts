import type { Condition, Listing, ScoreWeights, ScoredListing } from '../types';

/**
 * 成新分是固定档位，不跟价格绑在一起。
 * 官翻默认最高：有平台质保，成色也最稳。
 */
export const CONDITION_RANK: readonly Condition[] = ['官翻', '99新', '95新', '9成新', '8成新', '7成新'];

export const CONDITION_SCORE: Record<Condition, number> = {
  官翻: 100,
  '99新': 96,
  '95新': 90,
  '9成新': 78,
  '8成新': 62,
  '7成新': 48,
};

export const DEFAULT_WEIGHTS: ScoreWeights = {
  condition: 50,
  price: 50,
};

export interface SpecGroup {
  specKey: string;
  items: ScoredListing[];
  best: ScoredListing;
}

/** 同配置指纹：系列、机型、芯片、内存、存储、显卡都相同才放在一组比价。 */
export function specKey(listing: Listing): string {
  return [
    listing.series,
    listing.model,
    listing.year,
    listing.chip,
    listing.chipDetail,
    listing.memoryGb,
    listing.storageGb,
    listing.gpu,
  ].join('|');
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function cny(value: number): string {
  return `¥${Math.round(value).toLocaleString('zh-CN')}`;
}

/**
 * 金额分只跟同配置的其他挂牌比。
 * 等于均价记 50；比均价便宜或贵 25% 分别顶到 100 或 0。
 * 这样 8GB 旧机不会因为绝对价低，压过更贵但更值的新机。
 */
export function priceScoreWithinGroup(price: number, prices: number[]): { score: number; average: number } {
  const average = prices.reduce((sum, item) => sum + item, 0) / prices.length;
  if (prices.length < 2 || average <= 0) {
    return { score: 50, average };
  }
  const savingsRatio = (average - price) / average;
  return { score: clamp(50 + savingsRatio * 200, 0, 100), average };
}

export function compositeScore(conditionScore: number, priceScore: number, weights: ScoreWeights): number {
  const conditionWeight = Math.max(0, weights.condition);
  const priceWeight = Math.max(0, weights.price);
  const sum = conditionWeight + priceWeight;
  if (sum === 0) {
    return 0;
  }
  return (conditionWeight * conditionScore + priceWeight * priceScore) / sum;
}

export function weightShare(weights: ScoreWeights): { condition: number; price: number } {
  const conditionWeight = Math.max(0, weights.condition);
  const priceWeight = Math.max(0, weights.price);
  const sum = conditionWeight + priceWeight;
  if (sum === 0) {
    return { condition: 0, price: 0 };
  }
  const condition = Math.round((conditionWeight / sum) * 100);
  return { condition, price: 100 - condition };
}

function buildReasons(input: {
  listing: Listing;
  conditionScore: number;
  total: number;
  average: number;
  groupMin: number;
  groupSize: number;
  cheaperThanAverage: number;
  bestConditionScore: number;
  weights: ScoreWeights;
}): string[] {
  const lines: string[] = [];
  lines.push(`成新度「${input.listing.condition}」，成新分 ${input.conditionScore}。官翻为 100，往后逐档下降。`);

  if (input.groupSize < 2) {
    lines.push('当前筛选里这条配置没有其他渠道可比，金额分按中性 50 计算。');
  } else {
    const priceText = cny(input.listing.price);
    const averageText = cny(input.average);
    const delta = Math.round(input.cheaperThanAverage);
    if (delta > 0) {
      const percent = Math.round((delta / input.average) * 1000) / 10;
      lines.push(`挂牌 ${priceText}，低于同配置均价 ${averageText}，大约便宜 ${cny(delta)}（${percent}%）。`);
    } else if (delta < 0) {
      const percent = Math.round((Math.abs(delta) / input.average) * 1000) / 10;
      lines.push(`挂牌 ${priceText}，高于同配置均价 ${averageText}，大约贵 ${cny(Math.abs(delta))}（${percent}%）。`);
    } else {
      lines.push(`挂牌 ${priceText}，与同配置均价持平。`);
    }
    if (input.listing.price === input.groupMin) {
      lines.push('在同配置各渠道里价格最低。');
    }
    if (input.conditionScore === input.bestConditionScore) {
      lines.push('在同配置里成新度最高。');
    }
  }

  const share = weightShare(input.weights);
  const totalText = (Math.round(input.total * 10) / 10).toFixed(1);
  lines.push(`综合分 ${totalText}，按成新度 ${share.condition}%、金额 ${share.price}% 加权。`);
  return lines;
}

/** 对一组挂牌打分。分组和归一化都只发生在传入的列表里，所以筛选会改变比较基准。 */
export function scoreListings(listings: Listing[], weights: ScoreWeights): ScoredListing[] {
  const groups = new Map<string, Listing[]>();
  for (const listing of listings) {
    const key = specKey(listing);
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(listing);
    } else {
      groups.set(key, [listing]);
    }
  }

  const scored: ScoredListing[] = [];
  for (const [key, group] of groups) {
    const prices = group.map((item) => item.price);
    const groupMin = Math.min(...prices);
    const bestConditionScore = Math.max(...group.map((item) => CONDITION_SCORE[item.condition]));
    for (const listing of group) {
      const conditionScore = CONDITION_SCORE[listing.condition];
      const priced = priceScoreWithinGroup(listing.price, prices);
      const total = compositeScore(conditionScore, priced.score, weights);
      const cheaperThanAverage = priced.average - listing.price;
      scored.push({
        listing,
        specKey: key,
        score: {
          conditionScore,
          priceScore: priced.score,
          total,
          groupAverage: priced.average,
          groupMin,
          groupSize: group.length,
          cheaperThanAverage,
          reasons: buildReasons({
            listing,
            conditionScore,
            total,
            average: priced.average,
            groupMin,
            groupSize: group.length,
            cheaperThanAverage,
            bestConditionScore,
            weights,
          }),
        },
      });
    }
  }

  scored.sort((left, right) => {
    if (right.score.total !== left.score.total) {
      return right.score.total - left.score.total;
    }
    if (right.score.conditionScore !== left.score.conditionScore) {
      return right.score.conditionScore - left.score.conditionScore;
    }
    if (left.listing.price !== right.listing.price) {
      return left.listing.price - right.listing.price;
    }
    return left.listing.id.localeCompare(right.listing.id);
  });
  return scored;
}

export function buildSpecGroups(scored: ScoredListing[]): SpecGroup[] {
  const map = new Map<string, ScoredListing[]>();
  for (const item of scored) {
    const bucket = map.get(item.specKey);
    if (bucket) {
      bucket.push(item);
    } else {
      map.set(item.specKey, [item]);
    }
  }

  const groups: SpecGroup[] = [];
  for (const [key, items] of map) {
    const sorted = [...items].sort((left, right) => right.score.total - left.score.total);
    const best = sorted[0];
    if (!best) {
      continue;
    }
    groups.push({ specKey: key, items: sorted, best });
  }
  groups.sort((left, right) => right.best.score.total - left.best.score.total);
  return groups;
}

export function sortScored(items: ScoredListing[], sortKey: 'score' | 'price' | 'condition'): ScoredListing[] {
  const copy = [...items];
  if (sortKey === 'price') {
    copy.sort((left, right) => left.listing.price - right.listing.price || right.score.total - left.score.total);
    return copy;
  }
  if (sortKey === 'condition') {
    copy.sort((left, right) => {
      const byCondition = right.score.conditionScore - left.score.conditionScore;
      if (byCondition !== 0) {
        return byCondition;
      }
      return left.listing.price - right.listing.price;
    });
    return copy;
  }
  return copy;
}
