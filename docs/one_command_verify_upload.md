# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout f3ca3346b3cd2b33e1259321297b6149ac5c52db
npm ci
lake build PNP
node pcc-formal-reconstruction-status0.mjs --json --no-write
node pcc-formal-public-surface0.mjs --json --no-write
npm run pnp:verify -- --no-write
node scripts/export-lean-theorem-inventory.mjs --check
node scripts/generate-formal-publication.mjs --check
npm run report:check
node --test audits/lean-root-target0.test.mjs
node --test audits/lean-nand-semantics0.test.mjs
node --test audits/lean-nand-enumerator0.test.mjs
lake env lean -DwarningAsError=true lean-audit/PNPBridgeAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPNANDSemanticsAxiomAudit.lean
lake env lean -DwarningAsError=true lean-audit/PNPNANDEnumeratorAxiomAudit.lean
```

These commands expose current status, rebuild the compiled inventory and generated report, build the pinned Lean `PNP` library root, and audit supporting declarations. They reproduce the earned concrete `CNFSAT ∈ NP` theorem, literal all-input and sequential compilers, recursive raw-machine refinement, the typed locked-NAND semantic threshold, exact strict codecs, concrete parser/emitter machines and polynomial reductions, the finite residual sequence through typed PkgC restoration, same-key cancellation, exact ambient-BN4-ledger embedding and residual reduction, the finite BN6 packet bridge, the complete finite Packet selector pipeline through conditional gain coverage, the generic finite Packet charge-surplus kernel, the checked unit-charge blueprint realizer, the checked finite Packet typed-realizer contract, exact-rank acyclicity and total-table coverage for a supplied finite HN and budget dependency system, checked active-dependency closure, and conditional selector silence. The locked-NAND theorem `PNP.Main.locked_nand_threshold : ReducesTo CNFSAT EncodedLockedNANDThreshold` remains a polynomial many-one reduction, not a polynomial-time target decider or an NP-hardness or NP-completeness result. The newest result combines checked HN/BUD inactivity with an explicit semantic premise excluding every strict equivalent gain. Strong induction on the supplied finite selector ranks proves every canonical selector in an accepted supplied table nonfaithful. A specialization obtains the gain-exclusion premise from a supplied gain-coverage certificate plus exact source-cell no-gain. The grouped family, selector table, finite ranks, faithfulness predicate, realizer claims, blocker activity, dependency rows, rank map, semantic gain exclusion, and coverage certificate remain proof-bearing inputs and are not derived from terminal data. The result does not prove selector faithfulness or compatibility, blocker semantics, semantic dependency completeness, unconditional HB negative closure, encoded-size or runtime bounds, global PkgC, unconditional `ZeroSlack`, PCCMin, or the root theorem. `PNP.Main.p_eq_np` is absent; four project-specific axioms and five blockers remain.

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
