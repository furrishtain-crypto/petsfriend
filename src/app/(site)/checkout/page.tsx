import type { Metadata } from 'next';
import { CheckoutView } from '@/components/checkout-view';
import { demoLines } from '@/lib/demo';

export const metadata: Metadata = { title: 'Secure checkout', robots: { index: false, follow: false }, alternates: { canonical: '/checkout' } };

export default function Checkout() {
  return <CheckoutView demo={demoLines()} />;
}
