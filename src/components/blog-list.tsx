'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Paw } from './icons';
import { setQueryString } from '@/lib/use-query';

export type PostRow = { id: number; slug: string; title: string; excerpt: string; category: string; author: string; date: string };
const TINTS = ['#BDEBD3', '#BFE0FF', '#D9D4FF', '#FFC9B0', '#FFD966', '#FFFFFF'];
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export function BlogList({ all }: { all: PostRow[] }) {
  const [c, setC] = useState('');
  useEffect(() => { setC(new URLSearchParams(window.location.search).get('c') || ''); }, []);
  useEffect(() => { setQueryString({ c }); }, [c]);
  const cats = Array.from(new Set(all.map((p) => p.category).filter(Boolean)));
  const list = c ? all.filter((p) => p.category === c) : all;
  const [lead, ...rest] = list;
  return (
    <>
      {cats.length > 1 && (
        <section className="sectionpad" style={{ paddingTop: 16, paddingBottom: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[{ label: 'All', v: '' }, ...cats.map((x) => ({ label: x, v: x }))].map((x) => (
              <button type="button" key={x.label} onClick={() => setC(x.v)} aria-pressed={c === x.v} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 18px', border: '1.5px solid #101B33', borderRadius: 999, fontWeight: 600, fontSize: 15, background: c === x.v ? '#FFD966' : '#fff', font: 'inherit', cursor: 'pointer' }}>{x.label}</button>
            ))}
          </div>
        </section>
      )}

      <section className="sectionpad" style={{ paddingTop: 24, paddingBottom: 72 }}>
        {lead && (
          <Link href={`/blog/${lead.slug}`} className="hover-lift" style={{ display: 'flex', flexWrap: 'wrap', background: '#fff', border: '1.5px solid #101B33', borderRadius: 28, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ flex: '1 1 340px', minHeight: 280, background: '#BDEBD3', borderRight: '1.5px solid #101B33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Paw size={110} /></div>
            <div style={{ flex: '1 1 440px', minWidth: 0, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
              <span className="chip" style={{ alignSelf: 'flex-start' }}>{lead.category}</span>
              <h2 className="d" style={{ fontSize: 38, lineHeight: 1.05 }}>{lead.title}</h2>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: '#4A5470' }}>{lead.excerpt}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="m" style={{ fontSize: 12, color: '#4A5470' }}>{lead.author} · {fmtDate(lead.date)}</span>
                <span style={{ fontWeight: 600, borderBottom: '2px solid #FF6A2B' }}>Read the guide</span>
              </div>
            </div>
          </Link>
        )}
        {rest.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {rest.map((b, i) => (
              <Link key={b.id} href={`/blog/${b.slug}`} className="hover-lift" style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1.5px solid #101B33', borderRadius: 22, overflow: 'hidden' }}>
                <div style={{ height: 150, background: TINTS[(i + 1) % TINTS.length], borderBottom: '1.5px solid #101B33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Paw size={64} /></div>
                <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <span className="chip" style={{ alignSelf: 'flex-start' }}>{b.category}</span>
                  <h2 className="d" style={{ fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{b.title}</h2>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: '#4A5470' }}>{b.excerpt}</p>
                  <span className="m" style={{ fontSize: 12, color: '#4A5470', marginTop: 'auto' }}>{fmtDate(b.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {list.length === 0 && <div className="panel sm">No posts in that category yet. <button type="button" className="ulink" onClick={() => setC('')} style={{ background: 'none', border: 0, borderBottom: '2px solid #FF6A2B', font: 'inherit', cursor: 'pointer' }}>See all posts</button></div>}
      </section>

    </>
  );
}
