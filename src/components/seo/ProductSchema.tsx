import { JsonLd } from './JsonLd';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: string;
  brand?: string;
  sku?: string;
  url?: string;
  rating?: number;
  reviewCount?: number;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = 'INR',
  availability = 'https://schema.org/InStock',
  brand,
  sku,
  url,
  rating,
  reviewCount,
}: ProductSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku: sku || name.toLowerCase().replace(/\s+/g, '-'),
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    offers: {
      '@type': 'Offer',
      url: url || 'https://kalaconnect.me/explore',
      priceCurrency: currency,
      price,
      availability,
      seller: {
        '@type': 'Organization',
        name: 'कलाConnect',
      },
    },
    aggregateRating: rating && reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount,
    } : undefined,
  };

  return <JsonLd data={data} />;
}