# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout fa7436c2bb0efcc77f1a8b193b918c6d97d3d3b5
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

These commands expose current status, rebuild the compiled inventory and generated report, build the pinned Lean `PNP` library root, and audit supporting declarations. They reproduce the earned concrete `CNFSAT ∈ NP` theorem, literal all-input and sequential compilers, recursive raw-machine refinement, the typed locked-NAND semantic threshold, exact strict codecs, concrete parser/emitter machines and polynomial reductions, the finite residual sequence through typed PkgC restoration, same-key cancellation, exact ambient-BN4-ledger embedding and residual reduction, the finite BN6 packet bridge, payload-backed Packet selector seeds, exact finite grouped-footprint universe membership, canonical finite selector handles, the fail-closed unary handle codec, and total fail-closed source-payload realization. The locked-NAND theorem `PNP.Main.locked_nand_threshold : ReducesTo CNFSAT EncodedLockedNANDThreshold` remains a polynomial many-one reduction, not a polynomial-time target decider or an NP-hardness or NP-completeness result. The newest result maps each accepted code to its exact handle, original source cell, footprint, and canonical original positive payload atom, with exact re-encoding, supplied-family membership, strict positivity, predicate equivalence, and branch preservation. The grouped family remains proof-bearing input. This is not payload serialization or the manuscript's gain-or-blocker selector realizer. The result does not construct a replacement circuit, prove selector faithfulness or compatibility, return a gain or typed blocker route, derive or group the family from terminal data, bound it by encoded circuit size, prove polynomial generation or runtime, complete PkgC, ZeroSlack or PCCMin, or the root theorem. `PNP.Main.p_eq_np` is absent; four project-specific axioms and five blockers remain.

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
