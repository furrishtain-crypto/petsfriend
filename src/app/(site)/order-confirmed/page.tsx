import type { Metadata } from 'next';
import { ConfirmedView } from '@/components/confirmed-view';
import { demoLines } from '@/lib/demo';

export const metadata: Metadata = { title: 'Order placed', robots: { index: false, follow: false }, alternates: { canonical: '/order-confirmed' } };

export default function Confirmed() {
  return <ConfirmedView demo={{ id: 'PF-10483', placed: '2026-11-10T00:00:00.000Z', lines: demoLines(), meta: { shop: '[SHOP NAME]', address: '[STREET, CITY, PIN]', pay: 'online' }, ship: 'Standard dispatch', shipCost: 0 }} />;
}
