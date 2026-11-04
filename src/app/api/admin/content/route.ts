import { revalidatePath, revalidateTag } from 'next/cache';
import { createContent, listContent } from '@/lib/content/repository';
import { contentValidationMessage, parseContentInput } from '@/lib/content/validation';
import { requireStaff } from '@/lib/auth';
import { rejectCrossOriginMutation } from '@/lib/security/request';

export async function GET(request: Request) {
  const authorization = await requireStaff();
  if (authorization.response) return authorization.response;

  const { searchParams } = new URL(request.url);
  const kind = searchParams.get('kind');
  const status = searchParams.get('status');
  const query = searchParams.get('q')?.trim() ?? '';
  try {
    const items = await listContent({
      kind: kind && ['weekly_program', 'event', 'devotional'].includes(kind) ? kind as 'weekly_program' | 'event' | 'devotional' : undefined,
      status: status && ['draft', 'scheduled', 'published', 'archived'].includes(status) ? status as 'draft' | 'scheduled' | 'published' | 'archived' : undefined,
      query,
    });
    return Response.json({ items });
  } catch (error) {
    console.error('Admin content query failed.', error);
    return Response.json({ error: 'Could not load content.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const authorization = await requireStaff();
  if (authorization.response || !authorization.staff) return authorization.response;

  let input: ReturnType<typeof parseContentInput>;
  try {
    input = parseContentInput(await request.json());
  } catch (error) {
    return Response.json({ error: contentValidationMessage(error) }, { status: 400 });
  }

  const slug = input.slug || input.title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 170);
  if (!slug) return Response.json({ error: 'Add a title that can be used to create a page address.' }, { status: 400 });

  try {
    const item = await createContent({ ...input, slug }, authorization.staff);
    invalidatePublicContent(item.kind, item.slug);
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    const duplicate = typeof error === 'object' && error !== null && 'code' in error && error.code === 'ER_DUP_ENTRY';
    if (duplicate) return Response.json({ error: 'That page address is already in use.' }, { status: 409 });
    console.error('Admin content creation failed.', error);
    return Response.json({ error: 'Could not save this content.' }, { status: 500 });
  }
}

export function invalidatePublicContent(kind: string, slug?: string) {
  revalidateTag('public-content');
  if (kind === 'event') {
    revalidatePath('/events');
    if (slug) revalidatePath(`/events/${slug}`);
  }
  if (kind === 'weekly_program') {
    revalidatePath('/');
    revalidatePath('/events');
    if (slug) revalidatePath(`/weekly-programmes/${slug}`);
  }
  if (kind === 'devotional') {
    revalidatePath('/devotionals');
    if (slug) revalidatePath(`/devotionals/${slug}`);
    revalidatePath('/');
  }
}
