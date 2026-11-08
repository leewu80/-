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
    name: '全网二手',
    shortName: '全网',
    description: '转转、爱回收等归入全网',
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
    id: 'hqb',
    name: '华强北市场报价',
    shortName: '华强北',
    description: '赛格、明通等档口的当面报价',
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
