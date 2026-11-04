import { createHash, randomBytes } from 'node:crypto';
import type { RowDataPacket } from 'mysql2/promise';
import { requireStaff } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { sendStaffInvitationEmail } from '@/lib/email';
import { logServerError } from '@/lib/security/diagnostics';
import { getSiteUrl, rejectCrossOriginMutation } from '@/lib/security/request';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  let authorization;
  try {
    authorization = await requireStaff(['administrator']);
  } catch (error) {
    logServerError('staff_invitation_resend_authorization_failed', error);
    return Response.json({ error: 'Could not verify staff-management access.' }, { status: 500 });
  }
  if (authorization.response || !authorization.staff) return authorization.response;
  const { id } = await context.params;

  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  let url: string;
  try {
    url = new URL('/admin/accept-invitation', getSiteUrl(request)).toString();
    const invitationUrl = new URL(url);
    invitationUrl.hash = token;
    url = invitationUrl.toString();
  } catch (error) {
    logServerError('staff_invitation_resend_url_configuration_failed', error);
    return Response.json({ error: 'The staff invitation link could not be configured. Contact the site administrator.' }, { status: 503 });
  }
  let connection;
  try {
    connection = await getDatabase().getConnection();
  } catch (error) {
    logServerError('staff_invitation_resend_database_connection_failed', error);
    return Response.json({ error: 'Could not connect to the staff database. No invitation was resent.' }, { status: 503 });
  }
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
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await connection.execute(
      `UPDATE staff_invitations
       SET token_hash = ?, expires_at = ?, created_by = ?, revoked_at = NULL
       WHERE id = ? AND accepted_at IS NULL`,
      [tokenHash, expiresAt, authorization.staff.userId, id],
    );
    await connection.commit();
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      logServerError('staff_invitation_resend_rollback_failed', rollbackError);
    }
    logServerError('staff_invitation_resend_database_save_failed', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_NO_SUCH_TABLE') {
      return Response.json(
        { error: 'Staff invitations are not configured in the production database. Apply db/migrations/002_staff_invitations.sql, then retry.' },
        { status: 503 },
      );
    }
    return Response.json({ error: 'Could not save the invitation update. No invitation email was sent.' }, { status: 500 });
  } finally {
    connection.release();
  }

  try {
    await sendStaffInvitationEmail(email, url);
  } catch (error) {
    logServerError('staff_invitation_resend_email_delivery_failed', error);
    try {
      await getDatabase().execute(
        'UPDATE staff_invitations SET revoked_at = UTC_TIMESTAMP(3) WHERE id = ? AND token_hash = ? AND accepted_at IS NULL',
        [id, tokenHash],
      );
    } catch (revokeError) {
      logServerError('staff_invitation_resend_email_failure_revoke_failed', revokeError);
      return Response.json({ error: 'Email delivery failed and the invitation could not be revoked. Ask an administrator to resend or revoke it.' }, { status: 500 });
    }
    return Response.json({ error: 'Could not send the invitation email. The invitation was revoked; check SMTP configuration and retry.' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
