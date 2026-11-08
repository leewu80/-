import { modelLink } from './links';
import type { ChannelId, Chip, Condition, Listing, Series } from '../types';

// 演示样本均为虚构挂牌，只用于讲解筛选和打分，不是真实在售。

interface Spec {
  series: Series;
  model: string;
  year: number;
  chip: Chip;
  chipDetail: string;
  memoryGb: number;
  storageGb: number;
  gpu: string;
}

interface Offer {
  id: string;
  channel: ChannelId;
  condition: Condition;
  price: number;
  seller: string;
  note: string;
}

function offers(spec: Spec, rows: Offer[]): Listing[] {
  return rows.map((row) => ({
    series: spec.series,
    model: spec.model,
    year: spec.year,
    chip: spec.chip,
    chipDetail: spec.chipDetail,
    memoryGb: spec.memoryGb,
    storageGb: spec.storageGb,
    gpu: spec.gpu,
    id: row.id,
    channel: row.channel,
    condition: row.condition,
    price: row.price,
    seller: row.seller,
    note: row.note,
    linkUrl: modelLink(row.channel, spec, row.seller),
  }));
}

const AIR13_M3: Spec = {
  series: 'Air',
  model: 'MacBook Air 13 英寸',
  year: 2024,
  chip: 'M3',
  chipDetail: 'M3',
  memoryGb: 16,
  storageGb: 512,
  gpu: '10 核 GPU',
};

const AIR13_M2: Spec = {
  series: 'Air',
  model: 'MacBook Air 13 英寸',
  year: 2022,
  chip: 'M2',
  chipDetail: 'M2',
  memoryGb: 16,
  storageGb: 256,
  gpu: '8 核 GPU',
};

const AIR15_M3: Spec = {
  series: 'Air',
  model: 'MacBook Air 15 英寸',
  year: 2024,
  chip: 'M3',
  chipDetail: 'M3',
  memoryGb: 16,
  storageGb: 512,
  gpu: '10 核 GPU',
};

const PRO14_M3PRO: Spec = {
  series: 'Pro',
  model: 'MacBook Pro 14 英寸',
  year: 2023,
  chip: 'M3',
  chipDetail: 'M3 Pro',
  memoryGb: 18,
  storageGb: 512,
  gpu: '18 核 GPU',
};

const PRO14_M4: Spec = {
  series: 'Pro',
  model: 'MacBook Pro 14 英寸',
  year: 2024,
  chip: 'M4',
  chipDetail: 'M4',
  memoryGb: 16,
  storageGb: 512,
  gpu: '10 核 GPU',
};

const PRO16_M3PRO: Spec = {
  series: 'Pro',
  model: 'MacBook Pro 16 英寸',
  year: 2023,
  chip: 'M3',
  chipDetail: 'M3 Pro',
  memoryGb: 18,
  storageGb: 512,
  gpu: '18 核 GPU',
};

const AIR13_M1: Spec = {
  series: 'Air',
  model: 'MacBook Air 13 英寸',
  year: 2020,
  chip: 'M1',
  chipDetail: 'M1',
  memoryGb: 8,
  storageGb: 256,
  gpu: '7 核 GPU',
};

const PRO13_INTEL: Spec = {
  series: 'Pro',
  model: 'MacBook Pro 13 英寸',
  year: 2020,
  chip: 'Intel',
  chipDetail: 'Intel Core i5',
  memoryGb: 16,
  storageGb: 512,
  gpu: 'Intel Iris Plus',
};

const PRO14_M2PRO: Spec = {
  series: 'Pro',
  model: 'MacBook Pro 14 英寸',
  year: 2023,
  chip: 'M2',
  chipDetail: 'M2 Pro',
  memoryGb: 16,
  storageGb: 512,
  gpu: '16 核 GPU',
};

const AIR13_M4: Spec = {
  series: 'Air',
  model: 'MacBook Air 13 英寸',
  year: 2025,
  chip: 'M4',
  chipDetail: 'M4',
  memoryGb: 16,
  storageGb: 256,
  gpu: '10 核 GPU',
};

const PRO14_M3PRO_1T: Spec = {
  series: 'Pro',
  model: 'MacBook Pro 14 英寸',
  year: 2023,
  chip: 'M3',
  chipDetail: 'M3 Pro',
  memoryGb: 18,
  storageGb: 1024,
  gpu: '18 核 GPU',
};

const AIR15_M2: Spec = {
  series: 'Air',
  model: 'MacBook Air 15 英寸',
  year: 2023,
  chip: 'M2',
  chipDetail: 'M2',
  memoryGb: 16,
  storageGb: 512,
  gpu: '10 核 GPU',
};

const PRO14_M4PRO: Spec = {
  series: 'Pro',
  model: 'MacBook Pro 14 英寸',
  year: 2024,
  chip: 'M4',
  chipDetail: 'M4 Pro',
  memoryGb: 24,
  storageGb: 1024,
  gpu: '16 核 GPU',
};

export const LISTINGS: Listing[] = [
  ...offers(AIR13_M3, [
    {
      id: 'air13-m3-jd',
      channel: 'jd',
      condition: '官翻',
      price: 8999,
      seller: '京东拍拍自营',
      note: '平台一年质保，电池循环 42 次，含原装充电器。',
    },
    {
      id: 'air13-m3-web',
      channel: 'web',
      condition: '95新',
      price: 7680,
      seller: '转转优品',
      note: '转转质检，外观有细微使用痕迹，箱说齐全。',
    },
    {
      id: 'air13-m3-live',
      channel: 'live',
      condition: '95新',
      price: 7499,
      seller: '主播·数码老王',
      note: '直播间报价含原装充电器，演示数据不是实时成交价。',
    },
    {
      id: 'air13-m3-xy',
      channel: 'xianyu',
      condition: '9成新',
      price: 6999,
      seller: '闲鱼·深圳小陈',
      note: '个人自用，键盘轻微打油，无发票。',
    },
    {
      id: 'air13-m3-hqb',
      channel: 'hqb',
      condition: '9成新',
      price: 6780,
      seller: '华强北·赛格老周',
      note: '档口当面验机，键盘有轻微油光，无票，价格可小刀。',
    },
  ]),
  ...offers(AIR13_M2, [
    {
      id: 'air13-m2-jd',
      channel: 'jd',
      condition: '99新',
      price: 6299,
      seller: '京东拍拍优品',
      note: '几乎没有使用痕迹，电池循环 60 次。',
    },
    {
      id: 'air13-m2-web',
      channel: 'web',
      condition: '95新',
      price: 5890,
      seller: '转转',
      note: '验机通过，屏幕无亮点。',
    },
    {
      id: 'air13-m2-live',
      channel: 'live',
      condition: '9成新',
      price: 5450,
      seller: '主播·极客小林',
      note: '主播挂价，机身有轻微磕碰，已在备注说明。',
    },
    {
      id: 'air13-m2-xy',
      channel: 'xianyu',
      condition: '95新',
      price: 5600,
      seller: '闲鱼·成都阿美',
      note: '自用转出，循环 120 次，配件齐全。',
    },
    {
      id: 'air13-m2-hqb',
      channel: 'hqb',
      condition: '95新',
      price: 5520,
      seller: '华强北·明通阿豪',
      note: '档口现货，电池循环约 90 次，支持当场开机。',
    },
  ]),
  ...offers(AIR15_M3, [
    {
      id: 'air15-m3-jd',
      channel: 'jd',
      condition: '官翻',
      price: 8900,
      seller: '苹果官翻（京东）',
      note: '官翻机，电池健康度正常，支持平台退换。',
    },
    {
      id: 'air15-m3-web',
      channel: 'web',
      condition: '95新',
      price: 8200,
      seller: '爱回收严选',
      note: '爱回收严选，外观 95 新，功能正常。',
    },
    {
      id: 'air15-m3-live',
      channel: 'live',
      condition: '99新',
      price: 9100,
      seller: '主播·Mac实验室',
      note: '主播展示机，循环次数低，报价含运费。',
    },
    {
      id: 'air15-m3-hqb',
      channel: 'hqb',
      condition: '95新',
      price: 8600,
      seller: '华强北·远望数码',
      note: '成色干净，报价接近全网，适合当面和爱回收那台比。',
    },
  ]),
  ...offers(PRO14_M3PRO, [
    {
      id: 'pro14-m3pro-jd',
      channel: 'jd',
      condition: '95新',
      price: 12800,
      seller: '拍拍优品',
      note: '拍拍优品，边角有细纹，性能档位完整。',
    },
    {
      id: 'pro14-m3pro-web',
      channel: 'web',
      condition: '9成新',
      price: 11500,
      seller: '爱回收',
      note: '爱回收质检，底部有使用磨痕。',
    },
    {
      id: 'pro14-m3pro-live',
      channel: 'live',
      condition: '官翻',
      price: 13200,
      seller: '主播·苹果管家阿凯',
      note: '官翻来源，主播代卖，质保跟随平台。',
    },
    {
      id: 'pro14-m3pro-xy',
      channel: 'xianyu',
      condition: '8成新',
      price: 9999,
      seller: '闲鱼·杭州阿林',
      note: '使用约两年，A 面有划痕，价格明显更低。',
    },
    {
      id: 'pro14-m3pro-hqb',
      channel: 'hqb',
      condition: '9成新',
      price: 10900,
      seller: '华强北·都会二楼',
      note: '使用痕迹能看到，可现场跑分，无发票。',
    },
  ]),
  ...offers(PRO14_M4, [
    {
      id: 'pro14-m4-jd',
      channel: 'jd',
      condition: '99新',
      price: 13999,
      seller: '京东拍拍',
      note: '在保期内转手，箱说和发票都在。',
    },
    {
      id: 'pro14-m4-live',
      channel: 'live',
      condition: '95新',
      price: 12680,
      seller: '主播·数码老王',
      note: '主播样机，外观干净，按演示价挂出。',
    },
    {
      id: 'pro14-m4-xy',
      channel: 'xianyu',
      condition: '95新',
      price: 11680,
      seller: '闲鱼·上海豆豆',
      note: '可同城自提或邮寄，电池循环 80 次。',
    },
    {
      id: 'pro14-m4-hqb',
      channel: 'hqb',
      condition: '95新',
      price: 11280,
      seller: '华强北·新亚洲阿凯',
      note: '同配置现金价，箱说不全，支持当面验机。',
    },
  ]),
  ...offers(PRO16_M3PRO, [
    {
      id: 'pro16-m3pro-jd',
      channel: 'jd',
      condition: '95新',
      price: 14800,
      seller: '拍拍优品',
      note: '16 英寸创作本，电池循环 150 次。',
    },
    {
      id: 'pro16-m3pro-web',
      channel: 'web',
      condition: '9成新',
      price: 13200,
      seller: '转转验机',
      note: '转转验机，键盘无掉漆。',
    },
    {
      id: 'pro16-m3pro-live',
      channel: 'live',
      condition: '官翻',
      price: 15600,
      seller: '主播·苹果管家阿凯',
      note: '官翻渠道挂价，适合更看重成色的客户。',
    },
    {
      id: 'pro16-m3pro-hqb',
      channel: 'hqb',
      condition: '95新',
      price: 13900,
      seller: '华强北·赛格老周',
      note: '16 英寸现货，电池循环约 180 次，可当场拷机。',
    },
  ]),
  ...offers(AIR13_M1, [
    {
      id: 'air13-m1-jd',
      channel: 'jd',
      condition: '9成新',
      price: 3999,
      seller: '京东拍拍',
      note: '入门款，适合当备用机，功能正常。',
    },
    {
      id: 'air13-m1-web',
      channel: 'web',
      condition: '8成新',
      price: 3299,
      seller: '爱回收',
      note: '电池有损耗，价格和成色对应。',
    },
    {
      id: 'air13-m1-xy',
      channel: 'xianyu',
      condition: '95新',
      price: 3680,
      seller: '闲鱼·武汉小周',
      note: '成色保持较好，循环约 200 次。',
    },
    {
      id: 'air13-m1-live',
      channel: 'live',
      condition: '7成新',
      price: 2999,
      seller: '主播·极客小林',
      note: '外壳有磕碰，适合预算优先、能接受旧成色。',
    },
    {
      id: 'air13-m1-hqb',
      channel: 'hqb',
      condition: '8成新',
      price: 3150,
      seller: '华强北·明通阿豪',
      note: '入门备用机，外壳有磕碰，功能正常。',
    },
  ]),
  ...offers(PRO13_INTEL, [
    {
      id: 'pro13-intel-jd',
      channel: 'jd',
      condition: '8成新',
      price: 3580,
      seller: '京东拍拍',
      note: '老款接口机，适合仍要跑旧软件的客户。',
    },
    {
      id: 'pro13-intel-web',
      channel: 'web',
      condition: '9成新',
      price: 3890,
      seller: '转转',
      note: '验机可正常开关机，电池状态一般。',
    },
    {
      id: 'pro13-intel-xy',
      channel: 'xianyu',
      condition: '7成新',
      price: 2799,
      seller: '闲鱼·广州阿强',
      note: '成色较低，风扇有积灰，价格压得很低。',
    },
    {
      id: 'pro13-intel-hqb',
      channel: 'hqb',
      condition: '8成新',
      price: 2990,
      seller: '华强北·远望数码',
      note: '老款接口机，风扇已清灰，适合还要跑旧软件的客户。',
    },
  ]),
  ...offers(PRO14_M2PRO, [
    {
      id: 'pro14-m2pro-web',
      channel: 'web',
      condition: '95新',
      price: 9800,
      seller: '爱回收',
      note: '爱回收在售，外观有细纹，性能稳定。',
    },
    {
      id: 'pro14-m2pro-live',
      channel: 'live',
      condition: '99新',
      price: 10580,
      seller: '主播·Mac实验室',
      note: '主播挂价接近 99 新，含原装电源。',
    },
    {
      id: 'pro14-m2pro-xy',
      channel: 'xianyu',
      condition: '9成新',
      price: 9100,
      seller: '闲鱼·南京小林',
      note: '个人卖家，箱说不全，价格有优势。',
    },
    {
      id: 'pro14-m2pro-jd',
      channel: 'jd',
      condition: '官翻',
      price: 11200,
      seller: '京东拍拍自营',
      note: '官翻质保，是这一档里更稳妥的成色选项。',
    },
    {
      id: 'pro14-m2pro-hqb',
      channel: 'hqb',
      condition: '95新',
      price: 9900,
      seller: '华强北·都会二楼',
      note: '档口报价含原装充电器，外观有细纹。',
    },
  ]),
  ...offers(AIR13_M4, [
    {
      id: 'air13-m4-jd',
      channel: 'jd',
      condition: '官翻',
      price: 9299,
      seller: '苹果官翻（京东）',
      note: '官翻，适合想要较新机身、又希望走平台的客户。',
    },
    {
      id: 'air13-m4-live',
      channel: 'live',
      condition: '99新',
      price: 8680,
      seller: '主播·数码老王',
      note: '主播在售样机，循环很少。',
    },
    {
      id: 'air13-m4-web',
      channel: 'web',
      condition: '95新',
      price: 8350,
      seller: '转转优品',
      note: '转转优品，价格低于同配置官翻一截。',
    },
    {
      id: 'air13-m4-hqb',
      channel: 'hqb',
      condition: '99新',
      price: 8800,
      seller: '华强北·新亚洲阿凯',
      note: '机身较新，档口价高于转转优品，适合当面看循环次数。',
    },
  ]),
  ...offers(PRO14_M3PRO_1T, [
    {
      id: 'pro14-m3pro-1t-jd',
      channel: 'jd',
      condition: '官翻',
      price: 14600,
      seller: '京东拍拍自营',
      note: '官翻大存储，适合直接装素材。',
    },
    {
      id: 'pro14-m3pro-1t-xy',
      channel: 'xianyu',
      condition: '95新',
      price: 12880,
      seller: '闲鱼·苏州阿宁',
      note: '同款 1TB，外观保持较好。',
    },
    {
      id: 'pro14-m3pro-1t-web',
      channel: 'web',
      condition: '9成新',
      price: 11990,
      seller: '爱回收',
      note: '爱回收在售，存储比 512GB 那一档更大。',
    },
    {
      id: 'pro14-m3pro-1t-hqb',
      channel: 'hqb',
      condition: '95新',
      price: 12480,
      seller: '华强北·赛格老周',
      note: '1TB 现货，可当面验机，箱说不一定齐。',
    },
  ]),
  ...offers(AIR15_M2, [
    {
      id: 'air15-m2-xy',
      channel: 'xianyu',
      condition: '95新',
      price: 7200,
      seller: '闲鱼·西安小北',
      note: '大屏 Air，个人自用，边框有轻微磨损。',
    },
    {
      id: 'air15-m2-web',
      channel: 'web',
      condition: '9成新',
      price: 6800,
      seller: '转转',
      note: '转转报价，适合想要 15 英寸、但不追最新芯片。',
    },
    {
      id: 'air15-m2-jd',
      channel: 'jd',
      condition: '99新',
      price: 7999,
      seller: '京东拍拍',
      note: '平台在售，成色接近全新。',
    },
    {
      id: 'air15-m2-hqb',
      channel: 'hqb',
      condition: '9成新',
      price: 6650,
      seller: '华强北·明通阿豪',
      note: '大屏 Air 档口货，边框有磨损。',
    },
  ]),
  ...offers(PRO14_M4PRO, [
    {
      id: 'pro14-m4pro-jd',
      channel: 'jd',
      condition: '99新',
      price: 17600,
      seller: '京东拍拍',
      note: '高配创作本，箱说和发票都在。',
    },
    {
      id: 'pro14-m4pro-live',
      channel: 'live',
      condition: '95新',
      price: 16200,
      seller: '主播·Mac实验室',
      note: '主播挂价，方便和同配置的其他渠道对差价。',
    },
    {
      id: 'pro14-m4pro-web',
      channel: 'web',
      condition: '95新',
      price: 15880,
      seller: '转转优品',
      note: '转转优品高配，价格略低于主播挂价。',
    },
    {
      id: 'pro14-m4pro-xy',
      channel: 'xianyu',
      condition: '9成新',
      price: 14990,
      seller: '闲鱼·北京阿棠',
      note: '个人高配转出，成色 9 成，这一档里价格最低。',
    },
    {
      id: 'pro14-m4pro-hqb',
      channel: 'hqb',
      condition: '95新',
      price: 15200,
      seller: '华强北·远望数码',
      note: '高配创作本，无票，支持当场测试接口和外放。',
    },
  ]),
];
