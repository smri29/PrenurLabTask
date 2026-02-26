'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

const linkClass = (active: boolean) =>
  `rounded-full px-3 py-1.5 text-sm font-medium transition ${
    active ? 'bg-cyan-500/20 text-sky-800' : 'text-slate-700 hover:bg-sky-100/90 hover:text-slate-900'
  }`;

export const NavBar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="mx-auto w-full max-w-6xl rounded-2xl px-4 py-4 glass-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="brand-title text-2xl font-bold text-slate-900 md:text-[1.7rem]">
            PL Store
          </Link>
          <span className="hidden h-5 w-px bg-slate-400/70 md:inline-block" />
          <div className="flex items-center gap-1">
            <Link href="/" className={linkClass(pathname === '/')}>
              Catalog
            </Link>
            {user?.role !== 'admin' && (
              <Link href="/cart" className={linkClass(pathname === '/cart')}>
                Cart
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin" className={linkClass(pathname === '/admin')}>
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">{user.name}</span>
              <button type="button" onClick={() => void logout()} className="pill-btn bg-rose-500 text-white hover:bg-rose-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="pill-btn bg-slate-700 text-white hover:bg-slate-800">
                Login
              </Link>
              <Link href="/register" className="pill-btn bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
