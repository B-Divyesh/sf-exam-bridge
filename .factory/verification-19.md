# Independent product verification 19 — PASS

- Work order: `exam-bridge-verify-19`
- Candidate commit: `04d3525996b01ba2ba91bfda6e9d1e0ab74a7c47`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2 September 2026 UTC
- Product: static web planner / PWA

## Decision

**PASS.** The live deployment matches the clean production build from the exact
candidate. It delivers the brief's smallest useful product: a returning exam
candidate can paste a syllabus, receive an editable confidence-ordered route,
attach personal question references, persist it locally, export it, and use a
six-topic demo without touching a real plan. No product code or external
resource was modified during this verification.

## Mandatory checks

### Claims gate — PASS (16/16)

From the clean candidate checkout, after `npm ci`, I ran every exact command in
`.factory/claims.json` through the production-preview demo entry point. The
runner completed all 16 declared claim commands and Playwright recorded a final
`{"status":"passed","failedTests":[]}` result. This covered demo isolation,
404 plan safety, local-only traffic, offline reload, service-worker renewal,
CSV/JSON export and restore, syllabus routing, all templates, content and
authority boundaries, free access, accessibility/responsiveness, and the
2–80-topic cap.

### Cold first read — PASS

In a fresh live browser context the first screen says:

- What it does: **“Turn a syllabus into a study route.”**
- Who it is for: **returning exam candidates** who need prerequisite refreshers
  and their own question references connected to topics.
- First action: **“Try it with sample data.”** The adjacent note says it opens
  six realistic topics without changing the current plan.

At 390 px the audience sentence, action, and three plain facts are visible
without horizontal overflow. One click opens `/demo`, immediately showing six
topics and the persistent **“Demo — sample data, nothing is saved”** banner with
Reset demo and Start for real. Screenshots:
`verification-19-evidence/verify-url/screenshot-mobile.png` and
`verification-19-evidence/live-demo-mobile-390.png`.

## Local quality gates — PASS

- `npm ci` — PASS; 141 packages installed, audit reported 0 vulnerabilities.
- `npm test` — PASS: ESLint, TypeScript production build, contracts, 9 Vitest
  tests, clean-start claim command, and 66 Playwright tests.
- `npm run lint`, `npm run test:unit`, and `npm run build` were also rerun
  separately and passed. `dist/` was produced.
- Production initial assets: JavaScript 26,908 B raw / 9,472 B gzip; CSS
  18,213 B raw / 4,780 B gzip; hero WebP 19,704 B. These are within the static
  product budgets and no runtime font or third-party script ships.

## Independent live exercise — PASS

In a fresh real-plan context:

1. One topic was rejected with the announced, focused recovery message:
   “Add at least two distinct topic lines so there is a route to build.”
2. An invalid syllabus URL was rejected and focus moved to its URL field.
3. A numbered/bulleted outline with a duplicate yielded the expected two-topic
   route after a valid HTTPS source URL was supplied.
4. An invalid practice URL was rejected; an HTTPS reference attached, exported
   in CSV, and persisted after reload.

The 80-topic boundary, topic-81 refusal, JSON backup/restore, route ordering,
demo reset/exit, and template behavior are independently covered by the passed
claim tests.

## Privacy, accessibility, and PWA — PASS

- A complete live cold-load/demo journey made 10 requests, all to
  `https://exam-bridge.sociobot.in`; it produced no console or page errors.
  The real planning journey also remained local, storing only
  `exam-bridge:plan:v1`.
- `verify-url.sh` passed both `/` and `/demo`: route-specific titles,
  `lang="en"`, one H1, a main landmark, complete image alt text, labelled
  controls, and no browser errors. Reports are under
  `verification-19-evidence/verify-url*/verify.json`.
- Fresh Playwright axe WCAG A/AA scans found zero serious or critical findings
  on the live desktop demo and reduced-motion 390 px demo. Keyboard smoke test
  confirmed Skip to planner focuses `main`; mobile Menu opens by keyboard/click.
  The 390 px views are exactly 390 px wide with no overflow.
- The live `/demo` service worker controlled the page. After setting a dedicated
  fresh context offline, the demo reloaded with all six topics and its offline
  banner, without errors.

## Deployment, headers, and server boundary — PASS

- Local and live root HTML were byte-identical. Both referenced
  `assets/main-T2PMoOAU.js`; its SHA-256 was
  `aab012faf4064555746d6ae587faf7f79af45ab2c678f5c4c512d79a73c0746c`
  locally and live.
- `/`, `/demo`, `/privacy/`, and `/terms/` return 200; an unknown route returns
  the designed product 404 with HTTP 404. Checked same-origin links returned
  200. `robots.txt` and `sitemap.xml` are present.
- HTML uses `max-age=30, must-revalidate`; the hashed JS uses
  `max-age=31536000, immutable`; `/sw.js` uses `no-cache`. Headers include HSTS,
  `nosniff`, strict-origin referrer policy, restrictive permissions policy, and
  same-origin CSP with header-delivered `frame-ancestors 'none'`.
- This is a static product with no server-side product API, sign-in, checkout,
  license, or other endpoint. Rate-limit and Entra checks are therefore not
  applicable; no product-unlock call is present.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Evidence

Headers, response bodies, URL-verifier JSON, and screenshots are in
`.factory/verification-19-evidence/`. The standalone axe CLI could not launch
because this container has no system Chrome; the installed Playwright Chromium
axe scans and the repository's Playwright accessibility suite both passed, so
this is an environment limitation rather than a product defect.
