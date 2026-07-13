'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Palette, CheckCircle, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion-wrapper';

export function BuyersArtisans() {
  return (
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
  );
}
