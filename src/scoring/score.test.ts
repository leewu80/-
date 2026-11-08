import assert from 'node:assert/strict';
import { CHANNELS } from '../data/channels';
import { LISTINGS } from '../data/listings';
import {
  CONDITION_RANK,
  CONDITION_SCORE,
  buildSpecGroups,
  priceScoreWithinGroup,
  scoreListings,
  specKey,
} from './score';

assert.ok(LISTINGS.length >= 24, '演示样本至少 24 条');

const ids = new Set(LISTINGS.map((item) => item.id));
assert.equal(ids.size, LISTINGS.length, '样本编号不重复');

const channels = new Set(LISTINGS.map((item) => item.channel));
assert.equal(channels.size, CHANNELS.length);
for (const channel of CHANNELS) {
  assert.ok(channels.has(channel.id), channel.name);
}

const seen = new Set<string>();
for (const item of LISTINGS) {
  assert.match(item.linkUrl ?? '', /^https:\/\//, `${item.id} 应有可打开的 https 机型链接`);
  assert.equal(item.linkUrl?.includes(encodeURIComponent(item.model)), true, `${item.id} 链接应带上机型`);
  assert.equal(/https?:\/\//.test(`${item.note} ${item.seller}`), false);
  const token = `${specKey(item)}::${item.channel}`;
  assert.equal(seen.has(token), false, `同配置同渠道重复：${token}`);
  seen.add(token);
}

const coverage = new Map<string, Set<string>>();
for (const item of LISTINGS) {
  const key = specKey(item);
  const bucket = coverage.get(key) ?? new Set<string>();
  bucket.add(item.channel);
  coverage.set(key, bucket);
}
assert.ok(
  [...coverage.values()].some((bucket) => bucket.size === CHANNELS.length),
  '至少有一组配置覆盖全部渠道',
);
assert.ok(LISTINGS.some((item) => item.channel === 'hqb'), '应包含华强北市场报价');

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

const proGroup = LISTINGS.filter(
  (item) => item.model === 'MacBook Pro 14 英寸' && item.chipDetail === 'M3 Pro' && item.storageGb === 512,
);
assert.ok(proGroup.length >= 4);
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
