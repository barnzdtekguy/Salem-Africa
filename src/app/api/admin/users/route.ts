import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { RowDataPacket } from 'mysql2/promise';
import { getAuth, requireStaff } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { sendStaffInvitationEmail } from '@/lib/email';
import { logServerError } from '@/lib/security/diagnostics';
import { getSiteUrl, rejectCrossOriginMutation } from '@/lib/security/request';

export const runtime = 'nodejs';

const INVITATION_LIFETIME_HOURS = 48;

function getErrorCode(error: unknown) {
  return error && typeof error === 'object' && 'code' in error ? error.code : undefined;
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function invitationUrl(request: Request, token: string) {
  const url = new URL('/admin/accept-invitation', getSiteUrl(request));
  url.hash = token;
  return url.toString();
}

export async function GET(request: Request) {
  let authorization;
  try {
    authorization = await requireStaff(['administrator']);
  } catch (error) {
    logServerError('staff_listing_authorization_failed', error);
    return Response.json({ error: 'Could not verify staff-management access.' }, { status: 500 });
  }
  if (authorization.response) return authorization.response;

  let users;
  try {
    const result = await getAuth().api.listUsers({
      query: { limit: 1000, offset: 0 },
      headers: request.headers,
    });
    users = result.users.map((user) => ({
      user_id: user.id,
      email: user.email,
      role: user.role === 'admin' ? 'administrator' : 'editor',
      active: !user.banned,
      created_at: user.createdAt,
    }));
  } catch (error) {
    logServerError('staff_listing_better_auth_failed', error);
    return Response.json({ error: 'Could not load staff accounts.' }, { status: 500 });
  }

  let invitationRows: RowDataPacket[];
  try {
    [invitationRows] = await getDatabase().execute<RowDataPacket[]>(
      `SELECT id, email, role, expires_at
       FROM staff_invitations
       WHERE accepted_at IS NULL AND revoked_at IS NULL
       ORDER BY created_at DESC`,
    );
  } catch (error) {
    logServerError('staff_listing_invitations_query_failed', error);
    if (getErrorCode(error) === 'ER_NO_SUCH_TABLE') {
      return Response.json(
        {
          users,
          invitations: [],
          invitationSetupRequired: true,
        },
      );
    }
    return Response.json({ error: 'Could not load pending invitations.' }, { status: 500 });
  }

  return Response.json({
    users,
    invitations: invitationRows.map((row) => ({
      id: row.id as string,
      email: row.email as string,
      role: row.role as 'administrator' | 'editor',
      expires_at: row.expires_at instanceof Date ? row.expires_at.toISOString() : String(row.expires_at),
      expired: new Date(row.expires_at as string | Date).getTime() <= Date.now(),
    })),
  });
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  let authorization;
  try {
    authorization = await requireStaff(['administrator']);
  } catch (error) {
    logServerError('staff_invitation_authorization_failed', error);
    return Response.json({ error: 'Could not verify staff-management access.' }, { status: 500 });
  }
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
  let url: string;
  try {
    url = invitationUrl(request, token);
  } catch (error) {
    logServerError('staff_invitation_url_configuration_failed', error);
    return Response.json({ error: 'The staff invitation link could not be configured. Contact the site administrator.' }, { status: 503 });
  }
  let invitationId: string = randomUUID();
  let connection;
  try {
    connection = await getDatabase().getConnection();
  } catch (error) {
    logServerError('staff_invitation_database_connection_failed', error);
    return Response.json({ error: 'Could not connect to the staff database. No invitation was created.' }, { status: 503 });
  }
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
    try {
      await connection.rollback();
    } catch (rollbackError) {
      logServerError('staff_invitation_rollback_failed', rollbackError);
    }
    logServerError('staff_invitation_database_save_failed', error);
    const code = getErrorCode(error);
    if (code === 'ER_NO_SUCH_TABLE') {
      return Response.json(
        { error: 'Staff invitations are not configured in the production database. Apply db/migrations/002_staff_invitations.sql, then retry.' },
        { status: 503 },
      );
    }
    if (code === 'ER_DUP_ENTRY') {
      return Response.json({ error: 'An invitation was just created for this email. Refresh the staff list and use Resend invitation if needed.' }, { status: 409 });
    }
    return Response.json({ error: 'Could not save the invitation in the staff database. No invitation email was sent.' }, { status: 500 });
  } finally {
    connection.release();
  }

  try {
    await sendStaffInvitationEmail(cleanEmail, url);
  } catch (error) {
    logServerError('staff_invitation_email_delivery_failed', error);
    return Response.json(
      {
        error: 'The invitation was saved, but its email could not be delivered. It remains pending; check SMTP settings and use Resend invitation.',
        invitationPending: true,
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
