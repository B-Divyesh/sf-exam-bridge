# Independent verification 6 — FAIL

- Work order: `exam-bridge-verify-6`
- Candidate commit: `b4801355ad5d6d9e223257e83f09d3ac792bca19`
- Candidate URL: <https://exam-bridge.sociobot.in/>
- Verified: 2026-08-30 UTC
- Artifact: static web / PWA

## Decision

**FAIL.** The live application is available, matches the candidate build, and its
main planner works. It nevertheless has two independent release blockers:

1. Every exact claim command fails from the required clean-clone starting state.
2. The CSV does not export the complete study route it promises to export. It
   loses question labels when links exist, includes unchecked prerequisite
   suggestions, and duplicates selected suggested prerequisites.

This is not a deployment-only failure. The deployed runtime bytes match a fresh
candidate build.

## First-read gate

**PASS.** In a cold 1440×900 browser profile, the first screen answers all three
questions in plain words:

- What it does: **“Find the shortest path from topic to practice.”**
- Who it is for: **“For returning exam candidates”.**
- What to click: **Try it with sample data**, followed by a note that it opens six
  realistic topics without changing the current plan.

The action takes one click to `/demo`, where six populated GATE ECE topics and the
persistent **“Demo — sample data, nothing is saved”** banner appear. **Reset demo**
restored the sample and **Start for real** removed demo-prefixed storage while
preserving a seeded real-plan marker.

## Findings by severity

### High — all 11 claim commands fail from a clean clone

After confirming a clean worktree at the exact candidate commit, I ran `npm ci`
and then every `test` value from `.factory/claims.json`, individually and before
any build. All 11 exited 1 after Playwright reported:

```text
Error: Timed out waiting 60000ms from config.webServer.
```

Affected claims:

| Claim | Clean result |
| --- | --- |
| `demo-sandbox` | FAIL |
| `local-private` | FAIL |
| `offline-reload` | FAIL |
| `csv-export` | FAIL |
| `json-backup-restore` | FAIL |
| `syllabus-route` | FAIL |
| `templates` | FAIL |
| `account-free-planning` | FAIL |
| `accessible-responsive` | FAIL |
| `topic-cap` | FAIL |
| `license-restore` | FAIL |

The cause is reproducible in the repository configuration. Every manifest command
runs `npm run test:e2e`, whose Playwright server command is `npm run preview`.
Vite preview serves the untracked `dist/` directory, but none of those claim
commands builds it. A clean clone therefore cannot start the test server. The full
`npm test` command masks this because it runs `npm run build` first.

After explicitly building, I reran all 11 manifest commands individually and they
all passed. That confirms the tests and runtime can work, but does not repair the
mandatory clean-clone claim gate. Each claim command must arrange its own demo
entry point from a clean state, for example by using a build-aware Playwright web
server command.

### High — CSV export corrupts the meaning of prerequisite and practice data

The registered claim says **“Exports the complete study route as CSV without
payment.”** Independent live exercises found two forms of loss/corruption:

- A practice reference entered as label `2025 · Q42` plus URL
  `https://example.org/questions/42` renders correctly and survives reload, but
  the CSV contains only the URL. The user-entered question ID/note is lost.
- In the sample `Control systems` topic, **Algebra and complex numbers** and
  **Units and dimensional analysis** are visibly unchecked while **Basic calculus**
  is checked. The exported row is:

```csv
"1","Control systems","new","Algebra and complex numbers; Basic calculus; Units and dimensional analysis; Basic calculus","Add one question after your first review","0"
```

Thus the CSV includes two prerequisites the user did not select and duplicates
the one selected prerequisite. The implementation concatenates every suggestion
with selected prerequisites, and chooses `ref.url || ref.label` instead of
preserving both fields. The claim test checks only the header, row count, a topic,
and a label-only sample reference, so it does not prove completeness.

### Medium — the researched freemium tier is not implemented

The brief calls for paid reusable templates through Sociobot billing. The candidate
instead exposes every template without payment, has no price or purchase action,
and says hosted purchase is still being prepared. Existing-license verification is
implemented and uses the correct Sociobot endpoint, but there is no end-to-end paid
unlock for a new buyer. This does not impair the useful free planner, but it is an
explicit scope gap against the researched monetization contract.

### Low — secondary routes omit required social metadata

`/privacy/` and `/terms/` have titles, descriptions, canonical URLs, Open Graph
metadata, and `twitter:card`, but omit `twitter:title`, `twitter:description`, and
`twitter:image`. The product 404 omits canonical, Open Graph, Twitter, and
apple-touch metadata. This falls short of the supplied site-structure contract.

## Clean local gates

- `npm ci`: PASS, 59 packages installed, 0 vulnerabilities reported.
- Every exact claim command before build: **11/11 FAIL**, as documented above.
- `npm test`: PASS after its built-in build step.
  - contract suite: 11 registered claims
  - Vitest: 8/8 passed
  - Playwright: 44/44 passed across Desktop Chrome and Pixel 5
  - service-worker upgrade: PASS from legacy `553f8fb9` to cache
    `exam-bridge-80c98a512d12c3885452`, including offline reload
- `npx tsc --noEmit`: PASS.
- Exact `npm run build`: PASS; `dist/index.html` exists.
- No lint script or lint configuration is present.
- Static web artifact: package/consumer API and backend persistence/concurrency
  checks are not applicable.

## Independent end-to-end exercise

On the live URL in fresh browser contexts:

- Built a normal ten-topic plan with an HTTPS official-source URL.
- Changing Topic 1 to Ready moved it to the end of the lower-confidence-first
  route.
- Attached an HTTPS personal question reference and confirmed it persisted after
  reload.
- JSON backup contained all ten topics. A malformed JSON restore kept the current
  plan and announced that the file was invalid.
- One topic was rejected with an actionable error and focus returned to the topic
  field. A `javascript:` syllabus URL and practice URL were rejected with explicit
  `http://` or `https://` recovery instructions.
- The lower boundary accepted two topics. Pasting 81 distinct topics produced and
  stored exactly 80 and disabled **Add topic**.
- Demo edits persisted only under `demo:exam-bridge:*`; reset restored the original
  route; leaving demo removed demo keys and retained a seeded real-plan value.

The post-build automated suite corroborated template replacement, attempted-state
editing, focus preservation, legacy over-limit-plan recovery, and mocked valid
license return/storage/URL stripping.

## Privacy, accessibility, PWA, and errors

- A recorded 28-request cold/demo/normal-planner journey made no cross-origin
  requests and logged no console, page, or request errors. Cold load requested only
  the origin HTML, hashed JS/CSS, and hero image.
- License verification occurred only after the explicit **Verify** action and called
  `https://api.sociobot.in/api/v1/products/exam-bridge/verify`. An invalid token
  produced the quiet **License no longer active.** state while the free planner
  remained available.
- Live axe WCAG A/AA scans found zero serious or critical findings in populated
  desktop light/dark and 390×844 light/dark demo states, and on Privacy and Terms.
- At 390 px, `clientWidth === scrollWidth === 390`; all audited visible controls
  were at least 44×44 CSS px. Tab focused **Skip to planner** first and Enter moved
  focus to `main`. Reduced motion lowered topic animation duration to 0.00001 s.
- Factory `verify-url.sh` passed live and local root/demo: correct titles, `lang=en`,
  one H1, main landmark, image alternatives, named buttons, and no console errors.
- A fresh live service-worker context was controlled by `/sw.js`, used cache
  `exam-bridge-80c98a512d12c3885452`, and reloaded `/demo` offline with all six
  topics plus the offline notice.
- Root, demo, Privacy, and Terms returned 200. An unknown route returned the
  product-owned 404. All crawled non-email links returned 200.
- No sign-in exists, so the Entra tenant requirement is not applicable.

## Headers, rate limiting, performance, and identity

Live HTML responses include CSP with header-delivered `frame-ancestors 'none'`,
HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, `nosniff`, and a restrictive
Permissions-Policy. HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS
use one-year immutable caching; `sw.js` uses `no-cache`.

Fresh rate-limit evidence for the only server endpoint showed invalid license
verification requests 1–30 returning 200. Request 31 returned 429 with
`Retry-After: 4`. Observed allowance: **30 requests per client window**.

Live mobile Lighthouse 13.4.1:

| Category/metric | Result |
| --- | ---: |
| Performance | 94 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 1.0 s |
| LCP | 1.2 s |
| TBT | 280 ms |
| CLS | 0 |

Build budgets pass: JavaScript 26,409 B raw / 9.52 KB gzip; CSS 17,114 B raw /
4.58 KB gzip; hero WebP 19,704 B; no webfonts.

The live deployment matches the fresh candidate build exactly:

| File | SHA-256 |
| --- | --- |
| `index.html` | `83d5b23ed47c9ab1c8abc0994d59206dd2e1adb59fc138d989c10125ef763ddb` |
| `assets/index-g-Uu5oJe.js` | `a170d1ea7989ae22bd3b98d4114bd51cdb5c10824eeddf418d65cbfd0d370328` |
| `assets/index-B74SkQKw.css` | `ddace3c1eda6e321216953d3855916cde53441c67ebdb9150a73d754f1bd24b2` |
| `assets/learning-topology.webp` | `2b89e36f3b6404b94b7f87de69906ef6d45668f9a7c13e81190dbcb1f88b3441` |
| `404.html` | `dc1f87414e077df09b076bbbff0a9592051f7e299e21854c2402bb93052035ef` |
| `sw.js` | `95f807e1bb8cd817f3d0e412d7782036a6a87781038e5244950af72115836c1f` |

## Required before PASS

1. Make every `.factory/claims.json` command self-sufficient from a clean clone,
   then prove all 11 pass without a prior build.
2. Export only selected prerequisites without duplicates, and preserve both the
   practice label and URL in CSV. Strengthen `@claim:csv-export` with those cases.
3. Resolve or explicitly rescope the paid-template requirement.
4. Complete secondary-route social metadata.
