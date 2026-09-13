# Reproducibility

This document separates current formal-publication reproduction from historical assertion-checker
replay. Neither route by itself establishes theorem correctness.

## Companion Website Checkout

Requirements:

- Node.js 20 or newer;
- npm bundled with Node 20 or newer;
- Poppler utilities for independent PDF page/text inspection;
- a local `aisknab/pnp` checkout only for the optional exact cross-repository check.

Run the complete local suite:

```bash
npm test
```

The suite checks public status/inventory consistency, strict fail-closed rendering, local HTTP
routes, report aliases, the release seal and checksum ledger, educational fixtures, and local
documentation links. These are companion-package checks, not Lean proof checks.

Current canonical identities:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `downloads/canonical_proof_report.pdf` | 703,729 | `8c6f8ae5fc05f1763363055fefe49432f0c53f0d3dda321ab3a6fc39e94507fe` |
| `downloads/canonical-proof-report.pdf` | 703,729 | `8c6f8ae5fc05f1763363055fefe49432f0c53f0d3dda321ab3a6fc39e94507fe` |
| `downloads/canonical_proof_report.tex` | 500,462 | `7e02d95abcfed87f83076b34454293ae32b3ffc910066d6e89018338314aff86` |
| `downloads/canonical-proof-report.tex` | 500,462 | `7e02d95abcfed87f83076b34454293ae32b3ffc910066d6e89018338314aff86` |
| `public/pnp-status.json` | 3,177,956 | `004af2bc499ab8715278f3df870f7d04d44b42d25ba696d579dceddfa588058e` |
| `public/pnp-theorem-inventory.json` | 58,224,870 | `6180226112e43664173be7b5d8f8179e62eb68032499c7d7f1a848053c8d06a4` |
| `public/pnp-proof-progress.json` | 210,069 | `5c8f0f594ce2ee06dfc595524ac91045455d47b857bc1e740f8cacbcb65bebc7` |

The PDF page count must match the canonical release manifest. Both filename styles must be byte-identical.

## Exact Cross-Repository Mirror Check

Use the exact merged core commit recorded in
`downloads/formal-publication-release.json`:

```bash
git -C ../pnp fetch origin
git -C ../pnp checkout 6296c6e1130fbae674548ccbf949f6e608b996c7
PNP_SOURCE_DIR=../pnp node tools/sync-public-access-docs.mjs --check
PNP_SOURCE_DIR=../pnp npm run test:audit-targets
```

The sync command is read-only by default. A deliberate local refresh requires explicit `--write`;
the GitHub workflow never writes, commits, or pushes. The checker compares current status,
inventory, the fixed-weight proof-progress ledger, TeX, PDF, all aliases, source/report coordinates,
page count, forbidden historical
hashes, and companion release metadata. PNPLabs consumes the exact proof artifacts already verified
at the pinned core commit; this publication check does not invoke Lean, Lake, or Elan.

## Core Lean Inventory Reproduction

At the same exact core commit, install the pinned toolchain and run:

```bash
npm run formal:inventory:check
npm run validate
npm run report:check
```

The inventory check owns the Lean build. The validation and report phases exercise distinct
contracts without a second standalone `lake build`.

Read expected declaration, theorem, source-module and excluded-private counts from the
canonical inventory bound by the current manifest, and compare the reproduced bytes exactly.
No project-specific axioms remain. The publication gate must remain false with five blockers. The concrete
NP-membership theorem is `PNP.Concrete.FinalUniversalDesign.cnfSATInNP`. M230 completes the all-input formula builder and packaged polynomial reduction to CNFSAT. M231 establishes the all-language hardness interface and closed NP-completeness theorem, using the standard axiom closures recorded in the inventory. The M258 batch adds source-derived proper zero/unary support search with full-field-preserving replacement. None of these results constructs a polynomial-time SAT decider or the eligible root; no fixed checkpoint changes in this publication batch. The strict-v0 source parser, target emitter, and concrete `EncodedNANDSAT`-to-`EncodedLockedNANDThreshold`
polynomial reduction remain exact and fail closed on malformed source bytes. The semantic layer supplies
a total compiler from strict canonical CNF formulas to intrinsically topological NAND circuits. Its
18 reviewed theorem pins prove codec canonicality, well-formed topological output, exact assignment
and satisfiability semantics including empty edge cases, exact gate count, a quadratic serialized-output
bound, malformed-input failure, all-bitstring language equivalence, and semantic composition with
`buildLockedNANDInstance`. The expanded 68-declaration semantic audit has 28 empty, 19 `propext`-only,
and 21 `propext` plus `Quot.sound` closures, with no project axiom or `Classical.choice`.

The concrete report-facing locked-NAND compatibility milestone has 6 reviewed theorem pins.
It identifies the report-facing SAT and locked-NAND languages, verifier, decider, reduction, P/NP-class,
and P-equals-NP interfaces with the concrete finite-pipeline definitions and directly reuses the
checked all-bitstring polynomial reduction. Its focused 9-declaration audit records the wider compatibility
surface, while the six pinned milestone theorems close under the Lean-standard allowlist and its checked
endpoint has no project-specific axiom. This
removes the duplicate `PNP.LockedNANDThreshold` axiom and caller-supplied reduction edge; it does not
supply a target decider, prove SAT NP-hardness or CNFSAT NP-completeness transport, construct the
unconditional residual minimiser, prove ZeroSlack or exact polynomial PCCMin, create the eligible root
theorem, or open a global gate.

The concrete residual-band compatibility milestone has 7 reviewed theorem pins. It identifies
the report-facing residual-band endpoint with the concrete fail-closed encoded exact-minimum threshold
language, proves exact reference-minimum semantics for every intrinsically typed finite candidate, and
uses a compiled identity polynomial reduction for the active locked-to-residual edge. Its focused
10-declaration audit and the seven pinned theorems use only `propext`, with no project-specific axiom.
This removes `PNP.ResidualBandExactMinimization` and the caller-supplied compatibility edge from the
active route. Exhaustive reference minimisation is not a polynomial-time PCCMin algorithm, and this
milestone does not prove residual-band promise bounds, unconditional ZeroSlack, deterministic CNFSAT
in P, SAT hardness transport, the eligible root theorem, or a global-gate closure.

Historical component notes below retain the estimates recorded at their respective milestones. They are not current estimates; M230 closes the separately reported complete-builder checkpoint.

The M189 proof-bearing PCCMin total-oracle milestone has 1 reviewed theorem pin. For every finite
direct-wire implementation and explicit proof-bearing total oracle, transparent well-founded recursion
follows strict equivalent gains to exact-minimum or ZeroSlack evidence, preserves semantics, returns zero
residual slack, and bounds strict-gain iterations by the starting slack. Its focused 8-declaration audit
is axiom-free. The oracle remains supplied, and the regression fixture constructs it with exhaustive
reference minimisation: the milestone does not construct an executable terminal-derived oracle, establish
unconditional ZeroSlack, encode the loop as a raw machine, prove encoded-size polynomial construction or
runtime, put CNFSAT in P, establish SAT hardness transport, create the eligible root theorem, or close a
global gate. The fixed-weight score therefore remains 35%.

The M190 proof-bearing normalization and oracle composition milestone has 1 reviewed theorem pin.
For every finite direct-wire implementation, explicit proof-bearing total normalizer, and explicit
proof-bearing total oracle, non-increasing semantic normalization lifts later oracle gains to strict
gains from the original implementation and transports exact-minimum and ZeroSlack endpoints into the
checked terminating loop. Its focused 10-declaration audit is axiom-free. Both stages remain supplied,
and the regression fixtures use exhaustive reference minimisation: the milestone does not construct
either executable stage, derive terminal families or routes, establish unconditional ZeroSlack, encode
the stages as raw machines, prove encoded-size polynomial construction or runtime, put CNFSAT in P,
establish SAT hardness transport, create the eligible root theorem, or close a global gate. The
fixed-weight score therefore remains 35%.

The M191 rank-ordered proof-bearing PCCOracle orchestration milestone has 1 reviewed theorem pin.
For every finite direct-wire implementation, explicit proof-bearing normalizer, and explicit rank-ordered
oracle builder, HResolve precedes BudgetResolve, every selector in every canonical finite rank row is
scanned, gains return immediately, and complete typed silence is required before the supplied ZeroSlack
closure. The endpoint uses only Lean-standard `Quot.sound` and `propext`; its focused 15-declaration audit
is free of project-specific axioms. The normalizer, resolvers, rows, realizer, blocker
semantics, ZeroSlack proof, and exhaustive reference fixture remain supplied: the milestone does not
construct executable PCCMin, derive terminal objects, prove unconditional ZeroSlack, establish encoded-size
polynomial construction or runtime, put CNFSAT in P, establish SAT hardness transport, create the eligible
root theorem, or close a global gate. The fixed-weight score therefore remains 35%.

The M192 checked Packet-backed PCCMin rank-selector milestone has 1 reviewed theorem pin.
For every finite direct-wire implementation and supplied checked Packet table, the executable checker
validates a data-only unit-charge gain or typed HN, budget, or lower-seed blocker at every canonical
handle, then derives exact-rank rows by filtering the exhaustive canonical handle list with the
table-owned rank map and reuses the M191 oracle and loop. The endpoint uses only Lean-standard
`Quot.sound` and `propext`; its focused 15-declaration audit is free of project-specific axioms. The
grouped terminal family, rank assignment, claim table, resolvers, normalizer, blocker semantics,
ZeroSlack closure, and exhaustive reference fixture remain supplied: the milestone does not derive
terminal objects or claims from arbitrary input, construct executable PCCMin, prove unconditional
ZeroSlack, establish encoded-size polynomial construction or runtime, put CNFSAT in P, establish SAT
hardness transport, create the eligible root theorem, or close a global gate. The fixed-weight score
therefore remains 35%.

The M193 checked Packet/HB conditional ZeroSlack bridge has 1 reviewed theorem pin. For every
finite direct-wire implementation and supplied checked Packet/HB data, complete checked claims and
exact-rank silence feed the executable selector-silence induction, while checked HB no-outcome closure
eliminates every canonical faithful handle. One explicit positive-residual-slack-to-faithful-selector
premise then yields conditional ZeroSlack before the M192 selector construction and checked loop are
reused. The endpoint uses only Lean-standard `Quot.sound` and `propext`; its focused 15-declaration
audit is free of project-specific axioms. The positive-slack bridge, terminal family, rank assignment,
claim table, resolvers, normalizer, blocker semantics, encoded-size bounds, and exhaustive reference
fixture remain supplied: the milestone does not derive terminal objects or the positive-slack bridge
from arbitrary input, construct executable PCCMin, prove unconditional ZeroSlack, establish encoded-size
polynomial construction or runtime, put CNFSAT in P, establish SAT hardness transport, create the eligible
root theorem, or close a global gate. The fixed-weight score therefore remains 35%.

The M194 BN6 computed-faithfulness checked Packet/HB bridge has 1 reviewed theorem pin. For
every finite direct-wire implementation and supplied checked Packet/BN6/HB data, one explicit
constant-activation premise carries positive residual slack into the general BN6 Packet theorem.
Checked route-clear payload data computes a faithful selector in the canonicalized table, and the
M193 checked HB contradiction derives conditional ZeroSlack before the checked loop is reused. The
endpoint uses only Lean-standard `Quot.sound` and `propext`; its focused 12-declaration audit is free
of project-specific axioms. Constant activation, the terminal family, carrier lower bound, payload
and rank construction, route-clear proof, claim and HB tables, resolvers, normalizer, blocker
semantics, encoded-size bounds, and the exhaustive reference fixture remain supplied. The milestone
does not prove manuscript-wide SaturatePositive or BCELReady, derive the supplied data from arbitrary
input, construct executable PCCMin, prove unconditional ZeroSlack, establish encoded-size polynomial
construction or runtime, put CNFSAT in P, establish SAT hardness transport, create the eligible root
theorem, or close a global gate. The fixed-weight score therefore remains 35%.

The M195 same-candidate BCEL activation-route classifier has 1 reviewed theorem pin. For every
finite same-candidate checked BCEL nucleus and supplied grouped BN6 Packet family, a total classifier
compares the exact carrier, cut value, and every canonical nonempty proper-cut activation weight. It
returns a proof-bearing carrier, cut-value, or activation mismatch route, or derives coherent constant
activation, identifies it with the BCEL projection excess, and reuses M194 for conditional ZeroSlack
under checked selector silence. The endpoint uses only Lean-standard `Quot.sound` and `propext`; its
focused 15-declaration audit is free of project-specific axioms. The terminal problem, positive premise,
checked finite BCEL-ready certificate, grouped family, payloads, tables, ranks, route-clear proof,
resolvers, normalizer, blocker semantics, and encoded-size bounds remain supplied. The proper-cut
classifier enumerates a finite powerset and is not proved polynomial, and mismatch diagnostics are not
constructed gains or globally decreasing transitions. The milestone does not prove manuscript-wide
SaturatePositive or BCELReady, derive the supplied data from arbitrary input, construct executable
PCCMin, prove unconditional ZeroSlack, establish encoded-size polynomial construction or runtime, put
CNFSAT in P, establish SAT hardness transport, create the eligible root theorem, or close a global gate.
The fixed-weight score therefore remains 35%.

The M196 BCEL-derived BN6 family skeleton has 1 reviewed theorem pin. For every finite
same-candidate checked BCEL nucleus and supplied grouped-cell ledger, it constructs the family carrier,
proves duplicate-freedom, takes the cut value from the nucleus projection defect, and inherits its
strict positivity. M195's carrier and cut-value mismatch routes are impossible by construction;
checked selector silence leaves an exact proper-cut activation mismatch or conditional ZeroSlack.
The endpoint uses only Lean-standard `Quot.sound` and `propext`; its focused 14-declaration audit is
free of project-specific axioms. The terminal problem, positive premise, checked finite BCEL-ready
certificate, grouped cells and payloads, exact grouping proofs, tables, ranks, route-clear proof,
resolvers, normalizer, blocker semantics, and encoded-size bounds remain supplied. The inherited
proper-cut classifier enumerates a finite powerset and is not proved polynomial, and its remaining
mismatch diagnostic is not a constructed gain or globally decreasing transition. The milestone does
not complete PkgC/BN3 through BN6 integration, prove manuscript-wide SaturatePositive or BCELReady,
derive the supplied data from arbitrary input, construct executable PCCMin, prove unconditional
ZeroSlack, establish encoded-size polynomial construction or runtime, put CNFSAT in P, establish SAT
hardness transport, create the eligible root theorem, or close a global gate. The fixed-weight score
therefore remains 35%.

The latest M197 canonical BN6 positive-cell grouping milestone has 1 reviewed theorem pin. For every
finite same-candidate checked BCEL nucleus and supplied raw positive support-and-payload ledger, it
normalizes supports inside the computed carrier, constructs singleton V54 consumer systems,
coalesces duplicate footprints, and preserves every positive payload atom. The resulting grouped
family reuses M196, so checked selector silence leaves an exact activation mismatch or conditional
ZeroSlack. The endpoint uses only Lean-standard `Quot.sound` and `propext`; its focused
34-declaration audit is free of project-specific axioms. The terminal problem, positive premise,
checked finite BCEL-ready certificate, raw positive supports and payload atoms, tables, ranks,
route-clear proof, resolvers, normalizer, blocker semantics, and encoded-size bounds remain supplied.
The inherited proper-cut classifier enumerates a finite powerset and is not proved polynomial, and
its remaining mismatch diagnostic is not a constructed gain or globally decreasing transition. The
milestone does not derive the raw cells from BN3, BN4, BN5, PkgC, or every terminal input, complete
PkgC/BN3 through BN6 integration, prove manuscript-wide SaturatePositive or BCELReady, construct
executable PCCMin, prove unconditional ZeroSlack, establish encoded-size polynomial construction or
runtime, put CNFSAT in P, establish SAT hardness transport, create the eligible root theorem, or
close a global gate. The fixed-weight score therefore remains 35%.

The latest M198 canonical BN6 raw cut-ledger milestone has 1 reviewed theorem pin. For every finite
same-candidate checked BCEL nucleus, supplied raw positive-cell ledger, and cut, it proves that M197's
canonical duplicate-footprint coalescing preserves the exact direct crossing-mass sum. The remaining
grouped-family activation mismatch is therefore exposed directly against the raw ledger, so checked
selector silence leaves an exact proper-cut raw activation mismatch or conditional ZeroSlack. The
endpoint uses only Lean-standard `Quot.sound` and `propext`; its focused 9-declaration audit is free of
project-specific axioms. The terminal problem, positive premise, checked finite BCEL-ready certificate,
raw positive cells and payloads, tables, ranks, route-clear proof, resolvers, normalizer, blocker
semantics, and encoded-size bounds remain supplied. The inherited proper-cut classifier enumerates a
finite powerset and is not proved polynomial; constant activation is not derived; and the raw-ledger
mismatch diagnostic is not a constructed gain or globally decreasing transition. The milestone does
not derive the raw cells from BN3, BN4, BN5, PkgC, or every terminal input, complete PkgC/BN3 through
BN6 integration, prove manuscript-wide SaturatePositive or BCELReady, construct executable PCCMin,
prove unconditional ZeroSlack, establish encoded-size polynomial construction or runtime, put CNFSAT
in P, establish SAT hardness transport, create the eligible root theorem, or close a global gate. The
fixed-weight score therefore remains 35%.

The M199 sparse V53 constant-cut-basis milestone has 1 reviewed theorem pin. For every finite
sparse V53 hypergraph with at least two anchors, it proves that a shape-specific basis is equivalent
to the complete constant equation on every nonempty proper cut. Its total classifier checks the
two-anchor full weight, three singleton cuts, or four-plus full-span support and weight without
enumerating carrier subsets. Accepted evidence derives constant activation and conditional ZeroSlack
at the checked BN6/BCEL/HB boundary. The endpoint uses only Lean-standard `Quot.sound` and `propext`;
its focused 24-declaration audit is free of project-specific axioms. Terminal data, raw cells and
payloads, tables, ranks, route-clear proof, resolvers, normalizer, blocker semantics, upstream
construction, and complete encoded-size bounds remain supplied. Rejection is a typed structural
diagnostic rather than a constructed gain or globally decreasing transition. The milestone does not
force basis acceptance or route rejection to a gain, prove manuscript-wide SaturatePositive or
BCELReady, construct executable PCCMin, prove unconditional ZeroSlack or encoded-size polynomial
runtime, put CNFSAT in P, establish SAT hardness transport, create the eligible root theorem, or close
a global gate. The fixed-weight score therefore remains 35%.

The M200 sparse V53 proper-cut activation-route milestone has 1 reviewed theorem pin. For
every finite sparse positive V53 hypergraph with at least two anchors, it proves that the
duplicate-free singleton and order-preserving pair proper cuts form a quadratic-size test family
equivalent to the complete constant equation on every nonempty proper cut. A total classifier either
derives that equation or retains the first exact small-cut mismatch. At the checked BN6/BCEL/HB
boundary, a mismatch is reflected through the direct raw positive-cell activation ledger, while
coherence yields conditional ZeroSlack under checked selector silence. The endpoint uses only
Lean-standard `Quot.sound` and `propext`; its focused 30-declaration audit is free of project-specific
axioms. The terminal problem, positive premise, checked finite BCEL-ready certificate, raw cells and
payloads, tables, ranks, route-clear proof, resolvers, normalizer, blocker semantics, upstream
construction, and complete encoded-input bounds remain supplied. The singleton/pair family has a
direct quadratic list-length bound, but this is not a complete polynomial construction or runtime
theorem. A returned raw activation mismatch is an exact diagnostic route, not a verified gain or
globally decreasing transition. The milestone does not derive raw cells from every terminal input,
map the mismatch into a decreasing route, complete PkgC/BN3 through BN6 integration, prove
manuscript-wide SaturatePositive or BCELReady, construct executable PCCMin, prove unconditional
ZeroSlack or complete encoded-size polynomial runtime, put CNFSAT in P, establish SAT hardness
transport, create the eligible root theorem, or close a global gate. The fixed-weight score therefore
remains 35%.

The M201 PkgC/BN6 positive-cellization milestone has 1 reviewed theorem pin. For every finite
list of supplied active V54 consumer systems over one common carrier and supplied typed restorer, it
returns the first exact same-key PkgC cancellation realization or proves all systems singletonized.
The latter branch derives each raw BN6 positive-cell support and support-size fact from its active
consumer data, preserves payload order, and proves exact activation-weight conservation on every
cut. The endpoint uses only Lean-standard `Quot.sound` and `propext`; its focused 19-declaration audit
is free of project-specific axioms. The terminal problem, source systems, active cuts, positive
payload atoms, typed restorer, upstream BN3 through BN5 construction, checked BCEL/Packet
integration, and complete encoded-size bounds remain supplied or open. A returned cancellation is
exact proof-bearing PkgC evidence, not a verified global gain or rank-decreasing transition. The
milestone does not derive the supplied objects from every terminal input, complete PkgC through BN6,
prove manuscript-wide SaturatePositive or BCELReady, construct executable PCCMin, prove
unconditional ZeroSlack or complete encoded-size polynomial runtime, put CNFSAT in P, establish SAT
hardness transport, create the eligible root theorem, or close a global gate. The fixed-weight score
therefore remains 35%, while formal artefact coverage becomes 177 of 179.

The M202 source-derived PkgC/BN6 checked-route milestone has 1 reviewed theorem pin. For every arbitrary finite supplied active PkgC source ledger over the exact checked BCEL nucleus, M201's total classifier either retains an exact source-member same-key cancellation or constructs the only raw BN6 positive-cell ledger admitted downstream. That derived ledger enters M200's canonical checked Packet/HB classifier. Its first nonempty proper singleton/pair activation mismatch is reflected back through all-cut activation conservation to the original PkgC source ledger, while the coherent branch yields conditional ZeroSlack under supplied checked selector silence. The returned mismatch cut is always nonempty, proper, and of length at most two. The endpoint uses only Lean-standard `Quot.sound` and `propext`; its focused 7-declaration audit is free of project-specific axioms. The terminal problem, checked finite BCEL-ready certificate, active source systems and cuts, positive payload atoms, typed restorer, realizer table, accepted claims, rank assignment, dependency table, checked HB closure, route-clear result, and selector silence remain explicit supplied inputs. A returned PkgC cancellation or source-ledger activation mismatch is exact proof-bearing evidence, not a verified gain or globally rank-decreasing transition. This does not construct the sources or downstream tables from every valid terminal input, construct upstream BN3 through BN5 data, prove complete PkgC through BN6 route integration, derive blocker semantics or semantic dependency completeness, prove manuscript-wide SaturatePositive or BCELReady, establish unconditional ZeroSlack, construct executable polynomial PCCMin, prove encoded-size polynomial construction, runtime, output-size, or certificate-size bounds, put CNFSAT in P, establish SAT hardness transport, create the eligible root theorem, close a global gate, or prove `P = NP`. The fixed-weight score therefore remains 35%, while formal artefact coverage becomes 178 of 180.

The M207 PkgC restoration coverage and exact ambient charge-coordinate descent milestone has 1 reviewed theorem pin. For every arbitrary finite exact ambient embedding returned by M206, unsigned BN4 charge is computed as the sum of cell masses. Exact permutation decomposes ambient charge into a strictly positive coverage-derived cancellation charge plus remainder charge. The remainder therefore strictly decreases the eighth chargeSize coordinate of the exact ten-coordinate TerminalResidualRank for every fixed surrounding context while preserving the complete canonical residual ledger. All other M206 outcomes remain explicit. The endpoint uses only Lean-standard `Quot.sound` and `propext`; its focused 16-declaration audit is free of project-specific axioms. The terminal problem, checked BCEL-ready certificate, active PkgC source cells and cuts, restoration-coordinate universes and maps, ambient BN4 ledgers, semantic full candidates, Packet ranks and claims, dependency table, checked HB closure, route-clear result, and selector silence remain explicit supplied inputs. M207 proves exact charge-coordinate descent only for M206's successful ambient embedding. It does not prove the computed remainder is empty or turn Hall deficits, ambient incompatibility, or activation mismatches into complete global routes. This milestone does not finish terminal-input derivation, complete PkgC/BN3--BN6 integration, HN/BUD/HB semantic completeness, manuscript-wide SaturatePositive or BCELReady, unconditional ZeroSlack, executable polynomial PCCMin, complete encoded-size polynomial bounds, CNFSAT in P, a global gate, the eligible root theorem, or P = NP. The fixed-weight score therefore remains 35%, while formal artefact coverage becomes 183 of 185.

The latest M231 concrete CNF-SAT NP-completeness result has two reviewed theorem pins. For every language in the concrete bounded-certificate NP class, M231 extracts its polynomial-time verifier from NP membership and applies the complete source-derived all-input Cook-Levin PolynomialReduction to CNFSAT. Together with the existing concrete CNFSAT verifier, the closed theorem proves NPComplete CNFSAT in the selected finite-machine model. No reduction, execution trace, finite-instance restriction or correctness certificate is supplied. Both complete theorem interfaces are root-built and axiom-audited; their closures contain only the Lean standard axioms Classical.choice, Quot.sound and propext. NP-completeness is hardness plus NP membership, not a deterministic polynomial-time SAT algorithm. This closes only the fixed concrete NP-hardness checkpoint. It does not close the separate final complexity transport to P = NP, unconditional residual minimization or ZeroSlack, complete polynomial PCCMin construction and certificate bounds, deterministic CNFSAT in P, or the eligible root theorem. All five global proof gates and the publication gate remain open; P = NP is not proved. Risk-weighted proof completion estimate: 40%, with uncertainty 20% to 40%. Formal artefact coverage: 207 of 209 current scoped rows. Global gates: 0 of 5 closed. No project-specific axioms remain, the eligible root is absent and the publication gate is false.

The M231 result's focused 2-declaration audit covers precisely its two reviewed
theorem interfaces; no project-specific axiom is used.

The exact core merge owns Lean compilation and axiom evidence; PNPLabs verifies the pinned source
identity and byte-exact publication artifacts and does not rebuild Lean.

The composed all-input CNF parser, NAND compiler, and locked-NAND emitter are published as
`PNP.Main.locked_nand_threshold : ReducesTo CNFSAT EncodedLockedNANDThreshold`. Its one reviewed pin
uses only `Quot.sound` and `propext`. This is a polynomial many-one reduction, not a target decider,
an NP-hardness or NP-completeness theorem, a ZeroSlack or PCCMin result, or the root theorem.

The fixed all-input compiler milestone realizes that semantic function with one fixed 135,070-rule three-node finite
work graph. Its 28 reviewed theorem pins cover exact all-bitstring execution, exact compiled output, non-timeout
execution under one external polynomial, `PolynomialTimeFunction`, literal `RawRefinement`, the direct
`CNFSAT`-to-`EncodedNANDSAT` `PolynomialReduction` (`cnfSAT_reducesTo_encodedNANDSAT`), and composition to
`EncodedLockedNANDThreshold`. The complete 1,316-declaration audit has 864 empty, 151
`propext`-only, and 301 `propext` plus `Quot.sound` closures. It contains no project axiom or
`Classical.choice`.

This finite compiler alone is not a CNF-SAT decider or an NP-completeness theorem.
M186 connects it to the exact report-facing concrete target and removes the
duplicate locked-NAND project axiom. M230 supplies the complete all-input
Cook-Levin formula builder and M231 supplies concrete CNF-SAT NP-completeness.
The target decider, CNF-SAT in P, eligible root theorem, and `P = NP` remain
unproved.

The earlier typed-budget reflection milestone adds 30 reviewed theorem pins. For every arbitrary finite grouped BN6 family,
selector-rank carrier, and domain of typed budget values with decidable equality, Lean computes
Packet budget acceptance from exact equality of the explicit source and selector budget values
while retaining the computed frontier, obligation, activation, and direction fields, grouped colour,
positive charge, the internal source route, authoritative handle rank, and exact descent computation.
A budget first route is prior frontier, obligation, activation, and direction equality together with
typed-budget inequality. The classifier also cannot return colour, charge, exactRoute, or rank, a final
descent route carries actual nondecrease, and the positive Packet/HB endpoint carries exact failure
evidence without route-clear or binding premises. Twelve reviewed pins use only `propext`, and 18 use
`Quot.sound` plus `propext`. The focused 37-declaration audit has two empty, 17 `propext`-only, and 18
`Quot.sound` plus `propext` closures; none uses a project axiom or `Classical.choice`. Every local
Packet classifier field is now computed, but the coordinates, direction and budget values, finite rank
map, before/after residual ranks, grouped family, realizer claims, HN/BUD activity, dependency rows,
and finite-to-exact rank map remain proof-bearing inputs. Lean does not construct them from terminal
data or prove the manuscript's complete BN5, Dir(u), Bud(u), or Packet adequacy bridge. It does not
identify local Packet budget coherence with BudgetResolve or HB budget activity, prove a decreasing
transition, or complete the non-Packet rows of the no-lower ledger. Full external selector compatibility, complete route
silence, unconditional HB negative closure, positive slack, SaturatePositive, BCELReady, unconditional
`ZeroSlack`, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P, removal of an assumption,
and `P = NP` remain outside the earned scope.

The authority verifier runs its current regression, axiom-audit, status, public-surface, and legacy-archive checks once. `report:check` includes the formal-publication check, then performs a same-environment deterministic double build, exact byte comparison, PDF
metadata/text checks, and full-page rendering. This is not a promise of identical PDF bytes under
arbitrary TeX distributions or operating systems.

## Seal Verification

Run:

```bash
npm run verify:seal
sha256sum downloads/canonical_proof_report.pdf \
  downloads/canonical_proof_report.tex \
  public/pnp-status.json \
  public/pnp-theorem-inventory.json \
  public/pnp-proof-progress.json
pdfinfo downloads/canonical_proof_report.pdf
```

The seal rejects duplicate paths, missing or extra ledger entries, malformed hashes, byte-count
mismatches, and digest mismatches. A successful seal confirms file identity only.

## Historical 7072f8d Replay

The former 57-page direct-claim manuscript and assertion-checker release are preserved separately:

- source tag `final-pnp-proof-report-hardened-7072f8d`;
- source commit `7072f8d0bda6d44d240f9bb3fad624fd357e1278`;
- documentation tag `final-pnp-proof-report-docs-hardened-7072f8d-sealed`;
- artefact tag `final-pnp-proof-report-artifacts-hardened-7072f8d-sealed`;
- archive locator `archive/legacy-v0/ARCHIVE.json`.

Use the source repository's designated legacy replay command only if historical behavior is the
audit target. Historical accepted fields are implementation evidence, not current theorem authority,
and cannot satisfy the concrete publication gate.

## Troubleshooting

| Symptom | Likely cause | Action |
| --- | --- | --- |
| `node: command not found` | Node.js is absent | Install Node.js 20 or newer |
| Seal failure | A sealed file, manifest, or ledger drifted | Inspect the exact path and regenerate only from the pinned current core commit |
| Cross-repo mismatch | Wrong core commit or stale companion copy | Check out the manifest's exact merged commit and rerun `--check` |
| PDF page/hash mismatch | Wrong report generation environment or historical bytes returned | Reject the artefact; do not repair by copying from a historical tag |
| Browser status is unavailable | `/public/` route or payload problem | Verify the local server routes and keep the UI fail-closed |
| Inventory mismatch | Stale or modified compiled evidence | Re-export under the pinned Lean toolchain and investigate before publishing |


<!-- CURRENT_PUBLICATION:START -->
## M258 current publication boundary

**Complete search for proper constant and unary circuit gains**

The search now derives its candidate supports directly from the circuit and finds a strict saving whenever any proper support with zero or one incoming wire admits a smaller equivalent complete local replacement. A support is a selected set of gates; proper means some original gates remain outside it. An accepted result builds the actual replacement and preserves every ordinary output and tracked computational wire field.

A negative result excludes gains only in this zero-or-one-boundary class, not larger boundaries or smaller global circuits. The candidate-count bound is not a theorem of total polynomial encoded-input runtime, output size or certificate size. The full manuscript carrier and obligation calculus, general exact minimization, unconditional ZeroSlack and the eligible P = NP root remain open; no fixed weighted checkpoint or global gate changes.

Formal artefact coverage: 234 of 236 current scoped publication rows earned. Risk-weighted proof completion estimate: 40%. Uncertainty range: 20% to 40%. Global gates closed: 0 of 5.

This batch changes no fixed weighted checkpoint. Added publication rows do not mechanically increase the proof-completion estimate, which is neither a probability of correctness nor a time estimate. Project-specific axioms remaining: 0. The eligible root `PNP.Main.p_eq_np` is absent and the publication gate is false.

Current source: [`6296c6e1130fbae674548ccbf949f6e608b996c7`](https://github.com/aisknab/pnp/tree/6296c6e1130fbae674548ccbf949f6e608b996c7), tree `78648f5978d16ff5055c5b493e5bb97ff4cd7cac`. Original current review coordinate: `PNP-FORMAL-RECONSTRUCTION-STATUS-2026-09-13-258`. Inspect the [exact compiled scope and non-claim](https://github.com/aisknab/pnp/blob/6296c6e1130fbae674548ccbf949f6e608b996c7/docs/lean_wire_unary_support_search.md), the [source-bound update](../updates.html#2026-09-13-wire-unary-support-search) and the [complete current milestone ledger](../status.html).

M230 and M231 close complete Cook-Levin emission/refinement and concrete CNF-SAT NP-completeness. NP-completeness is not a deterministic polynomial-time SAT algorithm. M243 consumes that checked hardness in the still-conditional report bridge; the complete minimization-loop certificate and its existence premise remain unconstructed. Earlier named component limitations describe those standalone components and do not negate later earned results.
<!-- CURRENT_PUBLICATION:END -->
