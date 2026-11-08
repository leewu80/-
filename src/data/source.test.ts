import assert from 'node:assert/strict';
import { parseListings } from './source';

const valid = {
  id: 'demo-1',
  series: 'Air',
  model: 'MacBook Air 13 英寸',
  year: 2024,
  chip: 'M3',
  chipDetail: 'M3',
  memoryGb: 16,
  storageGb: 512,
  gpu: '10 核 GPU',
  condition: '95新',
  price: 8000,
  channel: 'web',
  seller: '示例卖家',
  note: '可解析的示例',
};

const parsed = parseListings([valid]);
assert.equal(parsed.length, 1);
assert.equal(parsed[0]?.linkUrl, undefined);
assert.equal(parsed[0]?.price, 8000);

const withLink = parseListings([{ ...valid, id: 'demo-2', linkUrl: 'https://example.com/item' }]);
assert.equal(withLink[0]?.linkUrl, 'https://example.com/item');

assert.throws(() => parseListings([{ ...valid, linkUrl: 'javascript:alert(1)' }]), /linkUrl/);
assert.throws(() => parseListings([{ ...valid, channel: 'taobao' }]), /channel/);
assert.throws(() => parseListings({ items: [] }), /数组/);
