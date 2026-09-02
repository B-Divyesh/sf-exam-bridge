# Exam Bridge copy audit

Audited 2 September 2026 against the rendered landing, demo, legal, and README
copy. Counts treat hyphenated forms and numeric ranges as one word.

## First screen

| Copy | Words | Claim coverage |
| --- | ---: | --- |
| Study planning for your syllabus | 5 | Section label |
| Turn a syllabus into a study route. | 7 | `syllabus-route` |
| For returning exam candidates: turn a syllabus into a route, refresh prerequisites, and connect topics to question references you own. | 20 | Product description |
| Try it with sample data | 5 | `demo-sandbox` |
| Build my route | 3 | Action |
| The sample opens with six realistic topics. | 7 | `demo-sandbox` |
| Your current plan stays unchanged. | 5 | `demo-sandbox` |
| Saved in this browser | 4 | `local-private` |
| Works offline after the first visit | 6 | `offline-reload` |
| Free planner, backups, and exports | 5 | `free-access` |

## Planner, templates, and limits

| Copy | Words | Claim coverage |
| --- | ---: | --- |
| Paste the outline. | 3 | Instruction |
| Rate what you know. | 4 | Instruction |
| Attach only references you’re allowed to use. | 7 | Instruction |
| Your study map stays in this browser. | 7 | `local-private` |
| Paste headings only—one per line. | 5 | Instruction |
| Exam Bridge never uploads this text. | 6 | `local-private` |
| One topic per line; bullets and numbering are fine. | 9 | `syllabus-route` |
| Study route order | 3 | Clear populated-plan heading |
| Question references | 2 | Clear topic-card heading |
| Choose a starter template | 4 | Clear templates heading |
| Start with a reusable plan, then edit it to match your official outline. | 12 | `templates` |
| A reusable starter template—not an official syllabus. | 7 | `starter-template-boundary` |
| Free starter plans | 3 | `free-access` |
| Use any template at no cost | 6 | `templates` |
| Templates stay in this browser and never replace an official syllabus. | 11 | `templates`, `starter-template-boundary` |
| Checkout unavailable | 2 | `checkout-unavailable` |
| No paid offer is available. | 5 | `checkout-unavailable` |
| All current tools are free. | 5 | `free-access` |
| Plans stay in this browser. | 5 | `local-private` |
| Exam Bridge does not host exam questions or coaching notes. | 9 | `hosted-content-boundary` |
| Check the official syllabus before studying. | 6 | Boundary |
| Prerequisite suggestions are only starting points. | 6 | Boundary |
| Exam Bridge is not endorsed by any exam authority. | 9 | `independent-tool` |

## Demo and offline states

| Copy | Words | Claim coverage |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 7 | `demo-sandbox` |
| Changes use separate browser storage and never touch your real plan. | 10 | `demo-sandbox` |
| Reset demo | 2 | Action |
| Start for real | 3 | Action |
| Explore six realistic topics. | 4 | `demo-sandbox` |
| Changes stay in the temporary demo sandbox. | 7 | `demo-sandbox` |
| Its populated workspace is visible immediately on desktop and 390 px screens. | 11 | `demo-sandbox` |
| You’re offline. | 2 | State |
| Planning and exports still work on this device. | 9 | `offline-reload`, `csv-export` |

## Legal pages

| Copy | Words | Result |
| --- | ---: | --- |
| Exam Bridge works without an account and keeps planner content in your browser. | 12 | `free-access`, `local-private` |
| Your plan name, topics, confidence choices, prerequisites, practice references, and theme stay in browser storage. | 15 | `local-private` |
| They are not sent to Exam Bridge. | 7 | `local-private` |
| The demo uses separate keys beginning with demo:exam-bridge:. | 8 | `demo-sandbox` |
| It never reads or changes your real plan. | 8 | `demo-sandbox` |
| The app loads no third-party scripts, fonts, advertisements, behavioral analytics, or checkout services. | 14 | `local-private`, `checkout-unavailable` |
| Planning, templates, exports, and backups use this browser only. | 9 | `local-private`, `free-access` |
| Checkout is unavailable and disabled. | 5 | `checkout-unavailable` |
| The control sends no request. | 5 | `checkout-unavailable` |
| Exam Bridge organizes study plans. | 5 | Plain description |
| It does not guarantee results or represent an exam authority. | 10 | Boundary |
| The planner, templates, CSV exports, and JSON backups are free. | 10 | `free-access` |
| They need no account, card, checkout, or payment. | 8 | `free-access` |
| There is no paid offer. | 5 | `checkout-unavailable` |

## Not-found page

| Copy | Words | Result |
| --- | ---: | --- |
| This route does not exist. | 5 | Error heading |
| Return to the planner or open the sample route. | 9 | Recovery instruction |
| Your saved plan has not changed. | 6 | `not-found-plan-safety` |

## README sentences revised in this round

| Copy | Words | Result |
| --- | ---: | --- |
| Each claim command builds a production preview when needed. | 9 | Clear |
| Run it after a clean npm ci, even when dist is absent. | 11 | Clear |
| Each release gives the offline app a new cache name. | 10 | Clear |
| Returning visitors receive the current version. | 6 | Clear |
| That replacement reloads offline after it is cached. | 8 | `service-worker-renewal` |

## Catalog description

| Copy | Characters | Result |
| --- | ---: | --- |
| Turn a pasted syllabus into a study route with prerequisites and your own question references. | 94 | Verb first; under 120 |

## Result

- Automated extraction checked 461 rendered and README text units across `/`,
  `/demo`, `/privacy/`, `/terms/`, `/404.html`, and `README.md`.
- No sentence exceeds 22 words.
- No banned marketing word appears in visitor copy.
- The first screen names the audience, job, and first action.
- Checkout is visibly unavailable and disabled; no paid tier is promised.
- Every outcome, boundary, and provenance statement maps to a registered claim test.

| Concept | Term used |
| --- | --- |
| User’s saved study structure | plan |
| Ordered study view | route |
| One syllabus item | topic |
| Foundation knowledge | prerequisite |
| User-owned question pointer | question reference |
| Isolated sample environment | demo |
| Reusable editable plan | starter template |
| Portable full-fidelity file | JSON backup |
| Spreadsheet export | CSV |
