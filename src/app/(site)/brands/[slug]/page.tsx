import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brands, brandBySlug, productsByBrand, redirectOrNotFound } from '@/lib/data';
import { Crumbs } from '@/components/chrome';
import { ProductCard } from '@/components/cards';
import { JsonLd } from '@/lib/jsonld';
import { abs } from '@/lib/site';

type P = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return brands().map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const b = brandBySlug(slug);
  if (!b || !b.published) return { robots: { index: false } };
  return { title: `${b.name} wholesale`, description: b.description.slice(0, 160) || `${b.name} products supplied wholesale by Pets Friend.`, alternates: { canonical: `/brands/${b.slug}` } };
}

export default async function BrandPage({ params }: P) {
  const { slug } = await params;
  const b = brandBySlug(slug);
  if (!b) redirectOrNotFound(`/brands/${slug}`);
  if (!b.published) notFound();
  const items = productsByBrand(b.id);
  return (
    <>
      <Crumbs items={[{ name: 'Brands', path: '/brands' }, { name: b.name, path: `/brands/${b.slug}` }]} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Brand', name: b.name, url: abs(`/brands/${b.slug}`), description: b.description }} />
      <section className="sec" style={{ paddingTop: 12 }}>
        <h1>{b.name}</h1>
        {b.description && <p className="muted" style={{ maxWidth: 700 }}>{b.description}</p>}
        <div className="grid-cols">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    </>
  );
}
