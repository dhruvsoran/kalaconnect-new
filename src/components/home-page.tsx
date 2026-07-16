'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Truck, Heart, Globe, Sparkles, Users, Star, Palette, Eye } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';

const FeaturedProducts = dynamic(() => import('@/components/home-page-featured').then(m => m.FeaturedProducts), { ssr: false });
const HowItWorks = dynamic(() => import('@/components/home-page-how-it-works').then(m => m.HowItWorks), { ssr: false });
const AIFeatures = dynamic(() => import('@/components/home-page-ai-features').then(m => m.AIFeatures), { ssr: false });
const BuyersArtisans = dynamic(() => import('@/components/home-page-buyers-artisans').then(m => m.BuyersArtisans), { ssr: false });
const AboutMission = dynamic(() => import('@/components/home-page-about').then(m => m.AboutMission), { ssr: false });
const CTASection = dynamic(() => import('@/components/home-page-cta').then(m => m.CTASection), { ssr: false });
const ContactSection = dynamic(() => import('@/components/home-page-contact').then(m => m.ContactSection), { ssr: false });

const heroImages = [
  { src: 'https://m.media-amazon.com/images/I/910AD6dqhXL.jpg', alt: 'Traditional Indian painting' },
  { src: 'https://5.imimg.com/data5/SELLER/Default/2023/2/KH/VP/WT/9107407/digital-art-wall-painting-for-home-nature-landscape-forest-painting.jpg', alt: 'Landscape painting' },
  { src: 'https://5.imimg.com/data5/SELLER/Default/2023/2/SD/UG/OS/9107407/abstract-wall-painting-for-home-city-by-the-lake.jpg', alt: 'Abstract art' },
];

export function HomePage() {
  const [stats, setStats] = useState({ productCount: 0, artisanCount: 0, buyerCount: 0, orderCount: 0 });
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/stats');
        const json = await res.json();
        setStats(json);
      } catch (e) {
        console.error('Failed to load stats', e);
      }
    }
    fetchData();
  }, []);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">
        <motion.div className="absolute inset-0 -z-10" style={{ y: heroParallax, opacity: heroOpacity, scale: heroScale }}>
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {heroImages.map((image, index) => (
                <div className="relative flex-[0_0_100%] h-full" key={index}>
                  <Image src={image.src} alt={image.alt} fill className="object-cover" priority={index === 0} sizes="100vw" quality={60} fetchPriority={index === 0 ? 'high' : undefined} placeholder="blur" blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsMERAODg4SERgcExYXFBYXGhUWIB4hGxsbFB8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8AAWgCAAEAAQERAhEQAhEA/9oADAMBAAIRAxEAPwD3+gD/2Q==" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="absolute top-32 left-8 w-24 h-24 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-8 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl animate-float-slow" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
                AI-Powered Artisan Marketplace
              </Badge>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-headline tracking-tight leading-[0.9]">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="block"
              >
                Empowering
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="block text-gradient mt-2"
              >
                Indian Artisans
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200 leading-relaxed"
            >
              A digital bridge connecting India&apos;s finest artisans directly to art lovers worldwide.
              Every purchase preserves centuries of heritage and supports independent craftspeople.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-4 max-w-2xl mx-auto text-base text-neutral-300 leading-relaxed"
            >
              KalaConnect is an Indian art marketplace featuring authentic Madhubani paintings from Bihar, Warli tribal art from Maharashtra, Tanjore paintings with gold leaf from Tamil Nadu, Pichwai devotional art from Rajasthan, Rajasthani miniature paintings, handwoven textiles including Banarasi silk and Kanchipuram weaves, traditional sculptures, and more — all directly from the artisans who create them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59,130,246,0.5)' }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" asChild className="w-full sm:w-auto text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                  <Link href="/explore">
                    Explore Artworks
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10">
                  <Link href="/register?role=artisan">Start Selling</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-neutral-300"
            >
              {[
                { icon: <Shield className="h-4 w-4" />, text: 'Cash on Delivery' },
                { icon: <Truck className="h-4 w-4" />, text: 'Pan-India Delivery' },
                { icon: <Heart className="h-4 w-4" />, text: '100% Handmade' },
                { icon: <Globe className="h-4 w-4" />, text: 'Global Reach' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-primary">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: stats.artisanCount, label: 'Artisans', icon: <Palette className="h-5 w-5 text-primary" /> },
              { value: stats.productCount, label: 'Artworks', icon: <Eye className="h-5 w-5 text-primary" /> },
              { value: stats.buyerCount, label: 'Happy Buyers', icon: <Users className="h-5 w-5 text-primary" /> },
              { value: stats.orderCount, label: 'Orders Placed', icon: <Star className="h-5 w-5 text-amber-500" /> },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-2xl md:text-3xl font-bold font-headline">{stat.value}+</span>
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamically loaded sections */}
      <FeaturedProducts />
      <HowItWorks />
      <AIFeatures />
      <BuyersArtisans />
      <AboutMission />
      <CTASection />
      <ContactSection />
    </main>
  );
}
