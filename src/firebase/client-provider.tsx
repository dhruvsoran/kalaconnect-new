'use client';

import React, { ReactNode } from 'react';
import { FirebaseProvider } from './provider';

export const FirebaseClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <FirebaseProvider>{children}</FirebaseProvider>;
};

