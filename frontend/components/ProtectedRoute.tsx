'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (requireAdmin && user.role !== 'admin') {
      router.replace('/');
    }
  }, [loading, user, requireAdmin, router]);

  if (loading) {
    return <p className="glass-soft rounded-xl p-4 text-center subtle-text">Loading session...</p>;
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};
