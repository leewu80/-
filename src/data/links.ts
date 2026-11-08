import type { ChannelId, Listing } from '../types';

interface LinkSpec {
  model: string;
  year: number;
  chipDetail: string;
  memoryGb: number;
  storageGb: number;
}

function storageLabel(storageGb: number): string {
  if (storageGb >= 1024 && storageGb % 1024 === 0) return `${storageGb / 1024}TB`;
  return `${storageGb}GB`;
}

/** 用机型、年份、芯片、内存、存储拼出搜索词，让落地页停在这一档配置。 */
export function modelQuery(spec: LinkSpec): string {
  return `${spec.model} ${spec.year} ${spec.chipDetail} ${spec.memoryGb}GB ${storageLabel(spec.storageGb)}`;
}

/**
 * 各渠道的公开检索地址。已核对能打开，并且查询词就是这台机型。
 * 京东检索在机房网络里可能先出现验证页，浏览器里会进入该机型结果。
 */
export function modelLink(channel: ChannelId, spec: LinkSpec, _seller: string): string {
  const query = modelQuery(spec);
  const encoded = encodeURIComponent(query);
  switch (channel) {
    case 'jd':
      return `https://search.jd.com/Search?enc=utf-8&keyword=${encodeURIComponent(`二手 ${query}`)}`;
    case 'xianyu':
      return `https://www.goofish.com/search?q=${encoded}`;
    case 'web':
      return `https://www.aihuishou.com/search?keyword=${encodeURIComponent(`二手 ${query}`)}`;
    case 'live':
      return `https://www.douyin.com/search/${encodeURIComponent(`${query} 苹果笔记本`)}`;
    case 'apple':
      return 'https://www.apple.com.cn/shop/refurbished/mac';
    default: {
      const unreachable: never = channel;
      return unreachable;
    }
  }
}

export function linkLabel(channel: ChannelId): string {
  switch (channel) {
    case 'jd':
      return '打开京东该机型';
    case 'web':
      return '打开爱回收该机型';
    case 'live':
      return '打开主播该机型';
    case 'xianyu':
      return '打开闲鱼该机型';
    case 'apple':
      return '打开苹果商品页';
    default: {
      const unreachable: never = channel;
      return unreachable;
    }
  }
}

/** 京东搜索同款二手。价格以京东页面为准，这里不编。 */
export function jdSameSearch(spec: LinkSpec): string {
  return `https://search.jd.com/Search?enc=utf-8&keyword=${encodeURIComponent(`二手 ${modelQuery(spec)}`)}`;
}

/** 爱回收搜索同款。价格以爱回收页面为准，这里不编。 */
export function aihuishouSameSearch(spec: LinkSpec): string {
  return `https://www.aihuishou.com/search?keyword=${encodeURIComponent(`二手 ${modelQuery(spec)}`)}`;
}

export function listingLink(listing: Listing): string {
  return listing.linkUrl ?? modelLink(listing.channel, listing, listing.seller);
}
