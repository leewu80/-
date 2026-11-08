import { useEffect } from 'react';
import { channelOf } from '../data/channels';
import { ReasonList } from './ReasonList';
import { formatCny, specLine } from '../format';
import { weightShare } from '../scoring/score';
import type { ScoreWeights, ScoredListing } from '../types';

interface PlanSheetProps {
  open: boolean;
  items: ScoredListing[];
  weights: ScoreWeights;
  onClose: () => void;
  onFillTop: () => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

export function PlanSheet({ open, items, weights, onClose, onFillTop, onClear, onRemove }: PlanSheetProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const share = weightShare(weights);
  const today = new Date().toLocaleDateString('zh-CN');

  return (
    <div className="drawer-root plan-root" onClick={onClose}>
      <section
        className="plan-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="plan-toolbar no-print">
          <button type="button" className="icon-btn" onClick={onClose}>
            关闭
          </button>
          <button type="button" className="ghost" onClick={onFillTop}>
            用当前推荐填入
          </button>
          <button type="button" className="ghost" onClick={onClear} disabled={items.length === 0}>
            清空
          </button>
          <button type="button" className="primary" onClick={() => window.print()} disabled={items.length === 0}>
            打印方案
          </button>
        </div>
        <p className="eyebrow">给客户</p>
        <h2 id="plan-title">果择方案</h2>
        <p className="hint">
          {today} · 综合分按成新度 {share.condition}%、金额 {share.price}% 。同一配置之间比价格，再和成新度合在一起。
        </p>
        {items.length === 0 ? (
          <p className="empty">方案还是空的。可以按当前推荐填入，或在推荐卡、明细里逐条纳入，最多 3 条。</p>
        ) : (
          <ol className="plan-list">
            {items.map((item, index) => {
              const channel = channelOf(item.listing.channel);
              return (
                <li key={item.listing.id}>
                  <header>
                    <strong>
                      {index + 1}. {item.listing.model} {item.listing.year}
                    </strong>
                    <button type="button" className="text-btn no-print" onClick={() => onRemove(item.listing.id)}>
                      移出
                    </button>
                  </header>
                  <p>{specLine(item.listing)}</p>
                  <p className="plan-price">
                    {formatCny(item.listing.price)} · {item.listing.condition} · {channel.name} · {item.listing.seller}
                  </p>
                  <ReasonList reasons={item.score.reasons} />
                  {item.listing.note ? <p className="hint">备注：{item.listing.note}</p> : null}
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
