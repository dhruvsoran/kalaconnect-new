import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FAQSchema } from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'The Complete Guide to Indian Art — History, Styles, Techniques, and How to Collect',
  description: 'Everything you need to know about Indian art — from Madhubani, Warli, Tanjore, Pichwai, and Rajasthani miniatures to Indian sculpture, textiles, traditional materials, authentic collecting tips, and why supporting artisans matters. A comprehensive educational resource for art lovers and collectors.',
  openGraph: {
    title: 'The Complete Guide to Indian Art | कलाConnect',
    description: 'A comprehensive guide to Indian art traditions — history, styles, techniques, and how to start collecting authentic handcrafted pieces directly from artisans.',
    url: 'https://kalaconnect.me/guide',
    type: 'article',
  },
  alternates: {
    canonical: 'https://kalaconnect.me/guide',
  },
};

const sections = [
  {
    id: 'overview',
    title: 'What Is Indian Art?',
    content: 'Indian art encompasses a vast range of creative expressions spanning over 5,000 years of continuous civilization. From the bronze figurines of the Indus Valley civilization to contemporary digital art, India has one of the richest and most diverse artistic traditions in the world. Indian art is deeply intertwined with religion, philosophy, and daily life, serving not just aesthetic purposes but also spiritual, ceremonial, and social functions. Unlike Western art traditions that have often emphasized individualism and artistic innovation, Indian art has traditionally prioritized the faithful transmission of established forms, techniques, and iconography across generations. This emphasis on continuity rather than novelty has preserved artistic knowledge for millennia, making traditional Indian art one of humanity\'s greatest living cultural treasures.',
  },
  {
    id: 'painting-traditions',
    title: 'Major Painting Traditions',
    content: 'India\'s painting traditions can be broadly categorized into several major schools, each with its own distinct style, materials, and cultural significance. These traditions have been passed down through families and communities for centuries, with techniques refined through generations of practice. Understanding the major painting traditions is essential for any collector or enthusiast of Indian art.',
    subsections: [
      {
        title: 'Madhubani Painting',
        description: 'Originating from the Mithila region of Bihar, Madhubani art is characterized by its use of natural pigments, geometric patterns, and mythological themes. Artists use fingers, twigs, brushes, and matchsticks to create paintings filled with bold colors and intricate details. The tradition dates back over 2,500 years and was traditionally practiced as wall art during religious ceremonies. Modern Madhubani artists create works on handmade paper and canvas, using natural colors derived from turmeric (yellow), indigo (blue), soot (black), and plant extracts (green and red).',
        link: '/blog/madhubani-art-guide',
      },
      {
        title: 'Warli Art',
        description: 'Created by the Warli tribe of Maharashtra, Warli art is one of the most minimalist and recognizable Indian art forms. Using only white rice paste on a reddish-brown background, artists create compositions of circles, triangles, and squares depicting village life, farming, and nature. The tradition dates back to around 2500-3000 BCE, making it one of the oldest continuously practiced art forms in the world. Warli paintings are deeply philosophical, reflecting the tribe\'s belief in harmony between humans and nature.',
        link: '/blog/warli-art-tribal-paintings',
      },
      {
        title: 'Tanjore Painting',
        description: 'From the temple town of Thanjavur in Tamil Nadu, Tanjore paintings are known for their opulent use of real gold leaf, semi-precious stones, and vibrant colors. These paintings feature a characteristic raised, three-dimensional quality achieved through layers of gesso (limestone paste), with gold leaf applied using traditional water gilding techniques. The tradition reached its peak during the Nayak period in the 16th-18th centuries and predominantly depicts Hindu deities.',
        link: '/blog/tanjore-paintings-gold-leaf',
      },
      {
        title: 'Pichwai Painting',
        description: 'Originating from Nathdwara in Rajasthan, Pichwai paintings are large devotional cloth paintings depicting Lord Krishna. Created as sacred backdrops for temple deities, these works feature bold colors, elaborate compositions, and scenes from Krishna\'s life. The tradition is closely linked to the Pushtimarg sect of Vaishnavism and uses natural mineral colors, genuine gold and silver leaf, and unbleached cotton or silk.',
        link: '/blog/pichwai-paintings-rajasthan',
      },
      {
        title: 'Rajasthani Miniature Painting',
        description: 'Flourishing under Rajput patronage from the 16th to 19th centuries, Rajasthani miniature paintings are known for their bold colors, delicate lines, and themes of love, war, and devotion. Different courts developed distinctive styles — the bold colors of Mewar, the delicate lines of Kishangarh, the romantic themes of Bundi, and the naturalistic depictions of Kota. Artists use brushes made from a single squirrel hair and pigments ground from precious stones.',
        link: '/blog/artisan-spotlight-rajasthani-miniatures',
      },
    ],
  },
  {
    id: 'sculpture',
    title: 'Indian Sculpture',
    content: 'Indian sculpture spans from the Indus Valley\'s Dancing Girl (c. 2500 BCE) to contemporary works. Major traditions include Chola bronzes from Tamil Nadu (9th-13th centuries), stone carvings of Khajuraho, Konark, and the Kailasa temple at Ellora — the largest monolithic structure in the world. The lost-wax bronze technique has been practiced continuously for over 4,000 years and remains the foundation of India\'s bronze sculpture tradition. Indian sculpture is notable for its spiritual expressiveness, technical mastery, and the integration of sculpture with architecture.',
    link: '/blog/indian-sculpture-traditions',
  },
  {
    id: 'textiles',
    title: 'Indian Textiles',
    content: 'India has been a global center of textile production for millennia. Key traditions include Banarasi silk brocade from Varanasi (known for gold and silver zari work), Chanderi from Madhya Pradesh (combining silk sheen with cotton softness), Kanchipuram silk from Tamil Nadu (with contrasting body and border colors), and handloom weaving across the country. An estimated 3.5-4 million handloom weavers work across India, preserving techniques refined over centuries. Each region has developed distinctive weaving traditions shaped by local climate, available materials, and cultural preferences.',
    link: '/blog/indian-textile-heritage',
  },
  {
    id: 'materials',
    title: 'Traditional Materials and Techniques',
    content: 'Indian artists traditionally use natural materials derived from plants, minerals, and animals. Madhubani artists use turmeric for yellow, indigo for blue, and soot for black. Tanjore painters apply real 22-karat or 24-karat gold leaf and embed semi-precious stones including garnets, sapphires, and rubies. Warli artists use rice paste mixed with water and gum for their characteristic white pigment. Rajasthani miniature painters grind lapis lazuli for blue, vermilion for red, and emeralds for green. These natural materials give traditional art its distinctive luminosity and ensure its longevity when properly cared for.',
  },
  {
    id: 'collecting',
    title: 'How to Start Collecting Indian Art',
    content: 'Begin by learning about different art forms to discover what resonates with you personally. Research the art form thoroughly before buying — understand its characteristic techniques, materials, and pricing. Look for artist verification and provenance information from reputable platforms. Examine materials and technique for signs of authenticity — natural pigments, confident line work, and traditional compositions. Buy from platforms like KalaConnect that support artisans directly and provide complete provenance. Consider how the piece will fit in your space and build relationships with artists for a deeper collecting experience.',
    link: '/blog/how-to-start-art-collection',
  },
  {
    id: 'authenticity',
    title: 'Spotting Authentic Art',
    content: 'Authentic traditional Indian art follows established conventions for each art form. Check for natural pigments, consistent line work, and cultural accuracy. Madhubani paintings should have double-line borders, filled compositions, and natural color variations. Tanjore paintings should feature real gold leaf that develops patina over time, not gold-colored paint. Warli art uses only white rice paste on ochre backgrounds. Research the artist\'s background — authentic Madhubani artists come from Bihar\'s Mithila region, Warli artists from Maharashtra\'s tribal communities. Compare pricing against the time and materials required for authentic work.',
    link: '/blog/buying-indian-art-online-guide',
  },
  {
    id: 'supporting',
    title: 'Why Supporting Artisans Matters',
    content: 'India has an estimated seven million traditional artisans. Many struggle to earn a dignified living due to mass production, cheap imports, and exploitative middlemen who take 80-90% of the sale price. Young people in artisan communities increasingly leave traditional crafts for more stable employment. Buying directly from verified artisans ensures fair compensation, helps preserve cultural traditions recognized by UNESCO as intangible cultural heritage, supports sustainable production methods with minimal environmental impact, and maintains the transmission of ancient techniques to the next generation.',
    link: '/blog/supporting-indian-artisans',
  },
];

const faqItems = [
  {
    question: 'What is the most famous Indian art form?',
    answer: 'India has many famous art forms, but Madhubani painting from Bihar is one of the most recognized globally, with a history spanning over 2,500 years. Warli art from Maharashtra, Tanjore paintings from Tamil Nadu, and Rajasthani miniature paintings are also among the most celebrated Indian art traditions. Each represents a distinct regional style with unique techniques, materials, and cultural significance.',
  },
  {
    question: 'How do I know if Indian art is authentic?',
    answer: 'Check for natural pigments (turmeric yellow, indigo blue, soot black), consistent traditional compositions, artist verification from the platform, and fair pricing. Authentic handcrafted pieces take days or weeks to create and should be priced accordingly. Buy from verified artisan marketplaces like KalaConnect that document artist backgrounds and provide complete provenance for every artwork.',
  },
  {
    question: 'What materials are used in traditional Indian painting?',
    answer: 'Traditional Indian artists use natural materials: turmeric for yellow, indigo for blue, soot for black, plant extracts for greens and reds, rice paste for white (Warli), gold leaf and semi-precious stones (Tanjore), limestone paste for raised surfaces (Tanjore), and mineral pigments ground from precious stones (Rajasthani miniatures). These natural materials give traditional art its distinctive character and luminosity.',
  },
  {
    question: 'How much does authentic Indian art cost?',
    answer: 'Prices vary widely based on the art form, size, artist reputation, and materials used. Small Madhubani paintings may start around ₹2,000-5,000, while large intricate pieces by established artists range from ₹10,000 to ₹50,000 or more. Tanjore paintings with real gold leaf and semi-precious stones start at ₹15,000 and can exceed several lakhs. Rajasthani miniatures range from ₹5,000 for small works to ₹50,000+ for large elaborate pieces by recognized masters.',
  },
  {
    question: 'Where can I buy authentic Indian art online?',
    answer: 'Platforms like KalaConnect (kalaconnect.me) connect buyers directly with verified Indian artisans, ensuring authentic handcrafted art, fair prices for artists, and complete provenance. Unlike general marketplaces, KalaConnect verifies every artist, documents their training and heritage, and ensures 80-90% of the sale price reaches the maker rather than middlemen.',
  },
  {
    question: 'What is the difference between Madhubani and Warli art?',
    answer: 'Madhubani art from Bihar uses bold multicolored compositions, geometric patterns, and mythological themes on cloth or paper. It features elaborate borders, filled backgrounds, and distinctive fish-eyed figures. Warli art from Maharashtra uses only white rice paste on a reddish-brown background, featuring minimalist geometric compositions of village life with circles, triangles, and squares. Madhubani is colorful and detailed; Warli is monochrome and minimalist.',
  },
  {
    question: 'Are Indian paintings a good investment?',
    answer: 'Traditional Indian art can appreciate in value, especially pieces by recognized masters or from established traditions with growing global demand. However, the primary value of collecting Indian art should be cultural appreciation and support for artisans. Buy what you love from authentic sources, and any investment return is a bonus. The market for authentic traditional Indian art has grown significantly with increased global interest in handmade, culturally significant works.',
  },
  {
    question: 'How do I care for my Indian art?',
    answer: 'Keep Indian paintings away from direct sunlight, which can fade natural pigments. Maintain moderate humidity levels — extremes of dryness or moisture can damage paper, cloth, and wood. For Tanjore paintings with gold leaf, avoid touching the raised surfaces as finger oils can tarnish the gold. For cloth-based art like Pichwai, avoid moisture. Frame works behind UV-protective glass using acid-free matting when possible.',
  },
];

export default function GuidePage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <FAQSchema items={faqItems} />

      <div className="mb-12 text-center">
        <Badge variant="outline" className="mb-4">Comprehensive Guide</Badge>
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
          The Complete Guide to <span className="text-gradient">Indian Art</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about India&apos;s rich artistic heritage — from ancient painting traditions and sculpture to textiles, materials, authentic collecting, and why supporting traditional artisans matters for cultural preservation.
        </p>
      </div>

      <nav className="mb-12 p-6 bg-card rounded-lg border">
        <h2 className="font-bold mb-3">In This Guide</h2>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-primary hover:underline text-sm">
                {section.title}
              </a>
            </li>
          ))}
          <li>
            <a href="#faq" className="text-primary hover:underline text-sm">
              Frequently Asked Questions
            </a>
          </li>
        </ul>
      </nav>

      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{section.content}</p>

            {section.subsections && (
              <div className="grid gap-4 mt-6">
                {section.subsections.map((sub) => (
                  <Card key={sub.title}>
                    <CardHeader>
                      <CardTitle className="text-lg font-headline">{sub.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{sub.description}</p>
                      {sub.link && (
                        <Link href={sub.link} className="text-primary text-sm hover:underline">
                          Read the full guide →
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {section.link && !section.subsections && (
              <Link href={section.link} className="text-primary text-sm hover:underline inline-block mt-2">
                Learn more →
              </Link>
            )}
          </section>
        ))}

        <section id="faq">
          <h2 className="text-2xl font-headline font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base font-headline">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center py-12 bg-card rounded-lg border">
          <h2 className="text-2xl font-headline font-bold mb-4">Ready to Start Collecting?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Browse authentic handcrafted artworks directly from India&apos;s most talented artisans. Every purchase supports a traditional craft family and helps preserve India&apos;s extraordinary cultural heritage.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Explore Marketplace
          </Link>
        </section>
      </div>
    </main>
  );
}
