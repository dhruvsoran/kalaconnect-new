'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion-wrapper';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <FadeIn direction="up">
          <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6">
            Ready to Discover <span className="text-gradient">Timeless Art</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
            Join our growing community of art lovers and artisans. Whether you are looking for authentic Madhubani paintings, Warli tribal art, Tanjore masterpieces, Pichwai devotional art, Rajasthani miniatures, handwoven textiles from across India, or traditional sculptures — KalaConnect connects you directly with the master craftspeople who create them.
          </p>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Every purchase supports a traditional artisan family and helps preserve India&apos;s extraordinary cultural heritage. Browse our curated collection of authentic handcrafted Indian art, or if you are an artisan, join our platform to showcase your work to the world and receive fair compensation for your craft.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/explore">
                  Browse Artworks
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/register?role=artisan">Become a Seller</Link>
              </Button>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
