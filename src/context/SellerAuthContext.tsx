import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Profile } from '../lib/database.types';
import { getCurrentSeller, signInSeller, signOutSeller, subscribeToSellerAuth } from '../lib/auth';

interface SellerAuthContextValue {
  seller: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, passcode: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SellerAuthContext = createContext<SellerAuthContextValue | undefined>(undefined);

export function SellerAuthProvider({ children }: { children: React.ReactNode }) {
  const [seller, setSeller] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCurrentSeller()
      .then((profile) => { if (active) setSeller(profile); })
      .catch(() => { if (active) setSeller(null); })
      .finally(() => { if (active) setLoading(false); });

    const unsubscribe = subscribeToSellerAuth((profile) => {
      if (!active) return;
      setSeller(profile);
      setLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, passcode: string) => {
    setLoading(true);
    try {
      const profile = await signInSeller(email, passcode);
      setSeller(profile);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await signOutSeller();
      setSeller(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<SellerAuthContextValue>(() => ({
    seller,
    isAuthenticated: Boolean(seller),
    loading,
    signIn,
    signOut,
  }), [seller, loading, signIn, signOut]);

  return <SellerAuthContext.Provider value={value}>{children}</SellerAuthContext.Provider>;
}

export function useSellerAuth() {
  const context = useContext(SellerAuthContext);
  if (!context) throw new Error('useSellerAuth must be used within SellerAuthProvider');
  return context;
}
