'use client';

import { useFirebase } from '../provider';

export function useUser() {
  const { currentUser, loading } = useFirebase();
  return { user: currentUser, loading };
}
