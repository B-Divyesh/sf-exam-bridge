# Independent verification 9 — PASS

- Work order: `exam-bridge-verify-9`
- Candidate commit: `43136b50468bc41b65e180a8bbe736de7eecb7c5`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2026-08-30 UTC
- Artifact: static web / PWA

## Decision

**PASS.** The live deployment is byte-for-byte aligned with the candidate and
the prior mobile first-screen failure is fixed. The smallest useful product is
fully usable: a returning candidate can make a local syllabus route, set
confidence, attach permitted personal references, recover from bad input,
export, restore, and use the one-click isolated demo.

## First read and demo gate

Cold read of `/`: “Find the shortest path from topic to practice.” It says it
is for returning exam candidates and tells them to click **Try it with sample
data**. That action opens an isolated six-topic GATE ECE route in one click.

At the required cold 390×844 viewport, the audience sentence is at
`y=365.66–487.22` and the 44 px sample action is at `y=561.22–605.22`; both
are entirely visible before scrolling. The action precedes the illustration.
Evidence: [live mobile first screen](verification-artifacts/live-verify9-mobile-390.png).

Desktop (1440×900) likewise shows the action at `y=563.48–607.48`. Cold live
loads had no console or page errors and made only same-origin document, JS,
CSS, and illustration requests.

## Claims gate

From a clean checkout, after `npm ci`, I ran every exact command listed in
`.factory/claims.json` individually, through the production-preview demo entry
point. All 12 passed:

| Claim | Result |
| --- | --- |
| demo-sandbox | PASS |
| local-private | PASS |
| offline-reload | PASS |
| csv-export | PASS |
| json-backup-restore | PASS |
| syllabus-route | PASS |
| templates | PASS |
| account-free-planning | PASS |
| accessible-responsive | PASS |
| topic-cap | PASS |
| license-restore | PASS |
| license-cache-24h | PASS |

`claims.json` exists and its contract check reports 12 registered claims. No
unlisted claim-like copy was found in the landing, README, or legal pages.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 141 packages, 0 vulnerabilities reported |
| `npm test` | PASS — lint, production build, claims contract, 9 unit tests, clean-start claim, 50 Playwright tests, SW upgrade |
| `npm run lint` | PASS |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS — produced `dist/` |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 vulnerabilities |

Final production assets are 27.13 kB JavaScript (9.75 kB gzip), 17.11 kB CSS
(4.58 kB gzip), and a 19.7 kB hero WebP: all applicable budgets pass.

## Independent live product exercise

- Built a normal ten-topic plan, attached an HTTPS personal practice reference,
  reloaded, and confirmed both the 10 topics and reference persisted in only
  `exam-bridge:plan:v1`. No cross-origin planning request occurred.
- The one-topic boundary announced “Add at least two distinct topic lines so
  there is a route to build.” The invalid `ftp://` source recovery announced the
  required HTTP(S) instruction and returned focus to `#source-url`.
- Live demo offline reload worked after service-worker control: `/sw.js`
  controlled the page, six topics rendered after offline reload, and the
  offline message appeared without console errors.
- `verify-url.sh` passed on `/` (621 ms) and `/demo` (685 ms): both had title,
  `lang=en`, exactly one H1, a main landmark, image alternatives, labelled
  buttons, and no console/page errors.

## Privacy, accessibility, headers, and performance

- Complete ordinary planning uses local storage and only same-origin requests.
  The only documented external runtime path is explicit existing-license
  verification; there is no sign-in, tracker, CDN, remote font, analytics, or
  product backend.
- A direct invalid-license allowance check returned HTTP 200 for requests 1–30
  and HTTP **429** with `Retry-After: 4` on request 31. Observed allowance:
  **30 requests per client window**.
- Live axe WCAG A/AA scans found zero violations, including zero serious or
  critical findings, on demo light, demo dark, Privacy, Terms, and the 404 at
  390×844. Keyboard Tab reached the skip link first and Enter moved focus to
  `main`; there was no mobile horizontal overflow or undersized audited target.
  Reduced motion yielded `0.00001s` animation/transition durations.
- Live Lighthouse mobile result: Performance **99**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.1 s, TBT 100 ms,
  CLS 0.
- `/`, `/demo`, `/privacy/`, `/terms/`, legal assets, manifest, robots, and
  sitemap returned 200; an unknown route returned the product 404 with HTTP
  404. HTML has short revalidation caching, content-hashed assets have one-year
  immutable caching, and `sw.js` is `no-cache`. Live headers include CSP with
  header-delivered `frame-ancestors 'none'`, HSTS, referrer policy,
  `X-Content-Type-Options`, and restrictive permissions policy.

## Deployment identity

Fresh live `/` and local `dist/index.html` SHA-256 values both equal
`cef9e896be193ee44b07d5b8a6183be72390e8086029bb750740b2c2bf0d4675`.
Both reference `assets/main-DWKhop44.css` and `assets/main-DzU9WRfF.js`.
The live deployment therefore matches candidate `43136b5`, including its mobile
first-read repair.

## Defects by severity

No release-blocking, high, medium, or low defects found.

## Non-blocking scope note

The researched future freemium tier (paid reusable templates) is not currently
offered: all starter templates are free and copy accurately says hosted checkout
is unavailable. This does not block the brief's free planning job-to-be-done,
and there is no misleading price or checkout claim. Keep this explicitly stated
until the registered Sociobot billing path and exact price are available.
