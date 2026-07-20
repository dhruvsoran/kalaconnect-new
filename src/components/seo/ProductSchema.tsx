import { JsonLd } from './JsonLd';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price?: number;
  currency?: string;
  availability?: string;
  brand?: string;
  sku?: string;
  url?: string;
  rating?: number;
  reviewCount?: number;
  review?: {
    author: string;
    ratingValue: number;
    reviewBody?: string;
  };
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
  review,
}: ProductSchemaProps) {
  const validPrice = typeof price === 'number' && price > 0;
  const validRating = typeof rating === 'number' && typeof reviewCount === 'number' && reviewCount > 0;

  const offers = validPrice ? {
    '@type': 'Offer',
    url: url || 'https://www.kalaconnect.me/explore',
    priceCurrency: currency,
    price,
    availability,
    seller: {
      '@type': 'Organization',
      name: 'कलाConnect',
    },
  } : undefined;

  const aggregateRating = validRating ? {
    '@type': 'AggregateRating',
    ratingValue: rating,
    reviewCount,
  } : undefined;

  const reviewSchema = review ? {
    '@type': 'Review',
    author: { '@type': 'Person', name: review.author },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue,
    },
    reviewBody: review.reviewBody,
  } : undefined;

  if (!offers && !aggregateRating && !reviewSchema) return null;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku: sku || name.toLowerCase().replace(/\s+/g, '-'),
  };

  if (brand) data.brand = { '@type': 'Brand', name: brand };
  if (offers) data.offers = offers;
  if (aggregateRating) data.aggregateRating = aggregateRating;
  if (reviewSchema) data.review = reviewSchema;

  return <JsonLd data={data} />;
}