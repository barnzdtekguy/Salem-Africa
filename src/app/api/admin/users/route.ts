import { randomBytes } from 'node:crypto';
import { getAuth, requireStaff } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { getSiteUrl, rejectCrossOriginMutation } from '@/lib/security/request';

export async function GET(request: Request) {
  const authorization = await requireStaff(['administrator']);
  if (authorization.response) return authorization.response;

  try {
    const result = await getAuth().api.listUsers({
      query: { limit: 1000, offset: 0 },
      headers: request.headers,
    });
    return Response.json({
      users: result.users.map((user) => ({
        user_id: user.id,
        email: user.email,
        role: user.role === 'admin' ? 'administrator' : 'editor',
        active: !user.banned,
        created_at: user.createdAt,
      })),
    });
  } catch (error) {
    console.error('Staff listing failed.', error);
    return Response.json({ error: 'Could not load staff.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const authorization = await requireStaff(['administrator']);
  if (authorization.response) return authorization.response;

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return Response.json({ error: 'Provide an email and staff role.' }, { status: 400 });
  const { email, role } = body as { email?: unknown; role?: unknown };
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return Response.json({ error: 'Enter a valid staff email address.' }, { status: 400 });
  }
  if (role !== 'administrator' && role !== 'editor') {
    return Response.json({ error: 'Choose Administrator or Editor.' }, { status: 400 });
  }

  const cleanEmail = email.trim().toLowerCase();
  const internalRole = role === 'administrator' ? 'admin' : 'user';
  const headers = request.headers;
  const password = randomBytes(48).toString('base64url');
  let createdUserId: string;
  try {
    const result = await getAuth().api.createUser({
      body: {
        email: cleanEmail,
        password,
        name: cleanEmail.split('@')[0],
        role: internalRole,
      },
      headers,
    });
    createdUserId = result.user.id;
  } catch (error) {
    console.error('Staff account creation failed.', error);
    return Response.json({ error: 'Could not create this staff account. Check whether the email is already in use.' }, { status: 400 });
  }

  try {
    await getAuth().api.requestPasswordReset({
      body: {
        email: cleanEmail,
        redirectTo: new URL('/admin/reset-password', getSiteUrl(request)).toString(),
      },
      headers,
    });
  } catch (error) {
    try {
      await getAuth().api.removeUser({ body: { userId: createdUserId }, headers });
    } catch (cleanupError) {
      console.error('Staff invitation rollback failed.', cleanupError);
      return Response.json({ error: 'The account was created, but the setup email failed and automatic cleanup also failed. Remove the pending account and retry.' }, { status: 500 });
    }
    console.error('Staff setup email failed; account creation was rolled back.', error);
    return Response.json({ error: 'Could not send the staff setup email. The account was removed; check SMTP configuration and retry.' }, { status: 502 });
  }
  return Response.json({ ok: true }, { status: 201 });
}
