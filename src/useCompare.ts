import { useEffect, useMemo, useState } from 'react';
import { loadListings } from './data/source';
import { LISTINGS } from './data/listings';
import { EMPTY_FILTERS, applyFilters, priceRangeError, uniqueGpu, uniqueNumbers } from './filters';
import {
  DEFAULT_WEIGHTS,
  buildSpecGroups,
  scoreListings,
  sortScored,
  type SpecGroup,
} from './scoring/score';
import type { Filters, ScoreWeights, ScoredListing } from './types';

export type SortKey = 'score' | 'price' | 'condition';

export function useCompare() {
  const [catalog, setCatalog] = useState(LISTINGS);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [weights, setWeights] = useState<ScoreWeights>(DEFAULT_WEIGHTS);
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [activeSpec, setActiveSpec] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadListings()
      .then((rows) => {
        if (alive) {
          setCatalog(rows);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (!alive) {
          return;
        }
        const message = error instanceof Error ? error.message : '清单加载失败';
        setLoadError(`${message}。已继续使用内置演示样本。`);
        setCatalog(LISTINGS);
      });
    return () => {
      alive = false;
    };
  }, []);

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
  const activeGroup = groups.find((group) => group.specKey === activeSpec) ?? groups[0] ?? null;
  const selected = scored.find((item) => item.listing.id === selectedId) ?? null;
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

  return {
    catalog,
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
    options,
    rangeError,
  };
}

export type CompareState = ReturnType<typeof useCompare>;
export type { SpecGroup, ScoredListing };
