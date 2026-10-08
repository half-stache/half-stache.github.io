---
title: VectorShield
category: apps
year: "2024 to 2025"
role: Design, iOS app, Chrome extension, data pipeline
stack: [Swift, SwiftUI, Chrome extension, Tesseract.js, Next.js, Supabase, Python]
status: in-progress
statusNote: Chrome extension at version 1.3; iOS app in development
links:
  - label: vectorshield.app
    url: https://vectorshield.app
summary: Medication and product safety for people with alpha-gal syndrome, personalized to four sensitivity levels.
order: 1
---
## What it is

Alpha-gal syndrome is an allergy to mammalian products, usually triggered by a tick bite. The hard part isn't avoiding steak. It's the gelatin in a capsule, the collagen in a supplement, the stearate in a tablet, and the dairy that some patients tolerate and others don't. VectorShield checks products against a risk-categorized ingredient database and answers for the patient in front of it, not for an average patient.

## The pieces

- **Sensitivity levels.** Four tiers, from "avoid mammalian meat" to "reacts to traces." Every verdict is personalized to the level the user picks.
- **Chrome extension.** Scans product pages on nine retailers (Amazon, Walmart, CVS, Walgreens, Target, iHerb, Vitacost, Costco, and Kroger), highlights trigger ingredients on the page with click-to-jump, and shows a green, yellow, or red badge.
- **Label OCR.** When the ingredients aren't in the page text, the extension reads product photos with Tesseract.js, in the browser, so nothing leaves the device.
- **Context-aware matching.** "Gelatin free," "no gelatin," and "made without gelatin" do not raise an alarm. Negation handling is the difference between a tool people trust and one they uninstall.
- **Crowdsourced reports.** Users can mark a product safe or report a reaction, with points and streaks for contributing. Submissions are opt-in and anonymous.
- **Data pipeline.** Python scripts pull from OpenFDA, DailyMed, RxNorm, and Open Food Facts to build the medication, supplement, and ingredient databases.
- **iOS and watchOS app.** Native Swift, sharing one account with the extension. The repository also carries a pipeline for 3D medication renders exported as USDZ for AR Quick Look.

## The hard part

False positives. An allergy patient who gets a red badge on a product they've safely used for years stops believing the tool. Most of the work went into the ingredient taxonomy, the sensitivity tiers, and the matching rules, not the interface.

## Status

The Chrome extension is at version 1.3. The iOS app is in development.
