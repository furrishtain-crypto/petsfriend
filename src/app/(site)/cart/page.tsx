import type { Metadata } from 'next';
import { CartView } from '@/components/cart-view';
import { demoLines } from '@/lib/demo';

export const metadata: Metadata = { title: 'Order sheet', robots: { index: false, follow: false }, alternates: { canonical: '/cart' } };

export default function Cart() {
  return <CartView demo={demoLines()} />;
}
