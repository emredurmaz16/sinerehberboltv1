import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/services/tmdb';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>(load: () => Promise<T>, deps: readonly unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, error: null });
    load()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) setState({ data: null, loading: false, error: getErrorMessage(error) });
      });
    return () => {
      active = false;
    };
    // The loader is intentionally driven by the caller-provided deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
