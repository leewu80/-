import type { ChannelId, ChannelMeta } from '../types';

/** 渠道固定顺序，对比区始终按这个顺序排开。 */
export const CHANNELS: ChannelMeta[] = [
  {
    id: 'jd',
    name: '京东二手（拍拍）',
    shortName: '京东拍拍',
    description: '平台自营、官翻和拍拍优品',
  },
  {
    id: 'web',
    name: '爱回收',
    shortName: '爱回收',
    description: '爱回收验机的二手电脑',
  },
  {
    id: 'live',
    name: '科技数码苹果电脑主播挂价',
    shortName: '主播挂价',
    description: '数码主播直播间的苹果电脑报价',
  },
  {
    id: 'xianyu',
    name: '闲鱼同款',
    shortName: '闲鱼',
    description: '闲鱼个人卖家的同配置挂牌',
  },
  {
    id: 'apple',
    name: '苹果官方翻新',
    shortName: '苹果官翻',
    description: 'apple.com.cn 此刻在售的翻新 Mac，价格和链接都来自商品页',
  },
];

const CHANNEL_MAP = new Map(CHANNELS.map((channel) => [channel.id, channel]));

export function channelOf(id: ChannelId): ChannelMeta {
  const found = CHANNEL_MAP.get(id);
  if (!found) {
    throw new Error(`未知渠道 ${id}`);
  }
  return found;
}
