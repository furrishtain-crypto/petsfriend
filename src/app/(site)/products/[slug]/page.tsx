import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, productBySlug, slabsFor, collectionsForProduct, productsInCollection, redirectOrNotFound } from '@/lib/data';
import { Crumbs } from '@/components/chrome';
import { ProductCard } from '@/components/cards';
import { ProductBuy } from '@/components/product-buy';
import { Paw } from '@/components/icons';
import { JsonLd } from '@/lib/jsonld';
import { abs, SITE, inr } from '@/lib/site';

type P = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return products().map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p || !p.published) return { robots: { index: false } };
  const desc = p.seo_description || `${p.name}${p.brand_name ? ' by ' + p.brand_name : ''}. Wholesale from ${inr(p.low_price ?? p.base_price)} per piece, MOQ ${p.moq}. GST invoice.`;
  return {
    title: p.seo_title || `${p.name} wholesale, MOQ ${p.moq}`,
    description: desc.slice(0, 160),
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { type: 'website', title: p.name, description: desc.slice(0, 160), url: abs(`/products/${p.slug}`) },
  };
}

const f = (n: number) => n.toLocaleString('en-IN');

export default async function ProductPage({ params }: P) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) redirectOrNotFound(`/products/${slug}`);
  if (!p.published) notFound();

  const slabs = slabsFor(p.id);
  const cols = collectionsForProduct(p.id);
  const primary = cols[0];
  const related = primary ? productsInCollection(primary.id).filter((x) => x.id !== p.id).slice(0, 4) : [];
  const together = related.slice(0, 3);
  const prices = slabs.map((s) => s.price);
  const low = prices.length ? Math.min(...prices) : p.base_price;
  const high = prices.length ? Math.max(...prices) : p.base_price;
  const base = slabs[0]?.price ?? p.base_price;

  const trail = [{ name: 'Collections', path: '/collections' }];
  if (primary) trail.push({ name: primary.name, path: `/collections/${primary.slug}` });
  trail.push({ name: p.name, path: `/products/${p.slug}` });

  const availability = p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', '@id': abs(`/products/${p.slug}#product`),
    name: p.name, sku: p.sku || undefined, description: p.description, url: abs(`/products/${p.slug}`),
    brand: p.brand_name ? { '@type': 'Brand', name: p.brand_name } : undefined,
    offers: {
      '@type': 'AggregateOffer', priceCurrency: SITE.currency, lowPrice: low, highPrice: high, offerCount: slabs.length, availability,
      offers: slabs.map((s) => ({
        '@type': 'Offer', priceCurrency: SITE.currency, price: s.price, availability, url: abs(`/products/${p.slug}`),
        eligibleQuantity: { '@type': 'QuantitativeValue', minValue: s.min_qty, ...(s.max_qty ? { maxValue: s.max_qty } : {}), unitText: 'piece' },
        businessFunction: 'http://purl.org/goodrelations/v1#Sell',
      })),
    },
  };

  return (
    <>
      <Crumbs items={trail} />
      <JsonLd data={ld} />

      <section className="wrap pdp">
        <div className="gal">
          <div className="hero-img" style={{ background: p.tile }}>
            <Paw size={220} sw={1.6} />
            <span className="m" style={{ position: 'absolute', left: 18, bottom: 16, fontSize: 12 }}>Product photo, 1:1</span>
            <span className="d" style={{ position: 'absolute', top: 20, left: 20, background: '#fff', border: '1.5px solid #101B33', borderRadius: 12, padding: '8px 14px', fontSize: 16, transform: 'rotate(-4deg)' }}>Trade bestseller</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 12, marginTop: 12 }}>
            {['#FFC9B0', '#BDEBD3', '#BFE0FF'].map((c) => <div key={c} style={{ height: 104, background: c, border: '1.5px solid #101B33', borderRadius: 16 }} />)}
            <div style={{ height: 104, background: '#fff', border: '1.5px solid #101B33', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500 }}>Pack shot</div>
          </div>
        </div>

        <div className="info">
          <div className="m" style={{ fontSize: 13, color: '#4A5470' }}>{p.sku || '—'}{primary ? ` · ${primary.name}` : ''}{p.brand_name ? <> · <Link href={`/brands/${p.brand_slug}`} style={{ textDecoration: 'underline' }}>{p.brand_name}</Link></> : null}</div>
          <h1 className="d">{p.name}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: '#4A5470', margin: '0 0 24px' }}>{p.description}</p>
          <ProductBuy slabs={slabs} moq={p.moq} slug={p.slug} gstRate={p.gst_rate} name={p.name} sku={p.sku || ''} tile={p.tile} />
        </div>
      </section>

      <section className="row-flex">
        <div style={{ flex: '1 1 520px', minWidth: 0, background: '#fff', border: '1.5px solid #101B33', borderRadius: 24, padding: 28 }}>
          <h2 className="d" style={{ fontSize: 30, margin: '0 0 6px' }}>Full slab ladder</h2>
          <p style={{ fontSize: 15, color: '#4A5470', margin: '0 0 18px' }}>Every slab for this product, with the saving against the first one.</p>
          <div style={{ fontSize: 15 }}>
            <div className="m" style={{ display: 'flex', padding: '10px 12px', fontSize: 12, color: '#4A5470' }}><span style={{ flex: 1.2 }}>Slab</span><span style={{ flex: 1 }}>Unit price</span><span style={{ flex: 1 }}>Per {f(p.moq)} pcs</span><span style={{ flex: 1, textAlign: 'right' }}>Saving</span></div>
            {slabs.map((s, i) => (
              <div className="ladder-row" key={s.min_qty} style={{ background: i === 1 ? '#FFD966' : 'transparent' }}>
                <span className="m" style={{ flex: 1.2 }}>{s.max_qty ? `${f(s.min_qty)}–${f(s.max_qty)}` : `${f(s.min_qty)}+`} pcs</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{inr(s.price)}</span>
                <span style={{ flex: 1 }}>{inr(s.price * p.moq)}</span>
                <span style={{ flex: 1, textAlign: 'right' }}>{i === 0 ? '—' : `${Math.round((1 - s.price / base) * 100)}% off`}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: '1 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="box" style={{ background: '#D9D4FF' }}>
            <h3 className="d">Specifications</h3>
            <div style={{ fontSize: 15, lineHeight: 1.5 }}>
              {[['SKU', p.sku || '—'], ['Brand', p.brand_name || '—'], ['Minimum order', `${f(p.moq)} pcs`], ['Collection', primary?.name || '—']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderTop: '1px solid #101B33' }}><span>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>
              ))}
            </div>
          </div>
          <div className="box">
            <h3 className="d">Trade terms</h3>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: '#4A5470' }}>
              <div style={{ padding: '6px 0' }}>Dispatch in [LEAD TIME] working days after payment.</div>
              <div style={{ padding: '6px 0' }}>Prices exclude GST. A tax invoice is raised on dispatch.</div>
              <div style={{ padding: '6px 0' }}>Orders above [FREE SHIPPING VALUE] ship free.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="row-flex">
        <div style={{ flex: '1 1 520px', minWidth: 0, background: '#fff', border: '1.5px solid #101B33', borderRadius: 24, padding: 28 }}>
          <h2 className="d" style={{ fontSize: 30, margin: '0 0 14px' }}>About this product</h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: '#4A5470', margin: 0 }}>{p.description}</p>
        </div>
        <div style={{ flex: '1 1 360px', minWidth: 0 }}>
          <div className="box">
            <h3 className="d">Packing and dispatch</h3>
            <div className="kv"><span>Carton quantity</span><b>{f(p.moq)} pcs</b></div>
            <div className="kv"><span>HSN code</span><b>{p.hsn || '[HSN]'}</b></div>
            <div className="kv"><span>GST rate</span><b>{p.gst_rate}%</b></div>
            <div className="kv"><span>Stock</span><b>{p.stock > 0 ? 'In stock' : 'Made to order'}</b></div>
          </div>
        </div>
      </section>

      {together.length > 0 && (
        <section className="wrap" style={{ paddingBottom: 72 }}>
          <div style={{ background: '#FFD966', border: '1.5px solid #101B33', borderRadius: 28, padding: 32 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <h2 className="d" style={{ fontSize: 34 }}>Often ordered together</h2>
              <Link href="/quote" className="b ink hover-lift" style={{ minHeight: 48, fontSize: 15 }}>Request a quote for all</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
              {together.map((x) => (
                <Link key={x.id} href={`/products/${x.slug}`} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1.5px solid #101B33', borderRadius: 18, padding: 14 }}>
                  <div style={{ flex: '0 0 72px', height: 72, background: x.tile, border: '1.5px solid #101B33', borderRadius: 14 }} />
                  <div style={{ flex: 1, minWidth: 0 }}><div className="m" style={{ fontSize: 11, color: '#4A5470' }}>{x.sku} · MOQ {x.moq}</div><div style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.2, margin: '4px 0' }}>{x.name}</div><div style={{ fontSize: 14, color: '#4A5470' }}>From {inr(x.low_price ?? x.base_price)} / pc</div></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="wrap" style={{ paddingBottom: 72 }}>
          <div className="rowhead" style={{ marginBottom: 24 }}><h2 className="d" style={{ fontSize: 40 }}>You may also stock</h2><Link href={primary ? `/collections/${primary.slug}` : '/products'} className="ulink">View collection</Link></div>
          <div className="pgrid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}

      <section className="wrap" style={{ paddingBottom: 88 }}>
        <div className="band" style={{ background: '#27BFB1', borderRadius: 30, padding: '40px 44px', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 420px', minWidth: 0 }}><h2 className="d" style={{ fontSize: 40, lineHeight: 1.02, margin: '0 0 10px' }}>Want to see the quality first?</h2><p style={{ fontSize: 17, lineHeight: 1.5, margin: 0, maxWidth: 520 }}>Request a sample of this SKU before you commit to a slab. [SAMPLE POLICY]</p></div>
          <Link href={`/quote?product=${p.slug}&qty=1`} className="b ink hover-lift" style={{ minHeight: 54, padding: '0 30px', fontSize: 17 }}>Request a sample</Link>
        </div>
      </section>
    </>
  );
}
