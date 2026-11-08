import { DEFAULT_WEIGHTS, scoreListings } from './scoring/score';
import type { Listing, ScoredListing, ScoreWeights } from './types';

export type UseCase = 'any' | 'office' | 'study' | 'edit' | 'game';

export const USE_CASES: Array<{ id: UseCase; label: string }> = [
  { id: 'any', label: '不限' },
  { id: 'office', label: '办公' },
  { id: 'study', label: '学习' },
  { id: 'edit', label: '剪辑' },
  { id: 'game', label: '轻游戏' },
];

export interface ConfigAdvice {
  model: string;
  year: number;
  chipDetail: string;
  memoryGb: number;
  storageGb: number;
  reason: string;
}

interface Profile extends ConfigAdvice {
  tier: number;
  uses: UseCase[];
}

const PROFILES: Profile[] = [
  {
    tier: 1,
    uses: ['office', 'study', 'any'],
    model: 'MacBook Air 13 英寸',
    year: 2020,
    chipDetail: 'M1',
    memoryGb: 16,
    storageGb: 256,
    reason: '预算紧时优先保证 16GB 内存。M1 做文档、网课和办公够用，8GB 容易卡。',
  },
  {
    tier: 3,
    uses: ['office', 'study', 'any'],
    model: 'MacBook Air 13 英寸',
    year: 2022,
    chipDetail: 'M2',
    memoryGb: 16,
    storageGb: 512,
    reason: '这个价位能买到 M2、16GB 和 512GB。日常和轻度剪辑都更从容，不必加钱上 Pro。',
  },
  {
    tier: 5,
    uses: ['office', 'study', 'any'],
    model: 'MacBook Air 13 英寸',
    year: 2024,
    chipDetail: 'M3',
    memoryGb: 16,
    storageGb: 512,
    reason: '预算内优先上 M3、16GB、512GB。机子更新，电池和续航比 M1/M2 省心。',
  },
  {
    tier: 4,
    uses: ['game', 'any'],
    model: 'MacBook Air 15 英寸',
    year: 2023,
    chipDetail: 'M2',
    memoryGb: 16,
    storageGb: 512,
    reason: '想要大屏又控预算，15 英寸 M2、16GB、512GB 比同价 13 英寸看着舒服，轻游戏也够。',
  },
  {
    tier: 6,
    uses: ['office', 'study', 'game', 'any'],
    model: 'MacBook Air 15 英寸',
    year: 2024,
    chipDetail: 'M3',
    memoryGb: 16,
    storageGb: 512,
    reason: '这个预算适合 15 英寸 M3、16GB、512GB。屏幕更大，性能够办公、学习和轻游戏。',
  },
  {
    tier: 7,
    uses: ['edit'],
    model: 'MacBook Pro 14 英寸',
    year: 2021,
    chipDetail: 'M1 Pro',
    memoryGb: 16,
    storageGb: 512,
    reason: '剪辑要风扇和接口。预算刚够时，14 英寸 M1 Pro、16GB、512GB 比 Air 更抗长时间导出。',
  },
  {
    tier: 8,
    uses: ['edit', 'game', 'any'],
    model: 'MacBook Pro 14 英寸',
    year: 2023,
    chipDetail: 'M3 Pro',
    memoryGb: 18,
    storageGb: 512,
    reason: '预算够碰到 14 英寸 M3 Pro、18GB、512GB。剪辑和时间线预览比 16GB 的 Air 稳。',
  },
  {
    tier: 9,
    uses: ['edit', 'game', 'any'],
    model: 'MacBook Pro 14 英寸',
    year: 2024,
    chipDetail: 'M4 Pro',
    memoryGb: 24,
    storageGb: 512,
    reason: '这个预算建议直接上 14 英寸 M4 Pro、24GB、512GB。内存一次给够，后面少升级烦恼。',
  },
  {
    tier: 10,
    uses: ['edit', 'game', 'any'],
    model: 'MacBook Pro 16 英寸',
    year: 2024,
    chipDetail: 'M4 Pro',
    memoryGb: 24,
    storageGb: 512,
    reason: '预算更高时，16 英寸 M4 Pro、24GB、512GB 屏幕和散热都更适合长时间剪辑。',
  },
  {
    tier: 11,
    uses: ['edit', 'any'],
    model: 'MacBook Pro 16 英寸',
    year: 2024,
    chipDetail: 'M4 Max',
    memoryGb: 48,
    storageGb: 1024,
    reason: '预算充足就上 16 英寸 M4 Max、48GB、1TB。大工程和多轨素材不容易爆内存。',
  },
];

export function listingsWithinBudget(listings: Listing[], budget: number): Listing[] {
  return listings.filter((item) => item.price <= budget);
}

function sameConfig(item: Listing, profile: ConfigAdvice): boolean {
  return (
    item.model === profile.model &&
    item.chipDetail === profile.chipDetail &&
    item.memoryGb === profile.memoryGb &&
    item.storageGb === profile.storageGb
  );
}

function profilePool(useCase: UseCase): Profile[] {
  if (useCase === 'edit') return PROFILES.filter((item) => item.uses.includes('edit'));
  if (useCase === 'game') return PROFILES.filter((item) => item.uses.includes('game'));
  if (useCase === 'office' || useCase === 'study') return PROFILES.filter((item) => item.uses.includes('office') || item.uses.includes('study'));
  return PROFILES.filter((item) => item.uses.includes('any'));
}

/** 在预算内挑一档买得到的建议配置。优先至少有两条挂牌的更高档。 */
export function suggestConfig(listings: Listing[], budget: number, useCase: UseCase): ConfigAdvice | null {
  const affordable = profilePool(useCase)
    .map((profile) => ({
      profile,
      count: listings.filter((item) => item.price <= budget && sameConfig(item, profile)).length,
    }))
    .filter((item) => item.count > 0)
    .sort((left, right) => {
      const leftReady = left.count >= 2 ? 1 : 0;
      const rightReady = right.count >= 2 ? 1 : 0;
      if (leftReady !== rightReady) return rightReady - leftReady;
      return right.profile.tier - left.profile.tier;
    });
  return affordable[0]?.profile ?? null;
}

export function listingsForConfig(listings: Listing[], advice: ConfigAdvice, budget: number): Listing[] {
  return listings
    .filter((item) => item.price <= budget && sameConfig(item, advice))
    .sort((left, right) => left.price - right.price);
}

function preferUse(listings: Listing[], useCase: UseCase): Listing[] {
  const withMemory = listings.filter((item) => item.memoryGb >= 16);
  const base = withMemory.length >= 3 ? withMemory : listings;
  if (useCase === 'edit') {
    const pro = base.filter((item) => item.series === 'Pro');
    return pro.length >= 3 ? pro : base;
  }
  if (useCase === 'game') {
    const picked = base.filter((item) => item.series === 'Pro' || item.model.includes('15'));
    return picked.length >= 3 ? picked : base;
  }
  if (useCase === 'office' || useCase === 'study') {
    const air = base.filter((item) => item.series === 'Air');
    return air.length >= 3 ? air : base;
  }
  return base;
}

/**
 * 综合分仍是成新度 + 同配置价格。预算只做硬过滤。
 * 分数接近时，优先更接近预算、更新、内存更大的机器，避免 12000 和 8000 推荐同一台旧机。
 */
function budgetValue(item: ScoredListing, budget: number): number {
  const ratio = item.listing.price / budget;
  const spend = ratio >= 0.5 ? ratio * 6 : ratio * 2;
  const freshness = (item.listing.year - 2020) * 0.35;
  const memory = Math.min(item.listing.memoryGb, 36) / 16;
  return item.score.total + spend + freshness + memory;
}

function pickTop(scored: ScoredListing[], budget: number): ScoredListing[] {
  const ranked = [...scored].sort((left, right) => budgetValue(right, budget) - budgetValue(left, budget));
  const chosen: ScoredListing[] = [];
  const sameFamily = (item: ScoredListing) =>
    chosen.some(
      (current) =>
        current.listing.model === item.listing.model && current.listing.chipDetail === item.listing.chipDetail,
    );
  for (const item of ranked) {
    if (chosen.length >= 3) break;
    if (sameFamily(item)) continue;
    if (chosen.some((current) => current.listing.channel === item.listing.channel)) continue;
    chosen.push(item);
  }
  for (const item of ranked) {
    if (chosen.length >= 3) break;
    if (chosen.some((current) => current.listing.id === item.listing.id) || sameFamily(item)) continue;
    chosen.push(item);
  }
  return chosen;
}

/** 预算内按成新度和价格打分，再给出 1～3 条不同机型。 */
export function recommendWithinBudget(
  listings: Listing[],
  budget: number,
  useCase: UseCase,
  weights: ScoreWeights = DEFAULT_WEIGHTS,
): ScoredListing[] {
  const inBudget = listingsWithinBudget(listings, budget);
  const pool = preferUse(inBudget, useCase);
  const scored = scoreListings(pool.length > 0 ? pool : inBudget, weights);
  return pickTop(scored, budget);
}

export function valueSentence(item: ScoredListing, budget: number): string {
  const cheaper = Math.round(item.score.cheaperThanAverage);
  const price = item.listing.price.toLocaleString('zh-CN');
  if (cheaper > 0) {
    return `售价 ¥${price} 还在 ${budget.toLocaleString('zh-CN')} 元预算内，比同配置均价大约少 ¥${cheaper.toLocaleString('zh-CN')}，成色 ${item.listing.condition}，所以性价比更高。`;
  }
  return `售价 ¥${price} 在预算内，成色是 ${item.listing.condition}，综合分高于同预算里的其他机器。`;
}
