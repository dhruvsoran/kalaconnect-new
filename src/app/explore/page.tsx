import type { Metadata } from 'next';
import { getDb } from '@/lib/mongodb';
import ExploreContent from './ExploreContent';

export const metadata: Metadata = {
  title: 'Explore Artworks',
  description: 'Browse authentic handcrafted Indian art for sale. Shop Madhubani paintings, Warli tribal art, Tanjore gold-leaf paintings, Pichwai devotional art, Rajasthani miniatures, handwoven Banarasi silk sarees, Kanchipuram weaves, traditional Indian sculptures, and more. Direct from verified artisans. Fair prices, pan-India delivery with cash on delivery.',
  alternates: { canonical: 'https://www.kalaconnect.me/explore' },
  openGraph: {
    title: 'Explore Artworks | कलाConnect',
    description: 'Browse authentic handcrafted Indian art for sale — Madhubani, Warli, Tanjore, Pichwai, miniatures, textiles, and sculptures directly from verified artisans.',
    url: 'https://www.kalaconnect.me/explore',
  },
};

export const revalidate = 60;

async function getProducts() {
  try {
    const db = await getDb();
    const col = db.collection('products');
    const items = await col.find({ status: 'Active' }).sort({ createdAt: -1 }).toArray();
    return items.map(it => ({
      id: it._id.toString(),
      name: it.name,
      description: it.description,
      price: it.price,
      image: it.image,
      artisanName: it.artisanName,
      status: it.status,
      category: it.category,
      tags: it.tags,
    }));
  } catch {
    return [];
  }
}

export default async function ExplorePage() {
  const products = await getProducts();
  return <ExploreContent initialProducts={products} />;
}
