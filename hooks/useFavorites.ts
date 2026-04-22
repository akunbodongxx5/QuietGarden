import { useCallback, useEffect, useState } from 'react';

import {
  loadFavoriteQuoteIds,
  loadFavoriteStoryIds,
  saveFavoriteQuoteIds,
  saveFavoriteStoryIds,
} from '@/lib/storage';

export function useFavorites() {
  const [quoteIds, setQuoteIds] = useState<string[]>([]);
  const [storyIds, setStoryIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [q, s] = await Promise.all([loadFavoriteQuoteIds(), loadFavoriteStoryIds()]);
      if (!alive) return;
      setQuoteIds(q);
      setStoryIds(s);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const toggleQuote = useCallback(async (id: string) => {
    setQuoteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveFavoriteQuoteIds(next);
      return next;
    });
  }, []);

  const toggleStory = useCallback(async (id: string) => {
    setStoryIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveFavoriteStoryIds(next);
      return next;
    });
  }, []);

  const isQuoteFavorite = useCallback((id: string) => quoteIds.includes(id), [quoteIds]);
  const isStoryFavorite = useCallback((id: string) => storyIds.includes(id), [storyIds]);

  return {
    ready,
    quoteIds,
    storyIds,
    toggleQuote,
    toggleStory,
    isQuoteFavorite,
    isStoryFavorite,
  };
}
