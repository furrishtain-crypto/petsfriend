'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/lib/cart';

type S = { min_qty: number; max_qty: number | null; price: number };
const f = (n: number) => n.toLocaleString('en-IN');
const rs = (n: number) => '₹' + f(Math.round(n));
const range = (s: S) => (s.max_qty ? `${f(s.min_qty)}–${f(s.max_qty)}` : `${f(s.min_qty)}+`);

export function ProductBuy({ slabs, moq, slug, gstRate, name, sku, tile }: { slabs: S[]; moq: number; slug: string; gstRate: number; name: string; sku: string; tile: string }) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const step = Math.max(1, Math.round(moq / 5));
  const tierFor = (q: number) => { let t = 0; slabs.forEach((s, i) => { if (q >= s.min_qty) t = i; }); return t; };
  const [qtyText, setQtyText] = useState(String(slabs[Math.min(1, slabs.length - 1)]?.min_qty ?? moq));
  const qty = parseInt(qtyText, 10) || 0;
  const tier = tierFor(qty);
  const t = slabs[tier] ?? slabs[0];
  const base = slabs[0]?.price ?? 0;
  const sub = qty * (t?.price ?? 0), gst = sub * gstRate / 100;
  const next = slabs[tier + 1];
  const moqError = qty < moq;
  const showNudge = !moqError && !!next && next.min_qty - qty <= Math.max(100, moq * 2);
  const setQty = (n: number) => setQtyText(String(Math.max(0, Math.round(n))));

  return (
    <div className="buybox">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span className="d" style={{ fontSize: 22 }}>Trade pricing</span>
        <span className="m" style={{ fontSize: 12, background: '#FFD966', border: '1.5px solid #101B33', borderRadius: 999, padding: '3px 12px' }}>MOQ {f(moq)} pcs</span>
      </div>

      <label htmlFor="slab" className="lab">Quantity slab</label>
      <select id="slab" className="big" value={String(tier)} onChange={(e) => setQty(slabs[Number(e.target.value)].min_qty)}>
        {slabs.map((s, i) => <option key={s.min_qty} value={i}>{range(s)} pcs — {rs(s.price)} / pc</option>)}
      </select>

      <label htmlFor="qty" className="lab" style={{ margin: '20px 0 8px' }}>Quantity (pcs)</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div className="stepper">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty(qty - step)}>−</button>
          <input id="qty" inputMode="numeric" value={qtyText} onChange={(e) => setQtyText(e.target.value.replace(/[^0-9]/g, ''))} />
          <button type="button" aria-label="Increase quantity" onClick={() => setQty(qty + step)}>+</button>
        </div>
        <span style={{ fontSize: 14, color: '#4A5470' }}>Steps of {step} pcs</span>
      </div>
      {moqError && <div style={{ marginTop: 12, padding: '10px 14px', background: '#FFE3D6', border: '1.5px solid #101B33', borderRadius: 10, fontSize: 14, fontWeight: 500 }}>Minimum order for this SKU is {f(moq)} pcs. Add more to continue.</div>}
      {showNudge && <div style={{ marginTop: 12, padding: '10px 14px', background: '#BDEBD3', border: '1.5px solid #101B33', borderRadius: 10, fontSize: 14, fontWeight: 500 }}>Add {f(next.min_qty - qty)} more pcs to reach the {range(next)} slab and pay {rs(next.price)} per pc.</div>}

      <div style={{ marginTop: 24, borderTop: '1.5px solid #101B33', paddingTop: 18, fontSize: 15 }}>
        <div className="sumrow"><span>Unit price</span><span>{rs(t?.price ?? 0)} / pc</span></div>
        <div className="sumrow"><span>Subtotal</span><span>{rs(sub)}</span></div>
        <div className="sumrow"><span>GST {gstRate}%</span><span>{rs(gst)}</span></div>
        <div className="sumrow"><span>Saving vs first slab</span><span style={{ background: '#BDEBD3', borderRadius: 6, padding: '0 8px' }}>{rs(qty * (base - (t?.price ?? 0)))}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0 4px', borderTop: '1px solid #D9DCE6', marginTop: 8 }}>
          <span className="d" style={{ fontSize: 20 }}>Order total</span><span className="d" style={{ fontSize: 34 }}>{rs(sub + gst)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
        <button type="button" disabled={moqError} className="btn hover-lift" style={{ flex: '1 1 100%', minHeight: 56, fontSize: 17, opacity: moqError ? .5 : 1 }}
          onClick={() => { addToCart({ slug, name, sku, moq, tile, gst: gstRate, slabs }, qty); setAdded(true); router.push('/cart'); }}>
          {added ? 'Added. Opening order sheet…' : `Add ${f(qty)} pcs to order sheet`}
        </button>
        <Link href={`/quote?product=${encodeURIComponent(slug)}&qty=${Math.max(qty, moq)}`} className="b white hover-lift" style={{ flex: '1 1 220px', minHeight: 54, fontSize: 16 }}>Request quote for {f(Math.max(qty, moq))} pcs</Link>
        <Link href="/trade" className="b white hover-lift" style={{ flex: '1 1 160px', minHeight: 54, fontSize: 16 }}>Apply for trade pricing</Link>
      </div>
      <p style={{ fontSize: 13, color: '#4A5470', margin: '12px 0 0' }}>Your order sheet is saved in this browser. Online payment is switched on at launch; until then you can send it as a quote request.</p>
    </div>
  );
}
