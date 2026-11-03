import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getObjectStorage } from '@/lib/storage/s3';

type RouteContext = { params: Promise<{ key: string[] }> };

export async function GET(_request: Request, context: RouteContext) {
  const { key: parts } = await context.params;
  const key = parts.join('/');
  if (!key.startsWith('admin-media/') || key.includes('..') || key.includes('\\')) {
    return new Response('Not found.', { status: 404 });
  }

  try {
    const { client, bucket } = getObjectStorage();
    const object = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    if (!object.Body) return new Response('Not found.', { status: 404 });
    return new Response(object.Body.transformToWebStream(), {
      headers: {
        'Content-Type': object.ContentType ?? 'application/octet-stream',
        'Cache-Control': object.CacheControl ?? 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (typeof error === 'object' && error !== null && '$metadata' in error) {
      const metadata = error.$metadata;
      if (typeof metadata === 'object' && metadata !== null && 'httpStatusCode' in metadata && metadata.httpStatusCode === 404) {
        return new Response('Not found.', { status: 404 });
      }
    }
    console.error('Public media read failed.', error);
    return new Response('Media is temporarily unavailable.', { status: 500 });
  }
}
