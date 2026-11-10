'use client';
import { useEffect, useState } from 'react';
import { loadCart } from '@/lib/cart';

export function CartCount() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const sync = () => setN(loadCart().length);
    sync();
    window.addEventListener('pf-cart', sync); window.addEventListener('storage', sync);
    return () => { window.removeEventListener('pf-cart', sync); window.removeEventListener('storage', sync); };
  }, []);
  return <span className="lbl">{n} {n === 1 ? 'item' : 'items'}</span>;
}
