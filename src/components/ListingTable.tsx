import { ChannelBadge } from './ChannelBadge';
import { cx, formatCny, formatScore, specLine } from '../format';
import type { SortKey } from '../useCompare';
import type { ScoredListing } from '../types';

interface ListingTableProps {
  items: ScoredListing[];
  sortKey: SortKey;
  selectedId: string | null;
  onSort: (sortKey: SortKey) => void;
  onOpen: (id: string) => void;
}

const SORTS: Array<{ id: SortKey; label: string }> = [
  { id: 'score', label: '综合分' },
  { id: 'price', label: '价格从低到高' },
  { id: 'condition', label: '成新度' },
];

export function ListingTable({ items, sortKey, selectedId, onSort, onOpen }: ListingTableProps) {
  return (
    <section id="listings" className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">在售明细</p>
          <h2>命中 {items.length} 条</h2>
        </div>
        <div className="preset-row" role="group" aria-label="排序">
          {SORTS.map((sort) => (
            <button
              key={sort.id}
              type="button"
              className={cx('chip', sortKey === sort.id && 'chip-on')}
              aria-pressed={sortKey === sort.id}
              onClick={() => onSort(sort.id)}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>
      {items.length === 0 ? (
        <p className="empty">没有符合条件的挂牌。</p>
      ) : (
        <div className="table-scroll">
          <div className="list" role="table">
            <div className="list-head" role="row">
              <span>机型 / 配置</span>
              <span>成新度</span>
              <span>价格</span>
              <span>渠道</span>
              <span>卖家 / 主播</span>
              <span>综合分</span>
              <span />
            </div>
            {items.map((item) => {
              const selected = item.listing.id === selectedId;
              return (
                <button
                  key={item.listing.id}
                  type="button"
                  role="row"
                  className={cx('list-row', selected && 'list-row-on')}
                  onClick={() => onOpen(item.listing.id)}
                >
                  <span className="cell-model">
                    <strong>
                      {item.listing.model} {item.listing.year}
                    </strong>
                    <small>{specLine(item.listing)}</small>
                  </span>
                  <span>{item.listing.condition}</span>
                  <span className="cell-price">{formatCny(item.listing.price)}</span>
                  <span>
                    <ChannelBadge id={item.listing.channel} />
                  </span>
                  <span>{item.listing.seller}</span>
                  <span className="cell-score">{formatScore(item.score.total)}</span>
                  <span className="cell-go">明细</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
