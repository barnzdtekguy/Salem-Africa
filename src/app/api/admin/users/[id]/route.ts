import { requireStaff } from '@/lib/auth';
import { getAuth } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { rejectCrossOriginMutation } from '@/lib/security/request';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const authorization = await requireStaff(['administrator']);
  if (authorization.response || !authorization.staff) return authorization.response;
  const { id } = await context.params;
  if (id === authorization.staff.userId) {
    return Response.json({ error: 'You cannot deactivate your own administrator account.' }, { status: 400 });
  }

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return Response.json({ error: 'Provide a valid staff update.' }, { status: 400 });
  const { role, active } = body as { role?: unknown; active?: unknown };
  if ((role !== undefined && role !== 'administrator' && role !== 'editor')
    || (active !== undefined && typeof active !== 'boolean')
    || (role === undefined && active === undefined)) {
    return Response.json({ error: 'Choose a valid role or active status.' }, { status: 400 });
  }

  const auth = getAuth();
  const headers = request.headers;
  let current;
  try {
    current = await auth.api.getUser({ query: { id }, headers });
  } catch (error) {
    console.error('Staff account lookup failed.', error);
    return Response.json({ error: 'Could not verify this staff account.' }, { status: 500 });
  }
  if (!current) return Response.json({ error: 'Staff account not found.' }, { status: 404 });

  const removingAdmin = current.role === 'admin'
    && !current.banned
    && ((typeof active === 'boolean' && !active) || role === 'editor');
  if (removingAdmin) {
    try {
      const [rows] = await getDatabase().execute<import('mysql2/promise').RowDataPacket[]>(
        "SELECT COUNT(*) AS count FROM `user` WHERE role = 'admin' AND (banned = 0 OR banned IS NULL)",
      );
      if (Number(rows[0]?.count ?? 0) <= 1) {
        return Response.json({ error: 'At least one active administrator must remain.' }, { status: 400 });
      }
    } catch (error) {
      console.error('Active administrator count failed.', error);
      return Response.json({ error: 'Could not verify administrator safety.' }, { status: 500 });
    }
  }

  try {
    if (role === 'administrator' || role === 'editor') {
      await auth.api.setRole({
        body: { userId: id, role: role === 'administrator' ? 'admin' : 'user' },
        headers,
      });
    }
    if (typeof active === 'boolean') {
      if (active) {
        await auth.api.unbanUser({ body: { userId: id }, headers });
      } else {
        await auth.api.banUser({ body: { userId: id }, headers });
      }
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Staff account update failed.', error);
    return Response.json({ error: 'Could not update this staff account.' }, { status: 500 });
  }
}
