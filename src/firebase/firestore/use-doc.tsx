'use client';

import { useState, useEffect } from 'react';

export function useDoc<T = any>(docRef: any | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef || !docRef.collection || !docRef.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch(`/api/db/${docRef.collection}/${docRef.id}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setData(json.data || null);
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
  }, [docRef]);

  return { data, loading, error };
}
