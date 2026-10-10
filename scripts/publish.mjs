// Build the site and copy the output to the repository root, so GitHub Pages' default build of the
// main branch serves it without GitHub Actions. Run `npm run publish`, then commit and push main.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

execSync('npm run build', { stdio: 'inherit' });

// Directories the build owns at the root. They are replaced wholesale so stale hashed files never pile up.
for (const dir of ['_astro', 'brand', 'media']) fs.rmSync(dir, { recursive: true, force: true });

const entries = fs.readdirSync('dist');
for (const entry of entries) fs.cpSync(path.join('dist', entry), entry, { recursive: true });

// Tell GitHub Pages not to run Jekyll, which would otherwise ignore the _astro directory.
fs.writeFileSync('.nojekyll', '');

console.log(`Published to the repository root: ${entries.join(', ')}`);
console.log('Now: git add -A && git commit -m "Publish" && git push origin main');
