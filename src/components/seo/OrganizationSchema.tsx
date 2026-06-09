import { JsonLd } from './JsonLd';

export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'कलाConnect',
    alternateName: 'KalaConnect',
    url: 'https://kalaconnect.me',
    logo: 'https://kalaconnect.me/favicon.svg',
    description: 'AI-powered digital marketplace connecting Indian artisans directly with art lovers worldwide. Discover authentic handcrafted paintings, sculptures, and traditional crafts.',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Meerut',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7818093944',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://instagram.com/kalaconnect',
      'https://facebook.com/kalaconnect',
      'https://twitter.com/kalaconnect',
    ],
  };

  return <JsonLd data={data} />;
}