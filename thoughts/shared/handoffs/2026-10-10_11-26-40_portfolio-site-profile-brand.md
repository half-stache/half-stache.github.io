---
date: 2026-10-10T11:26:40Z
git_commit: ae9a345
branch: main
topic: "half-stache portfolio site, GitHub profile hub, and brand"
tags: [implementation, half-stache, astro, github-pages, brand, seo, profile-readme]
status: complete
---

# A3 Handoff: the half-stache site is live, the profile hub is up, the brand files exist

This file is public, like the repository. It carries no private material; the interview notes that
sourced the site copy stayed off the repository on purpose.

---

## 1. BACKGROUND / THEME

**Why this work matters:**
Sam's GitHub showed almost nothing and the only page at half-stache.github.io was a privacy policy.
The site, the profile README, and the brand sheet now give one address that search engines, AI
assistants, clients, and collaborators can read and quote, with every project linked and every claim
sourced from Sam or his repositories.

**Session Goal:**
Build and publish the portfolio hub; make the GitHub profile "up to snuff"; produce a cohesive brand;
optimize for search and generative engines; go live; finish with a handoff.

---

## 2. CURRENT CONDITION

### Work Status
| Task | Status | Notes |
|------|--------|-------|
| Astro site, dark, one page, hero WebGL current | complete | PRs #1 to #9 |
| Real screenshots, portrait, Spotify, YouTube | complete | Sources listed in `docs/HANDOFF.md` |
| Brand sheet at `/brand/` with downloadable files | complete | PR #12 |
| Go live on GitHub Pages without Actions | complete | PR #13, `npm run publish` flow |
| SEO and AI-search pass, `npm run check:seo` | complete | PR #14 |
| Dark outline on the mark (Sam's review comment) | complete | PR #15, share image re-rendered |
| GitHub profile README at half-stache/half-stache | complete | Sam created the repo; README and media pushed |
| Profile README media: hero GIF, phone loops, Riverstock wave | complete | PRs #16, #17 hold the generators |
| Riverstock wave: water temperature by month | complete | Measured means from Riverstock docs/17 |
| Navigation pass: sticky header with scroll spy, back to top, App Store badges, a page per project, share images, manifest | complete | PR #19, decided with Sam on 2026-10-10 |
| Profile fields, avatar, pins | blocked on Sam | `docs/github-profile/SETTINGS.md` |
| samhutcherson.com on the site | not started | Needs DNS at the registrar first |

### Key Metrics
| Metric | Value |
|--------|-------|
| Commits on main | `git rev-list --count HEAD` (49 at handoff) |
| Tracked files | `git ls-files \| wc -l` (221 at handoff) |
| Build, type check, SEO check | all passing at ae9a345 |
| Live site | https://half-stache.github.io (Pages run green on the last Publish commit) |
| Preview artifact | https://claude.ai/artifact/8iYRtHCp9V8kqjS7UaDk9z, version 11 |
| Profile repo | half-stache/half-stache at 851975c |

### Artifacts Produced
- `src/data/{site,about,projects,home}.ts` - all page copy; nothing else holds text
- `src/components/{Hero,Mark,WorkRow,Music,Footer,RiverDiagram}.astro`, `src/layouts/Base.astro` - the page
- `src/scripts/hero-canvas.ts` - the WebGL current (30 fps cap, reduced-motion still frame)
- `src/styles/{tokens,global}.css` - the only place colors, type, and spacing live
- `src/pages/{index,brand,404}.astro`, `src/pages/work/[slug].astro`, `src/pages/llms-full.txt.ts` - pages and the generated llms-full.txt
- `src/scripts/nav.ts`, `src/components/AppStoreBadge.astro`, `scripts/og-images.cjs` - navigation, the badge, per-project share images
- `public/brand/*` - mark variants, wordmarks, raster exports, `tokens.css`, `tokens.json`
- `public/media/og.jpg`, `public/llms.txt`, `public/robots.txt`, `public/privacy.html` (byte-identical LavaRise policy)
- `scripts/publish.mjs`, `scripts/check-seo.mjs`, `scripts/wordmarks.py`, `scripts/readme-media/*`
- `docs/HANDOFF.md` (narrative handoff), `docs/github-profile/{README,SETTINGS}.md`
- Repository root: the built site (`index.html`, `_astro/`, `brand/`, `media/`, sitemaps, `.nojekyll`)

---

## 3. TARGET CONDITION

**Definition of Done:**
A live site and GitHub profile that read as one brand, link every shipped project, and answer
"who is Sam Hutcherson" and "what is half-stache" in sentences a person or an assistant can quote.

**Acceptance Criteria:**
- [x] Site live at the GitHub Pages address, privacy policy unchanged at `/privacy.html`
- [x] Whole sentences in Sam's voice, one link per project, real screenshots, no em dashes
- [x] JSON-LD graph, rel="me", sitemap, robots, llms.txt and llms-full.txt, check script green
- [x] Brand sheet with downloadable files and tokens
- [x] Profile README published with the mark, the bio, the links, and themed motion
- [ ] Profile fields, avatar, and pins set (Sam)
- [ ] Custom domain samhutcherson.com (Sam sets DNS, then one small PR)

---

## 4. GAP ANALYSIS

```
CURRENT STATE                               →    TARGET STATE
─────────────                                    ────────────
Site at half-stache.github.io               →    Site at samhutcherson.com, github.io redirects
Profile README live, profile fields empty   →    Name, bio, company, links, avatar, pin set
Riverstock temperatures: straight line      →    Values from an equilibrium model when it exists
No writing section                          →    Writing with RSS once the first piece exists
Drawn mark                                  →    Traced mark from the photo, if Sam wants one
```

### Remaining Work
| Gap | Priority | Effort |
|-----|----------|--------|
| Profile settings and pins (Sam, by hand) | P1 | Low |
| samhutcherson.com: DNS, `public/CNAME`, `site` in `astro.config.mjs`, JSON-LD, robots, llms | P2 | Low |
| Repository descriptions, topics, READMEs, archive dead repos (all stay private) | P2 | Med |
| Writing section with RSS | P3 | Med |
| Beats for sale off the Music section | P3 | Med |
| Swap the Riverstock SVG's interior values for the equilibrium model | P3 | Low |

---

## 5. ROOT CAUSE / LEARNINGS

### Key Discoveries
1. **GitHub Actions is blocked on this account.** Every run died in seconds with no log. The legacy
   "pages build and deployment" job from the repository root works and costs nothing, so
   `npm run publish` copies `dist/` to the root with `.nojekyll`.
2. **A cloud session cannot create repositories.** Both the GitHub App integration and the `gh` CLI
   through the session proxy refuse it (403, sessions are bound to configured repositories). Sam
   creates the repo; `add_repo` then attaches it.
3. **Fixed-clock capture makes WebGL GIFs even.** Playwright's `page.clock` drives
   `requestAnimationFrame` and `performance.now`, so each frame advances the shader by a known step
   regardless of how slow software rendering is. A crossfade of the tail into the head hides the seam.
4. **GIFs for a README need to stay under about 3 MB.** The first hero GIF was 5 MB; 1000 by 334
   pixels, 56 frames, 160 colors, no dither brought it under.
5. **SMIL in an SVG animates inside a README image**, and it is crisp at 11 KB. Testing it needs a
   page loaded from `file://`; an `about:blank` page cannot load file images and shows nothing.
6. **The artifact tool refuses to replace files it has not seen this session.** A `list` with
   `scope: files` counts as seeing them.
7. **Riverstock measures temperature at exactly two points** (dam tailwater mile 0.34, Dewey mile
   29.5). Anything between is interpolation and must say so; the doc's monthly table is the honest
   source for a figure.

### Blockers Encountered
| Blocker | Resolution | Status |
|---------|------------|--------|
| Actions deploy failing with no logs | Legacy Pages build from root, workflow removed | Resolved |
| No network to App Store, Spotify, YouTube, github.io | Assets from repositories; links found by search or from Sam | Resolved |
| Repo creation refused from the session | Sam created half-stache/half-stache | Resolved |
| Remote branch delete hangs through the proxy | Left `seo-geo` on origin; harmless | Open, cosmetic |

---

## 6. COUNTERMEASURES / ACTION ITEMS

### Immediate Next Steps (P1)
1. [ ] Sam sets the profile fields, avatar, and the pin for this repository - `docs/github-profile/SETTINGS.md`
2. [ ] Open https://github.com/half-stache once in both themes and confirm the four media pieces load

### Short-term (P2)
3. [ ] When DNS is set: add `public/CNAME`, change `site` in `astro.config.mjs`, update `public/robots.txt`, `public/llms.txt`, and the raw URLs in the profile README if the media moves - then `npm run publish`
4. [ ] Repository hygiene across the account, all private: descriptions, topics, READMEs, archive the dead ones (plan in `docs/HANDOFF.md`)
5. [ ] Delete the stale `seo-geo` branch on origin from the GitHub UI

### Backlog (P3)
6. [ ] Writing section with RSS from the first piece
7. [ ] Beats for sale under Music
8. [ ] Traced mark from the photo to replace the drawn path in `src/components/Mark.astro`, `public/favicon.svg`, `public/media/mark.svg`, `public/brand/*`
9. [ ] Riverstock equilibrium temperature model feeds `scripts/readme-media/riverstock.py`

---

## 7. IMPLEMENTATION NOTES

### Critical File References
| File | Purpose | Key Lines |
|------|---------|-----------|
| `docs/HANDOFF.md` | Narrative handoff: rules from Sam, asset sources, publishing, brand plan | whole file |
| `src/data/projects.ts` | One object per project; add a project here and nowhere else | whole file |
| `scripts/publish.mjs` | The only way the live site changes | whole file |
| `scripts/check-seo.mjs` | Crawler's-eye check; must pass before a publish | whole file |
| `scripts/readme-media/README.md` | How to regenerate the profile README media | whole file |

### Commands to Remember
```bash
npm run check:seo        # build and check the output
npm run publish          # build and copy dist/ to the repository root
git add -A && git commit -m "Publish" && git push origin main
node scripts/readme-media/hero-capture.cjs out && python3 scripts/readme-media/hero-assemble.py out
python3 scripts/readme-media/riverstock.py out && python3 scripts/readme-media/phones.py out
```

### Architecture Notes
Astro 7 static site, dark only, hand-written CSS tokens, self-hosted Fraunces and IBM Plex. One page
plus `/brand/`. Content in four data files. JSON-LD graph with stable ids. GitHub Pages serves the
repository root; source and built output live side by side on `main`. The profile README links media by
raw URL from the profile repository's `media/` folder; bump `?v=` on a URL when its file changes.

---

## 8. FOLLOW-UP / VERIFICATION

### Success Metrics
| Check | Command/Action | Expected Result |
|-------|----------------|-----------------|
| Build passes | `npm run build` | No errors |
| Types pass | `npx astro check` | 0 errors |
| SEO check | `npm run check:seo` | "all checks passed" |
| Live site | open https://half-stache.github.io and `/brand/` and `/privacy.html` | All resolve |
| Profile | open https://github.com/half-stache | README with header GIF, two phone loops, river SVG |

### Risks & Watchouts
- GitHub's image proxy caches README images: change a media file, bump its `?v=` query in the README.
- The GitHub mobile app may show SVG animation as a still frame; the web renders it.
- Riverstock interior temperatures are a straight line between two sensors; the figure says so, keep it that way.
- The publish commit is the only commit that should touch the built files at the root.

---

## QUICK RESUME CHECKLIST

For the next session, immediately:
1. [ ] Read this handoff completely, then `docs/HANDOFF.md`
2. [ ] Run: `npm install && npm run check:seo`
3. [ ] Check: `docs/github-profile/SETTINGS.md` against the live profile
4. [ ] Start with: the P1 items, then the domain if DNS is ready

---

*A3 Format: Toyota Production System problem-solving methodology*
*Handoff created at: 2026-10-10T11:26:40Z*
