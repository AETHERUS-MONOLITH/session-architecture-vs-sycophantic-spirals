# Session Architecture vs. Sycophantic Spirals: documentation website

Design documentation of the AISC 12 project "Session Architecture vs. Sycophantic Spirals", published as a static website. The site presents the Session Architecture Grid (frozen live version 1794606123-2939 of 13 Nov 2026) in topical pages plus a complete single-page view. It documents a planned study and reports no results.

The site is independent of the Claude interface: no page links to claude.ai, and the site makes no external runtime requests (fonts are self-hosted).

Planned public URL (after publication approval): `https://aetherus-monolith.github.io/session-architecture-vs-sycophantic-spirals/`

## Status

Gate 2: implementation pull request. Not published. GitHub Pages is not enabled. See "Deployment" for the steps that publication needs.

## Routes

The topical routes are the primary navigation. `/full/` is the secondary single-page view and the direct successor of the former artifact link.

| Route | Content (source sections) | Anchors |
|---|---|---|
| `/` | Header and version note (S00), section index, tasks and outcomes (S14), reference model (footer paragraph) | `#top`, `#tasks-outcomes`, `#reference-model` |
| `/full/` | Everything (S00 to S14 and the footer paragraph) in the original order and grouping, interactive | the original `#runs`, `#status`, `#stopping-rule`, `#scoring`, `#costs`, `#open`, `#changes`, plus `#grid`, `#conditions`, `#hypotheses`, `#handoff`, `#artifacts`, `#instance-state`, `#error-path`, `#tasks-outcomes` |
| `/grid/` | Factorial grid (S01), condition key (S02), run timelines (S03), interactive | `#grid`, `#conditions`, `#runs` |
| `/hypotheses/` | Hypotheses and contrasts (S04) | `#hypotheses`, `#h1` `#h2` `#h3` `#h5` `#h4` `#k1` `#k2` `#c2-c1` `#ref` `#test` |
| `/handoffs/` | One handoff, step by step (S05 without the status table) | `#handoff` |
| `/scoring/` | Scoring and judge release (S07) | `#scoring` |
| `/stopping-rule/` | Stopping rule (S06) | `#stopping-rule`, `#firing`, `#reported`, `#evaluation-plan`, `#fresh-context-review`, `#limits` |
| `/costs/` | Costs (S08), 3 Nov reference and 12 Nov update as in the source | `#costs` |
| `/decisions/` | Status of design details (S05 status table) and open specifications (S09) | `#status`, `#open` |
| `/operations/` | Artifacts (S10), instance state (S11), error path (S12) | `#artifacts`, `#instance-state`, `#error-path` |
| `/changelog/` | Methodological change log (S13), versions, website changes | `#changes`, `#versions`, `#site-changes` |

Links in the project document point to `/full/` (L1), `/stopping-rule/` (L2), `/costs/` (L3) and `/scoring/` (L4).

## UI architecture

- **Static site generator:** [Astro](https://astro.build) with TypeScript, fully static output, no client framework.
- **Content is separate from presentation.** `content/fragments/*.html` are DOM subtrees copied from the frozen source by `tools/extract-fragments.mjs`. Text nodes are never retyped. The only changes are attribute additions (anchor ids, accessible-name references, `tabindex` on scroll containers, `role="group"` on the grid container), each listed in `content/fragments/manifest.json`. Pages in `src/pages/` compose fragments; a topical page and `/full/` render the same fragment file, so they cannot drift apart.
- **Site chrome** (navigation labels, page titles, status banner, footer, the version and website-change lists) is the only text not taken from the source. All of it is in `content/chrome.yml`; the parity check allows no other text.
- **Interactivity:** `src/lib/timeline.ts` is a pure model of the source script's `buildTrack()` and `render()`, `src/lib/render.ts` turns it into the same DOM, and `src/lib/controller.ts` wires the 26 grid buttons and the 4 length buttons. The constants (BUDGET 40, GATE 1.6, CONDS, CORE, LABEL, default state) are evaluated out of the source script into `content/conditions.json`. A golden test compares the output with the original script for all 8 conditions × 4 lengths.
- **Enhancements without content change:** URL state `?c=&n=` on `/grid/` and `/full/` (default: length 10, nothing selected, as in the source); `aria-pressed` on grid cells; no smooth scrolling under `prefers-reduced-motion: reduce`; skip link; contrast of the dashed extension style raised to WCAG 2.1 AA.
- **Theme:** follows `prefers-color-scheme` with the source's light and dark tokens and `data-theme` hooks. Styles: `src/styles/source.css` (verbatim source stylesheet) and `src/styles/site.css` (chrome, layout, accessibility overrides).
- **Fonts:** Newsreader, IBM Plex Sans and IBM Plex Mono, self-hosted in `public/fonts/` from the `@fontsource` npm packages (`tools/vendor-fonts.mjs`). Their SIL Open Font License texts sit next to the fonts as a third-party notice.

## Repository layout

```
archive/        original HTML (byte-identical), frozen HTML, 3 Nov PDFs, MANIFEST.json   (never edited)
content/        fragments/, conditions.json, chrome.yml, source_inventory.json, mapping.csv,
                inventory-addendum.json, approved-diffs.json                              (content source)
docs/provenance/ SOURCE_INVENTORY(.md, _TABLE.md), APPROVED_DIFFS.md, VERSION_LOG.md       (Gate 1 records)
src/            lib/ (timeline, render, controller, content, url), layouts/, components/, pages/, styles/
public/         fonts/ (with OFL notices), favicon.svg
tools/          inventory.py, mapping.py, extract-fragments.mjs, vendor-fonts.mjs, original-golden.mjs,
                check-source.mjs, parity.mjs, parity-mutation.mjs, linkcheck.mjs, contrast.mjs, smoke.mjs
tests/          unit/ (Vitest), e2e/ (Playwright), fixtures/original-lanes/ (output of the original script)
evidence/gate2/ parity report, test output, screenshots for the Gate 2 review
.github/workflows/ ci.yml (every PR), deploy.yml (manual or v* tag only)
```

## Build and run locally

Requirements: Node.js 22.23.4 or later, Python 3 with `beautifulsoup4` (only for the inventory check).

```sh
npm ci
pip install -r tools/requirements.txt
npm run dev        # http://localhost:4321/session-architecture-vs-sycophantic-spirals/
npm run build      # static output in dist/
npm run preview    # serves dist/ with the same base path
```

### Base path

The site is served under a project path on GitHub Pages. `astro.config.mjs` reads the base from `SITE_BASE` (default `/session-architecture-vs-sycophantic-spirals/`) and the origin from `SITE_URL` (default `https://aetherus-monolith.github.io`). Every internal URL goes through `src/lib/url.ts`; in-page links of the source (`#scoring`, `#costs`, `#stopping-rule`, `#changes`) are rewritten to route targets on topical pages and kept as in-page links on `/full/`. `npm run test:base` builds under `/alt-base/` and runs the parity and link checks on that build. The deploy workflow takes the base path from `actions/configure-pages`.

## Tests

`npm test` runs everything that CI runs. The checks map to the test matrix of the Gate 1 plan (section 7):

| Command | Checks |
|---|---|
| `npm run check:source` | archive hashes against `archive/MANIFEST.json`; `tools/inventory.py` reproduces `content/source_inventory.json`; Gate 1 records unchanged; fragments re-extract identically and equal the source subtrees node by node except the documented attribute additions |
| `npm run test:unit` | B1 to B10 on the timeline model; B11 golden comparison with the original script (8 × 4 states, 26 grid buttons, click sequences); URL state |
| `npm run test:parity` | A1 to A6: all 375 inventory items (plus 1 addendum item) on their mapped route and on `/full/`, inside their anchors, with identical text; table rows; status-label multisets; no text outside fragments and chrome; change log order; then a negative control that must detect 8 content mutations |
| `npm run test:links` | D2 to D4: anchors, internal links and fragments, no `claude.ai` in any `href`/`src`, no external runtime requests, served PDFs identical to the archive |
| `npm run test:contrast` | token contrast, WCAG 2.1 AA, light and dark |
| `npm run test:base` | the same checks on a build under another base path |
| `npm run test:e2e` | Playwright, Chromium and WebKit, desktop 1440×900 and mobile 390×844: routes and anchors (D1, D2), grid and length buttons (C1, C2), keyboard (C3), mobile layout and tap targets (C4), dark theme (C5), reduced motion (C6), axe-core with 0 serious or critical violations in both themes (C7), 0 console errors or warnings (C8) |
| `npm run screenshots` | screenshots of section 7 E into `evidence/gate2/screenshots/` |

For a local Chromium that Playwright did not download, set `PW_CHROMIUM_PATH=/path/to/chrome` and `E2E_BROWSERS=chromium`.

## Deployment

Publication needs the operator's approval (Gate 4). Until then nothing is deployed.

1. Enable Pages once: repository Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. Deploy: run the workflow "Deploy to GitHub Pages" (Actions → Deploy to GitHub Pages → Run workflow), or push a tag `v*` (for example `v0.1.0`) on `main`.
3. The workflow builds with the base path reported by `actions/configure-pages`, runs the source, parity and link checks, uploads `dist/` with `actions/upload-pages-artifact`, deploys with `actions/deploy-pages`, and then runs a smoke test (`tools/smoke.mjs` plus Playwright route and grid tests and screenshots) against the published URL. The evidence is attached to the run as the artifact `deploy-smoke-evidence`.
4. Updates: merge to `main`, then run the workflow again or push the next `v*` tag.

`ci.yml` runs on every pull request and never deploys.

## Provenance

- Canonical content source: `archive/frozen/session-architecture-grid_live_2026-11-13_v1794606123-2939.html` (SHA-256 `f35025bb3cbbd6379a0f3702728601ccc07c3e291fb7e9fdd502b8997aed30d0`), tag `source-2026-11-13-v1794606123-2939`.
- Uploaded reference HTML of 12 Nov 2026, byte-identical: `archive/original/Session Architecture Grid (1).html` (SHA-256 `7f1dfd9dca402cb5f42ef981e1dc5e0d28bebadca3fc6284da57df281f752651`, 90,012 bytes).
- Historical reference of 3 Nov 2026 (immutable): `archive/historical/2026-11-03/*.pdf`, served on `/changelog/#versions`.
- `archive/MANIFEST.json` records hash, size, date and role of every archived file and references internal handoff material by name and hash only.
- Item-level source-to-site mapping: `content/mapping.csv` (375 items) and `content/inventory-addendum.json` (1 item the Gate 1 generator does not capture: the footer reference paragraph).
- Approved deviations from the source: `content/approved-diffs.json` and `docs/provenance/APPROVED_DIFFS.md`. There is one: AD-01, the C3 post-review snapshot in the run timeline.
- Two histories are kept apart: the methodological change log is part of the content (S13, `/changelog/#changes`); website changes are in `CHANGELOG.md` and on `/changelog/#site-changes`. See `docs/provenance/VERSION_LOG.md` and `MAINTENANCE.md`.

## License

No license file (decision of the project lead, 13 Nov 2026).

The self-hosted fonts are third-party works under the SIL Open Font License 1.1; their license texts are in `public/fonts/*/OFL.txt`. This is a third-party notice, not a project license.
