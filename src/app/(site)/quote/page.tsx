import type { Metadata } from 'next';
import { Crumbs } from '@/components/chrome';
import { QuoteView } from '@/components/quote-view';
import { products, slabsFor } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Quick order and wholesale quotes',
  description: 'Order by SKU, upload a CSV, or request a wholesale quote with GST invoice from Pets Friend.',
  alternates: { canonical: '/quote' },
};

export default function Quote() {
  const catalog = products().filter((x) => x.sku).map((x) => ({
    slug: x.slug, name: x.name, sku: x.sku, moq: x.moq, tile: x.tile, gst: x.gst_rate,
    slabs: slabsFor(x.id).map((s) => ({ min_qty: s.min_qty, max_qty: s.max_qty, price: s.price })),
  }));
  return (
    <>
      <Crumbs visual={false} items={[{ name: 'Quick order and quotes', path: '/quote' }]} />
      <QuoteView catalog={catalog} />
    </>
  );
}
