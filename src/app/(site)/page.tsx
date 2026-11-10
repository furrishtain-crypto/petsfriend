import Link from 'next/link';
import type { Metadata } from 'next';
import { collections, products, brands, slabsFor, productsInCollection, pageBySlug } from '@/lib/data';
import { CollectionTile, ProductCard } from '@/components/cards';
import { HeroSlider, BestTabs, Faq } from '@/components/home-client';
import { Ico, PATHS } from '@/components/icons';
import { SITE, inr } from '@/lib/site';
import { JsonLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} | Wholesale dog and cat supplies for pet retailers in India` },
  description: SITE.description,
  alternates: { canonical: '/' },
};

const PERKS = [
  { t: 'Free shipping', d: 'On orders above [FREE SHIPPING VALUE]', bg: '#BDEBD3', p: PATHS.truck },
  { t: 'Order on WhatsApp', d: `Send your list to ${SITE.phone}`, bg: '#FFD966', p: PATHS.wa },
  { t: 'GST invoice', d: 'On every order, saved to your account', bg: '#BFE0FF', p: PATHS.invoice },
  { t: 'Trade desk support', d: '[HOURS], online store 24/7', bg: '#D9D4FF', p: PATHS.support },
];
const WHY = [
  { t: 'MOQ clear on every SKU', d: 'No back-and-forth to learn the minimum. It sits on every card and product page.', bg: '#FFD966' },
  { t: 'Slab pricing, no guesswork', d: 'Choose a slab and see the unit price, total, GST and saving before you commit.', bg: '#BDEBD3' },
  { t: 'GST invoice every time', d: 'Tax invoices are generated on dispatch and kept in your account for reorders and filing.', bg: '#BFE0FF' },
  { t: 'WhatsApp-first support', d: 'Send a list, ask for a quote or track an order from the app you already use.', bg: '#D9D4FF' },
];
const STEPS = [
  ['01', 'Apply', 'Share your GST number and shop details.'],
  ['02', 'Get verified', 'We review the application and approve the trade account.'],
  ['03', 'See your prices', 'Slab prices and MOQs unlock across the catalog.'],
  ['04', 'Order by slab', 'Pick a slab per SKU, fill the order sheet, pay or request a quote.'],
  ['05', 'Track and reorder', 'Invoices, dispatch status and one-click reorders in your account.'],
];
const FAQS = [
  { q: 'What is the minimum order quantity?', a: 'Every SKU has its own MOQ, shown on the product page and in the catalog. [MOQ POLICY]' },
  { q: 'How does slab pricing work?', a: 'Pick a slab such as 101–200 pcs and that slab’s unit price applies to the whole line. Moving to the next slab lowers the unit price.' },
  { q: 'Can I buy on credit?', a: 'Approved accounts can request net-30 terms. [CREDIT POLICY]' },
  { q: 'How is shipping charged?', a: 'Orders above [FREE SHIPPING VALUE] ship free. Below that, shipping is calculated at dispatch.' },
  { q: 'What is your returns policy?', a: '[RETURN POLICY]' },
  { q: 'Do I get a GST invoice?', a: 'Yes. A tax invoice is generated on dispatch and saved to your account.' },
];
const HEIGHTS = [220, 194, 167, 145, 123];

export default function Home() {
  const cols = collections();
  const all = products();
  const latest = all.slice(0, 4);
  const sample = all[0];
  const sslabs = sample ? slabsFor(sample.id) : [];
  const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
  const rng = (s: { min_qty: number; max_qty: number | null }) => (s.max_qty ? `${s.min_qty.toLocaleString('en-IN')}–${s.max_qty.toLocaleString('en-IN')}` : `${s.min_qty.toLocaleString('en-IN')}+`);
  const slabRows = sslabs.map((s) => ({ range: rng(s), price: fmt(s.price) }));
  const groups = cols.filter((c) => c.slug !== 'new-arrivals').slice(0, 3).map((c) => ({ name: c.name, items: productsInCollection(c.id).slice(0, 4) })).filter((g) => g.items.length > 0);
  const bs = brands();
  const faqPage = pageBySlug('faq');

  return (
    <>
      {/* FAQ schema only for answers that are finished (no [PLACEHOLDER] left in them) */}
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.filter((f) => !f.a.includes('[')).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
      <Link href="/trade" className="float-tab">Trade rewards plan</Link>
      <Link href="/quote" className="float-wa" aria-label="Order on WhatsApp"><span className="c"><Ico d={PATHS.wa} size={30} /></span><span className="l">Order on WhatsApp</span></Link>

      <HeroSlider title={sample?.name ?? 'Chew bone, 12 cm'} slabs={slabRows} />

      <section className="sec" style={{ paddingTop: 20, paddingBottom: 12 }}>
        <div className="perks">
          {PERKS.map((p) => (
            <div className="perk" key={p.t}>
              <span className="ic" style={{ background: p.bg }}><Ico d={p.p} size={28} /></span>
              <div><div className="d" style={{ fontSize: 18, letterSpacing: '-0.02em' }}>{p.t}</div><div style={{ fontSize: 14, color: '#4A5470', marginTop: 2, lineHeight: 1.4 }}>{p.d}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 72 }}>
        <div className="h2c"><h2 className="d">New arrivals</h2><div className="bar" /></div>
        <div className="pgrid">{latest.map((p) => <ProductCard key={p.id} p={p} isNew />)}</div>
        <div style={{ textAlign: 'center', marginTop: 28 }}><Link href="/collections/new-arrivals" className="b white hover-lift">View all new arrivals</Link></div>
      </section>

      <section className="sec">
        <div className="rowhead"><h2 className="d">Shop by category</h2><Link href="/collections" className="ulink">View all collections</Link></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {cols.map((c) => <CollectionTile key={c.id} c={c} />)}
        </div>
      </section>

      <section className="dark-sec">
        <div className="in">
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <span className="m" style={{ fontSize: 13, color: '#FFD966' }}>Slab pricing</span>
            <h2 className="d">Stock more, pay less per piece.</h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: '#C9CEDD', margin: '0 0 24px', maxWidth: 480 }}>Each SKU has its own MOQ and its own slabs. Choose a slab on the product page and the order sheet recalculates the unit price, line total, and your saving against the first slab.</p>
            {sample && <Link href={`/products/${sample.slug}`} className="b butter hover-lift">See a product with slabs</Link>}
          </div>
          <div className="slabchart">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 20 }}><span className="d" style={{ fontSize: 20 }}>Unit price by slab</span><span className="m" style={{ fontSize: 12, color: '#4A5470' }}>{sample?.name}</span></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 250 }}>
              {slabRows.map((s, i) => (
                <div key={i} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
                  <span style={{ textAlign: 'center', fontWeight: 600, fontSize: 17 }}>{s.price}</span>
                  <div style={{ height: HEIGHTS[i] ?? 130, background: i === slabRows.length - 1 ? '#FF6A2B' : '#FFD966', border: '1.5px solid #101B33', borderRadius: 10 }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, borderTop: '1.5px solid #101B33', paddingTop: 10 }}>
              {slabRows.map((s, i) => <span key={i} className="m" style={{ flex: '1 1 0', minWidth: 0, textAlign: 'center', fontSize: 12 }}>{s.range}</span>)}
            </div>
          </div>
        </div>
      </section>

      {groups.length > 0 && (
        <section className="sec" style={{ paddingTop: 80 }}>
          <div className="h2c" style={{ marginBottom: 24 }}><h2 className="d">Trade bestsellers</h2><div className="bar" /></div>
          <BestTabs groups={groups} />
        </section>
      )}

      <section className="sec">
        <div className="promos">
          <Link href="/collections/dog-supplies" className="promo-big hover-lift" style={{ background: '#FFD966' }}>
            <span className="m" style={{ fontSize: 13 }}>Dog essentials</span>
            <span><span className="d t">Chews, toys and leashes by the carton</span><span style={{ fontWeight: 600, borderBottom: '2px solid #101B33' }}>Shop dog supplies</span></span>
          </Link>
          <Link href="/collections/cat-supplies" className="promo-big hover-lift" style={{ background: '#D9D4FF' }}>
            <span className="m" style={{ fontSize: 13 }}>Cat range</span>
            <span><span className="d t">Scratchers, treats and play, slab-priced</span><span style={{ fontWeight: 600, borderBottom: '2px solid #101B33' }}>Shop cat supplies</span></span>
          </Link>
        </div>
      </section>

      <section className="sec">
        <div className="rowhead" style={{ marginBottom: 24 }}><h2 className="d">Shop by brands</h2><Link href="/brands" className="ulink">All brands</Link></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14 }}>
          {bs.map((b) => <Link key={b.id} href={`/brands/${b.slug}`} className="brand-chip hover-lift">{b.name}</Link>)}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 64 }}>
        <h2 className="d big" style={{ textAlign: 'center', marginBottom: 28, fontSize: 44 }}>Why retailers buy from Pets Friend</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {WHY.map((w) => <div key={w.t} className="why" style={{ background: w.bg }}><div className="d" style={{ fontSize: 26, lineHeight: 1.05, marginBottom: 12 }}>{w.t}</div><div style={{ fontSize: 15, lineHeight: 1.55 }}>{w.d}</div></div>)}
        </div>
      </section>

      <section id="how" className="sec" style={{ paddingTop: 64 }}>
        <h2 className="d" style={{ fontSize: 44, marginBottom: 12 }}>From application to reorder</h2>
        <p style={{ fontSize: 18, color: '#4A5470', margin: '0 0 32px', maxWidth: 560, lineHeight: 1.55 }}>The whole trade flow lives in one portal, so a new retailer can go from first visit to first invoice without a phone call.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          {STEPS.map(([n, t, d]) => <div className="step" key={n}><div className="d n">{n}</div><div className="d" style={{ fontSize: 22, margin: '16px 0 8px', letterSpacing: '-0.02em' }}>{t}</div><div style={{ fontSize: 15, lineHeight: 1.5, color: '#4A5470' }}>{d}</div></div>)}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 64 }}>
        <div className="band" style={{ background: '#27BFB1' }}>
          <div style={{ flex: '1 1 380px', minWidth: 0 }}>
            <span className="m" style={{ fontSize: 13 }}>Quick order</span>
            <h2 className="d" style={{ fontSize: 46, lineHeight: 1, margin: '12px 0 14px' }}>Know your SKUs? Paste them in.</h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, margin: '0 0 24px', maxWidth: 460 }}>Type SKU codes and quantities and we send back a quote with slab prices applied.</p>
            <Link href="/quote" className="b ink hover-lift">Open quick order</Link>
          </div>
          <div style={{ flex: '1 1 360px', minWidth: 0, background: '#fff', border: '1.5px solid #101B33', borderRadius: 20, padding: 20 }}>
            <div className="m" style={{ display: 'flex', fontSize: 12, color: '#4A5470', padding: '0 4px 8px' }}><span style={{ flex: 2 }}>SKU</span><span style={{ flex: 1 }}>Qty</span><span style={{ flex: 1, textAlign: 'right' }}>Slab price</span></div>
            {all.slice(0, 3).map((p, i) => {
              const s = slabsFor(p.id); const k = Math.min(1 + i, s.length - 1);
              return <div key={p.id} style={{ display: 'flex', padding: '10px 4px', borderTop: '1px solid #D9DCE6', fontSize: 15 }}><span className="m" style={{ flex: 2 }}>{p.sku}</span><span style={{ flex: 1 }}>{s[k]?.min_qty}</span><b style={{ flex: 1, textAlign: 'right' }}>{inr(s[k]?.price ?? p.base_price)}</b></div>;
            })}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 64 }}>
        <h2 className="d" style={{ fontSize: 44, textAlign: 'center', marginBottom: 28 }}>What retailers say</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ background: '#fff', border: '1.5px solid #101B33', borderRadius: 22, padding: 26 }}>
              <div className="d" style={{ fontSize: 54, lineHeight: 0.6, color: '#FF6A2B', height: 28 }}>“</div>
              <p style={{ fontSize: 16, lineHeight: 1.6, margin: '0 0 20px' }}>[RETAILER QUOTE GOES HERE]</p>
              <div style={{ fontWeight: 600 }}>[RETAILER NAME]</div><div style={{ fontSize: 14, color: '#4A5470' }}>[SHOP, CITY]</div>
            </div>
          ))}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 72, maxWidth: 900 }}>
        <h2 className="d" style={{ fontSize: 44, textAlign: 'center', marginBottom: 24 }}>Trade questions</h2>
        <Faq items={FAQS} />
        {faqPage && <p style={{ textAlign: 'center', marginTop: 20 }}><Link href="/faq" className="ulink">More answers on the FAQ page</Link></p>}
      </section>

      <section className="sec" style={{ paddingTop: 64, paddingBottom: 88 }}>
        <div className="band" style={{ background: '#FF6A2B', justifyContent: 'space-between', padding: '56px 48px' }}>
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <h2 className="d" style={{ fontSize: 52, lineHeight: 1, margin: '0 0 14px' }}>Ready to stock Pets Friend?</h2>
            <p style={{ fontSize: 18, lineHeight: 1.5, margin: 0, maxWidth: 520 }}>Apply with your GST number. Approved accounts see wholesale prices and MOQs across the whole catalog.</p>
          </div>
          <Link href="/trade" className="b ink hover-lift" style={{ minHeight: 56, padding: '0 32px', fontSize: 18 }}>Apply for a trade account</Link>
        </div>
      </section>
    </>
  );
}
