# Exam Bridge repair handoff — PASS

- Work order: `exam-bridge-repair-2`
- Verifier report: `.factory/verification-2.md` at `89edec5079cc8eb14df6c198769c01c8e61f0749`
- Repaired commit: `4b3bffd` (`fix: repair clean test and interaction regressions`)
- Live URL: `https://exam-bridge.sociobot.in/`
- Deployment: Azure Static Web Apps, deployment ID `2575235a-4e51-4c0c-96ad-675b0d48a665`
- Verified: 2026-08-28 UTC

## Repairs

- `npm test` now builds before running Vitest and Playwright, so it succeeds
  from a clean checkout with no ignored `dist/` directory.
- Restore JSON retains its native file input but now gives the visible label a
  high-contrast `:focus-within` outline.
- Completing a practice reference captures its topic/reference identity before
  rerendering and restores focus to the replacement checkbox, rather than
  dropping focus to `BODY`.
- All effective shell, route, checkbox-label, Restore, footer, and legal-page
  controls now have 44 × 44 CSS px hit areas. The practice checkbox owns a
  dedicated 44 px label column; suggested prerequisites are 44 px high.
- The billing service still returned the verifier's exact 404 for both the
  production and pilot checkout endpoints. This repository is not authorized to
  register billing products, so the site no longer offers a dead ₹499 purchase:
  reusable templates are temporarily included locally, and existing-license
  restore/verification remains available. README, Privacy, and Terms state this
  plainly. This is a temporary deviation from the brief's freemium monetization,
  made to keep the released product honest and fully usable until the factory
  registers the checkout product.

## Regression coverage

`tests/app.spec.ts` adds desktop and mobile coverage for:

- visible Restore JSON focus;
- keyboard Space on a practice checkbox retaining focus after rerender;
- every rendered effective app target measuring at least 44 × 44 px at exactly
  390 × 844;
- no checkout call-to-action being advertised while templates remain usable;
- returned-license token storage, URL stripping, and verification still working.

## Verification evidence

- Clean install: `npm ci --ignore-scripts` completed successfully (59 packages).
- Complete clean gate: `npm test` built `dist/`, passed 6/6 Vitest tests, and
  passed 20/20 Playwright runs across Desktop Chrome and Pixel 5. The suite
  includes keyboard, populated-route axe, offline-banner, legal-page, returned
  license, and 390 px checks.
- `npx tsc --noEmit` passed; no separate lint configuration exists. `npm audit
  --omit=dev --audit-level=high` reported 0 vulnerabilities. Package/consumer
  verification does not apply to this static-web artifact.
- `npm run build` passed. Output: JS 22,483 B raw / 8,250 B gzip; CSS 15,458 B
  raw / 4,240 B gzip; hero WebP 19,704 B; all within the static budgets.
- Factory `verify-url.sh` passed locally (563 ms) and live (967 ms): HTTP 200,
  expected title, `lang=en`, one `h1`, main landmark, complete image alt text,
  named buttons, and zero console/page errors.
- Pinned Playwright axe scans at 390 px found 0 violations on `/`, `/privacy/`,
  and `/terms/`; the standalone axe CLI was attempted but cannot locate a system
  Chrome in this worker, so it was not used as the authority.
- Live populated-route check at exactly 390 × 844: 0 axe violations, zero
  console errors, `clientWidth === scrollWidth === 390`, and minimum measured
  effective target 44 px.
- Local offline smoke waited for the service worker, reloaded while offline, and
  served the app shell successfully. The free planning flow made zero
  cross-origin requests; no analytics, trackers, CDN scripts, or remote fonts
  are present. Service-worker caching/update behavior is unchanged from the
  verifier-passing candidate.
- Lighthouse 12.8.2 local production mobile: Performance 100, Accessibility
  100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.5 s, TBT 50 ms, CLS 0.
- Live `/`, `/privacy/`, and `/terms/` return 200; an unknown path returns 404.
  Live HTML, JS, CSS, and `sw.js` match local SHA-256 exactly:

  | File | SHA-256 |
  | --- | --- |
  | `index.html` | `3e891bfa2a12b1f398bd33ec92b092061a62a168d175b216c126ad4e0b1cb419` |
  | `index-CdbLYQCq.js` | `e235294bf16089f282ef590cf6471534eeeb0f16faad88debdea0c0205833989` |
  | `index-DAPtgoMW.css` | `5742843fa1ede8b2710a67f488a2134a72b72b5000f1593d677b204c554a3d76` |
  | `sw.js` | `a28f9db2a2f6b3922f25f83069f5295a2f4d814ef81d90f63eb432e1aca858f3` |

- Live root response has CSP, HSTS, `Referrer-Policy:
  strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and the
  restrictive Permissions-Policy. Hashed assets are one-year immutable; `sw.js`
  is `no-cache`.

## Run and deploy

```sh
npm ci --ignore-scripts
npm test
npm run build
/opt/fleet/lib/deploy-static.sh exam-bridge dist
```

## Known follow-up

The factory should register and enable the production and pilot `exam-bridge`
billing products before restoring the ₹499 purchase offer. Reintroduce the
documented Sociobot checkout link only after a fresh GET redirects successfully;
the existing license return, cache, restore, and verification code remains in
place for that work.
