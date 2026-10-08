import { defineConfig } from 'astro/config';

// Static portfolio for half-stache, deployed to GitHub Pages by .github/workflows/deploy.yml.
export default defineConfig({
  site: 'https://half-stache.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
