export function rejectCrossOriginMutation(request: Request) {
  const origin = request.headers.get('origin');
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
    : new URL(request.url).origin;
  if (!origin || origin !== configuredOrigin) {
    return Response.json({ error: 'Request origin could not be verified.' }, { status: 403 });
  }
  return null;
}

export function getSiteUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) throw new Error('Set NEXT_PUBLIC_SITE_URL to the canonical website URL.');
  return new URL(configuredUrl, request.url);
}
