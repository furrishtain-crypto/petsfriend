import Link from 'next/link';
import type { Product, Collection } from '@/lib/data';
import { inr } from '@/lib/site';
import { Paw } from './icons';

// Home-page style card: "New" or MOQ chip, sku, name, from price with the slab bars.
export function ProductCard({ p, isNew = false }: { p: Product; isNew?: boolean }) {
  return (
    <Link href={`/products/${p.slug}`} className="pc hover-lift">
      <div className="img" style={{ background: p.tile }}>
        <Paw size={84} />
        <span className="chip m" style={{ left: 12, bottom: 10, fontSize: 11, padding: 0 }}>Product photo</span>
        {isNew && <span className="chip" style={{ left: 12, top: 12, background: '#101B33', color: '#fff' }}>New</span>}
        <span className="chip" style={{ right: 12, top: 12, background: '#fff', border: '1.5px solid #101B33' }}>MOQ {p.moq}</span>
      </div>
      <div className="body">
        <div className="sku">{p.sku || '—'}{p.cat ? ` · ${p.cat}` : ''}</div>
        <div className="nm">{p.name}</div>
        <div className="pr">
          <div><small>From </small><b>{inr(p.low_price ?? p.base_price)}</b><small> / pc</small></div>
          <div className="bars" aria-hidden="true">{[28, 24, 20, 17, 14].map((h, i) => <i key={i} style={{ height: h }} />)}</div>
        </div>
      </div>
    </Link>
  );
}

export function CollectionTile({ c }: { c: Collection }) {
  return (
    <Link href={`/collections/${c.slug}`} className="cat-tile hover-lift" style={{ background: c.tile }}>
      <span className="m" style={{ fontSize: 12 }}>{c.product_count ?? 0} products</span>
      <span className="d n">{c.name}</span>
    </Link>
  );
}
