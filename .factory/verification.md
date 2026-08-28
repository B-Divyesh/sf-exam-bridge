# Independent verification — FAIL

- Work order: `exam-bridge-verify-1`
- Candidate commit: `afebcc85d98d0a18a42afc6b6f339eee8fc60479`
- Live URL checked: `https://exam-bridge.sociobot.in/`
- Verified: 2026-08-28

## Decision

**FAIL.** The core planner works, but the candidate fails the required axe
serious/critical accessibility gate after a user creates a plan.

## Blocking defects

### High — populated route has an axe serious contrast failure

Reproduction on both the production deployment and the local production build:

1. Load `/`, paste `Signals and systems` and `Control systems`, and choose
   **Map my syllabus**.
2. Run axe WCAG 2 A/AA against the generated route.

`color-contrast` is **serious** for
`.route-overview > div > .eyebrow`: foreground `#c73e2d` over `#17211f` is
3.26:1 at 13 px bold; axe requires 4.5:1. The empty state has no
serious/critical axe findings, which is why this is easy to miss.

### Medium — skip link does not move keyboard focus into main content

The link changes the URL to `#main`, but `main` is not focusable. In Chromium,
after focusing the skip link and pressing Enter, `document.activeElement` is
`BODY`, not `#main`. Keyboard users are not placed at the planner and the next
Tab starts the document sequence again.

### Medium — generated practice-reference remove control is 32 x 32 CSS px

After attaching a reference, the remove button measures 32 x 32 CSS px on the
desktop and mobile layout. This misses the 44 x 44 px touch-target requirement.

## Checks that passed

- Clean detached clone at the candidate, `npm ci --ignore-scripts`: passed;
  `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- `npm test`: passed — 6 Vitest tests and 10 Playwright tests (desktop and
  Pixel 5). No repository lint script exists. `npm run build` passed, including
  `tsc --noEmit`; `dist/` was produced.
- Production bundle: JS 22,810 B raw / 8,350 B gzip; CSS 15,057 B raw / 4,160 B
  gzip; hero WebP 19,704 B. All are below the specified budgets.
- Independent end-to-end flow: created a 10-topic plan, changed confidence,
  attached and completed a permitted question reference, exported CSV, and
  verified persistence through reload. Keyboard Enter submitted the map form;
  the visible focus style measured as a 3 px `#075faa` outline with 3 px offset.
- Boundaries/recovery: 81 pasted lines yielded 80 topics; one or duplicate
  topic produced the stated route error and focused the textarea; `javascript:`
  source URL was rejected and focused the source field; malformed JSON restore
  showed its recovery message; confirmed reset returned to setup.
- Layout/motion: at 390 px `scrollWidth === clientWidth === 390`; route cards
  stack correctly. With reduced motion, route animation and transition duration
  computed to `0.01ms`.
- PWA: a controlled service-worker update simulation advanced from v1 to v2;
  the v2 worker was active and both online and offline reload returned the v2
  shell. Offline reload after first cached visit works.
- Privacy/network: free planning made no external requests and generated no
  console/page errors. Source audit found no analytics, CDN scripts, fonts, or
  trackers; the only runtime external endpoint is the documented Sociobot
  license-verification API when a license is supplied.
- Live deployment matches the candidate exactly: SHA-256 matched for
  `index.html` (`1b6b4040…`), JS (`df19fa6a…`), CSS (`36ed204b…`), and `sw.js`
  (`a28f9db2…`). Live root status was 200 with the expected title, `lang=en`,
  one `h1`, one `main`, image alt text, no console/page errors, and no outbound
  requests on the free path.
- Live headers include CSP, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Content-Type-Options: nosniff`, and restrictive Permissions-Policy.
  Hashed assets use `public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- Local Lighthouse initial-load diagnostic: Performance 99, Accessibility 100,
  Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.5 s, TBT 130 ms, CLS 0. The
  Lighthouse process also emitted a post-audit browser-tab crash warning, so
  these figures are informational rather than a clean gate result.

## Required next step

Fix the three accessibility defects, add regression coverage for axe after a
route is generated (not only the empty state), then rerun this verification.
