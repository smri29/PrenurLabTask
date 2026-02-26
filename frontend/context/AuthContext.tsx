'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { apiRequest, ApiClientError } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiRequest<User>('/auth/me', { method: 'GET' });
      setUser((response.data as User) ?? null);
    } catch (err) {
      if (err instanceof ApiClientError && err.statusCode === 401) {
        setUser(null);
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load session');
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setError('');
    const response = await apiRequest<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setUser(response.data?.user ?? null);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setError('');
    await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  };

  const logout = async (): Promise<void> => {
    await apiRequest('/auth/logout', { method: 'POST' });
    setUser(null);
  };

  useEffect(() => {
    const bootstrap = async () => {
      await refreshUser();
      setLoading(false);
    };

    void bootstrap();
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, refreshUser, login, register, logout }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};