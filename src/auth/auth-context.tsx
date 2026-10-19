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
      let token = (typeof window !== 'undefined' && localStorage.getItem('token')) || null;

      // Fallback: previously read from user_info cookie, but it's now httpOnly
      // Token should be stored in localStorage from login/register responses
      // If not available, proceed to fetch /api/auth/me which will use the httpOnly auth_token cookie

      const res = await fetch('/api/auth/me', {
        credentials: 'include', // send httpOnly auth_token cookie
      });
      const json = await res.json();
      if (json.user) {
        setCurrentUser(json.user);
      } else {
        // No valid session (logged out, expired, or invalid token) — clear everything
        if (token) {
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
        }
        setCurrentUser(null);
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
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
