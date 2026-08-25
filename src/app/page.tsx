import { Header } from '@/components/header';
import { HeroSlider } from '@/components/hero-slider';
import { UpcomingEvents } from '@/components/upcoming-events';
import { FeatureBanner } from '@/components/feature-banner';
import { StatStrip } from '@/components/stat-strip';
import { WelcomeMessage } from '@/components/welcome-message';
import { ExploreGrid } from '@/components/explore-grid';
import { VisionHighlights } from '@/components/vision-highlights';
import { LeadershipMarquee } from '@/components/leadership-marquee';
import { CtaBox } from '@/components/cta-box';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSlider />
      <WelcomeMessage />
      <UpcomingEvents />
      <FeatureBanner />
      <StatStrip />
      <ExploreGrid />
      <VisionHighlights />
      <LeadershipMarquee />
      <CtaBox />
      <Footer />
    </>
  );
}
