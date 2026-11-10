'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormNotice } from './form-notice';
import { type CartSlab, addToCart, fmt, loadCart, nf, slabLabel, tierFor } from '@/lib/cart';

export type QProduct = { slug: string; name: string; sku: string; moq: number; tile: string; gst: number; slabs: CartSlab[] };
type Row = { sku: string; qty: string };
const blank = (n: number): Row[] => Array.from({ length: n }, () => ({ sku: '', qty: '' }));

export function QuoteView({ catalog }: { catalog: QProduct[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<'quick' | 'csv' | 'quote'>('quick');
  const [rows, setRows] = useState<Row[]>(blank(5));
  const [csvMsg, setCsvMsg] = useState('');
  const [details, setDetails] = useState('');
  const bySku = useMemo(() => new Map(catalog.map((p) => [p.sku.toUpperCase(), p])), [catalog]);

  // Read ?tab=, ?product=&qty= and ?from=cart after load (the site is static, so there is no server-side query).
  useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    const t = u.get('tab');
    if (u.has('sent') || u.get('product') || t === 'quote' || u.get('from') === 'cart') setTab('quote');
    else if (t === 'csv' || t === 'quick') setTab(t);
    const p = catalog.find((x) => x.slug === u.get('product'));
    if (p) setDetails(`${p.name} (SKU ${p.sku || '-'}), quantity ${Math.max(1, Number(u.get('qty')) || p.moq)}`);
    else if (u.get('from') === 'cart') setDetails(loadCart().map((l) => `${l.name} (SKU ${l.sku || '-'}), quantity ${l.qty}`).join('\n'));
  }, [catalog]);

  const calc = (r: Row) => {
    const p = bySku.get(r.sku.trim().toUpperCase());
    const q = parseInt(r.qty, 10) || 0;
    if (!p || !q) return { p, q, slab: '—', total: '—', err: r.sku.trim() && !p ? 'SKU not found' : '' };
    const s = p.slabs[tierFor(p.slabs, q)] ?? p.slabs[0];
    return { p, q, slab: `${slabLabel(s)} · ${fmt(s.price)}`, total: fmt(q * s.price), err: q < p.moq ? `MOQ ${nf(p.moq)}` : '' };
  };
  const addRows = (list: { p?: QProduct; q: number }[]) => {
    const ok = list.filter((x) => x.p && x.q >= x.p.moq);
    ok.forEach((x) => { const { slabs, ...rest } = x.p!; addToCart({ ...rest, slabs }, x.q); });
    return ok.length;
  };

  const onCsv = async (f?: File) => {
    if (!f) return;
    const text = await f.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const out: { p?: QProduct; q: number }[] = [];
    let bad = 0;
    lines.forEach((ln, i) => {
      const [sku, qty] = ln.split(',').map((x) => x.trim().replace(/^"|"$/g, ''));
      if (i === 0 && /sku/i.test(sku)) return;
      const p = bySku.get((sku || '').toUpperCase()); const q = parseInt(qty, 10) || 0;
      if (!p || q < p.moq) bad++; else out.push({ p, q });
    });
    const n = addRows(out);
    setCsvMsg(`${n} row${n === 1 ? '' : 's'} added to your order sheet.${bad ? ` ${bad} row${bad === 1 ? '' : 's'} skipped (unknown SKU or below MOQ).` : ''}`);
    if (n) setTimeout(() => router.push('/cart'), 900);
  };
  const template = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['sku,quantity\n' + catalog.slice(0, 3).map((p) => `${p.sku},${p.moq}`).join('\n') + '\n'], { type: 'text/csv' }));
    a.download = 'pets-friend-order-template.csv'; a.click();
  };

  const TABS = [{ id: 'quick', name: 'Quick order' }, { id: 'csv', name: 'Upload CSV' }, { id: 'quote', name: 'Request a quote' }] as const;
  const inp = { height: 48, borderRadius: 10 } as const;

  return (
    <>
      <section className="sectionpad" style={{ paddingTop: 48, paddingBottom: 16 }}>
        <div className="m" style={{ fontSize: 13, color: '#4A5470' }}>Trade tools</div>
        <h1 className="d bigh1" style={{ fontSize: 60, lineHeight: 1, margin: '10px 0 12px' }}>Quick order and quotes</h1>
        <p style={{ fontSize: 18, lineHeight: 1.55, color: '#4A5470', margin: '0 0 28px', maxWidth: 600 }}>Order by SKU, upload a CSV, or ask the trade desk for a quote on large volumes.</p>
        <div className="tabs2" role="tablist">
          {TABS.map((t) => <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>{t.name}</button>)}
        </div>
      </section>

      <section className="sectionpad" style={{ paddingTop: 16, paddingBottom: 80, display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 640px', minWidth: 0 }}>
          <div className="panel" hidden={tab !== 'quick'}>
              <h2 className="d" style={{ fontSize: 28, margin: '0 0 6px' }}>Quick order by SKU</h2>
              <p style={{ fontSize: 15, color: '#4A5470', margin: '0 0 20px' }}>Type a SKU and quantity. The slab and unit price fill in automatically.</p>
              <div className="twrap"><div style={{ minWidth: 520 }}>
                <div className="m" style={{ display: 'flex', gap: 12, fontSize: 12, color: '#4A5470', padding: '0 4px 8px' }}><span style={{ flex: 2 }}>SKU</span><span style={{ flex: 1 }}>Quantity</span><span style={{ flex: 1.2 }}>Slab</span><span style={{ flex: 1, textAlign: 'right' }}>Line total</span></div>
                {rows.map((r, i) => {
                  const c = calc(r);
                  return (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderTop: '1px solid #D9DCE6' }}>
                      <input aria-label="SKU" className="fld mono" style={{ ...inp, flex: 2, minWidth: 0 }} list="skus" value={r.sku} placeholder={catalog[0]?.sku || 'PF-D-014'} onChange={(e) => setRows(rows.map((x, k) => (k === i ? { ...x, sku: e.target.value } : x)))} />
                      <input aria-label="Quantity" className="fld mono" style={{ ...inp, flex: 1, minWidth: 0 }} inputMode="numeric" value={r.qty} placeholder="0" onChange={(e) => setRows(rows.map((x, k) => (k === i ? { ...x, qty: e.target.value.replace(/[^0-9]/g, '') } : x)))} />
                      <span className="m" style={{ flex: 1.2, fontSize: 13, color: c.err ? '#B3401A' : undefined }}>{c.err || c.slab}</span>
                      <b style={{ flex: 1, textAlign: 'right', fontSize: 16 }}>{c.total}</b>
                    </div>
                  );
                })}
              </div></div>
              <datalist id="skus">{catalog.map((p) => <option key={p.slug} value={p.sku}>{p.name}</option>)}</datalist>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 18, borderTop: '1.5px solid #101B33', paddingTop: 18 }}>
                <button type="button" className="ulink" style={{ background: 'none', border: 0, borderBottom: '2px solid #FF6A2B', font: 'inherit', fontWeight: 600, fontSize: 15, cursor: 'pointer', padding: '8px 0' }} onClick={() => setRows([...rows, ...blank(5)])}>Add 5 more rows</button>
                <button type="button" className="btn hover-lift" style={{ minHeight: 52, padding: '0 30px' }} onClick={() => { if (addRows(rows.map(calc))) router.push('/cart'); }}>Add rows to order sheet</button>
              </div>
            </div>

          <div className="panel" hidden={tab !== 'csv'}>
              <h2 className="d" style={{ fontSize: 28, margin: '0 0 6px' }}>Upload a CSV</h2>
              <p style={{ fontSize: 15, color: '#4A5470', margin: '0 0 20px' }}>One row per SKU, with SKU and quantity columns. We check every row against its MOQ before adding it.</p>
              <label htmlFor="csv" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 200, border: '2px dashed #101B33', borderRadius: 20, background: '#F3F4F8', textAlign: 'center', padding: 24 }}>
                <span className="d" style={{ fontSize: 24 }}>Drop your CSV here</span>
                <span style={{ fontSize: 14, color: '#4A5470' }}>or choose a file from your computer</span>
                <input id="csv" type="file" accept=".csv,text/csv" onChange={(e) => onCsv(e.target.files?.[0])} style={{ marginTop: 8, fontSize: 14 }} />
              </label>
              {csvMsg && <div className="notice" style={{ marginTop: 14, marginBottom: 0 }}>{csvMsg}</div>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 18, alignItems: 'center', justifyContent: 'space-between' }}>
                <button type="button" onClick={template} style={{ background: 'none', border: 0, borderBottom: '2px solid #FF6A2B', font: 'inherit', fontWeight: 600, fontSize: 15, cursor: 'pointer', padding: '8px 0' }}>Download CSV template</button>
                <Link href="/cart" className="btn hover-lift" style={{ minHeight: 52, padding: '0 30px' }}>Go to order sheet</Link>
              </div>
              <div style={{ marginTop: 22 }}>
                <div className="m" style={{ fontSize: 12, color: '#4A5470', marginBottom: 8 }}>Example</div>
                <div className="m" style={{ background: '#101B33', color: '#F3F4F8', borderRadius: 14, padding: '16px 18px', fontSize: 14, lineHeight: 1.8 }}>sku,quantity<br />{catalog.slice(0, 3).map((p) => <span key={p.slug}>{p.sku},{p.moq}<br /></span>)}</div>
              </div>
            </div>

          <form name="quote-request" method="POST" action="/quote?sent=1" data-netlify="true" netlify-honeypot="bot-field" className="panel" hidden={tab !== 'quote'}>
              <input type="hidden" name="form-name" value="quote-request" />
              <p hidden><label>Do not fill this in: <input name="bot-field" /></label></p>
              <h2 className="d" style={{ fontSize: 28, margin: '0 0 6px' }}>Request a quote</h2>
              <p style={{ fontSize: 15, color: '#4A5470', margin: '0 0 20px' }}>For volumes above the top slab, mixed cartons or private-label enquiries.</p>
              <div style={{ marginBottom: 16 }}><FormNotice message="Thanks. We have your request and will reply with a quote." /></div>
              <div className="fgrid">
                <div className="full"><label className="lb" htmlFor="items">Products and quantities</label><textarea id="items" name="details" required className="fld" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="SKU or product name, quantity. One per line." /></div>
                <div><label className="lb" htmlFor="tp">Target price (optional)</label><input id="tp" name="target" className="fld mono" placeholder="Target price per pc" /></div>
                <div><label className="lb" htmlFor="dd">Needed by</label><input id="dd" name="needed" className="fld mono" placeholder="Date" /></div>
                <div><label className="lb" htmlFor="ct">Request type</label><select id="ct" name="type" className="fld sel2"><option>Bulk volume quote</option><option>Product sample</option><option>Brand or SKU request</option><option>Private label</option></select></div>
                <div><label className="lb" htmlFor="ph">WhatsApp number</label><input id="ph" name="phone" inputMode="tel" className="fld mono" placeholder="+91 98XXX XXXXX" /></div>
                <div><label className="lb" htmlFor="nm">Your name</label><input id="nm" name="name" className="fld" placeholder="Name" /></div>
                <div><label className="lb" htmlFor="em">Email</label><input id="em" name="email" type="email" className="fld" placeholder="you@yourshop.in" /></div>
                <div className="full"><label className="lb" htmlFor="nt">Notes</label><input id="nt" name="notes" className="fld" placeholder="Packing, delivery window, anything else" /></div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 22 }}>
                <button type="submit" className="btn hover-lift" style={{ minHeight: 54, padding: '0 32px', fontSize: 17 }}>Send quote request</button>
                <span style={{ fontSize: 14, color: '#4A5470' }}>The trade desk replies within [RESPONSE TIME].</span>
              </div>
            </form>
        </div>

        <aside style={{ flex: '1 1 300px', maxWidth: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#27BFB1', border: '1.5px solid #101B33', borderRadius: 26, padding: 26 }}>
            <h3 className="d" style={{ fontSize: 24, margin: '0 0 10px' }}>Prefer WhatsApp?</h3>
            <p style={{ fontSize: 15, lineHeight: 1.55, margin: '0 0 16px' }}>Send your list to the trade desk and we build the order sheet for you.</p>
            <div className="m" style={{ fontSize: 16, background: '#fff', border: '1.5px solid #101B33', borderRadius: 12, padding: '12px 14px' }}>[TRADE PHONE]</div>
          </div>
          <div style={{ background: '#FFD966', border: '1.5px solid #101B33', borderRadius: 26, padding: 26 }}>
            <h3 className="d" style={{ fontSize: 24, margin: '0 0 12px' }}>How slabs apply</h3>
            <div style={{ fontSize: 15, lineHeight: 1.55 }}>Your quantity decides the slab, and that slab’s unit price applies to the whole line. Each SKU has its own MOQ.</div>
          </div>
          <div className="panel" style={{ padding: 26 }}>
            <h3 className="d" style={{ fontSize: 24, margin: '0 0 12px' }}>Recent requests</h3>
            <p style={{ fontSize: 15, color: '#4A5470', margin: '0 0 12px', lineHeight: 1.5 }}>Your quote history shows here once you are logged in.</p>
            <Link href="/login" className="ulink" style={{ fontSize: 15 }}>Log in</Link>
          </div>
        </aside>
      </section>
    </>
  );
}
