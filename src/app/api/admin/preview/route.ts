import { z } from 'zod';
import { renderSafeMarkdown } from '@/lib/content/markdown';
import { requireStaff } from '@/lib/auth';
import { rejectCrossOriginMutation } from '@/lib/security/request';

const previewSchema = z.object({ markdown: z.string().max(30000) });

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const authorization = await requireStaff();
  if (authorization.response) return authorization.response;

  try {
    const body = previewSchema.parse(await request.json());
    return Response.json({ html: renderSafeMarkdown(body.markdown) });
  } catch (error) {
    return Response.json({
      error: error instanceof z.ZodError
        ? error.issues.map((issue) => `${issue.path.join(' ')}: ${issue.message}`).join(' ')
        : error instanceof Error ? error.message : 'Could not render the preview.',
    }, { status: 400 });
  }
}
