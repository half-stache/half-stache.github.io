---
date: 2026-10-10T15:00:06Z
git_commit: 0e3327f
branch: main
topic: "half-stache site, profile hub, and brand: session end"
tags: [implementation, half-stache, astro, github-pages, brand, seo, profile-readme, navigation]
status: complete
---

# A3 Handoff: session end, the site has navigation and a page per project

This file is public, like the repository, and carries no private material. It supersedes
`2026-10-10_11-26-40_portfolio-site-profile-brand.md`, which still holds the learnings from the first half of
the day. Read `docs/HANDOFF.md` for the narrative: the rules from Sam, where the assets came from, and the plan.

---

## 1. BACKGROUND / THEME

**Why this work matters:**
One address that search engines, AI assistants, clients, and collaborators can read and quote: the site, the
GitHub profile, and the brand files, with every project linked and every claim sourced from Sam or his repositories.

**Session Goal (this half):**
Act on Sam's review: temperature on the Riverstock wave, no experimental VectorShield screen, wordmarks that
work on light, then a navigation pass to make the site full-fledged rather than vibe-coded, aligned with him on taste.

---

## 2. CURRENT CONDITION

### Work Status
| Task | Status | Notes |
|------|--------|-------|
| Riverstock wave with water temperature by month | complete | PR #17; measured means from Riverstock docs/17, interior labelled as a straight line |
| VectorShield Overview screen removed everywhere | complete | PR #18; experimental feature, stays off until Sam says otherwise |
| Wordmarks: on-dark and on-light files, shown on both | complete | PR #18 |
| Navigation pass: sticky header with scroll spy, back to top, App Store badges, a page per project, share images, manifest | complete | PR #19; decided with Sam, all four recommended options |
| Profile README with hero GIF, phone loops, river animation | complete | half-stache/half-stache at 1840351 |
| Profile fields, avatar, pins | blocked on Sam | `docs/github-profile/SETTINGS.md` |
| samhutcherson.com | not started | needs DNS at the registrar first |

### Key Metrics
| Metric | Value |
|--------|-------|
| Commits on main | `git rev-list --count HEAD` (56 at handoff) |
| Build, type check, SEO check | all passing at 0e3327f; the SEO check covers every page |
| Live site | https://half-stache.github.io, Pages run green on the last Publish commit |
| Preview artifact | https://claude.ai/artifact/8iYRtHCp9V8kqjS7UaDk9z, version 13 |
| Pull requests merged today | #14 through #19 |

### Artifacts Produced (this half)
- `src/pages/work/[slug].astro` - one page per project from `src/data/projects.ts`
- `src/data/projects.ts` - page fields added: since, status, platforms, built, appStore, more, shots, figure, wave
- `src/scripts/nav.ts` - sticky header state, scroll spy, back to top
- `src/components/AppStoreBadge.astro` - Apple's badge, drawn; Apple mark from simple-icons (CC0)
- `src/components/WorkRow.astro`, `Footer.astro`, `Base.astro`, `global.css` - title links, badge, back-to-top control, manifest and touch icon, page styles
- `scripts/og-images.cjs` - share image per project into `public/media/og-<slug>.jpg`
- `scripts/check-seo.mjs` - every page: share image exists, unique titles, breadcrumbs, sitemap and llms entries
- `scripts/readme-media/*` - generators for the profile README media; `riverstock.py` carries the temperature table
- `public/brand/wordmark-*-on-dark.svg`, `-on-light.svg`; `public/media/riverstock-wave.svg`; `public/manifest.webmanifest`
- `src/assets/work/` - VectorShield meds, community, watch; LavaRise menu, shop, achievements; Riverstock interior-peak figure

---

## 3. TARGET CONDITION

**Definition of Done:**
A live site and GitHub profile that read as one brand, link every shipped project, navigate well on a phone,
and answer "who is Sam Hutcherson" and "what is half-stache" in sentences a person or an assistant can quote.

**Acceptance Criteria:**
- [x] Sticky compact header marking the current section; back to top; App Store badges; a page per project
- [x] Every page passes the SEO check; sitemap, llms.txt, and llms-full.txt carry the project pages
- [x] Profile README with themed motion, the river piece carrying water temperature
- [ ] Sam reads the new project page copy and says what to cut or correct
- [ ] Profile fields, avatar, and pins set (Sam)
- [ ] Custom domain (Sam sets DNS, then one small PR)

---

## 4. GAP ANALYSIS

```
CURRENT STATE                               →    TARGET STATE
─────────────                                    ────────────
Project page copy published, unreviewed     →    Reviewed by Sam, corrected where needed
Site at half-stache.github.io               →    Site at samhutcherson.com, github.io redirects
Riverstock temperatures: straight line      →    Values from an equilibrium model when it exists
No writing section                          →    Writing with RSS once the first piece exists
```

### Remaining Work
| Gap | Priority | Effort |
|-----|----------|--------|
| Sam reviews the five project pages' new paragraphs | P1 | Low |
| Profile settings and pins (Sam, by hand) | P1 | Low |
| samhutcherson.com: DNS, `public/CNAME`, `site` in `astro.config.mjs`, robots, llms, README raw URLs stay | P2 | Low |
| Repository hygiene across the account, all private | P2 | Med |
| Writing section with RSS; beats under Music; traced mark | P3 | Med |

---

## 5. ROOT CAUSE / LEARNINGS

1. **Astro hoists `export` out of a component's frontmatter.** An exported const that reads `Astro.site` fails the
   build with "siteUrl is not defined" at prerender. Keep such values as plain consts.
2. **Grid children need `min-width: 0`** or an inline SVG with a viewBox can push past the phone width. The
   Riverstock diagram did until `.project__media` got it.
3. **Apple's badge artwork is not fetchable from the container**, so the badge is drawn at Apple's proportions with
   the CC0 Apple mark from simple-icons (installed from npm, which is reachable).
4. **Lazy images below the fold show as empty boxes in full-page captures.** Not a bug; verify with viewport shots.
5. **Riverstock's two temperature sensors are the only measured points**; the doc's monthly table is the honest
   figure for any temperature shown, and the interior must say it is a straight line.
6. **Bump `?v=` on a README media URL when its file changes**; GitHub's image proxy caches by URL.

### Blockers Encountered
| Blocker | Resolution | Status |
|---------|------------|--------|
| GitHub Pages queue held the last deploy for several minutes | Waited; run 29 succeeded | Resolved |
| Remote `seo-geo` branch cannot be deleted through the proxy | Delete from the GitHub UI | Open, cosmetic |

---

## 6. COUNTERMEASURES / ACTION ITEMS

### Immediate Next Steps (P1)
1. [ ] Sam reads /work/vectorshield/, /work/riverstock/, /work/lavarise/, /work/hutchs-rv-park/, /work/elrod-construction/ and sends corrections; apply in `src/data/projects.ts`, then `npm run check:seo`, `npm run publish`, commit, push
2. [ ] Sam sets the profile fields, avatar, and the pin - `docs/github-profile/SETTINGS.md`

### Short-term (P2)
3. [ ] Custom domain once DNS is set (see `docs/HANDOFF.md`, brand plan step 5)
4. [ ] Repository hygiene across the account, all private
5. [ ] Delete the stale `seo-geo` branch on origin from the GitHub UI

### Backlog (P3)
6. [ ] Writing section with RSS; beats under Music; traced mark; Riverstock equilibrium temperature into `scripts/readme-media/riverstock.py`

---

## 7. IMPLEMENTATION NOTES

### Critical File References
| File | Purpose |
|------|---------|
| `docs/HANDOFF.md` | Narrative handoff: rules from Sam, asset sources, publishing, navigation decisions, brand plan |
| `src/data/projects.ts` | Every project fact and sentence, for the home rows and the project pages |
| `src/pages/work/[slug].astro` | The project page template and its structured data |
| `scripts/check-seo.mjs` | Must pass before a publish |
| `scripts/readme-media/README.md` | How to regenerate the profile README media |

### Commands to Remember
```bash
npm run check:seo                                   # build and check every page
NODE_PATH=$(npm root -g) node scripts/og-images.cjs  # after a build, when a project's title, kind, icon, or first shots change
npm run publish && git add -A && git commit -m "Publish" && git push origin main
```

---

## 8. FOLLOW-UP / VERIFICATION

| Check | Command/Action | Expected Result |
|-------|----------------|-----------------|
| Build and checks | `npm run build && npx astro check && npm run check:seo` | all pass |
| Live pages | open / and /work/vectorshield/ and /brand/ | header compacts on scroll, back to top appears, badge under VectorShield |
| Profile | open https://github.com/half-stache | header GIF, two phone loops, river animation with temperature |

### Risks & Watchouts
- The project page paragraphs are new copy in Sam's voice; they are sourced, but he has not read them yet.
- The publish commit is the only commit that should touch the built files at the root.
- Keep each README GIF under about 3 MB and bump `?v=` on change.

---

## QUICK RESUME CHECKLIST

1. [ ] Read this handoff, then `docs/HANDOFF.md`
2. [ ] Run: `npm install && npm run check:seo`
3. [ ] Start with: Sam's corrections to the project pages, then the P1 and P2 items above

---

*A3 Format: Toyota Production System problem-solving methodology*
*Handoff created at: 2026-10-10T15:00:06Z*
