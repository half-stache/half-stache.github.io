# Handoff: half-stache.github.io

Written 2026-10-10 at the end of the first build session. Read this before touching the site.

## Where things stand

The site is finished enough to publish and is not yet public. `main` holds the current build (PR #9 merged). A
private preview of the exact build is at https://claude.ai/artifact/8iYRtHCp9V8kqjS7UaDk9z and is republished
after every change.

What is live today at https://half-stache.github.io is still the old LavaRise privacy policy at the root, served
by GitHub's legacy Pages build from the repository root. `index.html` and `privacy.html` at the root exist only
to keep that working until the switch below.

## The site

Astro 7, static, dark only, one page. Hand-written CSS with tokens in `src/styles/tokens.css`. Fonts are
self-hosted: Fraunces for display, IBM Plex Sans for body, IBM Plex Mono for small labels. JavaScript on the page
is about 4 KB: the hero's WebGL current and an IntersectionObserver for reveals. No analytics, no cookies, no
third-party requests until the visitor asks for the Spotify player.

Content lives in four files and nowhere else:

- `src/data/site.ts`: name, company, email, links, tagline, description, the footer's identity line.
- `src/data/about.ts`: the About section, three paragraphs in Sam's voice.
- `src/data/projects.ts`: one object per project with a kind, one paragraph, one link, an icon, and image stems.
- `src/data/home.ts`: the Work line, the Music paragraph, and the How I work section.

Images are in `src/assets/work/` as WebP and are referenced by file stem. Astro emits the responsive sizes.
Sam's portrait is `src/assets/sam.webp` (the original selfie was mirrored and has been flipped so the hat reads
correctly and the mustache is red on the left, white on the right, matching the mark). The share image is
`public/media/og.jpg`.

Discoverability: JSON-LD on the home page (ProfilePage, Person, Organization, WebSite, two
SoftwareApplications), per-page titles and descriptions, `rel="me"` on the profile links, font preloads, a
sitemap, `public/robots.txt`, and `public/llms.txt`. `/llms-full.txt` is generated from the data files by
`src/pages/llms-full.txt.ts`. `public/llms.txt` is kept by hand, so update it when a project or link changes.
`npm run check:seo` checks the built site and must pass before a publish.

`public/privacy.html` is the LavaRise privacy policy and must stay byte-identical at `/privacy.html`; the App
Store listing points at it.

## Rules that came from Sam

- Whole sentences, in the first person, in his voice. No fragments, no labels, no slogans.
- Minimal text. One paragraph and one link per project. Nothing that reads as machine-written.
- No em dashes anywhere.
- No bragging, no invented facts. Everything on the page was either said by Sam in the interview or read from
  his repositories. Status is honest ("in progress" stays "in progress").
- Nothing unfinished goes on the site. Good Deed Simulator, the bookd apps, and insurance-era work stay off.
- Do not name the insurance client or its product. "An insurance agency" is as specific as it gets.
- Hutchware LLC is named once as the company client work runs through. half-stache is the person.
- Scripture appears once, plainly: 1 Samuel 3:10, chosen for the theme of listening.
- Dark mode is the look. The mark, the typeface, and the hero current are keepers.

## Where the assets came from

| Project | Source |
|---|---|
| VectorShield site | `half-stache/VectorShield` `web/`, built locally with placeholder Supabase env and captured |
| VectorShield app screens | `half-stache/AGSMonitor` `VectorShield-Web/public/screenshots/website/light` (June 2026 set, the one vectorshield.app uses; the `appstore/iphone_6_9` set is from February and is stale) |
| VectorShield icon | `AGSMonitor` `VectorShield-Web/public/app-icon.png` |
| LavaRise screens and icon | `half-stache/speedRecurse` `fastlane/screenshots/en-US` and `icon.png` (February 2026 release set; nothing newer exists) |
| Hutch's RV Park | `half-stache/hutchrv`, built locally with placeholder Keystatic env and captured |
| Elrod Construction | `half-stache/elrodconstructionservices`, built locally and captured |
| Riverstock diagram | drawn from `half-stache/Riverstock` `docs/data/access-points.csv` |

The build container cannot reach the App Store, Apple's image servers, Spotify, or YouTube. Everything has to
come from a repository or from Sam.

## Going live

GitHub Actions is blocked at the account level (every run dies in seconds with no log; billing or an Actions
policy). Sam does not want to resolve that. The path that needs no Actions and no billing:

1. Build (`npm run build`), copy the contents of `dist/` to the repository root, and add an empty `.nojekyll`
   file so the legacy Pages build serves `_astro/` untouched.
2. Delete `.github/workflows/deploy.yml`.
3. Push to `main`. The free "pages build and deployment" job publishes the root.
4. Confirm `/` and `/privacy.html` and the sitemap resolve.

A small script to do step 1 belongs in `package.json` as `npm run publish` so each change is one command.

## Open items

- The Riverstock hardware-first note is filed as half-stache/Riverstock issue #22.
- The writing section (RSS from day one) starts when the first piece exists. Topics Sam named: communication
  between people, the efficiency of information transfer, the history of ideas and philosophers.
- Beats for sale could hang off the Music section later; sambeats.com exists as a repo stub.
- A real traced mark from the photo would replace the drawn one in `Mark.astro`, `favicon.svg`, `media/mark.svg`.

## Next: one brand across everything

Sam's entities today: half-stache (the person and this site), Hutchware LLC (the company), VectorShield,
LavaRise, Riverstock, the music under his own name, and client sites for Hutch's RV Park and Elrod Construction.
The goal is cohesion without flattening the products into one look.

Proposed architecture:

- **half-stache is the face.** The mark, the photo, the voice, the GitHub handle, the YouTube channel. Anything
  personal points here.
- **Hutchware LLC is the paperwork.** It appears on invoices, contracts, App Store seller records, and in one
  line on the site. It should not get a competing logo; a wordmark set in Fraunces in the same red is enough,
  and it never appears next to the mustache so the two are not confused.
- **Products keep their own identity.** VectorShield is teal and clinical, LavaRise is pixel art and orange,
  Riverstock has its own "water clock" design language in its docs. Cohesion comes from a shared credit line
  ("made by half-stache" linking here), the same typographic voice in their READMEs and store copy, and the same
  honest tone, not from shared colors.
- **Client sites belong to the clients.** The only trace of half-stache is an optional "site by half-stache"
  footer credit, which is also how the next client finds him.

Concrete deliverables, in order:

1. **Brand sheet in this repo** (`public/brand/`, DONE 2026-10-10, PR #12, live at `/brand/`): the mark in four variants (red and paper on dark, on light,
   single color, and a favicon version), the half-stache wordmark, the Hutchware wordmark, the color tokens,
   and the type pairing, with a one-page HTML sheet that shows them. These are the "give-away" pieces Sam asked
   for early on, and they let every future thing he makes start from the same files.
2. **GitHub profile as the hub.** Create the public repository `half-stache/half-stache` with a README that
   carries the mark, the same three-sentence bio the site uses, and links to the site, VectorShield, LavaRise,
   Spotify, and YouTube. Set the profile name, bio, location, website, and avatar (the photo or the mark; the
   same choice the site makes). Pin the site repository first.
3. **Repository hygiene, all of it private.** No repository goes public for now; Sam decided this on
   2026-10-10. Every repository still gets a one-line description, topics, and a README that opens with what
   it is and "made by half-stache", because that is what Sam sees every day and what any future collaborator
   sees first. Archive the dead ones (the bookd variants, AICORD, AlphaGalaxy, agsdata, good-deed-simulator)
   so the account reads as a working shop. The only public repository besides this site is the profile
   README repository in step 2, which holds one Markdown file and no code.

   When making a repository public is worth considering, later: the work is finished enough that a stranger
   could use it or clearly labeled as a sketch; the full history is clean of keys, tokens, customer data, and
   third-party assets (a secret committed once means a rewritten history or a fresh repository, not a
   deletion); a license is chosen; and there is a reason, such as wanting contributors, open-sourcing a tool
   on purpose, or showing code to an employer. Identity and client work do not need it. The site and the
   profile README do that job.

4. **Credit lines.** Add the "site by half-stache" footer link to Hutch's RV Park and Elrod, and "made by
   half-stache" to the VectorShield and LavaRise store copy and READMEs.
5. **A domain.** Sam already owns samhutcherson.com, and the site's own headline is his name, so that becomes
   the hub's address. On GitHub Pages this is a `CNAME` file in `public/` containing `samhutcherson.com`,
   plus DNS at the registrar: four A records for the apex pointing at GitHub Pages
   (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a CNAME for `www` pointing at
   `half-stache.github.io`. Then "Enforce HTTPS" in the repository's Pages settings once the certificate
   issues. `site` in `astro.config.mjs`, the JSON-LD, `robots.txt`, and `llms.txt` all change to the new
   domain at the same time. halfstache.com is worth buying as a second door (note the spelling: the brand is
   half-stache, so halfstache.com, not halfstash.com) and set to redirect to samhutcherson.com. A matching
   mailbox on samhutcherson.com would replace the Hotmail address on the site.

6. **Then go live** with the no-Actions path above, and announce it from the YouTube and Spotify profiles by
   pointing their links at the site.
