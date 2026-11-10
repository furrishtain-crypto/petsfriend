import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pages, pageBySlug, redirectOrNotFound } from '@/lib/data';
import { Crumbs } from '@/components/chrome';
import { Markdown } from '@/lib/markdown';
import { JsonLd } from '@/lib/jsonld';
import { abs } from '@/lib/site';

type P = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return pages().map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const pg = pageBySlug(slug);
  if (!pg || !pg.published) return { robots: { index: false } };
  return { title: pg.seo_title || pg.title, description: (pg.seo_description || pg.body.replace(/[#*\-\[\]]/g, '').slice(0, 160)).trim(), alternates: { canonical: `/${pg.slug}` } };
}

export default async function CmsPage({ params }: P) {
  const { slug } = await params;
  const pg = pageBySlug(slug);
  if (!pg) redirectOrNotFound(`/${slug}`);
  if (!pg.published) notFound();
  return (
    <>
      <Crumbs items={[{ name: pg.title, path: `/${pg.slug}` }]} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': slug === 'about' ? 'AboutPage' : slug === 'contact' ? 'ContactPage' : 'WebPage', name: pg.title, url: abs(`/${pg.slug}`) }} />
      <article className="sec" style={{ paddingTop: 12 }}>
        <h1>{pg.title}</h1>
        <div className="prose"><Markdown source={pg.body} /></div>
      </article>
    </>
  );
}
