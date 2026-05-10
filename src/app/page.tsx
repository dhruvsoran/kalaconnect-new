
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brush, Zap, LineChart, MessageCircle, Mic, Bot, ArrowRight } from 'lucide-react';
import { getProducts, Product } from '@/lib/db';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEffect, useState, useRef } from 'react';
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from 'embla-carousel-react'

const heroImages = [
    {
        src: "https://m.media-amazon.com/images/I/910AD6dqhXL.jpg",
        alt: "Modern abstract painting",
        aiHint: "modern abstract"
    },
    {
        src: "https://5.imimg.com/data5/SELLER/Default/2023/2/KH/VP/WT/9107407/digital-art-wall-painting-for-home-nature-landscape-forest-painting.jpg",
        alt: "Forest landscape painting",
        aiHint: "forest painting"
    },
    {
        src: "https://5.imimg.com/data5/SELLER/Default/2023/2/SD/UG/OS/9107407/abstract-wall-painting-for-home-city-by-the-lake.jpg",
        alt: "Abstract city landscape painting",
        aiHint: "abstract city"
    }
];

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    async function fetchProducts() {
      const prods = await getProducts();
      setAllProducts(prods);
      setFeaturedProducts(prods.filter(p => p.status === 'Active').slice(0, 6));
    }
    fetchProducts();
  }, []);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  ]);

  return (
      <main>
        <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
             <div className="absolute inset-0 -z-10 brightness-50">
                <div className="overflow-hidden h-full" ref={emblaRef}>
                    <div className="flex h-full">
                        {heroImages.map((image, index) => (
                           <div className="relative flex-[0_0_100%] h-full" key={index}>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover w-full h-full"
                                    priority={index === 0}
                                    data-ai-hint={image.aiHint}
                                />
                           </div>
                        ))}
                    </div>
                </div>
             </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-pop-in">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
              Empowering Artisans,
              <br />
              <span className="text-primary drop-shadow-lg">Celebrating Heritage</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-neutral-200">
              KalaConnect is an AI-powered marketplace that helps Indian artisans and craftsmen thrive in the digital world.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/register?role=artisan">Start Selling</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
                <Link href="/explore">Start Buying</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="featured-products" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Featured Creations</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        Handpicked treasures from our talented artisans.
                    </p>
                </div>
                <div className="[perspective:1000px]">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full animate-fade-in-up"
                    >
                        <CarouselContent>
                            {featuredProducts.map((product) => (
                                <CarouselItem key={product.name} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <ProductCard product={product} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                </div>
                 <div className="text-center mt-12 animate-fade-in-up">
                    <Button asChild>
                        <Link href="/explore">Explore All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </div>
        </section>

        <section id="features" className="py-20 bg-card border-y">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">A Platform Built for You</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Discover the tools that make selling your craft easier than ever.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-primary" />}
                title="AI-Powered Descriptions"
                description="Generate beautiful, culturally-rich product descriptions from just a photo and a few words."
              />
              <FeatureCard
                icon={<Brush className="h-8 w-8 text-primary" />}
                title="Automated Marketing"
                description="Create social media posts and email campaigns automatically to reach a wider audience."
              />
              <FeatureCard
                icon={<LineChart className="h-8 w-8 text-primary" />}
                title="Business Insights"
                description="Get smart pricing suggestions, trend forecasts, and customer behavior analytics."
              />
              <FeatureCard
                icon={<Mic className="h-8 w-8 text-primary" />}
                title="Voice & Language Support"
                description="Easily manage your shop using your voice in your local language. No typing required."
              />
              <FeatureCard
                icon={<Bot className="h-8 w-8 text-primary" />}
                title="24/7 Chatbot Guidance"
                description="Our AI chatbot is always available to help you set up your shop and answer questions."
              />
              <FeatureCard
                icon={<MessageCircle className="h-8 w-8 text-primary" />}
                title="AI Matchmaking"
                description="We connect your products with the right customers based on their tastes and interests."
              />
            </div>
          </div>
        </section>

        <section id="about" className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in [perspective:1000px]">
              <Image
                src="https://m.media-amazon.com/images/I/81gi8NfPpIL.jpg"
                alt="Modern Art Canvas Painting"
                width={600}
                height={500}
                className="rounded-lg shadow-xl transition-transform duration-300 hover:[transform:rotateX(5deg)_rotateY(5deg)]"
                data-ai-hint="modern art"
              />
            </div>
            <div className="text-left animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Weaving Tradition with Technology</h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Our mission is to bridge the gap between India's rich artisanal heritage and the global digital marketplace. We provide artisans with cutting-edge AI tools, a supportive community, and a platform to share their stories and sell their creations to the world.
              </p>
              <Button size="lg" asChild className="mt-8">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="text-center bg-transparent border-none shadow-none animate-fade-in-up group">
      <CardHeader className="items-center">
        <div className="bg-primary/10 p-4 rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
          {icon}
        </div>
        <CardTitle className="mt-4 font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="overflow-hidden flex flex-col h-full group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:[transform:rotateX(5deg)_rotateY(-5deg)]">
            <CardHeader className="p-0 border-b">
                 <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="aspect-square object-cover w-full group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={product.aiHint}
                />
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <h3 className="font-bold text-lg font-headline">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                 <p className="font-semibold text-lg">{product.price}</p>
                <Button size="sm" asChild>
                    <Link href="/explore">View</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
