# half-stache.github.io

Sam's portfolio and public hub. Static site built with [Astro](https://astro.build), deployed to GitHub Pages.

Live: https://half-stache.github.io

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
npm run check    # type-check .astro and .ts files
npm run check:seo  # after a build: headings, alt text, structured data, llms files
```

Requires Node 22 (see `.nvmrc`).

## Add or edit a project

Projects live in `src/data/projects.ts`, one object each: title, kind, status, a single line, links, a note,
up to three short facts for the "more" panel, and image stems. Screenshots go in `src/assets/work/` as WebP
(desktop about 1600 px wide, phone about 800 px) and are referenced by file stem.

The Work line, the Music paragraph, and the How I work section live in `src/data/home.ts`.

House rules for copy: no em dashes, no bragging, specific numbers, honest status. Nothing unfinished goes on the site.

## Site-wide facts

Name, company, email, and the site description live in `src/data/site.ts`.

## For search engines and AI assistants

The home page carries JSON-LD (a ProfilePage whose main entity is the Person, the company, the site, and the
two apps), the profile links carry `rel="me"`, and `public/llms.txt` is the short summary. `/llms-full.txt` is
the whole home page as Markdown, generated at build time by `src/pages/llms-full.txt.ts` from the data files,
so it never needs editing by hand. `npm run check:seo` checks all of this against `dist/`.

## The mark

`src/components/Mark.astro` draws the half-stache mark (left half red, right half paper, ink outline).
`public/favicon.svg` and `public/media/mark.svg` are standalone copies of the same path. To replace it with a traced
version of the real mustache, update the `d` attribute in all three places.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

One-time setup: in the repository on GitHub, open Settings, then Pages, and set "Build and deployment" Source to
**GitHub Actions**. Until that is set, GitHub serves the raw repository root instead of the built site.

## LavaRise privacy policy

`public/privacy.html` is served unchanged at `/privacy.html`. Do not move or rename it; the App Store listing links to it.
