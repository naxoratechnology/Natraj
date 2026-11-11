import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoredUser, refreshSession, type AuthUser } from '../services/auth';

interface AuthState { user: AuthUser | null; loading: boolean }
const AuthContext = createContext<AuthState>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    window.addEventListener('auth-changed', sync);
    refreshSession().finally(() => setLoading(false));
    return () => window.removeEventListener('auth-changed', sync);
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
