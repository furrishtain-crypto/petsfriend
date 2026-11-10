import type { Metadata } from 'next';
import { brands } from '@/lib/data';
import { Crumbs } from '@/components/chrome';
import { BrandsView } from '@/components/brands-view';
import { JsonLd } from '@/lib/jsonld';
import { abs } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Shop by brands',
  description: 'Every pet product brand supplied wholesale by Pets Friend, with its own MOQs and quantity slab prices.',
  alternates: { canonical: '/brands' },
};

export default function Brands() {
  const all = brands();
  return (
    <>
      <Crumbs visual={false} items={[{ name: 'Brands', path: '/brands' }]} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Shop by brands', url: abs('/brands'), mainEntity: { '@type': 'ItemList', itemListElement: all.map((b, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/brands/${b.slug}`), name: b.name })) } }} />
      <BrandsView all={all.map(({ id, name, slug, product_count, min_moq }) => ({ id, name, slug, product_count, min_moq }))} />
    </>
  );
}
