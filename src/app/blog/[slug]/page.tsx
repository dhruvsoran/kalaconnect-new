import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { BlogPostingSchema } from '@/components/seo/BlogPostingSchema';

const articles: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
}> = {
  'madhubani-art-guide': {
    title: 'Madhubani Art: A Complete Guide to India\'s Ancient Painting Tradition',
    category: 'Art Forms',
    date: 'June 2025',
    readTime: '8 min read',
    content: [
      'Madhubani art, also known as Mithila painting, is one of the oldest and most celebrated art forms in India. Originating from the Mithila region of Bihar, this traditional painting style has been practiced for over 2,500 years and continues to captivate art lovers worldwide with its vibrant colors, intricate patterns, and deep cultural significance.',
      'The roots of Madhubani art trace back to the ancient kingdom of Mithila, where it was originally practiced as wall art during religious ceremonies and festivals. The women of Mithila would paint elaborate murals on the walls of their homes, depicting scenes from Hindu mythology, nature, and daily life. This tradition was passed down from mother to daughter for generations, preserving a unique artistic heritage.',
      'What makes Madhubani art truly distinctive is its use of natural materials and bold visual language. Artists use fingers, twigs, brushes, and matchsticks to create paintings filled with geometric patterns, floral motifs, and stylized figures. The color palette traditionally includes earthy tones derived from natural sources — turmeric for yellow, indigo for blue, soot for black, and various plant extracts for other colors.',
      'The themes of Madhubani paintings are deeply rooted in Hindu mythology and folk traditions. Common subjects include scenes from the Ramayana and Mahabharata, depictions of Krishna and Radha, the Sun and Moon, and various gods and goddesses. Nature plays a prominent role too, with fish, peacocks, elephants, and lotus flowers appearing frequently in the compositions.',
      'In the 1960s, Madhubani art gained national and international attention when a devastating drought struck Bihar. The government commissioned local women to create paintings on paper as a way to provide employment, bringing this ancient art form to a wider audience. Since then, Madhubani paintings have been exhibited in galleries around the world and have become highly sought after by collectors.',
      'Today, Madhubani art is not only a cultural treasure but also a vital source of livelihood for thousands of artisans. Platforms like कलाConnect help connect these talented artists directly with art lovers, ensuring fair compensation while preserving this ancient tradition for future generations.',
      'When you purchase a Madhubani painting, you are not just buying a piece of art — you are supporting a living tradition that has survived for millennia. Each painting tells a story, carries the artist\'s personal expression, and serves as a bridge between India\'s rich past and its dynamic present.',
    ],
  },
  'warli-art-tribal-paintings': {
    title: 'Warli Art: The Beautiful Tribal Paintings of Maharashtra',
    category: 'Art Forms',
    date: 'June 2025',
    readTime: '6 min read',
    content: [
      'Warli art is one of the most recognizable and beloved tribal art forms in India. Created by the Warli tribe of the Sahyadri mountain range in Maharashtra, these paintings are characterized by their simplicity, geometric precision, and profound connection to nature and daily life.',
      'The history of Warli art dates back to around 2500-3000 BCE, with cave paintings in the region showing similar styles. However, the tradition as we know it today has been passed down through generations of Warli artisans, primarily women, who paint on the walls of their homes using a simple yet effective technique.',
      'What sets Warli art apart is its minimalist approach. Using only white pigment made from rice paste mixed with water and gum, artists create stunning compositions on a reddish-brown background. The paintings consist entirely of basic geometric shapes — circles, triangles, and squares — which combine to form complex scenes of village life, nature, and celebration.',
      'The circular shape represents the sun and moon, triangles depict mountains and trees, and squares symbolize sacred enclosures or pieces of land. Human figures are rendered as stick-like forms with triangular bodies, while animals are depicted with their characteristic features simplified to their essence.',
      'Common themes in Warli paintings include farming activities, fishing, hunting, festivals, and religious ceremonies. The famous Tarpa dance, where villagers form concentric circles around a musician playing the tarpa instrument, is one of the most iconic motifs in Warli art.',
      'Despite its apparent simplicity, Warli art carries deep philosophical meanings. The paintings reflect the tribe\'s belief in the harmony between humans and nature, the cyclical nature of life, and the importance of community. Every element in a Warli painting has significance, from the placement of figures to the direction they face.',
      'In recent decades, Warli art has gained significant recognition in the contemporary art world. The Warli Art Festival, held annually in Mumbai, showcases the work of talented tribal artists and helps preserve this extraordinary tradition.',
    ],
  },
  'tanjore-paintings-gold-leaf': {
    title: 'Tanjore Paintings: The Royal Art of Gold Leaf and Precious Stones',
    category: 'Art Forms',
    date: 'June 2025',
    readTime: '7 min read',
    content: [
      'Tanjore paintings, originating from the temple town of Thanjavur (Tanjore) in Tamil Nadu, represent one of the most opulent and visually stunning art forms in India. Known for their rich use of gold leaf, semi-precious stones, and vibrant colors, these paintings have adorned temples and royal courts for centuries.',
      'The art form reached its peak during the Nayak period in the 16th to 18th centuries, when the rulers of Thanjavur were great patrons of art and culture. The paintings were originally created to decorate the walls and ceilings of temples, depicting scenes from Hindu mythology with extraordinary detail and grandeur.',
      'What makes Tanjore paintings unique is their three-dimensional quality. Artists create raised surfaces using a special paste made from limestone and binding agents, then apply gold leaf and embed semi-precious stones into the surface. This technique gives the paintings a luminous, jewel-like quality that changes with the light.',
      'The subjects of Tanjore paintings are predominantly religious, with Lord Krishna, Lord Shiva, Goddess Lakshmi, and other Hindu deities being the most popular themes. The compositions are typically symmetrical, with the central deity surrounded by attendants, flowers, and decorative borders.',
      'Creating a Tanjore painting is a painstaking process that requires great skill and patience. The base is usually a wooden plank covered with a layer of cloth and a special paste. The artist then sketches the design, creates the raised surface, applies gold leaf, sets the stones, and finally paints the details with vibrant colors.',
      'Today, Tanjore paintings continue to be highly valued both as religious objects and as works of art. Modern artisans have adapted the traditional techniques to create contemporary themes while preserving the essential characteristics that make this art form so distinctive.',
    ],
  },
  'how-to-start-art-collection': {
    title: 'How to Start Your Indian Art Collection: A Beginner\'s Guide',
    category: 'Collecting',
    date: 'June 2025',
    readTime: '10 min read',
    content: [
      'Starting an art collection can seem daunting, but collecting Indian art is one of the most rewarding ways to invest in culture, support talented artisans, and bring beauty into your home. Whether you are a first-time buyer or looking to expand your collection, this guide will help you navigate the world of Indian art with confidence.',
      'The first step is to understand the different art forms available. India has an incredibly diverse artistic heritage, from the vibrant Madhubani paintings of Bihar to the intricate Tanjore paintings of Tamil Nadu, from the bold Warli art of Maharashtra to the delicate miniature paintings of Rajasthan. Each art form has its own history, techniques, and aesthetic qualities.',
      'When starting your collection, begin with what speaks to you personally. Art is deeply subjective, and the best collections are built on genuine passion. Visit galleries, browse online marketplaces like कलाConnect, and take time to learn about the stories behind different art forms.',
      'Authenticity is crucial in art collecting. When purchasing traditional Indian art, look for works created by trained artisans using traditional techniques. Ask about the artist\'s background, the materials used, and the cultural significance of the piece. Reputable platforms like कलाConnect verify the authenticity of their artists and their work.',
      'Consider the quality of materials and craftsmanship. Traditional Indian art often uses natural pigments, handmade paper, and time-honored techniques. While these materials may cost more, they ensure the longevity and authenticity of the artwork. Look for consistent line work, vibrant but natural colors, and attention to detail.',
      'Think about how the artwork will fit into your space. Consider the size of the piece, the color palette, and the style of your interior decor. Traditional Indian art can complement both modern and traditional interiors, adding warmth, color, and cultural depth to any room.',
      'Finally, remember that collecting art is not just about buying — it is about building relationships with artists and learning about their craft. Every piece in your collection should have a story, and understanding that story will deepen your appreciation and connection to the art.',
    ],
  },
  'artisan-spotlight-rajasthani-miniatures': {
    title: 'Artisan Spotlight: The Miniature Painters of Rajasthan',
    category: 'Artisan Stories',
    date: 'June 2025',
    readTime: '5 min read',
    content: [
      'In the narrow lanes of Jaipur and Jodhpur, hidden behind ordinary doorways, some of India\'s most skilled miniature painters continue a tradition that dates back to the Mughal era. These artisans, working with brushes made from a single squirrel hair, create masterpieces of extraordinary detail and beauty.',
      'Rajasthani miniature painting, also known as Rajput painting, flourished under the patronage of Rajput rulers from the 16th to 19th centuries. Different courts developed distinctive styles — the bold colors of Mewar, the delicate lines of Kishangarh, the romantic themes of Bundi, and the naturalistic depictions of Kota.',
      'The process of creating a miniature painting is incredibly demanding. Artists prepare their own surfaces using handmade paper coated with a special paste of limestone and binding agents. Colors are derived from natural sources — gemstones, minerals, plants, and even precious metals. A single painting can take weeks or even months to complete.',
      'Today, the tradition lives on through dedicated families of artists who have passed their skills down through generations. Despite the challenges of modernization, these artisans continue to create works that honor their heritage while exploring contemporary themes.',
      'By supporting miniature painters through platforms like कलाConnect, collectors help ensure that this extraordinary art form continues to thrive. Each miniature painting is not just a work of art — it is a window into centuries of tradition, skill, and cultural identity.',
    ],
  },
  'indian-textile-heritage': {
    title: 'Indian Textiles: A Journey Through Centuries of Weaving Excellence',
    category: 'Heritage',
    date: 'June 2025',
    readTime: '9 min read',
    content: [
      'India has been one of the world\'s greatest centers of textile production for thousands of years. From the legendary silks of Kanchipuram to the intricate ikats of Odisha, Indian textiles represent a living heritage of extraordinary skill, creativity, and cultural expression.',
      'The history of Indian textiles is as old as civilization itself. Archaeological evidence shows that cotton was being spun and woven in the Indus Valley as early as 3000 BCE. Ancient trade routes carried Indian textiles to Rome, China, and Southeast Asia, making them among the most valued commodities in global trade.',
      'Each region of India has developed its own distinctive textile traditions. Banarasi silk from Varanasi is known for its opulent gold and silver brocade work. Chanderi from Madhya Pradesh combines the sheen of silk with the softness of cotton. Paithani from Maharashtra features elaborate peacock motifs woven in pure gold thread.',
      'The handloom tradition is particularly significant, as it represents one of the largest sources of employment in rural India after agriculture. An estimated 350,000 handloom weavers work across the country, preserving techniques that have been refined over centuries.',
      'Indian textiles are not just beautiful — they are deeply symbolic. Colors, patterns, and motifs all carry cultural significance. Red symbolizes fertility and prosperity, while specific patterns may represent particular communities, regions, or life events like weddings and festivals.',
      'In recent years, there has been a growing appreciation for Indian textiles among global consumers who value craftsmanship, sustainability, and cultural authenticity. Platforms like कलाConnect help connect weavers directly with buyers, ensuring fair prices while preserving these remarkable traditions.',
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return {};
  return {
    title: article.title,
    description: article.content[0],
    openGraph: {
      title: article.title,
      description: article.content[0],
      url: `https://kalaconnect.me/blog/${slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://kalaconnect.me/blog/${slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-foreground">Blog</Link>
        <span className="mx-2">/</span>
        <span>{article.title}</span>
      </nav>

      <BlogPostingSchema
        title={article.title}
        description={article.content[0]}
        datePublished="2025-06-01"
        url={`https://kalaconnect.me/blog/${slug}`}
      />

      <article>
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">{article.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          {article.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-headline font-bold mb-4">Explore Indian Art</h2>
          <p className="text-muted-foreground mb-4">
            Discover authentic handcrafted artworks from talented Indian artisans.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Browse Marketplace
          </Link>
        </div>
      </article>
    </main>
  );
}
