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
```

Requires Node 22 (see `.nvmrc`).

## Add or edit a project

Each project is one Markdown file in `src/content/projects/`. The filename is the URL slug
(`vectorshield.md` becomes `/work/vectorshield/`). Copy an existing file and fill in the front matter:

```yaml
title: Project name
category: apps          # apps | web
year: "2026"
role: What you did
stack: [Swift, Supabase]
status: shipped         # shipped | in-progress | research
statusNote: One honest line about where it stands
links:
  - label: example.com
    url: https://example.com
summary: One sentence for the card on the home page.
order: 6                # position within its category
draft: false            # true hides it from the site
```

The body below the front matter is the case study. Keep it concrete: what it is, who it's for, the hard part, status.

House rules for copy: no em dashes, no bragging, specific numbers, honest status. Nothing unfinished goes on the site.

## Site-wide facts

Name, company, email, and the site description live in `src/data/site.ts`.

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
