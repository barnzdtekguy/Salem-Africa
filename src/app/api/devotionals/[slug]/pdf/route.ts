import { generateDevotionalPdf } from '@/lib/content/devotional-pdf.mjs';
import { getPublicDevotional } from '@/lib/content/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const item = await getPublicDevotional(slug);
  if (!item) return new Response('Devotional not found.', { status: 404 });

  try {
    const bytes = await generateDevotionalPdf(item);
    const safeSlug = item.slug.replace(/[^a-z0-9-]/gi, '-');
    return new Response(new Uint8Array(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="salem-africa-devotional-${safeSlug}.pdf"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Devotional PDF generation failed.', error);
    return new Response('Could not generate the devotional PDF.', { status: 500 });
  }
}
