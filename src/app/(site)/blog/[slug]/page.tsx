import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { postBySlug, posts, redirectOrNotFound } from '@/lib/data';
import { Crumbs } from '@/components/chrome';
import { Markdown, headings } from '@/lib/markdown';
import { JsonLd } from '@/lib/jsonld';
import { abs, SITE } from '@/lib/site';
import Link from 'next/link';
import { Paw } from '@/components/icons';

type P = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return posts().map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const b = postBySlug(slug);
  if (!b || !b.published) return { robots: { index: false } };
  const d = b.seo_description || b.excerpt;
  return {
    title: b.seo_title || b.title,
    description: d.slice(0, 160),
    alternates: { canonical: `/blog/${b.slug}` },
    openGraph: { type: 'article', title: b.title, description: d.slice(0, 160), url: abs(`/blog/${b.slug}`), publishedTime: b.published_at || undefined },
  };
}

export default async function Post({ params }: P) {
  const { slug } = await params;
  const b = postBySlug(slug);
  if (!b) redirectOrNotFound(`/blog/${slug}`);
  if (!b.published) notFound();
  const toc = headings(b.body);
  const more = posts().filter((x) => x.id !== b.id).slice(0, 2);
  return (
    <>
      <Crumbs visual={false} items={[{ name: 'Blog', path: '/blog' }, { name: b.title, path: `/blog/${b.slug}` }]} />
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'BlogPosting', headline: b.title, description: b.excerpt,
        datePublished: b.published_at || b.created_at, dateModified: b.updated_at,
        author: { '@type': 'Person', name: b.author }, publisher: { '@id': abs('/#organization') },
        mainEntityOfPage: abs(`/blog/${b.slug}`), url: abs(`/blog/${b.slug}`), inLanguage: 'en-IN', articleSection: b.category,
        isPartOf: { '@type': 'Blog', name: `${SITE.name} blog`, url: abs('/blog') },
      }} />
      <article>
        <section className="sectionpad" style={{ paddingTop: 40, paddingBottom: 24 }}>
          <div style={{ background: '#BDEBD3', border: '1.5px solid #101B33', borderRadius: 32, padding: '48px 48px 44px', display: 'flex', flexWrap: 'wrap', gap: '24px 40px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: '1 1 480px', minWidth: 0 }}>
              <span className="chip" style={{ background: '#fff' }}>{b.category}</span>
              <h1 className="d bigh1" style={{ fontSize: 56, lineHeight: 1.02, margin: '16px 0 14px', maxWidth: 820 }}>{b.title}</h1>
              <p style={{ fontSize: 18, lineHeight: 1.55, margin: '0 0 16px', maxWidth: 640 }}>{b.excerpt}</p>
              <div className="m" style={{ fontSize: 13 }}>By {b.author} · {new Date(b.published_at || b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            </div>
            <Paw size={140} sw={1.6} />
          </div>
        </section>

        <section className="sectionpad" style={{ paddingTop: 24, paddingBottom: 56, display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' }}>
          <div className="prose" style={{ flex: '1 1 560px', minWidth: 0, maxWidth: 760 }}><Markdown source={b.body} /></div>
          <aside style={{ flex: '1 1 300px', minWidth: 0, maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 20 }}>
            {toc.length > 2 && (
              <div className="panel sm" style={{ padding: 22 }}>
                <div className="m" style={{ fontSize: 12, color: '#4A5470', marginBottom: 10 }}>In this article</div>
                {toc.map((h) => <a key={h.id} href={`#${h.id}`} style={{ display: 'block', padding: '8px 0', borderTop: '1px solid #D9DCE6', fontSize: 15, fontWeight: 500 }}>{h.text}</a>)}
              </div>
            )}
            <div style={{ background: '#FFD966', border: '1.5px solid #101B33', borderRadius: 26, padding: 26 }}>
              <h2 className="d" style={{ fontSize: 24, margin: '0 0 8px' }}>Get trade pricing</h2>
              <p style={{ fontSize: 15, lineHeight: 1.5, margin: '0 0 16px' }}>Apply with your GST number to see MOQs and slab prices on every product.</p>
              <Link href="/trade" className="b ink hover-lift" style={{ minHeight: 48, fontSize: 15 }}>Apply for an account</Link>
            </div>
          </aside>
        </section>

        {more.length > 0 && (
          <section className="sectionpad" style={{ paddingTop: 0, paddingBottom: 88 }}>
            <h2 className="d" style={{ fontSize: 40, margin: '0 0 22px' }}>Keep reading</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {more.map((m, i) => (
                <Link key={m.id} href={`/blog/${m.slug}`} className="hover-lift" style={{ display: 'flex', flexDirection: 'column', gap: 10, background: ['#BFE0FF', '#D9D4FF'][i % 2], border: '1.5px solid #101B33', borderRadius: 22, padding: 26 }}>
                  <span className="chip" style={{ alignSelf: 'flex-start', background: '#fff' }}>{m.category}</span>
                  <h3 className="d" style={{ fontSize: 26, lineHeight: 1.1 }}>{m.title}</h3>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{m.excerpt}</p>
                  <span style={{ fontWeight: 600, borderBottom: '2px solid #101B33', alignSelf: 'flex-start', marginTop: 4 }}>Read</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
