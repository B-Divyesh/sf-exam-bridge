# Independent verification 8 — FAIL

- Work order: `exam-bridge-verify-8`
- Candidate commit: `7c37b18579cbe1b4fffc5692bc12f746ed1e430b`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2026-08-30 UTC
- Artifact: static web / PWA

## Decision

**FAIL.** The deployed application matches the candidate, all 12 registered
claim commands pass, and the planner works end to end. The mandatory cold
first-screen gate fails at the required 390 px mobile width: the first action is
below the initial viewport, so a phone visitor is not told what to click first
without scrolling.

This is a product-layout failure, not a deployment-only failure.

## First-read gate

Desktop at 1440×900 passes. The first viewport says what the product does, names
returning exam candidates, and shows **Try it with sample data** at y=563.

Mobile at 390×844 fails:

- The headline is visible from y=206 to y=292.
- The product illustration occupies y=345 to y=588.
- The audience/explanation begins at y=698 and ends at y=819.
- **Try it with sample data** begins at y=893, 49 CSS pixels below the viewport.
- **Build my route** begins at y=949.

The initial mobile view therefore has no visible first action. Evidence:
[live-cold-mobile-390.png](verification-artifacts/live-cold-mobile-390.png).
The demo itself is one click once the action is reached; it opens six populated
topics and displays the persistent demo/reset/exit banner.

## Findings by severity

### High — mobile first screen hides the required first action

At 390×844, the responsive layout deliberately places the 3:2 illustration
between the headline and the explanation/actions. The sample-data action is
below the fold. This violates the supplied plain-words, demo-sandbox, and
site-structure contracts and the work order's explicit fail condition.

Reproduction:

1. Open the live root URL in a fresh 390×844 browser viewport.
2. Do not scroll.
3. Observe the headline, illustration, and audience sentence.
4. Observe that neither **Try it with sample data** nor **Build my route** is
   visible.

Required fix: put the audience sentence and **Try it with sample data** before
the illustration on mobile, or otherwise fit the required action in the initial
viewport. Add a regression assertion that the action's bounding box intersects
the 390×844 viewport.

### Medium — researched paid-template tier remains deferred

The brief specifies paid reusable planning templates. The candidate makes every
template free, has no price or purchase link, and says hosted checkout is
unavailable. This is honest and the free product remains useful, but it is still
a documented scope deviation from the researched monetization contract.

## Claims gate

The repository started clean at the exact candidate commit. After `npm ci`, every
test command in `.factory/claims.json` was run separately and verbatim before
other product QA.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS — isolated six-topic demo, reset, exit, and real-plan preservation |
| `local-private` | PASS — persisted demo edit and same-origin-only request log |
| `offline-reload` | PASS — dedicated offline context reloaded the demo |
| `csv-export` | PASS — exact header and six complete topic rows |
| `json-backup-restore` | PASS — full plan restored from downloaded bytes |
| `syllabus-route` | PASS — cleaned, deduplicated, confidence-ordered topics |
| `templates` | PASS — editable template in demo-only storage |
| `account-free-planning` | PASS — no account, card, checkout, or cross-origin call |
| `accessible-responsive` | PASS — keyboard, themes, axe, motion, targets, 390 px |
| `topic-cap` | PASS — 80 saved; topic 81 not added |
| `license-restore` | PASS — mocked documented verify response, storage, URL stripping |
| `license-cache-24h` | PASS — one request inside 24 hours, second after 86,400,001 ms |

No unregistered quantitative or privacy promise was found in the landing page,
legal pages, or README. The previous once-per-day promise is now registered and
tested.

## Clean local gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 141 packages, 0 reported vulnerabilities |
| Every exact claim command | PASS — 12/12 |
| `npm test` | PASS — lint, build, contracts, 9 units, clean-start claim, 48 browser tests, SW upgrade |
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS — exact production build produced `dist/` |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 vulnerabilities |
| Factory `verify-url.sh` on `/` | PASS — 200, 703 ms, no errors, required semantics |
| Factory `verify-url.sh` on `/demo` | PASS — 200, 771 ms, no errors, required semantics |

The production build contains 27,125 B JavaScript (9,750 B gzip), 17,114 B CSS
(4,578 B gzip), and a 19,704 B hero WebP. No font files ship. All supplied static
asset budgets pass.

## Independent end-to-end exercise

Fresh live browser contexts produced these results:

- The landing action opened `/demo` in one click. The demo showed six realistic
  topics, preserved a seeded real-plan marker, reset to its original route, and
  deleted all `demo:` keys on **Start for real**.
- A normal ten-topic plan accepted an HTTPS source and saved locally. Confidence,
  prerequisite, question-reference, and completion edits survived reload.
- CSV contained its header plus ten topic rows and preserved the practice label
  and HTTPS link. JSON backup contained all ten topics.
- Malformed JSON announced the recovery message without breaking the plan.
- One topic and two duplicate topic lines were rejected with the required
  two-distinct-topic explanation and focus returned to the syllabus field.
- An `ftp://` official source was rejected with the HTTP(S) recovery instruction
  and focus moved to the source field.
- The exact topic-cap claim independently exercised the 80/81 boundary, backup,
  storage, disabled add control, and reload behavior.
- All internal links returned 200. Privacy and Terms returned 200. A nonexistent
  route returned the product-owned 404 with HTTP 404.

No console errors, page errors, or unexpected request failures occurred.

## Privacy, network, and license allowance

- Cold load requested only the product origin HTML, hashed JavaScript, stylesheet,
  and hero image.
- The complete planning/edit/export/reload/recovery flow made 12 requests and no
  cross-origin request.
- Source inspection found no analytics, advertising, CDN script, remote font,
  WebSocket, beacon, or undisclosed fetch. Planner state uses namespaced
  `localStorage`; the demo uses only `demo:exam-bridge:*`.
- The only runtime external fetch is the documented, explicit existing-license
  verification call to `https://api.sociobot.in/api/v1/products/exam-bridge/verify`.
- Sequential synthetic invalid-license requests returned 200 for requests 1–30.
  Request 31 returned **429** with `Retry-After: 4`. Observed allowance: **30
  requests per client window**.
- No sign-in exists, so the Microsoft Entra External ID check is not applicable.
- There is no product backend or server-side persistence. Library/CLI packaging
  checks are not applicable.

## Accessibility and responsive behavior

- Independent axe WCAG A/AA scans found zero violations, including zero serious
  or critical findings, on demo light/dark, populated planner light/dark, Privacy,
  Terms, and 404 at 390×844.
- At 390 px, the document had no horizontal overflow and every audited visible
  link, button, file control, prerequisite choice, and practice control measured
  at least 44×44 CSS px.
- Keyboard Tab focused **Skip to planner** first. Its focus indicator was a 3 px
  solid `rgb(7, 95, 170)` outline with 3 px offset. Enter focused `main`; no
  keyboard trap was found.
- Reduced motion produced only 0.01 ms transitions/animations.
- At a 195 CSS-pixel viewport, an approximation of 200% zoom from 390 px, all
  controls remained present; the page allowed horizontal panning rather than
  clipping them.
- All audited pages have `lang="en"`, one H1, a main landmark, labelled controls,
  image alternatives, and correctly ordered headings.

The accessibility mechanics pass. The high finding is specifically the mobile
first-read product requirement, which axe does not detect.

## PWA, headers, caching, and performance

- A fresh live context was controlled by `/sw.js` using cache
  `exam-bridge-80eca07279df2283cbb0`. With networking disabled, `/demo` reloaded
  its six topics and offline status with no errors.
- `npm run test:sw-upgrade` passed the exact `553f8fb9` legacy-worker update to
  the candidate and then passed offline reload.
- HTML has CSP with header-delivered `frame-ancestors 'none'`, HSTS,
  `Referrer-Policy`, `X-Content-Type-Options`, and restrictive Permissions-Policy.
- HTML uses `public, must-revalidate, max-age=30`; hashed assets use one-year
  immutable caching; `sw.js` uses `no-cache`.
- Lighthouse 12.6.1 mobile: Performance **96**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 1.0 s, LCP 1.2 s, TBT 220 ms, CLS 0.
- A separate 4× CPU-throttled interaction sample recorded a maximum 56 ms event
  duration, below the 200 ms interaction budget.

## Deployment identity

Fresh local build files and live responses matched byte for byte:

| File | SHA-256 |
| --- | --- |
| `index.html` | `dc01be8ad354de2e902aea4ba799e98994a66e11191c2c66de958e7c6bf02549` |
| `demo/index.html` | `0a0529d7ae403aee26dacb592544157304423112222093a7412f88c600c8eace` |
| `assets/main-bjpb3lAQ.js` | `cbabdea65eb1456d9cf219673cb9f8a9924ba478939a90a5e94ca4a95e0318b8` |
| `assets/main-B74SkQKw.css` | `ddace3c1eda6e321216953d3855916cde53441c67ebdb9150a73d754f1bd24b2` |
| `assets/learning-topology.webp` | `2b89e36f3b6404b94b7f87de69906ef6d45668f9a7c13e81190dbcb1f88b3441` |
| `privacy/index.html` | `62e07527e81142b26055e4e6fd699dd68db1f3b7719b24af3122ef7c40a99918` |
| `terms/index.html` | `09d3fc012aad735ca7cd02c4461ea478248ec7c4e858962071504d98bc34bbd4` |
| `404.html` | `b97ea8c16a54d354a9ffceab2fdfff61f8a3876214f7efed5f9246a727eca39e` |
| `manifest.webmanifest` | `6fa5c8e733f5505af1a94051882771c02ce1587473012e639f77ad2b89f83965` |
| `sw.js` | `3062a0e33bc5dd15c455c78f728777c8b14240f88bb5e415cf31f33a8f0c8764` |

The prior deployment-only concern is resolved: the live site is the candidate.

## Required before PASS

1. Make **Try it with sample data** visible without scrolling at 390×844 and add
   an initial-viewport regression test.
2. Rerun all claim commands, the full quality gate, live mobile first-read, and
   deployment-identity comparison.
3. Keep the deferred paid-template scope explicit until the registered hosted
   purchase path, exact price, and included templates can be delivered.

No product code was modified during this verification.
