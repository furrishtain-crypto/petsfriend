'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type CartLine, type OrderMeta, fmt, nf, totals, unitFor, useCart, loadMeta, saveCart, saveLast } from '@/lib/cart';

const SHIPS = [
  { id: 'std', t: 'Standard dispatch', d: 'Delivered in [STANDARD DAYS] working days', cost: 0 },
  { id: 'exp', t: 'Express dispatch', d: 'Delivered in [EXPRESS DAYS] working days', cost: 450 },
];
const PAYS = [
  { id: 'online', title: 'PayU', desc: 'UPI, cards, net banking and wallets.' },
  { id: 'credit', title: 'Credit terms, net 30', desc: 'For approved accounts. Pay by bank transfer against the invoice.' },
] as const;

export function CheckoutView({ demo = [] }: { demo?: CartLine[] }) {
  const router = useRouter();
  const { lines, ready } = useCart(demo);
  const [meta, setMeta] = useState<Partial<OrderMeta>>({});
  const [addr, setAddr] = useState(0);
  const [other, setOther] = useState('');
  const [ship, setShip] = useState('std');
  const [pay, setPay] = useState<'online' | 'credit'>('online');
  const [agree, setAgree] = useState(true);
  useEffect(() => { setMeta(loadMeta()); if (new URLSearchParams(window.location.search).get('pay') === 'credit') setPay('credit'); }, []);

  const t = totals(lines);
  const shipCost = SHIPS.find((s) => s.id === ship)!.cost;
  const total = t.total + shipCost;
  const anyErr = lines.some((l) => l.qty < l.moq);

  const place = () => {
    if (!lines.length || anyErr || !agree) return;
    const id = 'PF-' + Date.now().toString().slice(-6);
    const address = addr === 1 && other ? other : meta.address;
    saveLast({ id, placed: new Date().toISOString(), lines, meta: { ...meta, address, pay }, ship: SHIPS.find((s) => s.id === ship)!.t, shipCost });
    saveCart([]);
    router.push('/order-confirmed');
  };

  if (ready && lines.length === 0) {
    return (
      <section className="sectionpad" style={{ padding: '72px 32px' }}>
        <div className="panel" style={{ textAlign: 'center', padding: 48 }}>
          <h1 className="d" style={{ fontSize: 40, margin: '0 0 8px' }}>Nothing to check out yet</h1>
          <p style={{ color: '#4A5470', margin: '0 0 20px' }}>Add products to your order sheet first.</p>
          <Link href="/products" className="btn hover-lift">Browse products</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="sectionpad" style={{ paddingTop: 44, paddingBottom: 20 }}>
        <h1 className="d bigh1" style={{ fontSize: 60, lineHeight: 1, margin: '0 0 12px' }}>Secure checkout</h1>
        <p style={{ fontSize: 16, lineHeight: 1.5, color: '#4A5470', margin: '0 0 24px', maxWidth: 640 }}>Your GSTIN, PO number and notes carry over from the order sheet.</p>
        <div className="stepchips">
          <Link href="/cart" className="stepchip done"><span className="m">1</span>Items and slabs</Link>
          <span className="stepchip on"><span className="m">2</span>Delivery and payment</span>
          <span className="stepchip"><span className="m">3</span>Confirm</span>
        </div>
      </section>

      <section className="sectionpad" style={{ paddingTop: 12, paddingBottom: 80, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 640px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="panel" style={{ borderRadius: 24, padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <h2 className="d" style={{ fontSize: 26, margin: 0 }}>Delivery address</h2>
              <Link href="/cart" className="ulink" style={{ fontSize: 15, padding: '8px 0' }}>Edit</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {[{ tag: 'Shop', name: meta.shop || 'Shop name', lines: meta.address || 'Street, city, PIN' }, { tag: 'Other address', name: 'Deliver somewhere else', lines: other || 'Warehouse or second store' }].map((a, i) => (
                <button key={a.tag} type="button" onClick={() => setAddr(i)} style={{ textAlign: 'left', padding: 18, border: '1.5px solid #101B33', borderRadius: 16, cursor: 'pointer', font: 'inherit', color: '#101B33', background: addr === i ? '#BDEBD3' : '#fff' }}>
                  <span className="m" style={{ fontSize: 12 }}>{a.tag}</span>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: 17, margin: '6px 0 4px' }}>{a.name}</span>
                  <span style={{ display: 'block', fontSize: 14, lineHeight: 1.5, color: '#4A5470' }}>{a.lines}</span>
                </button>
              ))}
            </div>
            {addr === 1 && <div style={{ marginTop: 14 }}><label className="lb" htmlFor="oa">Address</label><input id="oa" className="fld" value={other} onChange={(e) => setOther(e.target.value)} placeholder="Name, street, city, PIN" /></div>}
          </div>

          <div className="panel" style={{ borderRadius: 24, padding: 26 }}>
            <h2 className="d" style={{ fontSize: 26, margin: '0 0 18px' }}>Shipping method</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SHIPS.map((s) => (
                <button key={s.id} type="button" className={`pickcard${ship === s.id ? ' on' : ''}`} onClick={() => setShip(s.id)}>
                  <span className="dot" /><span style={{ flex: 1, minWidth: 0 }}><span className="t">{s.t}</span><span className="s">{s.d}</span></span>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>{s.cost ? fmt(s.cost) : 'Free'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel" style={{ borderRadius: 24, padding: 26 }}>
            <h2 className="d" style={{ fontSize: 26, margin: '0 0 18px' }}>From your order sheet</h2>
            <div className="fgrid">
              <div><div className="lb">GSTIN (optional)</div><div className="m" style={{ minHeight: 50, display: 'flex', alignItems: 'center', padding: '0 14px', border: '1.5px dashed #101B33', borderRadius: 10, fontSize: 15, background: '#F3F4F8' }}>{meta.gstin || 'Not added'}</div></div>
              <div><div className="lb">PO number (optional)</div><div className="m" style={{ minHeight: 50, display: 'flex', alignItems: 'center', padding: '0 14px', border: '1.5px dashed #101B33', borderRadius: 10, fontSize: 15, background: '#F3F4F8' }}>{meta.po || 'Not added'}</div></div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 46, marginTop: 10, fontSize: 15 }}><input type="checkbox" defaultChecked style={{ width: 20, height: 20, accentColor: '#FF6A2B' }} />Billing address is the same as delivery</label>
          </div>

          <div className="panel" style={{ borderRadius: 24, padding: 26 }}>
            <h2 className="d" style={{ fontSize: 26, margin: '0 0 18px' }}>Payment</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PAYS.map((p) => (
                <button key={p.id} type="button" className={`pickcard${pay === p.id ? ' on' : ''}`} onClick={() => setPay(p.id)}>
                  <span className="dot" /><span style={{ flex: 1, minWidth: 0 }}><span className="t">{p.title}</span><span className="s">{p.desc}</span></span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 16 }}>
              <span className="m" style={{ fontSize: 12, color: '#4A5470' }}>Secured by PayU</span>
              {['UPI', 'Cards', 'Net banking', 'Wallets'].map((x) => <span key={x} className="mchip" style={{ background: 'transparent' }}>{x}</span>)}
            </div>
          </div>
        </div>

        <aside className="summary">
          <h2 className="d" style={{ fontSize: 28, margin: '0 0 18px' }}>Your order</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
            {lines.map((l) => (
              <div key={l.slug} style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#1B2A4A', borderRadius: 14, padding: 10 }}>
                <div style={{ flex: '0 0 52px', height: 52, borderRadius: 10, background: l.tile }} />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.2 }}>{l.name}</div><div className="m" style={{ fontSize: 12, color: '#C9CEDD', marginTop: 3 }}>{nf(l.qty)} pcs · {fmt(unitFor(l))} / pc</div></div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{fmt(l.qty * unitFor(l))}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 15, borderTop: '1px solid #36425F', paddingTop: 12 }}>
            <div className="r" style={{ padding: '7px 0' }}><span>Subtotal</span><span>{fmt(t.sub)}</span></div>
            <div className="r" style={{ padding: '7px 0' }}><span>Slab savings included</span><span style={{ background: '#BDEBD3', color: '#101B33', fontWeight: 600, borderRadius: 6, padding: '0 8px' }}>{fmt(t.saved)}</span></div>
            <div className="r" style={{ padding: '7px 0' }}><span>GST 18%</span><span>{fmt(t.gst)}</span></div>
            <div className="r" style={{ padding: '7px 0' }}><span>Shipping</span><span>{shipCost ? fmt(shipCost) : 'Free'}</span></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #36425F', marginTop: 10, paddingTop: 16 }}>
            <span className="d" style={{ fontSize: 20 }}>Total</span><span className="d" style={{ fontSize: 40, color: '#FFD966' }}>{fmt(total)}</span>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 18, fontSize: 13, lineHeight: 1.5, color: '#C9CEDD' }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 20, height: 20, accentColor: '#FF6A2B', flex: '0 0 auto', marginTop: 1 }} />I agree to the trade terms and the returns policy.
          </label>
          <button type="button" onClick={place} disabled={!agree || anyErr} className="btn hover-lift" style={{ width: '100%', minHeight: 58, marginTop: 18, fontSize: 17, opacity: !agree || anyErr ? .55 : 1 }}>{pay === 'online' ? `Pay ${fmt(total)} with PayU` : 'Place order on credit'}</button>
          <div style={{ marginTop: 10, fontSize: 12, color: '#C9CEDD', textAlign: 'center' }}>Test mode: no payment is taken until PayU is switched on.</div>
          <Link href="/cart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 46, marginTop: 8, fontSize: 15, fontWeight: 600, color: '#FFD966' }}>Back to order sheet</Link>
        </aside>
      </section>
    </>
  );
}
