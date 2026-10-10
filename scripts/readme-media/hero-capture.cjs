// Captures the hero current with the mark over it, one screenshot per GIF frame, on a fake clock.
// Usage: node scripts/readme-media/hero-capture.cjs <outdir> [frames=66] [stepMs=333]
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs'); const path = require('node:path');
const OUT = process.argv[2]; const FRAMES = +(process.argv[3] || 66); const STEP_MS = +(process.argv[4] || 333);
fs.mkdirSync(path.join(OUT, 'hero-frames'), { recursive: true });
const css = fs.readdirSync('dist/_astro').find((f) => /^Base\..*\.css$/.test(f));
const js = fs.readdirSync('dist/_astro').find((f) => /^Hero\.astro.*\.js$/.test(f));
const mark = fs.readFileSync('public/brand/mark-on-dark.svg', 'utf8').replace(/width="200" height="84"/, 'width="240" height="101"');
fs.writeFileSync('dist/capture-hero.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="/_astro/${css}">
<style>html,body{margin:0;width:1200px;height:400px;overflow:hidden;background:#121010}.hero{position:relative;width:1200px;height:400px;overflow:hidden}
.hero__canvas{position:absolute;inset:0;width:100%;height:100%;display:block}.mark-wrap{position:absolute;inset:0;display:grid;place-items:center}</style></head>
<body><section class="hero" id="top"><canvas class="hero__canvas" id="hero-canvas"></canvas><div class="mark-wrap">${mark}</div></section>
<script type="module" src="/_astro/${js}"></script></body></html>`);
(async () => {
  const server = spawn('python3', ['-m', 'http.server', '4321', '-d', 'dist'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 1000));
  try {
    const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 400 }, deviceScaleFactor: 2, colorScheme: 'dark' });
    const page = await ctx.newPage();
    await page.clock.install({ time: new Date('2026-10-10T12:00:00Z') });
    await page.goto('http://localhost:4321/capture-hero.html', { waitUntil: 'load' });
    await page.clock.runFor(400);
    for (let i = 0; i < FRAMES; i++) {
      await page.clock.runFor(STEP_MS);
      await page.screenshot({ path: path.join(OUT, 'hero-frames', `f${String(i).padStart(3, '0')}.png`) });
    }
    await browser.close();
    console.log('captured', FRAMES, 'frames');
  } finally { server.kill(); fs.rmSync('dist/capture-hero.html', { force: true }); }
})();
