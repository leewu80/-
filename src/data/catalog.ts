import { modelLink } from './links';
import type { ChannelId, Chip, Condition, Listing, Series } from '../types';

interface CatalogSpec {
  series: Series;
  model: string;
  year: number;
  chipDetail: string;
  memoryGb: number;
  storageGb: number;
  /** 95 新左右的基准价，各渠道按成色上下浮动 */
  basePrice: number;
}

function chipOf(detail: string): Chip {
  if (detail.startsWith('M1')) return 'M1';
  if (detail.startsWith('M2')) return 'M2';
  if (detail.startsWith('M3')) return 'M3';
  if (detail.startsWith('M4')) return 'M4';
  return 'Intel';
}

function gpuFor(detail: string, model: string, memoryGb: number): string {
  if (detail === 'M1' && model.includes('Air')) return '7 核 GPU';
  if (detail === 'M2' && model.includes('Air')) return memoryGb <= 8 ? '8 核 GPU' : '10 核 GPU';
  if ((detail === 'M3' || detail === 'M4') && model.includes('Air')) return '10 核 GPU';
  if (detail === 'M1 Pro') return '16 核 GPU';
  if (detail === 'M1 Max') return '32 核 GPU';
  if (detail === 'M2 Pro') return '19 核 GPU';
  if (detail === 'M2 Max') return '38 核 GPU';
  if (detail === 'M3') return '10 核 GPU';
  if (detail === 'M3 Pro') return '18 核 GPU';
  if (detail === 'M3 Max') return '30 核 GPU';
  if (detail === 'M4') return '10 核 GPU';
  if (detail === 'M4 Pro') return '20 核 GPU';
  if (detail === 'M4 Max') return '40 核 GPU';
  return '10 核 GPU';
}

function spec(
  series: Series,
  model: string,
  year: number,
  chipDetail: string,
  memoryGb: number,
  storageGb: number,
  basePrice: number,
): CatalogSpec {
  return { series, model, year, chipDetail, memoryGb, storageGb, basePrice };
}

const air13 = 'MacBook Air 13 英寸';
const air15 = 'MacBook Air 15 英寸';
const pro14 = 'MacBook Pro 14 英寸';
const pro16 = 'MacBook Pro 16 英寸';

/** 主流二手在售组合。15 英寸从 M2 起才有，M1 只出现在 13 英寸和 Pro。 */
export const CATALOG_SPECS: CatalogSpec[] = [
  spec('Air', air13, 2020, 'M1', 8, 256, 3400),
  spec('Air', air13, 2020, 'M1', 16, 256, 4300),
  spec('Air', air13, 2020, 'M1', 16, 512, 4900),
  spec('Air', air13, 2022, 'M2', 8, 256, 5000),
  spec('Air', air13, 2022, 'M2', 16, 256, 5900),
  spec('Air', air13, 2022, 'M2', 16, 512, 6600),
  spec('Air', air13, 2022, 'M2', 24, 512, 7400),
  spec('Air', air13, 2024, 'M3', 8, 256, 6400),
  spec('Air', air13, 2024, 'M3', 16, 256, 7600),
  spec('Air', air13, 2024, 'M3', 16, 512, 8400),
  spec('Air', air13, 2024, 'M3', 24, 512, 9300),
  spec('Air', air13, 2025, 'M4', 16, 256, 8800),
  spec('Air', air13, 2025, 'M4', 16, 512, 9800),
  spec('Air', air13, 2025, 'M4', 24, 512, 11000),
  spec('Air', air15, 2023, 'M2', 8, 256, 6400),
  spec('Air', air15, 2023, 'M2', 16, 256, 7200),
  spec('Air', air15, 2023, 'M2', 16, 512, 8000),
  spec('Air', air15, 2024, 'M3', 16, 256, 8400),
  spec('Air', air15, 2024, 'M3', 16, 512, 9200),
  spec('Air', air15, 2024, 'M3', 24, 512, 10400),
  spec('Air', air15, 2025, 'M4', 16, 256, 10000),
  spec('Air', air15, 2025, 'M4', 16, 512, 11400),
  spec('Air', air15, 2025, 'M4', 24, 512, 13000),
  spec('Pro', pro14, 2021, 'M1 Pro', 16, 512, 7500),
  spec('Pro', pro14, 2021, 'M1 Pro', 16, 1024, 8200),
  spec('Pro', pro14, 2021, 'M1 Max', 32, 1024, 10200),
  spec('Pro', pro14, 2023, 'M2 Pro', 16, 512, 10000),
  spec('Pro', pro14, 2023, 'M2 Pro', 16, 1024, 11000),
  spec('Pro', pro14, 2023, 'M2 Max', 32, 1024, 13200),
  spec('Pro', pro14, 2023, 'M3', 16, 512, 11200),
  spec('Pro', pro14, 2023, 'M3 Pro', 18, 512, 12800),
  spec('Pro', pro14, 2023, 'M3 Pro', 18, 1024, 14000),
  spec('Pro', pro14, 2023, 'M3 Max', 36, 1024, 17200),
  spec('Pro', pro14, 2024, 'M4', 16, 512, 13000),
  spec('Pro', pro14, 2024, 'M4', 16, 1024, 14200),
  spec('Pro', pro14, 2024, 'M4 Pro', 24, 512, 16200),
  spec('Pro', pro14, 2024, 'M4 Pro', 24, 1024, 17600),
  spec('Pro', pro14, 2024, 'M4 Max', 36, 1024, 21500),
  spec('Pro', pro16, 2021, 'M1 Pro', 16, 512, 8500),
  spec('Pro', pro16, 2021, 'M1 Max', 32, 1024, 11500),
  spec('Pro', pro16, 2023, 'M2 Pro', 16, 512, 11000),
  spec('Pro', pro16, 2023, 'M2 Max', 32, 1024, 15000),
  spec('Pro', pro16, 2023, 'M3 Pro', 18, 512, 14500),
  spec('Pro', pro16, 2023, 'M3 Max', 36, 1024, 19200),
  spec('Pro', pro16, 2024, 'M4 Pro', 24, 512, 17800),
  spec('Pro', pro16, 2024, 'M4 Max', 48, 1024, 24500),
];

interface ChannelOffer {
  channel: ChannelId;
  condition: Condition;
  factor: number;
  seller: string;
  note: string;
}

function offersFor(index: number): ChannelOffer[] {
  const webSeller = index % 2 === 0 ? '爱回收严选' : '转转优品';
  return [
    {
      channel: 'jd',
      condition: '官翻',
      factor: 1.08,
      seller: '京东拍拍自营',
      note: '平台官翻，适合想要售后的人。',
    },
    {
      channel: 'web',
      condition: '95新',
      factor: 0.98,
      seller: webSeller,
      note: '平台验过机，价格贴近同配置行情。',
    },
    {
      channel: 'live',
      condition: '99新',
      factor: 1.04,
      seller: index % 2 === 0 ? '主播·数码老王' : '主播·Mac实验室',
      note: '直播间挂价，成色新，通常比官翻便宜一点。',
    },
    {
      channel: 'xianyu',
      condition: '8成新',
      factor: 0.86,
      seller: '闲鱼·个人良品',
      note: '个人闲置，价格低，建议当面先验机。',
    },
    {
      channel: 'hqb',
      condition: '9成新',
      factor: 0.92,
      seller: index % 3 === 0 ? '华强北·赛格老周' : index % 3 === 1 ? '华强北·明通阿豪' : '华强北·远望数码',
      note: '档口现金价，可当面看机。',
    },
  ];
}

function slug(item: CatalogSpec, channel: ChannelId): string {
  return `${item.model}-${item.chipDetail}-${item.memoryGb}-${item.storageGb}-${channel}`
    .replace(/\s+/g, '')
    .toLowerCase();
}

export function buildCatalog(): Listing[] {
  const rows: Listing[] = [];
  CATALOG_SPECS.forEach((item, index) => {
    for (const offer of offersFor(index)) {
      const price = Math.round((item.basePrice * offer.factor) / 10) * 10;
      const listing: Listing = {
        id: slug(item, offer.channel),
        series: item.series,
        model: item.model,
        year: item.year,
        chip: chipOf(item.chipDetail),
        chipDetail: item.chipDetail,
        memoryGb: item.memoryGb,
        storageGb: item.storageGb,
        gpu: gpuFor(item.chipDetail, item.model, item.memoryGb),
        condition: offer.condition,
        price,
        channel: offer.channel,
        seller: offer.seller,
        note: offer.note,
        linkUrl: modelLink(offer.channel, item, offer.seller),
      };
      rows.push(listing);
    }
  });
  return rows;
}
