import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { artForms } from '@/lib/art-forms-data';

export const metadata: Metadata = {
  title: 'Indian Art Forms — Complete Guide to Traditional Art Styles',
  description: 'Explore India\'s rich artistic heritage through detailed guides on Madhubani, Warli, Tanjore, Pichwai, Kalamkari, Rajasthani Miniatures, and more. Learn about origins, techniques, materials, and cultural significance.',
  openGraph: {
    title: 'Indian Art Forms | कलाConnect',
    description: 'Discover India\'s traditional art forms — Madhubani, Warli, Tanjore, Pichwai, Kalamkari, and Rajasthani Miniatures. Learn about their history, techniques, and cultural significance.',
    url: 'https://www.kalaconnect.me/art-forms',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.kalaconnect.me/art-forms',
  },
};

export default function ArtFormsPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Indian Art Forms</h1>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          Discover the rich tapestry of Indian artistic traditions. Each art form tells a story of cultural heritage,
          passed down through generations of master craftspeople.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {artForms.map((art) => (
          <Link key={art.slug} href={`/art-forms/${art.slug}`} className="group">
            <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-lg">
              <div className="h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/50 flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{art.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{art.subtitle}</p>
                </div>
              </div>
              <CardHeader>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">{art.origin.split(',')[0]}</Badge>
                  <Badge variant="outline">{art.era}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{art.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
