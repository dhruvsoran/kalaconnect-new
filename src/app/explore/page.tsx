import type { Metadata } from 'next';
import ExploreContent from './ExploreContent';

export const metadata: Metadata = {
  title: 'Explore Artworks',
  description: 'Discover authentic handcrafted Indian art. Browse Madhubani paintings, Warli art, Tanjore paintings, sculptures, textiles, and traditional crafts from verified artisans.',
  alternates: { canonical: 'https://kalaconnect.me/explore' },
  openGraph: {
    title: 'Explore Artworks | कलाConnect',
    description: 'Discover authentic handcrafted Indian art from verified artisans.',
    url: 'https://kalaconnect.me/explore',
  },
};

export default function ExplorePage() {
  return <ExploreContent />;
}
