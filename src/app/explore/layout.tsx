import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Explore Indian Art — Handcrafted Paintings & Crafts',
  description: 'Browse our curated collection of authentic Indian art. Hand-painted Madhubani, Warli, Tanjore paintings, terracotta sculptures, and traditional crafts from verified artisans.',
  openGraph: {
    title: 'Explore Indian Art — कलाConnect',
    description: 'Browse authentic handcrafted Indian art from verified artisans.',
    url: 'https://www.kalaconnect.me/explore',
  },
  alternates: {
    canonical: 'https://www.kalaconnect.me/explore',
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.kalaconnect.me' },
          { name: 'Explore Art', url: 'https://www.kalaconnect.me/explore' },
        ]}
      />
      {children}
    </>
  );
}
