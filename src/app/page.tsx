import type { Metadata } from 'next';
import { HomePage } from '@/components/home-page';

export const metadata: Metadata = {
  title: 'कलाConnect — Indian Art Marketplace | Buy Handcrafted Art Online',
  description: 'Discover and shop authentic handcrafted Indian art. Support local artisans selling Madhubani paintings, Warli art, Tanjore paintings, sculptures, sarees, and traditional crafts directly to you.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://kalaconnect.me',
    siteName: 'कलाConnect',
    title: 'कलाConnect — Indian Art Marketplace',
    description: 'Discover and shop authentic handcrafted Indian art. Support local artisans selling paintings, sculptures, sarees, and traditional crafts.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'कलाConnect — Indian Art Marketplace',
    description: 'Discover and shop authentic handcrafted Indian art. Support local artisans.',
  },
  alternates: {
    canonical: 'https://kalaconnect.me',
  },
};

export default function Page() {
  return <HomePage />;
}
