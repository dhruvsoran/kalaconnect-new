'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type FirebaseContextType = {
  firebaseApp: null;
  firestore: null;
  auth: null;
  currentUser: { id: string; email: string; name?: string; role?: string } | null;
  loading: boolean;
};

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
  firestore: null,
  auth: null,
  currentUser: null,
  loading: true,
});

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<null | { id: string; email: string; name?: string; role?: string }>(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    setLoading(true);
    try {
      const token = (typeof window !== 'undefined' && localStorage.getItem('token')) || null;
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = await res.json();
      setCurrentUser(json.user || null);
    } catch (e) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();

    const handleAuthChange = () => {
      loadCurrentUser();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  return (
    <FirebaseContext.Provider value={{ firebaseApp: null, firestore: null, auth: null, currentUser, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => null;
export const useFirestore = () => null;
export const useAuth = () => null;

