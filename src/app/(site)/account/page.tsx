import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Your account', robots: { index: false, follow: false }, alternates: { canonical: '/account' } };

const NAV = ['Overview', 'Orders', 'Invoices', 'Price list', 'Saved lists', 'Addresses', 'Team and settings'];
const STATS = [
  { label: 'Open orders', value: '2', note: 'One awaiting dispatch', bg: '#FFFFFF' },
  { label: 'Spend this month', value: '₹86,400', note: 'Excluding GST', bg: '#BFE0FF' },
  { label: 'Credit available', value: '[LIMIT]', note: 'Net 30 terms', bg: '#FFFFFF' },
  { label: 'Invoices due', value: '1', note: 'Due in 12 days', bg: '#FFC9B0' },
];
const ORDERS = [
  { id: 'PF-10482', date: '28 Oct 2026', items: '3 SKUs', total: '₹41,200', status: 'Dispatched', bg: '#BFE0FF' },
  { id: 'PF-10451', date: '19 Oct 2026', items: '5 SKUs', total: '₹58,640', status: 'Delivered', bg: '#BDEBD3' },
  { id: 'PF-10417', date: '07 Oct 2026', items: '2 SKUs', total: '₹19,900', status: 'Delivered', bg: '#BDEBD3' },
  { id: 'PF-10396', date: '30 Sep 2026', items: '4 SKUs', total: '₹33,120', status: 'Packed', bg: '#FFD966' },
  { id: 'PF-10352', date: '21 Sep 2026', items: '6 SKUs', total: '₹72,480', status: 'Delivered', bg: '#BDEBD3' },
];
const LISTS = [{ name: 'Monthly dog essentials', count: '8 SKUs' }, { name: 'Cat range restock', count: '5 SKUs' }, { name: 'Festive gifting', count: '11 SKUs' }];

export default function Account() {
  return (
    <section className="sectionpad" style={{ paddingTop: 40, paddingBottom: 72, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
      <aside className="panel sm" style={{ flex: '0 0 240px', maxWidth: '100%', minWidth: 0, padding: 14 }}>
        {NAV.map((n, i) => <Link key={n} href="/account" style={{ display: 'flex', alignItems: 'center', minHeight: 46, padding: '0 14px', borderRadius: 12, fontSize: 15, fontWeight: 600, background: i === 0 ? '#FFD966' : 'transparent' }}>{n}</Link>)}
      </aside>

      <div style={{ flex: '1 1 640px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <div>
            <div className="m" style={{ fontSize: 13, color: '#4A5470' }}>Trade account · [SHOP NAME]</div>
            <h1 className="d bigh1" style={{ fontSize: 54, lineHeight: 1, margin: '10px 0 0' }}>Your account</h1>
          </div>
          <Link href="/products" className="btn hover-lift" style={{ minHeight: 50, fontSize: 16 }}>Start a new order</Link>
        </div>

        <div style={{ background: '#BDEBD3', border: '1.5px solid #101B33', borderRadius: 20, padding: '18px 22px', display: 'flex', flexWrap: 'wrap', gap: '8px 24px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span className="mchip">Approved</span><span style={{ fontWeight: 600, fontSize: 16 }}>Wholesale prices and MOQs are unlocked on your account.</span></div>
          <span className="m" style={{ fontSize: 13 }}>GSTIN [GSTIN]</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: s.bg, border: '1.5px solid #101B33', borderRadius: 20, padding: 20 }}>
              <div className="m" style={{ fontSize: 12 }}>{s.label}</div>
              <div className="d" style={{ fontSize: 38, marginTop: 10 }}>{s.value}</div>
              <div style={{ fontSize: 14, marginTop: 4, color: '#4A5470' }}>{s.note}</div>
            </div>
          ))}
        </div>

        <div className="panel sm">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
            <h2 className="d" style={{ fontSize: 28, margin: 0 }}>Recent orders</h2>
            <span className="m" style={{ fontSize: 12, color: '#4A5470' }}>Sample data</span>
          </div>
          <div className="twrap">
            <div style={{ minWidth: 640, fontSize: 15 }}>
              <div className="m" style={{ display: 'flex', gap: 12, padding: '10px 12px', fontSize: 12, color: '#4A5470' }}><span style={{ flex: 1.1 }}>Order</span><span style={{ flex: 1 }}>Date</span><span style={{ flex: .8 }}>Items</span><span style={{ flex: 1 }}>Total</span><span style={{ flex: 1.1 }}>Status</span><span style={{ flex: 1.2, textAlign: 'right' }}>Actions</span></div>
              {ORDERS.map((o) => (
                <div key={o.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 12px', borderTop: '1px solid #D9DCE6' }}>
                  <span className="m" style={{ flex: 1.1, fontWeight: 500 }}>{o.id}</span>
                  <span style={{ flex: 1 }}>{o.date}</span>
                  <span style={{ flex: .8 }}>{o.items}</span>
                  <span style={{ flex: 1, fontWeight: 600 }}>{o.total}</span>
                  <span style={{ flex: 1.1 }}><span className="m" style={{ display: 'inline-block', padding: '3px 12px', border: '1.5px solid #101B33', borderRadius: 999, fontSize: 12, background: o.bg }}>{o.status}</span></span>
                  <span style={{ flex: 1.2, display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                    <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 40, padding: '0 14px', border: '1.5px solid #101B33', borderRadius: 999, fontWeight: 600, fontSize: 14, background: '#fff' }}>Reorder</Link>
                    <Link href="/account" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 40, padding: '0 6px', fontWeight: 600, fontSize: 14, borderBottom: '2px solid #FF6A2B' }}>Invoice</Link>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ flex: '1 1 320px', minWidth: 0, background: '#FFD966', border: '1.5px solid #101B33', borderRadius: 22, padding: 24 }}>
            <h3 className="d" style={{ fontSize: 24, margin: '0 0 8px' }}>Your price list</h3>
            <p style={{ fontSize: 15, lineHeight: 1.5, margin: '0 0 18px' }}>Every SKU with MOQ and slab prices, as a file you can share with your buyer.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Link href="/account" className="b ink hover-lift" style={{ minHeight: 46, padding: '0 20px', fontSize: 15 }}>Download PDF</Link>
              <Link href="/account" className="b white hover-lift" style={{ minHeight: 46, padding: '0 20px', fontSize: 15 }}>Download CSV</Link>
            </div>
          </div>
          <div style={{ flex: '1 1 320px', minWidth: 0, background: '#D9D4FF', border: '1.5px solid #101B33', borderRadius: 22, padding: 24 }}>
            <h3 className="d" style={{ fontSize: 24, margin: '0 0 8px' }}>Saved reorder lists</h3>
            <div style={{ fontSize: 15 }}>
              {LISTS.map((l) => <Link key={l.name} href="/cart" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 48, borderTop: '1px solid #101B33', fontWeight: 600 }}><span>{l.name}</span><span className="m" style={{ fontSize: 12, fontWeight: 400 }}>{l.count}</span></Link>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
