import { products, slabsFor } from './data';
import type { CartLine } from './cart';

// Used only by ?demo=1 so a page can be previewed with lines in it.
export function demoLines(): CartLine[] {
  const qtys = [150, 48, 36];
  return products().slice(0, 3).map((p, i) => {
    const slabs = slabsFor(p.id).map((s) => ({ min_qty: s.min_qty, max_qty: s.max_qty, price: s.price }));
    return { slug: p.slug, name: p.name, sku: p.sku || '', moq: p.moq, tile: p.tile, gst: p.gst_rate, slabs, qty: Math.max(p.moq, qtys[i]) };
  });
}
