'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Paw } from './icons';
import { type CartLine, type OrderMeta, fmt, nf, slabLabel, tierFor, totals, unitFor, useCart, loadMeta, saveMeta } from '@/lib/cart';

const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PAY = [
  { id: 'online', title: 'Pay online with PayU', desc: 'UPI, cards, net banking and wallets through PayU. Dispatch starts once payment clears.' },
  { id: 'quote', title: 'Request a quote', desc: 'Send this sheet to the trade desk for a negotiated price on large volumes.' },
  { id: 'credit', title: 'Credit terms, net 30', desc: 'For approved accounts with an available credit limit of [CREDIT LIMIT].' },
] as const;

export function CartView({ demo = [] }: { demo?: CartLine[] }) {
  const router = useRouter();
  const { lines, ready, set } = useCart(demo);
  const [meta, setMeta] = useState<Partial<OrderMeta>>({ pay: 'online' });
  const [fileName, setFileName] = useState('');
  useEffect(() => { setMeta((m) => ({ pay: 'online', ...m, ...loadMeta() })); }, []);
  const patch = (k: keyof OrderMeta, v: string) => setMeta((m) => ({ ...m, [k]: v }));

  const setQty = (i: number, q: number) => set(lines.map((l, k) => (k === i ? { ...l, qty: Math.max(0, Math.round(q)) } : l)));
  const t = totals(lines);
  const anyErr = lines.some((l) => l.qty < l.moq);
  const g = meta.gstin || '';
  const gOk = GSTIN.test(g);
  const pay = (meta.pay || 'online') as OrderMeta['pay'];
  const cta = { online: `Continue to secure payment · ${fmt(t.total)}`, quote: 'Send quote request', credit: 'Place order on credit' }[pay];

  const go = () => {
    if (anyErr || !lines.length) return;
    saveMeta(meta);
    router.push(pay === 'quote' ? '/quote?tab=quote&from=cart' : `/checkout?pay=${pay}`);
  };

  return (
    <>
      <section className="sectionpad" style={{ paddingTop: 44, paddingBottom: 20 }}>
        <h1 className="d bigh1" style={{ fontSize: 60, lineHeight: 1, margin: '0 0 24px' }}>Order sheet</h1>
        <div className="stepchips">
          <span className="stepchip on"><span className="m">1</span>Items and slabs</span>
          <span className="stepchip"><span className="m">2</span>Delivery and payment</span>
          <span className="stepchip"><span className="m">3</span>Confirm</span>
        </div>
      </section>

      <section className="sectionpad" style={{ paddingTop: 12, paddingBottom: 72, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 640px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {ready && lines.length === 0 && (
            <div className="panel" style={{ textAlign: 'center', padding: 48 }}>
              <Paw size={64} />
              <h2 className="d" style={{ fontSize: 30, margin: '12px 0 8px' }}>Your order sheet is empty</h2>
              <p style={{ color: '#4A5470', margin: '0 0 20px' }}>Pick a slab on any product and add it here. Prices update as the quantity changes.</p>
              <Link href="/products" className="btn hover-lift">Browse products</Link>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {lines.map((l, i) => {
              const tier = tierFor(l.slabs, l.qty);
              const u = unitFor(l);
              const err = l.qty < l.moq;
              const step = Math.max(1, Math.round(l.moq / 5));
              return (
                <div key={l.slug} className="sline">
                  <div style={{ flex: '0 0 96px', height: 96, background: l.tile, border: '1.5px solid #101B33', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Paw size={44} sw={2.4} /></div>
                  <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                    <div className="m" style={{ fontSize: 12, color: '#4A5470' }}>{l.sku || '—'} · MOQ {nf(l.moq)}</div>
                    <Link href={`/products/${l.slug}`} className="d" style={{ display: 'block', fontSize: 24, lineHeight: 1.1, margin: '6px 0 12px', letterSpacing: '-0.02em' }}>{l.name}</Link>
                    <label className="lb" style={{ fontSize: 11 }} htmlFor={`slab${i}`}>Slab</label>
                    <select id={`slab${i}`} value={String(tier)} onChange={(e) => setQty(i, l.slabs[Number(e.target.value)].min_qty)}
                      style={{ width: '100%', maxWidth: 300, minHeight: 46, padding: '0 10px', font: 'inherit', fontSize: 14, fontWeight: 600, color: '#101B33', background: '#F3F4F8', border: '1.5px solid #101B33', borderRadius: 10 }}>
                      {l.slabs.map((s, k) => <option key={k} value={k}>{slabLabel(s)} — {fmt(s.price)} / pc</option>)}
                    </select>
                  </div>
                  <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <div className="qty">
                      <button type="button" aria-label="Decrease quantity" onClick={() => setQty(i, l.qty - step)}>−</button>
                      <input inputMode="numeric" aria-label="Quantity" value={String(l.qty)} onChange={(e) => setQty(i, parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)} />
                      <button type="button" aria-label="Increase quantity" onClick={() => setQty(i, l.qty + step)}>+</button>
                    </div>
                    <div style={{ fontSize: 13, color: '#4A5470' }}>{fmt(u)} / pc</div>
                    <div className="d" style={{ fontSize: 26 }}>{fmt(l.qty * u)}</div>
                    <button type="button" onClick={() => set(lines.filter((_, k) => k !== i))} style={{ background: 'none', border: 0, padding: 0, font: 'inherit', fontSize: 13, color: '#4A5470', textDecoration: 'underline', cursor: 'pointer' }}>Remove</button>
                  </div>
                  {err && <div className="err-note" style={{ flex: '1 1 100%' }}>Minimum order for {l.sku || l.name} is {nf(l.moq)} pcs.</div>}
                </div>
              );
            })}
          </div>

          <Link href="/products" className="b white hover-lift" style={{ alignSelf: 'flex-start', minHeight: 46, padding: '0 20px', fontSize: 15 }}>Add more products</Link>

          <div className="panel sm">
            <h2 className="d" style={{ fontSize: 26, margin: '0 0 18px' }}>Delivery details</h2>
            <div className="fgrid">
              <div><label className="lb" htmlFor="shop">Shop name</label><input id="shop" className="fld" style={{ height: 48 }} value={meta.shop || ''} onChange={(e) => patch('shop', e.target.value)} placeholder="Shop name" /></div>
              <div><label className="lb" htmlFor="wa">WhatsApp number for updates</label><input id="wa" className="fld mono" style={{ height: 48 }} inputMode="tel" value={meta.phone || ''} onChange={(e) => patch('phone', e.target.value)} placeholder="+91 98XXX XXXXX" /></div>
              <div className="full"><label className="lb" htmlFor="addr">Delivery address</label><input id="addr" className="fld" style={{ height: 48 }} value={meta.address || ''} onChange={(e) => patch('address', e.target.value)} placeholder="Street, city, PIN" /></div>
              <div><label className="lb" htmlFor="po">PO number (optional)</label><input id="po" className="fld mono" style={{ height: 48 }} value={meta.po || ''} onChange={(e) => patch('po', e.target.value)} placeholder="PO number" /></div>
              <div><label className="lb" htmlFor="note">Note to Pets Friend</label><input id="note" className="fld" style={{ height: 48 }} value={meta.note || ''} onChange={(e) => patch('note', e.target.value)} placeholder="Delivery window, packing needs" /></div>
            </div>
          </div>

          <div className="panel sm">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 6 }}><h2 className="d" style={{ fontSize: 26, margin: 0 }}>GST details</h2><span className="mchip" style={{ background: '#BDEBD3' }}>Optional</span></div>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: '#4A5470', margin: '0 0 18px' }}>Add your GSTIN for a GST tax invoice you can claim input credit on. You can order without it.</p>
            <div className="fgrid">
              <div style={{ flexBasis: 280 }}>
                <label className="lb" htmlFor="gstin">Type your GSTIN</label>
                <input id="gstin" className="fld mono" style={{ height: 48, background: !g ? '#F3F4F8' : gOk ? '#BDEBD3' : '#FFE3D6' }} value={g} placeholder="15-character GSTIN"
                  onChange={(e) => patch('gstin', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15))} />
                <div style={{ fontSize: 13, lineHeight: 1.45, color: '#4A5470', marginTop: 8 }}>{!g ? 'Optional. Skip it and we issue a normal invoice.' : gOk ? `Format looks right. State code ${g.slice(0, 2)}.` : 'A GSTIN has 15 characters, letters and numbers.'}</div>
              </div>
              <div style={{ flexBasis: 280 }}>
                <div className="lb">Or upload your GST certificate</div>
                <label htmlFor="gstfile" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, minHeight: 74, padding: '10px 14px', border: '1.5px dashed #101B33', borderRadius: 10, background: '#F3F4F8', cursor: 'pointer' }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Choose a photo or PDF</span>
                  <span className="m" style={{ fontSize: 12, color: '#4A5470' }}>{fileName || 'No file chosen'}</span>
                </label>
                <input id="gstfile" type="file" accept="image/*,application/pdf" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} style={{ position: 'absolute', left: -9999 }} />
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 46, marginTop: 12, fontSize: 15 }}><input type="checkbox" defaultChecked style={{ width: 20, height: 20, accentColor: '#FF6A2B' }} />Save these GST details to my account for next time</label>
          </div>

          <div className="panel sm">
            <h2 className="d" style={{ fontSize: 26, margin: '0 0 18px' }}>Payment</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PAY.map((p) => (
                <button key={p.id} type="button" className={`pickcard${pay === p.id ? ' on' : ''}`} onClick={() => setMeta((m) => ({ ...m, pay: p.id }))}>
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
          <h2 className="d" style={{ fontSize: 28, margin: '0 0 20px' }}>Order summary</h2>
          <div style={{ fontSize: 15 }}>
            <div className="r"><span>Items at first-slab price</span><span>{fmt(t.list)}</span></div>
            <div className="r"><span>Slab savings</span><span style={{ background: '#BDEBD3', color: '#101B33', fontWeight: 600, borderRadius: 6, padding: '0 8px' }}>− {fmt(t.saved)}</span></div>
            <div className="r" style={{ borderTop: '1px solid #36425F', marginTop: 6 }}><span>Subtotal</span><span style={{ fontWeight: 600 }}>{fmt(t.sub)}</span></div>
            <div className="r"><span>GST 18%</span><span>{fmt(t.gst)}</span></div>
            <div className="r"><span>Shipping</span><span>Calculated at dispatch</span></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #36425F', marginTop: 10, paddingTop: 18 }}>
            <span className="d" style={{ fontSize: 20 }}>Total</span><span className="d" style={{ fontSize: 40, color: '#FFD966' }}>{fmt(t.total)}</span>
          </div>
          {anyErr && <div className="err-note" style={{ marginTop: 16, color: '#101B33' }}>One or more lines are below MOQ. Fix them to continue.</div>}
          <button type="button" onClick={go} disabled={anyErr || !lines.length} className="btn hover-lift" style={{ width: '100%', minHeight: 56, marginTop: 20, fontSize: 17, opacity: anyErr || !lines.length ? .55 : 1 }}>{cta}</button>
          <div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.5, color: '#C9CEDD' }}>{gOk ? `Your GST tax invoice will carry GSTIN ${g}, so you can claim input credit.` : 'Add a GSTIN above for a tax invoice you can claim input credit on. Optional.'}</div>
        </aside>
      </section>
    </>
  );
}
