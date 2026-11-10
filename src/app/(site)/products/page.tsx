import type { Metadata } from 'next';
import { searchIndex, collections, brands, products } from '@/lib/data';
import { CatalogView } from '@/components/catalog-view';
import { Crumbs } from '@/components/chrome';
import { JsonLd } from '@/lib/jsonld';
import { abs } from '@/lib/site';

export const metadata: Metadata = {
  title: 'All wholesale pet products',
  description: 'Every Pets Friend wholesale product with its MOQ and quantity slab prices.',
  alternates: { canonical: '/products' },
};

export default function AllProducts() {
  const all = products();
  return (
    <>
      <Crumbs visual={false} items={[{ name: 'All products', path: '/products' }]} />
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'All wholesale pet products', url: abs('/products'),
        mainEntity: { '@type': 'ItemList', numberOfItems: all.length, itemListElement: all.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/products/${p.slug}`), name: p.name })) },
      }} />
      <CatalogView title="All trade products" crumbs="Catalog / All products" items={searchIndex()}
        collections={collections().map(({ id, name, slug }) => ({ id, name, slug }))} brands={brands().map(({ id, name, slug }) => ({ id, name, slug }))} />
    </>
  );
}
