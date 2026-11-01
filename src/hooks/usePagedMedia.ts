import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/services/tmdb';
import type { MediaItem, PagedResult } from '@/types/media';

export function usePagedMedia(load: (page: number) => Promise<PagedResult>) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    load(page)
      .then((result) => {
        if (!active) return;
        setItems((previous) => {
          const merged = page === 1 ? result.items : [...previous, ...result.items];
          const unique = new Map(merged.map((item) => [`${item.mediaType}-${item.id}`, item]));
          return [...unique.values()];
        });
        setTotalPages(result.totalPages);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(getErrorMessage(err));
        setLoading(false);
      });
    return () => {
      active = false;
    };
    // The loader is recreated on each render; the page number is the only real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return {
    items,
    loading,
    error,
    hasMore: page < totalPages,
    loadMore: () => setPage((current) => current + 1),
  };
}
