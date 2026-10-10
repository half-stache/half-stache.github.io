// Renders a share image for each project page: public/media/og-<slug>.jpg, 1200 by 630.
// Needs a build in dist/ (for the fonts and tokens) and the global Playwright install:
//   npm run build && NODE_PATH=$(npm root -g) node scripts/og-images.cjs
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const sharp = require('sharp');

// Read the data file without a TypeScript toolchain: it is plain enough to evaluate as JS.
const src = fs.readFileSync('src/data/projects.ts', 'utf8')
  .replace(/^export type[\s\S]*?^};\n/m, '')
  .replace(/^export const projectBySlug[\s\S]*$/m, '')
  .replace(/^export const projects: Project\[\] =/m, 'module.exports =');
const projects = new Function('module', src + '\nreturn module.exports;')({});

const css = fs.readdirSync('dist/_astro').find((f) => /^Base\..*\.css$/.test(f));
fs.mkdirSync('dist/og-src', { recursive: true });
const mark = fs.readFileSync('public/brand/mark-on-dark.svg', 'utf8').replace(/width="200" height="84"/, 'width="120" height="50"');

function page(p) {
  const first = p.shots[0] || (p.figure ? { stem: p.figure.stem, kind: 'desktop' } : null);
  const second = p.shots[1];
  for (const s of [first, second].filter(Boolean)) {
    const from = `src/assets/work/${s.stem}.webp`;
    if (fs.existsSync(from)) fs.copyFileSync(from, `dist/og-src/${s.stem}.webp`);
  }
  const icon = p.icon && fs.existsSync(`src/assets/work/${p.icon}.webp`) ? (fs.copyFileSync(`src/assets/work/${p.icon}.webp`, `dist/og-src/${p.icon}.webp`), `/og-src/${p.icon}.webp`) : null;
  const phones = first && first.kind === 'phone';
  const right = phones
    ? `<div class="phones"><img src="/og-src/${first.stem}.webp">${second ? `<img src="/og-src/${second.stem}.webp">` : ''}</div>`
    : first
      ? `<div class="desk"><img src="/og-src/${first.stem}.webp"></div>`
      : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="/_astro/${css}">
<style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#121010;color:#f1ece3;font-family:var(--font-body);display:grid;grid-template-columns:600px 600px}
.l{padding:60px 64px;display:flex;flex-direction:column;justify-content:space-between}
.icon{width:72px;height:72px;border-radius:16px;border:1px solid rgba(241,236,227,.14);margin-bottom:22px}
.word{font-family:var(--font-display);font-size:${p.title.length > 18 ? 64 : 88}px;line-height:1;letter-spacing:-0.02em;font-variation-settings:"opsz" 144,"SOFT" 40,"WONK" 1}
.kind{font-size:26px;line-height:1.35;max-width:480px;color:#aca49a;margin-top:18px}
.by{display:flex;align-items:center;gap:14px;font-family:var(--font-mono);font-size:18px;color:#aca49a;white-space:nowrap}
.by svg{flex:none;width:64px;height:auto}
.r{position:relative;overflow:hidden}
.phones{position:absolute;left:40px;top:60px;display:flex;gap:28px}
.phones img{width:270px;height:auto;border-radius:30px;border:1px solid rgba(241,236,227,.2)}
.desk{position:absolute;left:40px;top:90px;width:760px}
.desk img{width:100%;height:auto;border-radius:10px;border:1px solid rgba(241,236,227,.2)}
</style></head><body>
<div class="l"><div>${icon ? `<img class="icon" src="${icon}">` : ''}<div class="word">${p.title}</div><div class="kind">${p.kind}</div></div>
<div class="by">${mark}<span>by Sam Hutcherson · half-stache.github.io</span></div></div>
<div class="r">${right}</div>
</body></html>`;
}

(async () => {
  const server = spawn('python3', ['-m', 'http.server', '4321', '-d', 'dist'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 1000));
  try {
    const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    const pg = await ctx.newPage();
    for (const p of projects) {
      fs.writeFileSync(`dist/og-src/${p.slug}.html`, page(p));
      await pg.goto(`http://localhost:4321/og-src/${p.slug}.html`, { waitUntil: 'networkidle' });
      await pg.evaluate(() => document.fonts.ready);
      await pg.waitForTimeout(300);
      const png = await pg.screenshot();
      const out = `public/media/og-${p.slug}.jpg`;
      await sharp(png).jpeg({ quality: 86 }).toFile(out);
      console.log(out, Math.round(fs.statSync(out).size / 1024) + 'KB');
    }
    await browser.close();
  } finally {
    server.kill();
    fs.rmSync('dist/og-src', { recursive: true, force: true });
  }
})();
