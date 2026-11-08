import type { ReactNode } from 'react';
import { CHANNELS } from '../data/channels';
import { CHIP_OPTIONS, EMPTY_FILTERS, SERIES_OPTIONS, countActiveFilters } from '../filters';
import { formatStorage, cx } from '../format';
import { CONDITION_RANK } from '../scoring/score';
import type { Filters } from '../types';

interface FilterOptions {
  memories: number[];
  storages: number[];
  gpus: string[];
}

interface FilterBarProps {
  filters: Filters;
  options: FilterOptions;
  matched: number;
  rangeError: string | null;
  onChange: (next: Filters) => void;
}

const QUICK_PRICES = [
  { label: '不限', min: '', max: '' },
  { label: '5 千内', min: '', max: '5000' },
  { label: '5 千–1 万', min: '5000', max: '10000' },
  { label: '1 万以上', min: '10000', max: '' },
];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function FilterBar({ filters, options, matched, rangeError, onChange }: FilterBarProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <aside className="filters" aria-label="筛选条件">
      <div className="filters-head">
        <div>
          <p className="eyebrow">筛选</p>
          <h2>条件</h2>
        </div>
        <button type="button" className="text-btn" onClick={() => onChange(EMPTY_FILTERS)} disabled={activeCount === 0}>
          重置{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
      </div>
      <p className="hint">不选就是不限。当前命中 {matched} 条，对比和推荐都跟着这份结果走。</p>

      <FilterGroup label="机型系列">
        {SERIES_OPTIONS.map((series) => (
          <button
            key={series}
            type="button"
            className={cx('chip', filters.series.includes(series) && 'chip-on')}
            aria-pressed={filters.series.includes(series)}
            onClick={() => onChange({ ...filters, series: toggle(filters.series, series) })}
          >
            {series}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup label="芯片">
        {CHIP_OPTIONS.map((chip) => (
          <button
            key={chip}
            type="button"
            className={cx('chip', filters.chips.includes(chip) && 'chip-on')}
            aria-pressed={filters.chips.includes(chip)}
            onClick={() => onChange({ ...filters, chips: toggle(filters.chips, chip) })}
          >
            {chip}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup label="内存">
        {options.memories.map((memory) => (
          <button
            key={memory}
            type="button"
            className={cx('chip', filters.memories.includes(memory) && 'chip-on')}
            aria-pressed={filters.memories.includes(memory)}
            onClick={() => onChange({ ...filters, memories: toggle(filters.memories, memory) })}
          >
            {memory}GB
          </button>
        ))}
      </FilterGroup>

      <FilterGroup label="存储">
        {options.storages.map((storage) => (
          <button
            key={storage}
            type="button"
            className={cx('chip', filters.storages.includes(storage) && 'chip-on')}
            aria-pressed={filters.storages.includes(storage)}
            onClick={() => onChange({ ...filters, storages: toggle(filters.storages, storage) })}
          >
            {formatStorage(storage)}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup label="显卡">
        {options.gpus.map((gpu) => (
          <button
            key={gpu}
            type="button"
            className={cx('chip', filters.gpus.includes(gpu) && 'chip-on')}
            aria-pressed={filters.gpus.includes(gpu)}
            onClick={() => onChange({ ...filters, gpus: toggle(filters.gpus, gpu) })}
          >
            {gpu}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup label="成新度">
        {CONDITION_RANK.map((condition) => (
          <button
            key={condition}
            type="button"
            className={cx('chip', filters.conditions.includes(condition) && 'chip-on')}
            aria-pressed={filters.conditions.includes(condition)}
            onClick={() => onChange({ ...filters, conditions: toggle(filters.conditions, condition) })}
          >
            {condition}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup label="来源渠道">
        {CHANNELS.map((channel) => (
          <button
            key={channel.id}
            type="button"
            className={cx('chip', 'chip-channel', `channel-${channel.id}`, filters.channels.includes(channel.id) && 'chip-on')}
            aria-pressed={filters.channels.includes(channel.id)}
            onClick={() => onChange({ ...filters, channels: toggle(filters.channels, channel.id) })}
          >
            {channel.shortName}
          </button>
        ))}
      </FilterGroup>

      <div className="filter-block">
        <span className="filter-label">价格区间</span>
        <div className="price-row">
          <label>
            <span className="sr-only">最低价</span>
            <input
              inputMode="numeric"
              placeholder="最低"
              value={filters.priceMin}
              onChange={(event) => onChange({ ...filters, priceMin: event.target.value })}
              onWheel={(event) => event.currentTarget.blur()}
            />
          </label>
          <span className="price-dash">–</span>
          <label>
            <span className="sr-only">最高价</span>
            <input
              inputMode="numeric"
              placeholder="最高"
              value={filters.priceMax}
              onChange={(event) => onChange({ ...filters, priceMax: event.target.value })}
              onWheel={(event) => event.currentTarget.blur()}
            />
          </label>
        </div>
        <div className="chip-row">
          {QUICK_PRICES.map((preset) => {
            const on = filters.priceMin === preset.min && filters.priceMax === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                className={cx('chip', on && 'chip-on')}
                aria-pressed={on}
                onClick={() => onChange({ ...filters, priceMin: preset.min, priceMax: preset.max })}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        {rangeError ? <p className="form-error">{rangeError}</p> : null}
      </div>

      <div className="filter-block">
        <label className="filter-label" htmlFor="keyword">
          关键词
        </label>
        <input
          id="keyword"
          placeholder="机型、卖家、备注"
          value={filters.keyword}
          onChange={(event) => onChange({ ...filters, keyword: event.target.value })}
        />
      </div>
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="filter-block">
      <span className="filter-label">{label}</span>
      <div className="chip-row">{children}</div>
    </div>
  );
}
