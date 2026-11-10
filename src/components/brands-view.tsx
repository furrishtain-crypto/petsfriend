'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Ico, PATHS } from './icons';
import { setQueryString } from '@/lib/use-query';

export type BrandRow = { id: number; name: string; slug: string; product_count?: number; min_moq?: number | null };
const TINTS = ['#FFD966', '#BDEBD3', '#BFE0FF', '#D9D4FF', '#FFC9B0', '#FFFFFF'];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function BrandsView({ all }: { all: BrandRow[] }) {
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState('');
  const [l, setL] = useState('');
  useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    setQ(u.get('q') || ''); setDraft(u.get('q') || ''); setL((u.get('l') || '').toUpperCase().slice(0, 1));
  }, []);
  useEffect(() => { setQueryString({ q, l }); }, [q, l]);
  const term = q.trim().toLowerCase();
  const list = all.filter((b) => (!l || b.name.toUpperCase().startsWith(l)) && (!term || b.name.toLowerCase().includes(term)));
  const have = new Set(all.map((b) => b.name[0]?.toUpperCase()));
  return (
    <>
      <section className="sectionpad" style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div style={{ background: '#D9D4FF', border: '1.5px solid #101B33', borderRadius: 32, padding: 48, display: 'flex', flexWrap: 'wrap', gap: '24px 40px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <div className="m" style={{ fontSize: 13 }}>Catalog / Brands</div>
            <h1 className="d bigh1" style={{ fontSize: 64, lineHeight: 1, margin: '12px 0 14px' }}>Shop by brands</h1>
            <p style={{ fontSize: 18, lineHeight: 1.55, margin: 0, maxWidth: 500 }}>Every brand we supply, with its own MOQs and slab prices. Open a brand to see its full range.</p>
          </div>
          <form role="search" onSubmit={(e) => { e.preventDefault(); setQ(draft); setL(''); }} style={{ flex: '1 1 300px', maxWidth: 380, display: 'flex', alignItems: 'center', height: 56, background: '#fff', border: '1.5px solid #101B33', borderRadius: 999, overflow: 'hidden' }}>
            <input type="search" name="q" value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Search brands" placeholder="Search brands" style={{ flex: 1, minWidth: 0, border: 0, padding: '0 20px', font: 'inherit', fontSize: 16, color: '#101B33', background: '#fff' }} />
            <button type="submit" aria-label="Search" style={{ flex: '0 0 64px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#27BFB1', border: 0, borderLeft: '1.5px solid #101B33', cursor: 'pointer' }}><Ico d={PATHS.search} size={22} sw={2.4} /></button>
          </form>
        </div>
      </section>

      <section className="sectionpad" style={{ paddingTop: 16, paddingBottom: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['All', ...LETTERS].map((t) => {
            const on = t === 'All' ? !l : l === t;
            const dim = t !== 'All' && !have.has(t);
            return (
              <button type="button" key={t} onClick={() => { setL(t === 'All' ? '' : t); setQ(''); setDraft(''); }} aria-pressed={on}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 44, minHeight: 44, padding: '0 8px', border: '1.5px solid #101B33', borderRadius: 12, fontWeight: 600, fontSize: 15, background: on ? '#FFD966' : '#fff', opacity: dim ? .45 : 1, font: 'inherit', cursor: 'pointer' }}>{t}</button>
            );
          })}
        </div>
      </section>

      <section className="sectionpad" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {list.length === 0 ? (
          <div className="panel sm" style={{ textAlign: 'center' }}>No brands match that search. <button type="button" className="ulink" onClick={() => { setQ(''); setDraft(''); setL(''); }} style={{ background: 'none', border: 0, borderBottom: '2px solid #FF6A2B', font: 'inherit', cursor: 'pointer' }}>Show all brands</button></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {list.map((b, i) => (
              <Link key={b.id} href={`/brands/${b.slug}`} className="hover-lift" style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1.5px solid #101B33', borderRadius: 22, overflow: 'hidden' }}>
                <div style={{ height: 140, background: TINTS[i % TINTS.length], borderBottom: '1.5px solid #101B33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="m" style={{ fontSize: 12, background: '#fff', border: '1.5px solid #101B33', borderRadius: 999, padding: '4px 12px' }}>Brand logo</span>
                </div>
                <div style={{ padding: '18px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
                  <div>
                    <h2 className="d" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>{b.name}</h2>
                    <div style={{ fontSize: 14, color: '#4A5470', marginTop: 4 }}>{b.product_count ?? 0} products{b.min_moq ? ` · MOQ from ${b.min_moq}` : ''}</div>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14, borderBottom: '2px solid #FF6A2B' }}>Shop</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="sectionpad" style={{ paddingTop: 16, paddingBottom: 88 }}>
        <div className="band" style={{ background: '#101B33', color: '#F3F4F8', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <span className="m" style={{ fontSize: 13, color: '#FFD966' }}>Don’t see your brand?</span>
            <h2 className="d" style={{ fontSize: 44, lineHeight: 1, margin: '12px 0' }}>Tell the trade desk what you need.</h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: '#C9CEDD', margin: 0, maxWidth: 480 }}>We can source brands on request for approved accounts. Send the brand and the volume.</p>
          </div>
          <Link href="/quote?tab=quote" className="b butter hover-lift" style={{ minHeight: 54, padding: '0 30px', fontSize: 17 }}>Request a brand</Link>
        </div>
      </section>
    </>
  );
}
