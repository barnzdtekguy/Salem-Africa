import { createHash } from 'node:crypto';
import type { RowDataPacket } from 'mysql2/promise';
import { getAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { rejectCrossOriginMutation } from '@/lib/security/request';

export const runtime = 'nodejs';

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

function invitationToken(body: unknown) {
  if (!body || typeof body !== 'object') return null;
  const { token } = body as { token?: unknown };
  return typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}

async function findInvitation(token: string) {
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const [rows] = await getDatabase().execute<RowDataPacket[]>(
    `SELECT id, email, role, expires_at, accepted_at, revoked_at
     FROM staff_invitations WHERE token_hash = ? LIMIT 1`,
    [tokenHash],
  );
  return rows[0] as RowDataPacket | undefined;
}

function invitationError(invitation: RowDataPacket | undefined) {
  if (!invitation || invitation.revoked_at) return jsonError('This invitation link is invalid. Ask an administrator to send another.', 400);
  if (invitation.accepted_at) return jsonError('This invitation has already been used. Sign in with your staff account or contact an administrator.', 409);
  if (new Date(invitation.expires_at as string | Date).getTime() <= Date.now()) {
    return jsonError('This invitation has expired. Ask an administrator to resend it.', 410);
  }
  if (invitation.role !== 'administrator' && invitation.role !== 'editor') {
    return jsonError('This invitation has an invalid role. Ask an administrator to issue a new invitation.', 400);
  }
  return null;
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;

  const body: unknown = await request.json().catch(() => null);
  const token = invitationToken(body);
  if (!token) return jsonError('This invitation link is invalid. Ask an administrator to send another.', 400);
  const action = body && typeof body === 'object' && 'action' in body ? body.action : 'accept';

  if (action === 'inspect') {
    try {
      const invitation = await findInvitation(token);
      const error = invitationError(invitation);
      if (error) return error;
      if (!invitation) return jsonError('This invitation link is invalid. Ask an administrator to send another.', 400);
      const [users] = await getDatabase().execute<RowDataPacket[]>(
        'SELECT id FROM `user` WHERE email = ? LIMIT 1',
        [invitation.email],
      );
      return Response.json(
        { existingAccount: users.length > 0 },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    } catch {
      console.error('Staff invitation validation failed.');
      return jsonError('Could not validate this invitation. Please try again.', 500);
    }
  }
  if (action !== 'accept') return jsonError('Invalid invitation action.', 400);

  const { name, password, confirmPassword } = body as {
    name?: unknown;
    password?: unknown;
    confirmPassword?: unknown;
  };
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const connection = await getDatabase().getConnection();
  let createdUserId: string | null = null;
  try {
    await connection.beginTransaction();
    const [invitationRows] = await connection.execute<RowDataPacket[]>(
      `SELECT id, email, role, expires_at, accepted_at, revoked_at
       FROM staff_invitations WHERE token_hash = ? FOR UPDATE`,
      [tokenHash],
    );
    const invitation = invitationRows[0];
    const invalidInvitation = invitationError(invitation);
    if (invalidInvitation) {
      await connection.rollback();
      return invalidInvitation;
    }

    const [existingUsers] = await connection.execute<RowDataPacket[]>(
      'SELECT id, banned FROM `user` WHERE email = ? LIMIT 1 FOR UPDATE',
      [invitation.email],
    );
    const role = invitation.role === 'administrator' ? 'admin' : 'user';
    if (existingUsers.length) {
      if (existingUsers[0].banned) {
        await connection.rollback();
        return jsonError('This account is disabled. Ask an administrator to enable it before accepting the invitation.', 409);
      }

      await connection.execute('UPDATE `user` SET role = ? WHERE id = ?', [role, existingUsers[0].id]);
      const [updateResult] = await connection.execute(
        `UPDATE staff_invitations SET accepted_at = UTC_TIMESTAMP(3)
         WHERE id = ? AND token_hash = ? AND accepted_at IS NULL AND revoked_at IS NULL`,
        [invitation.id, tokenHash],
      );
      if ('affectedRows' in updateResult && updateResult.affectedRows !== 1) {
        throw new Error('Invitation could not be consumed.');
      }
      await connection.commit();
      return Response.json(
        { ok: true, existingAccount: true },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      await connection.rollback();
      return jsonError('Enter your name using 2 to 100 characters.', 400);
    }
    if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
      await connection.rollback();
      return jsonError('Choose a password between 12 and 128 characters.', 400);
    }
    if (password !== confirmPassword) {
      await connection.rollback();
      return jsonError('The passwords do not match.', 400);
    }

    const authContext = await getAuth().$context;
    const hashedPassword = await authContext.password.hash(password);
    const user = await authContext.internalAdapter.createUser({
      email: invitation.email as string,
      name: name.trim(),
      emailVerified: true,
      role,
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
    return Response.json({ ok: true, existingAccount: false }, { headers: { 'Cache-Control': 'no-store' } });
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
