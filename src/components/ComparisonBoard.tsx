import { CHANNELS } from '../data/channels';
import { ChannelBadge } from './ChannelBadge';
import { cx, formatCny, formatScore, specLine } from '../format';
import type { SpecGroup } from '../scoring/score';

interface ComparisonBoardProps {
  groups: SpecGroup[];
  active: SpecGroup | null;
  onSelect: (specKey: string) => void;
  onOpen: (id: string) => void;
}

export function ComparisonBoard({ groups, active, onSelect, onOpen }: ComparisonBoardProps) {
  return (
    <section id="compare" className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">多端并排</p>
          <h2>同配置跨渠道</h2>
        </div>
        <p className="hint">
          对比列固定为{CHANNELS.map((channel) => channel.shortName).join('、')}。空列表示当前筛选下这一家没有同款。
        </p>
      </div>
      {groups.length === 0 || !active ? (
        <p className="empty">没有可对比的配置。</p>
      ) : (
        <>
          <div className="spec-scroller" role="tablist" aria-label="配置组">
            {groups.map((group) => {
              const listing = group.best.listing;
              const selected = group.specKey === active.specKey;
              return (
                <button
                  key={group.specKey}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={cx('spec-pill', selected && 'spec-pill-on')}
                  onClick={() => onSelect(group.specKey)}
                >
                  <strong>
                    {listing.model.replace('MacBook ', '')} · {listing.chipDetail}
                  </strong>
                  <span>
                    {listing.memoryGb}GB / {listing.storageGb >= 1024 ? `${listing.storageGb / 1024}TB` : `${listing.storageGb}GB`} · {listing.gpu}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="compare-meta">
            <p>
              {active.best.listing.model} {active.best.listing.year} · {specLine(active.best.listing)}
            </p>
            <p>同配置均价 {formatCny(active.best.score.groupAverage)} · 当前 {active.items.length} 条</p>
          </div>
          <div className="compare-scroll">
            <div className="compare-grid">
              {CHANNELS.map((channel) => {
                const rows = active.items.filter((item) => item.listing.channel === channel.id);
                return (
                  <section key={channel.id} className={`compare-col channel-${channel.id}`}>
                    <header>
                      <ChannelBadge id={channel.id} />
                      <h3>{channel.name}</h3>
                      <p>{channel.description}</p>
                    </header>
                    {rows.length === 0 ? (
                      <p className="empty-col">当前筛选下没有同配置</p>
                    ) : (
                      rows.map((item) => {
                        const best = item.listing.id === active.best.listing.id;
                        return (
                          <article key={item.listing.id} className={cx('offer', best && 'offer-best')}>
                            {best ? <span className="ribbon">本组最优</span> : null}
                            <p className="cond-pill">
                              {item.listing.condition}
                              {item.listing.origin === 'quote' ? ' · 本场' : ''}
                            </p>
                            <p className="price">{formatCny(item.listing.price)}</p>
                            <p className="seller">{item.listing.seller}</p>
                            <p className="offer-score">综合 {formatScore(item.score.total)}</p>
                            <button type="button" className="ghost" onClick={() => onOpen(item.listing.id)}>
                              明细
                            </button>
                          </article>
                        );
                      })
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
