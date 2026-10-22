import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { WHATSAPP_PHONE_NUMBER } from '@/data/contact';
import './globals.css';

// A single locally hosted variable face keeps the editorial headings and UI cohesive.
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
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <WhatsAppButton phoneNumber={WHATSAPP_PHONE_NUMBER} />
      </body>
    </html>
  );
}
