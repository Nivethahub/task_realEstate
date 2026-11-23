'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [phone, setPhone] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const router = useRouter();
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...(mode === 'register' ? { name, phone } : {}), email, password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to continue');
      localStorage.setItem('nestora_token', result.data.token); localStorage.setItem('nestora_refresh_token', result.data.refreshToken); localStorage.setItem('nestora_user', JSON.stringify(result.data.user));
      localStorage.setItem('nestora_last_activity', String(Date.now()));
      window.dispatchEvent(new Event('nestora-auth-changed'));
      router.push('/dashboard'); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong'); }
    finally { setLoading(false); }
  }
  return <form onSubmit={submit} className="space-y-4">
    {mode === 'register' && <><label className="block text-sm font-bold">Full name<input className="field mt-2" value={name} onChange={(e) => setName(e.target.value)} minLength={2} required placeholder="Your name" /></label><label className="block text-sm font-bold">Phone (optional)<input className="field mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number" /></label></>}
    <label className="block text-sm font-bold">Email address<input className="field mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /></label>
    <label className="block text-sm font-bold">Password<input className="field mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={mode === 'register' ? 8 : 1} required placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'} /></label>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={loading} className="btn-primary w-full">{loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
    <p className="text-center text-sm text-[#718078]">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <Link className="font-bold text-forest underline" href={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Sign up' : 'Log in'}</Link></p>
  </form>;
}
