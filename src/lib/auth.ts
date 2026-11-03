import 'server-only';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { headers } from 'next/headers';
import { getDatabase } from './db';
import { getAuthOptions } from './auth-options';

function createAuth() {
  return betterAuth({
    ...getAuthOptions(),
    plugins: [admin({ defaultRole: 'user', adminRoles: ['admin'] })],
  });
}

let authInstance: ReturnType<typeof createAuth> | null = null;

export function getAuth(): ReturnType<typeof createAuth> {
  if (!authInstance) authInstance = createAuth();
  return authInstance;
}

export type StaffRole = 'administrator' | 'editor';

export type StaffContext = {
  userId: string;
  email: string;
  role: StaffRole;
};

export async function getStaffContext(): Promise<StaffContext | null> {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) return null;

  const [rows] = await getDatabase().execute<import('mysql2/promise').RowDataPacket[]>(
    'SELECT id, email, role, banned FROM `user` WHERE id = ? LIMIT 1',
    [session.user.id],
  );
  const user = rows[0] as { id: string; email: string; role: string | null; banned: boolean | null } | undefined;
  if (!user || user.banned) return null;
  if (user.role !== 'admin' && user.role !== 'user') return null;

  return {
    userId: user.id,
    email: user.email,
    role: user.role === 'admin' ? 'administrator' : 'editor',
  };
}

export async function requireStaff(allowedRoles: StaffRole[] = ['administrator', 'editor']) {
  const staff = await getStaffContext();
  if (!staff) {
    return { staff: null, response: Response.json({ error: 'Authentication required.' }, { status: 401 }) };
  }
  if (!allowedRoles.includes(staff.role)) {
    return { staff: null, response: Response.json({ error: 'You do not have permission to do this.' }, { status: 403 }) };
  }
  return { staff, response: null };
}
