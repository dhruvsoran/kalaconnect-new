import type { Metadata } from 'next';
import ExploreContent from './ExploreContent';

export const metadata: Metadata = {
  title: 'Explore Artworks',
  description: 'Browse authentic handcrafted Indian art for sale. Shop Madhubani paintings, Warli tribal art, Tanjore gold-leaf paintings, Pichwai devotional art, Rajasthani miniatures, handwoven Banarasi silk sarees, Kanchipuram weaves, traditional Indian sculptures, and more. Direct from verified artisans. Fair prices, pan-India delivery with cash on delivery.',
  alternates: { canonical: 'https://kalaconnect.me/explore' },
  openGraph: {
    title: 'Explore Artworks | कलाConnect',
    description: 'Browse authentic handcrafted Indian art for sale — Madhubani, Warli, Tanjore, Pichwai, miniatures, textiles, and sculptures directly from verified artisans.',
    url: 'https://kalaconnect.me/explore',
  },
};

export default function ExplorePage() {
  return <ExploreContent />;
}
