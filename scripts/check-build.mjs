// Post-build sanity check: node scripts/check-build.mjs  (run after `npm run build`)
import fs from 'node:fs'; import path from 'node:path';
const out = path.resolve('out'); let bad = 0;
const fail = (m) => { console.log('FAIL', m); bad++; };
for (const f of ['index.html','404.html','sitemap.xml','robots.txt','llms.txt','llms-full.txt','feed.xml','_redirects']) if (!fs.existsSync(path.join(out, f))) fail('missing ' + f);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(out); const html = files.filter(f => f.endsWith('.html'));
const exists = (p) => { p = decodeURIComponent(p.split('#')[0].split('?')[0]).replace(/\/$/, '') || '/index'; return [p + '.html', p, p + '/index.html'].some(x => fs.existsSync(path.join(out, x))); };
let links = 0;
for (const f of html) {
  const s = fs.readFileSync(f, 'utf8'); const rel = path.relative(out, f);
  for (const m of s.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) { try { JSON.parse(m[1]); } catch { fail('bad JSON-LD in ' + rel); } }
  if (!/<title>[^<]+<\/title>/.test(s) && rel !== '404.html') fail('no <title> in ' + rel);
  for (const m of s.matchAll(/href="(\/[^"#]*)[^"]*"/g)) { links++; const h = m[1]; if (h.startsWith('/_next') || h.startsWith('//')) continue; if (!exists(h)) fail(`broken link ${h} on ${rel}`); }
}
const sm = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
for (const m of sm.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)) if (!exists(m[1])) fail('sitemap URL has no page: ' + m[1]);
console.log(`${html.length} pages, ${links} internal links checked, ${bad} problems`); process.exit(bad ? 1 : 0);
