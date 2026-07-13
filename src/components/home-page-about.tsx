'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion-wrapper';
import { motion } from 'framer-motion';

export function AboutMission() {
  return (
    <section className="py-16 md:py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                    <Image
                      src="https://m.media-amazon.com/images/I/81gi8NfPpIL.jpg"
                      alt="Traditional Indian Art"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 50vw, 300px"
                      quality={60}
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-square">
                    <Image
                      src="https://picsum.photos/seed/art1/400/400"
                      alt="Artisan at work"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 50vw, 400px"
                      quality={60}
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden aspect-square">
                    <Image
                      src="https://picsum.photos/seed/art2/400/400"
                      alt="Handmade painting"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 50vw, 400px"
                      quality={60}
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                    <Image
                      src="https://picsum.photos/seed/art3/300/400"
                      alt="Indian art collection"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 50vw, 300px"
                      quality={60}
                    />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <Badge variant="outline" className="mb-4">Our Mission</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
              Weaving Tradition with Technology
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              KalaConnect bridges the gap between India&apos;s rich artisanal heritage and the global digital marketplace. We provide artisans with cutting-edge AI tools, a supportive community, and a platform to share their stories with the world.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Many talented artisans in rural India struggle to reach buyers outside their local markets. Our platform gives them visibility, fair pricing, and the digital tools they need to grow their craft into a sustainable business.
            </p>
            <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" asChild>
                <Link href="/register">
                  Join Our Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
