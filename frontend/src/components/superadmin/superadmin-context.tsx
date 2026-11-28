'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch, AdminError, type AdminStats } from '@/lib/admin';

interface SuperAdminValue {
  stats: AdminStats | null;
  loading: boolean;
  error: string;
  reload: () => void;
  expire: () => void;
}

const SuperAdminContext = createContext<SuperAdminValue | null>(null);

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const expire = useCallback(() => {
    setStats(null);
    router.replace('/superadmin/login');
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setStats(await adminFetch<AdminStats>('/stats'));
    } catch (err) {
      if (err instanceof AdminError && err.status === 401) {
        expire();
      } else {
        setError(err instanceof Error ? err.message : 'Could not load stats');
      }
    } finally {
      setLoading(false);
    }
  }, [expire]);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo<SuperAdminValue>(
    () => ({ stats, loading, error, reload: load, expire }),
    [stats, loading, error, load, expire],
  );

  return <SuperAdminContext.Provider value={value}>{children}</SuperAdminContext.Provider>;
}

export function useSuperAdmin(): SuperAdminValue {
  const ctx = useContext(SuperAdminContext);
  if (!ctx) throw new Error('useSuperAdmin must be used within SuperAdminProvider');
  return ctx;
}
