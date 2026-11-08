import { useEffect, useMemo, useState } from 'react';
import { LISTINGS } from './data/listings';
import { loadPlanIds, loadStoredQuotes, mergeCatalog, storePlanIds, storeQuotes } from './data/quotes';
import { loadListings } from './data/source';
import { EMPTY_FILTERS, applyFilters, priceRangeError, uniqueGpu, uniqueNumbers } from './filters';
import {
  DEFAULT_WEIGHTS,
  buildSpecGroups,
  scoreListings,
  sortScored,
  type SpecGroup,
} from './scoring/score';
import type { Filters, Listing, ScoreWeights, ScoredListing } from './types';

export type SortKey = 'score' | 'price' | 'condition';

export function useCompare() {
  const [samples, setSamples] = useState(LISTINGS);
  const [quotes, setQuotes] = useState<Listing[]>(() => loadStoredQuotes());
  const [planIds, setPlanIds] = useState<string[]>(() => loadPlanIds());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [weights, setWeights] = useState<ScoreWeights>(DEFAULT_WEIGHTS);
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [activeSpec, setActiveSpec] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const catalog = useMemo(() => mergeCatalog(samples, quotes), [samples, quotes]);

  useEffect(() => {
    let alive = true;
    loadListings()
      .then((rows) => {
        if (alive) {
          setSamples(rows);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (!alive) {
          return;
        }
        const message = error instanceof Error ? error.message : '清单加载失败';
        setLoadError(`${message}。已继续使用内置演示样本。`);
        setSamples(LISTINGS);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    storeQuotes(quotes);
  }, [quotes]);

  useEffect(() => {
    storePlanIds(planIds);
  }, [planIds]);

  useEffect(() => {
    setPlanIds((current) => {
      const next = current.filter((id) => catalog.some((item) => item.id === id));
      return next.length === current.length ? current : next;
    });
  }, [catalog]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedId(null);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => applyFilters(catalog, filters), [catalog, filters]);
  const scored = useMemo(() => scoreListings(filtered, weights), [filtered, weights]);
  const sorted = useMemo(() => sortScored(scored, sortKey), [scored, sortKey]);
  const groups = useMemo(() => buildSpecGroups(scored), [scored]);
  const top = scored.slice(0, 3);
  const catalogScored = useMemo(() => scoreListings(catalog, weights), [catalog, weights]);
  const planItems = planIds
    .map((id) => catalogScored.find((item) => item.listing.id === id))
    .filter((item): item is ScoredListing => Boolean(item));
  const activeGroup = groups.find((group) => group.specKey === activeSpec) ?? groups[0] ?? null;
  const selected = scored.find((item) => item.listing.id === selectedId) ?? catalogScored.find((item) => item.listing.id === selectedId) ?? null;
  const rangeError = priceRangeError(filters);

  const options = useMemo(
    () => ({
      memories: uniqueNumbers(catalog.map((item) => item.memoryGb)),
      storages: uniqueNumbers(catalog.map((item) => item.storageGb)),
      gpus: uniqueGpu(catalog.map((item) => item.gpu)),
    }),
    [catalog],
  );

  function openCompare(spec: string) {
    setActiveSpec(spec);
    document.getElementById('compare')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function addQuote(listing: Listing) {
    setQuotes((current) => [...current, listing]);
    setSelectedId(listing.id);
  }

  function removeQuote(id: string) {
    setQuotes((current) => current.filter((item) => item.id !== id));
    setPlanIds((current) => current.filter((item) => item !== id));
    setSelectedId((current) => (current === id ? null : current));
  }

  function togglePlan(id: string): 'added' | 'removed' | 'full' {
    if (planIds.includes(id)) {
      setPlanIds(planIds.filter((item) => item !== id));
      return 'removed';
    }
    if (planIds.length >= 3) return 'full';
    setPlanIds([...planIds, id]);
    return 'added';
  }

  function fillPlanFromTop() {
    setPlanIds(top.map((item) => item.listing.id));
  }

  function clearPlan() {
    setPlanIds([]);
  }

  return {
    catalog,
    quoteCount: quotes.length,
    planIds,
    planItems,
    loadError,
    filters,
    setFilters,
    weights,
    setWeights,
    sortKey,
    setSortKey,
    top,
    sorted,
    groups,
    activeGroup,
    setActiveSpec,
    selected,
    setSelectedId,
    openCompare,
    addQuote,
    removeQuote,
    togglePlan,
    fillPlanFromTop,
    clearPlan,
    options,
    rangeError,
  };
}

export type CompareState = ReturnType<typeof useCompare>;
export type { SpecGroup, ScoredListing };
