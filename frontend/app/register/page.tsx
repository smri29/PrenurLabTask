'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      await register(name, email, password);
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl p-6 glass-card">
      <h1 className="section-title text-3xl font-semibold text-slate-900">Create Account</h1>
      <p className="subtle-text mt-1 text-sm">Set up your account to start ordering.</p>

      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-slate-800 outline-none focus:border-cyan-500"
          placeholder="Full name"
          required
        />
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
        <button type="submit" className="pill-btn w-full bg-emerald-400/90 text-slate-950">
          Create Account
        </button>
      </form>
    </div>
  );
}
