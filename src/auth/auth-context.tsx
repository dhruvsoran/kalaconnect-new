'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type AuthContextType = {
  currentUser: { id: string; email: string; name?: string; role?: string; emailVerified?: boolean } | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<null | { id: string; email: string; name?: string; role?: string; emailVerified?: boolean }>(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    setLoading(true);
    try {
      const token = (typeof window !== 'undefined' && localStorage.getItem('token')) || null;
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = await res.json();
      if (!json.user && token) {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
      }
      setCurrentUser(json.user || null);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
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
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
