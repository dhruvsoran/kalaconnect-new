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
  'buying-indian-art-online-guide': {
    title: 'Buying Indian Art Online: How to Spot Authentic Pieces and Avoid Fakes',
    category: 'Collecting',
    date: 'July 2025',
    readTime: '7 min read',
    content: [
      'The online art marketplace has made Indian art accessible to buyers worldwide, but it has also created opportunities for counterfeiters and middlemen. Learning to identify authentic handcrafted art is essential for collectors who want genuine pieces and fair value.',
      'The first rule of buying Indian art online is to research the art form before you buy. Understand the basic characteristics of Madhubani, Warli, Tanjore, or whichever style interests you. Know what natural pigments look like versus synthetic ones, what traditional compositions look like, and what the typical price range is for different sizes and qualities.',
      'Look for provenance and artist verification. Reputable platforms like कलाConnect verify the identity and background of their artisans. Ask for the artist\'s name, village or region, and how long they have been practicing. Authentic Madhubani artists, for example, typically come from specific communities in Bihar\'s Mithila region.',
      'Examine the materials and technique. Traditional Madhubani uses natural pigments — turmeric for yellow, indigo for blue, soot for black. Warli art uses rice paste on red-ochre walls or paper. Tanjore paintings feature real gold leaf and semi-precious stones. If a painting claims to be traditional but uses bright synthetic colors throughout, it may be a mass-produced copy.',
      'Check for consistency with tradition. While each artist has their own style, authentic traditional art follows certain conventions. Madhubani uses double-line borders and filled backgrounds. Warli uses only white on a dark background. Tanjore paintings have a characteristic raised, three-dimensional quality. Deviations from these basics may indicate imitation.',
      'Price can be a useful indicator, but it is not foolproof. If a Madhubani painting is priced at a few hundred rupees, it is almost certainly mass-produced. Authentic handcrafted pieces take days or weeks to create and should be priced accordingly. However, high price alone does not guarantee authenticity.',
      'Finally, buy from platforms that support artisans directly. When you purchase through a verified artisan marketplace, you ensure that the artist receives fair compensation and that you are getting a genuine piece of India\'s living artistic heritage.',
    ],
  },
  'indian-sculpture-traditions': {
    title: 'Indian Sculpture: From Bronze Statues to Stone Carvings',
    category: 'Art Forms',
    date: 'July 2025',
    readTime: '8 min read',
    content: [
      'Indian sculpture is one of the oldest and most influential artistic traditions in the world. From the refined bronze figures of the Chola dynasty to the monumental stone carvings of temples, Indian sculptors have created works of extraordinary beauty and spiritual depth for over four millennia.',
      'The earliest known Indian sculptures date to the Indus Valley civilization, with the famous Dancing Girl of Mohenjo-daro — a small bronze figure created around 2500 BCE — demonstrating remarkable technical skill and artistic vision. This tradition of metal casting, particularly the lost-wax technique, has been passed down through generations and continues today.',
      'Stone sculpture reached its zenith in the temple architecture of medieval India. The caves of Ajanta and Ellora, the temples of Khajuraho, Konark, and Mahabalipuram feature thousands of sculpted figures of gods, goddesses, animals, dancers, and musicians. These works were not merely decorative — they were integral to the spiritual experience of the temple.',
      'The Chola bronze tradition, originating in Tamil Nadu between the 9th and 13th centuries, produced some of the finest metal sculptures ever created. Chola bronzes are celebrated for their graceful postures, delicate features, and the spiritual quality of the figures. The Nataraja — Shiva as the cosmic dancer — is perhaps the most iconic image in all of Indian art.',
      'In North India, the stone carving traditions of Rajasthan and Odisha produced intricate temple sculptures of extraordinary complexity. The Sun Temple at Konark, designed as a massive chariot with elaborately carved wheels and horses, represents the pinnacle of this tradition.',
      'Today, Indian sculptors continue to work in traditional media — bronze, stone, wood, and terracotta — while also exploring contemporary themes and materials. Platforms like कलाConnect help connect these talented sculptors with collectors who appreciate the depth and beauty of Indian sculptural traditions.',
      'Collecting Indian sculpture offers a tangible connection to thousands of years of artistic excellence. Whether you choose a small bronze figurine or a stone carving, you are bringing home a piece of one of the world\'s greatest artistic legacies.',
    ],
  },
  'supporting-indian-artisans': {
    title: 'Why Supporting Indian Artisans Matters More Than Ever',
    category: 'Heritage',
    date: 'July 2025',
    readTime: '6 min read',
    content: [
      'India is home to an estimated seven million traditional artisans — painters, weavers, sculptors, potters, and craftspeople of every kind. These skilled men and women carry forward artistic traditions that are thousands of years old, yet many of them struggle to earn a dignified living from their craft.',
      'The challenges facing Indian artisans are significant. Mass production and cheap imports have driven down prices for handcrafted goods. Middlemen often take the lion\'s share of the retail price, leaving artisans with a fraction of the value their work creates. Young people in artisan communities are increasingly leaving traditional crafts for more stable employment.',
      'When you buy directly from an artisan, you are doing more than purchasing a product. You are helping preserve a cultural tradition that has been passed down through generations. You are supporting a family and a community. And you are ensuring that the knowledge, skills, and stories embedded in traditional art survive for future generations.',
      'Direct purchasing also ensures fairness. When an artisan sells through a verified marketplace like कलाConnect, they receive a significantly larger share of the retail price compared to selling through traditional channels. This means they can invest in better materials, train apprentices, and build sustainable businesses.',
      'The cultural value of supporting artisans extends beyond economics. Traditional Indian art forms — Madhubani, Warli, Tanjore, Pichwai, miniature painting, handloom weaving — are recognized by UNESCO and cultural organizations worldwide as intangible cultural heritage. When these traditions lose their practitioners, they are lost forever.',
      'Every purchase from a verified artisan is an act of cultural preservation. It says that traditional craftsmanship has value, that the artist behind the work deserves recognition and fair compensation, and that India\'s artistic heritage is worth protecting.',
    ],
  },
  'pichwai-paintings-rajasthan': {
    title: 'Pichwai Paintings: The Stunning Devotional Art of Rajasthan',
    category: 'Art Forms',
    date: 'July 2025',
    readTime: '7 min read',
    content: [
      'Pichwai paintings are among the most visually spectacular and spiritually significant art forms in India. Originating from the town of Nathdwara in Rajasthan, these large cloth paintings depict Lord Krishna in various moods and settings, created as devotional offerings that adorn temple walls and shrines.',
      'The word "Pichwai" comes from the Sanskrit "pichh" (back) and "wai" (hanging), referring to the large cloth backdrops that hang behind the main deity in Krishna temples. These paintings serve as both decoration and a visual narrative of Krishna\'s life, creating an immersive devotional atmosphere.',
      'The tradition of Pichwai painting is closely linked to the Pushtimarg sect of Vaishnavism, founded by Vallabhacharya in the 16th century. The sect\'s main temple in Nathdwara became a major center for artistic production, with generations of artists developing and refining the Pichwai style.',
      'Creating a Pichwai painting is a labor-intensive process that can take weeks or months. Artists work on unbleached cotton or silk, sketching the design before applying colors made from natural sources — mineral pigments, plant extracts, and gold and silver leaf. The paintings feature intricate details, from the jewelry on Krishna\'s figure to the individual petals of lotus flowers.',
      'Common themes in Pichwai art include the Raslila (Krishna\'s divine dance with the gopis), the Govardhan Leela (Krishna lifting Mount Govardhan), and various scenes from Krishna\'s life in Vrindavan. The paintings are characterized by their bold colors, elaborate compositions, and the tender, joyful mood they convey.',
      'Despite its devotional origins, Pichwai painting has gained recognition as a major art form in its own right. Modern Pichwai artists have adapted the traditional style to create smaller works suitable for homes and galleries, while maintaining the spiritual essence and technical excellence of the tradition.',
      'Adding a Pichwai painting to your collection brings not just beauty but a sense of the divine into your space. These are not merely decorative objects — they are windows into a living spiritual tradition that has inspired devotion and wonder for centuries.',
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
