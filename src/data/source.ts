import { LISTINGS } from './listings';
import type { ChannelId, Chip, Condition, Listing, Series } from '../types';

const SERIES: readonly Series[] = ['Air', 'Pro'];
const CHIPS: readonly Chip[] = ['M1', 'M2', 'M3', 'M4', 'Intel'];
const CONDITIONS: readonly Condition[] = ['官翻', '99新', '95新', '9成新', '8成新', '7成新'];
const CHANNEL_IDS: readonly ChannelId[] = ['jd', 'web', 'live', 'xianyu', 'apple'];

function fail(index: number, message: string): never {
  throw new Error(`第 ${index + 1} 条${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(row: Record<string, unknown>, key: string, index: number): string {
  const value = row[key];
  if (typeof value !== 'string' || value.trim() === '') {
    fail(index, `缺少 ${key}`);
  }
  return value.trim();
}

function readNumber(row: Record<string, unknown>, key: string, index: number): number {
  const value = row[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    fail(index, `的 ${key} 不是有效数字`);
  }
  return value;
}

function readEnum<T extends string>(row: Record<string, unknown>, key: string, allowed: readonly T[], index: number): T {
  const value = readString(row, key, index);
  if (!(allowed as readonly string[]).includes(value)) {
    fail(index, `的 ${key} 不在允许范围`);
  }
  return value as T;
}

/** 把接口 JSON 收成 Listing。字段不对就整批失败，避免半截脏数据进打分。 */
export function parseListings(payload: unknown): Listing[] {
  if (!Array.isArray(payload)) {
    throw new Error('清单应为数组');
  }
  return payload.map((row, index) => {
    if (!isRecord(row)) {
      fail(index, '不是对象');
    }
    const linkValue = row.linkUrl;
    let linkUrl: string | undefined;
    if (typeof linkValue === 'string' && linkValue.trim() !== '') {
      const trimmed = linkValue.trim();
      if (!/^https?:\/\//.test(trimmed)) {
        fail(index, '的 linkUrl 需要以 http:// 或 https:// 开头');
      }
      linkUrl = trimmed;
    }
    const listing: Listing = {
      id: readString(row, 'id', index),
      series: readEnum(row, 'series', SERIES, index),
      model: readString(row, 'model', index),
      year: readNumber(row, 'year', index),
      chip: readEnum(row, 'chip', CHIPS, index),
      chipDetail: readString(row, 'chipDetail', index),
      memoryGb: readNumber(row, 'memoryGb', index),
      storageGb: readNumber(row, 'storageGb', index),
      gpu: readString(row, 'gpu', index),
      condition: readEnum(row, 'condition', CONDITIONS, index),
      price: readNumber(row, 'price', index),
      channel: readEnum(row, 'channel', CHANNEL_IDS, index),
      seller: readString(row, 'seller', index),
      note: readString(row, 'note', index),
    };
    if (linkUrl) {
      listing.linkUrl = linkUrl;
    }
    return listing;
  });
}

/**
 * 演示环境直接返回本地样本。
 * 配置 VITE_LISTING_API 后改为请求 `{base}/listings`。
 */
export async function loadListings(): Promise<Listing[]> {
  const base = import.meta.env?.VITE_LISTING_API?.trim();
  if (!base) {
    return LISTINGS;
  }
  const url = `${base.replace(/\/$/, '')}/listings`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`清单接口返回 ${response.status}`);
  }
  return parseListings(await response.json());
}
