# Exam Bridge independent verification 10 — PASS

Candidate commit `2e2575ef81ec57d4074c3b513576db96b92166b5` at
<https://exam-bridge.sociobot.in/> has passed independent product QA.

- All ten registered demo claim commands passed from a clean `npm ci` install.
- `npm test` passed lint, build, contracts, 9 unit tests, 46 Playwright checks,
  clean claim start, and service-worker update. `npm run build` passed separately.
- Fresh live first read, demo availability, normal and invalid input paths,
  desktop/mobile keyboard checks, reduced motion, request logging, headers,
  caching, bundle budgets, legal pages, 404, and deployed-artifact checks passed.
- Live and local SHA-256 values match for the root and demo HTML, JS, CSS, and
  service worker. The deployed artifact is the tested candidate.
- Defects by severity: none found (release-blocking: 0; high: 0; medium: 0; low: 0).

Exact evidence, commands, and observations are in
[`verification-10.md`](verification-10.md).

## Previous builder handoff

Exam Bridge is deployed at <https://exam-bridge.sociobot.in/>. Every blocking
and minor finding in `.factory/review-1.md`, plus the earlier verification
history, is resolved. The detailed finding map is in `.factory/polish-1.md`.

## What changed

- Replaced the unproved shortest-path headline with the tested study-route job.
- Removed the unavailable freemium, checkout, and legacy license paths. The
  brief and product now describe the complete free planner honestly.
- Added a full `free-access` claim test covering planning, all templates, CSV,
  JSON, accounts, cards, checkout, payment, gating, and network traffic.
- Kept `/demo` and `/?demo=1` as isolated six-topic sample routes with a
  persistent banner, reset, and exit that deletes demo-only storage.
- Standardized Privacy, Terms, and 404 headers, navigation, footers, titles,
  metadata, skip focus, mobile layout, and legal links.
- Rewrote every cited vague or overlong sentence and updated the copy audit.
- Restricted CSP network access to the product origin.
- Updated the catalog description and release version to 1.0.2.

## Exact verification

From a fresh full-history clone of remote `main` at repair commit `92d993d`:

```sh
npm ci
# Every one of the 10 commands in .factory/claims.json passed individually.
npm test
npm run build
npm audit --omit=dev --audit-level=high
```

Results:

- 10/10 exact clean-demo claim commands passed.
- Lint, 9 unit tests, and 46 desktop/mobile browser tests passed.
- Clean-no-`dist` claim startup passed.
- Exact legacy service-worker update and offline reload passed.
- Production dependency audit reported zero vulnerabilities.
- `dist/` contains `index.html`; JS is 24.52 kB raw / 8.84 kB gzip and CSS is
  16.61 kB raw / 4.49 kB gzip.
- Playwright axe integration found zero serious or critical issues on root,
  demo, Privacy, Terms, and 404 in cold live contexts.
- Factory URL checks passed root, demo, and Privacy with correct titles,
  `lang=en`, one H1, main, alt text, named buttons, and no console errors.
- Live Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; FCP 0.9 s, LCP 1.1 s, TBT 30 ms, CLS 0.
- Live 390 × 844 sample action bottom: 625.36 px, visible without scrolling.
- Live demo isolation, reset, exit, `/?demo=1`, and offline reload passed.
- Unknown live routes return the styled 404 with HTTP 404.
- Live root made zero cross-origin requests and logged zero console errors.
- Local/live root SHA-256 matched:
  `a65d16f91859636ac4f8d2e6901a8fa5dc5cb9296003484ccb1abaadba44d802`.

Evidence:

- [Finding map](polish-1.md)
- [Live landing at 390 px](polish-artifacts/live-landing-390-viewport.png)
- [Live demo banner at 390 px](polish-artifacts/live-demo-390-viewport.png)
- [Live legal navigation and focus](polish-artifacts/live-privacy-390-viewport.png)
- [Live Lighthouse JSON](polish-artifacts/lighthouse-live.json)

## Deployment

- Artifact class: static web / PWA; output remains `dist/`.
- Existing resource: `sf-exam-bridge` only.
- Deployment ID: `6e617892-c6a7-492f-8bff-578c9b1d7280`.
- Custom domain returned HTTP 200 immediately after deployment.
- Security headers include CSP, HSTS, referrer policy, content-type protection,
  and restrictive permissions policy.

## Known gaps

None found. No TODO, stub, deferred minor item, paid promise, or unresolved
review finding remains.
