import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductDoc {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category?: string;
  tags?: string[];
  artisanId: string;
  artisanName: string;
  status: string;
  createdAt: Date;
}

async function getProduct(id: string) {
  try {
    const db = await getDb();
    const product = await db.collection<ProductDoc>('products').findOne(
      { _id: new ObjectId(id), status: 'Active' }
    );
    return product ? { ...product, _id: product._id.toString() } : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} — Handcrafted by ${product.artisanName}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 800, height: 800 }],
    },
    alternates: {
      canonical: `https://www.kalaconnect.me/product/${id}`,
    },
  };
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/explore" className="hover:text-foreground">Explore</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <ProductSchema
        name={product.name}
        description={product.description}
        image={product.image}
        price={product.price}
        brand={product.artisanName}
        sku={product._id}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.slice(0, 4).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="150px" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            )}
            <h1 className="text-3xl font-headline font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              by <span className="font-medium text-foreground">{product.artisanName}</span>
            </p>
          </div>

          <div className="text-3xl font-bold text-primary">
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">About This Artwork</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              This artwork is handcrafted with care. Each piece is unique and may have slight variations, which is a hallmark of authentic handcrafted art.
            </p>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {product.artisanName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{product.artisanName}</p>
                  <p className="text-xs text-muted-foreground">Verified Artisan on कलाConnect</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <ProductDetailClient product={product} />
        </div>
      </div>
    </main>
  );
}
