'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from './auth-context';

export const AuthClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
