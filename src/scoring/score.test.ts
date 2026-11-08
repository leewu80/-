import assert from 'node:assert/strict';
import { LISTINGS } from '../data/listings';
import {
  CONDITION_RANK,
  CONDITION_SCORE,
  buildSpecGroups,
  priceScoreWithinGroup,
  scoreListings,
} from './score';
import type { Listing } from '../types';

assert.ok(LISTINGS.length >= 24, '在售清单至少 24 条');
assert.ok(LISTINGS.some((item) => item.chip === 'M5'), '应包含 M5');
assert.equal(LISTINGS.some((item) => item.seller.includes('华强北')), false);

const ids = new Set(LISTINGS.map((item) => item.id));
assert.equal(ids.size, LISTINGS.length, '样本编号不重复');

for (const item of LISTINGS) {
  assert.match(item.linkUrl ?? '', /^https:\/\/www\.apple\.com\.cn\/shop\/product\//, `${item.id} 应是苹果商品页`);
  assert.equal(/https?:\/\//.test(`${item.note} ${item.seller}`), false);
  assert.ok(item.price > 0);
}

for (let index = 1; index < CONDITION_RANK.length; index += 1) {
  const higher = CONDITION_RANK[index - 1];
  const lower = CONDITION_RANK[index];
  assert.ok(higher && lower);
  assert.ok(CONDITION_SCORE[higher] > CONDITION_SCORE[lower]);
}

const alone = priceScoreWithinGroup(8000, [8000]);
assert.equal(alone.score, 50);

const compared = priceScoreWithinGroup(80, [100, 80]);
const expensive = priceScoreWithinGroup(100, [100, 80]);
assert.ok(compared.score > expensive.score);

const balanced = scoreListings(LISTINGS, { condition: 50, price: 50 });
assert.equal(balanced.length, LISTINGS.length);
assert.ok(balanced[0] && balanced[1]);
assert.ok(balanced[0].score.total >= balanced[1].score.total);
assert.match(balanced[0].score.reasons.join('\n'), /成新度/);
assert.match(balanced[0].score.reasons.join('\n'), /综合分/);
assert.match(balanced[0].score.reasons.join('\n'), /均价/);

const fixture = (partial: Pick<Listing, 'id' | 'condition' | 'price' | 'channel'>): Listing => ({
  series: 'Pro',
  model: 'MacBook Pro 14 英寸',
  year: 2023,
  chip: 'M3',
  chipDetail: 'M3 Pro',
  memoryGb: 18,
  storageGb: 512,
  gpu: '18 核 GPU',
  seller: '测试',
  note: '测试',
  ...partial,
});
const proGroup = [
  fixture({ id: 'a', condition: '官翻', price: 13200, channel: 'jd' }),
  fixture({ id: 'b', condition: '99新', price: 12800, channel: 'live' }),
  fixture({ id: 'c', condition: '95新', price: 12000, channel: 'web' }),
  fixture({ id: 'd', condition: '8成新', price: 9999, channel: 'xianyu' }),
];
const priceHeavy = scoreListings(proGroup, { condition: 30, price: 70 });
const conditionHeavy = scoreListings(proGroup, { condition: 70, price: 30 });
assert.equal(priceHeavy[0]?.listing.condition, '8成新');
assert.equal(conditionHeavy[0]?.listing.condition, '官翻');

const groups = buildSpecGroups(balanced);
assert.ok(groups.length >= 8);
assert.equal(groups[0]?.best.listing.id, balanced[0]?.listing.id);

if (process.env.PRINT_RANK === '1') {
  const printTop = (title: string, rows: ReturnType<typeof scoreListings>) => {
    console.log(title);
    for (const row of rows.slice(0, 3)) {
      console.log(
        [
          row.listing.id,
          row.listing.seller,
          row.listing.condition,
          row.listing.price,
          row.score.total.toFixed(2),
          row.score.reasons.join(' / '),
        ].join(' | '),
      );
    }
  };
  printTop('BALANCED', balanced);
  printTop('CONDITION', scoreListings(LISTINGS, { condition: 70, price: 30 }));
  printTop('PRICE', scoreListings(LISTINGS, { condition: 30, price: 70 }));
}
