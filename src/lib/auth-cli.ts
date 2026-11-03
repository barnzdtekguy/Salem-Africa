import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { getAuthOptions } from './auth-options';

export const auth = betterAuth({
  ...getAuthOptions(),
  plugins: [admin({ defaultRole: 'user', adminRoles: ['admin'] })],
});
