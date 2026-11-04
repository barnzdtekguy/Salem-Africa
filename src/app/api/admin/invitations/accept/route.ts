import { createHash } from 'node:crypto';
import type { RowDataPacket } from 'mysql2/promise';
import { getAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { rejectCrossOriginMutation } from '@/lib/security/request';

export const runtime = 'nodejs';

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return jsonError('Invitation details are missing. Open the link from your invitation email and try again.', 400);
  const { token, name, password, confirmPassword } = body as {
    token?: unknown;
    name?: unknown;
    password?: unknown;
    confirmPassword?: unknown;
  };
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return jsonError('This invitation link is invalid. Ask an administrator to send another.', 400);
  }
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return jsonError('Enter your name using 2 to 100 characters.', 400);
  }
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
    return jsonError('Choose a password between 12 and 128 characters.', 400);
  }
  if (password !== confirmPassword) return jsonError('The passwords do not match.', 400);

  const tokenHash = createHash('sha256').update(token).digest('hex');
  const connection = await getDatabase().getConnection();
  let createdUserId: string | null = null;
  try {
    await connection.beginTransaction();
    const [invitationRows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, email, role, expires_at, accepted_at, revoked_at FROM staff_invitations WHERE token_hash = ? FOR UPDATE',
      [tokenHash],
    );
    const invitation = invitationRows[0];
    if (!invitation || invitation.revoked_at) {
      await connection.rollback();
      return jsonError('This invitation link is invalid. Ask an administrator to send another.', 400);
    }
    if (invitation.accepted_at) {
      await connection.rollback();
      return jsonError('This invitation has already been used. Sign in with your staff account or contact an administrator.', 409);
    }
    if (new Date(invitation.expires_at as string | Date).getTime() <= Date.now()) {
      await connection.rollback();
      return jsonError('This invitation has expired. Ask an administrator to resend it.', 410);
    }

    const [existingUsers] = await connection.execute<RowDataPacket[]>(
      'SELECT id FROM `user` WHERE email = ? LIMIT 1',
      [invitation.email],
    );
    if (existingUsers.length) {
      await connection.rollback();
      return jsonError('An account already exists for this email. Sign in or ask an administrator to manage the existing account; this invitation will not change its password.', 409);
    }
    if (invitation.role !== 'administrator' && invitation.role !== 'editor') {
      await connection.rollback();
      return jsonError('This invitation has an invalid role. Ask an administrator to issue a new invitation.', 400);
    }

    const authContext = await getAuth().$context;
    const hashedPassword = await authContext.password.hash(password);
    const user = await authContext.internalAdapter.createUser({
      email: invitation.email as string,
      name: name.trim(),
      emailVerified: true,
      role: invitation.role === 'administrator' ? 'admin' : 'user',
    }, { method: 'email-password' });
    createdUserId = user.id;
    await authContext.internalAdapter.linkAccount({
      userId: user.id,
      providerId: 'credential',
      accountId: user.id,
      password: hashedPassword,
    });

    const [updateResult] = await connection.execute(
      `UPDATE staff_invitations SET accepted_at = UTC_TIMESTAMP(3)
       WHERE id = ? AND token_hash = ? AND accepted_at IS NULL AND revoked_at IS NULL`,
      [invitation.id, tokenHash],
    );
    if ('affectedRows' in updateResult && updateResult.affectedRows !== 1) {
      throw new Error('Invitation could not be consumed.');
    }
    await connection.commit();
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    await connection.rollback();
    if (createdUserId) {
      try {
        await (await getAuth().$context).internalAdapter.deleteUser(createdUserId);
      } catch {
        console.error('Invitation account cleanup failed after acceptance could not complete.');
        return jsonError('Account setup could not finish. Contact an administrator before trying again.', 500);
      }
    }
    console.error('Staff invitation acceptance failed.');
    return jsonError('Could not complete account setup. Please try again or contact an administrator.', 500);
  } finally {
    connection.release();
  }
}
