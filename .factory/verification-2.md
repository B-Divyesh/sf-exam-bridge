# Independent verification 2 — FAIL

- Work order: `exam-bridge-verify-2`
- Candidate commit: `0a9734e19cc8e275762f8ac97899eb6410a7ac98`
- Live URL: `https://exam-bridge.sociobot.in/`
- Verified: 2026-08-28 UTC
- Artifact: static web / PWA

## Decision

**FAIL.** The free planner works end to end and the live files match the
candidate, including the three accessibility repairs from the previous report.
The candidate is not releasable because the advertised production purchase path
is dead and the required `npm test` command fails from a clean checkout. Manual
keyboard and target-size checks also found three accessibility contract defects
that axe does not detect.

## Defects by severity

### High — the advertised Plus purchase cannot be started

The live page links **Buy template unlock** to the contractually correct URL,
`https://api.sociobot.in/api/v1/products/exam-bridge/checkout`, but a fresh GET
returned HTTP 404 and:

```json
{"error":"enabled factory product","status":404}
```

The pilot checkout URL also returned 404. The invalid-license verification
endpoint is healthy (HTTP 200, `valid:false`, `reason:"invalid"`, correct CORS),
so this is specifically a missing/unavailable registered checkout product. A
user is offered a ₹499 one-time purchase but cannot reach hosted checkout.

### High — `npm test` fails from the required clean checkout

Starting at the clean candidate with no ignored `dist/`, `npm ci --ignore-scripts`
succeeded, then `npm test` ran all six Vitest tests successfully but Playwright
failed with:

```text
Error: Timed out waiting 60000ms from config.webServer.
```

`playwright.config.ts` starts `npm run preview`, which requires the ignored
`dist/` directory, but the test command does not build it. This also contradicts
the README's clean-run order (`npm test` before `npm run build`). After running
`npm run build`, the same `npm test` command passed all 6 unit tests and all 14
Playwright runs. The product tests are green against a built artifact, but the
specified standalone quality gate is not.

### Medium — Restore JSON has no visible keyboard focus

On a populated plan, focus **Back up JSON** and press Tab. Focus moves to
`#import-json`, but that input has `opacity: 0`; its visible `.file-button` label
has `outline: none`. The input measured 26 × 46 px and the label 150.1 × 44 px
on desktop. There is no perceivable focus indicator for the focused control.

### Medium — completing practice drops keyboard focus to the document body

Focus the **Mark Q1 complete** checkbox and press Space. The route rerenders and
`document.activeElement` becomes `BODY`, so the next Tab restarts at the page's
first focusable control instead of continuing within the topic. The issue was
reproduced at desktop and 390 px.

### Medium — several interactive targets miss the 44 × 44 px contract

Representative measured effective targets on both desktop and 390 px:

- Practice-completion checkbox label: 24 × 27.8 px.
- Suggested-prerequisite label: full-width but 38 px high.
- Home brand link: 30 px high.
- Footer Privacy and Terms links: 15 px high (Terms is also 38.3 px wide).

The repaired practice-reference remove button is correctly 44 × 44 px. Axe has
no serious/critical findings because its WCAG target rule is less strict than
the factory's explicit 44 px requirement.

## Clean install, static checks, and production build

- Confirmed clean `main` checkout at the exact candidate; `dist/` is ignored and
  not tracked.
- `npm ci --ignore-scripts`: installed 59 packages successfully.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- No lint script or lint configuration exists.
- `npx tsc --noEmit`: passed with no diagnostics.
- Exact `npm run build`: passed and produced `dist/`.
- Post-build `npm test`: 6/6 Vitest tests and 14/14 Playwright desktop/mobile
  runs passed.
- Static-web package/consumer installation does not apply.

Production budgets:

| Asset | Raw | Gzip | Contract |
| --- | ---: | ---: | ---: |
| JavaScript | 22,824 B | 8,353 B | ≤ 200 KB |
| CSS | 15,192 B | 4,210 B | ≤ 50 KB |
| Hero WebP | 19,704 B | 19,750 B | ≤ 300 KB |
| Runtime fonts | 0 B | 0 B | ≤ 120 KB |

Lighthouse 12.8.2 against the local production build, mobile simulated
throttling: Performance 99, Accessibility 100, Best Practices 100, SEO 100;
FCP 1.0 s, LCP 1.4 s, TBT 100 ms, CLS 0, Speed Index 1.0 s, total transfer 35 KiB.

## Product behavior exercised

The independent production-build flow created a representative ten-topic plan,
confirmed curated prerequisite suggestions, changed confidence and route order,
added a custom prerequisite, attached a permitted question ID/link, marked it
attempted, reloaded persisted state, exported non-empty CSV (1,274 B) and JSON
(3,245 B), restored JSON, cancelled and confirmed reset, and used keyboard Enter
to submit the planner.

Boundary and recovery coverage passed:

- 81 unique lines produced the documented 80-topic cap.
- A one-topic/duplicate-only outline showed the specific error and focused the
  syllabus textarea.
- A `javascript:` syllabus-source URL was rejected and focused the URL field.
- A `javascript:` practice link was rejected; replacing it with HTTPS recovered.
- Malformed JSON produced the recovery toast; a valid backup then restored.
- A cancelled destructive reset preserved the plan; confirmation removed it.
- A returned license was stored, stripped from the URL, and not reverified on a
  reload within the one-day cache window; a mocked invalid verdict relocked
  templates while leaving the free planner available.

## Browser, accessibility, privacy, and PWA evidence

- Factory `verify-url.sh` passed locally and live: HTTP 200, expected title,
  `lang=en`, one `h1`, main landmark, complete image alt text and button names,
  and zero console/page errors.
- Independent populated-route axe scans using WCAG 2.0/2.1/2.2 A/AA tags had
  zero violations in light and dark themes at 1366 × 900 and exactly 390 × 844,
  locally and live. Privacy and Terms also had zero violations locally and live.
- At 390 px, `clientWidth === scrollWidth === 390`; visual review found no
  clipping or unintended overlap. The populated remove control is 44 × 44 px.
- Skip-link activation moved focus to `#main`. Its visible focus was a 3 px
  `rgb(7, 95, 170)` outline with 3 px offset.
- With `prefers-reduced-motion: reduce`, topic animation and toast transitions
  computed to 0.01 ms.
- The complete free planning flow made zero cross-origin requests and produced
  zero console/page errors locally and live. Source review found no analytics,
  trackers, CDN scripts, or remote fonts.
- A controlled service-worker update moved cache `exam-bridge-v1` to
  `exam-bridge-v2`, removed v1 after activation, and served the shell offline.
  The actual live deployment also populated v1 and reloaded successfully offline.

## Live deployment and response policies

Local/live SHA-256 values matched exactly:

| File | SHA-256 |
| --- | --- |
| `index.html` | `90c635f79667b759d363f7ce497cd0f38a04f2bf4d6d3ad1c77a3b8e5ac1a90e` |
| `index-BrFJsmUz.js` | `48edd5e4d122f05fb148788b10a4434e382247e45b24aa5d5d73031e046c2879` |
| `index-C1cxW0k_.css` | `324413ebecde660db7c95de7c57bb780d9aaaa838289e0d47675b972c32a03af` |
| `sw.js` | `a28f9db2a2f6b3922f25f83069f5295a2f4d814ef81d90f63eb432e1aca858f3` |

The live root, Privacy, and Terms returned HTTP 200; an unknown path returned
404. Responses include the configured restrictive CSP, HSTS,
`Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options:
nosniff`, and restrictive Permissions-Policy. The root is revalidated after 30
seconds, hashed assets use one-year immutable caching, and `sw.js` uses
`no-cache`.

## Required next steps

1. Register/enable the `exam-bridge` production and pilot billing products and
   prove that checkout redirects to the hosted purchase flow.
2. Make `npm test` build or serve a clean-checkout artifact automatically.
3. Add a visible `:focus-within` treatment for Restore JSON and retain logical
   focus after planner rerenders.
4. Bring all effective click/touch targets to at least 44 × 44 CSS px, then add
   keyboard-focus and geometry regressions beyond axe.
