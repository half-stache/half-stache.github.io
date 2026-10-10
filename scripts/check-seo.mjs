// Checks the built site the way a crawler would read it. Run after `npm run build`:
//   npm run check:seo
// Exits 1 if any check fails. No dependencies beyond Node.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const read = (f) => fs.readFileSync(path.join(dist, f), 'utf8');
const EM_DASH = '—';
let failures = 0;

function check(ok, label) {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}`);
  if (!ok) failures += 1;
}

const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1];
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((m) => m[0]);
const headings = (html) => [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
const jsonLd = (html) => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  return m ? JSON.parse(m[1]) : null;
};

for (const page of ['index.html', 'brand/index.html']) {
  const html = read(page);
  console.log(`\n${page}`);
  check(/<html lang="en"/.test(html), 'lang="en" on <html>');
  check(/<title>[^<]+<\/title>/.test(html), 'has a <title>');
  check(/<meta name="description" content="[^"]+"/.test(html), 'has a meta description');
  check(/<link rel="canonical" href="https:\/\/[^"]+"/.test(html), 'has a canonical link');
  check(/<meta property="og:title" content="[^"]+"/.test(html) && /<meta property="og:description" content="[^"]+"/.test(html), 'has og:title and og:description');

  const hs = headings(html);
  check(hs.filter((h) => h === 1).length === 1, 'exactly one <h1>');
  check(hs[0] === 1 && hs.every((h, i) => i === 0 || h <= hs[i - 1] + 1), 'headings start at h1 and never skip a level');

  const imgs = tags(html, 'img');
  const noAlt = imgs.filter((t) => !attr(t, 'alt'));
  check(imgs.length > 0 && noAlt.length === 0, `every <img> has a non-empty alt (${imgs.length} images)`);
  const noSize = imgs.filter((t) => !attr(t, 'width') || !attr(t, 'height'));
  check(noSize.length === 0, 'every <img> has width and height');

  check(/<a class="skip" href="#main">/.test(html), 'skip link');
  check(/<header\b/.test(html) && /<main id="main">/.test(html) && /<footer\b/.test(html), 'header, main, and footer landmarks');
  check(/<nav class="site-nav" aria-label="Primary">/.test(html) && /<nav aria-label="Footer">/.test(html), 'both navs have aria-label');
  check(!/rel="[^"]*nofollow/.test(html), 'no rel="nofollow" on links');
  check(!html.includes(EM_DASH), 'no em dash');

  for (const t of tags(html, 'link').filter((t) => attr(t, 'rel') === 'preload')) {
    const href = attr(t, 'href');
    check(fs.existsSync(path.join(dist, href)) && /\bcrossorigin\b/.test(t), `preload ${href} exists and is crossorigin`);
  }
}

console.log('\nindex.html, home page specifics');
const home = read('index.html');
check(/<title>[^<]*Sam Hutcherson[^<]*<\/title>/.test(home), 'title contains "Sam Hutcherson"');
check(/<img[^>]*fetchpriority="high"/.test(home), 'hero image has fetchpriority="high"');
check(tags(home, 'a').filter((t) => attr(t, 'rel') === 'me').length >= 3, 'at least three rel="me" profile links');

let ld = null;
try { ld = jsonLd(home); } catch (e) { ld = null; }
check(ld !== null, 'JSON-LD parses');
if (ld) {
  const graph = ld['@graph'] || [ld];
  const byType = (t) => graph.filter((n) => n['@type'] === t);
  const person = byType('Person')[0];
  check(person && person.name === 'Sam Hutcherson', 'JSON-LD has a Person named "Sam Hutcherson"');
  check(person && ['image', 'url', 'email', 'jobTitle'].every((k) => person[k]), 'Person has image, url, email, and jobTitle');
  check(person && ['github.com/half-stache', 'open.spotify.com', 'youtube.com'].every((s) => (person.sameAs || []).some((u) => u.includes(s))), 'Person sameAs lists GitHub, Spotify, and YouTube');
  const org = byType('Organization')[0];
  check(org && org.name === 'Hutchware LLC' && org.founder && org.founder['@id'] === person['@id'], 'Organization Hutchware LLC with founder pointing at the Person');
  const profile = byType('ProfilePage')[0];
  check(profile && profile.mainEntity && profile.mainEntity['@id'] === person['@id'], 'ProfilePage with mainEntity pointing at the Person');
  const ids = new Set(graph.map((n) => n['@id']).filter(Boolean));
  const refs = [...JSON.stringify(ld).matchAll(/"@id":"([^"]+)"/g)].map((m) => m[1]);
  check(refs.every((r) => ids.has(r)), 'every @id reference resolves inside the graph');
}

console.log('\nfiles');
for (const f of ['llms.txt', 'llms-full.txt']) {
  const exists = fs.existsSync(path.join(dist, f));
  check(exists, `${f} exists`);
  if (exists) check(!read(f).includes(EM_DASH), `${f} has no em dash`);
}
check(fs.existsSync(path.join(dist, 'llms.txt')) && read('llms.txt').includes('/llms-full.txt'), 'llms.txt links to llms-full.txt');
const sitemapIndex = fs.existsSync(path.join(dist, 'sitemap-index.xml')) ? read('sitemap-index.xml') : '';
const sitemaps = [...sitemapIndex.matchAll(/<loc>[^<]*\/(sitemap-\d+\.xml)<\/loc>/g)].map((m) => read(m[1])).join('');
check(sitemaps.includes('<loc>https://half-stache.github.io/</loc>') && sitemaps.includes('<loc>https://half-stache.github.io/brand/</loc>'), 'sitemap lists / and /brand/');
check(!sitemaps.includes('privacy.html'), 'sitemap excludes privacy.html');
check(fs.existsSync(path.join(dist, 'robots.txt')) && /Sitemap: https:\/\/half-stache\.github\.io\/sitemap-index\.xml/.test(read('robots.txt')), 'robots.txt points at the sitemap');

const weigh = (f) => fs.statSync(path.join(dist, f)).size;
const assets = [...home.matchAll(/(?:href|src)="(\/_astro\/[^"]+\.(?:css|js))"/g)].map((m) => m[1]);
const total = weigh('index.html') + assets.reduce((n, a) => n + weigh(a), 0);
console.log(`\nweight: index.html ${weigh('index.html')} B` + assets.map((a) => `, ${path.basename(a)} ${weigh(a)} B`).join('') + ` = ${total} B (${(total / 1024).toFixed(1)} KB)`);

console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
process.exit(failures ? 1 : 0);
