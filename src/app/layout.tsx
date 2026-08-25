import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

/*
 * Self-hosted through next/font/local rather than the previous @fontsource CSS
 * imports. The typefaces are unchanged from the original design — Bebas Neue
 * for display, Jost for UI — only the loading mechanism is different, for two
 * reasons that matter to the performance and CLS budgets:
 *   1. Next emits <link rel="preload"> for these in the document head, so the
 *      faces are discovered immediately instead of three round trips deep
 *      (HTML → CSS → @font-face → woff2).
 *   2. `adjustFontFallback` synthesises a size-adjusted local fallback from the
 *      font's own metrics, so the swap from fallback to webfont does not shift
 *      layout.
 */
const display = localFont({
  src: './../fonts/bebas-neue-latin-400.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '400',
  style: 'normal',
  adjustFontFallback: 'Arial',
  // Condensed fallbacks, so a swap from the local metric-adjusted face to Bebas
  // does not visibly reflow the all-caps headlines.
  fallback: ['Arial Narrow', 'Haettenschweiler', 'Impact', 'sans-serif'],
});

const sans = localFont({
  src: [
    { path: './../fonts/jost-latin-variable.woff2', style: 'normal', weight: '100 900' },
    { path: './../fonts/jost-latin-variable-italic.woff2', style: 'italic', weight: '100 900' },
  ],
  variable: '--font-sans',
  display: 'swap',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'Salem International Christian Centre | Saving, Healing and Making Many Mighty',
  description:
    'Salem Africa is an international church family across 37 locations and 35 ministries, under the leadership of Archbishop Dr Sam Amaga — strong in faith, empowered by wisdom.',
  icons: { icon: '/images/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
