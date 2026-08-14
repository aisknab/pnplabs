# Historical activated-run upload flow is frozen

The former one-command upload and issue-ingest path is no longer active. It submitted `PNPActivatedVerificationRunRecord0` records against a superseded theorem-emission status.

The current source status is `formal-reconstruction-in-progress`. The repository does not currently establish `P = NP`, so accepting new records under the old activated schema would misstate the theorem boundary.

## Current commands

Use the source repository to inspect formal reconstruction:

```bash
git clone https://github.com/aisknab/pnp.git
cd pnp
git checkout 77b275efe586e68339f6dd61abb5a2d3abcdce68
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

These commands expose current status, rebuild the compiled inventory and generated report, build the pinned Lean `PNP` library root, and audit supporting declarations. They reproduce the earned concrete `CNFSAT ∈ NP` theorem, literal all-input and sequential compilers, recursive raw-machine refinement, the typed locked-NAND semantic threshold, exact strict codecs, concrete parser/emitter machines and polynomial reductions, the finite residual sequence through typed PkgC restoration, same-key cancellation, exact ambient-BN4-ledger embedding and residual reduction, the finite BN6 packet bridge, the complete finite Packet selector pipeline through conditional gain coverage, and the generic finite Packet charge-surplus kernel. The locked-NAND theorem `PNP.Main.locked_nand_threshold : ReducesTo CNFSAT EncodedLockedNANDThreshold` remains a polynomial many-one reduction, not a polynomial-time target decider or an NP-hardness or NP-completeness result. The newest result derives strict occurrence count and strict total replacement weight from exact finite ledgers, multiplicity-preserving occurrence pairing, pairwise weight preservation, and one unmatched positive support charge. Exact gate accounting and separately proved semantic equivalence then yield a genuine strict equivalent gain and strict residual descent. The ledgers, pairing, witness, accounting, and semantics remain proof-bearing inputs and are not derived from terminal data. This is not unconditional `ZeroSlack`; it does not prove selector faithfulness or compatibility, construct a replacement, establish encoded-size or runtime bounds, produce typed blockers or HB/rank closure, complete global PkgC, unconditional `ZeroSlack`, PCCMin, or the root theorem. `PNP.Main.p_eq_np` is absent; four project-specific axioms and five blockers remain.

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
