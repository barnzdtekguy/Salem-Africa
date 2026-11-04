import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { RowDataPacket } from 'mysql2/promise';
import { getAuth, requireStaff } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { sendStaffInvitationEmail } from '@/lib/email';
import { getSiteUrl, rejectCrossOriginMutation } from '@/lib/security/request';

export const runtime = 'nodejs';

const INVITATION_LIFETIME_HOURS = 48;

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function invitationUrl(request: Request, token: string) {
  const url = new URL('/admin/accept-invitation', getSiteUrl(request));
  url.hash = token;
  return url.toString();
}

async function revokeAfterDeliveryFailure(id: string, tokenHash: string) {
  await getDatabase().execute(
    'UPDATE `staff_invitations` SET revoked_at = UTC_TIMESTAMP(3) WHERE id = ? AND token_hash = ? AND accepted_at IS NULL',
    [id, tokenHash],
  );
}

export async function GET(request: Request) {
  const authorization = await requireStaff(['administrator']);
  if (authorization.response) return authorization.response;

  try {
    const result = await getAuth().api.listUsers({
      query: { limit: 1000, offset: 0 },
      headers: request.headers,
    });
    const [invitationRows] = await getDatabase().execute<RowDataPacket[]>(
      `SELECT id, email, role, expires_at
       FROM staff_invitations
       WHERE accepted_at IS NULL AND revoked_at IS NULL
       ORDER BY created_at DESC`,
    );
    return Response.json({
      users: result.users.map((user) => ({
        user_id: user.id,
        email: user.email,
        role: user.role === 'admin' ? 'administrator' : 'editor',
        active: !user.banned,
        created_at: user.createdAt,
      })),
      invitations: invitationRows.map((row) => ({
        id: row.id as string,
        email: row.email as string,
        role: row.role as 'administrator' | 'editor',
        expires_at: row.expires_at instanceof Date ? row.expires_at.toISOString() : String(row.expires_at),
        expired: new Date(row.expires_at as string | Date).getTime() <= Date.now(),
      })),
    });
  } catch {
    console.error('Staff listing failed.');
    return Response.json({ error: 'Could not load staff and invitations.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const authorization = await requireStaff(['administrator']);
  if (authorization.response || !authorization.staff) return authorization.response;

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
  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashToken(token);
  let invitationId: string = randomUUID();
  const connection = await getDatabase().getConnection();
  try {
    await connection.beginTransaction();
    const [existingRows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, accepted_at, revoked_at FROM staff_invitations WHERE email = ? FOR UPDATE',
      [cleanEmail],
    );
    const existing = existingRows[0];
    if (existing && !existing.accepted_at && !existing.revoked_at) {
      await connection.rollback();
      return Response.json({ error: 'An invitation already exists for this email. Use Resend invitation to issue a fresh link.' }, { status: 409 });
    }

    const expiresAt = new Date(Date.now() + INVITATION_LIFETIME_HOURS * 60 * 60 * 1000);
    if (existing) {
      invitationId = existing.id as string;
      await connection.execute(
        `UPDATE staff_invitations
         SET role = ?, token_hash = ?, expires_at = ?, created_by = ?, accepted_at = NULL, revoked_at = NULL
         WHERE id = ?`,
        [role, tokenHash, expiresAt, authorization.staff.userId, existing.id],
      );
    } else {
      await connection.execute(
        `INSERT INTO staff_invitations (id, email, role, token_hash, expires_at, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [invitationId, cleanEmail, role, tokenHash, expiresAt, authorization.staff.userId],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
    if (code === 'ER_DUP_ENTRY') {
      return Response.json({ error: 'An invitation was just created for this email. Refresh the staff list and use Resend invitation if needed.' }, { status: 409 });
    }
    console.error('Staff invitation could not be saved.');
    return Response.json({ error: 'Could not create this invitation.' }, { status: 500 });
  } finally {
    connection.release();
  }

  try {
    await sendStaffInvitationEmail(cleanEmail, invitationUrl(request, token));
  } catch {
    try {
      await revokeAfterDeliveryFailure(invitationId, tokenHash);
    } catch {
      console.error('Failed invitation could not be revoked after email delivery failed.');
      return Response.json({ error: 'Email delivery failed and the pending invitation could not be revoked. Ask an administrator to resend or revoke it.' }, { status: 500 });
    }
    console.error('Staff invitation email delivery failed.');
    return Response.json({ error: 'Could not send the invitation email. The invitation was revoked; check SMTP configuration and retry.' }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
