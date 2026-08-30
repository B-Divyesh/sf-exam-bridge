# Exam Bridge — visual thesis

## Direction: generative geometry as a learning topology

Exam Bridge turns a flat syllabus into a navigable route. Its visual language is a
field of precise points, bridges, and nested rings: syllabus topics are nodes,
prerequisites are connecting spans, and practice questions are square checkpoints.
The geometry is purposeful rather than ornamental—it makes "what should I study
next?" feel visible and finite. The product avoids both institutional exam-portal
blue and the generic gradient/SaaS card grid.

## Palette

The light treatment evokes graph paper in warm desk light; the dark treatment
evokes a late-night study table.

| Token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| Canvas | `#F4F1E8` | `#151A19` | warm paper / charcoal desk |
| Surface | `#FCFAF4` | `#202725` | working sheets |
| Ink | `#17211F` | `#F6F2E7` | primary text |
| Muted | `#52605C` | `#B5C1BC` | secondary text, ≥4.5:1 |
| Line | `#C7CEC6` | `#46524E` | topology edges and dividers |
| Signal | `#C73E2D` | `#FF7A66` | actions, active route |
| Signal ink | `#FFFFFF` | `#171A18` | text on signal |
| Signal on inverse | `#FF8E7D` | `#A52828` | coral route labels on inverted summary surfaces, ≥4.5:1 |
| Route | `#155E63` | `#72D1C8` | mastered/connected state |
| Caution | `#865B0B` | `#F6C967` | developing state |
| Danger | `#A52828` | `#FF8E8E` | validation and failures |

Color is never the only state signal; every confidence state also has a label,
shape treatment, and icon-like marker.

## Type and spacing

- Display: Georgia with a local serif fallback. Its bookish, human texture suits
  returning learners and prevents the tool feeling like a corporate dashboard.
- Interface/body: system sans (`Inter`-compatible platform stack), avoiding a font
  download and keeping the utility fast. Tabular numerals are enabled for counts.
- Scale: 14, 16, 18, 24, 36, 56 px; body is never below 16 px.
- Rhythm: 4 px base; common gaps 8, 12, 16, 24, 32, 48, 72 px. Reading measure is
  capped near 68 characters.

## Layout and interaction grammar

The masthead is quiet and compact. The home screen pairs a concise promise with an
original learning-map image, then leads directly to a numbered three-stage workbench:
1) capture syllabus lines, 2) assess and connect each topic, 3) follow the generated
route. On phones the route summary precedes editing controls once a plan exists;
secondary explanation collapses.

Independent topics are “route segments,” separated by generous space and a vertical
path rather than a generic card grid. Round nodes mean knowledge; square marks mean
practice. Primary controls are clipped-corner lozenges, echoing bridge trusses. All
targets are at least 44 px. Focus uses a high-contrast double outline.

Feedback is immediate and plain: save state is announced; invalid syllabus input
points to the exact fix; destructive reset is confirmed and offers no ambiguous OK.
Offline status is a persistent, non-blocking strip explaining that planning still
works locally while license checks wait.

## Motion

Route segments enter from their preceding node over 180–240 ms; confidence changes
briefly strengthen the connecting line. Only transforms and opacity animate. No
looping motion. Under `prefers-reduced-motion: reduce`, transitions and smooth scroll
are removed and all state changes are instant; hierarchy remains through shape,
weight, and labels.

## Asset plan and provenance

### Hero topology illustration

- Subject: an abstract overhead study map made from connected circular topic nodes,
  square question checkpoints, a single coral route crossing teal prerequisite arcs,
  and subtle graph-paper coordinates.
- World/material: tactile cut paper, graphite, thin enamel wire, tiny translucent
  drafting shapes; warm off-white surface.
- Light/lens: soft directional morning desk light, orthographic/top-down composition,
  restrained shadows.
- Palette words: warm paper, charcoal ink, mineral teal, signal coral, muted brass.
- Negative list: people, hands, books with text, readable text, numbers, logos,
  watermarks, gradients, glossy 3D, neon, interface screenshots, exam authority marks.
- Production prompt: “Top-down editorial still life representing a learning route:
  abstract connected circular topic nodes, small square practice checkpoints, one
  coral path crossing mineral-teal prerequisite arcs, precise geometric composition,
  tactile cut paper and graphite with thin enamel wire and translucent drafting
  shapes on warm ivory graph paper, soft morning desk light, orthographic lens,
  generous negative space, sophisticated restrained palette, no people, no hands,
  no books, no readable text, no numbers, no logos, no watermark, no brands, no
  gradients, no glossy 3D, no interface screenshot.”
- Generator: Azure OpenAI image generation via factory `gen-image.sh`, deployment
  `factory-image`; generated 2026-08-28. Original product asset, reviewed before use.
- Source candidates and generator-created prompt sidecars live in `assets/src/`;
  the reviewed candidate ships as a 20 KB responsive WebP (1200×800), well below
  the 300 KB mobile budget, and is disclosed as generated in the footer. The first
  candidate was retained for provenance but rejected because a ruler contained
  faint number-like artifacts; `learning-topology-clean.png` is the shipped source.
- The social preview is a center crop of the reviewed source at 1200×630. The
  180×180 touch icon is a hand-rendered raster of the repository SVG mark. Both
  derivatives were made locally on 2026-08-30 and introduce no outside source.

All interface icons and geometric marks are authored in CSS/SVG in this repository.
No external stock art, icon library, runtime fonts, or CDN assets are used.
