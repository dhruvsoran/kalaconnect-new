import { JsonLd } from './JsonLd';

interface ItemListSchemaProps {
  name: string;
  description?: string;
  items: {
    name: string;
    url: string;
    image?: string;
    description?: string;
  }[];
}

export function ItemListSchema({ name, description, items }: ItemListSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        url: item.url,
        image: item.image,
        description: item.description,
      },
    })),
  };

  return <JsonLd data={data} />;
}
