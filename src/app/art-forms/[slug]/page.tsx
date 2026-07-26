import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { artForms, getArtFormBySlug } from '@/lib/art-forms-data';

export async function generateStaticParams() {
  return artForms.map((art) => ({ slug: art.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const art = getArtFormBySlug(slug);
  if (!art) return {};
  return {
    title: `${art.title} — History, Techniques & Cultural Significance`,
    description: art.description,
    openGraph: {
      title: `${art.title} | कलाConnect`,
      description: art.description,
      url: `https://www.kalaconnect.me/art-forms/${slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://www.kalaconnect.me/art-forms/${slug}`,
    },
  };
}

export default async function ArtFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const art = getArtFormBySlug(slug);
  if (!art) notFound();

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/art-forms" className="hover:text-primary transition-colors">Art Forms</Link>
          <span>/</span>
          <span className="text-foreground">{art.title}</span>
        </nav>

        <div className="max-w-3xl space-y-4">
          <Badge variant="outline" className="w-fit">{art.origin}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-headline">{art.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground">{art.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="prose prose-lg max-w-none">
            {art.content.map((paragraph, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Origin</p>
                <p className="font-medium">{art.origin}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Era</p>
                <p className="font-medium">{art.era}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Materials Used</p>
                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                  {art.materials.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Characteristics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {art.characteristics.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {art.relatedBlogSlug && (
            <Button asChild variant="outline" className="w-full">
              <Link href={`/blog/${art.relatedBlogSlug}`}>
                Read Detailed Blog Post &rarr;
              </Link>
            </Button>
          )}

          <Button asChild variant="secondary" className="w-full">
            <Link href="/art-forms">
              &larr; All Art Forms
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
