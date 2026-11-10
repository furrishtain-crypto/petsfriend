'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { SearchItem } from '@/lib/data';
import { inr } from '@/lib/site';
import { Paw } from './icons';

export function SearchView({ index }: { index: Omit<SearchItem, 'slabs'>[] }) {
  const [q, setQ] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => { setQ((new URLSearchParams(window.location.search).get('q') || '').trim().slice(0, 80)); setReady(true); }, []);
  const term = q.toLowerCase();
  const hits = term ? index.filter((p) => [p.name, p.sku, p.brand, p.cat].some((x) => x.toLowerCase().includes(term))).slice(0, 60) : [];
  return (
    <section className="sec" style={{ paddingTop: 12 }}>
      <h1>{q ? `Results for “${q}”` : 'Search'}</h1>
      <form action="/search" role="search" style={{ display: 'flex', gap: 10, margin: '16px 0 24px', maxWidth: 560 }}>
        <input name="q" type="search" defaultValue={q} placeholder="Product name, SKU or brand" aria-label="Search products" className="fld lg" />
        <button className="btn" type="submit">Search</button>
      </form>
      {ready && q && hits.length === 0 && <p>No products matched. Try a shorter word or a SKU.</p>}
      <div className="grid-cols">
        {hits.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="pc hover-lift">
            <div className="img" style={{ background: p.tile }}>
              <Paw size={84} />
              <span className="chip" style={{ right: 12, top: 12, background: '#fff', border: '1.5px solid #101B33' }}>MOQ {p.moq}</span>
            </div>
            <div className="body">
              <div className="sku">{p.sku || '—'}{p.cat ? ` · ${p.cat}` : ''}</div>
              <div className="nm">{p.name}</div>
              <div className="pr"><div><small>From </small><b>{inr(p.low)}</b><small> / pc</small></div></div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
