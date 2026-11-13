# Maintenance

How the site is updated without losing traceability. Two kinds of change exist and never mix:

- **Content changes** come only from a new freeze of the live grid, approved by the project lead. They change files in `content/` (fragments, inventory, mapping) and nothing else.
- **Website changes** are engineering: layout, styles, navigation, tests, tooling. They never change the text of a fragment. They are recorded in `CHANGELOG.md` and `content/chrome.yml` (`site_changes`), not in the methodological change log.

A methodological change never enters the site as an engineering change.

## Versioning

- **Content version** = the artifact version of the frozen grid (now `1794606123-2939`). Shown in every page footer. Each freeze gets a tag `source-<date>-v<version>`.
- **Site version** = semantic version in `package.json` and `content/chrome.yml` (`site.footer_site_version`), recorded in `CHANGELOG.md`. Releases are tagged `v<site version>`; a `v*` tag triggers the deploy workflow.

## Updating content: a new freeze

1. **Approval.** The project lead approves a new freeze of the live grid.
2. **Archive.** Save the live HTML byte for byte as `archive/frozen/session-architecture-grid_live_<date>_v<version>.html`. Add it to `archive/MANIFEST.json` (sha256, bytes, date, role). Never edit or delete archived files; the previous freeze stays.
3. **Inventory.** `python3 -I tools/inventory.py <new frozen file> content/source_inventory.json docs/provenance/SOURCE_INVENTORY_TABLE.md`. Check whether new content lies outside `<header>` and `<section>` (the generator does not see it) and extend `content/inventory-addendum.json` if so.
4. **Diff log.** Compare the new inventory with the previous one item by item (sha16 per ID) and write the differences into a diff log for the project lead (same format as the Gate 1 diff log: element-level table plus findings). Any inconsistency in the source is reported, not corrected.
5. **Mapping.** `python3 -I tools/mapping.py content/source_inventory.json content/mapping.csv`. New sections need an entry in the `SEC` table of `tools/mapping.py` and, if they need a new route, a page in `src/pages/` and an entry in `content/chrome.yml` (`routes`).
6. **Fragments.** Point `tools/extract-fragments.mjs` at the new file (default path at the top, or pass it as an argument), run `npm run extract`, then `npm run golden:fixtures` if the script changed.
7. **Version.** Update the content version in `content/chrome.yml` (footer and `versions`), `docs/provenance/VERSION_LOG.md` and `tools/check-source.mjs` (expected Gate 1 hashes become the new freeze hashes).
8. **Pull request.** Open a PR that changes only `archive/`, `content/`, `docs/provenance/`, fixtures and version strings. The fragment diff shows every content change line by line. CI must pass; the parity report must show 0 unapproved differences.
9. **Approved diffs.** Re-check every entry in `content/approved-diffs.json` against the new freeze. If the source now matches the decided rule (for example the C3 snapshot of AD-01), remove the entry and the special case in `src/lib/timeline.ts`.
10. **Tag** the merged freeze `source-<date>-v<version>`, then deploy (see README).

## Approved deviations

The site reproduces the frozen source. A deviation needs the project lead's explicit approval and is recorded in `docs/provenance/APPROVED_DIFFS.md`, `content/approved-diffs.json`, `CHANGELOG.md` and `content/chrome.yml` (`site_changes`, shown on `/changelog/#site-changes`). The parity and golden tests whitelist exactly the recorded entries.

## Adding a document or a new section

The structure is designed to grow without a rebuild of the architecture:

1. Put the source file into `archive/` (with a MANIFEST entry) if it is a provenance artifact.
2. Extract its content verbatim into `content/fragments/` (extend `tools/extract-fragments.mjs`, or add a new extractor for a new source type). Do not retype content.
3. Add a page under `src/pages/<route>/index.astro` that composes the fragments with `<Frag>`.
4. Add the route to `content/chrome.yml` (`routes` for the primary navigation, `secondary_routes` otherwise). Navigation, footer and banner follow automatically.
5. Extend the inventory and mapping (or an addendum) so the parity check covers the new items, and add its anchors to `tools/linkcheck.mjs` and `tests/e2e/routes.spec.ts`.

## Website changes

1. Branch from `main`, change code or styles, keep `content/fragments/` untouched (`npm run check:source` fails otherwise).
2. Add an entry to `CHANGELOG.md` and, if readers should see it, to `content/chrome.yml` `site_changes`.
3. Run `npm test`; open a PR; CI runs every check. Merge, tag `v<version>`, deploy.

## Fonts

`npm run fonts` re-vendors the fonts from the `@fontsource` packages into `public/fonts/` with their OFL license texts. The build itself does not need the font packages.
