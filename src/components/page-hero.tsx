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
      <Image src={image} alt="" fill priority className="object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

      <div className="relative z-10 mx-auto w-full max-w-container px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="max-w-2xl">
          {eyebrow && <p className="kicker mb-3 text-sm text-white/85">{eyebrow}</p>}
          <h1 className="text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-4 max-w-lg text-sm text-white/70 sm:text-base">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
