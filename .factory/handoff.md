# Exam Bridge review 3 handoff — FAIL

- Work order: `exam-bridge-review-3`
- Reviewed candidate: `666672cbfff0a8ab5e106a904111e2b3bb882b36`
- Live URL: <https://exam-bridge.sociobot.in/>
- Full report: `.factory/review-3.md`

## Result

The adversarial first-read review is complete. The verdict is **FAIL** with one
reissued blocking finding and three minor findings. No product source, deployed
resource, DNS, billing configuration, or external state was changed.

## Verification completed

- Cold live Chromium checks at 390 × 844 and 1440 × 900
- One-click demo, reset, real-plan isolation, exit, and live offline reload
- Same-origin request log and console/page-error recording
- Metadata, canonical, OG, favicon, 404, deep-link, Back/focus, and internal-link checks
- Mobile dark/reduced-motion and desktop light axe scans on all public routes
- Every one of 19 exact claim commands from a fresh local clone: passed
- Full fresh-clone `npm test`: passed, with 73 Playwright tests passed and one intentional skip
- Production build: passed; `dist/` produced; app JavaScript 10.31 kB gzip

## Findings left for the owner

1. **F-1-1, blocking regression:** the brief says freemium, but no new customer
   can buy the unavailable paid templates.
2. **F-3-1:** `/` and `/demo` hide every header navigation link at phone width.
3. **F-3-2:** three template cards expose the same vague “Try in demo” link.
4. **F-3-3:** the README's license paragraph uses implementation jargon.

## Evidence and reproduction

Review screenshots are in `.factory/review-3-artifacts/`. To reproduce the
repository checks:

```sh
npm ci
npm test
npm run build
```

Run each `test` command in `.factory/claims.json` independently from a fresh
clone to reproduce the claim gate. The report contains exact live quotes,
rewrites, route results, claim results, and the complete earlier-finding recheck.
