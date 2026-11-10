// Content layer. Everything the storefront shows comes from /content/*.json at build time.
// Add a collection, product, brand or post there (or, later, from the dashboard) and its URL,
// sitemap entry, llms.txt line and schema are generated automatically on the next build.
import { notFound } from 'next/navigation';
import collectionsJson from '../../content/collections.json';
import brandsJson from '../../content/brands.json';
import productsJson from '../../content/products.json';
import postsJson from '../../content/posts.json';
import pagesJson from '../../content/pages.json';
import redirectsJson from '../../content/redirects.json';
import type { Slab } from './pricing';

export type Collection = {
  id: number; name: string; slug: string; description: string; seo_title: string; seo_description: string;
  tile: string; published: number; sort: number; created_at: string; updated_at: string; product_count?: number;
};
export type Brand = { id: number; name: string; slug: string; description: string; published: number; product_count?: number; min_moq?: number | null };
export type Product = {
  id: number; name: string; slug: string; sku: string; brand_id: number | null; brand_name?: string | null; brand_slug?: string | null;
  description: string; moq: number; base_price: number; gst_rate: number; hsn: string; stock: number; tile: string;
  seo_title: string; seo_description: string; published: number; created_at: string; updated_at: string; low_price?: number; cat?: string | null;
  collections?: number[]; slabs?: Slab[];
};
export type Post = {
  id: number; title: string; slug: string; excerpt: string; body: string; category: string; author: string;
  seo_title: string; seo_description: string; published: number; published_at: string | null; created_at: string; updated_at: string;
};
export type Page = { id: number; title: string; slug: string; body: string; seo_title: string; seo_description: string; published: number; updated_at: string };

const C = collectionsJson as unknown as Collection[];
const B = brandsJson as unknown as Brand[];
const P = productsJson as unknown as Product[];
const POSTS = postsJson as unknown as Post[];
const PAGES = pagesJson as unknown as Page[];
const REDIRECTS = redirectsJson as { from: string; to: string }[];

const liveC = C.filter((c) => c.published).sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));
const brandOf = (id: number | null) => B.find((b) => b.id === id);
const enrich = (p: Product): Product => {
  const b = brandOf(p.brand_id);
  const slabs = p.slabs ?? [];
  const first = liveC.find((c) => p.collections?.includes(c.id));
  return { ...p, brand_name: b?.name ?? null, brand_slug: b?.slug ?? null, low_price: slabs.length ? Math.min(...slabs.map((s) => s.price)) : p.base_price, cat: first?.name ?? null };
};
const liveP = P.filter((p) => p.published).map(enrich).sort((a, b) => b.created_at.localeCompare(a.created_at) || a.name.localeCompare(b.name));
const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

/* Collections */
export const collections = () => liveC.map((c) => ({ ...c, product_count: liveP.filter((p) => p.collections?.includes(c.id)).length }));
export const collectionBySlug = (slug: string) => collections().find((c) => c.slug === slug);
export const productsInCollection = (id: number) => liveP.filter((p) => p.collections?.includes(id)).sort(byName);
export const collectionsForProduct = (productId: number) => {
  const p = P.find((x) => x.id === productId);
  return liveC.filter((c) => p?.collections?.includes(c.id));
};

/* Brands */
export const brands = () =>
  B.filter((b) => b.published).sort(byName).map((b) => {
    const ps = liveP.filter((p) => p.brand_id === b.id);
    return { ...b, product_count: ps.length, min_moq: ps.length ? Math.min(...ps.map((p) => p.moq)) : null };
  });
export const brandBySlug = (slug: string) => brands().find((b) => b.slug === slug);
export const productsByBrand = (id: number) => liveP.filter((p) => p.brand_id === id).sort(byName);

/* Products */
export const products = () => liveP;
export const productBySlug = (slug: string) => liveP.find((p) => p.slug === slug);
export const slabsFor = (productId: number): Slab[] => [...(P.find((p) => p.id === productId)?.slabs ?? [])].sort((a, b) => a.min_qty - b.min_qty);

/** Lean record for client-side search, quick order and catalog filtering. */
export type SearchItem = { id: number; slug: string; name: string; sku: string; brand: string; brandSlug: string; cat: string; moq: number; low: number; base: number; tile: string; gst: number; inStock: boolean; collections: string[]; slabs: Slab[] };
export const searchIndex = (): SearchItem[] =>
  liveP.map((p) => ({
    id: p.id, slug: p.slug, name: p.name, sku: p.sku, brand: p.brand_name ?? '', brandSlug: p.brand_slug ?? '', cat: p.cat ?? '', moq: p.moq,
    low: p.low_price ?? p.base_price, base: p.base_price, tile: p.tile, gst: p.gst_rate, inStock: p.stock > 0,
    collections: liveC.filter((c) => p.collections?.includes(c.id)).map((c) => c.slug),
    slabs: slabsFor(p.id),
  }));

/* Blog */
export const posts = () =>
  POSTS.filter((p) => p.published).sort((a, b) => (b.published_at || b.created_at).localeCompare(a.published_at || a.created_at));
export const postBySlug = (slug: string) => posts().find((p) => p.slug === slug);

/* CMS pages */
export const pages = () => PAGES.filter((p) => p.published).sort((a, b) => a.title.localeCompare(b.title));
export const pageBySlug = (slug: string) => pages().find((p) => p.slug === slug);

/* URLs */
export const urlFor = {
  collection: (slug: string) => `/collections/${slug}`,
  product: (slug: string) => `/products/${slug}`,
  brand: (slug: string) => `/brands/${slug}`,
  post: (slug: string) => `/blog/${slug}`,
  page: (slug: string) => `/${slug}`,
};

/** Old-to-new URL pairs. Written to public/_redirects by scripts/build-redirects.mjs so Netlify serves real 301s. */
export const redirects = () => REDIRECTS;
// Pages that are generated with generateStaticParams never reach here for unknown slugs; keep the helper for safety.
export function redirectOrNotFound(_path: string): never {
  notFound();
}
