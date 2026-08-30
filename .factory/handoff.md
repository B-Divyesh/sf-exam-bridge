# Exam Bridge verification 9 handoff — PASS

- Verified candidate: `43136b50468bc41b65e180a8bbe736de7eecb7c5`
- Live URL: <https://exam-bridge.sociobot.in/>
- Date: 2026-08-30 UTC
- Detailed evidence: `.factory/verification-9.md`

## Decision

**PASS.** The live static web/PWA deployment matches this candidate exactly.
The repaired 390×844 cold first screen now exposes the audience explanation and
the one-click **Try it with sample data** action before scrolling. All 12
registered claim commands, `npm test`, lint, type check, production build,
audit, live privacy/network checks, offline reload, axe scans, keyboard/mobile
checks, headers, cache policy, and Lighthouse passed.

## Run and verify

```sh
npm ci
npm test
npm run build
```

Open `/demo` or select **Try it with sample data**. It opens an isolated
six-topic route using `demo:exam-bridge:*` browser storage. `Reset demo`
restores it and `Start for real` discards demo-only keys. The final build is in
`dist/`.

## Known non-blocking scope note

Starter templates are free while hosted checkout is unavailable. The product
states this plainly and has no misleading buy or price claim. Add the registered
Sociobot paid-template purchase path and exact price when that future tier is
released.
