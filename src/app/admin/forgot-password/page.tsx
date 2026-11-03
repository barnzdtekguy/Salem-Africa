'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (resetError) throw resetError;
      setMessage('If this email belongs to an invited staff account, a password reset link is on its way.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not request a reset link.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card" aria-labelledby="admin-recovery-heading">
        <p className="admin-eyebrow">Account recovery</p>
        <h1 id="admin-recovery-heading">Reset your password</h1>
        <p>Enter the email address associated with your staff invitation.</p>
        <form onSubmit={submit} className="admin-form-stack">
          <label>
            Email address
            <input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          {message && <p role="status" className="admin-success">{message}</p>}
          {error && <p role="alert" className="admin-error">{error}</p>}
          <button type="submit" className="admin-primary-button" disabled={busy}>
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <Link className="admin-text-link" href="/admin/login">Return to sign in</Link>
      </section>
    </main>
  );
}
