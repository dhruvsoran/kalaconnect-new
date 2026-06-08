import { PT_Sans, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';
import { WebSiteSchema } from '@/components/seo/WebSiteSchema';

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
  metadataBase: new URL('https://kalaconnect.com'),
  title: {
    default: 'कलाConnect — Indian Art Marketplace',
    template: '%s | कलाConnect',
  },
  description: 'Discover and shop authentic handcrafted Indian art. Support local artisans selling paintings, sculptures, sarees, and traditional crafts directly to you.',
  keywords: ['Indian art', 'handcrafted', 'artisans', 'paintings', 'sculptures', 'traditional art', 'Indian crafts', 'buy art online', 'KalaConnect'],
  authors: [{ name: 'KalaConnect' }],
  creator: 'KalaConnect',
  publisher: 'KalaConnect',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://kalaconnect.com',
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
  alternates: {
    canonical: 'https://kalaconnect.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${ptSans.variable} ${playfair.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="font-body antialiased min-h-screen relative">
        <OrganizationSchema />
        <WebSiteSchema />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
