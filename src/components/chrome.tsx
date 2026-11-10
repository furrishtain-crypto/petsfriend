import Link from 'next/link';
import React from 'react';
import { collections, brands, pages } from '@/lib/data';
import { SITE } from '@/lib/site';
import { JsonLd, breadcrumbLd } from '@/lib/jsonld';
import { TabBar } from './tabbar';
import { HeaderNav } from './header-nav';
import { Paw, Ico, PATHS } from './icons';
import { CartCount } from './cart-count';

export function Header() {
  const cols = collections().map((c) => ({ name: c.name, href: `/collections/${c.slug}` }));
  const bs = brands().slice(0, 6).map((b) => ({ name: b.name, href: `/brands/${b.slug}` }));
  return (
    <header>
      <div className="topbar">
        <div className="wrap">
          <span>Trade accounts only. Wholesale prices unlock after GST verification.</span>
          <span><Link href="/quote">Quick order</Link><Link href="/account">Track order</Link><span>WhatsApp {SITE.phone}</span></span>
        </div>
      </div>
      <div className="header">
        <div className="wrap">
          <Link href="/" className="logo">
            <span className="ico"><Paw size={28} sw={4} /></span>
            <span className="name">{SITE.name}</span>
            <span className="tag">Trade</span>
          </Link>
          <form className="hsearch" action="/search" role="search">
            <select aria-label="Search category" name="c" defaultValue="">
              <option value="">All categories</option>
              {cols.map((c) => <option key={c.href} value={c.name}>{c.name}</option>)}
            </select>
            <input type="search" name="q" aria-label="Search products" placeholder="What are you looking for?" />
            <button type="submit" aria-label="Search"><Ico d={PATHS.search} sw={2.4} /></button>
          </form>
          <div className="hbtns">
            <Link href="/login" className="hbtn"><Ico d={PATHS.user} size={22} /><span className="lbl">Log in / Register</span></Link>
            <Link href="/cart" className="hbtn dark" aria-label="Order sheet"><Ico d={PATHS.bag} size={22} color="#fff" /><CartCount /></Link>
          </div>
        </div>
      </div>
      <HeaderNav cols={cols} brands={bs} />
    </header>
  );
}

export function Footer() {
  const cms = pages().filter((p) => ['shipping-policy', 'returns-policy', 'privacy-policy', 'terms-of-trade'].includes(p.slug));
  return (
    <>
      <footer className="footer">
        <div className="in">
          <div style={{ flex: '2 1 300px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ width: 44, height: 44, borderRadius: 13, background: '#FF6A2B', border: '1.5px solid #F3F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Paw size={26} sw={4} /></span>
              <span className="d" style={{ fontSize: 30 }}>{SITE.name}</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#C9CEDD', margin: '0 0 20px', maxWidth: 340 }}>Dog and cat essentials and accessories, supplied to pet retailers, clinics and distributors across India.</p>
            <div className="h">We accept</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['UPI', 'Cards', 'Net banking', 'Credit terms'].map((x) => <span key={x} style={{ border: '1.5px solid #5A6684', borderRadius: 8, padding: '6px 12px', fontSize: 13 }}>{x}</span>)}
            </div>
          </div>
          <div style={{ flex: '1 1 150px', minWidth: 0, fontSize: 15 }}>
            <div className="h">Shop</div>
            <Link href="/collections">Pet supplies</Link>
            <Link href="/brands">Shop by brands</Link>
            <Link href="/collections/new-arrivals">New arrivals</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div style={{ flex: '1 1 150px', minWidth: 0, fontSize: 15 }}>
            <div className="h">Trade</div>
            <Link href="/trade">Apply for pricing</Link>
            <Link href="/quote">Quick order</Link>
            <Link href="/quote">Request a quote</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div style={{ flex: '1 1 200px', minWidth: 0, fontSize: 15, lineHeight: 1.9 }}>
            <div className="h">Trade desk</div>
            <div>{SITE.email}</div>
            <div>WhatsApp {SITE.phone}</div>
            <div>[HOURS]</div>
            <div style={{ color: '#C9CEDD' }}>[OFFICE ADDRESS]</div>
          </div>
        </div>
        <div className="legal">
          <div className="in2">
            <span>© {new Date().getFullYear()} {SITE.name}. Prices exclude GST.</span>
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 22px' }}>
              {cms.map((p) => <Link key={p.id} href={`/${p.slug}`}>{p.title}</Link>)}
              <a href="/llms.txt">llms.txt</a>
            </span>
          </div>
        </div>
      </footer>
      <TabBar />
    </>
  );
}

export function Crumbs({ items, visual = true }: { items: { name: string; path: string }[]; visual?: boolean }) {
  const all = [{ name: 'Home', path: '/' }, ...items];
  if (!visual) return <JsonLd data={breadcrumbLd(all)} />;
  return (
    <>
      <JsonLd data={breadcrumbLd(all)} />
      <nav className="crumbs wrap" aria-label="Breadcrumb" style={{ paddingTop: 24 }}>
        {all.map((it, i) => (
          <React.Fragment key={it.path}>
            {i > 0 && <span className="sep">/</span>}
            {i < all.length - 1 ? <Link href={it.path}>{it.name}</Link> : <span aria-current="page" style={{ color: '#101B33' }}>{it.name}</span>}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
}
