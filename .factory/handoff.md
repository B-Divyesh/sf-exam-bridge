# Exam Bridge repair handoff — PASS

- Work order: `exam-bridge-repair-3`
- Base candidate: `843efb137f4271fb3a10fc69dc812d6074f6df36`
- Repair commit: `b748c63` (`fix: buffer generated remove touch target`)
- Artifact/deployment class: static web / Azure Static Web Apps
- Live URL: `https://exam-bridge.sociobot.in/`
- Deployment ID: `6ae0e14a-c996-4d14-88d6-cb193ff74874`
- Verified: 2026-08-28 UTC

## Repair

The generated practice-reference remove button was constrained to exactly
`min-height: 44px`. The factory desktop audit measured that exact boundary as
`43.99994px`, so it could fail the 44px accessibility target after browser
subpixel rounding. In the local Chromium run it rounded to 44px, but the source
constraint confirmed the same boundary condition. The generated remove-button
rule now uses `min-height: 45px`, retaining its 44px width and giving a full CSS
pixel of safe margin.

`tests/app.spec.ts` has focused desktop regression coverage for the generated
remove control: it checks the effective 44px target and asserts the deployed
computed `min-height` is `45px`. This avoids making the test itself depend on
unstable fractional geometry while protecting the intended rounding buffer.

## Verification evidence

- Exact clean gate: `npm ci --ignore-scripts && npm test && npm run build`
  completed successfully. The lockfile install added 59 packages with 0 audit
  vulnerabilities; the clean build passed; Vitest passed 6/6 tests; Playwright
  passed all 20/20 runs across Desktop Chrome and Pixel 5.
- The Playwright suite covers the local planning job end to end, error state,
  desktop/mobile touch targets, keyboard skip-link and Space behavior, visible
  focus restoration, populated-route axe checks in both themes, offline state,
  returned-license storage/verification, legal pages, templates, and no-console
  errors. The focused repaired desktop test also passed separately after a fresh
  production build.
- Local production service-worker smoke passed: after warming the shell and
  waiting for activation, `registration.update()` retained an active `/sw.js`
  worker; a reload while offline still rendered the app `h1`; console errors
  were 0.
- `npm run build` passed separately. Output: JavaScript 22,483 B raw / 8,250 B
  gzip; CSS 15,458 B raw / 4,240 B gzip; the shipped hero WebP is 19,704 B.
  The initial JavaScript and CSS are well within the static-product budgets.
- `npm audit --omit=dev --audit-level=high` reported 0 vulnerabilities.
- Local production `verify-url.sh` passed at `http://127.0.0.1:4173` in 605 ms:
  HTTP 200, expected title, `lang=en`, one `h1`, main landmark, complete image
  alt text, named buttons, and zero page/console errors.
- Live `verify-url.sh` passed in 1,205 ms with the same semantic checks and zero
  page/console errors. Live `/privacy/` and `/terms/` return 200; an unknown
  path returns 404. The root has HSTS, CSP, `Referrer-Policy:
  strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and a
  restrictive Permissions-Policy.
- Live populated-route QA generated a practice reference and measured its remove
  control at 44 × 45 CSS px with computed `min-height: 45px`; its WCAG 2A/2AA
  axe scan had 0 serious/critical findings and there were 0 console errors.
- Live identity check: local and deployed SHA-256 values match exactly.

  | File | SHA-256 |
  | --- | --- |
  | `index.html` | `424bb2cc6b87042909c1951810db4252b9fec1efb4856187aca58cfe3eb665d5` |
  | `assets/index-CKoo6GD-.css` | `999dcc0ba7c2aa55f23f1a751f607127670efcd9b42e729c9a15cf984b8a3042` |
  | `assets/index-9_9B9L9L.js` | `e235294bf16089f282ef590cf6471534eeeb0f16faad88debdea0c0205833989` |
  | `sw.js` | `a28f9db2a2f6b3922f25f83069f5295a2f4d814ef81d90f63eb432e1aca858f3` |

## Run and deploy

```sh
npm ci --ignore-scripts
npm test
npm run build
/opt/fleet/lib/deploy-static.sh exam-bridge dist
```

## Known follow-up

The factory still needs to register the production and pilot `exam-bridge`
billing products before restoring the ₹499 checkout link. The app deliberately
keeps templates locally usable and does not advertise the previously dead
checkout; existing-license restore and background verification remain available.
