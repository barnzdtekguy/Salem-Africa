import { SalemMomentsCarousel } from '@/components/salem-moments-carousel';
import { Header } from '@/components/header';
import { HeroSlider } from '@/components/hero-slider';
import { HomeQuickAccess } from '@/components/home-quick-access';
import { UpcomingEvents } from '@/components/upcoming-events';
import { FeatureBanner } from '@/components/feature-banner';
import { StatStrip } from '@/components/stat-strip';
import { WelcomeMessage } from '@/components/welcome-message';
import { ExploreGrid } from '@/components/explore-grid';
import { HomeMediaPreview } from '@/components/home-media-preview';
import { HomeMinistryPreview } from '@/components/home-ministry-preview';
import { VisionHighlights } from '@/components/vision-highlights';
import { LeadershipMarquee } from '@/components/leadership-marquee';
import { CtaBox } from '@/components/cta-box';
import { Footer } from '@/components/footer';
import { SalemUniversity } from '@/components/salem-university';
import Link from 'next/link';
import { ArrowRight, HandCoins, MapPin, PlayCircle, UsersRound } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="home-page">
        <HeroSlider />
        <section aria-labelledby="start-here-heading" className="next-step-strip textured border-b border-sand-line bg-white py-8 sm:py-10">
          <div className="next-step-layout mx-auto flex max-w-container flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="section-title-group">
              <p className="font-label text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-dark">
                Your next step
              </p>
              <h2 id="start-here-heading" className="mt-1 font-display text-xl text-ink">
                Where would you like to start?
              </h2>
            </div>
            <nav aria-label="Quick links" className="flex w-full flex-nowrap justify-center gap-2 overflow-x-auto lg:w-auto">
              {[
                { href: '/churches', label: 'Plan a visit', icon: MapPin },
                { href: '/ministries', label: 'Our departments', icon: UsersRound },
                { href: '/media/messages', label: 'Watch a message', icon: PlayCircle },
                { href: '/give', label: 'Give', icon: HandCoins },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-semibold text-ink transition hover:border-gold/60 hover:text-ink"
                >
                  <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                  {label}
                  <ArrowRight size={13} className="text-gold-dark" aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </div>
        </section>
        <WelcomeMessage />
        <StatStrip />
        <VisionHighlights />
        <SalemUniversity />
        <HomeMinistryPreview />
        <UpcomingEvents />
        <SalemMomentsCarousel />
        <HomeMediaPreview />
        <LeadershipMarquee />
        <ExploreGrid />
        <FeatureBanner />
        <CtaBox />
      </main>
      <Footer />
      <HomeQuickAccess />
    </>
  );
}
