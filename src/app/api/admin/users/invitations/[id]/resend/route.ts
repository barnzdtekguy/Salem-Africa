import { createHash, randomBytes } from 'node:crypto';
import type { RowDataPacket } from 'mysql2/promise';
import { requireStaff } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { sendStaffInvitationEmail } from '@/lib/email';
import { getSiteUrl, rejectCrossOriginMutation } from '@/lib/security/request';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const authorization = await requireStaff(['administrator']);
  if (authorization.response || !authorization.staff) return authorization.response;
  const { id } = await context.params;

  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const connection = await getDatabase().getConnection();
  let email = '';
  try {
    await connection.beginTransaction();
    const [invitationRows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, email, role, accepted_at FROM staff_invitations WHERE id = ? FOR UPDATE',
      [id],
    );
    const invitation = invitationRows[0];
    if (!invitation) {
      await connection.rollback();
      return Response.json({ error: 'Invitation not found.' }, { status: 404 });
    }
    if (invitation.accepted_at) {
      await connection.rollback();
      return Response.json({ error: 'This invitation has already been accepted. Manage the existing staff account instead.' }, { status: 409 });
    }

    email = invitation.email as string;
    const [users] = await connection.execute<RowDataPacket[]>(
      'SELECT id FROM `user` WHERE email = ? LIMIT 1',
      [email],
    );
    if (users.length) {
      await connection.rollback();
      return Response.json({ error: 'An account now exists for this email. Manage the existing staff account instead.' }, { status: 409 });
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await connection.execute(
      `UPDATE staff_invitations
       SET token_hash = ?, expires_at = ?, created_by = ?, revoked_at = NULL
       WHERE id = ? AND accepted_at IS NULL`,
      [tokenHash, expiresAt, authorization.staff.userId, id],
    );
    await connection.commit();
  } catch {
    await connection.rollback();
    console.error('Staff invitation resend could not be saved.');
    return Response.json({ error: 'Could not resend this invitation.' }, { status: 500 });
  } finally {
    connection.release();
  }

  try {
    const url = new URL('/admin/accept-invitation', getSiteUrl(request));
    url.hash = token;
    await sendStaffInvitationEmail(email, url.toString());
  } catch {
    try {
      await getDatabase().execute(
        'UPDATE staff_invitations SET revoked_at = UTC_TIMESTAMP(3) WHERE id = ? AND token_hash = ? AND accepted_at IS NULL',
        [id, tokenHash],
      );
    } catch {
      console.error('Resent invitation could not be revoked after email delivery failed.');
      return Response.json({ error: 'Email delivery failed and the invitation could not be revoked. Ask an administrator to resend or revoke it.' }, { status: 500 });
    }
    console.error('Staff invitation resend email delivery failed.');
    return Response.json({ error: 'Could not send the invitation email. The invitation was revoked; check SMTP configuration and retry.' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
