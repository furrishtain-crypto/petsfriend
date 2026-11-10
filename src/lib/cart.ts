'use client';
// Order sheet stored in the browser until trade accounts and server orders go live.
import { useEffect, useState } from 'react';

export type CartSlab = { min_qty: number; max_qty: number | null; price: number };
export type CartLine = { slug: string; name: string; sku: string; moq: number; tile: string; gst: number; slabs: CartSlab[]; qty: number };
export type OrderMeta = { shop: string; phone: string; address: string; po: string; note: string; gstin: string; pay: 'online' | 'quote' | 'credit' };
export type PlacedOrder = { id: string; placed: string; lines: CartLine[]; meta: Partial<OrderMeta>; ship: string; shipCost: number };

const KEY = 'pf_cart', META = 'pf_meta', LAST = 'pf_last_order', EVT = 'pf-cart';
const read = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); window.dispatchEvent(new Event(EVT)); } catch { /* storage blocked: ignore */ } };

export const loadCart = () => read<CartLine[]>(KEY, []);
export const saveCart = (l: CartLine[]) => write(KEY, l);
export const loadMeta = () => read<Partial<OrderMeta>>(META, {});
export const saveMeta = (m: Partial<OrderMeta>) => write(META, m);
export const loadLast = () => read<PlacedOrder | null>(LAST, null);
export const saveLast = (o: PlacedOrder) => write(LAST, o);

export function addToCart(line: Omit<CartLine, 'qty'>, qty: number) {
  const cart = loadCart();
  const i = cart.findIndex((l) => l.slug === line.slug);
  if (i >= 0) cart[i] = { ...cart[i], ...line, qty: cart[i].qty + qty };
  else cart.push({ ...line, qty });
  saveCart(cart);
}

export const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
export const nf = (n: number) => n.toLocaleString('en-IN');
export const tierFor = (slabs: CartSlab[], q: number) => { let t = 0; slabs.forEach((s, i) => { if (q >= s.min_qty) t = i; }); return t; };
export const unitFor = (l: CartLine) => (l.slabs[tierFor(l.slabs, l.qty)] ?? l.slabs[0])?.price ?? 0;
export const slabLabel = (s: CartSlab) => `${s.max_qty ? `${nf(s.min_qty)}–${nf(s.max_qty)}` : `${nf(s.min_qty)}+`} pcs`;

export function totals(lines: CartLine[]) {
  let list = 0, sub = 0, gst = 0;
  for (const l of lines) {
    const u = unitFor(l);
    list += l.qty * (l.slabs[0]?.price ?? u);
    sub += l.qty * u;
    gst += l.qty * u * (l.gst ?? 18) / 100;
  }
  return { list, sub, saved: list - sub, gst, total: sub + gst };
}

/** Lines and a live subscription to the stored order sheet. With ?demo=1 and an empty sheet, `demo` lines are shown for previewing. */
export function useCart(demo: CartLine[] = []) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const wantsDemo = new URLSearchParams(window.location.search).has('demo');
    const sync = () => { const c = loadCart(); setLines(c.length || !wantsDemo ? c : demo); setReady(true); };
    sync();
    window.addEventListener(EVT, sync); window.addEventListener('storage', sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener('storage', sync); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { lines, ready, set: (l: CartLine[]) => { setLines(l); saveCart(l); } };
}
