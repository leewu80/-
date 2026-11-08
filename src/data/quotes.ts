import { parseListings } from './source';
import type { ChannelId, Chip, Condition, Listing, Series } from '../types';

const QUOTE_KEY = 'guoze.quotes.v1';
const PLAN_KEY = 'guoze.plan.v1';

export const MODEL_PRESETS = [
  'MacBook Air 13 英寸',
  'MacBook Air 15 英寸',
  'MacBook Pro 13 英寸',
  'MacBook Pro 14 英寸',
  'MacBook Pro 16 英寸',
];

export const GPU_PRESETS = ['7 核 GPU', '8 核 GPU', '10 核 GPU', '16 核 GPU', '18 核 GPU', 'Intel Iris Plus'];

export interface QuoteDraft {
  series: Series;
  model: string;
  year: string;
  chip: Chip;
  chipDetail: string;
  memoryGb: string;
  storageGb: string;
  gpu: string;
  condition: Condition;
  price: string;
  channel: ChannelId;
  seller: string;
  note: string;
  linkUrl: string;
}

export function emptyQuoteDraft(): QuoteDraft {
  return {
    series: 'Air',
    model: 'MacBook Air 13 英寸',
    year: '2024',
    chip: 'M3',
    chipDetail: 'M3',
    memoryGb: '16',
    storageGb: '512',
    gpu: '10 核 GPU',
    condition: '95新',
    price: '',
    channel: 'xianyu',
    seller: '',
    note: '',
    linkUrl: '',
  };
}

function readPositive(value: string): number | null {
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

/** 把表单收成一条本场报价。链接留空则不写 linkUrl，界面继续显示占位。 */
export function quoteFromDraft(draft: QuoteDraft): { ok: true; listing: Listing } | { ok: false; error: string } {
  const model = draft.model.trim();
  const seller = draft.seller.trim();
  const year = readPositive(draft.year);
  const memoryGb = readPositive(draft.memoryGb);
  const storageGb = readPositive(draft.storageGb);
  const price = readPositive(draft.price);
  if (!model) return { ok: false, error: '请填写机型' };
  if (!seller) return { ok: false, error: '请填写卖家或主播' };
  if (year === null || year < 2015 || year > 2030) return { ok: false, error: '年份请填 2015 到 2030' };
  if (memoryGb === null) return { ok: false, error: '内存请填大于 0 的数字，单位 GB' };
  if (storageGb === null) return { ok: false, error: '存储请填大于 0 的数字，单位 GB' };
  if (price === null) return { ok: false, error: '价格请填大于 0 的金额' };
  const gpu = draft.gpu.trim();
  if (!gpu) return { ok: false, error: '请填写显卡' };
  const linkText = draft.linkUrl.trim();
  let linkUrl: string | undefined;
  if (linkText) {
    if (!/^https?:\/\//.test(linkText)) {
      return { ok: false, error: '链接请留空，或填写以 http://、https:// 开头的地址' };
    }
    linkUrl = linkText;
  }
  const chipDetail = draft.chipDetail.trim() || draft.chip;
  const note = draft.note.trim() || '本场录入的报价。';
  const listing: Listing = {
    id: `quote-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    series: draft.series,
    model,
    year: Math.round(year),
    chip: draft.chip,
    chipDetail,
    memoryGb: Math.round(memoryGb),
    storageGb: Math.round(storageGb),
    gpu,
    condition: draft.condition,
    price: Math.round(price),
    channel: draft.channel,
    seller,
    note,
    origin: 'quote',
  };
  if (linkUrl) listing.linkUrl = linkUrl;
  return { ok: true, listing };
}

export function mergeCatalog(samples: Listing[], quotes: Listing[]): Listing[] {
  const seen = new Set<string>();
  const merged: Listing[] = [];
  for (const item of [...samples, ...quotes]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  return merged;
}

function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadStoredQuotes(): Listing[] {
  const box = storage();
  if (!box) return [];
  const raw = box.getItem(QUOTE_KEY);
  if (!raw) return [];
  try {
    return parseListings(JSON.parse(raw)).map((item) => ({ ...item, origin: 'quote' as const }));
  } catch {
    return [];
  }
}

export function storeQuotes(quotes: Listing[]): void {
  const box = storage();
  if (!box) return;
  box.setItem(QUOTE_KEY, JSON.stringify(quotes));
}

export function loadPlanIds(): string[] {
  const box = storage();
  if (!box) return [];
  const raw = box.getItem(PLAN_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string').slice(0, 3);
  } catch {
    return [];
  }
}

export function storePlanIds(ids: string[]): void {
  const box = storage();
  if (!box) return;
  box.setItem(PLAN_KEY, JSON.stringify(ids.slice(0, 3)));
}
