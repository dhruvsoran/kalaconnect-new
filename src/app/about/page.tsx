import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { KalaConnectIcon } from '@/components/icons';
import { getPlatformStats } from '@/lib/db';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about कलाConnect (KalaConnect) — our mission to connect Indian artisans with art lovers worldwide through a trusted digital marketplace. Fair trade, authentic handcrafted art, cultural preservation.',
  openGraph: {
    title: 'About कलाConnect | Indian Art Marketplace',
    description: 'KalaConnect bridges the gap between India\'s talented artisans and art lovers worldwide. Fair prices, authentic handcrafted art, cultural preservation.',
    url: 'https://www.kalaconnect.me/about',
    type: 'website',
  },
  alternates: { canonical: 'https://www.kalaconnect.me/about' },
};

export const revalidate = 300;

export default async function AboutPage() {
  const stats = await getPlatformStats();
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Link href="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-6">
            <KalaConnectIcon className="h-10 w-10 text-primary" />
            <span className="font-headline">कलाConnect</span>
          </Link>
          <h1 className="text-4xl font-headline font-bold mb-4">About कलाConnect</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bridging the gap between India&apos;s talented artisans and art lovers worldwide through fair trade, technology, and a shared passion for India&apos;s extraordinary artistic heritage.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                कलाConnect was born from a simple observation: India&apos;s incredible artistic heritage — spanning millennia of tradition in Madhubani paintings, Warli art, Tanjore paintings, handwoven textiles, miniature paintings, and exquisite sculptures — was struggling to find its place in the modern digital economy.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Talented artisans in villages and small towns across India possessed extraordinary skills passed down through generations, yet lacked access to fair markets. Middlemen often took the lion&apos;s share, leaving artists underpaid and undervalued. Young people in artisan communities were increasingly leaving traditional crafts for more stable employment, putting the very survival of these ancient art forms at risk.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                India is home to over seven million traditional artisans working in diverse media — from the Madhubani painters of Bihar who use natural pigments derived from turmeric, indigo, and soot, to the master weavers of Varanasi producing intricate Banarasi silk brocades on handlooms unchanged for centuries, to the Chola bronze casters of Tamil Nadu practicing the lost-wax technique perfected over 4,000 years ago.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We created कलाConnect to change the equation — a trusted digital marketplace where artisans sell directly to buyers, keeping 80-90% of the sale price rather than the 10-20% they would receive through traditional middlemen. Our platform combines e-commerce with AI-powered tools that help artisans create compelling product descriptions, generate marketing content, and reach a global audience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our mission is to empower India&apos;s artisan community by providing them with the tools, technology, and platform they need to thrive in the digital age. We believe every artist deserves fair compensation and global recognition for their craft, and that India&apos;s traditional art forms — recognized by UNESCO as intangible cultural heritage — deserve to be preserved for future generations.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.artisanCount}+</div>
                  <div className="text-sm text-muted-foreground">Artisans Empowered</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.productCount}+</div>
                  <div className="text-sm text-muted-foreground">Artworks Listed</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.buyerCount}+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-2">For Artisans</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Free storefront to showcase your art to a global audience
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Direct connection with buyers — no middlemen, fair prices
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      AI-powered tools for product descriptions and marketing
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Order management, tracking, and analytics dashboard
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Voice support in Hindi, Tamil, Bengali, Marathi, and more
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      24/7 AI assistant for shop management and growth
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-2">For Buyers</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Authentic, handcrafted artworks from verified artisans
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Direct from the artist — complete provenance and authenticity
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Support Indian heritage and artisan livelihoods
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Secure checkout with Cash on Delivery option
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Real-time order tracking from workshop to doorstep
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      AI-powered art recommendations based on your taste
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-2">Authenticity</h3>
                  <p className="text-sm text-muted-foreground">
                    Every artwork on कलाConnect is verified to be genuine and handcrafted. We work directly with traditional artisans from established communities — Madhubani painters from Bihar, Warli artists from Maharashtra, Tanjore painters from Tamil Nadu, and more. We document the artist&apos;s training, lineage, and techniques, and provide complete provenance for every piece.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Fair Trade</h3>
                  <p className="text-sm text-muted-foreground">
                    We ensure artisans receive 80-90% of the sale price for their work, compared to the 10-20% they would receive through traditional middlemen. Our direct-to-consumer model eliminates exploitative intermediaries and ensures that the people who create the art are the ones who benefit most from its sale.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Cultural Preservation</h3>
                  <p className="text-sm text-muted-foreground">
                    By connecting traditional art with modern digital markets, we help preserve India&apos;s rich artistic heritage for future generations. Each purchase on KalaConnect supports a traditional artisan family and helps ensure that ancient techniques — from natural pigment preparation to lost-wax bronze casting — are passed down to the next generation.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    We build connections between artists and art lovers, fostering a community that values craftsmanship, creativity, and cultural understanding. KalaConnect is more than a marketplace — it is a platform for sharing stories, preserving traditions, and building a sustainable future for India&apos;s artisan communities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                Have questions about our platform, a specific artwork, or how to join as an artisan? We&apos;d love to hear from you.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> support@kalaconnect.me</p>
                <p><strong>Phone:</strong> +91 7818093944</p>
                <p><strong>Address:</strong> Meerut, Uttar Pradesh, India</p>
              </div>
              <Link href="/contact" className="inline-block mt-4 text-primary underline">
                Visit our Contact Page →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
