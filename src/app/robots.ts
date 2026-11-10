import type { MetadataRoute } from 'next';
import { abs } from '@/lib/site';

export const dynamic = 'force-static';

// Everything public is crawlable. Private or thin pages (cart, checkout, account, login, internal search) are kept out.
const PRIVATE = ['/cart', '/checkout', '/account', '/login', '/order-confirmed', '/search'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      // AI search and answer engines are welcome on the public catalog.
      { userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'], allow: '/', disallow: PRIVATE },
    ],
    sitemap: abs('/sitemap.xml'),
  };
}
