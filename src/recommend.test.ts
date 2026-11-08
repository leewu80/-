import assert from 'node:assert/strict';
import { LISTINGS } from './data/listings';
import { listingsForConfig, recommendWithinBudget, suggestConfig, valueSentence } from './recommend';

assert.ok(LISTINGS.some((item) => item.model === 'MacBook Air 13 英寸' && item.chipDetail === 'M5'));
assert.ok(LISTINGS.some((item) => item.model === 'MacBook Air 15 英寸' && item.chipDetail === 'M5'));
assert.ok(LISTINGS.some((item) => item.model === 'MacBook Pro 14 英寸' && item.chipDetail === 'M5'));
assert.ok(LISTINGS.some((item) => item.chipDetail === 'M5 Pro'));
assert.equal(LISTINGS.some((item) => (item.linkUrl ?? '').includes('goofish.com')), false);

for (const budget of [8000, 12000]) {
  const picks = recommendWithinBudget(LISTINGS, budget, 'any');
  assert.ok(picks.length >= 1 && picks.length <= 3);
  for (const pick of picks) {
    assert.ok(pick.listing.price <= budget, `${pick.listing.id} 超出预算`);
    assert.match(pick.listing.linkUrl ?? '', /^https:\/\/www\.apple\.com\.cn\/shop\/product\//);
    assert.ok(valueSentence(pick, budget).length > 8);
  }
  const advice = suggestConfig(LISTINGS, budget, 'any');
  assert.ok(advice, `预算 ${budget} 应有建议配置`);
  if (advice) {
    const matches = listingsForConfig(LISTINGS, advice, budget);
    assert.ok(matches.length >= 1);
    for (const item of matches) {
      assert.match(item.linkUrl ?? '', /apple\.com\.cn\/shop\/product/);
    }
  }
}

const low = recommendWithinBudget(LISTINGS, 8000, 'any');
const high = recommendWithinBudget(LISTINGS, 12000, 'any');
assert.ok(high[0] && low[0]);
assert.ok(high[0].listing.price > low[0].listing.price);
assert.ok(high.some((item) => item.listing.chip === 'M5'));

if (process.env.PRINT_RANK === '1') {
  for (const budget of [8000, 12000]) {
    console.log(`BUDGET ${budget}`);
    for (const pick of recommendWithinBudget(LISTINGS, budget, 'any')) {
      console.log(
        [pick.listing.model, pick.listing.chipDetail, pick.listing.memoryGb, pick.listing.storageGb, pick.listing.price, pick.listing.linkUrl].join(' | '),
      );
    }
    const advice = suggestConfig(LISTINGS, budget, 'any');
    console.log('ADVICE', advice?.model, advice?.chipDetail, advice?.memoryGb, advice?.storageGb);
  }
}
