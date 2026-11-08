import { ComparisonBoard } from './components/ComparisonBoard';
import { DetailDrawer } from './components/DetailDrawer';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { ListingTable } from './components/ListingTable';
import { RecommendationPanel } from './components/RecommendationPanel';
import { WeightPanel } from './components/WeightPanel';
import { useCompare } from './useCompare';

export default function App() {
  const state = useCompare();

  return (
    <div className="page">
      <Header sampleCount={state.catalog.length} matched={state.sorted.length} groupCount={state.groups.length} />
      {state.loadError ? <p className="banner">{state.loadError}</p> : null}
      <p className="disclaimer">演示样本里的卖家、价格和备注都是虚构的，用来讲解筛选和打分，不代表真实在售。</p>
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
          <RecommendationPanel items={state.top} onCompare={state.openCompare} onOpen={state.setSelectedId} />
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
      <footer className="foot">果择演示 · 打分在浏览器里完成 · 链接保持占位，接入真实地址后再跳转</footer>
      <DetailDrawer item={state.selected} onClose={() => state.setSelectedId(null)} />
    </div>
  );
}
