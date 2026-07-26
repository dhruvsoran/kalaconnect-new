'use client';

import { useAuthContext } from './auth-context';

export function useUser() {
  const { currentUser, loading } = useAuthContext();
  return { user: currentUser, loading };
}
