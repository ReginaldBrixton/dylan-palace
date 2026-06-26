import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSellerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F9F8]">
        <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#111111] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
