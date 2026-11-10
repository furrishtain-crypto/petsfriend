import type { Metadata } from 'next';
import { collectionBySlug, collections, brands, productsInCollection, searchIndex } from '@/lib/data';
import { CatalogView } from '@/components/catalog-view';
import { Crumbs } from '@/components/chrome';
import { JsonLd } from '@/lib/jsonld';
import { abs } from '@/lib/site';
import { notFound } from 'next/navigation';

type P = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return collections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const c = collectionBySlug(slug);
  if (!c) return { robots: { index: false } };
  return {
    title: c.seo_title || `${c.name} wholesale`,
    description: c.seo_description || c.description.slice(0, 160),
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title: c.name, description: c.description.slice(0, 160), url: abs(`/collections/${c.slug}`) },
  };
}

export default async function CollectionPage({ params }: P) {
  const { slug } = await params;
  const c = collectionBySlug(slug);
  if (!c) notFound();
  const all = productsInCollection(c.id);
  const slugs = new Set(all.map((p) => p.slug));
  const items = searchIndex().filter((i) => slugs.has(i.slug));
  return (
    <>
      <Crumbs visual={false} items={[{ name: 'Collections', path: '/collections' }, { name: c.name, path: `/collections/${c.slug}` }]} />
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.name, description: c.description, url: abs(`/collections/${c.slug}`),
        mainEntity: { '@type': 'ItemList', numberOfItems: all.length, itemListElement: all.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/products/${p.slug}`), name: p.name })) },
      }} />
      <CatalogView title={c.name} crumbs={`Catalog / ${c.name}`} items={items} collections={collections().map(({ id, name, slug }) => ({ id, name, slug }))} brands={brands().map(({ id, name, slug }) => ({ id, name, slug }))} activeSlug={c.slug} intro={c.description} />
    </>
  );
}
