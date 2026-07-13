import { JsonLd } from './JsonLd';

interface BlogPostingSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}

export function BlogPostingSchema({
  title,
  description,
  image = 'https://kalaconnect.me/og-image.svg',
  datePublished,
  dateModified,
  author = 'KalaConnect',
  url,
}: BlogPostingSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://kalaconnect.me',
    },
    publisher: {
      '@type': 'Organization',
      name: 'कलाConnect',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kalaconnect.me/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <JsonLd data={data} />;
}
