import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSellerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] animate-pulse select-none">
        <div className="w-full max-w-6xl mx-auto p-8">
          <div className="h-8 w-48 bg-[#E5E5E5] rounded-full mb-6" />
          <div className="h-4 w-32 bg-[#E5E5E5] rounded-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E5E5E5] p-4 flex flex-col gap-3">
                <div className="aspect-square w-full bg-[#E5E5E5]/50 rounded-xl" />
                <div className="h-3 w-2/3 bg-[#E5E5E5] rounded-full" />
                <div className="h-4 w-1/3 bg-[#E5E5E5] rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
