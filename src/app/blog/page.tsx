import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Art & Culture Blog',
  description: 'Explore the rich heritage of Indian art — in-depth guides on Madhubani, Warli, Tanjore, Pichwai, Rajasthani miniatures, Indian sculpture, textiles, and more. Expert articles on collecting and supporting Indian artisans.',
  openGraph: {
    title: 'Art & Culture Blog | कलाConnect',
    description: 'In-depth guides on Indian art traditions — Madhubani, Warli, Tanjore, Pichwai, miniature painting, sculpture, textiles, and collecting.',
    url: 'https://kalaconnect.me/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kalaconnect.me/blog',
  },
};

const articles = [
  {
    slug: 'madhubani-art-guide',
    title: 'Madhubani Art: A Complete Guide to India\'s Ancient Painting Tradition',
    excerpt: 'Discover the vibrant world of Madhubani art — a 2,500-year-old painting tradition from Bihar known for its intricate patterns, natural pigments, bold colors, and mythological themes from Hindu epics.',
    category: 'Art Forms',
    readTime: '12 min read',
    date: 'June 2025',
  },
  {
    slug: 'warli-art-tribal-paintings',
    title: 'Warli Art: The Beautiful Tribal Paintings of Maharashtra',
    excerpt: 'Explore the mesmerizing world of Warli art — minimalist yet profound tribal paintings created by the Warli tribe using only rice paste on ochre backgrounds, with geometric patterns dating back 5,000 years.',
    category: 'Art Forms',
    readTime: '11 min read',
    date: 'June 2025',
  },
  {
    slug: 'tanjore-paintings-gold-leaf',
    title: 'Tanjore Paintings: The Royal Art of Gold Leaf and Precious Stones',
    excerpt: 'Step into the opulent world of Tanjore paintings from Tamil Nadu — a South Indian art form renowned for its lavish use of real gold leaf, semi-precious stones, raised gesso surfaces, and richly detailed compositions.',
    category: 'Art Forms',
    readTime: '12 min read',
    date: 'June 2025',
  },
  {
    slug: 'how-to-start-art-collection',
    title: 'How to Start Your Indian Art Collection: A Beginner\'s Guide',
    excerpt: 'Thinking about collecting Indian art? A comprehensive guide covering different art forms, understanding authenticity, evaluating materials, pricing, artist verification, and building a meaningful collection.',
    category: 'Collecting',
    readTime: '14 min read',
    date: 'June 2025',
  },
  {
    slug: 'artisan-spotlight-rajasthani-miniatures',
    title: 'Artisan Spotlight: The Miniature Painters of Rajasthan',
    excerpt: 'Meet the skilled artisans of Jaipur, Kishangarh, and Bundi who keep the tradition of Rajasthani miniature painting alive — an extraordinary art form requiring squirrel-hair brushes, natural pigments, and months of painstaking work.',
    category: 'Artisan Stories',
    readTime: '10 min read',
    date: 'June 2025',
  },
  {
    slug: 'indian-textile-heritage',
    title: 'Indian Textiles: A Journey Through Centuries of Weaving Excellence',
    excerpt: 'From Banarasi silk brocade to Kanchipuram weaves, Chanderi cotton to Phulkari embroidery — explore India\'s extraordinary textile heritage spanning 5,000 years, encompassing regional traditions and millions of skilled weavers.',
    category: 'Heritage',
    readTime: '13 min read',
    date: 'June 2025',
  },
  {
    slug: 'buying-indian-art-online-guide',
    title: 'Buying Indian Art Online: How to Spot Authentic Pieces and Avoid Fakes',
    excerpt: 'The online art marketplace is booming but filled with counterfeits. Learn how to authenticate Madhubani, Warli, Tanjore, and Pichwai art — from identifying natural pigments to verifying artist credentials.',
    category: 'Collecting',
    readTime: '12 min read',
    date: 'July 2025',
  },
  {
    slug: 'indian-sculpture-traditions',
    title: 'Indian Sculpture: From Bronze Statues to Stone Carvings',
    excerpt: 'Explore the rich tradition of Indian sculpture spanning 5,000 years — from the iconic Dancing Girl of Mohenjo-daro and Chola bronzes to the magnificent stone carvings of Khajuraho, Ellora, and Konark temples.',
    category: 'Art Forms',
    readTime: '12 min read',
    date: 'July 2025',
  },
  {
    slug: 'supporting-indian-artisans',
    title: 'Why Supporting Indian Artisans Matters More Than Ever',
    excerpt: 'India\'s community of seven million traditional artisans faces an uncertain future. Discover why buying handcrafted art directly from makers is an act of cultural preservation, economic justice, and environmental sustainability.',
    category: 'Heritage',
    readTime: '11 min read',
    date: 'July 2025',
  },
  {
    slug: 'pichwai-paintings-rajasthan',
    title: 'Pichwai Paintings: The Stunning Devotional Art of Rajasthan',
    excerpt: 'Discover Pichwai — the breathtaking cloth paintings from Nathdwara, Rajasthan, depicting Lord Krishna in vivid detail with natural mineral colors and gold leaf. Explore the spiritual tradition behind these temple masterpieces.',
    category: 'Art Forms',
    readTime: '11 min read',
    date: 'July 2025',
  },
];

export default function BlogPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Art &amp; Culture Blog</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          In-depth guides, expert articles, and cultural deep dives into the rich world of Indian art and craftsmanship. Learn about traditional painting styles, sculpture, textiles, and how to start your collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {articles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`}>
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
                <CardTitle className="font-headline text-xl leading-tight">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{article.excerpt}</CardDescription>
                <p className="text-xs text-muted-foreground mt-4">{article.date}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
