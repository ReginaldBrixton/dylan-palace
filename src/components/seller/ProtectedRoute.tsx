import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSellerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--color-canvas)]" aria-label="Verifying seller access">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-ink)]" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)]">Verifying access</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/seller/login" state={{ from: location }} replace />;
  return <>{children}</>;
}
