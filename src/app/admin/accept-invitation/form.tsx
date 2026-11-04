'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AcceptInvitationForm() {
  const [token, setToken] = useState('');
  const [existingAccount, setExistingAccount] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [acceptedExistingAccount, setAcceptedExistingAccount] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const invitationToken = window.location.hash.slice(1);
    if (!invitationToken) {
      setError('The invitation link is missing. Open the complete link from your invitation email or ask an administrator to resend it.');
      return;
    }
    setToken(invitationToken);
    window.history.replaceState(null, '', window.location.pathname);
    void fetch('/api/admin/invitations/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'inspect', token: invitationToken }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? 'Could not validate this invitation.');
        setExistingAccount(Boolean(result.existingAccount));
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Could not validate this invitation.');
      });
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (existingAccount === false && password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    if (!token) {
      setError('The invitation link is missing. Ask an administrator to resend it.');
      return;
    }

    setBusy(true);
    try {
      const response = await fetch('/api/admin/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accept',
          token,
          ...(existingAccount ? {} : { name, password, confirmPassword }),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not accept this invitation.');
      setToken('');
      setPassword('');
      setConfirmPassword('');
      setAcceptedExistingAccount(Boolean(result.existingAccount));
      setSuccess(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not accept this invitation.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card" aria-labelledby="admin-invitation-heading">
        <p className="admin-eyebrow">Salem Africa staff</p>
        <h1 id="admin-invitation-heading">Accept invitation</h1>
        {success ? (
          <>
            <p>{acceptedExistingAccount
              ? 'Your existing account has been given the invited staff role. Your password has not been changed. Sign in with your existing password.'
              : 'Your staff account is ready. Sign in with the email address that received the invitation and the password you just created.'}</p>
            <Link className="admin-primary-button admin-invitation-signin" href="/admin/login">Continue to sign in</Link>
          </>
        ) : (
          <>
            <p>{existingAccount === null
              ? 'Checking your invitation…'
              : existingAccount
                ? 'This email already has an account. Accepting will apply the invited staff role without changing its name or password.'
                : 'Create your staff profile and password. Your invitation link is valid for 48 hours and can only be used once.'}</p>
            {existingAccount !== null && (
              <form onSubmit={(event) => void submit(event)} className="admin-form-stack">
                {!existingAccount && (
                  <>
                    <label>
                      Your name
                      <input autoComplete="name" required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
                    </label>
                    <label>
                      Create password
                      <input autoComplete="new-password" type="password" required minLength={12} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} />
                      <span>Use at least 12 characters.</span>
                    </label>
                    <label>
                      Confirm password
                      <input autoComplete="new-password" type="password" required minLength={12} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    </label>
                  </>
                )}
                {error && <p role="alert" className="admin-error">{error}</p>}
                <button type="submit" className="admin-primary-button" disabled={busy || !token}>
                  {busy ? 'Accepting invitation…' : existingAccount ? 'Accept staff invitation' : 'Create staff account'}
                </button>
              </form>
            )}
            {error && existingAccount === null && <p role="alert" className="admin-error">{error}</p>}
            <Link className="admin-text-link" href="/admin/login">Return to sign in</Link>
          </>
        )}
      </section>
    </main>
  );
}
