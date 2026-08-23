# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 1061db268348734ecbf26306a76ef1cfb609672f
npm ci
npm run formal:inventory:check
npm run validate
npm run report:check
```

`formal:inventory:check` owns the Lean build and compiled inventory. `validate` then checks the distinct verifier, regression, axiom, status, public-surface, and archive contracts without another standalone `lake build`; `report:check` verifies the derived publication. PNPLabs imports those exact artifacts and does not rerun Lean. The current earned scope includes the concrete `CNFSAT ∈ NP` theorem, literal compilers, typed locked-NAND reductions, the residual and terminal chains, the finite Packet selector and HB layers, all reflected Packet classifier fields, checked budget/HB and semantic/HN bindings, the Packet no-lower ledger, supplied-family HResolve routing, the terminal-derived support and budget resolvers, their same-candidate finite Packet composition, a deterministic maximal H-disjoint subfamily over supplied footprints, an exact certified-path minimum, a maximal H-disjoint certified-path family, proof-bearing HResolve, Budget, Selector/HB, Packet/budget no-lower, BCEL/Packet no-lower, and same-family Selector/HB/Packet/BCEL coherence ZeroSlack sidecars, the checked finite SaturatePositive-to-BCEL-ready composition, and the exact same-candidate identity between its computed nucleus and the grouped Packet carrier. The newest row uses a checked bijection and exact list equality to transfer the inherited carrier-size and existing Packet/constant-activation exclusions to one coherent family. The terminal problem, positive full-slack premise, Packet family, map, and downstream data remain supplied. This does not equate activation weights with projection excess, derive constant activation from positive residual slack, complete the no-lower ledger or global routing, establish unconditional `ZeroSlack`, prove PCCMin, or establish the root theorem. `PNP.Main.p_eq_np` is absent; four project-specific axioms and five blockers remain.

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
