'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Brush, Zap, LineChart, MessageCircle, Mic, Bot, ArrowRight,
  Star, Users, Globe, Sparkles, Heart, Shield, Truck, ChevronRight,
  Palette, Eye, Quote, Send, CheckCircle, Mail, Phone, MapPin, Loader2
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/motion-wrapper';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { TTSButton } from '@/components/ui/tts-button';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  artisanName: string;
  status: string;
};

type Stats = {
  productCount: number;
  artisanCount: number;
  buyerCount: number;
  orderCount: number;
};

const heroImages = [
  { src: 'https://m.media-amazon.com/images/I/910AD6dqhXL.jpg', alt: 'Traditional Indian painting' },
  { src: 'https://5.imimg.com/data5/SELLER/Default/2023/2/KH/VP/WT/9107407/digital-art-wall-painting-for-home-nature-landscape-forest-painting.jpg', alt: 'Landscape painting' },
  { src: 'https://5.imimg.com/data5/SELLER/Default/2023/2/SD/UG/OS/9107407/abstract-wall-painting-for-home-city-by-the-lake.jpg', alt: 'Abstract art' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({ productCount: 0, artisanCount: 0, buyerCount: 0, orderCount: 0 });
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, statsRes] = await Promise.all([
          fetch('/api/db/products'),
          fetch('/api/stats'),
        ]);
        const productsJson = await productsRes.json();
        const statsJson = await statsRes.json();
        const active = (productsJson.data || []).filter((p: Product) => p.status === 'Active');
        setFeaturedProducts(active.slice(0, 8));
        setStats(statsJson);
      } catch (e) {
        console.error('Failed to load data', e);
      }
    }
    fetchData();
  }, []);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactSuccess(false);
    try {
      const res = await fetch('/api/db/contactMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">
        <motion.div className="absolute inset-0 -z-10" style={{ y: heroParallax, opacity: heroOpacity, scale: heroScale }}>
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {heroImages.map((image, index) => (
                <div className="relative flex-[0_0_100%] h-full" key={index}>
                  <Image src={image.src} alt={image.alt} fill className="object-cover" priority={index === 0} />
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

      {/* Stats Bar - Real data from API */}
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

      {/* Featured Products - From API */}
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

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up" className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">
              How It <span className="text-gradient">Works</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: '01',
                title: 'Discover Art',
                description: 'Browse through authentic Indian artworks from verified artisans. Each piece is handcrafted with love and cultural significance.',
                icon: <Eye className="h-8 w-8" />,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                step: '02',
                title: 'Connect & Purchase',
                description: 'Learn the artisan\'s story, understand the art form, and complete your secure purchase with confidence.',
                icon: <Heart className="h-8 w-8" />,
                color: 'from-rose-500 to-pink-500',
              },
              {
                step: '03',
                title: 'Track & Receive',
                description: 'Track your order in real-time as it ships from the artisan workshop to your doorstep. Rate and review your experience.',
                icon: <Truck className="h-8 w-8" />,
                color: 'from-emerald-500 to-teal-500',
              },
            ].map((item, i) => (
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
                  <p className="text-muted-foreground">{item.description}</p>
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

      {/* AI Features */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up" className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              AI-Powered
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">
              Smart Tools for <span className="text-gradient">Artisans</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
              Technology that empowers traditional craftsmanship
            </p>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
            {[
              { icon: <Zap className="h-6 w-6 text-primary" />, title: 'AI Descriptions', description: 'Generate compelling product stories from just a photo. No writing skills needed.', color: 'bg-blue-500/10' },
              { icon: <Brush className="h-6 w-6 text-primary" />, title: 'Auto Marketing', description: 'Create social media posts and campaigns automatically to reach more buyers.', color: 'bg-purple-500/10' },
              { icon: <LineChart className="h-6 w-6 text-primary" />, title: 'Smart Analytics', description: 'Get pricing insights and trend forecasts to optimize your business.', color: 'bg-emerald-500/10' },
              { icon: <Mic className="h-6 w-6 text-primary" />, title: 'Voice Support', description: 'Manage your shop using voice commands in your local language.', color: 'bg-amber-500/10' },
              { icon: <Bot className="h-6 w-6 text-primary" />, title: '24/7 Assistant', description: 'AI chatbot to help you set up your shop and grow your business.', color: 'bg-rose-500/10' },
              { icon: <MessageCircle className="h-6 w-6 text-primary" />, title: 'Smart Matching', description: 'Our AI connects your art style with buyers who will love it most.', color: 'bg-violet-500/10' },
            ].map((feat, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 rounded-xl ${feat.color} mb-4`}>
                        {feat.icon}
                      </div>
                      <h3 className="font-bold font-headline text-lg mb-2">{feat.title}</h3>
                      <p className="text-muted-foreground text-sm">{feat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* For Buyers & Artisans - Real content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up" className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Built For Everyone</Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">
              Made for <span className="text-gradient">Buyers & Artisans</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Buyers */}
            <FadeIn direction="left">
              <Card className="h-full border-2 border-primary/20">
                <CardHeader>
                  <div className="inline-flex p-3 rounded-xl bg-blue-500/10 mb-2">
                    <Eye className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle className="font-headline text-2xl">For Art Buyers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Browse thousands of authentic handcrafted artworks',
                    'Learn the story behind every art form and artisan',
                    'Cash on Delivery available',
                    'Real-time order tracking from workshop to doorstep',
                    'Rate and review your purchases to help others',
                    'AI-powered recommendations based on your taste',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button asChild className="w-full">
                      <Link href="/explore">
                        Start Exploring
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* For Artisans */}
            <FadeIn direction="right">
              <Card className="h-full border-2 border-primary/20">
                <CardHeader>
                  <div className="inline-flex p-3 rounded-xl bg-amber-500/10 mb-2">
                    <Palette className="h-6 w-6 text-amber-500" />
                  </div>
                  <CardTitle className="font-headline text-2xl">For Artisans</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Free platform to sell your artwork online',
                    'AI-generated product descriptions from photos',
                    'Auto-create social media posts and campaigns',
                    'Manage orders and track shipments easily',
                    'Analytics dashboard to grow your business',
                    'Direct connection with art lovers worldwide',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/register?role=artisan">
                        Start Selling
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* About / Mission */}
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
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden aspect-square">
                      <Image
                        src="https://picsum.photos/seed/art1/400/400"
                        alt="Artisan at work"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
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
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                      <Image
                        src="https://picsum.photos/seed/art3/300/400"
                        alt="Indian art collection"
                        width={300}
                        height={400}
                        className="w-full h-full object-cover"
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

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn direction="up">
            <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6">
              Ready to Discover <span className="text-gradient">Timeless Art</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our growing community of art lovers and artisans. Your next masterpiece is waiting.
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

      {/* Connect With Us */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <FadeIn direction="left">
              <Badge variant="outline" className="mb-4">Get In Touch</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
                Connect With Us
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Have a question, suggestion, or want to collaborate? We&apos;d love to hear from you.
                Whether you&apos;re an artisan looking to join, a buyer with feedback, or a partner with ideas — drop us a message.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email us at</p>
                    <p className="font-medium">support@kalaconnect.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Call us at</p>
                    <p className="font-medium">+91 7818093944</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Visit us at</p>
                    <p className="font-medium">Meerut, Uttar Pradesh, India</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <Card>
                <CardContent className="p-6">
                  {contactSuccess ? (
                    <div className="text-center py-12">
                      <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold font-headline mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                      </p>
                      <Button variant="outline" onClick={() => setContactSuccess(false)}>
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Name *</label>
                          <Input
                            placeholder="Your name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Email *</label>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Phone</label>
                          <Input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Subject *</label>
                          <Input
                            placeholder="How can we help?"
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Message *</label>
                        <Textarea
                          placeholder="Tell us what's on your mind..."
                          className="min-h-[120px]"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={contactSubmitting}>
                        {contactSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
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
