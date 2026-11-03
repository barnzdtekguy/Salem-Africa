import { randomUUID } from 'node:crypto';
import { ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { requireStaff } from '@/lib/auth';
import { getObjectStorage } from '@/lib/storage/s3';
import { rejectCrossOriginMutation } from '@/lib/security/request';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Map([
  ['image/jpeg', { extension: 'jpg', signature: (bytes: Uint8Array) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff }],
  ['image/png', { extension: 'png', signature: (bytes: Uint8Array) => bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 }],
  ['image/webp', { extension: 'webp', signature: (bytes: Uint8Array) => String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP' }],
]);

export async function GET() {
  const authorization = await requireStaff();
  if (authorization.response) return authorization.response;

  try {
    const { client, bucket } = getObjectStorage();
    const result = await client.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: 'admin-media/',
      MaxKeys: 1000,
    }));
    return Response.json({
      files: (result.Contents ?? [])
        .filter((object) => object.Key && object.Key !== 'admin-media/')
        .map((object) => ({
          name: object.Key?.split('/').at(-1) ?? '',
          url: `/media/${object.Key}`,
          created_at: object.LastModified?.toISOString() ?? null,
        })),
    });
  } catch (error) {
    console.error('Media library listing failed.', error);
    return Response.json({ error: 'Could not load uploaded images.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const authorization = await requireStaff();
  if (authorization.response) return authorization.response;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Choose a valid image upload.' }, { status: 400 });
  }
  const file = formData.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Choose an image to upload.' }, { status: 400 });
  if (file.size < 1 || file.size > MAX_FILE_BYTES) {
    return Response.json({ error: 'Images must be smaller than 10 MB.' }, { status: 413 });
  }

  const accepted = ACCEPTED_TYPES.get(file.type);
  if (!accepted) return Response.json({ error: 'Use a JPEG, PNG, or WebP image.' }, { status: 415 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!accepted.signature(bytes)) return Response.json({ error: 'The image content does not match its file type.' }, { status: 415 });

  const altTextValue = formData.get('altText');
  const altText = typeof altTextValue === 'string' ? altTextValue.trim().slice(0, 300) : '';
  const key = `admin-media/${randomUUID()}.${accepted.extension}`;
  try {
    const { client, bucket } = getObjectStorage();
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: bytes,
      ContentLength: bytes.byteLength,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000, immutable',
    }));
  } catch (error) {
    console.error('Media upload failed.', error);
    return Response.json({ error: 'Image upload failed. Check the persistent storage configuration and try again.' }, { status: 500 });
  }

  return Response.json({ url: `/media/${key}`, alt: altText, path: key }, { status: 201 });
}
