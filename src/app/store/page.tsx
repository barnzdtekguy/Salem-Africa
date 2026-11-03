import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, ExternalLink, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/page-shell';

export const metadata: Metadata = { title: 'Fresh Impact Bookshop | Salem Africa' };

const BOOKSHOP_URL = 'https://www.freshimpact.store/';

const FEATURED_BOOKS = [
  {
    title: 'No Success By Accident',
    theme: 'Purpose and personal growth',
    description: 'Explore a thoughtful guide to the commitment and choices behind lasting success.',
    href: `${BOOKSHOP_URL}product/no-success-by-accident/`,
    image: 'https://www.freshimpact.store/wp-content/uploads/2024/05/NO-SUCCESS-BY-ACCIDENT-Inner-1.jpg',
  },
  {
    title: 'Wisdom For Triumph',
    theme: 'Faith and wisdom',
    description: 'Discover practical inspiration for building a life grounded in godly wisdom.',
    href: `${BOOKSHOP_URL}product/wisdom-for-triumph/`,
    image: 'https://www.freshimpact.store/wp-content/uploads/2023/10/Wisdom-for-Triumph-mockup.jpg',
  },
  {
    title: 'Creative Thinking For Unthinkable Success',
    theme: 'Creativity and success',
    description: 'Find fresh ideas and inspiration for approaching success with creativity.',
    href: `${BOOKSHOP_URL}product/creative-thinking-for-unthinkable-success/`,
    image: 'https://www.freshimpact.store/wp-content/uploads/2024/05/Creative-Thinking-For-Unthinkable-Succes_Page_001-copy.jpg',
  },
  {
    title: 'You Are A Daily Miracle',
    theme: 'Faith and encouragement',
    description: 'A daily reminder to see the extraordinary possibilities in the life you have been given.',
    href: `${BOOKSHOP_URL}product/you-are-a-daily-miracle/`,
    image: 'https://www.freshimpact.store/wp-content/uploads/2023/10/You-are-a-daily-Miracle.jpg',
  },
];

export default function StorePage() {
  return (
    <PageShell>
      <main>
        <section className="bookshop-hero">
          <div className="bookshop-hero-inner">
            <div className="bookshop-hero-copy">
              <p className="bookshop-eyebrow"><span /><Sparkles size={14} /> Fresh Impact Bookshop</p>
              <h1>Words to inspire your <em>next chapter.</em></h1>
              <p className="bookshop-lede">
                Find books and resources to nurture your faith, grow in wisdom, and live with purpose.
              </p>
              <div className="bookshop-actions">
                <a className="bookshop-primary" href={BOOKSHOP_URL} target="_blank" rel="noopener noreferrer">
                  Explore the bookshop <ExternalLink size={16} aria-hidden="true" />
                </a>
                <a className="bookshop-secondary" href="#featured-books">
                  Discover featured books <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
              <p className="bookshop-note">You’ll continue to the official Fresh Impact online shop.</p>
            </div>

            <div className="bookshop-hero-books" aria-label="Featured books from Fresh Impact">
              {FEATURED_BOOKS.slice(0, 3).map((book) => (
                <a key={book.title} href={book.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${book.title}`}>
                  <Image src={book.image} alt={book.title} width={480} height={360} sizes="(max-width: 760px) 30vw, 190px" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="featured-books" className="bookshop-featured">
          <div className="bookshop-section-heading">
            <p className="bookshop-eyebrow"><span />Handpicked for you</p>
            <h2>Start with a story that <em>moves you forward.</em></h2>
            <p>Explore a few reader favorites, then visit the shop to find more.</p>
          </div>

          <div className="bookshop-product-grid">
            {FEATURED_BOOKS.map((book) => (
              <article className="bookshop-product" key={book.title}>
                <a className="bookshop-product-image" href={book.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${book.title}`}>
                  <Image src={book.image} alt={book.title} fill sizes="(max-width: 760px) 40vw, (max-width: 1100px) 30vw, 220px" />
                </a>
                <div className="bookshop-product-copy">
                  <p className="bookshop-product-theme">{book.theme}</p>
                  <h3>{book.title}</h3>
                  <p>{book.description}</p>
                  <a href={book.href} target="_blank" rel="noopener noreferrer">
                    View this book <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="bookshop-bottom-link">
            <p>Looking for something else? Browse the full Fresh Impact collection.</p>
            <a className="bookshop-primary" href={BOOKSHOP_URL} target="_blank" rel="noopener noreferrer">
              Visit the online shop <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
