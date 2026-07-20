import { JsonLd } from './JsonLd';

export function LocalBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'कलाConnect',
    alternateName: 'KalaConnect',
    description: 'AI-powered digital marketplace connecting Indian artisans directly with art lovers worldwide. Discover authentic handcrafted paintings, sculptures, and traditional crafts.',
    url: 'https://www.kalaconnect.me',
    logo: 'https://www.kalaconnect.me/logo.png',
    image: 'https://www.kalaconnect.me/og-image.svg',
    email: 'support@kalaconnect.me',
    telephone: '+91-7818093944',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Meerut',
      addressLocality: 'Meerut',
      addressRegion: 'Uttar Pradesh',
      postalCode: '250001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.9845,
      longitude: 77.7064,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [
      'https://instagram.com/kalaconnect',
      'https://facebook.com/kalaconnect',
      'https://twitter.com/kalaconnect',
    ],
    priceRange: '₹₹',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Indian Art & Crafts',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Paintings',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Madhubani Paintings' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Warli Art' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Tanjore Paintings' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Sculptures',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Bronze Sculptures' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Stone Carvings' } },
          ],
        },
      ],
    },
  };

  return <JsonLd data={data} />;
}
