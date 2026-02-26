'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl p-6 glass-card">
      <h1 className="section-title text-3xl font-semibold text-slate-900">Welcome Back</h1>
      <p className="subtle-text mt-1 text-sm">Sign in to continue shopping and manage your cart.</p>

      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-slate-800 outline-none focus:border-cyan-500"
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-slate-800 outline-none focus:border-cyan-500"
          placeholder="Password"
          required
        />
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <button type="submit" className="pill-btn w-full bg-cyan-400/90 text-slate-950">
          Sign In
        </button>
      </form>

      <p className="subtle-text mt-4 text-sm">
        New user?{' '}
        <Link href="/register" className="font-semibold text-cyan-200 underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
