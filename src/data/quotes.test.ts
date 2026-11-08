import assert from 'node:assert/strict';
import { emptyQuoteDraft, mergeCatalog, quoteFromDraft } from './quotes';
import type { Listing } from '../types';

const draft = {
  ...emptyQuoteDraft(),
  seller: '闲鱼·测试',
  price: '8800',
  note: '当面看过机',
};

const created = quoteFromDraft(draft);
assert.equal(created.ok, true);
if (created.ok) {
  assert.equal(created.listing.origin, 'quote');
  assert.equal(created.listing.price, 8800);
  assert.equal(created.listing.linkUrl, undefined);
  assert.equal(created.listing.seller, '闲鱼·测试');
}

assert.equal(quoteFromDraft({ ...draft, seller: '  ' }).ok, false);
assert.equal(quoteFromDraft({ ...draft, linkUrl: 'javascript:alert(1)' }).ok, false);

const linked = quoteFromDraft({ ...draft, linkUrl: 'https://example.com/mac' });
assert.equal(linked.ok, true);
if (linked.ok) {
  assert.equal(linked.listing.linkUrl, 'https://example.com/mac');
}

const sample = { id: 'sample-1', origin: 'sample' } as Listing;
const quote = { id: 'sample-1', origin: 'quote' } as Listing;
const extra = { id: 'quote-2', origin: 'quote' } as Listing;
const merged = mergeCatalog([sample], [quote, extra]);
assert.deepEqual(
  merged.map((item) => item.id),
  ['sample-1', 'quote-2'],
);
assert.equal(merged[0]?.origin, 'sample');
