'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { SearchItem } from '@/lib/data';
import { inr } from '@/lib/site';
import { setQueryString } from '@/lib/use-query';
import { Paw } from './icons';

const MOQ_BANDS: Record<string, [number, number, string]> = {
  a: [0, 24, 'Up to 24'], b: [25, 50, '25–50'], c: [51, 100, '51–100'], d: [101, 1e9, '100+'],
};
const f = (n: number) => n.toLocaleString('en-IN');

export function CatalogView({ title, crumbs, items, collections, brands, activeSlug, intro }: {
  title: string; crumbs: string; items: SearchItem[];
  collections: { id: number; name: string; slug: string }[]; brands: { id: number; name: string; slug: string }[];
  activeSlug?: string; intro?: string;
}) {
  const [sort, setSort] = useState('');
  const [sel, setSel] = useState<string[]>([]);
  const [moq, setMoq] = useState('');
  const [stock, setStock] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setSort(q.get('sort') || ''); setSel(q.getAll('brand')); setMoq(q.get('moq') || ''); setStock(!!q.get('stock'));
  }, []);
  useEffect(() => { setQueryString({ sort, brand: sel, moq, stock: stock ? '1' : '' }); }, [sort, sel, moq, stock]);

  const out = useMemo(() => {
    let r = items.filter((p) => (sel.length ? sel.includes(p.brandSlug) : true));
    if (moq && MOQ_BANDS[moq]) { const [lo, hi] = MOQ_BANDS[moq]; r = r.filter((p) => p.moq >= lo && p.moq <= hi); }
    if (stock) r = r.filter((p) => p.inStock);
    if (sort === 'moq') r = [...r].sort((a, b) => a.moq - b.moq);
    else if (sort === 'price') r = [...r].sort((a, b) => a.low - b.low);
    else if (sort === 'new') r = [...r].sort((a, b) => b.id - a.id);
    else r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [items, sel, moq, stock, sort]);

  const clear = () => { setSort(''); setSel([]); setMoq(''); setStock(false); };

  return (
    <>
      <section className="wrap pagehead">
        <div>
          <div className="crumbs">{crumbs}</div>
          <h1 className="d">{title}</h1>
          {intro && <p style={{ fontSize: 17, color: '#4A5470', maxWidth: 680, margin: '14px 0 0', lineHeight: 1.55 }}>{intro}</p>}
        </div>
        <span style={{ fontSize: 15, color: '#4A5470' }} aria-live="polite">{out.length}{out.length !== items.length ? ` of ${items.length}` : ''} products</span>
      </section>

      <section className="wrap cat-layout" style={{ paddingTop: 8 }}>
        <form className="filters" onSubmit={(e) => e.preventDefault()}>
          <div className="d" style={{ fontSize: 22, marginBottom: 12 }}>Filters</div>
          <label className="m" htmlFor="sort" style={{ fontSize: 12 }}>Sort</label>
          <select id="sort" className="sel" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: '100%', marginTop: 6 }}>
            <option value="">Name</option><option value="moq">Lowest MOQ</option><option value="price">Lowest unit price</option><option value="new">Newest</option>
          </select>

          <div className="lab">Collection</div>
          <div className="cats">
            <Link href="/products" className={!activeSlug ? 'on' : ''}>All products</Link>
            {collections.map((c) => <Link key={c.id} href={`/collections/${c.slug}`} className={activeSlug === c.slug ? 'on' : ''}>{c.name}</Link>)}
          </div>

          {brands.length > 0 && <div className="lab">Brand</div>}
          {brands.map((b) => (
            <label key={b.id} className="ck"><input type="checkbox" checked={sel.includes(b.slug)} onChange={(e) => setSel(e.target.checked ? [...sel, b.slug] : sel.filter((x) => x !== b.slug))} />{b.name}</label>
          ))}

          <div className="lab">Minimum order</div>
          <label className="ck"><input type="radio" name="moq" checked={!moq} onChange={() => setMoq('')} />Any</label>
          {Object.entries(MOQ_BANDS).map(([k, v]) => <label key={k} className="ck"><input type="radio" name="moq" checked={moq === k} onChange={() => setMoq(k)} />{v[2]}</label>)}

          <label className="ck" style={{ marginTop: 14 }}><input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)} />In stock only</label>
          <div style={{ marginTop: 10 }}>
            <button type="button" onClick={clear} style={{ background: 'none', border: 0, font: 'inherit', fontWeight: 600, fontSize: 15, borderBottom: '2px solid #FF6A2B', padding: '10px 0', cursor: 'pointer' }}>Clear all</button>
          </div>
        </form>

        <div style={{ flex: '1 1 640px', minWidth: 0 }}>
          {out.length === 0 ? <p style={{ fontSize: 17 }}>No products match these filters.</p> : (
            <div className="cgrid" style={{ flex: 'none' }}>
              {out.map((p) => (
                <div className="cc" key={p.id}>
                  <Link href={`/products/${p.slug}`} className="img" style={{ background: p.tile }}>
                    <Paw size={70} />
                    <span className="m" style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 11 }}>Product photo</span>
                    <span className="m" style={{ position: 'absolute', right: 12, top: 12, fontSize: 12, background: '#fff', border: '1.5px solid #101B33', borderRadius: 999, padding: '2px 10px' }}>MOQ {p.moq}</span>
                  </Link>
                  <div className="body">
                    <div className="m" style={{ fontSize: 12, color: '#4A5470' }}>{p.sku || '—'}{p.cat ? ` · ${p.cat}` : ''}</div>
                    <Link href={`/products/${p.slug}`} className="d" style={{ fontSize: 21, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{p.name}</Link>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}><span style={{ fontWeight: 600, fontSize: 20 }}>{inr(p.low)}</span><span style={{ fontSize: 13, color: '#4A5470' }}>/ pc at top slab</span></div>
                    <label className="m" style={{ fontSize: 11 }} htmlFor={`s${p.id}`}>Slab</label>
                    <select id={`s${p.id}`} aria-label={`Slab prices for ${p.name}`}>
                      {p.slabs.map((s) => <option key={s.min_qty}>{s.max_qty ? `${f(s.min_qty)}–${f(s.max_qty)}` : `${f(s.min_qty)}+`} pcs — {inr(s.price)} / pc</option>)}
                    </select>
                    <Link href={`/products/${p.slug}`} className="btn hover-lift" style={{ marginTop: 4, minHeight: 46, fontSize: 15 }}>Choose slab and order</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
