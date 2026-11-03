'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const token = new URLSearchParams(window.location.search).get('token');
      if (!token) throw new Error('This password reset link is invalid or has expired. Request a new one.');
      const { error: updateError } = await authClient.resetPassword({ newPassword: password, token });
      if (updateError) throw updateError;
      setMessage('Password updated. Opening the dashboard…');
      router.replace('/admin');
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not update your password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card" aria-labelledby="admin-new-password-heading">
        <p className="admin-eyebrow">Secure your account</p>
        <h1 id="admin-new-password-heading">Choose a new password</h1>
        <form onSubmit={submit} className="admin-form-stack">
          <label>
            New password
            <input autoComplete="new-password" type="password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} />
            <span>Use at least 12 characters.</span>
          </label>
          {message && <p role="status" className="admin-success">{message}</p>}
          {error && <p role="alert" className="admin-error">{error}</p>}
          <button type="submit" className="admin-primary-button" disabled={busy}>
            {busy ? 'Saving…' : 'Save new password'}
          </button>
        </form>
        <Link className="admin-text-link" href="/admin/login">Return to sign in</Link>
      </section>
    </main>
  );
}
