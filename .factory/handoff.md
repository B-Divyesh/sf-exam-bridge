# Exam Bridge independent verification handoff — FAIL

- Work order: `exam-bridge-verify-3`
- Candidate: `553f8fb9d4f6b524d3560e12af59b38e5e790acf`
- Live URL: `https://exam-bridge.sociobot.in/`
- Verified: 2026-08-28 06:24 UTC
- Full evidence: `.factory/verification-3.md`

## Result

**FAIL.** Clean install, tests, TypeScript, production build, bundle budgets,
Lighthouse, axe, privacy checks, normal desktop/mobile journeys, fresh-profile
offline reload, and live byte identity all pass. Release is blocked by two High
defects:

1. A valid 80-topic plan accepts topic 81, saves it, then silently disappears
   from the UI on reload because saved-plan validation rejects more than 80.
   This reproduced locally and live (`81 → 0` visible topics).
2. The previous app build and this candidate ship byte-identical `sw.js` with
   cache `exam-bridge-v1` despite changed HTML/JS/CSS. An exact upgrade test from
   `0a9734e` to `553f8fb` saw the new build on an uncached network probe but kept
   serving `0a9734e` after `registration.update()`, normal reload, and offline
   reload.

The researched paid unlock is also incomplete: production and pilot checkout
both return 404. The UI honestly omits the dead buy link and leaves templates
free, so the free planner is usable.

## Verification summary

- `npm ci --ignore-scripts`: 59 packages, 0 vulnerabilities.
- `npm test`: build passed; Vitest 6/6; Playwright 20/20 desktop/mobile.
- `npx tsc --noEmit`, `npm run build`, and production audit: passed. No lint
  command/config exists.
- Build: JS 22,483 B raw / 8,250 B gzip; CSS 15,458 B / 4,240 B; hero 19,704 B;
  no runtime fonts.
- Lighthouse mobile local/live: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.3 s local / 0.9 s live; CLS 0; TBT 0 ms.
- Populated desktop/390 px, both themes, Privacy, and Terms: 0 axe
  serious/critical findings; 0 console/page errors; all audited mobile targets
  ≥44 × 44 px; keyboard focus and reduced motion passed.
- Representative 10-topic planning, ordering, prerequisite editing, practice,
  reload, CSV/JSON export, invalid/valid restore, and reset recovery passed.
- Live files match candidate production hashes exactly on a fresh request.

## Repair and reverify

1. Enforce the 80-topic limit for **Add topic** (and every mutation) or align the
   validator, then test maximum-size edit → save → reload → export.
2. Generate/bump a release-scoped service-worker cache and test upgrade from the
   exact currently deployed build, including offline reload after activation.
3. Keep checkout hidden until the external Sociobot products return a hosted
   checkout instead of 404.

Run gates with:

```sh
npm ci --ignore-scripts
npm test
npx tsc --noEmit
npm audit --omit=dev --audit-level=high
npm run build
```
