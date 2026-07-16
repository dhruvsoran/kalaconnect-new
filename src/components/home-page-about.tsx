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
              KalaConnect bridges the gap between India&apos;s rich artisanal heritage and the global digital marketplace. We provide artisans with cutting-edge AI tools, a supportive community, and a direct platform to share their craft with the world.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              India is home to over seven million traditional artisans — painters, weavers, sculptors, and craftspeople whose skills have been refined over centuries. These artists create extraordinary works using techniques passed down through generations, from the Madhubani painters of Bihar who use natural pigments derived from turmeric and indigo, to the master weavers of Varanasi who produce intricate silk brocades on handlooms that have remained unchanged for hundreds of years.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              However, many of these talented artisans struggle to reach buyers beyond their local markets. Exploitative middlemen often take the majority of the sale price, leaving artists with a fraction of what their work is worth. Young people in artisan communities are increasingly leaving traditional crafts for more stable employment, putting the very survival of these ancient art forms at risk.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              KalaConnect was founded to change this. Our platform gives artisans visibility, fair pricing through direct-to-consumer sales, and AI-powered digital tools to help them describe their work, market their products, and grow their craft into sustainable businesses. When you buy through KalaConnect, 80-90% of your payment goes directly to the artist — not to middlemen. Every purchase is an investment in cultural preservation, economic justice, and the future of India&apos;s extraordinary artistic heritage.
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
