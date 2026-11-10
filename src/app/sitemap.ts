import type { MetadataRoute } from 'next';
import { allUrls } from '@/lib/feeds';
import { abs } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return allUrls().map((u) => ({
    url: abs(u.path),
    lastModified: u.lastmod ? new Date(u.lastmod.replace(' ', 'T') + 'Z') : undefined,
    priority: u.priority,
  }));
}
