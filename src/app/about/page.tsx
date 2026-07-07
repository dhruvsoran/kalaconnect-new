import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { KalaConnectIcon } from '@/components/icons';
import { getPlatformStats } from '@/lib/db';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about कलाConnect — our mission to connect Indian artisans with art lovers worldwide through a trusted digital marketplace.',
  alternates: { canonical: 'https://kalaconnect.me/about' },
};

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
            Bridging the gap between India&apos;s talented artisans and art lovers worldwide.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                कलाConnect was born from a simple observation: India&apos;s incredible artistic heritage — spanning millennia of tradition in Madhubani paintings, Warli art, Tanjore paintings, handwoven textiles, and exquisite sculptures — was struggling to find its place in the modern digital economy.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Talented artisans in villages and small towns across India possessed extraordinary skills passed down through generations, yet lacked access to fair markets. Middlemen often took the lion&apos;s share, leaving artists underpaid and undervalued.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We created कलाConnect to change that — a trusted digital marketplace where artisans sell directly to buyers, keeping more of what they earn while their art reaches a global audience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our mission is to empower India&apos;s artisan community by providing them with the tools, technology, and platform they need to thrive in the digital age. We believe every artist deserves fair compensation and global recognition for their craft.
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
                      Free storefront to showcase your art
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Direct connection with buyers — no middlemen
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Secure payment processing
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Order management and tracking tools
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-2">For Buyers</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Authentic, handcrafted artworks
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Direct from the artist — guaranteed genuine
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Support Indian heritage and livelihoods
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      Secure checkout and buyer protection
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
                    Every artwork on कलाConnect is verified to be genuine and handcrafted. We celebrate the unique imperfections that make each piece one-of-a-kind.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Fair Trade</h3>
                  <p className="text-sm text-muted-foreground">
                    We ensure artisans receive fair compensation for their work. Our platform model eliminates exploitative middlemen.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Cultural Preservation</h3>
                  <p className="text-sm text-muted-foreground">
                    By connecting traditional art with modern markets, we help preserve India&apos;s rich artistic heritage for future generations.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    We build connections between artists and art lovers, fostering a community that values craftsmanship and creativity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-headline font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                Have questions? We&apos;d love to hear from you.
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
