import assert from 'node:assert/strict';
import { LISTINGS } from './data/listings';
import { recommendWithinBudget, suggestConfig, valueSentence } from './recommend';

const needed: Array<[string, string]> = [
  ['MacBook Air 13 英寸', 'M1'],
  ['MacBook Air 13 英寸', 'M2'],
  ['MacBook Air 13 英寸', 'M3'],
  ['MacBook Air 13 英寸', 'M4'],
  ['MacBook Air 15 英寸', 'M2'],
  ['MacBook Air 15 英寸', 'M3'],
  ['MacBook Air 15 英寸', 'M4'],
  ['MacBook Pro 14 英寸', 'M1 Pro'],
  ['MacBook Pro 14 英寸', 'M1 Max'],
  ['MacBook Pro 14 英寸', 'M2 Pro'],
  ['MacBook Pro 14 英寸', 'M2 Max'],
  ['MacBook Pro 14 英寸', 'M3 Pro'],
  ['MacBook Pro 14 英寸', 'M3 Max'],
  ['MacBook Pro 14 英寸', 'M4 Pro'],
  ['MacBook Pro 14 英寸', 'M4 Max'],
  ['MacBook Pro 16 英寸', 'M1 Pro'],
  ['MacBook Pro 16 英寸', 'M1 Max'],
  ['MacBook Pro 16 英寸', 'M2 Pro'],
  ['MacBook Pro 16 英寸', 'M2 Max'],
  ['MacBook Pro 16 英寸', 'M3 Pro'],
  ['MacBook Pro 16 英寸', 'M3 Max'],
  ['MacBook Pro 16 英寸', 'M4 Pro'],
  ['MacBook Pro 16 英寸', 'M4 Max'],
];

for (const [model, chip] of needed) {
  assert.ok(
    LISTINGS.some((item) => item.model === model && item.chipDetail === chip),
    `缺少 ${model} ${chip}`,
  );
}

for (const channel of ['jd', 'web', 'live', 'xianyu', 'hqb'] as const) {
  assert.ok(LISTINGS.some((item) => item.channel === channel));
}

for (const budget of [8000, 12000]) {
  const picks = recommendWithinBudget(LISTINGS, budget, 'any');
  assert.ok(picks.length >= 1 && picks.length <= 3);
  for (const pick of picks) {
    assert.ok(pick.listing.price <= budget, `${pick.listing.id} 超出预算`);
    assert.match(pick.listing.linkUrl ?? '', /^https:\/\//);
    assert.ok(valueSentence(pick, budget).length > 8);
  }
  const advice = suggestConfig(LISTINGS, budget, 'any');
  assert.ok(advice, `预算 ${budget} 应有建议配置`);
  if (advice) {
    assert.match(advice.reason, /预算|GB|内存|剪辑|办公|屏幕|电池|风扇|导出/);
  }
}

const office = suggestConfig(LISTINGS, 8000, 'office');
const edit = suggestConfig(LISTINGS, 8000, 'edit');
assert.equal(office?.model.includes('Air'), true);
assert.equal(edit?.model.includes('Pro'), true);

const low = recommendWithinBudget(LISTINGS, 8000, 'any');
const high = recommendWithinBudget(LISTINGS, 12000, 'any');
assert.ok(high[0] && low[0]);
assert.ok(high[0].listing.price > low[0].listing.price);
assert.notEqual(high[0].listing.id, low[0].listing.id);
assert.ok(new Set(low.map((item) => item.listing.channel)).size >= 2);

if (process.env.PRINT_RANK === '1') {
  for (const budget of [8000, 12000]) {
    console.log(`BUDGET ${budget}`);
    for (const pick of recommendWithinBudget(LISTINGS, budget, 'any')) {
      console.log(
        [pick.listing.model, pick.listing.chipDetail, pick.listing.memoryGb, pick.listing.storageGb, pick.listing.condition, pick.listing.price, pick.listing.channel, pick.listing.linkUrl].join(' | '),
      );
    }
    const advice = suggestConfig(LISTINGS, budget, 'any');
    console.log('ADVICE', advice?.model, advice?.chipDetail, advice?.memoryGb, advice?.storageGb);
  }
}
