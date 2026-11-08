import { useEffect, useState } from 'react';
import { ComparisonBoard } from './components/ComparisonBoard';
import { DetailDrawer } from './components/DetailDrawer';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { ListingTable } from './components/ListingTable';
import { PlanSheet } from './components/PlanSheet';
import { QuoteForm } from './components/QuoteForm';
import { RecommendationPanel } from './components/RecommendationPanel';
import { WeightPanel } from './components/WeightPanel';
import { applyFilters } from './filters';
import { useCompare } from './useCompare';
import type { Listing } from './types';

export default function App() {
  const state = useCompare();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const locked = Boolean(state.selected) || quoteOpen || planOpen;
    document.body.classList.toggle('drawer-open', locked);
    return () => document.body.classList.remove('drawer-open');
  }, [state.selected, quoteOpen, planOpen]);

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
      <Header
        sampleCount={state.catalog.length}
        quoteCount={state.quoteCount}
        matched={state.sorted.length}
        groupCount={state.groups.length}
        planCount={state.planItems.length}
        onOpenQuote={() => setQuoteOpen(true)}
        onOpenPlan={() => setPlanOpen(true)}
      />
      {state.loadError ? <p className="banner">{state.loadError}</p> : null}
      {notice ? (
        <p className="banner">
          {notice}
          <button type="button" className="text-btn" onClick={() => setNotice(null)}>
            知道了
          </button>
        </p>
      ) : null}
      <p className="disclaimer">
        内置样本的卖家、价格和备注是虚构的。本场录入的报价只留在这台浏览器，并和样本一起参与同一套筛选和打分。
      </p>
      <div className="workspace">
        <FilterBar
          filters={state.filters}
          options={state.options}
          matched={state.sorted.length}
          rangeError={state.rangeError}
          onChange={state.setFilters}
        />
        <main>
          <WeightPanel weights={state.weights} leader={state.top[0]} onChange={state.setWeights} />
          <RecommendationPanel
            items={state.top}
            planIds={state.planIds}
            onCompare={state.openCompare}
            onOpen={state.setSelectedId}
            onTogglePlan={togglePlan}
          />
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
        </main>
      </div>
      <footer className="foot">果择 · 打分在浏览器里完成 · 每条样本的链接会打开对应机型</footer>
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
