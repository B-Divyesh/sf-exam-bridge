# Exam Bridge repair handoff — ready for deployment

- Work order: `exam-bridge-repair-5`
- Repair base/report commit: `b9362d1b1f487640c0e8310ea1cb19c3c8e21925`
- Failed candidate: `bd51cc13fc216449f632e8acfe1d2ebcd8c08f26`
- Blocking report: `.factory/verification-4.md`
- Artifact/deployment class: static web / Azure Static Web Apps (`dist/`)
- Verified: 2026-08-30 UTC

## Reproduction

The candidate’s existing suite passed before changes: 8 Vitest tests, 24
Playwright runs, and its service-worker upgrade test. The missing acceptance
contracts reproduced separately:

```text
test -f .factory/claims.json  -> exit 1
test -f .factory/demo.md      -> exit 1
Try it with sample data       -> absent from product source
demo: storage namespace       -> absent from product source
404 response override         -> false
```

These results match all three release blockers in `verification-4.md`.

## Repairs

### Testable claims

`.factory/claims.json` now registers 10 visitor-facing claims. Each ID appears
in exactly one `@claim:<id>` Playwright test. `scripts/contracts.test.mjs` fails
if the manifest disappears, an ID is duplicated, a test is missing, or the demo
and 404 policy regress. The tests observe outcomes from the demo entry point:
storage and request isolation, offline reload, CSV contents, JSON restoration,
route ordering, templates, accessibility/responsiveness, the 80-topic boundary,
and existing-license restoration.

### One-click isolated demo

The first screen now names returning exam candidates and offers **Try it with
sample data**. `/demo` and `/?demo=1` open a populated six-topic GATE ECE return
plan. The persistent banner identifies demo mode and provides **Reset demo** and
**Start for real**.

Demo state uses only `demo:exam-bridge:*`. It does not read or write the real
plan, theme, or license keys, and license verification is disabled in demo mode.
Reset recreates the original sample. Leaving for the real planner removes every
demo key. `.factory/demo.md` documents the data and lifecycle.

### Product-owned 404

`public/404.html` uses the product palette and typography, has one H1 and a route
home, and loads no third-party resource. `responseOverrides.404` rewrites unknown
Azure Static Web Apps routes to that file while preserving status 404. `/demo`
has explicit app-shell rewrites. A local CSP meta fallback protects the 404 body;
`frame-ancestors 'none'` remains correctly limited to the response header.

The generated service worker no longer overwrites its cached root with an error
or legal-page navigation response. Its immutable build shell remains the offline
fallback.

## Clean verification

Commands run from the repaired tree:

```sh
npm ci
npm audit --omit=dev --audit-level=high
npm test
npx tsc --noEmit
npm run build
```

Observed results:

- Clean install: 59 packages; 0 vulnerabilities.
- Contract test: 10 claims registered; every tag unique; demo and 404 policy pass.
- Unit tests: 8/8 passed.
- Browser tests: 42/42 passed across Desktop Chrome and Pixel 5.
- Browser coverage includes keyboard-only use, 390×844 layout, 44 px targets,
  light/dark axe scans, reduced motion, privacy requests, demo reset/exit, invalid
  input recovery, downloads, local persistence, and license-response mocking.
- Service-worker upgrade: exact `553f8fb9` legacy worker to final build passed,
  including cache replacement and offline reload. Final cache ID:
  `exam-bridge-eb1c955b2fabaeef8e5e`.
- TypeScript strict check and production build passed. `dist/index.html` exists.
- `verify-url.sh` root: 547 ms, zero console errors, title, `lang=en`, one H1,
  main landmark, all image alts, and all button names passed.
- `verify-url.sh` demo: 595 ms with the same zero-error accessibility result and
  the route-specific title `Demo — Exam Bridge`.
- Playwright axe scans report zero serious or critical WCAG A/AA findings.
- Local mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.90 s, LCP 1.51 s, TBT 0 ms, CLS 0.
- Azure Static Web Apps emulator: `/demo` returned 200; an unknown route returned
  404 with the local `This route does not exist.` page and no third-party assets.
- Package/consumer testing is not applicable to this static-web artifact.

Production artifact sizes:

| Asset | Raw | gzip |
| --- | ---: | ---: |
| JavaScript | 26,409 B | 9,496 B |
| CSS | 17,114 B | 4,592 B |
| Hero WebP | 19,704 B | n/a |

These remain well below the 200 KB JavaScript, 50 KB CSS, and 300 KB hero budgets.

## Deployment and live verification

Pending deployment with:

```sh
/opt/fleet/lib/deploy-static.sh exam-bridge dist
```

After deployment, verify `/`, `/demo`, an unknown route, security/cache headers,
fresh-profile offline reload, same-origin demo traffic, and byte identity against
the local `dist/` files. Record the deployment ID and live hashes here.

## Known gap

The previously documented hosted checkout remains unregistered. Templates stay
available without payment, and the UI makes no checkout or price claim. Existing
license restoration remains available through the Sociobot billing API. No raw
provider key or payment-provider code is present.
