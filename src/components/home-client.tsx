'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Paw } from './icons';
import { ProductCard } from './cards';
import type { Product } from '@/lib/data';

type Slab = { range: string; price: string };

export function HeroSlider({ title, slabs }: { title: string; slabs: Slab[] }) {
  const [i, setI] = useState(0);
  const slides = [
    { tag: 'Slab pricing', title: 'Stock more. Pay less per piece.', sub: 'Every SKU shows its MOQ and slab prices, so you can see your margin before you order.', cta: 'Shop wholesale', href: '/products', bg: '#FFD966' },
    { tag: 'New arrivals', title: 'Fresh dog and cat ranges, just landed.', sub: 'New chews, toys and accessories, ready to order by the carton.', cta: 'See new arrivals', href: '/collections/new-arrivals', bg: '#BDEBD3' },
    { tag: 'Trade rewards', title: 'Earn with every purchase.', sub: 'Join the membership plan and earn on each trade order. [PLAN DETAILS]', cta: 'Join now', href: '/trade', bg: '#BFE0FF' },
  ];
  const s = slides[i], n = slides.length;
  const hl = Math.min(1, slabs.length - 1);
  return (
    <div className="hero-wrap">
      <div className="hero" style={{ background: s.bg }}>
        <button type="button" className="arrow" style={{ left: 20 }} aria-label="Previous slide" onClick={() => setI((i + n - 1) % n)}>‹</button>
        <button type="button" className="arrow" style={{ right: 20 }} aria-label="Next slide" onClick={() => setI((i + 1) % n)}>›</button>
        <div className="copy">
          <span className="m" style={{ display: 'inline-block', background: '#fff', border: '1.5px solid #101B33', borderRadius: 999, padding: '6px 14px', fontSize: 13 }}>{s.tag}</span>
          <h1 className="d">{s.title}</h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, maxWidth: 480, margin: '0 0 28px' }}>{s.sub}</p>
          <Link href={s.href} className="b ink hover-lift" style={{ minHeight: 54, padding: '0 30px', fontSize: 17 }}>{s.cta}</Link>
        </div>
        <div className="art">
          {i === 0 && (
            <>
              <div style={{ position: 'absolute', top: 0, right: 20, width: 280, height: 280, borderRadius: '50%', background: '#FF6A2B', border: '1.5px solid #101B33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Paw size={170} sw={1.8} /></div>
              <div style={{ position: 'absolute', left: 0, bottom: 0, width: 250, background: '#fff', border: '1.5px solid #101B33', borderRadius: 18, padding: '14px 16px', fontSize: 14 }}>
                <div className="d" style={{ fontSize: 17, marginBottom: 8 }}>{title}</div>
                {slabs.slice(0, 3).map((r, k) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: k === hl ? '5px 8px' : '5px 0', margin: k === hl ? '0 -8px' : 0, background: k === hl ? '#FFD966' : 'transparent', borderRadius: k === hl ? 6 : 0, borderTop: k === hl || k === 0 ? 0 : '1px solid #D9DCE6' }}>
                    <span className="m">{r.range}</span><b>{r.price}</b>
                  </div>
                ))}
              </div>
            </>
          )}
          {i === 1 && (
            <>
              <div style={{ position: 'absolute', top: 10, left: 10, width: 170, height: 210, background: '#FFD966', border: '1.5px solid #101B33', borderRadius: 22, transform: 'rotate(-8deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Paw size={70} sw={2.4} /></div>
              <div style={{ position: 'absolute', top: 40, left: 120, width: 170, height: 210, background: '#D9D4FF', border: '1.5px solid #101B33', borderRadius: 22, transform: 'rotate(4deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Paw size={70} sw={2.4} /></div>
              <div style={{ position: 'absolute', top: 70, left: 230, width: 150, height: 190, background: '#BFE0FF', border: '1.5px solid #101B33', borderRadius: 22, transform: 'rotate(12deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Paw size={64} sw={2.4} /></div>
              <span className="d" style={{ position: 'absolute', left: 20, bottom: 10, background: '#101B33', color: '#fff', borderRadius: 12, padding: '8px 16px', fontSize: 18, transform: 'rotate(-3deg)' }}>New</span>
            </>
          )}
          {i === 2 && (
            <>
              <div style={{ position: 'absolute', top: 0, right: 30, width: 290, height: 290, borderRadius: '50%', background: '#101B33', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center' }}>
                <span className="m" style={{ fontSize: 12, color: '#FFD966' }}>Pets Friend</span>
                <span className="d" style={{ fontSize: 44, lineHeight: 1, margin: '8px 0' }}>Trade<br />member</span>
                <span style={{ fontSize: 13, color: '#C9CEDD' }}>Earn on every order</span>
              </div>
              <span className="d" style={{ position: 'absolute', left: 10, top: 40, background: '#FFD966', border: '1.5px solid #101B33', borderRadius: 14, padding: '10px 16px', fontSize: 20, transform: 'rotate(-7deg)' }}>Join free</span>
            </>
          )}
        </div>
        <div className="dots">
          {slides.map((_, k) => <button key={k} type="button" aria-label={`Go to slide ${k + 1}`} onClick={() => setI(k)} style={{ width: k === i ? 34 : 14, background: k === i ? '#101B33' : '#fff' }} />)}
        </div>
      </div>
    </div>
  );
}

export function BestTabs({ groups }: { groups: { name: string; items: Product[] }[] }) {
  const [t, setT] = useState(0);
  const g = groups[t];
  return (
    <>
      <div className="tabs">
        {groups.map((x, k) => <button key={x.name} type="button" onClick={() => setT(k)} style={{ background: k === t ? '#FFD966' : '#fff' }}>{x.name}</button>)}
      </div>
      <div className="pgrid">{g.items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((f, k) => (
        <div className="faq" key={f.q}>
          <button type="button" aria-expanded={open === k} onClick={() => setOpen(open === k ? -1 : k)} style={{ background: open === k ? '#FFD966' : '#fff' }}>
            <span>{f.q}</span><span style={{ fontSize: 24, lineHeight: 1 }}>{open === k ? '−' : '+'}</span>
          </button>
          {open === k && <div style={{ padding: '4px 22px 20px', fontSize: 16, lineHeight: 1.6, color: '#4A5470' }}>{f.a}</div>}
        </div>
      ))}
    </div>
  );
}
