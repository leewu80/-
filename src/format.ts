import type { Listing } from './types';

export const LINK_PLACEHOLDER = '链接占位 · 演示数据不跳转';

export function formatCny(value: number): string {
  return `¥${Math.round(value).toLocaleString('zh-CN')}`;
}

export function formatScore(value: number): string {
  return (Math.round(value * 10) / 10).toFixed(1);
}

export function formatStorage(gb: number): string {
  if (gb >= 1024 && gb % 1024 === 0) {
    return `${gb / 1024}TB`;
  }
  return `${gb}GB`;
}

export function specLine(listing: Listing): string {
  return `${listing.chipDetail} · ${listing.memoryGb}GB · ${formatStorage(listing.storageGb)} · ${listing.gpu}`;
}

export function specShort(listing: Listing): string {
  return `${listing.series} ${listing.model.replace('MacBook ', '')} · ${listing.chipDetail} · ${listing.memoryGb}GB/${formatStorage(listing.storageGb)}`;
}

export function priceDelta(cheaperThanAverage: number): { text: string; tone: 'good' | 'bad' | 'flat' } {
  const amount = Math.round(cheaperThanAverage);
  if (amount > 0) {
    return { text: `低于均价 ${formatCny(amount)}`, tone: 'good' };
  }
  if (amount < 0) {
    return { text: `高于均价 ${formatCny(Math.abs(amount))}`, tone: 'bad' };
  }
  return { text: '与均价持平', tone: 'flat' };
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
