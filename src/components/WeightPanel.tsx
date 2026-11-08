import { cx, formatScore } from '../format';
import { CONDITION_RANK, CONDITION_SCORE, DEFAULT_WEIGHTS, weightShare } from '../scoring/score';
import type { ScoreWeights, ScoredListing } from '../types';

const PRESETS: Array<{ id: string; label: string; weights: ScoreWeights }> = [
  { id: 'balance', label: '均衡', weights: { condition: 50, price: 50 } },
  { id: 'price', label: '更看金额', weights: { condition: 30, price: 70 } },
  { id: 'condition', label: '更看成新', weights: { condition: 70, price: 30 } },
];

interface WeightPanelProps {
  weights: ScoreWeights;
  leader: ScoredListing | undefined;
  onChange: (weights: ScoreWeights) => void;
}

export function WeightPanel({ weights, leader, onChange }: WeightPanelProps) {
  const share = weightShare(weights);
  const activePreset = PRESETS.find(
    (preset) => preset.weights.condition === weights.condition && preset.weights.price === weights.price,
  );

  return (
    <section className="weight-panel" aria-label="打分权重">
      <div className="weight-copy">
        <p className="eyebrow">打分</p>
        <h2>成新度 × 金额</h2>
        <p className="hint">
          综合分 = 成新分 × {share.condition}% + 金额分 × {share.price}%。金额分只和同配置比，比均价便宜得高分。
        </p>
      </div>
      <div className="weight-controls">
        <div className="preset-row">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={cx('chip', activePreset?.id === preset.id && 'chip-on')}
              aria-pressed={activePreset?.id === preset.id}
              onClick={() => onChange(preset.weights)}
            >
              {preset.label}
            </button>
          ))}
          <button type="button" className="text-btn" onClick={() => onChange(DEFAULT_WEIGHTS)}>
            恢复均衡
          </button>
        </div>
        <label className="slider">
          <span>成新度 {weights.condition}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={weights.condition}
            aria-label="成新度权重"
            onChange={(event) => onChange({ ...weights, condition: Number(event.target.value) })}
          />
        </label>
        <label className="slider">
          <span>金额 {weights.price}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={weights.price}
            aria-label="金额权重"
            onChange={(event) => onChange({ ...weights, price: Number(event.target.value) })}
          />
        </label>
      </div>
      <p className="legend">
        {CONDITION_RANK.map((condition) => `${condition} ${CONDITION_SCORE[condition]}`).join(' · ')}
      </p>
      <p className="live-hint" aria-live="polite">
        {leader
          ? `当前综合第一：${leader.listing.model} ${leader.listing.year} · ${leader.listing.seller} · ${formatScore(leader.score.total)} 分`
          : '当前没有可推荐的机器'}
      </p>
    </section>
  );
}
