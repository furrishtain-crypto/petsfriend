import type { Metadata } from 'next';
import Link from 'next/link';
import { products } from '@/lib/data';
import { Crumbs } from '@/components/chrome';
import { Paw } from '@/components/icons';
import { inr } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Trade offers',
  description: 'Extra savings on top of Pets Friend slab pricing for approved trade accounts.',
  alternates: { canonical: '/offers' },
};

const OFFERS = [
  { tag: 'Slab bonus', t: 'Extra [X]% off at 500+ pcs', d: 'Applies on top of the 201–500 and higher slab prices on selected SKUs.', cta: 'See eligible products', href: '/products', bg: '#BDEBD3' },
  { tag: 'Shipping', t: 'Free shipping above [VALUE]', d: 'Ships free across [REGIONS] when your order crosses the threshold.', cta: 'Start an order', href: '/products', bg: '#BFE0FF' },
  { tag: 'First order', t: '[X]% off your first trade order', d: 'For newly approved accounts, on orders above [MINIMUM VALUE].', cta: 'Apply for an account', href: '/trade', bg: '#D9D4FF' },
  { tag: 'Bundle', t: 'Dog starter carton bundle', d: 'A mixed carton of chews, toys and leashes at a bundle price. [BUNDLE DETAILS]', cta: 'View bundle', href: '/products', bg: '#FFC9B0' },
  { tag: 'Rewards', t: 'Earn on every order', d: 'Members of the trade rewards plan earn on each purchase. [PLAN DETAILS]', cta: 'Join the plan', href: '/trade', bg: '#FFD966' },
  { tag: 'Festive', t: 'Festive stock-up pricing', d: 'Limited-time slab prices on gifting ranges. Ends [OFFER END DATE].', cta: 'Shop festive range', href: '/products', bg: '#FFFFFF' },
];

export default function Offers() {
  const deals = products().filter((p) => (p.low_price ?? p.base_price) < p.base_price).slice(0, 4);
  return (
    <>
      <Crumbs visual={false} items={[{ name: 'Offers', path: '/offers' }]} />
      <section className="sectionpad" style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div style={{ background: '#FFD966', border: '1.5px solid #101B33', borderRadius: 34, padding: 56, display: 'flex', flexWrap: 'wrap', gap: '28px 40px', alignItems: 'center', overflow: 'hidden' }}>
          <div style={{ flex: '1 1 440px', minWidth: 0 }}>
            <span className="m" style={{ display: 'inline-block', background: '#fff', border: '1.5px solid #101B33', borderRadius: 999, padding: '5px 14px', fontSize: 13 }}>Ends [OFFER END DATE]</span>
            <h1 className="d hugeh1" style={{ fontSize: 72, lineHeight: .96, margin: '20px 0 16px' }}>Trade offers</h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, margin: '0 0 26px', maxWidth: 480 }}>Extra savings on top of slab pricing, for approved trade accounts.</p>
            <Link href="/products" className="b ink hover-lift" style={{ minHeight: 54, padding: '0 30px', fontSize: 17 }}>Shop offer products</Link>
          </div>
          <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 260, height: 260, borderRadius: '50%', background: '#FF6A2B', border: '1.5px solid #101B33', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-8deg)', textAlign: 'center' }}>
              <span className="m" style={{ fontSize: 13 }}>Up to</span>
              <span className="d" style={{ fontSize: 78, lineHeight: 1 }}>[X]%</span>
              <span className="d" style={{ fontSize: 22 }}>off at 500+ pcs</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sectionpad" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {OFFERS.map((o) => (
            <div key={o.tag} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 28, minHeight: 230, background: o.bg, border: '1.5px solid #101B33', borderRadius: 26, padding: 28 }}>
              <div>
                <span className="m" style={{ fontSize: 12, background: '#fff', border: '1.5px solid #101B33', borderRadius: 999, padding: '3px 12px' }}>{o.tag}</span>
                <h2 className="d" style={{ fontSize: 32, lineHeight: 1.03, margin: '16px 0 8px' }}>{o.t}</h2>
                <div style={{ fontSize: 15, lineHeight: 1.5 }}>{o.d}</div>
              </div>
              <Link href={o.href} style={{ alignSelf: 'flex-start', fontWeight: 600, fontSize: 15, borderBottom: '2px solid #101B33', padding: '6px 0' }}>{o.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="sectionpad" style={{ paddingTop: 40, paddingBottom: 24 }}>
        <form action="/cart" className="panel sm" style={{ borderRadius: 26, padding: '30px 34px', display: 'flex', flexWrap: 'wrap', gap: '20px 32px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 280px' }}><div className="d" style={{ fontSize: 28, marginBottom: 6 }}>Have a coupon code?</div><div style={{ fontSize: 15, color: '#4A5470', lineHeight: 1.5 }}>Apply it on your order sheet. Offers stack with slab pricing unless stated.</div></div>
          <div style={{ flex: '1 1 360px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <label htmlFor="cp" style={{ position: 'absolute', left: -9999 }}>Coupon code</label>
            <input id="cp" name="coupon" className="fld mono" placeholder="Coupon code" style={{ flex: '1 1 200px', height: 54, borderRadius: 999, padding: '0 18px', fontSize: 16 }} />
            <button type="submit" className="btn hover-lift" style={{ minHeight: 54, padding: '0 28px', fontSize: 16 }}>Apply code</button>
          </div>
        </form>
      </section>

      {deals.length > 0 && (
        <section className="sectionpad" style={{ paddingTop: 40, paddingBottom: 24 }}>
          <h2 className="d" style={{ fontSize: 44, margin: '0 0 24px' }}>Products on offer</h2>
          <div className="pgrid2">
            {deals.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="hover-lift" style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1.5px solid #101B33', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 180, background: p.tile, borderBottom: '1.5px solid #101B33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Paw size={76} />
                  <span className="d" style={{ position: 'absolute', left: 12, top: 12, background: '#FF6A2B', border: '1.5px solid #101B33', borderRadius: 12, padding: '4px 12px', fontSize: 16, transform: 'rotate(-4deg)' }}>Deal</span>
                  <span className="m" style={{ position: 'absolute', right: 12, top: 12, fontSize: 12, background: '#fff', border: '1.5px solid #101B33', borderRadius: 999, padding: '2px 10px' }}>MOQ {p.moq}</span>
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <div className="m" style={{ fontSize: 12, color: '#4A5470' }}>{p.sku || '—'}</div>
                  <h3 className="d" style={{ fontSize: 21, lineHeight: 1.1, margin: '8px 0 12px', letterSpacing: '-0.02em' }}>{p.name}</h3>
                  <div style={{ borderTop: '1px solid #D9DCE6', paddingTop: 12, display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <b style={{ fontSize: 21 }}>{inr(p.low_price ?? p.base_price)}</b>
                    <span style={{ fontSize: 14, color: '#4A5470', textDecoration: 'line-through' }}>{inr(p.base_price)}</span>
                    <span style={{ fontSize: 13, color: '#4A5470' }}>/ pc at top slab</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="sectionpad" style={{ paddingTop: 40, paddingBottom: 88 }}>
        <div className="panel sm" style={{ borderRadius: 22, padding: '26px 30px', fontSize: 14, lineHeight: 1.6, color: '#4A5470' }}><b style={{ color: '#101B33' }}>Offer terms.</b> [OFFER TERMS. Validity, eligible SKUs, whether offers combine, and minimum order value.]</div>
      </section>
    </>
  );
}
