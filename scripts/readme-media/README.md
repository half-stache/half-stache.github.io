# Profile README media

Generators for the animated pieces in the half-stache/half-stache profile README. Each writes into an
output directory you pass; copy the results to that repository's `media/` folder and push.

```
npm run build                                   # the hero capture needs dist/
node scripts/readme-media/hero-capture.cjs out  # frames, via a fixed clock so spacing is even
python3 scripts/readme-media/hero-assemble.py out      # out/hero.gif, seamless loop by crossfade
python3 scripts/readme-media/riverstock.py out         # out/riverstock.svg, SMIL, no scripts
python3 scripts/readme-media/phones.py out             # out/vectorshield.gif and out/lavarise.gif
```

The hero capture serves `dist/` itself on port 4321 and needs the global Playwright install
(`NODE_PATH=$(npm root -g)`). Keep each GIF under about 3 MB so GitHub's image proxy serves it.
