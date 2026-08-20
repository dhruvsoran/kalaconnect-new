import { PT_Sans, Playfair_Display } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';
import { WebSiteSchema } from '@/components/seo/WebSiteSchema';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import { GoogleAnalytics } from '@/components/google-analytics';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kalaconnect.me'),
  title: {
    default: 'कलाConnect — Indian Art Marketplace',
    template: '%s | कलाConnect',
  },
  description: 'KalaConnect is India\'s trusted marketplace for authentic handcrafted art. Shop Madhubani paintings, Warli tribal art, Tanjore gold-leaf paintings, Pichwai devotional art, Rajasthani miniatures, handwoven Banarasi silk sarees, Kanchipuram weaves, traditional Indian sculptures, and more — directly from verified artisans. Fair prices, direct-from-artist purchases, pan-India delivery with cash on delivery.',
  keywords: ['Indian art', 'handcrafted', 'artisans', 'Madhubani paintings', 'Warli art', 'Tanjore paintings', 'Pichwai paintings', 'Rajasthani miniatures', 'Indian sculpture', 'handwoven textiles', 'Banarasi silk', 'Kanchipuram sarees', 'traditional Indian art', 'buy art online', 'Indian handicrafts', 'KalaConnect', 'Indian art marketplace'],
  authors: [{ name: 'KalaConnect' }],
  creator: 'KalaConnect',
  publisher: 'KalaConnect',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: { url: '/favicon-180x180.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.kalaconnect.me',
    siteName: 'कलाConnect',
    title: 'कलाConnect — Indian Art Marketplace',
    description: 'Discover and shop authentic handcrafted Indian art. Support local artisans selling paintings, sculptures, sarees, and traditional crafts.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'कलाConnect - Indian Art Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'कलाConnect — Indian Art Marketplace',
    description: 'Discover and shop authentic handcrafted Indian art. Support local artisans.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '4Qv0hWyMwDVhoz6riJz8zRr_rxYVtkjy4jiLVr03pTk',
    other: {
      'msvalidate.01': 'DDF8E6D2CA514B6FBE5E3BF4071F3FF5',
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-8760219681435243',
  },

};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${ptSans.variable} ${playfair.variable}`}>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="font-body antialiased min-h-screen relative">
        <OrganizationSchema />
        <WebSiteSchema />
        <LocalBusinessSchema />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
