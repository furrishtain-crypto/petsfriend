// Writes public/_redirects (Netlify) from content/redirects.json plus the legacy URLs below.
// Real 301s, so old links and Google rankings carry over to the new URLs.
import fs from 'node:fs';
const list = JSON.parse(fs.readFileSync(new URL('../content/redirects.json', import.meta.url), 'utf8'));
// Add old-site URLs here at launch, e.g. { from: '/collections/all', to: '/products' }
const legacy = [
  { from: '/collections/all', to: '/products' },
  { from: '/pages/about-us', to: '/about' },
  { from: '/pages/contact', to: '/contact' },
];
const lines = [...legacy, ...list].map((r) => `${r.from} ${r.to} 301`);
fs.mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../public/_redirects', import.meta.url), lines.join('\n') + '\n');
console.log(`_redirects: ${lines.length} rules`);
