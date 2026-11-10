'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/collections', label: 'Shop', icon: '▦' },
  { href: '/brands', label: 'Brands', icon: '★' },
  { href: '/quote', label: 'Quote', icon: '✎' },
  { href: '/login', label: 'Account', icon: '☺' },
];

// Phone-only bottom bar, hidden by CSS above 760px.
export function TabBar() {
  const path = usePathname() || '/';
  const on = (h: string) => (h === '/' ? path === '/' : path === h || path.startsWith(h + '/') || (h === '/collections' && path.startsWith('/products')));
  return (
    <nav className="tabbar" aria-label="App navigation">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={on(t.href) ? 'on' : ''}>
          <b aria-hidden="true">{t.icon}</b>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
