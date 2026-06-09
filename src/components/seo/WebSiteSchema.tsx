import { JsonLd } from './JsonLd';

export function WebSiteSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'कलाConnect',
    alternateName: 'KalaConnect',
    url: 'https://kalaconnect.com',
    description: 'AI-powered digital marketplace connecting Indian artisans directly with art lovers worldwide.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://kalaconnect.com/explore?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'कलाConnect',
    },
  };

  return <JsonLd data={data} />;
}