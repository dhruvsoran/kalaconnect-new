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

      // Fallback: populate localStorage from user_info cookie (Google OAuth)
      if (!token && typeof document !== 'undefined') {
        const userInfoCookie = document.cookie.split(';').find(c => c.trim().startsWith('user_info='));
        if (userInfoCookie) {
          try {
            const userInfo = JSON.parse(decodeURIComponent(userInfoCookie.split('=').slice(1).join('=')));
            if (userInfo.token) {
              localStorage.setItem('token', userInfo.token);
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('userId', userInfo.id);
              localStorage.setItem('userEmail', userInfo.email);
              localStorage.setItem('userName', userInfo.name || '');
              localStorage.setItem('userRole', userInfo.role || 'buyer');
              token = userInfo.token;
            }
          } catch {}
        }
      }

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
