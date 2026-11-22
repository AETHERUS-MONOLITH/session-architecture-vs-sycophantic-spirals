# VERSION_LOG: content versions of the Session Architecture Grid

Two histories are kept apart:

- **Methodological history:** decisions by the project lead. This lives in the grid's own change log (S13) and is copied to the site verbatim.
- **Website implementation history:** engineering changes. This lives in the repository `CHANGELOG.md` and on `/changelog/#site-changes`.

The table below links the two through the frozen source versions.

| Date | Artifact version | Status | Archived as | Content change |
|---|---|---|---|---|
| 3 Nov 2026 | (PDF export) | sent to Robert Kralisch; immutable reference | `source/historical/2026-11-03/Session_Architecture_Grid_2026-11-03.pdf`, `API_cost_estimate_2026-11-03.pdf` | version sent with the proposal |
| 12 Nov 2026, evening | 1794516700-7352 | superseded | `source/original/Session Architecture Grid (1).html` (uploaded by the operator, SHA-256 7f1dfd9d…752651) | 12 Nov decisions incl. the nested false-saturation thresholds, team and raters |
| 13 Nov 2026 | **1794606123-2939** | **frozen for the website (Gate 1)** | `source/frozen/session-architecture-grid_live_2026-11-13_v1794606123-2939.html` | H1 Option B (DIFF_LOG D1–D9) |

Rule after the freeze: the website's content version stays at 1794606123-2939 until the project lead approves a new freeze. A new freeze means four things: archive the new live HTML, regenerate `source_inventory.json`, write a DIFF_LOG against the previous freeze, and open a PR that changes only fragments. A methodological change never enters the site as an engineering change.

Gate log:

| Gate | Date | State |
|---|---|---|
| 1: plan | 13 Nov 2026 | submitted; operator decisions of 13 Nov, 23:48 applied (revision 2); basis for Gate 2 |
| 2: implementation PR | 13 Nov 2026 onward | handed to Claude Code; repository AETHERUS-MONOLITH/session-architecture-vs-sycophantic-spirals |
| 3: independent review | (none yet) | |
| 4: publication | (none yet) | |
| Link migration in the Google doc | (none yet) | after Gate 4 |
