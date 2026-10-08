---
title: Elrod Construction & Services
category: web
year: "2025"
role: Design, build, logo vectorization, hero video, deploy pipeline
stack: [Astro, Tailwind CSS, Cloudflare Pages, GitHub Actions]
status: shipped
statusNote: Built and deployed; custom domain pending DNS
links: []
summary: Marketing site for a construction company in Texarkana, with a photo pipeline so the owner adds portfolio work by sending pictures.
order: 5
---
## What it is

Elrod Construction & Services, LLC builds and renovates homes and handles commercial and site work around Texarkana, on both sides of the Arkansas and Texas line. The slogan is theirs: "Driven by service, defined by quality." The site's job is to make the phone ring with the right calls.

## What was built

- A static Astro site with pages for services, portfolio, about, and contact, styled with Tailwind and a small set of design tokens.
- A portfolio pipeline that fits how the owner works. The owner sends photos. Each one becomes a single line in a data file, and the build generates responsive WebP images on its own. Adding a project is a two-minute job with no design work.
- The logo traced from a raster original into clean vectors with ImageMagick and potrace, and a hero video cut from the company's own drone footage with ffmpeg.
- Continuous deployment to Cloudflare Pages through GitHub Actions. Push to main and the site redeploys on its own.
- Copy written from the owner's own words and reviewed with the owner before launch.

## The hard part

Keeping the system small enough that nothing breaks when nobody is watching it. There is no CMS, no database, and no account to lapse. Everything lives in one repository that any developer could pick up.
