import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Art & Culture Blog',
  description: 'Explore the rich heritage of Indian art — from Madhubani and Warli to Tanjore and beyond. Stories, guides, and artisan spotlights on कलाConnect.',
  openGraph: {
    title: 'Art & Culture Blog | कलाConnect',
    description: 'Explore the rich heritage of Indian art — from Madhubani and Warli to Tanjore and beyond.',
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
    excerpt: 'Discover the vibrant world of Madhubani art — a centuries-old painting tradition from Bihar known for its intricate patterns, bold colors, and mythological themes.',
    category: 'Art Forms',
    readTime: '8 min read',
    date: 'June 2025',
  },
  {
    slug: 'warli-art-tribal-paintings',
    title: 'Warli Art: The Beautiful Tribal Paintings of Maharashtra',
    excerpt: 'Explore the mesmerizing world of Warli art — simple yet profound tribal paintings created by the Warli tribe of Maharashtra using natural pigments and geometric patterns.',
    category: 'Art Forms',
    readTime: '6 min read',
    date: 'June 2025',
  },
  {
    slug: 'tanjore-paintings-gold-leaf',
    title: 'Tanjore Paintings: The Royal Art of Gold Leaf and Precious Stones',
    excerpt: 'Step into the opulent world of Tanjore paintings — a South Indian art form renowned for its use of gold leaf, semi-precious stones, and richly detailed compositions.',
    category: 'Art Forms',
    readTime: '7 min read',
    date: 'June 2025',
  },
  {
    slug: 'how-to-start-art-collection',
    title: 'How to Start Your Indian Art Collection: A Beginner\'s Guide',
    excerpt: 'Thinking about collecting Indian art? Here\'s everything you need to know — from understanding different art forms to choosing authentic pieces and supporting artisans.',
    category: 'Collecting',
    readTime: '10 min read',
    date: 'June 2025',
  },
  {
    slug: 'artisan-spotlight-rajasthani-miniatures',
    title: 'Artisan Spotlight: The Miniature Painters of Rajasthan',
    excerpt: 'Meet the skilled artisans who keep the tradition of Rajasthani miniature painting alive — a delicate art form requiring extraordinary precision and patience.',
    category: 'Artisan Stories',
    readTime: '5 min read',
    date: 'June 2025',
  },
  {
    slug: 'indian-textile-heritage',
    title: 'Indian Textiles: A Journey Through Centuries of Weaving Excellence',
    excerpt: 'From Banarasi silk to Chanderi cotton, explore India\'s extraordinary textile heritage that has captivated the world for thousands of years.',
    category: 'Heritage',
    readTime: '9 min read',
    date: 'June 2025',
  },
  {
    slug: 'buying-indian-art-online-guide',
    title: 'Buying Indian Art Online: How to Spot Authentic Pieces and Avoid Fakes',
    excerpt: 'The online art marketplace is booming, but how do you know you are getting authentic handcrafted Indian art? Learn the telltale signs of genuine craftsmanship.',
    category: 'Collecting',
    readTime: '7 min read',
    date: 'July 2025',
  },
  {
    slug: 'indian-sculpture-traditions',
    title: 'Indian Sculpture: From Bronze Statues to Stone Carvings',
    excerpt: 'Explore the rich tradition of Indian sculpture — from the iconic Chola bronzes to intricate stone carvings of Khajuraho and the living traditions of today.',
    category: 'Art Forms',
    readTime: '8 min read',
    date: 'July 2025',
  },
  {
    slug: 'supporting-indian-artisans',
    title: 'Why Supporting Indian Artisans Matters More Than Ever',
    excerpt: 'India\'s artisan community faces an uncertain future. Discover why buying handcrafted art directly from makers is an act of cultural preservation.',
    category: 'Heritage',
    readTime: '6 min read',
    date: 'July 2025',
  },
  {
    slug: 'pichwai-paintings-rajasthan',
    title: 'Pichwai Paintings: The Stunning Devotional Art of Rajasthan',
    excerpt: 'Discover Pichwai — the breathtaking cloth paintings from Nathdwara, Rajasthan, depicting Lord Krishna in vivid detail with natural pigments and gold leaf.',
    category: 'Art Forms',
    readTime: '7 min read',
    date: 'July 2025',
  },
];

export default function BlogPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Art &amp; Culture Blog</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Stories, guides, and deep dives into the rich world of Indian art and craftsmanship.
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
