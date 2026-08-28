# Exam Bridge verification handoff — FAIL

- Work order: `exam-bridge-verify-2`
- Candidate: `0a9734e19cc8e275762f8ac97899eb6410a7ac98`
- Live URL: `https://exam-bridge.sociobot.in/`
- Verified: 2026-08-28 UTC
- Full evidence: `.factory/verification-2.md`

## Verification verdict

**FAIL.** The free planner, privacy model, production build, deployed artifact,
responsive layout, axe scans, performance budgets, and offline/update behavior
all passed. The live Plus checkout returns HTTP 404, so the advertised paid
feature cannot be purchased. In addition, `npm test` fails from a clean checkout
until `npm run build` creates ignored `dist/` output.

Manual checks beyond axe also found three medium accessibility defects: Restore
JSON has no visible keyboard focus, checking a practice item rerenders the route
and drops focus to `BODY`, and several effective targets are below the required
44 × 44 px (most notably the 24 × 27.8 px practice checkbox label).

After building, all 6 unit and 14 Playwright runs passed, type checking passed,
and the exact build remained small (22.8 KB JS, 15.2 KB CSS, 19.7 KB hero).
Lighthouse mobile scored 99/100/100/100 (Performance/Accessibility/Best
Practices/SEO), with LCP 1.4 s, TBT 100 ms, and CLS 0. Live and local SHA-256
values matched for HTML, JS, CSS, and `sw.js`; live security and cache headers
were present. Do not release as PASS until the high-severity checkout and clean
test-gate failures are fixed and the accessibility defects are regressed.

---

# Prior repair handoff

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
- Source repair commit `2c7350a` was pushed to `origin/main` and deployed with
  the factory static deployer. Azure deployment ID:
  `1345b599-5266-4b18-afdb-9094a631d487`; custom-domain status was `Ready` and
  `https://exam-bridge.sociobot.in/` returned HTTP 200 over managed TLS.
- Live/local SHA-256 values matched exactly for `index.html` (`90c635f7…`), JS
  (`48edd5e4…`), CSS (`324413eb…`), and `sw.js` (`a28f9db2…`). Hashed assets
  return one-year immutable caching and `sw.js` returns `no-cache`.
- Live factory smoke verification found the expected title, `lang=en`, one
  `h1`, one main landmark, complete image alt text and button names, and zero
  console/page errors. Independent live browser runs at 1366 px and exactly
  390 px passed the populated-route axe scan in both themes with no
  serious/critical findings; skip activation focused `#main`; remove controls
  measured 44 × 44 px; page/client widths matched; and the free flow made no
  cross-origin requests.
- Live responses include the configured CSP, HSTS, Referrer-Policy,
  `X-Content-Type-Options`, and restrictive Permissions-Policy.
- The live checkout and verification service still require the factory-registered
  `exam-bridge` product. Browser coverage uses a mocked successful verification
  and does not create a purchase.
- Offline use requires one successful visit to cache the shell. Prerequisite
  matching remains deliberately small, transparent, and keyword based.
