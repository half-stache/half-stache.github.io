import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static portfolio for half-stache, deployed to GitHub Pages.
export default defineConfig({
  site: 'https://half-stache.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/privacy.html') })],
});
