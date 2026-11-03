import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { PageHero } from '@/components/page-hero';
import { MediaTabs } from '@/components/media-tabs';
import { PhotoGallery } from '@/components/photo-gallery';
export const metadata: Metadata = { title: 'Photo Library | Salem Africa', description:'Explore photographs from Salem Lagos services, the Salem Africa Outpouring Conference 2026 and life in our church family.' };
export default function PicturesPage(){return <PageShell><main><PageHero eyebrow="Our family in pictures" title="Moments that stay with us." subtitle="Faith in the room. Joy in every face. Explore our services, worship and life together." image="/images/hero/salem-hero-013.webp"/><MediaTabs/><section className="textured gallery-section"><div className="gallery-intro"><p className="eyebrow">The Salem photo library</p><h2>A living story of <em>faith.</em></h2><p>Browse our albums. Open a photograph to see it in full.</p></div><PhotoGallery/></section></main></PageShell>}
