export interface ArtForm {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  description: string;
  origin: string;
  era: string;
  materials: string[];
  characteristics: string[];
  content: string[];
  relatedBlogSlug?: string;
}

export const artForms: ArtForm[] = [
  {
    slug: 'madhubani',
    title: 'Madhubani Art',
    subtitle: 'Mithila Painting Tradition of Bihar',
    excerpt: 'One of India\'s oldest art forms, Madhubani (Mithila) painting features intricate geometric patterns, bold outlines, and natural pigments. Originating in Bihar, these paintings depict mythological scenes and nature.',
    description: 'Madhubani art is a 2,500-year-old painting tradition from the Mithila region of Bihar, known for its vibrant colors, intricate patterns, and cultural significance.',
    origin: 'Mithila region, Bihar',
    era: '2,500+ years old',
    materials: ['Natural pigments', 'Handmade paper', 'Bamboo pens', 'Fingers and twigs', 'Cow dung base'],
    characteristics: ['Bold black outlines', 'Intricate geometric patterns', 'Densely filled compositions', 'Fish-shaped eyes on figures', 'Natural color palette', 'Elaborate borders'],
    content: [
      'Madhubani art, also known as Mithila painting, originated in the ancient kingdom of Mithila, which finds mention in the Hindu epic Ramayana. According to legend, King Janaka commissioned artists to create paintings for his daughter Sita\'s wedding to Lord Rama, establishing the art form\'s sacred status in Indian culture.',
      'For centuries, the women of Mithila practiced this art form as a domestic tradition, painting elaborate murals on walls and floors during religious ceremonies, festivals, and life events. The tradition was passed down through generations, with mothers teaching daughters the intricate patterns and techniques.',
      'What makes Madhubani truly distinctive is its use of natural materials. Artists use fingers, twigs, brushes, and matchsticks to create compositions. Colors come from turmeric (yellow), indigo (blue), soot (black), beetle nut (red), and various plant extracts for greens and oranges.',
      'Madhubani has five distinct styles: Bharni (color-filled), Katchni (line work), Tantrik (esoteric symbols), Godhana (cow dung base), and Kohbar (wedding themes). Each style has its own visual language and cultural significance.',
      'In the 1960s, a severe drought in Bihar led to Madhubani being adapted from wall murals to paper, allowing it to reach global audiences. Artists like Sita Devi and Jagdamba Devi became cultural ambassadors, receiving national awards for their work.',
      'Today, Madhubani art is celebrated worldwide and holds Geographical Indication (GI) status, protecting the rights of traditional artists and ensuring the authenticity of this ancient craft.',
    ],
    relatedBlogSlug: 'madhubani-art-guide',
  },
  {
    slug: 'warli',
    title: 'Warli Tribal Art',
    subtitle: 'Ancient Folk Paintings of Maharashtra',
    excerpt: 'Warli art is a tribal painting tradition from Maharashtra, characterized by simple stick figures, geometric patterns, and white pigment on mud backgrounds. It depicts daily village life and nature.',
    description: 'Warli art is a 3,000-year-old tribal painting tradition from the Sahyadri ranges of Maharashtra, using basic geometric shapes to create expressive narratives of village life.',
    origin: 'Palghar district, Maharashtra',
    era: '3,000+ years old',
    materials: ['White rice paste', 'Mud and cow dung base', 'Bamboo sticks', 'Natural binders'],
    characteristics: ['Simple stick figures', 'Geometric shapes (circles, triangles, squares)', 'White on earth-toned background', 'Expressive dance poses', 'Nature and village themes', 'Spiral compositions'],
    content: [
      'Warli art is one of India\'s oldest living art forms, created by the Warli tribe who inhabit the mountainous regions of Maharashtra\'s Sahyadri ranges. The name "Warli" comes from the word "warla," meaning field or cultivated land, reflecting the tribe\'s deep connection to agriculture and nature.',
      'Unlike many Indian art forms that depict mythological scenes, Warli art focuses on everyday life — men fishing, women cooking, children playing, and the community dancing. The central theme is often the circle of life, represented through the recurring motif of dancers holding hands in a spiral.',
      'The visual vocabulary of Warli art is remarkably simple yet powerful. Only three basic shapes are used: the circle (representing the sun, moon, and earth), the triangle (representing mountains, trees, and human bodies), and the square (representing sacred spaces). Humans are depicted as two triangles meeting at the tip, with a circle for the head.',
      'The most iconic Warli image is the Tarpa dance, named after the Tarpa, a wind instrument played during celebrations. Dancers form a spiral around the musician, their linked hands creating a flowing, rhythmic pattern that symbolizes community unity and the cycle of life.',
      'White pigment, made from rice flour mixed with water and gum, is applied on a dark background of mud and cow dung. This stark contrast creates a dramatic visual effect. Traditional Warli paintings are created on the walls of village huts during weddings and harvest festivals.',
      'Jivya Soma Mashe, a Warli artist from the Thane district, revolutionized the art form in the 1970s by moving it from mud walls to canvas and paper. He received the Padma Shri in 2011 for his contributions to Warli art, helping it gain international recognition.',
    ],
    relatedBlogSlug: 'warli-art-tribal-paintings',
  },
  {
    slug: 'tanjore',
    title: 'Tanjore Paintings',
    subtitle: 'Gold-Leaf Art of Tamil Nadu',
    excerpt: 'Tanjore (Thanjavur) paintings are known for their rich colors, gold foil embellishments, and embedded gemstones. This classical South Indian art form primarily depicts Hindu deities.',
    description: 'Tanjore painting is a classical South Indian art form from Thanjavur, Tamil Nadu, characterized by gold foil work, vibrant colors, and semi-precious stone embellishments.',
    origin: 'Thanjavur, Tamil Nadu',
    era: '400+ years old (16th century)',
    materials: ['Gold foil (22-carat)', 'Semi-precious stones', 'Natural pigments', 'Canvas or wood board', 'Arabic gum binder'],
    characteristics: ['Heavy gold foil embellishment', 'Vibrant color palette', 'Three-dimensional raised work', 'Elaborate jewelry details', 'Hindu deity themes', 'Rich, decorative borders'],
    content: [
      'Tanjore painting, or Thanjavur painting, originated in the 16th century under the rule of the Nayakas of Thanjavur, who were great patrons of art. The art form flourished further during the Maratha period, with rulers like Serfoji II providing continued royal patronage to artisans.',
      'The most distinctive feature of Tanjore painting is the extensive use of gold foil. Artists apply 22-carat gold leaf to specific areas — typically the jewelry, crowns, and ornaments of deities — creating a luminous, three-dimensional effect that changes with the viewing angle.',
      'The process of creating a Tanjore painting is meticulous and time-consuming. First, a base sketch is drawn on a canvas stretched over a wooden board. A paste of chalk powder and gum arabic is then built up in selected areas to create relief. Gold foil and semi-precious stones are carefully embedded before the final painting begins.',
      'Tanjore paintings typically depict Hindu gods and goddesses, with Lord Krishna, Lord Ganesha, Goddess Lakshmi, and Goddess Saraswati being the most popular subjects. The figures are characterized by rounded faces, almond-shaped eyes, and elaborate jewelry that reflects the grandeur of South Indian temple art.',
      'The color palette is rich and vibrant, with deep reds, blues, greens, and gold dominating the compositions. The backgrounds are usually rendered in a single bold color, making the gold work and the central figure stand out dramatically. Decorative borders with intricate floral or geometric patterns frame each painting.',
      'Today, Tanjore paintings continue to be cherished as devotional objects and collector\'s items. The art form has received Geographical Indication (GI) status, ensuring that only authentic Thanjavur artists can market their work under this prestigious name.',
    ],
    relatedBlogSlug: 'tanjore-paintings-gold-leaf',
  },
  {
    slug: 'pichwai',
    title: 'Pichwai Paintings',
    subtitle: 'Devotional Cloth Art of Rajasthan',
    excerpt: 'Pichwai is a traditional cloth-painting art form from Nathdwara, Rajasthan, depicting Lord Krishna. These intricate devotional paintings are known for their detailed natural elements and spiritual symbolism.',
    description: 'Pichwai (or Pichhwai) is a traditional devotional cloth-painting tradition from Nathdwara, Rajasthan, depicting scenes from Lord Krishna\'s life with intricate natural details.',
    origin: 'Nathdwara, Rajasthan',
    era: '400+ years old',
    materials: ['Handwoven cotton cloth', 'Natural dyes', 'Gold and silver embellishments', 'Tamarind seed paste'],
    characteristics: ['Large-scale cloth paintings', 'Detailed floral and nature motifs', 'Lord Krishna as Shrinathji', 'Rich jewel tones', 'Intricate border work', 'Seasonal variations'],
    content: [
      'Pichwai (meaning "that which hangs behind") is a traditional cloth-painting tradition that originated in Nathdwara, Rajasthan, over 400 years ago. These large-scale paintings serve as backdrops for the idol of Shrinathji — a form of Lord Krishna — in the famous Nathdwara temple.',
      'The tradition of Pichwai painting is intimately connected with the Pushti Marg sect of Vaishnavism founded by Vallabhacharya. The paintings are changed according to the season and festival calendar, with different designs for summer, winter, monsoon, spring, and major festivals like Janmashtami and Holi.',
      'Pichwai paintings are characterized by their rich, intricate detailing and the prominent depiction of Lord Krishna as Shrinathji — a child form of Krishna standing with his left hand on his hip and his right hand holding a lotus. The face is always shown in profile, a distinctive feature of this art form.',
      'The themes are deeply rooted in Krishna\'s life and surrounding nature. Cows, peacocks, lotuses, and the sacred Tulsi plant appear frequently. The monsoon season Pichwais are especially beloved, depicting dark rain clouds, blooming lotuses, peacocks dancing, and the gopis (cowherd girls) celebrating Krishna\'s presence.',
      'Creating a Pichwai is a painstaking process that can take weeks or months. Artists use natural dyes derived from indigo, turmeric, pomegranate, and saffron. Gold and silver embellishments add a divine glow to the paintings. The cloth is specially treated with a mixture of tamarind seed paste and other natural binders to create an ideal painting surface.',
      'While Pichwai paintings were traditionally created exclusively for temple use, contemporary artists now create smaller versions for home decor. The art form is kept alive by master craftspeople in Nathdwara who have inherited this tradition through generations.',
    ],
    relatedBlogSlug: 'pichwai-paintings-rajasthan',
  },
  {
    slug: 'kalamkari',
    title: 'Kalamkari Art',
    subtitle: 'Hand-Drawn Textile Art from Andhra Pradesh',
    excerpt: 'Kalamkari is a hand-painted or block-printed textile art from Andhra Pradesh, using natural dyes and a bamboo pen (kalam). It features mythological scenes, floral motifs, and intricate patterns.',
    description: 'Kalamkari is an ancient hand-painted and block-printed textile art from Andhra Pradesh, using a bamboo pen and natural vegetable dyes to create intricate designs.',
    origin: 'Machilipatnam and Srikalahasti, Andhra Pradesh',
    era: '3,000+ years old',
    materials: ['Cotton fabric', 'Natural vegetable dyes', 'Bamboo pen (kalam)', 'Myrobalan (harda) mordant', 'Alum and iron filings'],
    characteristics: ['Hand-drawn or block-printed', 'Natural color palette', 'Mythological storytelling', 'Intricate floral and paisley patterns', 'Earth tones with indigo', 'Borders with temple motifs'],
    content: [
      'Kalamkari is one of India\'s most ancient textile arts, with origins dating back over 3,000 years. The name comes from the Persian words "kalam" (pen) and "kari" (craftsmanship), literally meaning "pen-crafted" art. This exquisite art form involves hand-painting or block-printing designs on cotton fabric using natural dyes.',
      'Kalamkari has two distinct styles: Srikalahasti style, which is entirely hand-drawn using a bamboo pen, and Machilipatnam style, which uses hand-carved wooden blocks for printing. Both styles produce stunning results but require different skill sets and have distinct visual characteristics.',
      'The process of creating Kalamkari is remarkably complex and involves 17-23 steps. The fabric is first treated with a mixture of myrobalan (harda) and buffalo milk to fix the dyes. Artists then hand-draw the outline using a bamboo pen dipped in a mixture of jaggery and iron filings, which creates a rich black color after oxidation.',
      'Natural dyes are central to Kalamkari. The red comes from madder root, blue from indigo, yellow from pomegranate, and other hues from various plant sources. Unlike synthetic dyes, these natural colors age gracefully, developing a beautiful patina over time that enhances the fabric\'s appeal.',
      'Traditional Kalamkari designs tell stories — usually scenes from Hindu mythology, including the Ramayana, Mahabharata, and Krishna\'s life. The borders typically feature intricate floral and geometric patterns, while the main body of the fabric depicts narrative scenes with detailed figures.',
      'Kalamkari has received Geographical Indication (GI) status for both the Srikalahasti and Machilipatnam styles, protecting this ancient craft and the livelihoods of the artisans who keep this tradition alive through their exceptional skill and dedication.',
    ],
    relatedBlogSlug: 'indian-textile-heritage',
  },
  {
    slug: 'rajasthani-miniatures',
    title: 'Rajasthani Miniature Paintings',
    subtitle: 'Intricate Court Art of Rajasthan',
    excerpt: 'Rajasthani miniature paintings are detailed, small-scale artworks depicting royal courts, hunting scenes, and romantic themes. Each school — Mewar, Marwar, Kishangarh, and Bundi — has its distinct style.',
    description: 'Rajasthani miniature paintings are highly detailed small-scale artworks developed in the royal courts of Rajasthan, with distinct schools like Mewar, Marwar, Kishangarh, and Bundi.',
    origin: 'Various Rajput courts, Rajasthan',
    era: '500+ years old (16th-19th centuries)',
    materials: ['Natural mineral pigments', 'Gold and silver leaf', 'Handmade paper', 'Fine brushes (squirrel hair)', 'Gum arabic binder'],
    characteristics: ['Small-scale detailed work', 'Vibrant mineral colors', 'Gold and silver accents', 'Stylized facial features', 'Architectural settings', 'Romantic and courtly themes'],
    content: [
      'Rajasthani miniature painting developed in the royal courts of Rajasthan between the 16th and 19th centuries, blending indigenous Rajasthani styles with influences from Mughal miniature painting. Each Rajput kingdom developed its own distinctive school, resulting in a rich diversity of styles across the region.',
      'The Mewar school (Udaipur) is the oldest, known for its bold colors, simplified forms, and epic narratives from the Ramayana and Mahabharata. The Marwar school (Jodhpur) is characterized by dynamic compositions, energetic brushwork, and themes of music and dance.',
      'The Kishangarh school is celebrated for its most famous painting "Bani Thani," featuring an idealized female form with arched eyebrows, lotus-shaped eyes, and a pointed chin. The Bundi and Kota schools are known for their lush green landscapes, romantic themes, and depictions of hunting scenes with dense forest settings.',
      'Creating miniature paintings requires extraordinary precision and patience. Artists use brushes made from a few strands of squirrel hair to achieve the fine detail. Mineral and gemstone pigments are ground by hand — lapis lazuli for blue, crushed emeralds for green, and real gold and silver for highlights.',
      'The themes of Rajasthani miniatures range from religious devotion (depictions of Krishna and Radha) to royal portraiture, hunting expeditions, musical performances, and romantic encounters. Nature is depicted with great detail, with each flower, tree, and animal rendered in exquisite detail.',
      'Today, master miniature painters continue this tradition in Rajasthan, particularly in Jaipur, Udaipur, and Kishangarh. The art form has received global recognition, with major museums around the world housing significant collections of Rajasthani miniature paintings.',
    ],
    relatedBlogSlug: 'artisan-spotlight-rajasthani-miniatures',
  },
];

export const artFormCategories = [
  { name: 'Paintings', slugs: ['madhubani', 'warli', 'tanjore', 'pichwai', 'rajasthani-miniatures'] },
  { name: 'Textiles', slugs: ['kalamkari'] },
];

export function getArtFormBySlug(slug: string): ArtForm | undefined {
  return artForms.find(a => a.slug === slug);
}
