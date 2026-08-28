# Independent verification 3 — FAIL

- Work order: `exam-bridge-verify-3`
- Candidate commit: `553f8fb9d4f6b524d3560e12af59b38e5e790acf`
- Candidate branch: `main`
- Live URL: `https://exam-bridge.sociobot.in/`
- Verified: 2026-08-28 06:24 UTC
- Artifact: static web / PWA

## Decision

**FAIL.** The normal planner journey works, all repository gates pass from a
clean candidate checkout, the first-load live files match the production build,
and accessibility/performance/privacy checks are strong. Two independently
reproduced persistence/update defects prevent release:

1. A user can create a documented-maximum 80-topic plan, add one topic, and then
   lose access to the entire plan on reload.
2. An already-installed PWA can remain on an older release after this candidate
   is deployed because the changed shell and the prior release use the same
   service worker and cache identity.

The earlier deployment-only billing issue also remains externally unresolved:
both production and pilot checkout endpoints return 404. The candidate no longer
advertises that dead path and keeps templates free, so it does not break the free
planner, but the researched freemium purchase path is not shipped.

## Defects by severity

### High — adding topic 81 silently makes the complete saved plan unloadable

The setup form advertises and accepts 2–80 topics. Starting with exactly 80
topics succeeds. **Add topic** then accepts an 81st topic without enforcing the
same limit and stores all 81 records. On reload, `isPlan()` rejects any saved
plan with more than 80 topics; `loadPlan()` silently returns `null`, and the app
shows the empty setup screen with zero topics. The inaccessible 81-topic JSON is
left in local storage, but the UI provides no warning or route to export/recover
it.

Fresh reproduction on both the candidate production build and live deployment:

| Step | Local | Live |
| --- | ---: | ---: |
| Topics after valid maximum import | 80 | 80 |
| Topics after **Add topic** → “Topic 81” | 81 | 81 |
| Topics in `exam-bridge:plan:v1` | 81 | 81 |
| Topics visible after reload | 0 | 0 |
| Empty setup form visible after reload | Yes | Yes |

This is a boundary-triggered total plan availability failure, not merely a
misstated counter. Enforce the cap before mutation (or support the larger shape)
and add a regression proving a maximum-size plan remains loadable after every
editing action.

### High — unchanged service worker strands returning users on the prior app

The service worker cache is hard-coded as `exam-bridge-v1`, serves cached
navigations before the network, and is byte-identical between candidate
`0a9734e` and this candidate:

```text
a28f9db2a2f6b3922f25f83069f5295a2f4d814ef81d90f63eb432e1aca858f3  sw.js
```

The actual application artifacts did change between those releases:

| Artifact | `0a9734e` | `553f8fb` |
| --- | --- | --- |
| `index.html` SHA-256 | `90c635f7…a90e` | `424bb2cc…65d5` |
| JavaScript SHA-256 | `48edd5e4…1879` | `e235294b…3989` |
| CSS SHA-256 | `324413eb…03af` | `999dcc0b…3042` |

An exact two-build upgrade harness first installed the production build from
`0a9734e`, then switched the origin to `553f8fb` and called
`registration.update()`. An uncached network probe returned `candidate-553f8fb`,
but normal reload and offline reload both remained on `candidate-0a9734e`; the
only cache was still `exam-bridge-v1`. Because `sw.js` is unchanged, no new
install event refreshes the cached root. A returning user can therefore miss
the candidate's repairs indefinitely until site data is cleared.

Version the shell/cache on every application release or generate a build-scoped
worker, and test an actual old-build-to-new-build upgrade—not only registration
and offline smoke on a fresh profile.

### Medium — researched paid unlock remains unavailable

- No buy link or price is shown; templates are deliberately free while checkout
  is “prepared.” This is honest and avoids a broken user-facing action.
- Fresh GETs to both
  `https://api.sociobot.in/api/v1/products/exam-bridge/checkout` and the pilot
  equivalent returned HTTP 404.
- The production verify endpoint is healthy: an invalid token returned HTTP 200,
  `{valid:false, reason:"invalid"}`, `Cache-Control: no-store`, and the correct
  CORS origin.

This is an external registration/deployment gap rather than a reason to restore
the dead link, but the brief's paid reusable-template offer and paid-unlock copy
contract (price, one-time purchase, hosted checkout) are not complete.

## Clean checkout, install, tests, and build

Verification ran from detached clean worktree
`/tmp/exam-bridge-verify-3` at the exact candidate.

- Node `v22.23.2`; npm `10.9.8`.
- `npm ci --ignore-scripts`: installed 59 packages; 0 vulnerabilities.
- Exact `npm test`: passed. It ran the production build, 6/6 Vitest tests, and
  20/20 Playwright runs across Desktop Chrome and Pixel 5.
- `npx tsc --noEmit`: passed with no diagnostics.
- No lint script or lint configuration exists in the repository.
- Independent exact `npm run build`: passed and produced `dist/`.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- Library/CLI consumer-pack testing: not applicable to this static web product.
- Backend concurrency, persistence service, and health identity checks: not
  applicable; browser local storage is the persistence boundary.

Production asset budgets:

| Asset | Raw | Gzip | Contract |
| --- | ---: | ---: | ---: |
| JavaScript | 22,483 B | 8,250 B | ≤ 200 KB |
| CSS | 15,458 B | 4,240 B | ≤ 50 KB |
| Hero WebP | 19,704 B | 19,750 B | ≤ 300 KB |
| Runtime fonts | 0 B | 0 B | ≤ 120 KB |

## End-to-end product evidence

The independent production-build journey created a representative ten-topic
return plan spanning mathematics, signals, controls, probability, algorithms,
databases, thermodynamics, economics, language, and aptitude. It verified
topic-wording prerequisite suggestions, confidence-based reordering, a custom
prerequisite, a permitted personal question ID, local persistence, and practice
completion.

- CSV export downloaded 1,163 B with ordered topics, prerequisites, and practice
  reference data.
- JSON backup downloaded 3,103 B and restored successfully.
- Malformed JSON produced the recovery message without replacing the active
  plan; a valid backup then restored.
- Cancelled reset preserved all ten topics; confirmed reset removed the plan.
- Duplicate/one-topic input produced the specific “at least two distinct” error
  and focused the syllabus field.
- A `javascript:` syllabus source and practice link were rejected; replacing
  each with HTTPS recovered normally.
- The normal two-topic journey was repeated against the live URL, persisted
  through reload, and made zero cross-origin requests.
- A mocked valid returned license was saved under
  `sb_license:exam-bridge`, stripped from the URL, and verified only once across
  reload within the one-day cache window.
- A real invalid license against production returned 200, was stripped from the
  URL, showed the inactive notice, and left the free template usable.

## Accessibility, responsive behavior, and visual review

- Factory `verify-url.sh` passed locally in 919 ms and live in 901 ms: HTTP 200,
  correct title, `lang=en`, one `h1`, a main landmark, complete image alt text,
  named buttons, and zero console/page errors.
- Independent populated-route axe scans with WCAG 2.0/2.1/2.2 A/AA tags found
  0 serious/critical violations locally and live. Local light and dark themes at
  exactly 390 × 844 also found 0; Privacy and Terms found 0 locally and live.
- At 390 px, `clientWidth === scrollWidth === 390`; every visible audited link,
  button, file control, prerequisite label, and practice checkbox target was at
  least 44 × 44 CSS px. No clipping or overlap was observed in screenshots.
- Keyboard-only use passed: first Tab exposed the skip link at 153.4 × 48.8 px
  with a 3 px solid `rgb(7, 95, 170)` focus outline; Enter focused `main`; Tab,
  typing, and Enter built a two-topic plan. Restore JSON showed the same 3 px
  visible focus treatment. Practice completion retained focus after rerender.
- With `prefers-reduced-motion: reduce`, topic animation and toast transition
  were `0.01 ms` and root scrolling computed to `auto`.
- Visual review at 1366 × 900 and populated 390 × 844 found the product-specific
  topology design intact and the primary route/build actions clear.
- Across these journeys there were zero console errors and zero page errors.

## Privacy, outbound requests, and browser policy

- Source review found no analytics, trackers, advertisements, CDN scripts,
  remote fonts, cookies, `sendBeacon`, WebSockets, or unrelated fetches.
- The normal local and live planner flows made no cross-origin requests. Plan,
  theme, and license state use local storage; only explicit/background license
  verification calls the documented Sociobot API.
- No user-entered syllabus, topic, confidence, prerequisite, or practice data
  was observed leaving the origin.
- Privacy and Terms are reachable at HTTP 200 and accurately describe local
  storage, license verification, hosting logs, independent status, copyrighted
  content restrictions, and the lack of pass guarantees.
- The live root supplies HSTS, CSP (`default-src 'self'`, restricted connect and
  form origins, `object-src 'none'`, `frame-ancestors 'none'`),
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Content-Type-Options: nosniff`, and a restrictive Permissions-Policy.
- Root/HTML uses `public, must-revalidate, max-age=30`; hashed assets use
  one-year `immutable`; `sw.js` uses `no-cache`. An unknown path returned 404.

## Performance

Lighthouse 12.8.2, mobile simulated throttling:

| Target | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Local production | 100 | 100 | 100 | 100 | 1.0 s | 1.3 s | 0 ms | 0 | 33 KiB |
| Live | 100 | 100 | 100 | 100 | 0.9 s | 0.9 s | 0 ms | 0 | 33 KiB |

The lab result has no INP sample; TBT is 0 ms and no long interaction delay was
observed during planning.

## Live deployment identity

The live first-load files match the candidate production build byte-for-byte:

| File | SHA-256 |
| --- | --- |
| `index.html` | `424bb2cc6b87042909c1951810db4252b9fec1efb4856187aca58cfe3eb665d5` |
| `assets/index-CKoo6GD-.css` | `999dcc0ba7c2aa55f23f1a751f607127670efcd9b42e729c9a15cf984b8a3042` |
| `assets/index-9_9B9L9L.js` | `e235294bf16089f282ef590cf6471534eeeb0f16faad88debdea0c0205833989` |
| `assets/learning-topology.webp` | `2b89e36f3b6404b94b7f87de69906ef6d45668f9a7c13e81190dbcb1f88b3441` |
| `sw.js` | `a28f9db2a2f6b3922f25f83069f5295a2f4d814ef81d90f63eb432e1aca858f3` |

Fresh-profile live service-worker registration, `registration.update()`, and
offline reload succeeded with an active controller and cache
`exam-bridge-v1`. That smoke result does not mitigate the proven old-to-new
upgrade failure above.

## Required before PASS

1. Prevent every editing/import path from creating an unloadable plan; add
   maximum-boundary save/reload coverage.
2. Make the service-worker/cache version release-specific and prove an exact
   prior-build-to-repaired-build online update followed by offline reload.
3. Register/enable the production and pilot billing products before re-enabling
   the researched paid purchase path.
