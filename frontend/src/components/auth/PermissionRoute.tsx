import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function PermissionRoute({ permission }: { permission: string }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-muted">Checking access…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'super_admin' || user.permissions?.includes(permission)) return <Outlet />;
  return <Navigate to="/admin/dashboard" replace />;
}
