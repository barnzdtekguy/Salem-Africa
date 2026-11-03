import { getDatabase } from './db';
import { sendPasswordResetEmail } from './email';

export function getAuthOptions() {
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!secret || secret.length < 32) {
    throw new Error('Set BETTER_AUTH_SECRET to a random value of at least 32 characters.');
  }
  if (!baseURL) throw new Error('Set BETTER_AUTH_URL to the canonical website URL.');

  return {
    appName: 'Salem Africa Staff',
    baseURL,
    secret,
    database: getDatabase(),
    trustedOrigins: [baseURL],
    rateLimit: {
      enabled: true,
      storage: 'database' as const,
      window: 60,
      max: 100,
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
        await sendPasswordResetEmail(user.email, url);
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 14,
      updateAge: 60 * 60 * 24,
    },
  };
}
