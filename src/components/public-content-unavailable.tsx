import { PageHero } from '@/components/page-hero';
import { PageShell } from '@/components/page-shell';

export function PublicContentUnavailable({
  title,
  image,
}: {
  title: string;
  image: string;
}) {
  return (
    <PageShell>
      <PageHero
        eyebrow="Temporarily unavailable"
        title={title}
        subtitle="This information is temporarily unavailable. Please try again later."
        image={image}
      />
      <main className="mx-auto max-w-container px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <p className="text-sm leading-7 text-ink-muted">We’re having trouble loading this content right now.</p>
      </main>
    </PageShell>
  );
}
