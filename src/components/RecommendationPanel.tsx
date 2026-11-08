import { ChannelBadge } from './ChannelBadge';
import { ModelLink } from './ModelLink';
import { ReasonList } from './ReasonList';
import { ScoreRing } from './ScoreRing';
import { cx, formatCny, priceDelta, specLine } from '../format';
import type { ScoredListing } from '../types';

interface RecommendationPanelProps {
  items: ScoredListing[];
  planIds: string[];
  onCompare: (specKey: string) => void;
  onOpen: (id: string) => void;
  onTogglePlan: (id: string) => void;
}

const RANK_LABEL = ['最优', '次选', '备选'];

export function RecommendationPanel({ items, planIds, onCompare, onOpen, onTogglePlan }: RecommendationPanelProps) {
  return (
    <section id="recommend" className="section">
      <div className="section-head">
        <div>
          <p className="eyebrow">最优推荐</p>
          <h2>综合成新度与金额的前 {Math.min(3, items.length) || 3} 条</h2>
        </div>
        <p className="hint">默认成新、金额各占一半。拖动上面的权重，名次会马上重排。</p>
      </div>
      {items.length === 0 ? (
        <p className="empty">没有命中的机器。放宽筛选后再看推荐。</p>
      ) : (
        <div className="rec-grid">
          {items.map((item, index) => {
            const delta = priceDelta(item.score.cheaperThanAverage);
            return (
              <article key={item.listing.id} className={cx('rec', index === 0 && 'rec-lead')} data-rank={index + 1}>
                <header className="rec-top">
                  <span className="rank">0{index + 1}</span>
                  <ChannelBadge id={item.listing.channel} />
                  <span className="cond-pill">{item.listing.condition}</span>
                  {index === 0 ? <span className="ribbon">{RANK_LABEL[0]}</span> : <span className="ribbon quiet">{RANK_LABEL[index]}</span>}
                </header>
                <h3>
                  {item.listing.model}
                  <small> {item.listing.year}</small>
                </h3>
                <p className="spec">{specLine(item.listing)}</p>
                <p className="price">{formatCny(item.listing.price)}</p>
                <p className={cx('delta', `delta-${delta.tone}`)}>{delta.text}</p>
                <p className="seller">{item.listing.seller}</p>
                <ReasonList reasons={item.score.reasons} />
                <footer className="rec-foot">
                  <ScoreRing value={item.score.total} />
                  <div className="rec-actions">
                    <button type="button" className="primary" onClick={() => onCompare(item.specKey)}>
                      看同配置对比
                    </button>
                    <ModelLink listing={item.listing} />
                    <button type="button" className="ghost" onClick={() => onOpen(item.listing.id)}>
                      看明细
                    </button>
                    <button type="button" className="ghost" onClick={() => onTogglePlan(item.listing.id)}>
                      {planIds.includes(item.listing.id) ? '移出方案' : '纳入方案'}
                    </button>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
