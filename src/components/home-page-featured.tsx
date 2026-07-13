'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/motion-wrapper';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { TTSButton } from '@/components/ui/tts-button';
import { motion } from 'framer-motion';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  artisanName: string;
  status: string;
};

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/db/products?select=id,name,price,image,artisanName,status&limit=8');
        const json = await res.json();
        setFeaturedProducts(json.data || []);
      } catch (e) {
        console.error('Failed to load products', e);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up" className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Curated For You</Badge>
          <h2 className="text-3xl md:text-5xl font-bold font-headline">
            Featured <span className="text-gradient">Creations</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
            Handpicked masterpieces from our talented artisans
          </p>
        </FadeIn>

        {featuredProducts.length > 0 ? (
          <FadeIn direction="up" delay={0.2}>
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {featuredProducts.map((product, i) => (
                  <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <ProductCard product={product} index={i} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:flex justify-center gap-2 mt-8">
                <CarouselPrevious className="static" />
                <CarouselNext className="static" />
              </div>
            </Carousel>
          </FadeIn>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Palette className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Our artisans are creating beautiful works. Check back soon!</p>
          </div>
        )}

        <FadeIn direction="up" delay={0.4} className="text-center mt-12">
          <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="lg" variant="outline">
              <Link href="/explore">
                View All Artworks
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <div>
      <ProductSchema
        name={product.name}
        description={product.description}
        image={product.image}
        price={product.price}
        brand={product.artisanName}
        sku={product.id}
      />
      <FadeIn direction="up" delay={index * 0.05}>
        <Card className="overflow-hidden group h-full" itemScope itemType="https://schema.org/Product">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              itemProp="image"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={60}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 z-10">
              <TTSButton text={`${product.name}. Created by ${product.artisanName}. ${product.description}`} />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Button size="sm" asChild className="w-full">
                <Link href="/explore">View Details</Link>
              </Button>
            </motion.div>
          </div>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">by <span itemProp="brand" itemScope itemType="https://schema.org/Brand"><span itemProp="name">{product.artisanName}</span></span></p>
            <h3 itemProp="name" className="font-bold font-headline text-sm line-clamp-1">{product.name}</h3>
            <div className="flex items-center justify-between mt-2">
              <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <span itemProp="priceCurrency" content="INR" />₹<span itemProp="price">{product.price}</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
