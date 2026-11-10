import type { Metadata } from 'next';
import { collections } from '@/lib/data';
import { CollectionTile } from '@/components/cards';
import { Crumbs } from '@/components/chrome';
import { JsonLd } from '@/lib/jsonld';
import { abs } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Wholesale pet supply collections',
  description: 'Browse all Pets Friend wholesale collections: dog supplies, cat supplies, feeding and grooming, and new arrivals.',
  alternates: { canonical: '/collections' },
};

export default function Collections() {
  const cols = collections();
  return (
    <>
      <Crumbs items={[{ name: 'Collections', path: '/collections' }]} />
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Collections', url: abs('/collections'),
        mainEntity: { '@type': 'ItemList', itemListElement: cols.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/collections/${c.slug}`), name: c.name })) },
      }} />
      <section className="sec" style={{ paddingTop: 12 }}>
        <h1>Collections</h1>
        <div className="grid-cols">{cols.map((c) => <CollectionTile key={c.id} c={c} />)}</div>
      </section>
    </>
  );
}
