import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const SELLER_PIN = '0506';
const STORAGE_KEY = 'dylan_seller_auth';

interface SellerAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  signInWithPin: (pin: string) => Promise<void>;
  signOut: () => void;
}

const SellerAuthContext = createContext<SellerAuthContextType | undefined>(undefined);

export function SellerAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const signInWithPin = useCallback(async (pin: string) => {
    if (pin === SELLER_PIN) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
    } else {
      throw new Error('Invalid PIN');
    }
  }, []);

  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <SellerAuthContext.Provider value={{ isAuthenticated, loading, signInWithPin, signOut }}>
      {children}
    </SellerAuthContext.Provider>
  );
}

export function useSellerAuth() {
  const ctx = useContext(SellerAuthContext);
  if (!ctx) throw new Error('useSellerAuth must be used within SellerAuthProvider');
  return ctx;
}
