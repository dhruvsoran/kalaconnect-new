'use client';

import { useState, useEffect } from 'react';

export function useCollection<T = any>(query: any | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query || !query.collection) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch(`/api/db/${query.collection}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setData(json.data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err as Error);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return { data, loading, error };
}
