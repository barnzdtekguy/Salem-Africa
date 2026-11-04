'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) throw error;
      router.replace('/admin');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sign in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card" aria-labelledby="admin-login-heading">
        <p className="admin-eyebrow">Salem Africa</p>
        <h1 id="admin-login-heading">Staff sign in</h1>
        <p>Sign in with the email address invited by your administrator.</p>
        <form onSubmit={submit} className="admin-form-stack">
          <label>
            Email address
            <input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input autoComplete="current-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {message && <p role="alert" className="admin-error">{message}</p>}
          <button type="submit" className="admin-primary-button" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <Link className="admin-text-link" href="/admin/forgot-password">Forgot your password?</Link>
      </section>
    </main>
  );
}
