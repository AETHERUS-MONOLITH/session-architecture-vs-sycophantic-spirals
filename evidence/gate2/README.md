# Gate 2 evidence

Produced locally on 14 Nov 2026 (UTC) from the head of `gate2/initial-site`, before the pull request was opened. CI reruns the same checks on every push (artifact `gate-evidence`).

| File | Content | Result |
|---|---|---|
| `source-integrity.md`, `source-integrity.txt` | ticket §2: archive hashes, inventory reproduction, Gate 1 records unchanged, fragment re-extraction, fragment identity with the source | 20/20 checks pass |
| `unit-tests.txt` | Vitest, B1–B11 (model matrix and golden comparison with the original script) | 173/173 pass |
| `build.log` | `astro build` with base `/session-architecture-vs-sycophantic-spirals/` | 11 pages |
| `parity-report.md`, `parity-report.json`, `parity.txt` | A1–A6, section- and item-level mapping, differences | 376/376 items on route and on `/full/`; 0 unapproved differences |
| `parity-mutation.txt` | negative control: 8 injected content changes | 8/8 detected |
| `linkcheck.txt`, `linkcheck.json` | D2–D4: anchors, links, no claude.ai, no external requests | 72/72 anchors, 0 problems |
| `contrast.md`, `contrast.txt` | token contrast, WCAG 2.1 AA, light and dark | 40/40 pairs |
| `base-path.txt` | build under `/alt-base/` plus parity and link checks | pass |
| `e2e-chromium.txt`, `e2e-chromium.json` | Playwright C1–C8, D1–D2 on Chromium desktop 1440×900 and mobile 390×844 | 106 passed, 36 skipped by design (mobile-only tests on desktop, keyboard tests on mobile, screenshot specs) |
| `screenshots/chromium-desktop/`, `screenshots/chromium-mobile/` | GATE1_PLAN §7 E | 10 per viewport |
| `PROJECT_DIRECTIVE_COMPLIANCE.md` | P1–P31 with the evidence column filled | |

Not run locally: WebKit (the Playwright browser download from `cdn.playwright.dev` is blocked in the build environment); the WebKit projects run in CI. The local Chromium is the preinstalled Chromium 153 (`PW_CHROMIUM_PATH`), not the build pinned by `@playwright/test`.
