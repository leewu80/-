import type { Chip, Filters, Listing, Series } from './types';

export const SERIES_OPTIONS: Series[] = ['Air', 'Pro'];
export const CHIP_OPTIONS: Chip[] = ['M1', 'M2', 'M3', 'M4', 'Intel'];

const GPU_ORDER = ['7 核 GPU', '8 核 GPU', '10 核 GPU', '16 核 GPU', '18 核 GPU', 'Intel Iris Plus'];

export const EMPTY_FILTERS: Filters = {
  series: [],
  chips: [],
  memories: [],
  storages: [],
  gpus: [],
  conditions: [],
  channels: [],
  priceMin: '',
  priceMax: '',
  keyword: '',
};

export function uniqueNumbers(values: number[]): number[] {
  return [...new Set(values)].sort((left, right) => left - right);
}

export function uniqueGpu(values: string[]): string[] {
  const set = new Set(values);
  const known = GPU_ORDER.filter((item) => set.has(item));
  const rest = [...set].filter((item) => !GPU_ORDER.includes(item)).sort();
  return [...known, ...rest];
}

export function countActiveFilters(filters: Filters): number {
  let count = 0;
  if (filters.series.length > 0) count += 1;
  if (filters.chips.length > 0) count += 1;
  if (filters.memories.length > 0) count += 1;
  if (filters.storages.length > 0) count += 1;
  if (filters.gpus.length > 0) count += 1;
  if (filters.conditions.length > 0) count += 1;
  if (filters.channels.length > 0) count += 1;
  if (filters.priceMin.trim() !== '' || filters.priceMax.trim() !== '') count += 1;
  if (filters.keyword.trim() !== '') count += 1;
  return count;
}

export function priceRangeError(filters: Filters): string | null {
  const minText = filters.priceMin.trim();
  const maxText = filters.priceMax.trim();
  if (minText !== '' && Number.isNaN(Number(minText))) {
    return '最低价请输入数字';
  }
  if (maxText !== '' && Number.isNaN(Number(maxText))) {
    return '最高价请输入数字';
  }
  if (minText !== '' && maxText !== '' && Number(minText) > Number(maxText)) {
    return '最低价高于最高价，没有机器会命中';
  }
  return null;
}

function parseBound(value: string): number | null {
  const text = value.trim();
  if (text === '') {
    return null;
  }
  const parsed = Number(text);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
}

/** 空数组表示这一项不限。价格空白表示这一端不设限。 */
export function applyFilters(listings: Listing[], filters: Filters): Listing[] {
  const keyword = filters.keyword.trim().toLowerCase();
  const min = parseBound(filters.priceMin);
  const max = parseBound(filters.priceMax);
  return listings.filter((item) => {
    if (filters.series.length > 0 && !filters.series.includes(item.series)) return false;
    if (filters.chips.length > 0 && !filters.chips.includes(item.chip)) return false;
    if (filters.memories.length > 0 && !filters.memories.includes(item.memoryGb)) return false;
    if (filters.storages.length > 0 && !filters.storages.includes(item.storageGb)) return false;
    if (filters.gpus.length > 0 && !filters.gpus.includes(item.gpu)) return false;
    if (filters.conditions.length > 0 && !filters.conditions.includes(item.condition)) return false;
    if (filters.channels.length > 0 && !filters.channels.includes(item.channel)) return false;
    if (min !== null && item.price < min) return false;
    if (max !== null && item.price > max) return false;
    if (keyword) {
      const haystack = [
        item.model,
        item.series,
        item.chip,
        item.chipDetail,
        item.gpu,
        item.seller,
        item.note,
        item.condition,
        String(item.year),
        String(item.memoryGb),
        String(item.storageGb),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  });
}
