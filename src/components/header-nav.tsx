'use client';
import Link from 'next/link';
import { useState } from 'react';

type L = { name: string; href: string };

export function HeaderNav({ cols, brands }: { cols: L[]; brands: L[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="navbar">
        <div className="wrap">
          <button type="button" className={`navlink ${open ? 'on' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open}>Pet supplies <span aria-hidden="true">▾</span></button>
          <Link className="navlink" href="/brands">Shop by brands</Link>
          <Link className="navlink" href="/collections/new-arrivals">New arrivals</Link>
          <Link className="navlink" href="/products">All products</Link>
          <Link className="navlink" href="/blog">Blog</Link>
          <Link className="navlink" href="/quote">Quick order and quotes</Link>
          <Link className="apply" href="/trade">Apply for trade pricing</Link>
        </div>
      </div>
      {open && (
        <div className="mega">
          <div className="wrap">
            <div className="col">
              <div className="t">Collections</div>
              {cols.map((c) => <Link key={c.href} href={c.href} onClick={() => setOpen(false)}>{c.name}</Link>)}
            </div>
            <div className="col">
              <div className="t">Brands</div>
              {brands.map((c) => <Link key={c.href} href={c.href} onClick={() => setOpen(false)}>{c.name}</Link>)}
              <Link href="/brands" onClick={() => setOpen(false)}>All brands</Link>
            </div>
            <Link href="/collections/new-arrivals" className="promo" onClick={() => setOpen(false)}>
              <span className="m" style={{ fontSize: 12 }}>New this month</span>
              <span className="d" style={{ fontSize: 28, lineHeight: 1.05 }}>Bulk deals on dog and cat ranges</span>
              <span style={{ fontWeight: 600, fontSize: 15, borderBottom: '2px solid #101B33', alignSelf: 'flex-start' }}>See new arrivals</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
