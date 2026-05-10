import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CSpinner } from '@coreui/react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>;
  }

  // 1. If not logged in, send to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Admin has full access to everything
  if (user.role === 'ROLE_ADMIN') {
    return children;
  }

  // 3. Check if the current user's role is allowed for this specific route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ROLE_CLIENT') {
      return <Navigate to="/client/workspaces" replace />;
    }
    if (user.role === 'ROLE_EMPLOYEE') {
      return <Navigate to="/employee/inbox" replace />;
    }
    return <Navigate to="/404" replace />;
  }

  return children;
};