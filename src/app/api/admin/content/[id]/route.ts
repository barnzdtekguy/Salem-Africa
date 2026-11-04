import { invalidatePublicContent } from '../route';
import { deleteContent, getContentById, updateContent } from '@/lib/content/repository';
import { contentValidationMessage, parseContentInput } from '@/lib/content/validation';
import { requireStaff } from '@/lib/auth';
import { rejectCrossOriginMutation } from '@/lib/security/request';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const authorization = await requireStaff();
  if (authorization.response || !authorization.staff) return authorization.response;

  try {
    const { id } = await context.params;
    let input: ReturnType<typeof parseContentInput>;
    try {
      input = parseContentInput(await request.json());
    } catch (error) {
      return Response.json({ error: contentValidationMessage(error) }, { status: 400 });
    }
    if (!input.expected_version) {
      return Response.json({ error: 'Reload this item before saving to prevent overwriting newer edits.' }, { status: 400 });
    }
    const previous = await getContentById(id);
    const item = await updateContent(id, input.expected_version, input, authorization.staff);
    if (!item) {
      const current = await getContentById(id);
      return current
        ? Response.json({ error: 'This item changed since you opened it. Reload before saving to avoid losing another editor’s changes.' }, { status: 409 })
        : Response.json({ error: 'Content item not found.' }, { status: 404 });
    }
    invalidatePublicContent(item.kind, item.slug);
    if (previous && previous.slug !== item.slug) invalidatePublicContent(previous.kind, previous.slug);
    return Response.json({ item });
  } catch (error) {
    const duplicate = typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_DUP_ENTRY';
    if (duplicate) return Response.json({ error: 'That page address is already in use.' }, { status: 409 });
    console.error('Admin content update failed.', error);
    return Response.json({ error: 'Could not save this content.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const authorization = await requireStaff();
  if (authorization.response || !authorization.staff) return authorization.response;
  const { id } = await context.params;
  const version = Number(new URL(request.url).searchParams.get('version'));
  if (!Number.isInteger(version) || version < 1) {
    return Response.json({ error: 'Reload this item before deleting it.' }, { status: 400 });
  }

  try {
    const current = await getContentById(id);
    if (!current) return Response.json({ error: 'Content item not found.' }, { status: 404 });
    const deleted = await deleteContent(id, version);
    if (!deleted) return Response.json({ error: 'This item changed since you opened it. Reload before deleting.' }, { status: 409 });
    invalidatePublicContent(current.kind, current.slug);
  } catch (error) {
    console.error('Admin content deletion failed.', error);
    return Response.json({ error: 'Could not delete this content.' }, { status: 500 });
  }
  return Response.json({ ok: true });
}
