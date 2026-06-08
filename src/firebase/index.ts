'use client';

// Lightweight shim to retain existing imports while switching to MongoDB + JWT
import * as provider from './provider';
import * as clientProvider from './client-provider';
import * as useUser from './auth/use-user';
import * as useDoc from './firestore/use-doc';
import * as useCollection from './firestore/use-collection';
import * as memo from './use-memo-firebase';

export function initializeFirebase() {
  // no-op shim to keep existing callers working
  return { firebaseApp: null, firestore: null, auth: null };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
export * from './use-memo-firebase';

