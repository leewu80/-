import { channelOf } from '../data/channels';
import { ReasonList } from './ReasonList';
import { ScoreRing } from './ScoreRing';
import { ModelLink } from './ModelLink';
import { formatCny, formatScore, formatStorage, specLine } from '../format';
import type { ScoredListing } from '../types';

interface DetailDrawerProps {
  item: ScoredListing | null;
  inPlan: boolean;
  onClose: () => void;
  onTogglePlan: (id: string) => void;
  onRemoveQuote: (id: string) => void;
}

export function DetailDrawer({ item, inPlan, onClose, onTogglePlan, onRemoveQuote }: DetailDrawerProps) {
  if (!item) {
    return null;
  }

  const { listing, score } = item;
  const channel = channelOf(listing.channel);

  return (
    <div className="drawer-root" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="icon-btn" onClick={onClose} aria-label="关闭明细">
          关闭
        </button>
        <p className="eyebrow">{channel.name}</p>
        <h2 id="detail-title">
          {listing.model} {listing.year}
        </h2>
        <p className="spec">{specLine(listing)}</p>
        <p className="price price-lg">{formatCny(listing.price)}</p>
        {listing.origin === 'quote' ? <p className="origin-tag">本场录入</p> : null}
        <div className="detail-actions">
          <button type="button" className="primary" onClick={() => onTogglePlan(listing.id)}>
            {inPlan ? '移出方案' : '纳入方案'}
          </button>
          {listing.origin === 'quote' ? (
            <button type="button" className="ghost" onClick={() => onRemoveQuote(listing.id)}>
              删除本场报价
            </button>
          ) : null}
        </div>
        <dl className="detail-grid">
          <div>
            <dt>机型</dt>
            <dd>
              {listing.series} · {listing.model}
            </dd>
          </div>
          <div>
            <dt>芯片</dt>
            <dd>
              {listing.chipDetail}
              {listing.chipDetail !== listing.chip ? `（${listing.chip}）` : ''}
            </dd>
          </div>
          <div>
            <dt>内存</dt>
            <dd>{listing.memoryGb}GB 统一内存</dd>
          </div>
          <div>
            <dt>存储</dt>
            <dd>{formatStorage(listing.storageGb)}</dd>
          </div>
          <div>
            <dt>显卡</dt>
            <dd>{listing.gpu}</dd>
          </div>
          <div>
            <dt>成新度</dt>
            <dd>{listing.condition}</dd>
          </div>
          <div>
            <dt>价格</dt>
            <dd>{formatCny(listing.price)}</dd>
          </div>
          <div>
            <dt>渠道</dt>
            <dd>{channel.name}</dd>
          </div>
          <div>
            <dt>卖家 / 主播</dt>
            <dd>{listing.seller}</dd>
          </div>
          <div>
            <dt>链接</dt>
            <dd>
              <ModelLink listing={listing} />
            </dd>
          </div>
          <div className="detail-wide">
            <dt>备注</dt>
            <dd>{listing.note}</dd>
          </div>
        </dl>
        <section className="score-block">
          <div className="score-head">
            <h3>打分拆解</h3>
            <ScoreRing value={score.total} />
          </div>
          <ScoreBar label="成新分" value={score.conditionScore} />
          <ScoreBar label="金额分" value={score.priceScore} />
          <p className="hint">
            同配置均价 {formatCny(score.groupAverage)} · 组内最低 {formatCny(score.groupMin)} · 综合{' '}
            {formatScore(score.total)}
          </p>
          <ReasonList reasons={score.reasons} />
        </section>
        <p className="sample-id">样本编号 {listing.id}</p>
      </aside>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="bar">
      <div className="bar-label">
        <span>{label}</span>
        <span>{formatScore(value)}</span>
      </div>
      <div className="bar-track">
        <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
