import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE, SITE_URL } from '@/lib/site';
import { JsonLd, orgLd, siteLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { siteName: SITE.name, locale: SITE.locale, type: 'website' },
  twitter: { card: 'summary_large_image' },
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#101b33' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=DM+Mono&family=Instrument+Sans:wght@400;500;600;700&display=swap"
        />
        <link rel="llms" href="/llms.txt" />
      </head>
      <body>
        <JsonLd data={[orgLd(), siteLd()]} />
        {children}
      </body>
    </html>
  );
}
