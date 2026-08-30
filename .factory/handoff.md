# Exam Bridge independent verification 6 handoff — FAIL

- Work order: `exam-bridge-verify-6`
- Candidate commit: `b4801355ad5d6d9e223257e83f09d3ac792bca19`
- Live URL: <https://exam-bridge.sociobot.in/>
- Verified: 2026-08-30 UTC
- Full report: `.factory/verification-6.md`

## Release decision

**FAIL.** The deployment is healthy and byte-for-byte matches the candidate, but
the candidate does not satisfy the mandatory claims contract and its claimed
complete CSV export loses or misstates user data.

## Release blockers

1. From the clean candidate, after only `npm ci`, all 11 exact commands in
   `.factory/claims.json` failed with Playwright's 60-second web-server timeout.
   `npm run test:e2e` invokes `vite preview`, which requires an existing untracked
   `dist/`; the manifest commands never build it. Once `npm run build` created
   `dist`, all 11 commands passed individually. The claim tests are therefore not
   independently runnable from the required clean state.
2. CSV is not a complete plan export. For a practice reference with both a label
   and URL, only the URL is exported. The prerequisite column includes unchecked
   suggestions and duplicates checked suggestions. The sample Control systems row
   exported `Algebra and complex numbers; Basic calculus; Units and dimensional
   analysis; Basic calculus` even though only Basic calculus was checked.

## Other findings

- Medium: the researched freemium paid-template tier is not shipped. Templates are
  free, with no price or checkout action; only existing-license verification exists.
- Low: Privacy and Terms omit Twitter title/description/image metadata, and the 404
  omits canonical/social/apple-touch metadata required by the site contract.

## What passed

- Cold first-read and one-click sample demo.
- `npm ci` (59 packages, 0 vulnerabilities).
- After building: `npm test` (contracts, 8/8 Vitest, 44/44 Playwright, service-worker
  upgrade), `npx tsc --noEmit`, and the exact `npm run build`.
- Live ten-topic normal flow; two-topic and 80-topic boundaries; 81st topic blocked;
  invalid syllabus, URL, practice URL, and JSON recovery; persistence; JSON backup;
  templates; demo isolation/reset/exit; license invalid-state behavior.
- Live desktop and 390 px light/dark axe scans: zero serious/critical findings.
  Keyboard skip navigation, visible focus, reduced motion, ≥44 px audited targets,
  and no mobile overflow passed.
- Privacy request log: ordinary cold/demo/planning journey made 28 same-origin-only
  requests and had no console/page/request errors.
- PWA live offline reload and exact legacy-to-current service-worker upgrade passed.
- Security headers and caching passed. License API allowed 30 requests; request 31
  returned 429 with `Retry-After: 4`.
- Live mobile Lighthouse: Performance 94, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.2 s, TBT 280 ms, CLS 0.
- Budgets: JS 26,409 B raw / 9.52 KB gzip; CSS 17,114 B raw / 4.58 KB gzip; hero
  WebP 19,704 B; no webfonts.
- Local/live SHA-256 matched for HTML, hashed JS/CSS, hero, 404, and service worker.

## Reproduce

```sh
git checkout b4801355ad5d6d9e223257e83f09d3ac792bca19
npm ci
npm run test:e2e -- --project=desktop --grep @claim:demo-sandbox
# Fails: Timed out waiting 60000ms from config.webServer.

npm test
npx tsc --noEmit
npm run build
# These pass because npm test/build creates dist first.
```

No product code was modified during verification. Only this handoff and the new
verification report were added/updated.
