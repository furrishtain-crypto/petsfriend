'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { type PlacedOrder, fmt, nf, slabLabel, tierFor, totals, unitFor, loadLast } from '@/lib/cart';
import type { CartLine } from '@/lib/cart';
import { Paw } from './icons';

const TL = [
  { n: '1', t: 'Placed', d: 'We have your order and payment.', on: true },
  { n: '2', t: 'Packed', d: 'Cartons packed at the warehouse.' },
  { n: '3', t: 'Dispatched', d: 'Tracking link sent on WhatsApp.' },
  { n: '4', t: 'Delivered', d: 'GST invoice saved to your account.' },
];

export function ConfirmedView({ demo }: { demo?: PlacedOrder }) {
  const [o, setO] = useState<PlacedOrder | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const last = loadLast();
    setO(last ?? (demo && new URLSearchParams(window.location.search).has('demo') ? demo : null));
    setReady(true);
  }, [demo]);

  if (ready && !o) {
    return (
      <section className="sectionpad" style={{ padding: '72px 32px' }}>
        <div className="panel" style={{ textAlign: 'center', padding: 48 }}>
          <h1 className="d" style={{ fontSize: 40, margin: '0 0 8px' }}>No recent order here</h1>
          <p style={{ color: '#4A5470', margin: '0 0 20px' }}>Orders you place from this browser show up on this page.</p>
          <Link href="/products" className="btn hover-lift">Browse products</Link>
        </div>
      </section>
    );
  }
  if (!o) return null;
  const t = totals(o.lines);
  const total = t.total + o.shipCost;
  const m = o.meta;
  return (
    <>
      <section className="sectionpad" style={{ paddingTop: 44, paddingBottom: 20 }}>
        <div className="stepchips" style={{ marginBottom: 28 }}>
          <span className="stepchip done"><span className="m">1</span>Items and slabs</span>
          <span className="stepchip done"><span className="m">2</span>Delivery and payment</span>
          <span className="stepchip on"><span className="m">3</span>Confirmed</span>
        </div>
        <div style={{ background: '#27BFB1', border: '1.5px solid #101B33', borderRadius: 34, padding: 48, display: 'flex', flexWrap: 'wrap', gap: '28px 40px', alignItems: 'center' }}>
          <div style={{ flex: '0 0 120px', height: 120, borderRadius: '50%', background: '#fff', border: '1.5px solid #101B33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#101B33" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </div>
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <span className="m" style={{ fontSize: 13 }}>Order {o.id}</span>
            <h1 className="d hugeh1" style={{ fontSize: 60, lineHeight: 1, margin: '10px 0 12px' }}>Order placed.</h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, margin: 0, maxWidth: 560 }}>Thanks. Updates and the GST invoice are sent to your email and to WhatsApp {m.phone || '[TRADE PHONE]'}. You can follow this order from your account.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: '0 1 240px' }}>
            <Link href="/account" className="b ink hover-lift" style={{ minHeight: 50 }}>Track order</Link>
            <Link href="/order-confirmed" className="b white hover-lift" style={{ minHeight: 50 }}>Download proforma invoice</Link>
          </div>
        </div>
      </section>

      <section className="sectionpad" style={{ paddingTop: 12, paddingBottom: 24 }}>
        <div className="panel" style={{ padding: 30 }}>
          <h2 className="d" style={{ fontSize: 28, margin: '0 0 22px' }}>Order progress</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {TL.map((s) => (
              <div key={s.n}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 34, height: 34, borderRadius: '50%', background: s.on ? '#27BFB1' : '#fff', border: '1.5px solid #101B33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 }}>{s.n}</span>
                  <span style={{ flex: 1, height: 4, borderRadius: 4, background: s.on ? '#27BFB1' : '#D9DCE6' }} />
                </div>
                <div className="d" style={{ fontSize: 20, letterSpacing: '-0.02em' }}>{s.t}</div>
                <div style={{ fontSize: 14, color: '#4A5470', marginTop: 4, lineHeight: 1.45 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionpad" style={{ paddingTop: 12, paddingBottom: 72, display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        <div className="panel" style={{ flex: '1 1 560px', minWidth: 0, padding: 28 }}>
          <h2 className="d" style={{ fontSize: 28, margin: '0 0 16px' }}>Items</h2>
          {o.lines.map((l: CartLine) => (
            <div key={l.slug} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 0', borderTop: '1px solid #D9DCE6' }}>
              <div style={{ flex: '0 0 64px', height: 64, borderRadius: 14, background: l.tile, border: '1.5px solid #101B33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Paw size={30} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="m" style={{ fontSize: 12, color: '#4A5470' }}>{l.sku || '—'}</div>
                <div style={{ fontWeight: 600, fontSize: 17, margin: '3px 0' }}>{l.name}</div>
                <div style={{ fontSize: 14, color: '#4A5470' }}>{slabLabel(l.slabs[tierFor(l.slabs, l.qty)] ?? l.slabs[0])} slab · {nf(l.qty)} pcs · {fmt(unitFor(l))} / pc</div>
              </div>
              <div className="d" style={{ fontSize: 22 }}>{fmt(l.qty * unitFor(l))}</div>
            </div>
          ))}
          <div style={{ borderTop: '1.5px solid #101B33', marginTop: 6, paddingTop: 14, fontSize: 15 }}>
            {[['Subtotal', fmt(t.sub)], ['GST 18%', fmt(t.gst)], ['Shipping', o.shipCost ? fmt(o.shipCost) : 'Free']].map(([a, b]) => <div key={a} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span style={{ color: '#4A5470' }}>{a}</span><span>{b}</span></div>)}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12 }}><span className="d" style={{ fontSize: 20 }}>{m.pay === 'credit' ? 'Total on credit' : 'Total paid'}</span><span className="d" style={{ fontSize: 34 }}>{fmt(total)}</span></div>
          </div>
        </div>
        <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#FFD966', border: '1.5px solid #101B33', borderRadius: 26, padding: 26 }}>
            <h3 className="d" style={{ fontSize: 22, margin: '0 0 12px' }}>Delivering to</h3>
            <div style={{ fontSize: 15, lineHeight: 1.6 }}><b>{m.shop || '[SHOP NAME]'}</b><br />{m.address || '[STREET, CITY, PIN]'}<br />GSTIN {m.gstin || 'not added'}</div>
            <div className="m" style={{ fontSize: 12, marginTop: 14 }}>{o.ship} · [STANDARD DAYS] working days</div>
          </div>
          <div style={{ background: '#D9D4FF', border: '1.5px solid #101B33', borderRadius: 26, padding: 26 }}>
            <h3 className="d" style={{ fontSize: 22, margin: '0 0 12px' }}>Need to change something?</h3>
            <p style={{ fontSize: 15, lineHeight: 1.55, margin: '0 0 16px' }}>Message the trade desk on WhatsApp before dispatch and we will update the order.</p>
            <Link href="/quote?tab=quote" className="b ink hover-lift" style={{ minHeight: 46, padding: '0 22px', fontSize: 15 }}>Message trade desk</Link>
          </div>
          <Link href="/products" className="b white hover-lift" style={{ minHeight: 54 }}>Continue shopping</Link>
        </div>
      </section>
    </>
  );
}
