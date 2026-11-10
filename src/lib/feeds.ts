import { collections, products, brands, posts, pages, slabsFor } from './data';
import { abs, SITE, inr } from './site';

export type UrlEntry = { path: string; lastmod?: string; priority?: number };

// Every public URL in one list. sitemap.xml, llms.txt and the feed all read from here,
// so a new collection, product, brand or post shows up everywhere at once.
export function allUrls(): UrlEntry[] {
  const out: UrlEntry[] = [{ path: '/', priority: 1 }, { path: '/collections', priority: 0.8 }, { path: '/products', priority: 0.8 }, { path: '/brands', priority: 0.6 }, { path: '/blog', priority: 0.7 }, { path: '/offers', priority: 0.6 }, { path: '/trade', priority: 0.5 }, { path: '/quote', priority: 0.5 }];
  collections().forEach((c) => out.push({ path: `/collections/${c.slug}`, lastmod: c.updated_at, priority: 0.8 }));
  products().forEach((p) => out.push({ path: `/products/${p.slug}`, lastmod: p.updated_at, priority: 0.9 }));
  brands().forEach((b) => out.push({ path: `/brands/${b.slug}`, priority: 0.5 }));
  posts().forEach((b) => out.push({ path: `/blog/${b.slug}`, lastmod: b.updated_at, priority: 0.6 }));
  pages().forEach((p) => out.push({ path: `/${p.slug}`, lastmod: p.updated_at, priority: 0.4 }));
  return out;
}

export function llmsTxt(): string {
  const l: string[] = [];
  l.push(`# ${SITE.name}`, '', `> ${SITE.description}`, '');
  l.push('Pets Friend is a B2B wholesale supplier. Every product has a minimum order quantity (MOQ) and quantity slabs, each with its own price per piece. Prices are in INR and exclude GST.', '');
  l.push('## Collections');
  collections().forEach((c) => l.push(`- [${c.name}](${abs('/collections/' + c.slug)}): ${c.description.slice(0, 140)}`));
  l.push('', '## Products');
  products().forEach((p) => l.push(`- [${p.name}](${abs('/products/' + p.slug)}): MOQ ${p.moq}, from ${inr(p.low_price ?? p.base_price)} per piece`));
  l.push('', '## Brands');
  brands().forEach((b) => l.push(`- [${b.name}](${abs('/brands/' + b.slug)})`));
  l.push('', '## Blog');
  posts().forEach((b) => l.push(`- [${b.title}](${abs('/blog/' + b.slug)}): ${b.excerpt.slice(0, 140)}`));
  l.push('', '## Company and policies');
  pages().forEach((p) => l.push(`- [${p.title}](${abs('/' + p.slug)})`));
  l.push('', '## Optional', `- [Full content for LLMs](${abs('/llms-full.txt')})`, `- [Sitemap](${abs('/sitemap.xml')})`, '');
  return l.join('\n');
}

export function llmsFullTxt(): string {
  const l: string[] = [`# ${SITE.name}`, '', `> ${SITE.description}`, ''];
  products().forEach((p) => {
    l.push(`## ${p.name}`, `URL: ${abs('/products/' + p.slug)}`, `SKU: ${p.sku || 'n/a'}`, `MOQ: ${p.moq}`);
    if (p.brand_name) l.push(`Brand: ${p.brand_name}`);
    l.push(p.description, 'Price slabs (per piece, excluding GST):');
    slabsFor(p.id).forEach((s) => l.push(`- ${s.max_qty ? `${s.min_qty} to ${s.max_qty}` : `${s.min_qty} and above`}: ${inr(s.price)}`));
    l.push('');
  });
  posts().forEach((b) => l.push(`## ${b.title}`, `URL: ${abs('/blog/' + b.slug)}`, '', b.body, ''));
  return l.join('\n');
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function rssFeed(): string {
  const items = posts().map((b) => `<item><title>${esc(b.title)}</title><link>${abs('/blog/' + b.slug)}</link><guid>${abs('/blog/' + b.slug)}</guid><pubDate>${new Date((b.published_at || b.created_at).replace(' ', 'T') + 'Z').toUTCString()}</pubDate><description>${esc(b.excerpt)}</description></item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(SITE.name)} blog</title><link>${abs('/blog')}</link><description>${esc(SITE.description)}</description>${items}</channel></rss>`;
}

