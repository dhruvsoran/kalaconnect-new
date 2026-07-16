'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Brush, LineChart, Mic, Bot, MessageCircle, Sparkles } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion-wrapper';
import { FadeIn } from '@/components/motion-wrapper';
import { motion } from 'framer-motion';

const features = [
  { icon: <Zap className="h-6 w-6 text-primary" />, title: 'AI Descriptions', description: 'Generate compelling product stories from just a photo. No writing skills needed.', detail: 'Upload a photo of your artwork and our AI instantly creates rich, professional product descriptions that highlight the technique, materials, cultural significance, and artistic value — helping your work stand out to buyers.', color: 'bg-blue-500/10' },
  { icon: <Brush className="h-6 w-6 text-primary" />, title: 'Auto Marketing', description: 'Create social media posts and campaigns automatically to reach more buyers.', detail: 'Our AI analyzes your artwork and generates optimized social media content, product tags, and marketing copy designed to attract art lovers on Instagram, Facebook, and other platforms. Expand your reach without spending hours on marketing.', color: 'bg-purple-500/10' },
  { icon: <LineChart className="h-6 w-6 text-primary" />, title: 'Smart Analytics', description: 'Get pricing insights and trend forecasts to optimize your business.', detail: 'Access data-driven insights about market trends, optimal pricing for different art forms and sizes, buyer preferences by region, and seasonal demand patterns. Make informed decisions about what to create and how to price it.', color: 'bg-emerald-500/10' },
  { icon: <Mic className="h-6 w-6 text-primary" />, title: 'Voice Support', description: 'Manage your shop using voice commands in your local language.', detail: 'Our voice interface supports Hindi, Tamil, Bengali, Marathi, and other Indian languages. Update product listings, respond to customer inquiries, and manage your shop hands-free — making the platform accessible to artisans regardless of literacy level or technical experience.', color: 'bg-amber-500/10' },
  { icon: <Bot className="h-6 w-6 text-primary" />, title: '24/7 Assistant', description: 'AI chatbot to help you set up your shop and grow your business.', detail: 'Get instant help with every aspect of selling on KalaConnect — from creating your first listing and uploading product photos to understanding analytics and processing orders. Our AI assistant is available around the clock in multiple languages.', color: 'bg-rose-500/10' },
  { icon: <MessageCircle className="h-6 w-6 text-primary" />, title: 'Smart Matching', description: 'Our AI connects your art style with buyers who will love it most.', detail: 'Using visual recognition and preference analysis, our matching engine identifies buyers whose tastes align with each artist\'s distinctive style. Your artwork gets shown to the people most likely to appreciate and purchase it, increasing conversion rates and buyer satisfaction.', color: 'bg-violet-500/10' },
];

export function AIFeatures() {
  return (
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
            KalaConnect equips traditional artisans with modern AI technology to help them create better product listings, market their work effectively, and grow their businesses in the digital economy — all while preserving the authenticity and cultural significance of their craft.
          </p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
          {features.map((feat, i) => (
            <StaggerItem key={i}>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl ${feat.color} mb-4`}>
                      {feat.icon}
                    </div>
                    <h3 className="font-bold font-headline text-lg mb-2">{feat.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{feat.description}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{feat.detail}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
