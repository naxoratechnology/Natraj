import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../services/auth';

export function ProtectedRoute({ role, roles }: { role?: UserRole; roles?: UserRole[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-muted">Checking your session…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  const allowed = roles ?? (role ? [role] : []);
  const home = user.role === 'dealer' ? '/dealer/dashboard' : user.role === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard';
  if (!allowed.includes(user.role)) return <Navigate to={home} replace />;
  return <Outlet />;
}
