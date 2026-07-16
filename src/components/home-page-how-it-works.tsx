'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Truck, ChevronRight } from 'lucide-react';
import { FadeIn } from '@/components/motion-wrapper';
import { motion } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Discover Art',
    description: 'Browse through authentic Indian artworks from verified artisans. Each piece is handcrafted with love and cultural significance, representing traditions that have been passed down through generations.',
    detail: 'Our curated marketplace features original Madhubani paintings from Bihar, Warli art from Maharashtra, Tanjore paintings from Tamil Nadu, Pichwai from Rajasthan, and handwoven textiles from across India. Every listing includes detailed information about the art form, materials used, and the artist who created it.',
    icon: <Eye className="h-8 w-8" />,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    step: '02',
    title: 'Connect & Purchase',
    description: 'Learn the artisan\'s story, understand the art form, and complete your secure purchase with confidence knowing your money goes directly to the maker.',
    detail: 'Unlike traditional marketplaces where middlemen take most of the profit, KalaConnect ensures that 80-90% of your payment reaches the artisan. We verify every artist on our platform, document their training and heritage, and provide complete provenance for every artwork sold. Your purchase directly supports a traditional craft family and helps preserve India\'s artistic heritage.',
    icon: <Heart className="h-8 w-8" />,
    color: 'from-rose-500 to-pink-500',
  },
  {
    step: '03',
    title: 'Track & Receive',
    description: 'Track your order in real-time as it ships from the artisan\'s workshop to your doorstep. Rate and review your experience to help other buyers.',
    detail: 'Every artwork is carefully packed by the artist and shipped with tracking. We offer Cash on Delivery across India for your convenience and security. If your purchase does not meet expectations, our buyer protection policy ensures a fair resolution. After receiving your artwork, leave a review to help the artist build their reputation and guide future buyers.',
    icon: <Truck className="h-8 w-8" />,
    color: 'from-emerald-500 to-teal-500',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up" className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Simple Process</Badge>
          <h2 className="text-3xl md:text-5xl font-bold font-headline">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
            KalaConnect connects you directly with India&apos;s finest traditional artisans. Here is how the process works — from discovering authentic Indian art to receiving it at your doorstep.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="text-center p-6 h-full border-2 hover:border-primary/50 transition-all duration-300">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white mb-4`}>
                  {item.icon}
                </div>
                <div className="text-6xl font-bold font-headline text-muted/50 mb-2">{item.step}</div>
                <h3 className="text-xl font-bold font-headline mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-3">{item.description}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.detail}</p>
              </Card>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-6 -translate-y-1/2">
                  <ChevronRight className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
