import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { LoadingState } from './LoadingState.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    const redirectPath = requireAdmin ? '/admin/login' : '/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-neutral-200 text-center rounded-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Administrator Access Required</h2>
        <p className="text-sm text-neutral-600 mb-6">
          Your current account does not have permission to access management features. Please sign in with administrator credentials.
        </p>
        <Navigate to="/admin/login" replace />
      </div>
    );
  }

  return <>{children}</>;
};
