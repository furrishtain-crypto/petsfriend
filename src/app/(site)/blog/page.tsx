import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/lib/data';
import { Crumbs } from '@/components/chrome';
import { Paw } from '@/components/icons';
import { BlogList } from '@/components/blog-list';
import { JsonLd } from '@/lib/jsonld';
import { abs } from '@/lib/site';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Blog: wholesale buying guides for pet retailers',
  description: `Guides and checklists for pet shop owners from ${SITE.name}: MOQ, slab pricing, GST invoices and stocking advice.`,
  alternates: { canonical: '/blog' },
};

export default function Blog() {
  const all = posts();
  return (
    <>
      <Crumbs visual={false} items={[{ name: 'Blog', path: '/blog' }]} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Blog', name: `${SITE.name} blog`, url: abs('/blog'), blogPost: all.map((b) => ({ '@type': 'BlogPosting', headline: b.title, url: abs(`/blog/${b.slug}`), datePublished: b.published_at || b.created_at })) }} />
      <section className="sectionpad" style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div style={{ background: '#FFC9B0', border: '1.5px solid #101B33', borderRadius: 32, padding: 48, display: 'flex', flexWrap: 'wrap', gap: '24px 40px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <div className="m" style={{ fontSize: 13 }}>Trade journal</div>
            <h1 className="d bigh1" style={{ fontSize: 64, lineHeight: 1, margin: '12px 0 14px' }}>Buying guides for pet retailers</h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, margin: 0, maxWidth: 520 }}>MOQs, slab pricing, GST invoices and what to stock. Short, practical, written for shop owners.</p>
          </div>
          <Paw size={150} sw={1.6} />
        </div>
      </section>

      <BlogList all={all.map((b) => ({ id: b.id, slug: b.slug, title: b.title, excerpt: b.excerpt, category: b.category, author: b.author, date: b.published_at || b.created_at }))} />

      <section className="sectionpad" style={{ paddingTop: 0, paddingBottom: 88 }}>
        <div className="band" style={{ background: '#101B33', color: '#F3F4F8', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <span className="m" style={{ fontSize: 13, color: '#FFD966' }}>Trade accounts</span>
            <h2 className="d" style={{ fontSize: 40, lineHeight: 1, margin: '12px 0' }}>See slab prices on every product.</h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: '#C9CEDD', margin: 0, maxWidth: 480 }}>Apply with your GST number and the whole catalog opens up.</p>
          </div>
          <Link href="/trade" className="b butter hover-lift" style={{ minHeight: 54, padding: '0 30px', fontSize: 17 }}>Apply for an account</Link>
        </div>
      </section>
    </>
  );
}
