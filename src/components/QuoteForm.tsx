import { useEffect, useState } from 'react';
import { CHANNELS } from '../data/channels';
import { GPU_PRESETS, MODEL_PRESETS, emptyQuoteDraft, quoteFromDraft, type QuoteDraft } from '../data/quotes';
import { CHIP_OPTIONS, SERIES_OPTIONS } from '../filters';
import { CONDITION_RANK } from '../scoring/score';
import type { Listing } from '../types';

interface QuoteFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (listing: Listing) => void;
}

export function QuoteForm({ open, onClose, onSave }: QuoteFormProps) {
  const [draft, setDraft] = useState<QuoteDraft>(emptyQuoteDraft);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function update(patch: Partial<QuoteDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function submit() {
    const result = quoteFromDraft(draft);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSave(result.listing);
    setDraft(emptyQuoteDraft());
    setError(null);
  }

  return (
    <div className="drawer-root" onClick={onClose}>
      <form
        className="drawer quote-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <button type="button" className="icon-btn" onClick={onClose}>
          关闭
        </button>
        <p className="eyebrow">本场报价</p>
        <h2 id="quote-title">录入一条挂牌</h2>
        <p className="hint">会按现有规则参与筛选、多渠道对比和打分，并保存在这台浏览器里。链接可以留空。</p>
        <div className="form-grid">
          <label>
            系列
            <select value={draft.series} onChange={(event) => update({ series: event.target.value as QuoteDraft['series'] })}>
              {SERIES_OPTIONS.map((series) => (
                <option key={series} value={series}>
                  {series}
                </option>
              ))}
            </select>
          </label>
          <label>
            机型
            <input list="model-presets" value={draft.model} onChange={(event) => update({ model: event.target.value })} />
            <datalist id="model-presets">
              {MODEL_PRESETS.map((model) => (
                <option key={model} value={model} />
              ))}
            </datalist>
          </label>
          <label>
            年份
            <input inputMode="numeric" value={draft.year} onChange={(event) => update({ year: event.target.value })} />
          </label>
          <label>
            芯片
            <select
              value={draft.chip}
              onChange={(event) => {
                const chip = event.target.value as QuoteDraft['chip'];
                update({ chip, chipDetail: draft.chipDetail === draft.chip ? chip : draft.chipDetail });
              }}
            >
              {CHIP_OPTIONS.map((chip) => (
                <option key={chip} value={chip}>
                  {chip}
                </option>
              ))}
            </select>
          </label>
          <label>
            芯片明细
            <input
              value={draft.chipDetail}
              placeholder="如 M3 Pro"
              onChange={(event) => update({ chipDetail: event.target.value })}
            />
          </label>
          <label>
            内存 GB
            <input inputMode="numeric" value={draft.memoryGb} onChange={(event) => update({ memoryGb: event.target.value })} />
          </label>
          <label>
            存储 GB
            <input
              inputMode="numeric"
              value={draft.storageGb}
              placeholder="1024 表示 1TB"
              onChange={(event) => update({ storageGb: event.target.value })}
            />
          </label>
          <label>
            显卡
            <input list="gpu-presets" value={draft.gpu} onChange={(event) => update({ gpu: event.target.value })} />
            <datalist id="gpu-presets">
              {GPU_PRESETS.map((gpu) => (
                <option key={gpu} value={gpu} />
              ))}
            </datalist>
          </label>
          <label>
            成新度
            <select
              value={draft.condition}
              onChange={(event) => update({ condition: event.target.value as QuoteDraft['condition'] })}
            >
              {CONDITION_RANK.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </label>
          <label>
            价格（元）
            <input inputMode="numeric" value={draft.price} onChange={(event) => update({ price: event.target.value })} />
          </label>
          <label>
            渠道
            <select
              value={draft.channel}
              onChange={(event) => update({ channel: event.target.value as QuoteDraft['channel'] })}
            >
              {CHANNELS.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            卖家 / 主播
            <input value={draft.seller} onChange={(event) => update({ seller: event.target.value })} />
          </label>
          <label className="form-wide">
            链接（可空）
            <input
              value={draft.linkUrl}
              placeholder="留空则只显示占位，不生成跳转"
              onChange={(event) => update({ linkUrl: event.target.value })}
            />
          </label>
          <label className="form-wide">
            备注
            <input value={draft.note} onChange={(event) => update({ note: event.target.value })} />
          </label>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="detail-actions">
          <button type="submit" className="primary">
            加入比价
          </button>
          <button type="button" className="ghost" onClick={onClose}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
