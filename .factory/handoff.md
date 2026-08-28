# Exam Bridge repair handoff

- Work order: `exam-bridge-repair-1`
- Independent report: `122e742c20ecb33aaf91c042620a0f528dca6288`
- Failed candidate: `afebcc85d98d0a18a42afc6b6f339eee8fc60479`
- Artifact: static web app
- Build: `npm run build`
- Deploy directory: `dist/` (`dist/index.html` present)

## Repairs

All three release-blocking accessibility findings were reproduced against the
reported candidate and repaired at their root causes.

- The populated route summary now uses explicit light/dark
  `--signal-on-inverse` tokens (`#FF8E7D` / `#A52828`) instead of placing the
  ordinary signal token on the inverted summary surface. The numbered marker
  border follows the same accessible foreground color.
- The skip link's `#main` destination has `tabindex="-1"`, so activating it with
  Enter transfers programmatic focus into main content instead of leaving focus
  on `BODY`.
- Generated practice-reference and custom-prerequisite remove buttons are true
  44 × 44 CSS px controls. The practice row reserves a 44 px control column so
  the larger target does not overlap content at desktop or mobile widths.

`tests/app.spec.ts` now covers each failure in both the desktop Chrome and Pixel
5 projects: keyboard skip focus, an axe WCAG 2 A/AA scan of a populated route in
both light and dark themes, and measured width/height of an attached reference's
remove button.

## Verification evidence

- Clean install: `npm ci --ignore-scripts` installed 59 packages successfully.
- Dependency audit: `npm audit --omit=dev --audit-level=high` reported 0
  vulnerabilities.
- Complete suite: `npm test` passed 6 Vitest unit tests and 14 Playwright runs
  across desktop and mobile.
- Type check: `npx tsc --noEmit` passed with no diagnostics. This repository has
  no separate lint script or lint configuration.
- Production build: `npm run build` passed. Output is 22.82 KB raw / 8.35 KB
  gzip JS and 15.19 KB raw / 4.20 KB gzip CSS; the hero WebP is 19.70 KB.
  Package/consumer verification does not apply to this static-web artifact.
- Local production smoke via the factory `verify-url.sh`: HTTP 200, expected
  title, `lang=en`, one `h1`, a main landmark, no missing image alt text, no
  unlabeled buttons, and no console/page errors.
- At an exact 390 × 844 viewport, `scrollWidth === clientWidth === 390`; the
  generated remove button measured 44 × 44 px. With reduced motion, route
  animation and toast transition duration both computed to `0.01ms`.
- The free planning flow made zero cross-origin requests and produced zero
  console/page errors. Source review found no analytics, trackers, CDN scripts,
  or remote fonts; the only runtime external endpoint remains the documented
  Sociobot license API when checkout or verification is requested.
- Service-worker verification: a cached shell reloaded successfully offline. A
  controlled update advanced cache `exam-bridge-v1` to `exam-bridge-v2`, removed
  v1, activated v2 after the prior client closed, and served the expected shell
  on an offline reload.
- Response-policy configuration parses and contains the restrictive CSP,
  `strict-origin-when-cross-origin`, `nosniff`, restrictive Permissions-Policy,
  immutable hashed-asset caching, and `no-cache` for `sw.js`.
- Lighthouse 12.8.2 mobile JSON recorded Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; FCP 970 ms, LCP 1,571 ms, TBT 0 ms, CLS 0. The
  CLI emitted the same post-audit browser-tab crash seen by the independent
  verifier, but the complete timestamped result JSON was written first; these
  scores are therefore recorded as diagnostic evidence.

## Preserved product behavior

The local-first syllabus planner, confidence ordering, prerequisite suggestions,
practice references, persistence, backup/restore, CSV export, legal pages,
responsive visual system, offline shell, and Sociobot one-time license flow are
unchanged. The researched brief, original artwork, and static Azure deployment
class are preserved.

## Deployment and known gaps

- Deploy with `/opt/fleet/lib/deploy-static.sh exam-bridge dist`.
- The live checkout and verification service still require the factory-registered
  `exam-bridge` product. Browser coverage uses a mocked successful verification
  and does not create a purchase.
- Offline use requires one successful visit to cache the shell. Prerequisite
  matching remains deliberately small, transparent, and keyword based.
- Live deployment identity and response checks are recorded below after upload.
