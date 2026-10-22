import Image from 'next/image';

export function PageHero({
  title,
  subtitle,
  image,
  eyebrow,
}: {
  title: string;
  subtitle: string;
  image: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative flex h-[56vh] min-h-[420px] items-end overflow-hidden bg-black">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />

      <div className="relative z-10 mx-auto w-full max-w-container px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-4 flex items-center gap-3 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
              <span className="h-0.5 w-6 bg-terracotta" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/80 sm:text-base">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
