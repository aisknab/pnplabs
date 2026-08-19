# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 7a3308520a68b5553cc95a7b56c560a20508111a
npm ci
lake build PNP
npm run check
npm run pnp:verify -- --no-write
npm run formal:inventory:check
npm run report:check
```

These commands expose current status, rebuild the compiled inventory and generated report, build the pinned Lean `PNP` library root, and audit supporting declarations without separately repeating the authority verifier's regression, axiom-audit, status, public-surface, or legacy-archive checks. `report:check` already checks the formal-publication output. They reproduce the earned concrete `CNFSAT ∈ NP` theorem, literal all-input and sequential compilers, recursive raw-machine refinement, the typed locked-NAND semantic threshold, exact strict codecs, concrete parser/emitter machines and polynomial reductions, the finite residual sequence through typed PkgC restoration, the finite BN6 packet bridge, the complete finite Packet selector pipeline through conditional gain coverage, the checked realizer and dependency layers, exact earliest-route semantics, and successive RankWF reflection of descent, table-owned rank, internal source route, positive source charge, grouped-footprint colour, BN5 frontier, obligation, BN4 activation, typed direction, and typed budget. Budget acceptance is computed from equality of explicit typed source and selector values; a budget first route is the four prior equalities with typed-budget inequality; colour, charge, exactRoute, and rank remain excluded; a final descent route carries actual nondecrease; and every positive Packet under accepted executable HB silence carries exact failure evidence without route-clear or binding premises. The locked-NAND theorem remains a polynomial many-one reduction, not a target decider or NP-hardness result. Every local Packet classifier field is now computed, but the coordinates, direction and budget values, finite rank map, before/after ranks, grouped family, exhaustive realizer claims, blocker activity, dependency rows, and finite-to-exact rank map remain proof-bearing inputs and are not derived from terminal data. The result does not prove the manuscript's complete BN5, Dir(u), Bud(u), or Packet adequacy bridge; identify local budget coherence with BudgetResolve or HB budget activity; guarantee a decreasing transition; construct a no-lower ledger; establish positive slack, full external selector compatibility, blocker semantics, unconditional HB negative closure, encoded-size or runtime bounds, complete global PkgC, unconditional `ZeroSlack`, PCCMin, or the root theorem. `PNP.Main.p_eq_np` is absent; four project-specific axioms and five blockers remain.

## Freeze controls

- `.github/ISSUE_TEMPLATE/pnp-verification-run.yml` has been removed.
- `.github/workflows/pnp-verification-run-issue-ingest.yml` no longer listens to issue events and has read-only permissions.
- `public/pnp-verification-runs.json` has `intakeFrozen = true`.
- The import tool rejects with `ImportRun.IntakeFrozen` before adding a record.
- The old comparison matrix and summary are labelled historical.
- The summary exposes `currentStatusBadge = false`, a neutral tone, and no current green pass state.

## Historical record boundary

The old prompt, schema, coordinates, and one site-CI seed record are preserved only so previous public behaviour can be audited. Their assertion-bearing content is not current theorem-status evidence or mathematical proof.

External review remains optional audit evidence and is not a mathematical premise or release blocker.
