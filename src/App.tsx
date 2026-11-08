import { useEffect, useMemo, useState } from 'react';
import { ChannelBadge } from './components/ChannelBadge';
import { ComparisonBoard } from './components/ComparisonBoard';
import { DetailDrawer } from './components/DetailDrawer';
import { FilterBar } from './components/FilterBar';
import { ListingTable } from './components/ListingTable';
import { ModelLink } from './components/ModelLink';
import { PlanSheet } from './components/PlanSheet';
import { QuoteForm } from './components/QuoteForm';
import { WeightPanel } from './components/WeightPanel';
import { LISTINGS } from './data/listings';
import { applyFilters } from './filters';
import { formatCny, formatStorage, specLine } from './format';
import {
  USE_CASES,
  listingsForConfig,
  recommendWithinBudget,
  suggestConfig,
  valueSentence,
  type UseCase,
} from './recommend';
import { useCompare } from './useCompare';
import type { Listing } from './types';

const PRESETS = [6000, 8000, 12000, 16000, 20000];

export default function App() {
  const state = useCompare();
  const [budgetText, setBudgetText] = useState('8000');
  const [useCase, setUseCase] = useState<UseCase>('any');
  const [asked, setAsked] = useState<{ budget: number; useCase: UseCase }>({ budget: 8000, useCase: 'any' });
  const [formError, setFormError] = useState<string | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const locked = Boolean(state.selected) || quoteOpen || planOpen;
    document.body.classList.toggle('drawer-open', locked);
    return () => document.body.classList.remove('drawer-open');
  }, [state.selected, quoteOpen, planOpen]);

  const catalog = state.catalog.length > 0 ? state.catalog : LISTINGS;
  const picks = useMemo(
    () => recommendWithinBudget(catalog, asked.budget, asked.useCase, state.weights),
    [catalog, asked, state.weights],
  );
  const advice = useMemo(
    () => suggestConfig(catalog, asked.budget, asked.useCase),
    [catalog, asked],
  );
  const adviceListings = useMemo(
    () => (advice ? listingsForConfig(catalog, advice, asked.budget) : []),
    [advice, catalog, asked.budget],
  );

  function recommend(nextBudget = budgetText, nextUse = useCase) {
    const budget = Number(String(nextBudget).replace(/[^\d.]/g, ''));
    if (!Number.isFinite(budget) || budget < 1000) {
      setFormError('请填一个不少于 1000 的预算，例如 8000。');
      return;
    }
    setFormError(null);
    setBudgetText(String(Math.round(budget)));
    setAsked({ budget: Math.round(budget), useCase: nextUse });
  }

  function saveQuote(listing: Listing) {
    state.addQuote(listing);
    setQuoteOpen(false);
    const visible = applyFilters([listing], state.filters).length === 1;
    setNotice(visible ? '已加入比价，并按当前权重重新打分。' : '已加入比价。当前筛选把它挡住了，重置筛选后就能看到。');
  }

  function togglePlan(id: string) {
    const result = state.togglePlan(id);
    setNotice(result === 'full' ? '方案最多放 3 条。先移出一条，再加入新的。' : null);
  }

  return (
    <div className="page">
      <a className="skip" href="#result">
        跳到推荐结果
      </a>
      <header className="hero">
        <p className="eyebrow">果择</p>
        <h1>按预算挑一台二手 Mac</h1>
        <ol className="steps">
          <li>① 填预算</li>
          <li>② 点推荐</li>
          <li>③ 点链接去买</li>
        </ol>
      </header>

      <form
        className="ask"
        onSubmit={(event) => {
          event.preventDefault();
          recommend();
        }}
      >
        <label className="budget-field">
          <span>预算（元）</span>
          <input
            inputMode="numeric"
            value={budgetText}
            onChange={(event) => setBudgetText(event.target.value)}
            aria-label="预算"
          />
        </label>
        <div className="preset-row">
          {PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              className={asked.budget === value ? 'chip on' : 'chip'}
              onClick={() => {
                setBudgetText(String(value));
                recommend(String(value), useCase);
              }}
            >
              {value.toLocaleString('zh-CN')}
            </button>
          ))}
        </div>
        <div className="use-row" role="group" aria-label="用途">
          {USE_CASES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={useCase === item.id ? 'chip on' : 'chip'}
              onClick={() => {
                setUseCase(item.id);
                recommend(budgetText, item.id);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button className="recommend-btn" type="submit">
          推荐
        </button>
        {formError ? <p className="form-error">{formError}</p> : null}
      </form>

      <main id="result">
        <section>
          <h2>预算 {asked.budget.toLocaleString('zh-CN')} 元里的最优方案</h2>
          <p className="lead">只看价格不超过预算的挂牌，再按成新度和价格打分，给出 1～3 条。</p>
          {picks.length === 0 ? (
            <p className="empty">这个预算下没有挂牌。把预算调高一点再点推荐。</p>
          ) : (
            <ol className="pick-list">
              {picks.map((item, index) => (
                <li key={item.listing.id} className="pick-card">
                  <div className="pick-rank">方案 {index + 1}</div>
                  <h3>
                    {item.listing.model}（{item.listing.year}）
                  </h3>
                  <p className="spec">{specLine(item.listing)}</p>
                  <dl className="facts">
                    <div>
                      <dt>成新度</dt>
                      <dd>{item.listing.condition}</dd>
                    </div>
                    <div>
                      <dt>价格</dt>
                      <dd>{formatCny(item.listing.price)}</dd>
                    </div>
                    <div>
                      <dt>渠道</dt>
                      <dd>
                        <ChannelBadge id={item.listing.channel} />
                        <span>{item.listing.seller}</span>
                      </dd>
                    </div>
                  </dl>
                  <p className="why">{valueSentence(item, asked.budget)}</p>
                  <ModelLink listing={item.listing} />
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="advice">
          <h2>建议配置</h2>
          {advice ? (
            <>
              <p className="advice-line">
                预算 {asked.budget.toLocaleString('zh-CN')} 元，建议买{' '}
                <strong>
                  {advice.model} · {advice.chipDetail} / {advice.memoryGb}GB / {formatStorage(advice.storageGb)}
                </strong>
              </p>
              <p className="why">{advice.reason}</p>
              <h3>符合这档配置、且不超过预算的挂牌</h3>
              <ul className="match-list">
                {adviceListings.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>
                        {item.model}（{item.year}）
                      </strong>
                      <span>{specLine(item)}</span>
                      <span>
                        {item.condition} · {formatCny(item.price)} · {item.seller}
                      </span>
                    </div>
                    <ChannelBadge id={item.channel} />
                    <ModelLink listing={item} tone="go" />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="empty">这个预算还碰不到常见配置。试 6000 或以上。</p>
          )}
        </section>
      </main>

      <details className="advanced">
        <summary>高级筛选（可选，不影响上面的推荐）</summary>
        {state.loadError ? <p className="banner">{state.loadError}</p> : null}
        {notice ? (
          <p className="banner">
            {notice}
            <button type="button" className="text-btn" onClick={() => setNotice(null)}>
              知道了
            </button>
          </p>
        ) : null}
        <div className="advanced-actions">
          <button type="button" className="chip" onClick={() => setQuoteOpen(true)}>
            录入报价
          </button>
          <button type="button" className="chip" onClick={() => setPlanOpen(true)}>
            客户方案 {state.planItems.length}/3
          </button>
        </div>
        <FilterBar
          filters={state.filters}
          options={state.options}
          matched={state.sorted.length}
          rangeError={state.rangeError}
          onChange={state.setFilters}
        />
        <WeightPanel weights={state.weights} leader={state.top[0]} onChange={state.setWeights} />
        <ComparisonBoard
          groups={state.groups}
          active={state.activeGroup}
          onSelect={state.setActiveSpec}
          onOpen={state.setSelectedId}
        />
        <ListingTable
          items={state.sorted}
          sortKey={state.sortKey}
          selectedId={state.selected?.listing.id ?? null}
          onSort={state.setSortKey}
          onOpen={state.setSelectedId}
        />
      </details>

      <p className="disclaimer">价格和卖家是讲解用的代表价。按钮会打开京东、闲鱼、转转、爱回收或抖音上该机型的搜索页。</p>

      <DetailDrawer
        item={state.selected}
        inPlan={state.selected ? state.planIds.includes(state.selected.listing.id) : false}
        onClose={() => state.setSelectedId(null)}
        onTogglePlan={togglePlan}
        onRemoveQuote={state.removeQuote}
      />
      <QuoteForm open={quoteOpen} onClose={() => setQuoteOpen(false)} onSave={saveQuote} />
      <PlanSheet
        open={planOpen}
        items={state.planItems}
        weights={state.weights}
        onClose={() => setPlanOpen(false)}
        onFillTop={state.fillPlanFromTop}
        onClear={state.clearPlan}
        onRemove={togglePlan}
      />
    </div>
  );
}
