import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isSeller, loading } = useSellerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F9F8]">
        <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#111111] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  if (!isSeller) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F9F8] px-6 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#111111] mb-2">Access Denied</h1>
        <p className="text-sm text-[#8B8B8A] mb-4">You need seller privileges to access this area.</p>
        <button
          onClick={() => (window.location.href = '/home')}
          className="px-6 py-3 bg-[#111111] text-white text-[11px] font-semibold uppercase tracking-widest cursor-pointer rounded-lg"
        >
          Back to Store
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
