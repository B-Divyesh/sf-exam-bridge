# Exam Bridge polish round 3

- Reviewed candidate: `666672cbfff0a8ab5e106a904111e2b3bb882b36`
- Repair commit: `59fb6081fc8b655c9e6c67eb558a163591107275`
- Live URL: <https://exam-bridge.sociobot.in/>
- Deployment target: product-owned Azure Static Web App `sf-exam-bridge`
- Verified: 2 September 2026 UTC

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — unavailable freemium tier | Removed the unavailable paid gate and its license verification path. The researched scope is now honestly `free`: all three starter templates, CSV, and JSON backups work without an account, card, payment, checkout, or license. No product-owned working purchase path existed, so none is presented. | Clean-clone `@claim:free-access`; source contract rejects product billing endpoints; live [QA report](polish-3-artifacts/live-product-qa.json) created Engineering foundations from its named free action. |
| F-1-2 — unproved shortest-path headline | Retained the tested H1, “Turn a syllabus into a study route.” | Clean-clone `@claim:syllabus-route`; [live root verifier](polish-3-artifacts/live-root/verify.json). |
| F-1-3 — incomplete legal navigation | Retained the shared legal header, four destinations, both footer legal links, route titles, and skip link. | Browser regression `legal pages use route-specific titles, shared navigation, complete footer links, and working skip focus`; live [QA report](polish-3-artifacts/live-product-qa.json). |
| F-1-4 — overlong README sentence | Retained the two short clean-clone instructions. | `.factory/copy-audit.md`; clean-clone claim gate and `npm test`. |
| F-1-5 — cache jargon | Retained the plain explanation of a new offline cache per release. | `@claim:service-worker-renewal` from the clean clone. |
| F-1-6 — decorative landing label | Retained “Study planning for your syllabus.” | Copy audit and [live root screenshot](polish-3-artifacts/live-root/screenshot-mobile.png). |
| F-1-7 — mood label above limits | Retained “Privacy and planning limits.” | Copy audit and [live root screenshot](polish-3-artifacts/live-root/screenshot-desktop.png). |
| F-1-8 — vague privacy and authority slogans | Retained direct browser-storage, official-syllabus, and independence statements. | Clean-clone `@claim:local-private`, `@claim:hosted-content-boundary`, and `@claim:independent-tool`; live QA same-origin request check. |
| F-1-9 — vague Verify label | Removed the obsolete license form together with the unavailable paid tier. | `@claim:free-access`; browser regression `removes the retired purchase and license path`. |
| F-2-1 — route focus missing | Retained route-change focus and polite announcement behavior for Home, Demo, Back, and static routes. | Browser regression `moves focus to the new heading and announces Home → Demo and Back route changes`; live route verifier artifacts. |
| F-2-2 — indirect or inconsistent headings | Retained “Study route order”, “Question references”, and “Choose a starter template.” | Contract gate and live [demo screenshot](polish-3-artifacts/live-demo/screenshot-mobile.png). |
| F-2-3 — unregistered boundary claims | Retained the four observable boundary/provenance claims and their exact tests. | Clean-clone `@claim:starter-template-boundary`, `@claim:hosted-content-boundary`, `@claim:independent-tool`, and `@claim:generated-illustration`. |
| F-3-1 — no mobile main-route navigation | Replaced hidden mobile links with a labelled Menu button, controlled primary navigation, Escape-to-close/focus return, 44 px targets, and a 393 px demo-banner regression check. | Clean-clone `@claim:accessible-responsive`; browser regression `keeps mobile navigation available on every public route`; live [open-menu screenshot](polish-3-artifacts/live-root/mobile-menu-open.png) and [live QA report](polish-3-artifacts/live-product-qa.json). |
| F-3-2 — indistinguishable template actions | Replaced the three “Try in demo” links with “Use Engineering foundations template”, “Use Computer science foundations template”, and “Use Quantitative foundations template.” | Browser regression `offers three free template actions with unique result names`; live QA report records all three names and the resulting Engineering plan. |
| F-3-3 — README license jargon | Removed the inaccessible license flow and replaced its reader-facing section with: “No account, card, checkout, payment, or license is needed.” | README and `.factory/copy-audit.md`; `@claim:free-access`; live product has no license UI or cross-origin verification request. |

## Historical recheck

The prior rounds’ demo isolation, `?demo=1`, offline reload, JSON/CSV export,
topic-cap, stale-worker renewal, 404 plan safety, metadata, title, focus,
contrast, keyboard, reduced-motion, legal, privacy, and mobile-target findings
remain covered by the 16 current exact claims and the full browser suite. No
previous paid-tier wording, checkout link, verification request, or license
storage path remains in the shipped app or CSP.

## Release evidence

- Fresh clone at `59fb608`: `npm ci`, all 16 exact `claims.json` commands, and
  `npm test` passed. The full run included lint, build, 9 unit tests,
  clean-start verification, and 66 Playwright tests.
- Production build: 26.91 kB JavaScript raw / 9.49 kB gzip and 18.21 kB CSS raw
  / 4.77 kB gzip.
- Live `verify-url.sh` passed on `/`, `/demo`, `/privacy/`, and `/terms/` with
  route-specific title, `lang`, one H1, main landmark, image alt text, and zero
  console errors. Evidence: `polish-3-artifacts/live-*/verify.json`.
- Live cold-browser QA passed demo isolation/reset/exit, same-origin requests,
  service-worker offline reload, mobile menu, named templates, and legal nav:
  [report](polish-3-artifacts/live-product-qa.json).
- Live unknown route returned HTTP 404 with the product recovery page:
  [captured response](polish-3-artifacts/live-404.html).
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.5 s, LCP 1.5 s, CLS 0. Report:
  [lighthouse JSON](polish-3-artifacts/lighthouse-live-mobile.json).
